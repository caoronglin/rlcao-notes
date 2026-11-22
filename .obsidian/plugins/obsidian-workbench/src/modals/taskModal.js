"use strict";

const { Modal, Notice, normalizePath } = require("obsidian");
const { formatDate } = require("../utils");
const { toggleTaskInFile } = require("../services/vaultStats");

/**
 * 任务中心：全库未完成任务聚合 + 新建 + 勾选完成。
 * 勾选复用 vaultStats 的 toggleTaskInFile（原地改行，保持 frontmatter/列表上下文）。
 */

const MAX_SCAN = 300;

async function scanAllTasks(app, settings) {
  const tasks = [];
  const files = app.vault.getMarkdownFiles();
  const folders = String(settings.tasksScanFolders || "").trim();

  for (const file of files) {
    const path = file.path;
    if (path.startsWith(".obsidian/") || path.startsWith(".trash/")) continue;
    if (folders) {
      const roots = folders.split(",").map((x) => x.trim()).filter(Boolean);
      if (roots.length && !roots.some((r) => path === r || path.startsWith(r + "/"))) continue;
    }
    let content;
    try {
      content = await app.vault.cachedRead(file);
    } catch (e) {
      continue;
    }
    let inFence = false;
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith("```")) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;
      const m = line.match(/^(\s*)- \[ \] (.*)$/);
      if (m) {
        tasks.push({ file, line: i, text: m[2].trim(), indent: m[1].length });
        if (tasks.length >= MAX_SCAN) return tasks;
      }
    }
  }
  return tasks;
}

class TaskCenterModal extends Modal {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  async onOpen() {
    await this.render();
  }

  async render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-task-modal");

    contentEl.createEl("h2", { text: "📋 任务中心" });

    // 新建行
    const addRow = contentEl.createDiv({ cls: "owb-task-add" });
    const input = addRow.createEl("input", {
      cls: "owb-rag-input",
      attr: { type: "text", placeholder: "新任务，回车保存到 " + this.plugin.settings.tasksPath }
    });
    input.addEventListener("keydown", async (ev) => {
      if (ev.key !== "Enter") return;
      const text = input.value.trim();
      if (!text) return;
      try {
        await this.addTask(text);
        input.value = "";
        await this.render();
      } catch (err) {
        new Notice("写入失败：" + err.message);
      }
    });

    const tasks = await scanAllTasks(this.app, this.plugin.settings);
    const count = contentEl.createDiv({
      cls: "owb-muted",
      text: tasks.length >= MAX_SCAN ? `仅显示前 ${MAX_SCAN} 条（全库更多）` : `全库未完成 ${tasks.length} 条`
    });

    if (!tasks.length) {
      contentEl.createDiv({ cls: "owb-muted", text: "🎉 没有待办任务" });
      return;
    }

    // 按文件分组
    const groups = new Map();
    for (const t of tasks) {
      const g = t.file.parent ? t.file.parent.path || "(根目录)" : "(根目录)";
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(t);
    }

    for (const [folder, list] of groups) {
      const section = contentEl.createDiv({ cls: "owb-task-group" });
      section.createDiv({
        cls: "owb-task-folder",
        text: `${folder} (${list.length})`
      });
      for (const t of list) {
        const row = section.createDiv({ cls: "owb-task-row" });
        row.style.paddingLeft = String(4 + Math.min(t.indent, 8) * 6) + "px";
        const cb = row.createEl("input", { attr: { type: "checkbox" } });
        cb.addEventListener("change", async () => {
          try {
            await toggleTaskInFile(this.app, t.file, t.line);
            new Notice("✓ 已完成：" + t.text.slice(0, 30));
            await this.render();
          } catch (err) {
            new Notice("更新失败：" + err.message);
            await this.render();
          }
        });
        const link = row.createEl("a", { cls: "owb-link", text: t.text.slice(0, 64) });
        link.addEventListener("click", () => this.app.workspace.getLeaf(false).openFile(t.file));
      }
    }
  }

  async addTask(text) {
    const { tasksPath } = this.plugin.settings;
    const target = normalizePath(tasksPath || "vault/任务.md");
    let file = this.app.vault.getAbstractFileByPath(target);
    const line = `- [ ] ${text}`;
    if (!file) {
      const folder = target.slice(0, target.lastIndexOf("/"));
      if (folder && !this.app.vault.getAbstractFileByPath(normalizePath(folder))) {
        await this.app.vault.createFolder(normalizePath(folder));
      }
      const today = formatDate(new Date(), "YYYY-MM-DD");
      file = await this.app.vault.create(
        target,
        `---\ntags: [tasks]\ncreated: ${today}\n---\n\n# 任务\n\n${line}\n`
      );
    } else {
      const content = await this.app.vault.read(file);
      await this.app.vault.process(file, (old) => {
        // 插在 frontmatter 之后 / 标题之后，无则置顶
        const lines = old.split("\n");
        let at = 0;
        if (lines[0] === "---") {
          const end = lines.indexOf("---", 1);
          if (end > 0) at = end + 1;
        }
        lines.splice(at, 0, line);
        return lines.join("\n");
      });
    }
    new Notice("已记录：" + text.slice(0, 30));
  }
}

module.exports = { TaskCenterModal, scanAllTasks };
