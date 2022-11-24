#pragma once

#include <string>
#include <vector>

namespace utils {

// NOLINTNEXTLINE(cppcoreguidelines-avoid-c-arrays)
void parseArgs(int argc, char* argv[], std::vector<std::string>& args);
bool includes(const std::string& arg, const std::vector<std::string>& args);

} // namespace utils