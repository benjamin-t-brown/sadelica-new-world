#include "lib/net/server.h"
#include "lib/sdl2wrapper/Timer.h"
#include "lib/sdl2wrapper/Window.h"
#include "logger.h"
#include "utils/utils.h"
#include <string>

constexpr const int PORT = 7777;

int main() {
  net::Server server;

  server.listen(PORT);
  logger::info("Server listening at %i", PORT);

  SDL2Wrapper::Window window;

  bool shouldSend = false;
  SDL2Wrapper::BoolTimer timer = SDL2Wrapper::BoolTimer(1000, shouldSend);

  window.startTimedLoop(
      [&]() {
        server.update(
            [&](const std::string& socketId, const std::string& payload) {
              logger::info("Got a packet containing '%s' from %s",
                           payload.c_str(),
                           socketId.c_str());
              server.broadcast("This is an example response");
            });
        timer.update(window.getDeltaTime());

        if (shouldSend) {
          logger::info("Send!");
          server.broadcast("Broadcast!");
          timer.restart();
          shouldSend = false;
        }

        return true;
      },
      16);

  server.cleanUp();

  return 0;
}
