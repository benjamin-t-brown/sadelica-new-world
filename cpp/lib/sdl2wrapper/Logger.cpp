#include "Logger.h"
#include <sstream>
#include <stdarg.h>
#include <stdio.h>

#ifdef __vita__
#include "debugScreen.h"
#endif

namespace SDL2Wrapper {

const std::string Logger::endl = std::string("\n");
bool Logger::disabled = false;

void Logger::printMessage(const std::string& msg) {
  if (Logger::disabled) {
    return;
  }

  printf("%s", msg.c_str());
}

void Logger::manipulateMessage(const StandardEndLine m) {
  if (Logger::disabled) {
    return;
  }
  printf("\n");
  // Removing this to get rid of iostream
  // #ifdef __vita__
  //   printf("\n");
  // #else
  //   m(std::cout);
  // #endif
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
