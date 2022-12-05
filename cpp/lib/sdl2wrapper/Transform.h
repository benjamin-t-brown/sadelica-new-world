#pragma once

#include "Timer.h"

namespace SDL2Wrapper {

class Transform {
  Timer timer;

public:
  double x1;
  double y1;
  double z1;
  double x2;
  double y2;
  double z2;

  Transform(int ms,
            double x1A = 0.0,
            double y1A = 0.0,
            double z1A = 0.0,
            double x2A = 0.0,
            double y2A = 0.0,
            double z2A = 0.0);

  std::vector<double> getStart();
  std::vector<double> getEnd();
  std::vector<double> getCurrent();

  Transform createInverse();

  void update(double dt);
};

} // namespace SDL2Wrapper