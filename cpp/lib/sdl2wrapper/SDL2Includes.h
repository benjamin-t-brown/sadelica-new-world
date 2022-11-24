#pragma once

struct SDL_Window;
struct SDL_Renderer;
struct SDL_Texture;
typedef struct _TTF_Font TTF_Font;
struct Mix_Chunk;
typedef struct _Mix_Music Mix_Music;
typedef struct _SDL_Joystick SDL_Joystick;

namespace SDL2Wrapper {
struct SDL_Deleter {
  void operator()(SDL_Window* p) const;
  void operator()(SDL_Renderer* p) const;
  void operator()(SDL_Texture* p) const;
  void operator()(TTF_Font* p) const;
  void operator()(Mix_Chunk* p) const;
  void operator()(Mix_Music* p) const;
  void operator()(SDL_Joystick* p) const;
};
} // namespace SDL2Wrapper
