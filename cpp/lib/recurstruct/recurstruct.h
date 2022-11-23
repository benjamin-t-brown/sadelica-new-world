#pragma once

#include <map>
#include <string>
#include <vector>

class RecurStructNode {
  std::string str;
  double number;
  bool boolean;
  RecurStructNode* node;
};

class RecurStruct {
  std::vector<std::string> strings;
  std::vector<double> doubles;
  std::vector<bool> bools;
  std::vector<RecurStruct> structs;

  std::map<std::string, RecurStructNode> mapping;

  RecurStruct();
  ~RecurStruct();

  void serialize();

  template <class T> T get(const std::string key);
  template <class T> void set(const std::string key, T value);
};