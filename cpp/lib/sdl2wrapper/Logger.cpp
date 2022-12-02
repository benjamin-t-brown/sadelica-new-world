#include "Logger.h"
#include <stdarg.h>
#include <stdio.h>

#ifdef __vita__
#include "debugScreen.h"
#endif

namespace SDL2Wrapper {

const std::string Logger::endl = std::string("\n");
bool Logger::disabled = false;
bool Logger::colorEnabled = true;

std::ostringstream& Logger::get(LogType level) {
  os << getLabel(level);
  return os;
}
std::string Logger::getLabel(LogType type) {
  std::string label;
  switch (type) {
  case DEBUG:
    label = "{ DEBUG } ";
    if (Logger::colorEnabled) {
      label = "\033[36m" + label + "\033[0m";
    }
    break;
  case INFO:
    label = "{ INFO  } ";
    if (Logger::colorEnabled) {
      label = "\033[32m" + label + "\033[0m";
    }
    break;
  case WARN:
    label = "{ WARN  } ";
    if (Logger::colorEnabled) {
      label = "\033[33m" + label + "\033[0m";
    }
    break;
  case ERROR:
    label = "{ ERROR } ";
    if (Logger::colorEnabled) {
      label = "\033[31m" + label + "\033[0m";
    }
    break;
  }
  return label;
}
Logger::~Logger() {
  if (!Logger::disabled) {
    fprintf(stdout, "%s", os.str().c_str());
    fflush(stdout);
  }
}

// void Logger::printMessage(const std::string& msg) {
//   if (Logger::disabled) {
//     return;
//   }

//   printf("%s", msg.c_str());
// }

// // Logger operator<<(Logger& l, const std::string& msg) {
// //   std::stringstream ss;
// //   ss << msg;
// //   l.printMessage(ss.str());
// //   return l;
// // }
// // Logger operator<<(Logger& l, const char msg) {
// //   std::stringstream ss;
// //   ss << msg;
// //   l.printMessage(ss.str());
// //   return l;
// // }
// // Logger operator<<(Logger& l, const int msg) {
// //   std::stringstream ss;
// //   ss << msg;
// //   l.printMessage(ss.str());
// //   return l;
// // }
// // Logger operator<<(Logger& l, const double msg) {
// //   std::stringstream ss;
// //   ss << msg;
// //   l.printMessage(ss.str());
// //   return l;
// // }

// void Logger::manipulateMessage(const StandardEndLine m) {
//   if (Logger::disabled) {
//     return;
//   }
//   printf("\n");
//   // Removing this to get rid of iostream
//   // #ifdef __vita__
//   //   printf("\n");
//   // #else
//   //   m(std::cout);
//   // #endif
// }

// // template <class T> Logger operator<<(Logger& l, const T& msg) {
// //   // clang-tidy bug? It keeps saying this can be const, but obviously it
// //   can't
// //   // NOLINTNEXTLINE(misc-const-correctness)
// //   std::stringstream ss;
// //   ss << msg;
// //   l.printMessage(ss.str());
// //   return l;
// // }

// std::string Logger::getLabel(LogType type) {
//   std::string label;
//   switch (type) {
//   case DEBUG:
//     label = "{DEBUG} ";
//     if (Logger::colorEnabled) {
//       label = "\033[36m" + label + "\033[0m";
//     }
//     break;
//   case INFO:
//     label = "{INFO} ";
//     if (Logger::colorEnabled) {
//       label = "\033[32m" + label + "\033[0m";
//     }
//     break;
//   case WARN:
//     label = "{WARN} ";
//     if (Logger::colorEnabled) {
//       label = "\033[33m" + label + "\033[0m";
//     }
//     break;
//   case ERROR:
//     label = "{ERROR} ";
//     if (Logger::colorEnabled) {
//       label = "\033[31m" + label + "\033[0m";
//     }
//     break;
//   }
//   return label;
// }

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
