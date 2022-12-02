#include "dispatchHandlers.h"

#include "handlerDispatchConnection.cc"
#include "handlerDispatchIn2.cc"

namespace snw {
namespace state {
void initDispatchHandlers(ServerDispatchProcessor& p) {
  initIn2SrvHandlers(p);
  initConnectionSrvHandlers(p);
}
} // namespace state
} // namespace snw