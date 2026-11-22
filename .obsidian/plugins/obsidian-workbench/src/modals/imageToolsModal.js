"use strict";

const { Modal, Notice, Setting } = require("obsidian");
const {
  engineInfo,
  collectImages,
  convertFiles,
  saveImage,
  assetDirFor,
  SUPPORTED_OUT,
  DEFAULT_FORMAT
} = require("../services/imageService");
const { fmtSize } = require("./attachmentModal");

/**
 * 图片工具：引擎状态 + 粘贴/选择上传存档 + 批量格式转换与压缩。
 */
class ImageToolsModal extends Modal {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.format = DEFAULT_FORMAT; // avif
    this.quality = 60;            // AVIF 60 ≈ WebP 82 的观感
    this.maxWidth = 1600;
    this.scope = "";
    this.progress = "";
    this.lastResults = null;
  }

  async onOpen() {
    this.render();
  }

  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("owb-img-modal");

    contentEl.createEl("h2", { text: "🖼️ 图片工具" });

    // ── 引擎状态 ──
    const info = engineInfo();
    const engineBox = contentEl.createDiv({ cls: "owb-img-engine" });
    if (info.engine === "sharp") {
      engineBox.createDiv({
        cls: "owb-muted",
        text: `转换引擎：sharp（libvips ${info.libvips || "?"}）· 支持 ${info.formats.join(" / ")}`
      });
    } else {
      engineBox.createDiv({
        cls: "owb-muted owb-img-err",
        text:
          "⚠️ 当前默认格式为 AVIF，但未加载 sharp，AVIF 转换将失败。" +
          "请在插件目录执行：npm i sharp，然后重启 Obsidian。"
      });
      engineBox.createDiv({
        cls: "owb-muted",
        text: "临时替代：把下方「目标格式」改为 webp 或 jpeg（Canvas 兜底可用）。"
      });
      if (info.error) {
        engineBox.createDiv({ cls: "owb-muted owb-img-err", text: "sharp 未加载：" + info.error.slice(0, 120) });
      }
    }

    // ── 上传存档 ──
    contentEl.createEl("h3", { text: "上传与存档" });
    const upRow = contentEl.createDiv({ cls: "owb-img-row" });
    const fileInput = upRow.createEl("input", {
      attr: { type: "file", accept: "image/*", multiple: "true" }
    });
    fileInput.style.display = "none";
    const pickBtn = upRow.createEl("button", { cls: "mod-cta", text: "选择图片存档" });
    pickBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", async () => {
      const files = Array.from(fileInput.files || []);
      if (!files.length) return;
      await this.uploadFiles(files);
      fileInput.value = "";
    });
    upRow.createDiv({
      cls: "owb-muted",
      text: `落盘目录 ${assetDirFor()} · 可直接把图片拖进此弹窗`
    });

    // 拖放
    contentEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      contentEl.addClass("owb-img-drop");
    });
    contentEl.addEventListener("dragleave", () => contentEl.removeClass("owb-img-drop"));
    contentEl.addEventListener("drop", async (e) => {
      e.preventDefault();
      contentEl.removeClass("owb-img-drop");
      const files = Array.from((e.dataTransfer && e.dataTransfer.files) || []).filter((f) =>
        String(f.type).startsWith("image/")
      );
      if (files.length) await this.uploadFiles(files);
    });

    // ── 批量转换 ──
    contentEl.createEl("h3", { text: "批量格式转换与压缩" });

    new Setting(contentEl)
      .setName("目标格式")
      .addDropdown((d) => {
        for (const f of SUPPORTED_OUT) d.addOption(f, f.toUpperCase());
        d.setValue(this.format);
        d.onChange((v) => (this.format = v));
      })
      .addText((t) => {
        t.setPlaceholder("质量 1-100").setValue(String(this.quality));
        t.onChange((v) => (this.quality = Math.max(1, Math.min(100, Number(v) || 82))));
        t.inputEl.type = "number";
        t.inputEl.style.width = "80px";
      });

    new Setting(contentEl)
      .setName("最大宽度（像素，0 = 不缩放）")
      .addText((t) => {
        t.setValue(String(this.maxWidth));
        t.onChange((v) => (this.maxWidth = Math.max(0, Number(v) || 0)));
        t.inputEl.type = "number";
      });

    new Setting(contentEl)
      .setName("扫描范围")
      .setDesc("留空 = 全库；或填 assets / notes/生信实验 等目录前缀")
      .addText((t) => {
        t.setPlaceholder("assets");
        t.onChange((v) => (this.scope = v.trim()));
      });

    const runRow = contentEl.createDiv({ cls: "owb-img-row" });
    const preview = runRow.createEl("button", { text: "统计可转换图片" });
    const runBtn = runRow.createEl("button", { cls: "mod-cta", text: "开始转换" });
    preview.addEventListener("click", () => this.preview());
    runBtn.addEventListener("click", () => this.run());

    if (this.progress) {
      contentEl.createDiv({ cls: "owb-muted owb-img-progress", text: this.progress });
    }
    if (this.lastResults) this.renderResults(contentEl, this.lastResults);
  }

  async uploadFiles(files) {
    const out = [];
    try {
      for (const f of files) {
        const res = await saveImage(this.app, f, {
          name: f.name || `pasted-${Date.now()}.png`,
          format: this.format,
          quality: this.quality,
          maxWidth: this.maxWidth
        });
        out.push(res);
      }
      new Notice(
        `已存档 ${out.length} 张 → ${assetDirFor()}（引擎 ${out[0] ? out[0].engine : "-"}）`,
        6000
      );
      // 在当前笔记光标处插入嵌入
      const leaf = this.app.workspace.getMostRecentLeaf();
      if (leaf && leaf.view && typeof leaf.view.editor !== "undefined" && leaf.view.editor) {
        const link = out.map((r) => `![[${r.path}]]`).join("\n");
        leaf.view.editor.replaceSelection(link);
      }
    } catch (e) {
      new Notice("上传失败：" + e.message, 8000);
    }
  }

  preview() {
    const imgs = collectImages(this.app, this.scope);
    const total = imgs.reduce((s, f) => s + (f.stat ? f.stat.size : 0), 0);
    this.progress = `范围内可转换图片 ${imgs.length} 个，合计 ${fmtSize(total)}`;
    this.render();
  }

  async run() {
    const imgs = collectImages(this.app, this.scope);
    if (!imgs.length) {
      new Notice("该范围内没有可转换的图片");
      return;
    }
    this.progress = `转换中 0/${imgs.length}`;
    this.render();
    const results = await convertFiles(
      this.app,
      imgs,
      {
        format: this.format,
        quality: this.quality,
        maxWidth: this.maxWidth,
        skipSameFormat: true
      },
      (done, total, path) => {
        this.progress = `转换中 ${done}/${total} · ${path}`;
        const el = this.contentEl.querySelector(".owb-img-progress");
        if (el) el.setText(this.progress);
      }
    );
    this.lastResults = results;
    const ok = results.filter((r) => !r.error && !r.skipped);
    const saved = ok.reduce((s, r) => s + (r.saved || 0), 0);
    this.progress = `完成：转换 ${ok.length} 个，节省 ${fmtSize(saved)}`;
    new Notice(this.progress, 8000);
    this.render();
  }

  renderResults(container, results) {
    const ok = results.filter((r) => !r.error && !r.skipped);
    const skipped = results.filter((r) => r.skipped);
    const failed = results.filter((r) => r.error);
    const box = container.createDiv({ cls: "owb-img-results" });
    box.createDiv({
      cls: "owb-muted",
      text: `成功 ${ok.length} · 跳过 ${skipped.length} · 失败 ${failed.length}`
    });
    const list = box.createDiv({ cls: "owb-att-list" });
    for (const r of ok.slice(0, 40)) {
      const row = list.createDiv({ cls: "owb-att-row" });
      row.createSpan({ text: r.file.name + " → " + (r.created ? r.created.name : "") });
      row.createSpan({
        cls: "owb-muted",
        text: ` · ${fmtSize(r.from)} → ${fmtSize(r.to)}（省 ${fmtSize(r.saved)}）· ${r.engine}`
      });
    }
    for (const r of failed.slice(0, 10)) {
      const row = list.createDiv({ cls: "owb-att-row" });
      row.createSpan({ cls: "owb-img-err", text: `${r.file.name}：${r.error}` });
    }
  }
}

module.exports = { ImageToolsModal };
