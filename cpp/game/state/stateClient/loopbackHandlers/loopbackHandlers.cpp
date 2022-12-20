#include "loopbackHandlers.h"

#include "handlerLoopConnection.cc"
#include "handlerLoopIn2.cc"

namespace snw {
namespace state {
void initLoopbackHandlers(ClientLoopbackProcessor& p) {
  initIn2Handlers(p);
  initConnectionLoopbackHandlers(p);
}
} // namespace state
} // namespace snw