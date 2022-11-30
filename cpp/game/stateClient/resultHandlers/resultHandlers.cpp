#include "resultHandlers.h"

#include "connectionResultHandlers.cc"
#include "in2ResultHandlers.cc"

namespace snw {
namespace state {
void initResultHandlers(ClientResultProcessor& p) {
  initIn2ResultHandlers(p);
  initConnectionResultHandlers(p);
}
} // namespace state
} // namespace snw