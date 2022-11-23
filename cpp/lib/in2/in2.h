#pragma once

// #include <string>

namespace in2 {

void init();

class In2Context {
private:
  void* dukCtx = nullptr;
  void* jsonState = nullptr;

  // std::vector callbacks;

public:
  int id;
  In2Context();
  ~In2Context();
};

}; // namespace in2