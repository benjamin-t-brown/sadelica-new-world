#include "Logging.h"
#include "lib/in2/in2.h"
#include <ctime>
#include <string>

static void handleError(void* udata, const char* msg) {
  Logger() << "Error in duktape js: " << msg << Logger::endl;
  exit(1);
}

// NOLINTNEXTLINE
int main(int argc, char* argv[]) {
  Logger() << "Program Begin." << Logger::endl;
  srand(time(NULL));
  in2::init();

  // const std::string src = "var a = 1;\n"
  //                         "var b = 5;\n"
  //                         "a + b;";

  in2::In2Context in2 = in2::In2Context();

  Logger() << "Program End." << Logger::endl;

  return 0;
}
