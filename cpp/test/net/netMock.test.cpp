#include "lib/net/client.h"
#include "lib/net/server.h"
#include "logger.h"
#include <gtest/gtest.h>

class NetMockTest : public testing::Test {
protected:
  static void SetUpTestSuite() { Logger::disabled = true; }
  static void TearDownTestSuite() {}
  void SetUp() override {
    Logger::disabled = true;
    // since mock server connected clients is static need to clear it here or
    // other tests interfere with it.
    net::Server::mockClientsConnected.clear();
  }
  void TearDown() override {
    net::Server::mockClientsConnected.clear();
    net::Server::mockServerMessagesToProcess.clear();
    net::Server::mockServerMessagesToBroadcast.clear();
  }
};

TEST_F(NetMockTest, CanSendAndReceiveMessagesBetweenServerAndClient) {
  net::Server server;
  net::Client client;

  server.listen(1234);
  client.connect("", 1234);

  auto noopServer = [](const std::string id, const std::string msg) {};
  auto noopClient = [](const std::string msg) {};

  server.broadcast("Test message1");
  server.update(noopServer);
  client.update([](const std::string msg) { EXPECT_EQ(msg, "Test message1"); });

  client.send("Test message2");
  server.update([](const std::string id, const std::string msg) {
    EXPECT_EQ(msg, "Test message2");
  });
  client.update(noopClient);

  server.broadcast("Test message3");
  server.broadcast("Test message4");
  int ctr = 0;
  server.update(noopServer);
  client.update([&](const std::string msg) {
    if (ctr == 0) {
      EXPECT_EQ(msg, "Test message3");
    }
    if (ctr == 1) {
      EXPECT_EQ(msg, "Test message4");
    }
    ctr++;
  });

  client.send("Test message5");
  client.send("Test message5");
  server.update([&](const std::string id, const std::string msg) {
    if (ctr == 2) {
      EXPECT_EQ(msg, "Test message3");
    }
    if (ctr == 3) {
      EXPECT_EQ(msg, "Test message4");
    }
    ctr++;
  });
  client.update(noopClient);
}

TEST_F(NetMockTest, CanHandleTwoClients) {
  net::Server server;
  net::Client client1;
  net::Client client2;

  server.listen(1234);
  client1.connect("", 1234);
  client2.connect("", 1234);

  server.broadcast("Blarg");

  auto noopServer = [](const std::string id, const std::string msg) {};
  auto noopClient = [](const std::string msg) {};

  EXPECT_EQ(server.mockClientsConnected.size(), 2);
  server.update(noopServer);
  client1.update([](const std::string msg) { EXPECT_EQ(msg, "Blarg"); });
  client2.update([](const std::string msg) { EXPECT_EQ(msg, "Blarg"); });
}
