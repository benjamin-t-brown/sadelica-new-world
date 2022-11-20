set(SDL2_LINK_LIBRARIES "-lSDL2main -lSDL2 -lSDL2_image -lSDL2_ttf -lSDL2_mixer")
if (WIN32)
  set(SDL2_LINK_LIBRARIES "-mconsole -lmingw32 -lSDL2main -lSDL2 -lSDL2_image -lSDL2_ttf -lSDL2_mixer")
endif (WIN32)

add_executable(SNW
  Main.cpp
  ui/Ui.cpp
  ui/components/TalkCmpt.cpp
  ui/components/InGameCmpt.cpp
  sdl2wrapper/Animation.cpp
  sdl2wrapper/AssetLoader.cpp
  sdl2wrapper/Events.cpp
  sdl2wrapper/Gauge.cpp
  sdl2wrapper/SDL2Includes.cpp
  sdl2wrapper/Sound.cpp
  sdl2wrapper/Sprite.cpp
  sdl2wrapper/Store.cpp
  sdl2wrapper/Timer.cpp
  sdl2wrapper/Window.cpp
  imgui/imgui_draw.cpp
  imgui/imgui_demo.cpp
  imgui/imgui_sdl.cpp
  imgui/imgui_tables.cpp
  imgui/imgui_widgets.cpp
  imgui/imgui_impl_sdl.cpp
  imgui/imgui.cpp
)

target_link_libraries(SNW ${SDL2_LINK_LIBRARIES})
