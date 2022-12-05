#pragma once

#include <string>
#include <vector>

namespace tiled {

struct TiledObject {
  std::string name;
  int x;
  int y;
};

class TiledMap {
public:
  std::vector<int> tilesIds;
  std::vector<TiledObject> characters;
  std::vector<TiledObject> triggers;
  std::vector<TiledObject> markers;

  TiledMap(const std::string& mapPath);
};

} // namespace tiled