set(MSYS2_BIN_PATH "C:/progs/msys2/usr/bin")
set(MINGW64_BIN_PATH "C:/progs/msys2/mingw64/bin")
set(MINGW64_INCLUDE_PATH "C:/progs/msys2/mingw64/include")

set(CMAKE_MAKE_PROGRAM "${MSYS2_BIN_PATH}/make.exe")
set(CMAKE_CXX_COMPILER "${MINGW64_BIN_PATH}/g++.exe" CACHE PATH "C++ compiler")
set(CMAKE_C_COMPILER "${MINGW64_BIN_PATH}/gcc.exe" CACHE PATH "C compiler")
