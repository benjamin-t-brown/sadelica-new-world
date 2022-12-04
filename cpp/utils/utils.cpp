#include "utils.h"
#include "lib/imgui/imgui.h"
#include "lib/imgui/imgui_impl_sdl.h"
#include "lib/imgui/imgui_impl_sdlrenderer.h"
#include "lib/sdl2wrapper/Window.h"
#include "ui/Ui.h"
#include <SDL2/SDL.h>
#include <algorithm>
#include <sstream>
#include <vector>

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

std::string getRandomId(int len) {
  const std::vector<char> options = {'0',
                                     '1',
                                     '2',
                                     '3',
                                     '4',
                                     '5',
                                     '6',
                                     '7',
                                     '8',
                                     '9',
                                     'a',
                                     'b',
                                     'c',
                                     'd',
                                     'e',
                                     'f',
                                     'g'};
  std::stringstream ss;

  for (int i = 0; i < len; i++) {
    int ind = rand() % static_cast<int>(options.size());
    ss << options[ind];
    if (i > 0 && i % (len / 2) == 0) {
      ss << '-';
    }
  }

  return ss.str();
}

} // namespace utils