# Installation: Windows

Requires MSYS2, specifically the MING64 terminal, see https://www.devdungeon.com/content/install-gcc-compiler-windows-msys2-cc

```
pacman -S base-devel gcc vim cmake git
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