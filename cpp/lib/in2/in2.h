#pragma once

#include <string>

namespace in2 {

static std::string IN2_SRC_CORE_PATH;
static std::string in2CoreSrc;
static std::string in2CompiledSrc;

void readIn2CoreSrc();
const std::string& getIn2CoreSrc();

void readIn2CompiledSrc();
const std::string& getIn2CompiledSrc();

}; // namespace in2