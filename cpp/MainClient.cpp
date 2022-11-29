#include "lib/net/client.h"
#include "lib/sdl2wrapper/Window.h"
#include "logger.h"
#include <enet/enet.h>
#include <stdio.h>

constexpr const char* HOST = "127.0.0.1";
constexpr const int PORT = 7777;

int main() {
  net::Client client;

  logger::info("Connecting to  %s:%i", HOST, PORT);
  client.connect(HOST, PORT);

  logger::info("Connected! Sending test message.");
  client.send("This is a test message");

  SDL2Wrapper::Window window;

  window.startTimedLoop(
      [&]() {
        client.update([](const std::string& message) {
          logger::info("Got a message: %s", message.c_str());
        });
        return true;
      },
      16);

  client.cleanUp();

  return 0;
}
