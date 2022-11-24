#include "Logger.h"
#include "lib/fmt/format.h"
#include <iostream>
#include <sstream>
#include <stdarg.h>
#include <stdio.h>

#ifdef __vita__
#include "debugScreen.h"
#endif

namespace SDL2Wrapper {

const std::string Logger::endl = std::string("\n");
bool Logger::disabled = false;

// template <class T> Logger operator<<(const T& msg) {
//   std::stringstream ss;
//   ss << msg;
//   printMessage(ss.str());
//   return *this;
// }

// template <class T> Logger operator<<(const T& msg, const Logger& f) {
//   if (Logger::disabled) {
//     return f;
//   }
//   std::stringstream ss;
//   ss << msg;
// #ifdef __vita__
//   printf("%s", msg.c_str());
// #else
//   std::cout << msg;
// #endif
//   return f;
// }

void Logger::printMessage(const std::string& msg) {
  if (Logger::disabled) {
    return;
  }
#ifdef __vita__
  printf("%s", msg.c_str());
#else
  std::cout << msg;
#endif
}

void Logger::manipulateMessage(const StandardEndLine m) {
  if (Logger::disabled) {
    return;
  }
#ifdef __vita__
  printf("\n");
#else
  m(std::cout);
#endif
}

int Logger::printf(const char* c, ...) {
  if (Logger::disabled) {
    return 0;
  }
#ifdef __vita__
  va_list lst;
  va_start(lst, c);
  psvDebugScreenPrintf(c, lst);
  va_end(lst);
#else
  char* s;
  va_list lst;
  va_start(lst, c);
  while (*c != '\0') {
    if (*c != '%') {
      putchar(*c);
      // NOLINTNEXTLINE
      c++;
      continue;
    }
    // NOLINTNEXTLINE
    c++;
    switch (*c) {
    case 's':
      fputs(va_arg(lst, char*), stdout);
      break;
    case 'c':
      putchar(va_arg(lst, int));
      break;
    }
    // NOLINTNEXTLINE
    c++;
  }
  va_end(lst);
  return 0;
#endif
}

// int Logger::printf2(const char* fmt, ...) {
//   va_list args;
//   va_start(args, fmt);
//   // auto view = fmt::string_view(fmt);
//   // printf("FMT %s\n", fmt::format("something"));
//   fmt::print(fmt);
//   // fmt::print(view, args);
//   va_end(args);
// }
} // namespace SDL2Wrapper
