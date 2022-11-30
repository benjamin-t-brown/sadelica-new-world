#include "loopbackHandlers.h"

#include "connectionLoopbackHandlers.cc"
#include "in2LoopHandlers.cc"

namespace snw {
namespace state {
void initLoopbackHandlers(ClientLoopbackProcessor& p) {
  initIn2Handlers(p);
  initConnectionLoopbackHandlers(p);
}
} // namespace state
} // namespace snw