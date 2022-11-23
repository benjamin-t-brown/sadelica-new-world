#include "Logger.h"

#include <iostream>
#include <sstream>
#include <stdarg.h>
#include <stdio.h>
#include <time.h>

#ifdef __vita__
#include "debugScreen.h"
#endif

namespace SDL2Wrapper {

const std::string Logger::endl = std::string("\n");

void Logger::printMessage(const std::string& msg) {
#ifdef __vita__
  printf("%s", msg.c_str());
#else
  std::cout << msg;
#endif
}

void Logger::manipulateMessage(const StandardEndLine m) {
#ifdef __vita__
  printf("\n");
#else
  m(std::cout);
#endif
}

int Logger::printf(const char* c, ...) {
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
} // namespace SDL2Wrapper
