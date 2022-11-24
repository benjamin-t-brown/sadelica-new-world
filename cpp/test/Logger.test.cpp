#include "logger.h"
#include <gtest/gtest.h>

TEST(LoggerTest, CanSupportMultipleTypesOfLogging) {
  Logger::disabled = false;
  logger::info("Log test arg={} num={}", "arg", 1);
  logger::debug("Log test arg={} num={}", "arg", 1);
  logger::warn("Log test arg={} num={}", "arg", 1);
  logger::error("Log test arg={} num={}", "arg", 1);
  Logger() << "Log Test" << Logger::endl;
  Logger(LogType::INFO) << "Log Test" << Logger::endl;
  Logger(LogType::DEBUG) << "Log Test" << Logger::endl;
  Logger(LogType::WARN) << "Log Test" << Logger::endl;
  Logger(LogType::ERROR) << "Log Test" << Logger::endl;

  // expect no errors
  EXPECT_EQ(1, 1);
}
