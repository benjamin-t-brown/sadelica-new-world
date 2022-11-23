#include "Logging.h"
#include "lib/in2/in2.h"
#include <ctime>
#include <iostream>
#include <string>

// NOLINTNEXTLINE
int main(int argc, char* argv[]) {
  Logger() << "Program Begin." << Logger::endl;
  srand(time(NULL));
  in2::init("");

  in2::In2Context in2 = in2::In2Context();

  in2.executeFile("CPP_Test");

  int choice = -1;
  bool looping = true;
  do {
    if (in2.waitingForResume) {
      Logger() << " Press Enter to continue." << Logger::endl;
      if (std::cin.get() == '\n') {
        in2.resumeExecution();
      }
    } else if (in2.waitingForChoice) {
      auto choices = in2.getChoices();
      for (const auto& choice : choices) {
        in2.pushLine(choice.line);
      }
      std::cin >> choice;
      if (choice >= 1 && choice <= static_cast<int>(choices.size())) {
        in2.chooseExecution(choices[choice - 1].id);
        std::cin.get();
      } else {
        Logger() << "invalid choice" << Logger::endl;
      }
    } else if (in2.isExecutionCompleted) {
      Logger() << "Ending execution" << Logger::endl;
      looping = false;
    } else {
      Logger(LogType::ERROR) << "Error ended execution early!" << Logger::endl;
      looping = false;
    }
  } while (looping);

  Logger() << "Program End." << Logger::endl;

  return 0;
}
