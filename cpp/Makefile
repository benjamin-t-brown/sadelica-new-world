
run: app
	./SNW.exe

app:
	(cd build && cmake --build . -j8)
.PHONY: app

cmake:
	mkdir -p build && (cd build && cmake .. -G "MinGW Makefiles" -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON)
.PHONY: cmake

clean:
	(cd build && cmake --build . --target clean)
.PHONY: clean