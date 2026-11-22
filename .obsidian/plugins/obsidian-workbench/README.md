# Obsidian Workbench v3.0（全功能模块化知识工作台插件）

开箱即用的原生 Obsidian 桌面插件，集成 **8 大独立可开关模块**（在设置页随时实时启停，无需重启 Obsidian）：

1. **个人知识工作台（`workbench`）**：动态时段问候、今日日记直达、今日行动任务勾选回写、今日输入/输出、沉睡笔记洞察与近 7 天注意力分布。
2. **Git 管理面板（`gitPanel`）**：分支切换与新建、单文件/批量暂存/取消暂存/丢弃、语法高亮 Diff 弹窗、提交模板、一键同步、定时自动同步、状态栏实时显示与提交历史。
3. **Git 高级能力（`gitAdvanced`）**：**Stash 暂存栈**（暂存/弹出/删除）、**远程仓库配置向导**（添加/修改/移除远程与绑定上游推送）、**合并冲突可视化提醒与一键保留本地/采用远程**。
4. **快速闪念弹窗（`quickCapture`）**：自动跳过并保留顶部 YAML frontmatter、快捷标签芯片、`Ctrl/Cmd + Enter` 即刻落盘。
5. **SM-2 互动自测引擎（`quizEngine`）**：原生读取 Markdown 题库，支持单选/多选/判断、乱序、全键盘快捷键、SM-2 错题复习队列与一键导出错题 Callout 复盘笔记。
6. **番茄钟与每日专注统计（`pomodoro`）**：状态栏与工作台实时倒计时、短休切换、自动累计每日完成番茄数与专注分钟数。
7. **Vault 健康体检（`vaultDoctor`）**：检测悬空 CSS、旧版错误 QuickAdd 快捷键、孤儿插件目录与 Git 凭证追踪风险，一键补全安全 `.gitignore`。
8. **AI 辅助（`aiAssist`，默认关闭）**：兼容 OpenAI / DeepSeek / SiliconFlow / 本地 Ollama，支持在 Git 面板**一键生成规范 Commit Message**，以及通过命令面板**从当前笔记自动生成自测题库**。

## 立即安装（免构建）

1. 在 `<你的 Vault>/.obsidian/plugins/` 下新建文件夹 `obsidian-workbench`。
2. 复制根目录的 `main.js`、`manifest.json`、`styles.css` 到该目录。
3. 在 Obsidian 设置 → 第三方插件 中启用 **Obsidian Workbench**，按需在设置页开关各功能模块即可。

## 本地开发与测试

```bash
npm run build   # 零依赖重新打包 src/ -> main.js
npm test        # 运行全量测试（含真实 Git 冲突/Stash/Remote、SM-2、番茄钟与 AI 校验）
```

## 图片工具：启用 sharp（可选但推荐）

插件自带 Canvas 兜底（webp / jpeg / png），装上 sharp 后解锁 AVIF、高质量重采样与更快批量转换：

```bash
cd .obsidian/plugins/obsidian-workbench
npm i sharp
```

重启 Obsidian，在「设置 → 图片工具」查看引擎状态应显示 `sharp (libvips x.y.z)`。
`node_modules/` 已在库 `.gitignore` 中排除，不会进入版本历史。

## v3.2 新增模块

| 模块 | 命令 | 说明 |
|---|---|---|
| 附件管理 | `附件管理：孤儿 / 坏引用 / 体积榜` | 扫描全库附件引用，孤儿可勾选批量归档到 `4-存档/<日期>_孤儿附件/`（移动而非删除，附 README 清单） |
| 图片工具 | `图片工具：上传存档 / 格式转换 / 压缩` | 拖拽或选择图片 → 存 `assets/<YYYY-MM>/` 并在光标处插入嵌入；批量转 WebP/AVIF/JPEG + 限宽 + 质量 |
