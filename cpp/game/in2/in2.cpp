#include "in2.h"
#include "lib/duktape/duktape.h"
#include "lib/json/json.h"
#include "logger.h"
#include <algorithm>
#include <fstream>
#include <sstream>
#include <vector>

using json = nlohmann::json;

namespace snw {
namespace in2 {

constexpr const char* IN2_CORE_SRC_PATH = "assets/in2/core.js";
constexpr const char* IN2_COMPILED_SRC_PATH = "assets/in2/main.compiled.js";

static std::string in2CoreSrc = "";
static std::string in2CompiledSrc = "";
static int in2InstanceIdCtr = 0;
static std::vector<In2Context*> in2InstancePtrs;

static void handleDukError(void* udata, const char* msg) {
  Logger(LogType::ERROR) << "Error in duktape js: " << msg << Logger::endl;
  exit(1);
}

void readIn2CoreSrc() {
  const std::string path = IN2_CORE_SRC_PATH;
  Logger(LogType::DEBUG) << "Reading in2 core src from " << path
                         << Logger::endl;
  const std::ifstream src(path);

  std::stringstream buffer;
  buffer << src.rdbuf();
  in2CoreSrc = buffer.str();
}

const std::string& getIn2CoreSrc() { return in2CoreSrc; }

void readIn2CompiledSrc() {
  const std::string path = IN2_COMPILED_SRC_PATH;
  Logger(LogType::DEBUG) << "Reading in2 compiled src from " << path
                         << Logger::endl;
  const std::ifstream src(path);

  std::stringstream buffer;
  buffer << src.rdbuf();
  in2CompiledSrc = buffer.str();
}

const std::string& getIn2CompiledSrc() { return in2CompiledSrc; }

void init(const std::string _in2CompiledSrc = "") {
  Logger(LogType::DEBUG) << "Init In2" << Logger::endl;
  readIn2CoreSrc();
  if (_in2CompiledSrc == "") {
    readIn2CompiledSrc();
  } else {
    in2CompiledSrc = _in2CompiledSrc;
  }
};

duk_context* castDukCtx(void* ctx) {
  if (ctx == nullptr) {
    throw std::runtime_error("Attempted to cast null duk ctx.");
  }

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
  Logger(LogType::ERROR) << "Failed to get in2 context: " << id << Logger::endl;
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

static duk_ret_t duk_log(duk_context* ctx) {
  Logger() << "[js] " << duk_to_string(ctx, 0) << Logger::endl;
  return 0;
}

static duk_ret_t duk_coreSay(duk_context* ctx) {
  const int ctxId = static_cast<int>(duk_to_number(ctx, 0));
  const std::string line = duk_to_string(ctx, 1);

  auto in2Ctx = getIn2Context(ctxId);

  Logger(LogType::DEBUG) << "duk_coreSay '" << line << "'" << Logger::endl;

  if (in2Ctx != nullptr) {
    in2Ctx->pushLine(line);
  }

  return 0;
}

static duk_ret_t duk_coreChoose(duk_context* ctx) {
  const int numArgs = duk_get_top(ctx);
  const int ctxId = static_cast<int>(duk_to_number(ctx, 0));

  auto in2Ctx = getIn2Context(ctxId);
  if (in2Ctx == nullptr) {
    return 0;
  }

  in2Ctx->resetChoices();

  for (int i = 1; i < numArgs; i += 2) {
    const std::string line = duk_to_string(ctx, i);
    const std::string id = duk_to_string(ctx, i + 1);

    // in2Ctx->pushLine(line);
    in2Ctx->pushChoice(In2Choice{line, id});
  }

  return 0;
}

static duk_ret_t duk_coreGet(duk_context* ctx) {
  const int ctxId = static_cast<int>(duk_to_number(ctx, 0));
  const std::string key = duk_to_string(ctx, 1);

  auto in2Ctx = getIn2Context(ctxId);
  if (in2Ctx == nullptr) {
    duk_push_string(ctx, "");
    return 1;
  }

  duk_push_string(ctx, in2Ctx->getStorage(key).c_str());
  return 1;
}

static duk_ret_t duk_coreSet(duk_context* ctx) {
  const int ctxId = static_cast<int>(duk_to_number(ctx, 0));
  const std::string key = duk_to_string(ctx, 1);
  const std::string strValue = duk_to_string(ctx, 2);

  auto in2Ctx = getIn2Context(ctxId);
  if (in2Ctx == nullptr) {
    return 0;
  }

  in2Ctx->setStorage(key, strValue);

  return 0;
}

static duk_ret_t duk_setWaitingForResume(duk_context* ctx) {
  const int ctxId = static_cast<int>(duk_to_number(ctx, 0));

  auto in2Ctx = getIn2Context(ctxId);
  if (in2Ctx == nullptr) {
    Logger(LogType::ERROR) << "Failed to duk_setWaitingForResume no ctx found."
                           << Logger::endl;
    return 0;
  }

  in2Ctx->waitingForResume = true;
  Logger(LogType::DEBUG) << "Waiting for resume..." << Logger::endl;
  return 0;
}

static duk_ret_t duk_setWaitingForChoice(duk_context* ctx) {
  const int ctxId = static_cast<int>(duk_to_number(ctx, 0));

  auto in2Ctx = getIn2Context(ctxId);
  if (in2Ctx == nullptr) {
    Logger(LogType::ERROR) << "Failed to duk_setWaitingForChoice no ctx found."
                           << Logger::endl;
    return 0;
  }

  in2Ctx->waitingForChoice = true;
  Logger(LogType::DEBUG) << "Waiting for choice..." << Logger::endl;
  return 0;
}

static duk_ret_t duk_setExecutionCompleted(duk_context* ctx) {
  const int ctxId = static_cast<int>(duk_to_number(ctx, 0));

  auto in2Ctx = getIn2Context(ctxId);
  if (in2Ctx == nullptr) {
    Logger(LogType::ERROR)
        << "Failed to duk_setExecutionCompleted no ctx found." << Logger::endl;
    return 0;
  }

  in2Ctx->executionCompleted = true;
  Logger(LogType::DEBUG) << "Execution Completed." << Logger::endl;
  return 0;
}

In2Context::In2Context() {
  registerIn2Context(this);
  id = in2InstanceIdCtr++;
  dukCtx = nullptr;
  jsonState = nullptr;
}

In2Context::~In2Context() {
  cleanCtx();
  deregisterIn2Context(this);
}

void In2Context::createNewCtx() {
  cleanCtx();

  executionCompleted = false;
  waitingForChoice = false;
  waitingForResume = false;

  dukCtx = duk_create_heap(NULL, NULL, NULL, NULL, handleDukError);
  jsonState = new json();
  auto ctx = castDukCtx(dukCtx);

  duk_push_c_function(ctx, duk_log, 2);
  duk_put_global_string(ctx, "log");
  duk_push_c_function(ctx, duk_coreSay, 3);
  duk_put_global_string(ctx, "cpp_say");
  duk_push_c_function(ctx, duk_coreChoose, DUK_VARARGS);
  duk_put_global_string(ctx, "cpp_choose");
  duk_push_c_function(ctx, duk_coreSet, 3);
  duk_put_global_string(ctx, "cpp_setString");
  duk_push_c_function(ctx, duk_coreGet, 2);
  duk_put_global_string(ctx, "cpp_getString");
  duk_push_c_function(ctx, duk_setWaitingForResume, 1);
  duk_put_global_string(ctx, "cpp_setWaitingForResume");
  duk_push_c_function(ctx, duk_setWaitingForChoice, 1);
  duk_put_global_string(ctx, "cpp_setWaitingForChoice");
  duk_push_c_function(ctx, duk_setExecutionCompleted, 1);
  duk_put_global_string(ctx, "cpp_setExecutionCompleted");

  Logger(LogType::DEBUG) << "Eval core src." << Logger::endl;
  duk_eval_string_noresult(ctx, getIn2CoreSrc().c_str());

  Logger(LogType::DEBUG) << "Eval compiled src." << Logger::endl;
  duk_eval_string_noresult(ctx, getIn2CompiledSrc().c_str());

  std::stringstream ss;
  ss << "core.init(" << id << ");";
  Logger(LogType::DEBUG) << "Call core init func." << Logger::endl;
  duk_eval_string_noresult(ctx, ss.str().c_str());
}

void In2Context::cleanCtx() {
  choices = {};
  lines = {};

  executionCompleted = false;
  waitingForChoice = false;
  waitingForResume = false;

  if (dukCtx != nullptr) {
    duk_destroy_heap(castDukCtx(dukCtx));
    dukCtx = nullptr;
  }
  if (jsonState != nullptr) {
    // NOLINTNEXTLINE(cppcoreguidelines-owning-memory)
    delete castJsonState(jsonState);
    jsonState = nullptr;
  }
}

void In2Context::executeFile(const std::string& fileName) {
  executionCompleted = false;
  auto ctx = castDukCtx(dukCtx);
  std::stringstream ss;
  ss << "fromCpp_runFile('" << fileName << ".json');";
  Logger(LogType::DEBUG) << "executeFile: " << ss.str() << Logger::endl;
  duk_eval_string(ctx, ss.str().c_str());
  const int result = static_cast<int>(duk_get_int(ctx, -1));
  if (result == 1) {
    executionErrored = true;
    Logger(LogType::ERROR) << "Invalid in2 file: " << fileName << Logger::endl;
  }
}

void In2Context::resumeExecution() {
  if (waitingForResume) {
    waitingForResume = false;
    auto ctx = castDukCtx(dukCtx);
    std::stringstream ss;
    ss << "fromCpp_resumeExecution();";
    Logger(LogType::DEBUG) << "resumeExecution: " << ss.str() << Logger::endl;
    duk_eval_string_noresult(ctx, ss.str().c_str());
  } else {
    Logger(LogType::WARN) << "Cannot resume execution, not waiting for resume."
                          << Logger::endl;
  }
}

void In2Context::chooseExecution(const std::string& id) {
  if (waitingForChoice) {
    waitingForChoice = false;
    auto ctx = castDukCtx(dukCtx);
    std::stringstream ss;
    ss << "fromCpp_chooseExecution('" << id << "');";
    Logger(LogType::DEBUG) << "chooseExecution: " << ss.str() << Logger::endl;
    duk_eval_string(ctx, ss.str().c_str());
    const int result = static_cast<int>(duk_get_int(ctx, -1));
    if (result == 1) {
      Logger(LogType::WARN) << "Invalid choice: " << id << Logger::endl;
      waitingForChoice = true;
    }
  } else {
    Logger(LogType::WARN) << "Cannot choose execution, not waiting for choice."
                          << Logger::endl;
  }
}

void In2Context::pushLine(const std::string& line) {
  lines.push_back(line);

  // This is temporary
  // Logger(LogType::DEBUG) << "Push line: " << line << std::endl;
}

void In2Context::pushChoice(In2Choice c) { choices.push_back(c); }
void In2Context::resetChoices() {
  choices.erase(choices.begin(), choices.end());
}

const std::vector<In2Choice>& In2Context::getChoices() { return choices; }

bool In2Context::hasChosenChoice(int index) const {
  if (index >= 0 && index <= static_cast<int>(choices.size())) {
    auto& c = choices[index];
    const auto s = getStorage("choice." + c.id);
    return s == "true";
  }
  return false;
}

std::string In2Context::getStorage(const std::string& key) const {
  auto json = castJsonState(jsonState);

  if (json == nullptr) {
    Logger(LogType::ERROR) << "Failed to getStorage no ctx has been created."
                           << Logger::endl;
    return "";
  }
  if (json->contains(key)) {
    return (*json)[key];
  }

  return "";
}

void In2Context::setStorage(const std::string& key, const std::string& value) {
  auto json = castJsonState(jsonState);

  if (json == nullptr) {
    Logger(LogType::ERROR) << "Failed to setStorage no ctx has been created."
                           << Logger::endl;
    return;
  }

  (*json)[key] = value;
}

void In2Context::logStorage() {
  auto json = castJsonState(jsonState);

  if (json == nullptr) {
    Logger(LogType::INFO) << "No storage" << std::endl;
  } else {
    Logger(LogType::INFO) << std::setw(4) << json->dump() << Logger::endl;
  }
}

bool In2Context::isExecutionActive() const { return dukCtx != nullptr; }

const std::vector<std::string>& In2Context::getLines() { return lines; }
const std::vector<std::string> In2Context::getNextLines() {
  std::vector<std::string> ret;
  const int sz = static_cast<int>(lines.size());
  for (int i = lastLineRetrieved; i < sz; i++) {
    ret.push_back(lines[i]);
  }
  lastLineRetrieved = sz;
  return ret;
}

} // namespace in2
}; // namespace snw