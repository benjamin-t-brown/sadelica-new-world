#include "resultHandlers.h"

#include "handlerResultConnection.cc"
#include "handlerResultIn2.cc"

namespace snw {
namespace state {
void initResultHandlers(ClientResultProcessor& p) {
  initIn2ResultHandlers(p);
  initConnectionResultHandlers(p);
}
} // namespace state
} // namespace snw