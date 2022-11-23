#pragma once

namespace SDL2Wrapper {

class Window;

class Gauge {
protected:
  double aggTime;
  double maxTime;

public:
  Gauge(int maxFrames);
  double getPctFull() const;
  bool isFull() const;
  void setMs(int ms);
  void empty();
  void fill(double dt);
};

} // namespace SDL2Wrapper
