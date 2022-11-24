#include "lib/betterenum/enum.h"
#include <vector>

namespace SNW {
namespace State {

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
};

} // namespace State
} // namespace SNW