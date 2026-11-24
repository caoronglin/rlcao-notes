/**
 * Node 测试环境下的 TypeScript 加载器（支持渐进迁移）。
 * 用法：node --import ./tests/ts-loader.mjs --test tests/plugin.test.mjs
 *
 * 两个钩子：
 * 1) resolve：无扩展名的相对 require（如 require("../utils")）在 .js 不存在时
 *    尝试 .ts —— 这是渐进迁移期 .js 模块引用 .ts 模块的关键。
 * 2) load：.ts 文件用 esbuild transformSync 转 CJS。
 * 与 plugin.test.mjs 里现有的 obsidian stub resolve 钩子共存。
 */
import Module from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let esbuild;
try {
  esbuild = require(path.join(rootDir, "node_modules", "esbuild"));
} catch (e) {
  esbuild = null;
}

if (!esbuild) {
  console.error("[ts-loader] esbuild 不可用，无法加载 .ts 测试源码");
} else {
  Module.registerHooks({
    resolve(specifier, context, nextResolve) {
      try {
        return nextResolve(specifier, context);
      } catch (err) {
        // 相对路径且无扩展名：尝试 .ts / /index.ts
        if ((specifier.startsWith("./") || specifier.startsWith("../")) && !path.extname(specifier)) {
          for (const cand of [specifier + ".ts", specifier + "/index.ts"]) {
            try {
              return nextResolve(cand, context);
            } catch (e2) {
              /* 继续尝试 */
            }
          }
        }
        throw err;
      }
    },
    load(url, context, nextLoad) {
      if (url.endsWith(".ts") && !url.endsWith(".d.ts")) {
        const file = fileURLToPath(url);
        const source = fs.readFileSync(file, "utf8");
        const result = esbuild.transformSync(source, {
          loader: "ts",
          format: "cjs",
          target: "node18",
          sourcefile: file
        });
        return { format: "commonjs", source: result.code, shortCircuit: true };
      }
      return nextLoad(url, context);
    }
  });
}
