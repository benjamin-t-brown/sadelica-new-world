MAIN_ALL=Main.cpp

CLIENT_CODE=\
lib/imgui/imgui_draw.cpp\
lib/imgui/imgui_demo.cpp\
lib/imgui/imgui_tables.cpp\
lib/imgui/imgui_widgets.cpp\
lib/imgui/imgui_impl_sdl.cpp\
lib/imgui/imgui_impl_sdlrenderer.cpp\
lib/imgui/imgui.cpp\
game/state/stateClient/stateClientContext.cpp\
game/state/stateClient/dispatch.cpp\
game/state/stateClient/loopbackHandlers/loopbackHandlers.cpp\
game/state/stateClient/resultHandlers/resultHandlers.cpp\
ui/Ui.cpp\
ui/Elements.cpp\
ui/components/TalkCmpt.cpp\
ui/components/InGameCmpt.cpp

SERVER_CODE=\
game/state/stateServer/stateServerContext.cpp\
game/state/stateServer/dispatchHandlers/dispatchHandlers.cpp

SHARED_CODE=\
lib/sdl2wrapper/Animation.cpp\
lib/sdl2wrapper/AssetLoader.cpp\
lib/sdl2wrapper/Events.cpp\
lib/sdl2wrapper/SDL2Includes.cpp\
lib/sdl2wrapper/Sound.cpp\
lib/sdl2wrapper/Sprite.cpp\
lib/sdl2wrapper/Store.cpp\
lib/sdl2wrapper/Window.cpp\
lib/sdl2wrapper/Timer.cpp\
lib/sdl2wrapper/Gauge.cpp\
lib/sdl2wrapper/Transform.cpp\
lib/sdl2wrapper/Logger.cpp\
lib/duktape/duktape.cpp\
lib/net/client.cpp\
lib/net/server.cpp\
lib/tiled/tiled.cpp\
game/in2/in2.cpp\
game/state/actions/actions.cpp\
game/state/state.cpp\
utils/utils.cpp

TEST_CODE=\
test/test.cpp\
test/sdl2wrapper/Gauge.test.cpp\
test/in2/In2.test.cpp\
test/Logger.test.cpp\
test/state/ClientState.test.cpp\
test/state/ServerState.test.cpp\
test/net/NetMock.test.cpp\
test/tiled/Tiled.test.cpp

TEST_CODE_UI=\
test/test.cpp\
test/ui/TalkCmpt.test.cpp\
test/ui/ClientTalk.test.cpp

MAIN_ALL_OBJECT=$(MAIN_ALL:.cpp=.o)

CLIENT_OBJECTS=$(CLIENT_CODE:.cpp=.o)
SERVER_OBJECTS=$(SERVER_CODE:.cpp=.o)
SHARED_OBJECTS=$(SHARED_CODE:.cpp=.o)
TEST_OBJECTS=$(TEST_CODE:.cpp=.o)
TEST_UI_OBJECTS=$(TEST_CODE_UI:.cpp=.o)

ALL_CLIENT_OBJECTS=$(CLIENT_OBJECTS) $(SHARED_OBJECTS)
ALL_SERVER_OBJECTS=$(SERVER_OBJECTS) $(SHARED_OBJECTS)
ALL_OBJECTS=$(SERVER_OBJECTS) $(SHARED_OBJECTS) $(CLIENT_OBJECTS) $(TEST_CODE:.cpp=.o) $(TEST_CODE_UI:.cpp=.o)

# ALL_INCLUDE_TXT=$(CLIENT_CODE:.cpp=.txt) $(SHARED_OBJECTS:.cpp=.txt) $(SERVER_OBJECTS:.cpp=.txt)
ALL_INCLUDE_TXT=$(ALL_OBJECTS:.o=.txt)

WORKING_DIR = $(shell pwd)

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

# This allows you to write "make testui <test regex>" and it will run tests
# with that filter enabled
ifeq (testui,$(firstword $(MAKECMDGOALS)))
  ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
	ifeq ($(ARGS),)
		ARGS := *
	else
	  # ...and turn them into do-nothing targets
  	$(eval $(ARGS):;@:)
	endif
	TEST_ARGS := --gtest_filter=*$(ARGS)*
endif

# This allows you to write "make testui <test regex>" and it will run tests
# with that filter enabled
ifeq (testui2,$(firstword $(MAKECMDGOALS)))
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
-s JS_MATH=false

EMCC_LIBS_SERVER=\
-g -O3\
-s ALLOW_MEMORY_GROWTH=1\
-s SAFE_HEAP=0\
-s DEMANGLE_SUPPORT=1\
-s ASSERTIONS=1\
-s INITIAL_MEMORY=326565888\
-s ENVIRONMENT=node\
-s JS_MATH=false

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
EXE_TEST=SNW_TEST
EXE_TEST_UI=SNW_TEST_UI
EXE_TEST_UI2=EXE_TEST_UI2

ifeq ($(OS),Windows_NT)
  LIBS=-mconsole -lmingw32 -lSDL2main -lSDL2 -lSDL2_image -lSDL2_ttf -lSDL2_mixer -lenet
else
  LIBS=-lSDL2main -lSDL2 -lSDL2_image -lSDL2_ttf -lSDL2_mixer -lenet
endif
LIBS_TEST=-lpthread -lgtest

FLAGS=-O0 -g -Wall -std=c++17 -DNET_ENABLE_ENET -DSNW_PORT=9831 -fuse-ld=lld -I$(WORKING_DIR)
# FLAGS=-O0 -g -Wall -std=c++17 -I$(WORKING_DIR)

.PHONY: $(EXE) test includes main2
$(EXE): precompiled.h.gch $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) $(MAIN_ALL_OBJECT) $(TEST_OBJECTS) $(TEST_UI_OBJECTS)
	g++ -include precompiled.h $(FLAGS) $(MAIN_ALL_OBJECT) $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) -o $(EXE) $(LIBS)

run:
	./$(EXE) --nointro

runclient:
	./$(EXE) --client

runserver:
	./$(EXE) --server

precompiled.h.gch:
	g++ $(FLAGS) -c precompiled.h -o precompiled.h.gch

test: testnorun
	./$(EXE_TEST) $(TEST_ARGS)

testnorun: precompiled.h.gch $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) $(TEST_OBJECTS)
	g++ $(FLAGS) $(TEST_OBJECTS) $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) -o $(EXE_TEST) $(LIBS_TEST) $(LIBS)

testui: testuinorun
	./$(EXE_TEST_UI) $(TEST_ARGS)

testui2: testuinorun2
	./$(EXE_TEST_UI2) $(TEST_ARGS)

testuinorun: precompiled.h.gch $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) $(TEST_UI_OBJECTS)
	g++ $(FLAGS) $(TEST_UI_OBJECTS) $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) -o $(EXE_TEST_UI) $(LIBS_TEST) $(LIBS)

testuinorun2: precompiled.h.gch $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) $(TEST_UI_OBJECTS)
	g++ $(FLAGS) $(TEST_UI_OBJECTS) $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) -o $(EXE_TEST_UI2) $(LIBS_TEST) $(LIBS)

includes: $(ALL_INCLUDE_TXT)

main2: precompiled.h.gch $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) Main2.o
	g++ -include precompiled.h $(FLAGS) Main2.o $(CLIENT_OBJECTS) $(SHARED_OBJECTS) $(SERVER_OBJECTS) -o MAIN2.exe $(LIBS)
	rm -rf MAIN2.exe

.cpp.o:
	g++ $(FLAGS) -include precompiled.h -c $(@:.o=.cpp) -o $@

%.txt:
	g++ $(FLAGS) -M -include precompiled.h -c $(@:.txt=.cpp)

# temp:
# 	mkdir -p .build

# js: temp
# 	em++ $(CODE) $(SDL2_WRAPPER_CODE) $(IMGUI_CODE) $(EMCC_LIBS) $(EMCC_EXPORTED) --preload-file assets -o .build/$(EXE).js
# 	mkdir -p ../dist
# 	mv -v .build/* ../dist
# 	rm -fd .build

clean:
	rm -f $(CLIENT_OBJECTS) $(SERVER_OBJECTS) $(SHARED_OBJECTS) $(MAIN_ALL_OBJECT)
	rm -f $(TEST_OBJECTS) $(TEST_UI_OBJECTS)
	rm -f precompiled.h.gch
	rm -f $(EXE) $(EXE).exe $(EXE_CLIENT) $(EXE_TEST) $(EXE_TEST).exe $(EXE_TEST_UI) $(EXE_TEST_UI).exe $(EXE_TEST_UI2).exe $(EXE_TEST_UI2)
	rm -fd .build