#pragma once

#include <functional>

namespace SDL2Wrapper {
class Timer {

protected:
  bool removeFlag;
  double aggTime;
  double maxTime;

public:
  Timer(int maxFrames);
  double getPctComplete() const;
  void restart();
  virtual bool shouldRemove() const;
  virtual void remove();
  virtual void update(double dt);
};

class FuncTimer : public Timer {
  std::function<void()> cb;

public:
  FuncTimer(int maxFrames, std::function<void()> cbA);
  void remove() override;
};

class BoolTimer : public Timer {
  bool& ref;

public:
  BoolTimer(int maxFrames, bool& refA);
  void remove() override;
};

} // namespace SDL2Wrapper
