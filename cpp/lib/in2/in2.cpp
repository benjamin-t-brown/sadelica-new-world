#include "in2.h"
#include "Logging.h"
#include "lib/duktape/duktape.h"
#include "lib/json/json.h"
#include <algorithm>
#include <fstream>
// #include <functional>
#include <sstream>
#include <vector>

using json = nlohmann::json;

namespace in2 {
constexpr const char* IN2_CORE_SRC_PATH = "assets/in2/core.js";
constexpr const char* IN2_COMPILED_SRC_PATH = "assets/in2/main.compiled.js";

static std::string in2CoreSrc = "";
static std::string in2CompiledSrc = "";
static int in2InstanceIdCtr = 0;
static std::vector<In2Context*> in2InstancePtrs;

static void handleDukError(void* udata, const char* msg) {
  Logger() << "Error in duktape js: " << msg << Logger::endl;
  exit(1);
}

void readIn2CoreSrc() {
  const std::string path = IN2_CORE_SRC_PATH;
  Logger() << "Reading in2 core src from " << path << Logger::endl;
  const std::ifstream src(path);

  std::stringstream buffer;
  buffer << src.rdbuf();
  in2CoreSrc = buffer.str();
}

const std::string& getIn2CoreSrc() { return in2CoreSrc; }

void readIn2CompiledSrc() {
  const std::string path = IN2_COMPILED_SRC_PATH;
  Logger() << "Reading in2 compiled src from " << path << Logger::endl;
  const std::ifstream src(path);

  std::stringstream buffer;
  buffer << src.rdbuf();
  in2CompiledSrc = buffer.str();
}

const std::string& getIn2CompiledSrc() { return in2CompiledSrc; }

void init() {
  readIn2CoreSrc();
  readIn2CompiledSrc();
};

duk_context* catDukCtx(void* ctx) {
  return reinterpret_cast<duk_context*>(ctx);
}

json* castJsonState(void* ctx) { return reinterpret_cast<json*>(ctx); }

void registerIn2Context(In2Context* ctx) { in2InstancePtrs.push_back(ctx); }
In2Context* getIn2Context(int id) {
  for (auto it = in2InstancePtrs.begin(); it != in2InstancePtrs.end(); it++) {
    auto ctx = (*it);
    if (ctx->id == id) {
      return ctx;
    }
  }
  return nullptr;
}
void deregisterIn2Context(In2Context* ctx) {
  for (auto it = in2InstancePtrs.begin(); it != in2InstancePtrs.end(); it++) {
    if (*it == ctx) {
      auto ind = std::distance(in2InstancePtrs.begin(), it);
      in2InstancePtrs.erase(in2InstancePtrs.begin() + ind);
      return;
    }
  }
}

//----------------------------------------------------------------------------------------

/* Being an embeddable engine, Duktape doesn't provide I/O
 * bindings by default.  Here's a simple one argument print()
 * function.
 */
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

static duk_ret_t duk_log(duk_context* ctx) {
  Logger() << "[duktape] " << duk_to_string(ctx, 0) << Logger::endl;
  return 0;
}

static duk_ret_t duk_coreSay(duk_context* ctx) {
  const int ctxId = static_cast<int>(duk_to_number(ctx, 0));
  const std::string line = duk_to_string(ctx, 1);

  Logger() << line << Logger::endl;
  return 0;
}

static duk_ret_t duk_coreSetString(duk_context* ctx) {
  const int ctxId = static_cast<int>(duk_to_number(ctx, 0));
  const std::string key = duk_to_string(ctx, 1);
  const std::string value = duk_to_string(ctx, 2);

  // Logger() << duk_to_string(ctx, 0) << Logger::endl;
  return 0;
}

In2Context::In2Context() {
  registerIn2Context(this);
  id = in2InstanceIdCtr++;
  dukCtx = duk_create_heap(NULL, NULL, NULL, NULL, handleDukError);
  jsonState = new json();
  auto ctx = catDukCtx(dukCtx);

  Logger() << "Add duk_ native functions to duk ctx" << Logger::endl;
  duk_push_c_function(ctx, duk_log, 2);
  duk_put_global_string(ctx, "log");
  duk_push_c_function(ctx, duk_coreSay, 3);
  duk_put_global_string(ctx, "cpp_say");

  Logger() << "Eval core src" << Logger::endl
           << getIn2CoreSrc().c_str() << Logger::endl;
  duk_eval_string(ctx, getIn2CoreSrc().c_str());

  Logger() << "Eval compiled src" << Logger::endl
           << getIn2CompiledSrc().c_str() << Logger::endl;
  duk_eval_string(ctx, getIn2CompiledSrc().c_str());

  std::stringstream ss;
  ss << "core.init(" << id << ");";

  Logger() << "Eval: " << ss.str() << Logger::endl;
  duk_eval_string_noresult(ctx, ss.str().c_str());
}

In2Context::~In2Context() {
  duk_destroy_heap(catDukCtx(dukCtx));
  delete castJsonState(jsonState);
  deregisterIn2Context(this);
}

}; // namespace in2