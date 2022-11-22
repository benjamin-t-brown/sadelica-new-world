#include "Logging.h"
#include "lib/duktape/duktape.h"
#include "lib/in2/in2.h"
#include <ctime>
#include <string>

/* Being an embeddable engine, Duktape doesn't provide I/O
 * bindings by default.  Here's a simple one argument print()
 * function.
 */
static duk_ret_t native_log(duk_context* ctx) {
  Logger().printf("%s\n", duk_to_string(ctx, 0));
  return 0; /* no return value (= undefined) */
}

// /* Adder: add argument values. */
// static duk_ret_t native_adder(duk_context* ctx) {
//   int i;
//   const int numArgs = duk_get_top(ctx); /* #args */
//   double res = 0.0;

//   for (i = 0; i < numArgs; i++) {
//     res += duk_to_number(ctx, i);
//   }

//   duk_push_number(ctx, res);
//   return 1; /* one return value */
// }

static void handleError(void* udata, const char* msg) {
  Logger() << "Error in duktape js: " << msg << Logger::endl;
  exit(1);
}

// NOLINTNEXTLINE(cppcoreguidelines-avoid-c-arrays)
int main(int argc, char* argv[]) {
  Logger() << "Program Begin." << Logger::endl;
  srand(time(NULL));

  // const std::string src = "var a = 1;\n"
  //                         "var b = 5;\n"
  //                         "a + b;";

  in2::readIn2CoreSrc();
  const std::string coreSrc = in2::getIn2CoreSrc();
  in2::readIn2CompiledSrc();
  const std::string compiledSrc = in2::getIn2CompiledSrc();

  duk_context* ctx = duk_create_heap(NULL, NULL, NULL, NULL, handleError);

  Logger() << "Load core" << Logger::endl;
  // Logger() << "Core Src:\n" << Logger::endl << coreSrc.c_str() << Logger::endl;
  duk_push_c_function(ctx, native_log, 1 /*nargs*/);
  duk_put_global_string(ctx, "log");
  duk_eval_string(ctx, coreSrc.c_str());
  // duk_push_c_function(ctx, native_adder, DUK_VARARGS);
  // duk_put_global_string(ctx, "adder");

  Logger() << "Eval core src" << Logger::endl;
  duk_eval_string_noresult(ctx, "core.init();");


  // Logger() << "Compiled Src:\n" << Logger::endl << compiledSrc.c_str() << Logger::endl;
  Logger() << "Eval compiled src" << Logger::endl;
  duk_eval_string(ctx, compiledSrc.c_str());

  // Logger() << "Eval: " << duk_get_int(ctx, -1) << Logger::endl;

  duk_destroy_heap(ctx);

  Logger() << "Program End." << Logger::endl;
  return 0;
}
