#include "utils.h"
#include <algorithm>
#include <sstream>

namespace utils {
// NOLINTNEXTLINE(cppcoreguidelines-avoid-c-arrays)
void parseArgs(int argc, char* argv[], std::vector<std::string>& args) {
  for (int i = 0; i < argc; i++) {
    // NOLINTNEXTLINE(cppcoreguidelines-pro-bounds-pointer-arithmetic)
    std::string arg = argv[i];
    if (arg.size() > 2 && arg.at(0) == '-' && arg.at(1) == '-') {
      arg = arg.substr(2);
      args.push_back(arg);
    }
  }
}

bool includes(const std::string& arg, const std::vector<std::string>& args) {
  if (std::find(args.begin(), args.end(), arg) != args.end()) {
    return true;
  } else {
    return false;
  }
}

std::string join(const std::vector<std::string>& arr,
                 const std::string& delim) {
  std::stringstream ss;
  const int sz = static_cast<int>(arr.size());
  for (int i = 0; i < sz; i++) {
    ss << arr[i];
    if (i < sz - 1) {
      ss << delim;
    }
  }
  return ss.str();
}

} // namespace utils