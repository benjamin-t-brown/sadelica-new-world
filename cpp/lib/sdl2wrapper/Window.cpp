#include "Window.h"
#include "Logger.h"
#include "Store.h"
#include "Timer.h"
#include <algorithm>
#include <sstream>
#include <stdarg.h>
#include <stdio.h>
#include <time.h>

#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include <SDL2/SDL_mixer.h>
#include <SDL2/SDL_ttf.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/html5.h>

extern "C" {
EMSCRIPTEN_KEEPALIVE
void enableSound() {
  SDL2Wrapper::Window::soundEnabled = true;
  int volumePct = SDL2Wrapper::Window::soundPercent;
  Mix_VolumeMusic((double(volumePct) / 100.0) * double(MIX_MAX_VOLUME));
  Mix_Volume(-1, (double(volumePct) / 100.0) * double(MIX_MAX_VOLUME));
  SDL2Wrapper::Logger(SDL2Wrapper::DEBUG) << "Enable sound" << Logger::endl;
}
EMSCRIPTEN_KEEPALIVE
void disableSound() {
  SDL2Wrapper::Window::soundEnabled = false;

  Mix_VolumeMusic(0);
  Mix_Volume(-1, 0);
  SDL2Wrapper::Logger(SDL2Wrapper::DEBUG) << "Disable sound" << Logger::endl;
}
EMSCRIPTEN_KEEPALIVE
void setVolume(int volumePct) {
  SDL2Wrapper::Window::soundPercent = volumePct;
  Mix_VolumeMusic((double(volumePct) / 100.0) * double(MIX_MAX_VOLUME));
  Mix_Volume(-1, (double(volumePct) / 100.0) * double(MIX_MAX_VOLUME));
  SDL2Wrapper::Logger(SDL2Wrapper::DEBUG)
      << "Set volume:" << volumePct << "%" << Logger::endl;
}
EMSCRIPTEN_KEEPALIVE
void setKeyDown(int key) {
  SDL2Wrapper::Window& window = SDL2Wrapper::Window::getGlobalWindow();
  SDL2Wrapper::Events& events = window.getEvents();
  events.keydown(key);
  SDL2Wrapper::Logger(SDL2Wrapper::DEBUG)
      << "External set key down: " << key << Logger::endl;
}
EMSCRIPTEN_KEEPALIVE
void setKeyUp(int key) {
  SDL2Wrapper::Window& window = SDL2Wrapper::Window::getGlobalWindow();
  SDL2Wrapper::Events& events = window.getEvents();
  events.keyup(key);
  SDL2Wrapper::Logger(SDL2Wrapper::DEBUG)
      << "External set key up: " << key << Logger::endl;
}

EMSCRIPTEN_KEEPALIVE
void setKeyStatus(int status) {
  SDL2Wrapper::Window& window = SDL2Wrapper::Window::getGlobalWindow();
  window.isInputEnabled = !!status;
  SDL2Wrapper::Logger(SDL2Wrapper::DEBUG)
      << "External set key status: " << window.isInputEnabled << Logger::endl;
}
}
#endif

#ifdef __vita__
#define SDL_JOYSTICK_BUTTON_CROSS 2
#define SDL_JOYSTICK_BUTTON_CIRCLE 1
#define SDL_JOYSTICK_BUTTON_SQUARE 3
#define SDL_JOYSTICK_BUTTON_TRIANGLE 4
#define SDL_JOYSTICK_BUTTON_START 11
#define SDL_JOYSTICK_BUTTON_SELECT 12
#define SDL_JOYSTICK_BUTTON_LEFT 7
#define SDL_JOYSTICK_BUTTON_RIGHT 9
#define SDL_JOYSTICK_BUTTON_UP 8
#define SDL_JOYSTICK_BUTTON_DOWN 6
#define JOYSTICK_DEAD_ZONE 8000

#define SDL_BTN_LEFT 1073741904
#define SDL_BTN_RIGHT 1073741903
#define SDL_BTN_UP 1073741906
#define SDL_BTN_DOWN 1073741905

int sdlButtonToKeyboardButton(int btn) {
  switch (btn) {
  case SDL_JOYSTICK_BUTTON_CROSS:
    return 32; // space-bar
  case SDL_JOYSTICK_BUTTON_CIRCLE:
    return 1073742049; // shift
  case SDL_JOYSTICK_BUTTON_SQUARE:
    return 122;
  case SDL_JOYSTICK_BUTTON_TRIANGLE:
    return -1;
  case SDL_JOYSTICK_BUTTON_LEFT:
    return SDL_BTN_LEFT;
  case SDL_JOYSTICK_BUTTON_RIGHT:
    return SDL_BTN_RIGHT;
  case SDL_JOYSTICK_BUTTON_UP:
    return SDL_BTN_UP;
  case SDL_JOYSTICK_BUTTON_DOWN:
    return SDL_BTN_DOWN;
  case SDL_JOYSTICK_BUTTON_SELECT:
    return -1;
  case SDL_JOYSTICK_BUTTON_START:
    return 13; // enter
  default:
    return 0;
  }
}
#endif

namespace SDL2Wrapper {

const std::string SDL2_WRAPPER_WINDOW_ERR = "SDL2_WRAPPER_WINDOW_ERR";

int Window::instanceCount = 0;
Uint64 Window::now = 0;
bool Window::soundEnabled = true;
int Window::soundPercent = 100;
bool Window::soundCanBeLoaded = true;
const double Window::targetFrameMS = 16.0;
Window* Window::globalWindow = nullptr;

void windowThrowError(const std::string& errorMessage) {
  Logger(ERROR) << errorMessage;
  throw std::string(errorMessage);
}

Window::Window() : events(*this) {
  Window::globalWindow = this;
  globalAlpha = 255;
  fps = 60;
  countedFrames = 0;
  height = 512;
  width = 512;
  firstLoop = true;
  deltaTime = 0;
  currentFontSize = 20;
  onresize = nullptr;
  soundForcedDisabled = false;
}
Window::Window(const std::string& title,
               const int widthA,
               const int heightA,
               const int windowPosX,
               const int windowPosY)
    : events(*this),
      currentFontSize(18),
      deltaTime(0),
      globalAlpha(255),
      colorkey(0) {
  Window::instanceCount++;
  firstLoop = true;
  Window::soundEnabled = true;
  createWindow(title, widthA, heightA, windowPosX, windowPosY);
  Window::globalWindow = this;
  fps = 60;
  countedFrames = 0;
  height = widthA;
  width = heightA;
  firstLoop = true;
  onresize = nullptr;
  soundEnabled = true;
  soundForcedDisabled = false;
  Logger(INFO) << "SDL2Wrapper Window initialized" << Logger::endl;
}

Window::~Window() {
  Window::instanceCount--;
  if (Window::instanceCount == 0) {
    Store::clear();
    Mix_Quit();
    IMG_Quit();
    TTF_Quit();
    SDL_Quit();
  }
  Logger(INFO) << "SDL2Wrapper Window removed" << Logger::endl;
}

Window& Window::getGlobalWindow() { return *Window::globalWindow; }

void Window::createWindow(const std::string& title,
                          const int w,
                          const int h,
                          const int xPos,
                          const int yPos) {
  SDL_Init(SDL_INIT_EVERYTHING);
  SDL_SetHint(SDL_HINT_RENDER_DRIVER, "opengl");
  TTF_Init();
  colorkey = 0x00FFFFFF;
  width = w;
  height = h;

  window = std::unique_ptr<SDL_Window, SDL_Deleter>(
      SDL_CreateWindow(
          title.c_str(), xPos, yPos, width, height, SDL_WINDOW_SHOWN),
      SDL_Deleter());
  if (window == NULL) {
    windowThrowError("Window could not be created! SDL Error: " +
                     std::string(SDL_GetError()));
    throw std::runtime_error(SDL2_WRAPPER_WINDOW_ERR);
  }
  if (!soundForcedDisabled) {
    if (Mix_OpenAudio(44100, MIX_DEFAULT_FORMAT, 2, 2048) < 0) {
      Logger(ERROR) << "SDL_mixer could not initialize! "
                    << std::string(Mix_GetError()) << Logger::endl;
      soundForcedDisabled = true;
      Window::soundCanBeLoaded = false;
    }
  }

  if (SDL_NumJoysticks() < 1) {
    Logger().printf("Warning: No joysticks connected!\n");
    joystick = nullptr;
  } else {
    joystick = std::unique_ptr<SDL_Joystick, SDL_Deleter>(SDL_JoystickOpen(0),
                                                          SDL_Deleter());
    if (joystick == NULL) {
      joystick = nullptr;
      Logger().printf(
          "Warning: Unable to open game controller! SDL Error: %s\n",
          SDL_GetError());
    }
  }

#ifdef __EMSCRIPTEN__
  renderer = std::unique_ptr<SDL_Renderer, SDL_Deleter>(
      SDL_CreateRenderer(window.get(),
                         -1,
                         SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC |
                             SDL_RENDERER_TARGETTEXTURE),
      SDL_Deleter());
#else
  renderer = std::unique_ptr<SDL_Renderer, SDL_Deleter>(
      SDL_CreateRenderer(window.get(),
                         -1,
                         SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC),
      SDL_Deleter());
#endif
  SDL_SetRenderDrawColor(renderer.get(), 0x11, 0x11, 0xFF, 0xFF);

  Store::setRenderer(renderer);
}

Events& Window::getEvents() { return events; }

SDL_Renderer& Window::getRenderer() { return *renderer; }

SDL_Window& Window::getSDLWindow() { return *window; }

void Window::setBackgroundColor(const SDL_Color& color) {
  SDL_SetRenderDrawColor(renderer.get(), color.r, color.g, color.b, color.a);
}

void Window::setCurrentFont(const std::string& fontName, const int sz) {
  currentFontName = fontName;
  currentFontSize = sz;
}
const std::string& Window::getCurrentFontName() const {
  return currentFontName;
}
int Window::getCurrentFontSize() const { return currentFontSize; }
Uint64 Window::staticGetNow() { return Window::now; }
double Window::getNow() const {
  return static_cast<double>(SDL_GetPerformanceCounter());
}
double Window::getDeltaTime() const { return deltaTime; }
double Window::getFrameRatio() const {
  double sum = 0;
  for (const double r : pastFrameRatios) {
    sum += r;
  }
  return sum / static_cast<double>(pastFrameRatios.size());
}
void Window::setAnimationFromDefinition(const std::string& name,
                                        Animation& anim) const {
  auto& a = Store::getAnimationDefinition(name);
  anim.sprites.clear();
  for (auto& pair : a.sprites) {
    anim.addSprite(pair.first, pair.second);
  }
  anim.name = a.name;
  anim.totalDuration = a.totalDuration;
  anim.loop = a.loop;

  // anim = Animation(Store::getAnimationDefinition(name));
}

const SDL_Color Window::makeColor(Uint8 r, Uint8 g, Uint8 b) const {
  SDL_Color c = {r, g, b, 255};
  return c;
}

void Window::disableSound() { Window::soundEnabled = false; }
void Window::enableSound() { Window::soundEnabled = true; }
void Window::playSound(const std::string& name) {
  if (soundForcedDisabled || !soundEnabled || !Window::soundCanBeLoaded) {
    return;
  }

  Mix_Chunk* sound = Store::getSound(name);
  const int channel = Mix_PlayChannel(-1, sound, 0);
  if (channel == -1) {
    Logger(WARN) << "Unable to play sound in channel.  sound=" << name
                 << " err=" << SDL_GetError() << Logger::endl;
    return;
  }
  Mix_Volume(channel,
             static_cast<int>(double(Window::soundPercent) / 100.0 *
                              double(MIX_MAX_VOLUME)));
  soundChannels[name] = channel;
}
void Window::stopSound(const std::string& name) {
  if (soundChannels.find(name) != soundChannels.end()) {
    const int channel = soundChannels[name];
    Mix_HaltChannel(channel);
  }
}
void Window::playMusic(const std::string& name) {
  if (soundForcedDisabled || !Window::soundCanBeLoaded) {
    return;
  }

  Mix_Music* music = Store::getMusic(name);
  if (Mix_PlayingMusic()) {
    stopMusic();
  }
  Mix_PlayMusic(music, -1);
}
void Window::stopMusic() {
  if (Mix_PlayingMusic()) {
    Mix_HaltMusic();
  }
}

SDL_Texture* Window::getTextTexture(const std::string& text,
                                    const int x,
                                    const int y,
                                    const int sz,
                                    const SDL_Color& color) {
  if (!currentFontName.size()) {
    windowThrowError("No font has been set.");
    throw std::runtime_error("");
  }

  std::stringstream keyStream;
  keyStream << text << sz << color.r << color.g << color.b;
  const std::string key = keyStream.str();
  SDL_Texture* tex = Store::getTextTexture(key);
  if (tex) {
    return tex;
  } else {
    TTF_Font* font = Store::getFont(currentFontName, sz);
    SDL_Surface* surf = TTF_RenderText_Solid(font, text.c_str(), color);
    SDL_Texture* texPtr = SDL_CreateTextureFromSurface(renderer.get(), surf);
    SDL_FreeSurface(surf);
    Store::storeTextTexture(key, texPtr);
    return Store::getTextTexture(key);
  }
}

SDL_Texture* Window::getStaticColorTexture(int width, int height, Color color) {
  std::stringstream ss;
  ss << width << "," << height << "," << color.r << "," << color.g << ","
     << color.b << "," << color.a;
  auto textureName = ss.str();
  if (Store::textureExists(textureName)) {
    return Store::getTexture(ss.str());
  }

  auto texture = SDL_CreateTexture(renderer.get(),
                                   SDL_PIXELFORMAT_RGBA32,
                                   SDL_TEXTUREACCESS_TARGET,
                                   width,
                                   height);

  SDL_SetRenderTarget(renderer.get(), texture);
  SDL_SetRenderDrawColor(renderer.get(), color.r, color.g, color.b, color.a);
  SDL_RenderClear(renderer.get());
  SDL_SetRenderTarget(renderer.get(), nullptr);
  SDL2Wrapper::Store::storeTexture(textureName, texture);

  return texture;
}

void Window::drawSprite(const std::string& name,
                        const int x,
                        const int y,
                        const bool centered,
                        const double angleDeg,
                        const std::pair<double, double> scale) {
  const Sprite& sprite = Store::getSprite(name);
  SDL_Texture* tex = sprite.image;
  SDL_SetTextureBlendMode(tex, SDL_BLENDMODE_BLEND);
  SDL_SetTextureAlphaMod(tex, globalAlpha);

  SDL_RendererFlip flip = SDL_FLIP_NONE;

  std::pair<double, double> scaleLocal = scale;

  // HACK setting negative x scale to -1.0 will flip sprite horizontally.
  if (scale.first == -1.0) {
    scaleLocal.first = 1.0;
    flip = SDL_FLIP_HORIZONTAL;
  }

  const double scaledX = double(sprite.cw) * scaleLocal.first;
  const double scaledY = double(sprite.ch) * scaleLocal.second;
  const SDL_Rect pos = {x + (centered ? -sprite.cw / 2 : 0),
                        y + (centered ? -sprite.ch / 2 : 0),
                        static_cast<int>(floor(scaledX)),
                        static_cast<int>(floor(scaledY))};
  const SDL_Rect clip = {sprite.cx, sprite.cy, sprite.cw, sprite.ch};
  SDL_SetRenderDrawBlendMode(renderer.get(), SDL_BLENDMODE_BLEND);
  SDL_RenderCopyEx(renderer.get(), tex, &clip, &pos, angleDeg, NULL, flip);
}

void Window::drawAnimation(Animation& anim,
                           const int x,
                           const int y,
                           const bool centered,
                           const bool updateAnim,
                           const double angle,
                           const std::pair<double, double> scale) {
  if (anim.isInitialized()) {
    drawSprite(anim.getCurrentSpriteName(), x, y, centered, angle, scale);
    if (updateAnim) {
      anim.update();
    }
  } else {
    windowThrowError("Anim has not been initialized: '" + anim.toString() +
                     "'");
    throw std::runtime_error(SDL2_WRAPPER_WINDOW_ERR);
  }
}

void Window::drawText(const std::string& text,
                      const int x,
                      const int y,
                      const SDL_Color& color) {
  SDL_Texture* tex = getTextTexture(text, x, y, currentFontSize, color);

  int w, h;
  SDL_QueryTexture(tex, NULL, NULL, &(w), &(h));
  SDL_SetTextureAlphaMod(tex, globalAlpha);
  const SDL_Rect pos = {x, y, w, h};
  SDL_SetRenderDrawBlendMode(renderer.get(), SDL_BLENDMODE_BLEND);
  SDL_RenderCopy(renderer.get(), tex, NULL, &pos);
}

void Window::drawTextCentered(const std::string& text,
                              const int x,
                              const int y,
                              const SDL_Color& color) {
  SDL_Texture* tex = getTextTexture(text, x, y, currentFontSize, color);

  int w, h;
  SDL_QueryTexture(tex, NULL, NULL, &(w), &(h));
  SDL_SetTextureAlphaMod(tex, globalAlpha);
  const SDL_Rect pos = {x - w / 2, y - h / 2, w, h};
  SDL_SetRenderDrawBlendMode(renderer.get(), SDL_BLENDMODE_BLEND);
  SDL_RenderCopy(renderer.get(), tex, NULL, &pos);
}

void Window::renderLoop() {
  const Uint64 nowMicroSeconds = SDL_GetPerformanceCounter();
  double freq = (double)SDL_GetPerformanceFrequency();
  now =
      static_cast<Uint64>((static_cast<double>(nowMicroSeconds) * 1000) / freq);

  if (!static_cast<bool>(freq)) {
    freq = 1;
  }
  if (firstLoop) {
    deltaTime = 16.6666;
    firstLoop = false;
    pastFrameRatios.push_back(1.0);
  } else {
    deltaTime = static_cast<double>((nowMicroSeconds - lastFrameTime) *
                                    static_cast<Uint64>(1000 / freq));
  }
  lastFrameTime = nowMicroSeconds;
  const double d = deltaTime / Window::targetFrameMS;
  pastFrameRatios.push_back(std::min(d, 2.0));
  if (pastFrameRatios.size() > 10) {
    pastFrameRatios.pop_front();
  }

  SDL_Event e;
  while (SDL_PollEvent(&e) != 0) {
#ifdef __EMSCRIPTEN__
    if (e.type == SDL_QUIT) {
      Logger(WARN) << "QUIT is overridden in EMSCRIPTEN" << Logger::endl;
      break;
    }
#else
    if (e.type == SDL_QUIT) {
      isLooping = false;
      break;
    } else if (e.window.event == SDL_WINDOWEVENT_FOCUS_GAINED) {
      break;
    } else if (e.window.event == SDL_WINDOWEVENT_FOCUS_LOST) {
      break;
    }
#endif

#ifdef __vita__
    if (e.type == SDL_JOYBUTTONDOWN) {
      if (isInputEnabled) {
        int keyValue = e.jbutton.button;
        int buttonValue = sdlButtonToKeyboardButton(keyValue);
        if (buttonValue > 0) {
          events.keydown(buttonValue);
        }
      }
    } else if (e.type == SDL_JOYBUTTONUP) {
      if (isInputEnabled) {
        int keyValue = e.jbutton.button;
        int buttonValue = sdlButtonToKeyboardButton(keyValue);
        if (buttonValue > 0) {
          events.keyup(buttonValue);
        }
      }
    } else if (e.type == SDL_JOYAXISMOTION) {
      if (isInputEnabled) {
        // Motion on controller 0
        if (e.jaxis.which == 0) {
          // X axis motion
          if (e.jaxis.axis == 0) {
            if (e.jaxis.value < -JOYSTICK_DEAD_ZONE) {
              if (deadZoneXDir != -1) {
                events.keydown(SDL_BTN_LEFT);
                deadZoneXDir = -1;
              }
            } else if (e.jaxis.value > JOYSTICK_DEAD_ZONE) {
              if (deadZoneXDir != 1) {
                events.keydown(SDL_BTN_RIGHT);
                deadZoneXDir = 1;
              }
            } else {
              if (deadZoneXDir != 0) {
                if (events.isKeyPressed("Left")) {
                  events.keyup(SDL_BTN_LEFT);
                }
                if (events.isKeyPressed("Right")) {
                  events.keyup(SDL_BTN_RIGHT);
                }
                deadZoneXDir = 0;
              }
            }
          } // Y axis motion
          else if (e.jaxis.axis == 1) {
            if (e.jaxis.value < -JOYSTICK_DEAD_ZONE) {
              if (deadZoneYDir != 1) {
                events.keydown(SDL_BTN_DOWN);
                deadZoneYDir = 1;
              }
            } else if (e.jaxis.value > JOYSTICK_DEAD_ZONE) {
              if (deadZoneXDir != -1) {
                events.keydown(SDL_BTN_UP);
                deadZoneYDir = -1;
              }
            } else {
              if (deadZoneYDir != 0) {
                if (events.isKeyPressed("Down")) {
                  events.keyup(SDL_BTN_DOWN);
                }
                if (events.isKeyPressed("Up")) {
                  events.keyup(SDL_BTN_UP);
                }
                deadZoneYDir = 0;
              }
            }
          }
        }
      }
    }
#else
    else if (e.type == SDL_KEYDOWN) {
      if (isInputEnabled) {
        events.keydown(e.key.keysym.sym);
      }
    } else if (e.type == SDL_KEYUP) {
      if (isInputEnabled) {
        events.keyup(e.key.keysym.sym);
      }
    } else if (e.type == SDL_MOUSEMOTION) {
      if (isInputEnabled) {
        int x, y;
        SDL_GetMouseState(&x, &y);
        events.mousemove(x, y);
      }
    } else if (e.type == SDL_MOUSEBUTTONDOWN) {
      if (isInputEnabled) {
        int x, y;
        SDL_GetMouseState(&x, &y);
        events.mousedown(x, y, (int)e.button.button);
      }
    } else if (e.type == SDL_MOUSEBUTTONUP) {
      if (isInputEnabled) {
        int x, y;
        SDL_GetMouseState(&x, &y);
        events.mouseup(x, y, (int)e.button.button);
      }
    }
    if (e.type == SDL_MOUSEWHEEL) {
      events.wheel = e.wheel.y;
    } else {
      events.wheel = 0;
    }
    events.handleEvent(e);
    // ImGui_ImplSDL2_ProcessEvent(&e);
#endif
  }
  if (!isLooping) {
    return;
  }

  SDL_RenderClear(renderer.get());
  isLooping = renderCb();
  events.update();
  SDL_RenderPresent(renderer.get());
  firstLoop = false;
}

#ifdef __EMSCRIPTEN__
void RenderLoopCallback(void* arg) { static_cast<Window*>(arg)->renderLoop(); }
#endif
void Window::startRenderLoop(std::function<bool(void)> cb) {
  firstLoop = true;
  renderCb = cb;
  isLooping = true;
  Window::now = SDL_GetPerformanceCounter();

#ifdef __EMSCRIPTEN__
  // Receives a function to call and some user data to provide it.
  emscripten_set_main_loop_arg(&RenderLoopCallback, this, -1, 1);
#else
  while (isLooping) {
    if (shouldRender) {
      renderLoop();
    } else {
      SDL_Delay(10);
    }
  }
#endif
}
} // namespace SDL2Wrapper