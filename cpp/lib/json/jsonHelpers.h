#pragma once
#include "json.h"

namespace jsonHelpers {
template <class T>
T getOptional(const nlohmann::json* j, const std::string& key, T d) {
  if (j->find(key) != j->end()) {
    return j->at(key);
  }
  return d;
}
} // namespace jsonHelpers
