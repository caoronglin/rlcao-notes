"use strict";

/**
 * Node 环境下的 obsidian API 最小桩：
 * 仅提供插件 services 在测试中用到的纯函数与空类。
 */

function normalizePath(p) {
  return String(p).replace(/\\/g, "/").replace(/\/+/g, "/").replace(/\/$/, "");
}

class Notice {
  constructor(message) {
    this.message = String(message);
  }
  setText(t) {
    this.message = String(t);
    return this;
  }
  hide() {
    return this;
  }
}

class EmptyClass {
  constructor() {}
}

module.exports = {
  normalizePath,
  Notice,
  Modal: EmptyClass,
  PluginSettingTab: EmptyClass,
  Plugin: EmptyClass,
  ItemView: EmptyClass,
  Setting: EmptyClass,
  MarkdownRenderer: {},
  TFile: EmptyClass,
  TFolder: EmptyClass
};
