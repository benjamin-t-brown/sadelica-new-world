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

set(CMAKE_C_COMPILER_WORKS 1)
set(CMAKE_CXX_COMPILER_WORKS 1)

project(
  sadelica_new_world
  VERSION 1.0
  LANGUAGES CXX)

set(CMAKE_BINARY_DIR ${CMAKE_SOURCE_DIR})
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set(LIBRARY_OUTPUT_PATH ${PROJECT_BINARY_DIR}/lib)

include_directories(${CMAKE_SOURCE_DIR}/src)

add_subdirectory(src)

