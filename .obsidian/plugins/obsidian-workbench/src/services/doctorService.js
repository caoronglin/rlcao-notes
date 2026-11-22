"use strict";

const fs = require("fs");
const path = require("path");

const RECOMMENDED_GITIGNORE_ENTRIES = [
  "# Obsidian Workbench 安全忽略规则（避免泄露同步插件凭证与缓存）",
  ".obsidian/plugins/nutstore-sync/data.json",
  ".obsidian/plugins/remotely-save/data.json",
  ".obsidian/workspace.json",
  ".obsidian/workspace-mobile.json",
  ".owb-backups/",
  "*.tar.gz"
];

function safeReadJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

/**
 * 静态巡检当前 Vault 的配置健康度与 Git 凭证泄露风险。
 */
async function diagnoseVault(vaultBasePath, gitService) {
  const issues = [];
  const obsDir = path.join(vaultBasePath, ".obsidian");

  if (!fs.existsSync(obsDir)) {
    issues.push({
      severity: "error",
      code: "NO_OBSIDIAN_DIR",
      message: "未检测到 .obsidian 目录",
      fixable: false
    });
    return issues;
  }

  // 1. 悬空 CSS snippet
  const appearance = safeReadJson(path.join(obsDir, "appearance.json"), {});
  const snippetsDir = path.join(obsDir, "snippets");
  const danglingSnippets = [];
  for (const name of appearance.enabledCssSnippets || []) {
    if (!fs.existsSync(path.join(snippetsDir, `${name}.css`))) {
      danglingSnippets.push(name);
    }
  }
  if (danglingSnippets.length) {
    issues.push({
      severity: "error",
      code: "DANGLING_SNIPPETS",
      message: `appearance.json 启用了不存在的 CSS 片段：${danglingSnippets.join(", ")}`,
      fixable: true,
      meta: { danglingSnippets }
    });
  }

  // 2. 旧版错误 QuickAdd 快捷键或非数组格式
  //
  // 2026-11-22 修正：原规则「凡 quickadd: 开头但非 choice: 前缀就报错」是误报。
  // QuickAdd 自身注册了 quickadd:runQuickAdd（打开菜单）等内置命令，它们合法；
  // 真正会静默失效的是「quickadd:choice:<不存在的 id>」和旧的 quickadd:<名字> 写法。
  const QUICKADD_BUILTIN = new Set([
    "quickadd:runQuickAdd",
    "quickadd:openQuickAddSettings",
    "quickadd:openSettings"
  ]);
  const quickAddChoices = new Set(
    (
      (safeReadJson(path.join(obsDir, "plugins/quickadd/data.json"), {}) || {}).choices || []
    ).map((c) => c && c.id).filter(Boolean)
  );
  const hotkeys = safeReadJson(path.join(obsDir, "hotkeys.json"), {});
  for (const [cmdId, val] of Object.entries(hotkeys)) {
    if (cmdId.startsWith("quickadd:") && !cmdId.startsWith("quickadd:choice:") && !QUICKADD_BUILTIN.has(cmdId)) {
      issues.push({
        severity: "error",
        code: "LEGACY_QUICKADD_HOTKEY",
        message: `快捷键 ${cmdId} 不是合法 QuickAdd 命令（缺 choice: 前缀或 id），会静默失效`,
        fixable: false
      });
    }
    if (cmdId.startsWith("quickadd:choice:") && quickAddChoices.size) {
      const id = cmdId.slice("quickadd:choice:".length);
      if (!quickAddChoices.has(id)) {
        issues.push({
          severity: "warning",
          code: "DANGLING_QUICKADD_CHOICE",
          message: `快捷键绑定的 QuickAdd choice 不存在：${id}`,
          fixable: false
        });
      }
    }
    if (!Array.isArray(val)) {
      issues.push({
        severity: "error",
        code: "INVALID_HOTKEY_SCHEMA",
        message: `快捷键 ${cmdId} 的值不是数组，Obsidian 可能忽略该绑定`,
        fixable: false
      });
    }
  }

  // 3. 未启用孤儿插件目录
  const enabledPlugins = new Set(safeReadJson(path.join(obsDir, "community-plugins.json"), []));
  const pluginsDir = path.join(obsDir, "plugins");
  if (fs.existsSync(pluginsDir)) {
    const dirs = fs.readdirSync(pluginsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
    const orphan = dirs.map((d) => d.name).filter((name) => !enabledPlugins.has(name));
    if (orphan.length) {
      issues.push({
        severity: "warn",
        code: "DISABLED_PLUGIN_DIRS",
        message: `存在 ${orphan.length} 个未启用插件目录（可按需清理）：${orphan.join(", ")}`,
        fixable: false
      });
    }
  }

  // 4. Git 敏感凭证保护检查
  if (gitService && (await gitService.isGitRepo())) {
    const tracked = await gitService.listTrackedSensitiveFiles([
      ".obsidian/plugins/nutstore-sync/data.json",
      ".obsidian/plugins/remotely-save/data.json"
    ]);
    if (tracked.length) {
      issues.push({
        severity: "error",
        code: "GIT_TRACKING_SECRETS",
        message: `Git 正在追踪可能包含 OAuth/API 凭证的文件：${tracked.join(", ")}`,
        fixable: false
      });
    }

    const giPath = path.join(vaultBasePath, ".gitignore");
    const giText = fs.existsSync(giPath) ? fs.readFileSync(giPath, "utf8") : "";
    if (!giText.includes("nutstore-sync/data.json")) {
      issues.push({
        severity: "warn",
        code: "GITIGNORE_INCOMPLETE",
        message: ".gitignore 缺少同步插件凭证与工作区缓存忽略规则",
        fixable: true
      });
    }
  }

  return issues;
}

/**
 * 一键追加推荐的 .gitignore 保护规则。
 */
function ensureSafeGitignore(vaultBasePath) {
  const giPath = path.join(vaultBasePath, ".gitignore");
  const current = fs.existsSync(giPath) ? fs.readFileSync(giPath, "utf8") : "";
  const linesToAdd = RECOMMENDED_GITIGNORE_ENTRIES.filter((line) => !current.includes(line));
  if (!linesToAdd.length) return false;
  const prefix = current && !current.endsWith("\n") ? "\n\n" : current ? "\n" : "";
  fs.writeFileSync(giPath, `${current}${prefix}${linesToAdd.join("\n")}\n`, "utf8");
  return true;
}

module.exports = {
  diagnoseVault,
  ensureSafeGitignore
};
