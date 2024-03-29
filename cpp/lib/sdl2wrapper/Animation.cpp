#include "Animation.h"
#include "Logger.h"
#include "Store.h"
#include "Window.h"

#include <cmath>
#include <utility>

namespace SDL2Wrapper {

Animation::Animation()
    : name(""),
      totalDuration(0),
      timestampStart(Window::now),
      spriteIndex(0),
      loop(true) {}

Animation::Animation(const std::string& nameA, const bool loopA)
    : name(nameA),
      totalDuration(0),
      timestampStart(Window::now),
      spriteIndex(0),
      loop(loopA) {}

Animation::Animation(const Animation& a)
    : name(a.name),
      totalDuration(0),
      timestampStart(a.timestampStart),
      spriteIndex(a.spriteIndex),
      loop(a.loop),
      sprites(a.sprites) {}

Animation::~Animation() {}

Animation& Animation::operator=(const Animation& a) {
  if (this != &a) {
    sprites = a.sprites;
    name = a.name;
    totalDuration = a.totalDuration;
    loop = a.loop;
  }
  return *this;
}

bool Animation::isInitialized() const { return sprites.size() > 0; }

const std::string Animation::getCurrentSpriteName() const {
  if (spriteIndex < sprites.size()) {
    const std::string spriteName = sprites[spriteIndex].first;
    if (Store::spriteExists(spriteName)) {
      return spriteName;
    } else {
#ifdef __EMSCRIPTEN__
      Logger().get(WARN) << "Invalid spriteName=" << spriteName << " in anim=" << name
                   << Logger::endl;
      return "invisible";
#else
      Logger().get(ERROR) << "Cannot get current sprite name from anim=" << name
                    << " spriteName=" << spriteName << Logger::endl;
      throw std::string("Animation error.");
#endif
    }
  } else {
    Logger().get(WARN) << "Cannot get current sprite name because spriteIndex is out "
                    "of bounds: "
                 << spriteIndex << " (animation=" << name << ")"
                 << Logger::endl;
    return sprites[0].first;
  }
}

std::string Animation::toString() const {
  const std::string spriteName = getCurrentSpriteName();
  return name + " " + spriteName;
}

void Animation::addSprite(const std::string& spriteName,
                          const unsigned int ms) {
  if (!Store::spriteExists(spriteName)) {
    Logger().get(WARN) << "Cannot add sprite to anim.  Invalid spriteName="
                 << spriteName << " in anim=" << name << Logger::endl;
    return;
  }
  totalDuration += ms;
  std::pair<std::string, int> pair = std::make_pair(spriteName, ms);
  sprites.push_back(pair);
}

unsigned int Animation::getAnimIndex() const {
  const unsigned int numSprites = sprites.size();
  if (numSprites > 0) {
    const auto now = Window::now;
    auto offsetDuration = (now - timestampStart);
    unsigned int currentDuration = 0;
    for (unsigned int i = 0; i < numSprites; i++) {
      currentDuration += sprites[i].second;
      if (offsetDuration < currentDuration) {
        return i;
      }
    }
    return numSprites - 1;
  } else {
    return 0;
  }
}

void Animation::start() { timestampStart = Window::now; }

void Animation::update() {
  if (sprites.size()) {
    const auto now = Window::now;
    if (loop && now - timestampStart > totalDuration) {
      const auto newStart = timestampStart + totalDuration;
      spriteIndex = 0;
      start();
      if (now - newStart < totalDuration) {
        timestampStart = newStart;
      }
    }
    spriteIndex = getAnimIndex();
  }
}

AnimationDefinition::AnimationDefinition(const std::string& nameA,
                                         const bool loopA)
    : Animation(nameA, loopA) {}
AnimationDefinition::~AnimationDefinition() {}

} // namespace SDL2Wrapper
