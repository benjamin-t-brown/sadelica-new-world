#pragma once

#include <string>

namespace snw {
namespace state {
class In2State;

namespace dispatch {

void establishConnection(const std::string& playerName);
void unEstablishConnection();
void startTalk(const std::string& talkName);
void continueTalk();
void chooseTalk(const int choiceIndex);
void endTalk();
void updateTalk(const In2State& in2State);

} // namespace dispatch
} // namespace state
} // namespace snw