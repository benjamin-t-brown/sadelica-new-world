#pragma once

#include <string>
#include <vector>

namespace SNW {
namespace in2 {

void init(const std::string compiledSrc);

struct In2Choice {
  std::string line;
  std::string id;
};

class In2Context {
private:
  void* dukCtx = nullptr;
  void* jsonState = nullptr;

  std::vector<std::string> lines;
  std::vector<In2Choice> choices;

public:
  bool waitingForResume = false;
  bool waitingForChoice = false;
  bool isExecutionCompleted = false;
  int id;
  In2Context();
  ~In2Context();

  void executeFile(const std::string& fileName);
  void resumeExecution();
  void chooseExecution(const std::string& id);
  const std::vector<In2Choice>& getChoices();
  void pushLine(const std::string& line);
  void pushChoice(In2Choice c);
  void resetChoices();
  std::string getStorage(const std::string& key);
  void setStorage(const std::string& key, const std::string& value);
  const std::vector<std::string>& getLines();
};

} // namespace in2
}; // namespace SNW