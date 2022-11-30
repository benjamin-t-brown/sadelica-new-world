#pragma once

#include <string>
#include <vector>

namespace snw {
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

  int lastLineRetrieved = 0;

public:
  bool waitingForResume = false;
  bool waitingForChoice = false;
  bool executionCompleted = false;
  bool executionErrored = false;
  int id;
  In2Context();
  ~In2Context();

  void createNewCtx();
  void cleanCtx();

  void executeFile(const std::string& fileName);
  void resumeExecution();
  void chooseExecution(const std::string& id);
  const std::vector<In2Choice>& getChoices();
  bool hasChosenChoice(int index) const;
  void pushLine(const std::string& line);
  void pushChoice(In2Choice c);
  void resetChoices();
  std::string getStorage(const std::string& key) const;
  void setStorage(const std::string& key, const std::string& value);
  void logStorage();
  bool isExecutionActive() const;
  const std::vector<std::string>& getLines();
  const std::vector<std::string> getNextLines();
};

} // namespace in2
}; // namespace snw