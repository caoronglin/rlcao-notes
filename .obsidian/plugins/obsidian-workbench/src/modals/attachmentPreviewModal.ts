"use strict";

import { Modal, Notice, type App, type Plugin, type TFile } from "obsidian";

/**
 * 附件预览（open-file-viewer 优先，原生回退）。
 *
 * open-file-viewer（xushanpei/open-file-viewer）是框架无关的预览 SDK，
 * 提供 PDF / Office / 图片 / 音视频 / 压缩包 / 邮件 / 3D / GIS 的统一容器。
 * 它需要以 npm 包形式安装后才能在本插件内使用：
 *     cd .obsidian/plugins/obsidian-workbench && npm i @open-file-viewer/core
 * 未安装时自动回退到原生预览（图片 / PDF / 音视频 / 文本代码 / Markdown）。
 */

interface OfvLike {
  createViewer(host: HTMLElement, opts: { url: string; fileName: string; theme?: string }): void;
}

let ofvModule: OfvLike | null | undefined;
let ofvError = "";
let pluginDir = "";

export function setPluginDir(dir: string): void {
  pluginDir = String(dir || "");
  ofvModule = undefined;
}

export function loadOpenFileViewer(): OfvLike | null | undefined {
  if (ofvModule !== undefined) return ofvModule;
  const attempts = [() => require("@open-file-viewer/core")];
  if (pluginDir && pluginDir.startsWith("/")) {
    attempts.push(() => {
      const p = require("path");
      return require(p.join(pluginDir, "node_modules", "@open-file-viewer", "core"));
    });
  }
  for (const fn of attempts) {
    try {
      ofvModule = fn();
      ofvError = "";
      return ofvModule;
    } catch (e) {
      ofvError = String((e as Error)?.message || e);
    }
  }
  ofvModule = null;
  return ofvModule;
}

const KIND: Record<string, string[]> = {
  image: ["png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg"],
  video: ["mp4", "webm", "ogv", "mov"],
  audio: ["mp3", "wav", "ogg", "m4a", "flac"],
  pdf: ["pdf"],
  text: ["txt", "log", "json", "yaml", "yml", "toml", "ini", "conf", "csv", "tsv"],
  code: ["js", "mjs", "cjs", "ts", "py", "r", "sh", "bash", "c", "h", "cpp", "java", "go", "rs", "sql", "html", "css", "xml"],
  markdown: ["md"],
  office: ["docx", "doc", "xlsx", "xls", "pptx", "ppt", "odt", "ods"],
  archive: ["zip", "tar", "gz", "7z", "rar"]
};

function kindOf(ext: string | undefined): string {
  const e = String(ext || "").toLowerCase();
  for (const [k, list] of Object.entries(KIND)) if (list.includes(e)) return k;
  return "other";
}

/** 构造 Obsidian 资源 URL（vault adapter 已处理编码） */
function resourceUrl(app: App, file: TFile): string {
  try {
    if (app.vault.adapter && typeof app.vault.adapter.getResourcePath === "function") {
      return app.vault.adapter.getResourcePath(file.path);
    }
  } catch (e) {
    /* ignore */
  }
  return file.path;
}

/**
 * 渲染预览内容到容器。
 * 返回 { usedEngine: "open-file-viewer" | "native", kind }
 */
async function renderPreview(app: App, file: TFile, container: HTMLElement): Promise<{ usedEngine: string; kind: string; ofvError?: string }> {
  container.empty();
  const kind = kindOf(file.extension);
  const url = resourceUrl(app, file);

  // 复杂格式优先交给 open-file-viewer
  const ofv = loadOpenFileViewer();
  const ofvKind = ["office", "archive", "other", "pdf"].includes(kind);
  if (ofv && ofvKind && typeof ofv.createViewer === "function") {
    try {
      const host = container.createDiv({ cls: "owb-ofv-host" });
      ofv.createViewer(host, { url, fileName: file.name, theme: "auto" });
      return { usedEngine: "open-file-viewer", kind };
    } catch (e) {
      ofvError = String((e as Error)?.message);
    }
  }

  if (kind === "image") {
    const img = container.createEl("img", { cls: "owb-preview-media" });
    img.src = url;
  } else if (kind === "pdf") {
    const frame = container.createEl("iframe", { cls: "owb-preview-frame" });
    frame.src = url;
  } else if (kind === "video") {
    const v = container.createEl("video", { cls: "owb-preview-media", attr: { controls: "controls" } });
    v.src = url;
  } else if (kind === "audio") {
    const a = container.createEl("audio", { attr: { controls: "controls" }, cls: "owb-preview-audio" });
    a.src = url;
  } else if (kind === "text" || kind === "code" || kind === "markdown") {
    let text = "";
    try {
      text = await app.vault.read(file);
    } catch (e) {
      text = "(读取失败：" + (e as Error)?.message + ")";
    }
    const pre = container.createEl("pre", { cls: "owb-preview-code" });
    pre.setText(text.length > 200000 ? text.slice(0, 200000) + "\n…(已截断)" : text);
  } else {
    const box = container.createDiv({ cls: "owb-empty-slot" });
    box.setText(
      `${file.extension.toUpperCase()} 需要 open-file-viewer 才能内嵌预览。` +
        `安装：cd .obsidian/plugins/obsidian-workbench && npm i @open-file-viewer/core`
    );
    const open = container.createEl("button", { text: "用系统默认应用打开" });
    open.addEventListener("click", async () => {
      try {
        const electron = require("electron");
        await electron.shell.openPath(resourceUrl(app, file));
      } catch (e) {
        new Notice("无法调用系统应用：" + (e as Error)?.message);
      }
    });
  }
  return { usedEngine: "native", kind, ofvError };
}

class AttachmentPreviewModal extends Modal {
  plugin: Plugin;
  file: TFile;

  constructor(app: App, plugin: Plugin, file: TFile) {
    super(app);
    this.file = file;
    this.plugin = plugin;
  }

  async onOpen() {
    const { contentEl, titleEl } = this;
    titleEl.setText(this.file.name);
    contentEl.addClass("owb-preview-modal");
    const meta = contentEl.createDiv({ cls: "owb-muted" });
    const kb = this.file.stat ? (this.file.stat.size / 1024).toFixed(1) : "?";
    meta.setText(`${this.file.path} · ${kb} KB`);
    const body = contentEl.createDiv({ cls: "owb-preview-body" });
    const res = await renderPreview(this.app, this.file, body);
    if (res.usedEngine === "native" && res.ofvError && ["office", "archive", "other"].includes(res.kind)) {
      contentEl.createDiv({ cls: "owb-muted", text: "open-file-viewer 未加载：" + res.ofvError.slice(0, 120) });
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}

export {
  KIND,
  kindOf,
  renderPreview,
  resourceUrl,
  AttachmentPreviewModal
};
