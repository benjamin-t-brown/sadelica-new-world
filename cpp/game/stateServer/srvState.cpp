#include "srvState.h"
#include "game/actions.h"
#include "game/in2/in2.h"
#include "logger.h"
#include "utils/utils.h"

namespace snw {
namespace state {
namespace helpers {

unsigned int clientIdToIndex(ClientId clientId) {
  if (clientId == ClientId::PLAYER1) {
    return 0;
  } else if (clientId == ClientId::PLAYER2) {
    return 1;
  } else {
    logger::error(
        "Invalid conversion to index from clientId=%i (defaulting to PLAYER1)",
        clientId);
    return 0;
  }
}

} // namespace helpers
} // namespace state
} // namespace snw