#include "logger.h"
#include <gtest/gtest.h>

TEST(LoggerTest, CanSupportMultipleTypesOfLogging) {
  Logger::disabled = false;
  logger::info("logger test arg=%s num=%c dub=%d", "arg", 1, 1.);
  logger::debug("logger test arg=%s num=%c dub=%d", "arg", 1, 1.);
  logger::warn("logger test arg=%s num=%c dub=%d", "arg", 1, 1.);
  logger::error("logger test arg=%s num=%c dub=%d", "arg", 1, 1.);
  Logger().get() << "SDL2Wrapper Test" << Logger::endl;
  Logger().get(LogType::INFO) << "SDL2Wrapper Log Test" << Logger::endl;
  Logger().get(LogType::DEBUG) << "SDL2Wrapper Log Test" << Logger::endl;
  Logger().get(LogType::WARN) << "SDL2Wrapper Log Test" << Logger::endl;
  Logger().get(LogType::ERROR) << "SDL2Wrapper Log Test" << Logger::endl;

  logger::info("Escape percent %%s", "arg");
  // logger::warn("What?");

  // expect no errors
  EXPECT_EQ(1, 1);
}
