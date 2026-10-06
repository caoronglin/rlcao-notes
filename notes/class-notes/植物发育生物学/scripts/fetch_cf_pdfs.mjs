// 浏览器兜底下载：Cloudflare/付费墙站点，curl 直取失败时用 headless Chrome 过挑战。
//
// 依赖：playwright-core + 系统 Chrome
// 用法：node scripts/fetch_cf_pdfs.mjs [--force]
//
// 2026-09-20 实测有效组合：
//   * newContext 必须显式传 userAgent，且与系统 Chrome 版本一致
//     （否则 navigator.userAgent 含 HeadlessChrome，Cloudflare 直接判死）
//   * --headless=new + --use-angle=swiftshader + --enable-unsafe-swiftshader（无 WebGL 时挑战不完成）
//   * --disable-blink-features=AutomationControlled
//   * 先访问同源首页拿 cf_clearance，再在页面内 fetch PDF（context.request 会 403）
import { chromium } from 'playwright-core'
import { writeFile, mkdir, readFile, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REFS = path.join(HERE, '..', 'refs')
const CHROME = process.env.CHROME_BIN || '/usr/bin/google-chrome'
const FORCE = process.argv.includes('--force')
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36'

const JOBS = [
  { name: '01_dev200787_CLV3_CLE16_CLE17.pdf', home: 'https://journals.biologists.com/dev',
    pdf: 'https://journals.biologists.com/dev/article-pdf/149/19/dev200787/2172474/dev200787.pdf' },
  { name: '03_dev202014_local_auxin_shoot_patterning.pdf', home: 'https://journals.biologists.com/dev',
    pdf: 'https://journals.biologists.com/dev/article-pdf/150/23/dev202014/3267209/dev202014.pdf' },
  { name: '06_s41477-022-01111-3_leaf_dorsiventrality.pdf', home: 'https://www.nature.com/',
    pdf: 'https://www.nature.com/articles/s41477-022-01111-3.pdf' },
  { name: '09_s41580-023-00691-y_cell_wall_structure_growth.pdf', home: 'https://www.nature.com/',
    pdf: 'https://www.nature.com/articles/s41580-023-00691-y.pdf' },
  { name: '10_science_ade8055_mechanics_of_plant_morphogenesis.pdf', home: 'https://www.science.org/',
    pdf: 'https://www.science.org/doi/pdf/10.1126/science.ade8055' },
  { name: '15_annurev_cellbio_120420_095337_mechanochemical.pdf', home: 'https://www.annualreviews.org/',
    pdf: 'https://www.annualreviews.org/doi/pdf/10.1146/annurev-cellbio-120420-095337' },
]

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: false, // 自己传 --headless=new
  args: ['--no-sandbox', '--disable-gpu', '--headless=new',
         '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
         '--disable-blink-features=AutomationControlled', '--window-size=1400,900'],
})

for (const job of JOBS) {
  const target = path.join(REFS, job.name)
  if (existsSync(target) && !FORCE) { console.log(`skip  ${job.name}`); continue }
  await mkdir(REFS, { recursive: true })
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1400, height: 900 }, acceptDownloads: true })
  const page = await ctx.newPage()
  console.log(`\n[${job.name}]`)
  try {
    await page.goto(job.home, { waitUntil: 'domcontentloaded', timeout: 90000 })
    let passed = false
    for (let attempt = 1; attempt <= 3 && !passed; attempt++) {
      try { await waitChallenge(page, 60); passed = true }
      catch { console.log(`  挑战未过，第 ${attempt} 次重载…`); await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}) }
    }
    console.log(`  home 就绪: ${(await page.title().catch(() => '?')).slice(0, 60)}`)

    // 路线 1：同源 fetch
    let saved = false
    for (let k = 0; k < 3 && !saved; k++) {
      try {
        const res = await page.evaluate(async (u) => {
          const r = await fetch(u, { credentials: 'include' })
          const bytes = new Uint8Array(await r.arrayBuffer())
          let s = ''
          for (let i = 0; i < bytes.length; i += 8192) s += String.fromCharCode(...bytes.subarray(i, i + 8192))
          return { status: r.status, ct: r.headers.get('content-type') || '', len: bytes.length,
                   head: String.fromCharCode(...bytes.subarray(0, 5)), b64: btoa(s) }
        }, job.pdf)
        console.log(`  fetch ${res.status} ${res.ct} ${res.len} ${res.head}`)
        if (res.head === '%PDF-' && res.len > 100000) {
          await writeFile(target, Buffer.from(res.b64, 'base64')); saved = true; console.log('  SAVED (fetch)')
        }
      } catch (e) { console.log(`  eval 重试 ${k + 1}: ${e.message.slice(0, 70)}`); await page.waitForTimeout(3000) }
    }
    // 路线 2：直接导航触发下载
    if (!saved) {
      try {
        const [dl] = await Promise.all([
          page.waitForEvent('download', { timeout: 60000 }),
          page.goto(job.pdf, { waitUntil: 'domcontentloaded', timeout: 60000 }),
        ])
        const tmp = await dl.path()
        const buf = await readFile(tmp)
        if (buf.slice(0, 5).toString() === '%PDF-' && buf.length > 100000) {
          await copyFile(tmp, target); saved = true
          console.log(`  SAVED (download) ${(buf.length / 1e6).toFixed(2)} MB`)
        }
      } catch (e) { console.log(`  download 路线失败: ${e.message.slice(0, 70)}`) }
    }
    if (!saved) console.log('  未取得 PDF')
  } catch (e) {
    console.log(`  ERR ${e.message.slice(0, 120)}`)
  }
  await ctx.close()
}
await browser.close()

async function waitChallenge(pg, maxSec) {
  for (let i = 0; i < maxSec; i++) {
    const t = await pg.title().catch(() => '')
    if (!/just a moment|请稍候|attention required/i.test(t)) return
    await pg.waitForTimeout(1000)
  }
  throw new Error('Cloudflare 挑战未通过')
}
