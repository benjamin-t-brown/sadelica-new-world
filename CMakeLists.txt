cmake_minimum_required(VERSION 3.11...3.23)

if (WIN32)
  if(NOT DEFINED CMAKE_TOOLCHAIN_FILE)
    set(CMAKE_TOOLCHAIN_FILE "${CMAKE_SOURCE_DIR}/toolchain.cmake" CACHE PATH "toolchain file")
  endif()
endif (WIN32)

set(CMAKE_CXX_FLAGS           "-std=c++17 -g -Wall -Wextra -Wno-unused-parameter" CACHE STRING "c++ flags")
set(CMAKE_C_FLAGS             "-std=c++17 -g -Wall -Wextra -Wno-unused-parameter" CACHE STRING "c flags")
set(CMAKE_CXX_FLAGS_RELEASE   "-std=c++17 -O3 -DNDEBUG"            CACHE STRING "c++ Release flags")
set(CMAKE_C_FLAGS_RELEASE     "-std=c++17 -O3 -DNDEBUG"            CACHE STRING "c Release flags")
set(CMAKE_CXX_FLAGS_DEBUG     "-std=c++17 -O0 -g -DDEBUG -D_DEBUG" CACHE STRING "c++ Debug flags")
set(CMAKE_C_FLAGS_DEBUG       "-std=c++17 -O0 -g -DDEBUG -D_DEBUG" CACHE STRING "c Debug flags")

set(CMAKE_C_COMPILER_WORKS 0)
set(CMAKE_CXX_COMPILER_WORKS 1)

project(
  sadelica_new_world
  VERSION 1.0
  LANGUAGES CXX)

set(CMAKE_BINARY_DIR ${CMAKE_SOURCE_DIR})
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set(LIBRARY_OUTPUT_PATH ${PROJECT_BINARY_DIR}/lib)

include_directories(${CMAKE_SOURCE_DIR}/src)

set(SDL2_LINK_LIBRARIES "-lSDL2main -lSDL2 -lSDL2_image -lSDL2_ttf -lSDL2_mixer")
if (WIN32)
  set(SDL2_LINK_LIBRARIES "-mconsole -lmingw32 -lSDL2main -lSDL2 -lSDL2_image -lSDL2_ttf -lSDL2_mixer")
endif (WIN32)

add_executable(SNW
  src/Main2.cpp
  # src/Main.cpp
  # src/ui/Ui.cpp
  # src/ui/components/TalkCmpt.cpp
  # src/ui/components/InGameCmpt.cpp
  # src/lib/sdl2wrapper/Animation.cpp
  # src/lib/sdl2wrapper/AssetLoader.cpp
  # src/lib/sdl2wrapper/Events.cpp
  # src/lib/sdl2wrapper/Gauge.cpp
  # src/lib/sdl2wrapper/SDL2Includes.cpp
  # src/lib/sdl2wrapper/Sound.cpp
  # src/lib/sdl2wrapper/Sprite.cpp
  # src/lib/sdl2wrapper/Store.cpp
  # src/lib/sdl2wrapper/Timer.cpp
  # src/lib/sdl2wrapper/Window.cpp
  # src/lib/imgui/imgui_draw.cpp
  # src/lib/imgui/imgui_demo.cpp
  # src/lib/imgui/imgui_sdl.cpp
  # src/lib/imgui/imgui_tables.cpp
  # src/lib/imgui/imgui_widgets.cpp
  # src/lib/imgui/imgui_impl_sdl.cpp
  # src/lib/imgui/imgui.cpp
)

target_link_libraries(SNW ${SDL2_LINK_LIBRARIES})

