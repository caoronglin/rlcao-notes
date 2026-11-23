"use strict";

const { Modal, Notice, Setting } = require("obsidian");
const { ask } = require("../services/decisionService");

/**
 * Jev / Clef 决策弹窗。
 * 场景（内置 + 自定义 JSON）：
 *  1. 闪念归类   choice：这条内容该进哪个知识区
 *  2. 笔记评分   score ：信息密度 1-10
 *  3. 自由判断   noul ：是否需要今天处理
 *  4. 自定义     直接编辑 questions JSON（choice/noul/score 任意组合）
 */

const SCENARIOS = {
  classify: {
    label: "闪念/笔记归类（choice）",
    buildQuestions: () => ({
      area: {
        type: "choice",
        instructions: "这条内容最应该归入哪个知识区？",
        criteria: {
          inbox: "尚未成型，先进收件箱",
          study: "学习笔记与课程相关",
          project: "某个具体项目或实验的一部分",
          reference: "参考资料/文献，暂不加工",
          life: "生活、健康或与知识库无关"
        }
      }
    })
  },
  score: {
    label: "信息密度评分（score 1-10）",
    buildQuestions: () => ({
      quality: {
        type: "score",
        instructions: "评估这段笔记的信息密度与结构质量",
        criteria: [
          { value: 1, description: "空洞，几乎无可复用信息" },
          { value: 5, description: "中等，有信息但结构松散" },
          { value: 10, description: "密度极高，结构清晰可复用" }
        ]
      }
    })
  },
  today: {
    label: "今日是否处理（noul）",
    buildQuestions: () => ({
      needAttention: {
        type: "noul",
        instructions: "这条内容今天需要被处理吗？只有有时效或有明确下一步时才为真。"
      }
    })
  }
};

class JevModal extends Modal {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.scenario = "classify";
    this.stateText = "";
    this.result = null;
  }

  async onOpen() {
    // 默认带当前笔记内容
    const active = this.app.workspace.getActiveFile();
    if (active && active.extension === "md") {
      try {
        const content = await this.app.vault.cachedRead(active);
        this.stateText = content.slice(0, 4000);
        this.activePath = active.path;
      } catch (e) {
        /* ignore */
      }
    }
    this.render();
  }

  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-jev-modal");

    contentEl.createEl("h2", { text: "⚖️ Jev / Clef 决策" });
    contentEl.createDiv({
      cls: "owb-muted",
      text: `网关：${this.plugin.settings.decisionEndpoint} · 模型：${this.plugin.settings.decisionModel}`
    });

    new Setting(contentEl)
      .setName("决策场景")
      .addDropdown((d) => {
        for (const [k, v] of Object.entries(SCENARIOS)) {
          d.addOption(k, v.label);
        }
        d.addOption("custom", "自定义 questions JSON");
        d.setValue(this.scenario);
        d.onChange(async (v) => {
          this.scenario = v;
          this.result = null;
          this.render();
        });
      });

    new Setting(contentEl)
      .setName("State（决策依据）")
      .setDesc(
        this.activePath
          ? "已带入当前笔记前 4000 字：" + this.activePath
          : "无打开的笔记，请手动粘贴内容"
      )
      .addTextArea((t) => {
        t.setValue(this.stateText).onChange((v) => (this.stateText = v));
        t.inputEl.rows = 6;
        t.inputEl.style.width = "100%";
      });

    if (this.scenario === "custom") {
      new Setting(contentEl)
        .setName("questions JSON")
        .setDesc('形如 {"area":{"type":"choice","instructions":"…","criteria":{"a":"…"}}}')
        .addTextArea((t) => {
          t.setValue(this.customJson || '{\n  "key": {\n    "type": "choice",\n    "instructions": "问题说明",\n    "criteria": { "yes": "……", "no": "……" }\n  }\n}');
          t.inputEl.rows = 8;
          t.inputEl.style.width = "100%";
          t.inputEl.style.fontFamily = "monospace";
          t.onChange((v) => (this.customJson = v));
        });
    }

    const footer = contentEl.createDiv({ cls: "owb-jev-footer" });
    const sendBtn = footer.createEl("button", { cls: "mod-cta", text: "发起决策" });
    sendBtn.addEventListener("click", () => this.decide());

    if (this.result) {
      const box = contentEl.createDiv({ cls: "owb-jev-result" });
      for (const [key, a] of Object.entries(this.result.answers)) {
        const row = box.createDiv({ cls: "owb-jev-answer" });
        row.createSpan({ text: key + " → " });
        row.createEl("strong", { text: String(a.value) });
        row.createSpan({
          cls: "owb-muted",
          text: ` · 置信度 ${a.confidence !== null ? (a.confidence * 100).toFixed(0) + "%" : "-"} · 类型 ${a.type}`
        });
      }
      const raw = box.createEl("pre", { cls: "owb-jev-raw" });
      raw.setText(JSON.stringify(this.result.raw, null, 2));
    }
  }

  async decide() {
    if (!String(this.stateText || "").trim()) {
      new Notice("请先填入 State 内容");
      return;
    }
    let questions;
    const types = {};
    if (this.scenario === "custom") {
      try {
        questions = JSON.parse(this.customJson || "{}");
        for (const k of Object.keys(questions)) types[k] = questions[k].type || "choice";
      } catch (e) {
        new Notice("questions JSON 解析失败：" + e.message);
        return;
      }
    } else {
      questions = SCENARIOS[this.scenario].buildQuestions();
      for (const k of Object.keys(questions)) types[k] = questions[k].type;
    }
    if (!Object.keys(questions).length) {
      new Notice("questions 不能为空");
      return;
    }

    new Notice("决策中…（本机网关）");
    try {
      const state = { message: this.stateText };
      this.result = await ask(state, questions, this.plugin.settings, { questionTypes: types });
      if (!Object.keys(this.result.answers).length) {
        new Notice("网关没有返回 answers，原始结果见弹窗", 6000);
      }
    } catch (err) {
      this.result = null;
      new Notice("决策失败：" + err.message, 8000);
    }
    this.render();
  }
}

module.exports = { JevModal };
