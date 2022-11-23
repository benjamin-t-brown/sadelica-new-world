#include "lib/sdl2wrapper/Gauge.h"
#include <gtest/gtest.h>

TEST(SDL2WrapperGaugeTest, AnUnfilledGaugeCanBeConstructed) {
  auto gauge = SDL2Wrapper::Gauge(100);

  EXPECT_EQ(gauge.isFull(), false);
}

TEST(SDL2WrapperGaugeTest, CanBeFilled) {
  auto gauge = SDL2Wrapper::Gauge(100);
  gauge.fill(100);

  EXPECT_EQ(gauge.isFull(), true);
}

TEST(SDL2WrapperGaugeTest, CanBeFilledPastTheTop) {
  auto gauge = SDL2Wrapper::Gauge(100);
  gauge.fill(1000);

  EXPECT_EQ(gauge.isFull(), true);
}

TEST(SDL2WrapperGaugeTest, CanChangeFillAmountAfterConstruction) {
  auto gauge = SDL2Wrapper::Gauge(100);
  gauge.fill(50);
  EXPECT_EQ(gauge.isFull(), false);
  gauge.setMs(50);
  EXPECT_EQ(gauge.isFull(), true);
}