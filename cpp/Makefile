MAIN=Main.cpp

CODE=\
ui/Ui.cpp\
ui/components/TalkCmpt.cpp\
ui/components/InGameCmpt.cpp

LIB_CODE=\
lib/imgui/imgui_draw.cpp\
lib/imgui/imgui_demo.cpp\
lib/imgui/imgui_sdl.cpp\
lib/imgui/imgui_tables.cpp\
lib/imgui/imgui_widgets.cpp\
lib/imgui/imgui_impl_sdl.cpp\
lib/imgui/imgui.cpp\
lib/sdl2wrapper/Animation.cpp\
lib/sdl2wrapper/AssetLoader.cpp\
lib/sdl2wrapper/Events.cpp\
lib/sdl2wrapper/Gauge.cpp\
lib/sdl2wrapper/SDL2Includes.cpp\
lib/sdl2wrapper/Sound.cpp\
lib/sdl2wrapper/Sprite.cpp\
lib/sdl2wrapper/Store.cpp\
lib/sdl2wrapper/Timer.cpp\
lib/sdl2wrapper/Logger.cpp\
lib/sdl2wrapper/Window.cpp\
lib/duktape/duktape.cpp\
lib/in2/in2.cpp

TEST_CODE=\
test/test.cpp\
test/sdl2wrapper/Gauge.test.cpp

MAIN_OBJECT=$(MAIN:.cpp=.o)
OBJECTS=$(CODE:.cpp=.o)
LIB_OBJECTS=$(LIB_CODE:.cpp=.o)
TEST_OBJECTS=$(TEST_CODE:.cpp=.o)

# If the first argument is "run"...
ifeq (test,$(firstword $(MAKECMDGOALS)))
  # use the rest as arguments for "run"
  ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
	ifeq ($(ARGS),)
		ARGS := *
	else
	  # ...and turn them into do-nothing targets
  	$(eval $(ARGS):;@:)
	endif
	TEST_ARGS := --gtest_filter=*$(ARGS)*
endif

EMCC_LIBS=\
-g -O3\
-s USE_SDL=2\
-s USE_SDL_IMAGE=2\
-s USE_SDL_MIXER=2\
-s SDL2_IMAGE_FORMATS='["png"]'\
-s USE_SDL_TTF=2\
-s ALLOW_MEMORY_GROWTH=1\
-s SAFE_HEAP=0\
-s DEMANGLE_SUPPORT=1\
-s ASSERTIONS=1\
-s INITIAL_MEMORY=326565888\
-s ENVIRONMENT=web\
-s JS_MATH=true

EMCC_EXPORTED=\
-s EXPORTED_FUNCTIONS='["_main", "_enableSound", "_disableSound", "_setVolume", "_setKeyDown", "_setKeyUp", "_setKeyStatus"]'\
-s EXPORTED_RUNTIME_METHODS=['ccall']

EXE=SNW
EXE_TEST=SNW_TEST
ifeq ($(OS),Windows_NT)
  LIBS=-mconsole -lmingw32 -lSDL2main -lSDL2 -lSDL2_image -lSDL2_ttf -lSDL2_mixer
else
  LIBS=-lSDL2main -lSDL2 -lSDL2_image -lSDL2_ttf -lSDL2_mixer
endif
LIBS_TEST=-lpthread -lgtest

FLAGS=-g -Wall -std=c++17 -I.

.PHONY: $(EXE) test
$(EXE): precompiled.h.gch $(LIB_OBJECTS) $(OBJECTS) $(MAIN_OBJECT)
	g++ $(FLAGS) $(MAIN_OBJECT) $(OBJECTS) $(LIB_OBJECTS) -o $(EXE) $(LIBS)

precompiled.h.gch:
	g++ $(FLAGS) -c precompiled.h -o precompiled.h.gch

test: precompiled.h.gch $(LIB_OBJECTS) $(OBJECTS) $(TEST_OBJECTS)
	g++ $(FLAGS) $(TEST_OBJECTS) $(LIB_OBJECTS) -o $(EXE_TEST) $(LIBS_TEST) $(LIBS)
	./$(EXE_TEST) $(TEST_ARGS)

.cpp.o:
	g++ $(FLAGS) -include precompiled.h -c $(@:.o=.cpp) -o $@

# temp:
# 	mkdir -p .build

# js: temp
# 	em++ $(CODE) $(SDL2_WRAPPER_CODE) $(IMGUI_CODE) $(EMCC_LIBS) $(EMCC_EXPORTED) --preload-file assets -o .build/$(EXE).js
# 	mkdir -p ../dist
# 	mv -v .build/* ../dist
# 	rm -fd .build

run: $(EXE)
	./$(EXE)  --nointro

clean_all: clean
	rm -f $(LIB_OBJECTS)
	rm -f *.h.gch

clean:
	rm -f $(OBJECTS)
	rm -rf $(TEST_OBJECTS)
	rm -f $(EXE)
	rm -f $(EXE).exe
	rm -f $(EXE_TEST)
	rm -f $(EXE_TEST).exe
	rm -fd .build