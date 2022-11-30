#pragma once

#include <functional>
#include <string>
#include <unordered_map>
#include <vector>

namespace net {

struct ConnectionData {
  std::string socketId;
};

class Client;

class Server {
  void* serverHost = nullptr;
  bool isListening = false;
  std::unordered_map<std::string, std::string> connectedPeers;

public:
  // these are used in mock mode
  static std::vector<Client*> mockClientsConnected;
  static std::vector<std::string> mockServerMessagesToBroadcast;
  static std::vector<std::pair<std::string, std::string>>
      mockServerMessagesToProcess;

  void listen(int port);
  void broadcast(const std::string& message);
  void update(std::function<void(const std::string id, const std::string& msg)>
                  callback);
  void cleanUp();
};

} // namespace net