#pragma once

#include <functional>
#include <string>
#include <unordered_map>
#include <vector>

namespace net {

struct ConnectionData {
  std::string socketId;
};

class Client {
  void* clientHost = nullptr;
  void* clientPeer = nullptr;
  bool isConnected = false;

public:
  static std::vector<std::string> mockClientMessagesToProcess;
  static std::vector<std::pair<std::string, std::string>>
      mockServerMessagesToProcess;

  bool connect(const std::string& host, int port);
  void send(const std::string& message);

  void
  update(std::function<void(const std::string& msg)> cb);
  void cleanUp();
};

} // namespace net