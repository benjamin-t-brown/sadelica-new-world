#include "lib/net/client.h"
#include "lib/net/server.h"
#include "logger.h"
#include <gtest/gtest.h>

class NetMockTest : public testing::Test {
protected:
  static void SetUpTestSuite() { Logger::disabled = true; }
  static void TearDownTestSuite() {}
  void SetUp() override { Logger::disabled = true; }
  void TearDown() override {}
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
