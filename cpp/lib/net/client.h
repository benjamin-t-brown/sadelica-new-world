#pragma once

#include <functional>
#include <string>
#include <vector>

namespace net {

class Client {
  void* clientHost = nullptr;
  void* clientPeer = nullptr;
  bool connected = false;

public:
  std::vector<std::string> mockClientMessagesToSend;
  std::vector<std::string> mockClientMessagesToProcess;

  bool connect(const std::string& host, int port);
  void send(const std::string& message);

  void update(std::function<void(const std::string& msg)> cb);
  bool isConnected();
  void cleanUp();
};

} // namespace net