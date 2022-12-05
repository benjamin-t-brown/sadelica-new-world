#include "lib/tiled/tiled.h"
#include "logger.h"
#include <fstream>
#include <gtest/gtest.h>

class TiledTest : public testing::Test {
protected:
  static void SetUpTestSuite() { Logger::disabled = true; }
  static void TearDownTestSuite() {}
  void SetUp() override { Logger::disabled = false; }
  void TearDown() override {}
};

TEST_F(TiledTest, TiledTestCanLoadAlinea) {
  auto t = tiled::TiledMap("assets/map/alinea.json");

  EXPECT_EQ(t.tilesIds.size(), 256 * 256);
  EXPECT_GT(t.characters.size(), 0);
}
