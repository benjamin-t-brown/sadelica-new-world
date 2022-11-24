MAIN_CLIENT=MainClient.cpp
MAIN_SERVER=MainServer.cpp
MAIN_ALL=Main.cpp

CLIENT_CODE=\
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
lib/sdl2wrapper/SDL2Includes.cpp\
lib/sdl2wrapper/Sound.cpp\
lib/sdl2wrapper/Sprite.cpp\
lib/sdl2wrapper/Store.cpp\
lib/sdl2wrapper/Window.cpp\
ui/Ui.cpp\
ui/components/TalkCmpt.cpp\
ui/components/InGameCmpt.cpp

SERVER_CODE=

SHARED_CODE=\
lib/sdl2wrapper/Timer.cpp\
lib/sdl2wrapper/Gauge.cpp\
lib/sdl2wrapper/Logger.cpp\
lib/duktape/duktape.cpp\
lib/in2/in2.cpp

TEST_CODE=\
test/test.cpp\
test/sdl2wrapper/Gauge.test.cpp\
test/in2/in2.test.cpp\
test/Logger.test.cpp

MAIN_CLIENT_OBJECT=$(MAIN_CLIENT:.cpp=.o)
MAIN_SERVER_OBJECT=$(MAIN_SERVER:.cpp=.o)
MAIN_ALL_OBJECT=$(MAIN_ALL:.cpp=.o)

CLIENT_OBJECTS=$(CLIENT_CODE:.cpp=.o)
SERVER_OBJECTS=$(SERVER_CODE:.cpp=.o)
SHARED_OBJECTS=$(SHARED_CODE:.cpp=.o)
TEST_OBJECTS=$(TEST_CODE:.cpp=.o)

ALL_CLIENT_OBJECTS=$(CLIENT_OBJECTS) $(SHARED_OBJECTS)
ALL_SERVER_OBJECTS=$(SERVER_OBJECTS) $(SHARED_OBJECTS)

# This allows you to write "make test <test regex>" and it will run tests
# with that filter enabled
ifeq (test,$(firstword $(MAKECMDGOALS)))
  ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
	ifeq ($(ARGS),)
		ARGS := *
	else
	  # ...and turn them into do-nothing targets
  	$(eval $(ARGS):;@:)
	endif
	TEST_ARGS := --gtest_filter=*$(ARGS)*
endif

EMCC_LIBS_CLIENT=\
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

EMCC_LIBS_SERVER=\
-g -O3\
-s ALLOW_MEMORY_GROWTH=1\
-s SAFE_HEAP=0\
-s DEMANGLE_SUPPORT=1\
-s ASSERTIONS=1\
-s INITIAL_MEMORY=326565888\
-s ENVIRONMENT=node\
-s JS_MATH=true

EMCC_EXPORTED=\
-s EXPORTED_FUNCTIONS='[\
 "_main",\
 "_enableSound",\
 "_disableSound",\
 "_setVolume",\
 "_setKeyDown",\
 "_setKeyUp",\
 "_setKeyStatus"\
]'\
-s EXPORTED_RUNTIME_METHODS=['ccall']

EXE=SNW
EXE_CLIENT=SNW_CLIENT
EXE_SERVER=SNW_SERVER
EXE_TEST=SNW_TEST
ifeq ($(OS),Windows_NT)
  LIBS=-mconsole -lmingw32 -lSDL2main -lSDL2 -lSDL2_image -lSDL2_ttf -lSDL2_mixer
else
  LIBS=-lSDL2main -lSDL2 -lSDL2_image -lSDL2_ttf -lSDL2_mixer
endif
LIBS_TEST=-lpthread -lgtest

FLAGS=-g -Wall -std=c++17 -DFMT_HEADER_ONLY -I.

.PHONY: $(EXE) test
$(EXE): precompiled.h.gch $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) $(MAIN_ALL_OBJECT)
	g++ $(FLAGS) $(MAIN_ALL_OBJECT) $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) -o $(EXE) $(LIBS)

precompiled.h.gch:
	g++ $(FLAGS) -c precompiled.h -o precompiled.h.gch

test: precompiled.h.gch $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) $(TEST_OBJECTS)
	g++ $(FLAGS) $(TEST_OBJECTS) $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) -o $(EXE_TEST) $(LIBS_TEST) $(LIBS)
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
	./$(EXE) --nointro

clean:
	rm -f $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) $(MAIN_ALL_OBJECT) $(MAIN_CLIENT_OBJECT) $(MAIN_SERVER_OBJECT)
	rm -f $(TEST_OBJECTS)
	rm -f $(EXE) $(EXE).exe $(EXE_CLIENT) $(EXE_CLIENT).exe $(EXE_SERVER) $(EXE_SERVER).exe 
	rm -fd .build