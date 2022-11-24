#include "game/in2/in2.h"
#include "lib/betterenum/enum.h"
#include <vector>

namespace snw {
namespace state {

// NOLINTNEXTLINE
BETTER_ENUM(SectionType,
            int,
            MENU_SPLASH = 1,
            MENU_START,
            MENU_OPTIONS,
            MENU_GAME,
            CONVERSATION)

struct SectionInfo {
  SectionType type;
};

struct ClientState {
  std::vector<SectionInfo> sections;
  snw::in2::In2Context* in2Ctx;
};

} // namespace state
} // namespace snw