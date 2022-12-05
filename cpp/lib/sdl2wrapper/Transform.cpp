#include "Transform.h"

namespace SDL2Wrapper {

double easeOut(double t, double b, double c, double d) {
  auto t2 = t / d;
  return -c * t2 * (t2 - 2) + b;
}
double normalize(double x, double a, double b, double c, double d) {
  return c + ((x - a) * (d - c)) / (b - a);
}
double normalizeClamp(double x, double a, double b, double c, double d) {
  auto n = normalize(x, a, b, c, d);
  if (n > d) {
    n = d;
  } else if (n < c) {
    n = c;
  }
  return n;
}
double normalizeEaseOut(double x, double a, double b, double c, double d) {
  auto t = normalize(x, a, b, 0, 1);
  return easeOut(t, c, d - c, 1);
}
double normalizeEaseOutClamp(double x, double a, double b, double c, double d) {
  auto t = normalizeClamp(x, a, b, 0, 1);
  return easeOut(t, c, d - c, 1);
}

Transform::Transform(int ms,
                     double x1A,
                     double y1A,
                     double z1A,
                     double x2A,
                     double y2A,
                     double z2A)
    : timer(Timer(ms)), x1(x1A), y1(y1A), z1(z1A), x2(x2A), y2(y2A), z2(z2A) {}

std::vector<double> Transform::getStart() {
  return std::vector<double>{x1, y1, z1};
}

std::vector<double> Transform::getEnd() {
  return std::vector<double>{x2, y2, z2};
}
std::vector<double> Transform::getCurrent() {
  auto pct = timer.getPctComplete();

  const double offsetX = 0;
  const double offsetY = 0;
  const double offsetZ = 0;

  return std::vector<double>{
      normalizeClamp(pct, 0, 1, x1, x2) + offsetX,
      normalizeClamp(pct, 0, 1, y1, y2) + offsetY,
      normalizeClamp(pct, 0, 1, z1, z2) + offsetZ,
  };
}

Transform Transform::createInverse() {
  return Transform{static_cast<int>(timer.getMs()), x2, y2, z2, x1, y1, z1};
}

void Transform::update(double dt) { timer.update(dt); }

} // namespace SDL2Wrapper