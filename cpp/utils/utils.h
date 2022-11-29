#pragma once

#include <string>
#include <vector>

namespace utils {

// NOLINTNEXTLINE(cppcoreguidelines-avoid-c-arrays)
void parseArgs(int argc, char* argv[], std::vector<std::string>& args);
bool includes(const std::string& arg, const std::vector<std::string>& args);
std::string join(const std::vector<std::string>& arr, const std::string& delim);
std::string getRandomId(int len = 10);

} // namespace utils