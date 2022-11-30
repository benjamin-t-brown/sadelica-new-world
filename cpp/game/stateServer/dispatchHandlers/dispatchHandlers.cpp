#include "dispatchHandlers.h"

#include "connectionSrvHandlers.cc"
#include "in2SrvHandlers.cc"

namespace snw {
namespace state {
void initDispatchHandlers(ServerDispatchProcessor& p) {
  initIn2SrvHandlers(p);
  initConnectionSrvHandlers(p);
}
} // namespace state
} // namespace snw