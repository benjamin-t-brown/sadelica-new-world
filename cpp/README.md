# Make commands

`make` builds everything
`make run` builds everything and runs the combined server/client program
`make test` builds everything+tests and runs all tests
`make test <test regex>` builds everything+tests and then runs tests with the provided regex

# Installation: Windows

Requires MSYS2, specifically the MING64 terminal, see https://www.devdungeon.com/content/install-gcc-compiler-windows-msys2-cc

```
pacman -S base-devel vim cmake git python2
pacman -S mingw-w64-x86_64-toolchain
pacman -S mingw64/mingw-w64-x86_64-SDL2  mingw64/mingw-w64-x86_64-SDL2_image mingw64/mingw-w64-x86_64-SDL2_mixer mingw64/mingw-w64-x86_64-SDL2_ttf
```

Gtest

```
pacman -S mingw64/mingw-w64-x86_64-gtest
```

Clang for formatting/linting

```
pacman -S mingw-w64-x86_64-clang
pacman -S mingw-w64-x86_64-clang-tools-extra
```

*optional* Python2 For some lib dependencies
```
pacman -S mingw64/mingw-w64-x86_64-python2-pip mingw64/mingw-w64-x86_64-python2
```

## Using ucrt64 instead of mingw64

```
pacman -S base-devel vim cmake git python2
pacman -S ucrt64/mingw-w64-ucrt-x86_64-gcc ucrt64/mingw-w64-ucrt-x86_64-gdb
pacman -S ucrt64/mingw-w64-ucrt-x86_64-SDL2  ucrt64/mingw-w64-ucrt-x86_64-SDL2_image ucrt64/mingw-w64-ucrt-x86_64-SDL2_mixer ucrt64/mingw-w64-ucrt-x86_64-SDL2_ttf
```

Gtest

```
pacman -S ucrt64/mingw-w64-ucrt-x86_64-gtest
```

Clang for formatting/linting

```
pacman -S ucrt64/mingw-w64-ucrt-x86_64-clang
pacman -S ucrt64/mingw-w64-ucrt-x86_64-clang-tools-extra
```

*optional* Python2 For some lib dependencies
```
pacman -S ucrt64/mingw-w64-ucrt-x86_64-python2-pip ucrt64/mingw-w64-ucrt-x86_64-python2
```

# Installation Ubuntu:

Install build env (if you don't have these already for some reason):

```
sudo apt-get update
sudo apt install build-essential
sudo apt install make cmake zip unzip
```

The version of SDL2 on ubuntu is too old to work with imgui sdl impl, so you need to install
it manually

```
cd /tmp
git clone https://github.com/libsdl-org/SDL
cd SDL
mkdir build
cd build
../configure
make
sudo make install
```

Other SDL libs are fine.

```
	sudo apt install libsdl2-ttf-dev -y
	sudo apt install libsdl2-image-dev -y
	sudo apt install libsdl2-mixer-dev -y
	sudo apt install libsdl2-gfx-dev -y
```

Gtest

```
sudo apt-get install libgtest-dev
cd /usr/src/googletest/googletest
sudo mkdir build
cd build
sudo cmake ..
sudo make
sudo cp libgtest* /usr/lib/
cd ..
sudo rm -rf build

sudo mkdir /usr/local/lib/googletest
sudo ln -s /usr/lib/libgtest.a /usr/local/lib/googletest/libgtest.a
sudo ln -s /usr/lib/libgtest_main.a /usr/local/lib/googletest/libgtest_main.a
```

# 3rd Party Libs

Should you ever need to re-generate 3rd party libs:

duktape

```
# If you need python 2 in mingw64
pacman -S mingw64/mingw-w64-x86_64-python2-pip mingw64/mingw-w64-x86_64-python2
# or pacman -S ucrt64/mingw-w64-x86_64-python2-pip ucrt64/mingw-w64-x86_64-python2
pip2 install PyYAML

cd duktape/duktape-2.7.0
python2 tools/configure.py --output-directory duktape-src -UDUK_USE_ES6_PROXY
cp duktape-src/duk_config.h ../
cp duktape-src/duktape.h ../
cp duktape-src/duktape.c ../duktape.cpp
cp duktape-src/duk_source_meta.json ../
```

fmt

```
cd fmt/fmt-9.0.0
cp -r include/fmt/* ../
```
