#pragma once

#include <sstream>
#include <string>

#ifdef __vita__
#include "debugScreen.h"
#endif

namespace SDL2Wrapper {

enum LogType { DEBUG, INFO, WARN, ERROR };

class Logger {
public:
  Logger() {}
  explicit Logger(LogType type) { operator<<("[" + getLabel(type) + "] "); }
  explicit Logger(const std::string& type) { operator<<("[" + type + "] "); }
  ~Logger() {}

  static const std::string endl;
  static bool disabled;

  template <class T> Logger operator<<(const T& msg) {
    std::stringstream ss;
    ss << msg;
    printMessage(ss.str());
    return *this;
  }

  typedef Logger& (*StreamManipulator)(Logger&);
  typedef std::basic_ostream<char, std::char_traits<char>> CoutType;
  typedef CoutType& (*StandardEndLine)(CoutType&);
  Logger& operator<<(const StandardEndLine manipulate) {
    manipulateMessage(manipulate);
    return *this;
  }

  int printf(const char* format, ...);
  void printMessage(const std::string& msg);
  void manipulateMessage(const StandardEndLine m);

private:
  inline std::string getLabel(LogType type) {
    std::string label;
    switch (type) {
    case DEBUG:
      label = "DEBUG";
      break;
    case INFO:
      label = "INFO";
      break;
    case WARN:
      label = "WARN";
      break;
    case ERROR:
      label = "ERROR";
      break;
    }
    return label;
  }
};
} // namespace SDL2Wrapper
