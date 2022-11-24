#include "lib/fmt/format.h"
#include "lib/sdl2wrapper/Logger.h"

using SDL2Wrapper::Logger;
using SDL2Wrapper::LogType;

namespace logger {
template <typename... Args> auto info(std::string_view fmt, Args&&... args) {
  const auto msg = fmt::vformat(fmt, fmt::make_format_args(args...));
  std::stringstream ss;
  ss << msg;
  Logger(LogType::INFO) << msg << Logger::endl;
}
template <typename... Args> auto debug(std::string_view fmt, Args&&... args) {
  const auto msg = fmt::vformat(fmt, fmt::make_format_args(args...));
  std::stringstream ss;
  ss << msg;
  Logger(LogType::DEBUG) << msg << Logger::endl;
}
template <typename... Args> auto warn(std::string_view fmt, Args&&... args) {
  const auto msg = fmt::vformat(fmt, fmt::make_format_args(args...));
  std::stringstream ss;
  ss << msg;
  Logger(LogType::WARN) << msg << Logger::endl;
}
template <typename... Args> auto error(std::string_view fmt, Args&&... args) {
  const auto msg = fmt::vformat(fmt, fmt::make_format_args(args...));
  std::stringstream ss;
  ss << msg;
  Logger(LogType::ERROR) << msg << Logger::endl;
}
} // namespace logger