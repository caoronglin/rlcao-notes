"use strict";

const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

/**
 * 零 Shell 注入的本地 Git 服务封装（支持中文路径、Stash 暂存栈、远程管理与冲突一键解决）。
 */
class GitService {
  constructor(vaultPath, options = {}) {
    this.vaultPath = vaultPath;
    this.gitBinary = options.gitBinary || "git";
    this.timeoutMs = options.timeoutMs || 30000;
  }

  async exec(args) {
    if (!this.vaultPath) {
      throw new Error("当前环境无法获取本地 Vault 路径（仅支持桌面端）");
    }
    const fullArgs = ["-c", "core.quotepath=false", ...args];
    try {
      const { stdout, stderr } = await execFileAsync(this.gitBinary, fullArgs, {
        cwd: this.vaultPath,
        timeout: this.timeoutMs,
        maxBuffer: 16 * 1024 * 1024,
        windowsHide: true
      });
      return { stdout: stdout || "", stderr: stderr || "" };
    } catch (err) {
      const detail = (err && (err.stderr || err.stdout || err.message)) || String(err);
      throw new Error(`git ${args[0]} 失败: ${detail.trim()}`);
    }
  }

  async isGitRepo() {
    try {
      const { stdout } = await this.exec(["rev-parse", "--is-inside-work-tree"]);
      return stdout.trim() === "true";
    } catch {
      return false;
    }
  }

  async initRepo() {
    await this.exec(["init"]);
  }

  async getStatus() {
    const isRepo = await this.isGitRepo();
    if (!isRepo) {
      return {
        isRepo: false,
        branch: "",
        upstream: "",
        ahead: 0,
        behind: 0,
        conflicts: [],
        staged: [],
        unstaged: []
      };
    }

    const { stdout } = await this.exec(["status", "--porcelain=v1", "-b", "-z", "-uall"]);
    return GitService.parsePorcelainZ(stdout);
  }

  static parsePorcelainZ(raw) {
    const tokens = raw.split("\0");
    let branch = "HEAD";
    let upstream = "";
    let ahead = 0;
    let behind = 0;
    const conflicts = [];
    const staged = [];
    const unstaged = [];

    let i = 0;
    if (tokens.length > 0 && tokens[0].startsWith("## ")) {
      const header = tokens[0].slice(3);
      i = 1;
      const noCommits = header.match(/^No commits yet on (.+)$/);
      if (noCommits) {
        branch = noCommits[1].trim();
      } else {
        const parts = header.split("...");
        branch = parts[0].trim();
        if (parts[1]) {
          const track = parts[1];
          const brMatch = track.match(/^([^\s]+)/);
          if (brMatch) upstream = brMatch[1];
          const ahMatch = track.match(/ahead (\d+)/);
          const bhMatch = track.match(/behind (\d+)/);
          if (ahMatch) ahead = Number(ahMatch[1]);
          if (bhMatch) behind = Number(bhMatch[1]);
        }
      }
    }

    while (i < tokens.length) {
      const entry = tokens[i++];
      if (!entry || entry.length < 3) continue;
      const x = entry[0];
      const y = entry[1];
      const filePath = entry.slice(3);
      let origPath = null;

      if (x === "R" || x === "C" || y === "R" || y === "C") {
        origPath = tokens[i++] || null;
      }

      // 识别合并冲突（UU / AA / DD / AU / UA / DU / UD）
      const isConflict =
        x === "U" || y === "U" || (x === "A" && y === "A") || (x === "D" && y === "D");
      if (isConflict) {
        conflicts.push({ path: filePath, status: `${x}${y}`, origPath });
        continue;
      }

      if (x === "?" && y === "?") {
        unstaged.push({ path: filePath, status: "??", origPath });
        continue;
      }
      if (x !== " " && x !== "?") {
        staged.push({ path: filePath, status: x, origPath });
      }
      if (y !== " " && y !== "?") {
        unstaged.push({ path: filePath, status: y, origPath });
      }
    }

    return { isRepo: true, branch, upstream, ahead, behind, conflicts, staged, unstaged };
  }

  // ── 分支操作 ──
  async listBranches() {
    const { stdout } = await this.exec(["branch", "--format=%(refname:short)\t%(HEAD)"]);
    return stdout
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [name, head] = line.split("\t");
        return { name: name.trim(), current: head === "*" };
      });
  }

  async checkoutBranch(branchName) {
    const clean = String(branchName || "").trim();
    if (!clean) throw new Error("分支名不能为空");
    await this.exec(["checkout", clean]);
  }

  async createBranch(branchName) {
    const clean = String(branchName || "").trim();
    if (!clean || /[\s~^:?*\[\\]/.test(clean)) {
      throw new Error("分支名包含非法字符或空格");
    }
    await this.exec(["checkout", "-b", clean]);
  }

  // ── 暂存 / 提交 / 同步 ──
  async stageFile(filePath) {
    await this.exec(["add", "--", filePath]);
  }

  async stageAll() {
    await this.exec(["add", "-A"]);
  }

  async unstageFile(filePath) {
    try {
      await this.exec(["restore", "--staged", "--", filePath]);
    } catch {
      await this.exec(["rm", "--cached", "--", filePath]);
    }
  }

  async unstageAll() {
    try {
      await this.exec(["reset", "HEAD"]);
    } catch {
      await this.exec(["rm", "-r", "--cached", "."]);
    }
  }

  async discardFile(filePath, isUntracked = false) {
    if (isUntracked) {
      await this.exec(["clean", "-f", "--", filePath]);
    } else {
      await this.exec(["checkout", "--", filePath]);
    }
  }

  async resolveConflict(filePath, side) {
    if (side !== "ours" && side !== "theirs") {
      throw new Error("side 必须为 ours 或 theirs");
    }
    await this.exec(["checkout", `--${side}`, "--", filePath]);
    await this.exec(["add", "--", filePath]);
  }

  async commit(message) {
    const clean = String(message || "").trim();
    if (!clean) throw new Error("提交信息不能为空");
    const { stdout } = await this.exec(["commit", "-m", clean]);
    return stdout.trim();
  }

  async pull() {
    const { stdout } = await this.exec(["pull", "--rebase", "--autostash"]);
    return stdout.trim();
  }

  async push() {
    const { stdout } = await this.exec(["push"]);
    return stdout.trim();
  }

  async pushSetUpstream(remote, branch) {
    const { stdout } = await this.exec(["push", "-u", remote, branch]);
    return stdout.trim();
  }

  // ── Stash 暂存栈 ──
  async listStashes() {
    try {
      const { stdout } = await this.exec(["stash", "list", "--pretty=format:%gd\x1f%ar\x1f%s"]);
      if (!stdout.trim()) return [];
      return stdout
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => {
          const [ref, relativeTime, message] = line.split("\x1f");
          return { ref, relativeTime, message };
        });
    } catch {
      return [];
    }
  }

  async stashPush(message = "") {
    const args = ["stash", "push", "-u"];
    if (message.trim()) args.push("-m", message.trim());
    const { stdout } = await this.exec(args);
    return stdout.trim();
  }

  async stashPop(ref = "stash@{0}") {
    const { stdout } = await this.exec(["stash", "pop", ref]);
    return stdout.trim();
  }

  async stashDrop(ref = "stash@{0}") {
    const { stdout } = await this.exec(["stash", "drop", ref]);
    return stdout.trim();
  }

  // ── 远程仓库配置 ──
  async listRemotes() {
    try {
      const { stdout } = await this.exec(["remote", "-v"]);
      const map = new Map();
      for (const line of stdout.split(/\r?\n/).filter(Boolean)) {
        const m = line.match(/^(\S+)\s+(\S+)\s+\((fetch|push)\)$/);
        if (m && !map.has(m[1])) {
          map.set(m[1], m[2]);
        }
      }
      return [...map.entries()].map(([name, url]) => ({ name, url }));
    } catch {
      return [];
    }
  }

  async setRemote(name, url) {
    const cleanName = String(name || "origin").trim();
    const cleanUrl = String(url || "").trim();
    if (!cleanName || !cleanUrl) throw new Error("远程名称与 URL 不能为空");
    const remotes = await this.listRemotes();
    if (remotes.some((r) => r.name === cleanName)) {
      await this.exec(["remote", "set-url", cleanName, cleanUrl]);
    } else {
      await this.exec(["remote", "add", cleanName, cleanUrl]);
    }
  }

  async removeRemote(name) {
    await this.exec(["remote", "remove", name]);
  }

  // ── Diff 与历史 ──
  async getDiff(filePath, staged = false) {
    const args = staged ? ["diff", "--cached", "--", filePath] : ["diff", "--", filePath];
    const { stdout } = await this.exec(args);
    return stdout || "（无文本差异，可能是新增未暂存文件或二进制文件）";
  }

  async getDiffForAI(maxChars = 6000) {
    const staged = await this.exec(["diff", "--cached", "--stat", "--patch"]).then((r) => r.stdout).catch(() => "");
    let text = staged.trim();
    if (!text) {
      text = await this.exec(["diff", "--stat", "--patch"]).then((r) => r.stdout).catch(() => "");
    }
    if (!text) {
      const st = await this.getStatus();
      const files = [...st.staged, ...st.unstaged].map((f) => `${f.status} ${f.path}`);
      text = files.join("\n");
    }
    return text.slice(0, maxChars);
  }

  async getCommitDiff(hash) {
    const { stdout } = await this.exec(["show", "--stat", "--patch", "--no-color", hash]);
    return stdout;
  }

  async getLog(limit = 15) {
    try {
      const { stdout } = await this.exec([
        "log",
        `-${Math.max(1, limit)}`,
        "--pretty=format:%h\x1f%ar\x1f%an\x1f%s"
      ]);
      if (!stdout.trim()) return [];
      return stdout
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => {
          const [hash, relativeTime, author, subject] = line.split("\x1f");
          return { hash, relativeTime, author, subject };
        });
    } catch {
      return [];
    }
  }

  async listTrackedSensitiveFiles(candidates) {
    if (!candidates.length) return [];
    try {
      const { stdout } = await this.exec(["ls-files", "--", ...candidates]);
      return stdout.split(/\r?\n/).filter(Boolean);
    } catch {
      return [];
    }
  }
}

module.exports = { GitService };
