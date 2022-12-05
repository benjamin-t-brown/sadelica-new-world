#include "tiled.h"
#include "lib/json/json.h"
#include "logger.h"
#include <fstream>
#include <sstream>

using json = nlohmann::json;

namespace tiled {

constexpr int TILE_WIDTH = 16;
constexpr int TILE_HEIGHT = 16;

TiledMap::TiledMap(const std::string& mapPath) {
  const std::ifstream src(mapPath);
  std::stringstream buffer;
  buffer << src.rdbuf();
  const json j = json::parse(buffer.str());
  const json& layers = j["layers"];

  const json& tilesLayer = layers[0];
  const json& objectsLayer = layers[1];

  for (auto tileId : tilesLayer["data"]) {
    tilesIds.push_back(tileId);
  }

  for (auto tiledObject : objectsLayer["objects"]) {
    const std::string& objectName = tiledObject["name"];
    const int x = static_cast<int>(tiledObject["x"]) / TILE_WIDTH;
    const int y = static_cast<int>(tiledObject["y"]) / TILE_HEIGHT;

    if (objectName.substr(0, 2) == "CH") {
      characters.push_back(TiledObject{objectName, x, y});
    } else if (objectName.substr(0, 2) == "TR") {
      triggers.push_back(TiledObject{objectName, x, y});
    } else if (objectName.substr(0, 2) == "MR") {
      markers.push_back(TiledObject{objectName, x, y});
    } else {
      logger::warn("Parsing map=%s, Unknown tiled object: %s",
                   mapPath.c_str(),
                   objectName.c_str());
    }
  }
}

} // namespace tiled
