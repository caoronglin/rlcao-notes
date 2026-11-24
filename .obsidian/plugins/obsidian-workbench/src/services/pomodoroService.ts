"use strict";

import { formatDate, pad2 } from "../utils";

/**
 * 番茄钟状态机与每日专注统计服务（纯逻辑，独立可测）。
 */
type Phase = "idle" | "work" | "break";

interface PomoSettings {
  pomodoroWorkMinutes?: number;
  pomodoroBreakMinutes?: number;
  pomodoroStats?: Record<string, { sessions?: number; minutes?: number }>;
}

type GetSettings = () => PomoSettings;
type OnComplete = (phase: Phase) => void;

class PomodoroService {
  getSettings: GetSettings;
  onComplete: OnComplete | null;
  phase: Phase;
  running: boolean;
  remainingSeconds: number;

  constructor(getSettings: GetSettings, onComplete: OnComplete | null = null) {
    this.getSettings = getSettings;
    this.onComplete = onComplete;
    this.phase = "idle";
    this.running = false;
    this.remainingSeconds = 25 * 60;
  }

  startWork() {
    const mins = Math.max(1, Number(this.getSettings().pomodoroWorkMinutes) || 25);
    this.phase = "work";
    this.remainingSeconds = mins * 60;
    this.running = true;
  }

  startBreak() {
    const mins = Math.max(1, Number(this.getSettings().pomodoroBreakMinutes) || 5);
    this.phase = "break";
    this.remainingSeconds = mins * 60;
    this.running = true;
  }

  togglePause() {
    if (this.phase === "idle") {
      this.startWork();
      return;
    }
    this.running = !this.running;
  }

  reset() {
    this.phase = "idle";
    this.running = false;
    const mins = Math.max(1, Number(this.getSettings().pomodoroWorkMinutes) || 25);
    this.remainingSeconds = mins * 60;
  }

  /**
   * 每秒推进一次；倒计时归零时自动记录当日专注数据并触发回调。
   */
  tick(now: Date = new Date()): boolean {
    if (!this.running || this.phase === "idle") return false;
    this.remainingSeconds -= 1;
    if (this.remainingSeconds > 0) return false;

    const finishedPhase = this.phase;
    this.running = false;
    this.phase = "idle";

    if (finishedPhase === "work") {
      const settings = this.getSettings();
      const mins = Math.max(1, Number(settings.pomodoroWorkMinutes) || 25);
      const key = formatDate(now, "YYYY-MM-DD");
      if (!settings.pomodoroStats || typeof settings.pomodoroStats !== "object") {
        settings.pomodoroStats = {};
      }
      const rec = settings.pomodoroStats[key] || { sessions: 0, minutes: 0 };
      rec.sessions = rec.sessions ?? 0;
      rec.minutes = rec.minutes ?? 0;
      rec.sessions += 1;
      rec.minutes += mins;
      settings.pomodoroStats[key] = rec;
    }

    if (typeof this.onComplete === "function") {
      this.onComplete(finishedPhase);
    }
    return true;
  }

  getTodayStats(now: Date = new Date()): { date: string; sessions: number; minutes: number } {
    const settings = this.getSettings();
    const key = formatDate(now, "YYYY-MM-DD");
    const rec = (settings.pomodoroStats && settings.pomodoroStats[key]) || { sessions: 0, minutes: 0 };
    return { date: key, sessions: rec.sessions || 0, minutes: rec.minutes || 0 };
  }

  formatRemaining(): string {
    const s = Math.max(0, this.remainingSeconds);
    return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
  }

  getStatusBarText(): string {
    if (this.phase === "idle") {
      const today = this.getTodayStats();
      return `🍅 ${today.sessions}`;
    }
    const icon = this.phase === "work" ? "🍅" : "☕";
    const pauseFlag = this.running ? "" : " ⏸";
    return `${icon} ${this.formatRemaining()}${pauseFlag}`;
  }
}

export {
  PomodoroService
};
