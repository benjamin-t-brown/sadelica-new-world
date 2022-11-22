#include <fstream>
#include <sstream>

#include "Logging.h"

namespace in2 {
constexpr const char* IN2_CORE_SRC_PATH = "assets/in2/core.js";
constexpr const char* IN2_COMPILED_SRC_PATH = "assets/in2/main.compiled.js";

std::string in2CoreSrc = "";
std::string in2CompiledSrc = "";

void readIn2CoreSrc() {
  Logger() << "Reading in2 core src from " << IN2_CORE_SRC_PATH << Logger::endl;
  const std::ifstream src(IN2_CORE_SRC_PATH);

  std::stringstream buffer;
  buffer << src.rdbuf();
  in2CoreSrc = buffer.str();

  Logger() << "Got src" << in2CoreSrc << Logger::endl;
}

const std::string& getIn2CoreSrc() { return in2CoreSrc; }

void readIn2CompiledSrc() {
  Logger() << "Reading in2 compiled src from " << IN2_COMPILED_SRC_PATH
           << Logger::endl;
  const std::ifstream src(IN2_COMPILED_SRC_PATH);

  std::stringstream buffer;
  buffer << src.rdbuf();
  in2CompiledSrc = buffer.str();

  Logger() << "Got src" << in2CompiledSrc << Logger::endl;
}

const std::string& getIn2CompiledSrc() { return in2CompiledSrc; }

}; // namespace in2