#include "Timer.h"
#include "Logger.h"
#include "Window.h"

namespace SDL2Wrapper {
Timer::Timer(int maxTimeMs) : removeFlag(false), aggTime(0.0) {
  maxTime = static_cast<double>(maxTimeMs);
}
double Timer::getPctComplete() const {
  const double ret = aggTime / maxTime;
  if (aggTime >= maxTime) {
    return 1.0;
  } else {
    return ret;
  }
}
bool Timer::shouldRemove() const { return removeFlag; }
void Timer::restart() {
  aggTime = 0.0;
  removeFlag = false;
}
double Timer::getMs() const { return maxTime; }
void Timer::remove() { removeFlag = true; }
void Timer::update(double dt) {
  if (!removeFlag) {
    aggTime += dt;
    // Logger().get() << "What " << aggTime << " " << dt << " vs " << maxTime
    //          << Logger::endl;
    if (aggTime > maxTime) {
      remove();
    }
  }
}

FuncTimer::FuncTimer(int maxTimeMs, std::function<void()> cbA)
    : Timer(maxTimeMs), cb(cbA) {}
void FuncTimer::remove() {
  if (!removeFlag) {
    cb();
  }
  Timer::remove();
}

BoolTimer::BoolTimer(int maxTimeMs, bool& refA) : Timer(maxTimeMs), ref(refA) {}
void BoolTimer::remove() {
  if (!removeFlag) {
    ref = !ref;
  }
  Timer::remove();
}

} // namespace SDL2Wrapper