#pragma once

#include "lib/fmt/format.h"
#include "lib/sdl2wrapper/Logger.h"
#include <sstream>
#include <stdarg.h>

using SDL2Wrapper::Logger;
using SDL2Wrapper::LogType;

namespace logger {

// template <class... Args> void info(std::string_view f, Args... args);

// template <class... Args> void debug(std::string_view f, Args... args);

// template <class... Args> void warn(std::string_view f, Args... args);

// template <class... Args> void error(std::string_view f, Args... args);

// template <class... Args> void info(std::string_view f, Args... args) {
//   const auto msg = fmt::vformat(f, fmt::make_format_args(args...));
//   Logger(LogType::INFO) << msg << Logger::endl;
// }

// template <class... Args> void debug(std::string_view f, Args... args) {
//   const auto msg = fmt::vformat(f, fmt::make_format_args(args...));
//   Logger(LogType::DEBUG) << msg << Logger::endl;
// }

// template <class... Args> void warn(std::string_view f, Args... args) {
//   const auto msg = fmt::vformat(f, fmt::make_format_args(args...));
//   Logger(LogType::WARN) << msg << Logger::endl;
// }

// template <class... Args> void error(std::string_view f, Args... args) {
//   const auto msg = fmt::vformat(f, fmt::make_format_args(args...));
//   Logger(LogType::ERROR) << msg << Logger::endl;
// }

inline void args(va_list lst, const char* c, std::stringstream& ss) {
  while (*c != '\0') {
    if (*c != '%') {
      ss << *c;
      // NOLINTNEXTLINE
      c++;
      continue;
    }
    // NOLINTNEXTLINE
    c++;
    if (*c == '%') {
      ss << '%';
      // NOLINTNEXTLINE
      c++;
      continue;
    }
    switch (*c) {
    case 's':
      ss << va_arg(lst, char*);
      break;
    case 'i':
    case 'c':
      ss << va_arg(lst, int);
      break;
    case 'd':
      ss << va_arg(lst, double);
      break;
    }
    // NOLINTNEXTLINE
    c++;
  }
}

inline void info(const char* c, ...) {
  std::stringstream ss;
  va_list lst;
  va_start(lst, c);
  args(lst, c, ss);
  va_end(lst);
  Logger(LogType::INFO) << ss.str() << Logger::endl;
}

inline void error(const char* c, ...) {
  std::stringstream ss;
  va_list lst;
  va_start(lst, c);
  args(lst, c, ss);
  va_end(lst);
  Logger(LogType::ERROR) << ss.str() << Logger::endl;
}

inline void debug(const char* c, ...) {
  std::stringstream ss;
  va_list lst;
  va_start(lst, c);
  args(lst, c, ss);
  va_end(lst);
  Logger(LogType::DEBUG) << ss.str() << Logger::endl;
}

inline void warn(const char* c, ...) {
  std::stringstream ss;
  va_list lst;
  va_start(lst, c);
  args(lst, c, ss);
  va_end(lst);
  Logger(LogType::WARN) << ss.str() << Logger::endl;
}

// These are ungodly slow to compile
// template <typename... Args> auto info(std::string_view fmt, Args&&... args) {
//   const auto msg = fmt::vformat(fmt, fmt::make_format_args(args...));
//   std::stringstream ss;
//   ss << msg;
//   Logger(LogType::INFO) << msg << Logger::endl;
// }

// template <typename... Args> auto debug(std::string_view fmt, Args&&... args)
// {
//   const auto msg = fmt::vformat(fmt, fmt::make_format_args(args...));
//   std::stringstream ss;
//   ss << msg;
//   Logger(LogType::DEBUG) << msg << Logger::endl;
// }
// template <typename... Args> auto warn(std::string_view fmt, Args&&... args) {
//   const auto msg = fmt::vformat(fmt, fmt::make_format_args(args...));
//   std::stringstream ss;
//   ss << msg;
//   Logger(LogType::WARN) << msg << Logger::endl;
// }
// template <typename... Args> auto error(std::string_view fmt, Args&&... args)
// {
//   const auto msg = fmt::vformat(fmt, fmt::make_format_args(args...));
//   std::stringstream ss;
//   ss << msg;
//   Logger(LogType::ERROR) << msg << Logger::endl;
// }
} // namespace logger