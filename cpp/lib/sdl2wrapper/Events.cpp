#include "Events.h"
#include "Logger.h"
#include <SDL2/SDL.h>

namespace SDL2Wrapper {

auto SDL2WRAPPER_EVENTS_NO_EVENT = [](SDL_Event e) {};

EventRoute::EventRoute() {
  onmousedown = [](int, int) {};
  onmouseup = [](int, int) {};
  onmousemove = [](int, int) {};
  onkeydown = [](const std::string&) {};
  onkeyup = [](const std::string&) {};
  onkeypress = [](const std::string&) {};
}

Events::Events(Window& windowA)
    : window(windowA),
      shouldPushRoute(false),
      shouldPopRoute(false),
      isMouseDown(false),
      isRightMouseDown(false),
      mouseX(0),
      mouseY(0),
      mouseDownX(0),
      mouseDownY(0),
      wheel(0),
      cb(SDL2WRAPPER_EVENTS_NO_EVENT) {
  pushRoute();
}

Events::~Events() {}

bool Events::isKeyPressed(const std::string& name) const {
  if (keys.find(name) == keys.end()) {
    return false;
  } else {
    return keys.at(name);
  }
}

bool Events::isCtrl() const {
  return isKeyPressed("Left Ctrl") || isKeyPressed("Right Ctrl");
}

void Events::pushRoute() { routes.push(std::make_unique<EventRoute>()); }
void Events::pushRouteNextTick() { shouldPushRoute = true; }
void Events::popRoute() {
  if (routes.size() >= 2) {
    routes.pop();
  } else if (routes.size() == 1) {
    routes.pop();
    pushRoute();
  }
}

void Events::popRouteNextTick() { shouldPopRoute = true; }

void Events::setMouseEvent(const std::string& name,
                           std::function<void(int, int)> cb) {
  std::unique_ptr<EventRoute>& route = routes.top();
  if (name == "mousedown") {
    route->onmousedown = cb;
  } else if (name == "mousemove") {
    route->onmousemove = cb;
  } else if (name == "mouseup") {
    route->onmouseup = cb;
  } else {
    Logger().get(WARN) << "[SDL2Wrapper] WARNING Cannot set mouse event named: "
                 << name << Logger::endl;
  }
}
void Events::setKeyboardEvent(const std::string& name,
                              std::function<void(const std::string&)> cb) {
  std::unique_ptr<EventRoute>& route = routes.top();
  if (name == "keydown") {
    route->onkeydown = cb;
  } else if (name == "keyup") {
    route->onkeyup = cb;
  } else if (name == "keypress") {
    route->onkeypress = cb;
  } else {
    Logger().get(WARN) << "[SDL2Wrapper] WARNING Cannot set keyboard event named: "
                 << name << Logger::endl;
  }
}

void Events::mousedown(int x, int y, int button) {
  std::unique_ptr<EventRoute>& route = routes.top();
  if (button == SDL_BUTTON_LEFT) {
    mouseDownX = x;
    mouseDownY = y;
    isMouseDown = true;
    route->onmousedown(x, y);
  } else if (button == SDL_BUTTON_RIGHT) {
    isRightMouseDown = true;
    route->onmousedown(x, y);
  }
}
void Events::mouseup(int x, int y, int button) {
  std::unique_ptr<EventRoute>& route = routes.top();
  if (button == SDL_BUTTON_LEFT) {
    route->onmouseup(x, y);
    isMouseDown = false;
  } else if (button == SDL_BUTTON_RIGHT) {
    route->onmouseup(x, y);
    isRightMouseDown = false;
  }
}
void Events::mousemove(int x, int y) {
  std::unique_ptr<EventRoute>& route = routes.top();
  mouseX = x;
  mouseY = y;
  route->onmousemove(x, y);
}
void Events::keydown(int key) {
  std::unique_ptr<EventRoute>& route = routes.top();
  const std::string k = std::string(SDL_GetKeyName(key));
  // Logger().get(DEBUG) << "SDLKEY: " << key << " " << k << Logger::endl;
  if (!keys[k]) {
    keys[k] = true;
    route->onkeydown(k);
  }
  route->onkeypress(k);
}
void Events::keyup(int key) {
  std::unique_ptr<EventRoute>& route = routes.top();
  const std::string k = std::string(SDL_GetKeyName(key));
  keys[k] = false;

  route->onkeyup(k);
}
void Events::handleEvent(SDL_Event e) { cb(e); }
void Events::setEventHandler(std::function<void(SDL_Event)> cbA) { cb = cbA; };
void Events::update() {
  if (shouldPushRoute) {
    shouldPushRoute = false;
    pushRoute();
  }
  if (shouldPopRoute) {
    shouldPopRoute = false;
    popRoute();
  }
}
} // namespace SDL2Wrapper