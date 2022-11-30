#pragma once

#include <vector>
#include <string>

namespace snw {
namespace state {

struct ConnectedClient {
  std::string clientId;
  std::string socketId;
  std::string clientName;
  bool isConnected = false;
};

struct ServerState {
  std::vector<ConnectedClient> clients;

  // std::vector<SectionInfo> sections;
};

namespace helpers {} // namespace helpers

} // namespace state
} // namespace snw