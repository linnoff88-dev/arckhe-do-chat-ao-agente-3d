// Testa o site em Chromium real e guarda capturas. Uso: node tools/capturar.mjs <rotulo> [porta]
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(`${process.env.HOME}/.npm-global/lib/node_modules/playwright`);
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const rotulo = process.argv[2] || "teste";
const porta = Number(process.argv[3] || 8792);
const pasta = join(RAIZ, "processo/revisoes", `capturas-${rotulo}`);
mkdirSync(pasta, { recursive: true });
const URLBASE = `http://127.0.0.1:${porta}/`;
const servidor = spawn("python3", ["-m", "http.server", String(porta), "--bind", "127.0.0.1"], { cwd: RAIZ, stdio: "ignore" });
await new Promise((r) => setTimeout(r, 900));

const base = JSON.parse(readFileSync(join(RAIZ, "conteudo/base.json"), "utf8"));
const rel = { rotulo, passos: [], erros_console: [], falhas_rede: [] };
const espera = (p, ms) => p.waitForTimeout(ms);
const passo = (nome, dados) => { rel.passos.push({ nome, ...dados }); console.log(nome, JSON.stringify(dados)); };

function vigiar(p) {
  p.on("console", (m) => { if (m.type() === "error") rel.erros_console.push(m.text().slice(0, 300)); });
  p.on("pageerror", (e) => rel.erros_console.push("pageerror: " + String(e).slice(0, 300)));
  p.on("requestfailed", (r) => { if (r.url().startsWith(URLBASE)) rel.falhas_rede.push(r.url()); });
  p.on("response", (r) => { if (r.url().startsWith(URLBASE) && r.status() >= 400) rel.falhas_rede.push(`${r.status()} ${r.url()}`); });
}
const estado = (p) => p.evaluate(() => window.__curso?.estado?.() ?? null);
async function pronto(p) { await p.waitForFunction(() => window.__curso?.estado, null, { timeout: 180000 }); }
async function entrar(p, nome) {
  await p.getByRole("button", { name: nome }).first().click({ timeout: 180000 });
  await espera(p, 5000);
}
async function foto(p, nome) { await p.screenshot({ path: join(pasta, nome + ".png"), timeout: 120000 }); }

const nav = await chromium.launch({ headless: true, args: ["--use-gl=angle", "--use-angle=gl-egl", "--enable-webgl", "--ignore-gpu-blocklist"] });
try {
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  vigiar(p);
  await p.goto(URLBASE, { waitUntil: "load", timeout: 180000 });
  await pronto(p);
  await espera(p, 1500);
  await foto(p, "01-entrada");
  await entrar(p, /Entrar na casa/i);
  await p.evaluate(() => window.__curso.limpar());
  await espera(p, 2500);
  await foto(p, "02-sala-0-feitas");
  passo("0 feitas", await estado(p));
  for (const n of [1, 2, 3, 4]) {
    await p.evaluate((x) => window.__curso.irPara(x), n);
    await espera(p, 4500);
    await foto(p, `03-estacao-${n}-apagada`);
  }
  const verPorta = async (nome) => {
    if (await p.evaluate(() => typeof window.__curso.verPorta === "function")) {
      await p.evaluate(() => window.__curso.verPorta());
      await espera(p, 4500);
      await foto(p, nome);
    }
  };
  await verPorta("03b-porta-0-feitas");
  if (await p.evaluate(() => typeof window.__curso.abrirEstacao === "function")) {
    await p.evaluate(() => window.__curso.abrirEstacao(1));
    await espera(p, 1800);
    await foto(p, "03c-painel-estacao-1");
    await p.keyboard.press("Escape");
    await espera(p, 800);
  }
  const s1 = base.sequencias[0];
  await p.evaluate(() => window.__curso.irPara(1));
  await espera(p, 4500);
  await p.evaluate(({ ids }) => ids.forEach((id) => window.__curso.marcarExercicio(1, id)), { ids: s1.exercicios.map((e) => e.id) });
  await espera(p, 3500);
  await foto(p, "04-estacao-1-concluida");
  passo("1 feita", await estado(p));
  await verPorta("04b-porta-1-feita");
  await p.reload({ waitUntil: "load" });
  await pronto(p);
  await espera(p, 1000);
  passo("depois de recarregar", await estado(p));
  await entrar(p, /Entrar na casa|Continuar/i);
  for (const s of base.sequencias.slice(1)) {
    await p.evaluate(({ n, ids }) => ids.forEach((id) => window.__curso.marcarExercicio(n, id)), { n: s.numero, ids: s.exercicios.map((e) => e.id) });
    await espera(p, 1200);
  }
  await espera(p, 6000);
  await foto(p, "05-quatro-feitas");
  passo("4 feitas", await estado(p));
  for (const n of [2, 3, 4]) {
    await p.evaluate((x) => window.__curso.irPara(x), n);
    await espera(p, 4500);
    await foto(p, `05a-estacao-${n}-concluida`);
  }
  await verPorta("05b-porta-aberta");
  await p.evaluate(() => window.__curso.irTerraco());
  await espera(p, 7000);
  await foto(p, "06-terraco");
  passo("terraço", await estado(p));
  await ctx.close();

  const cel = await nav.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const m = await cel.newPage();
  vigiar(m);
  await m.goto(URLBASE, { waitUntil: "load", timeout: 180000 });
  await pronto(m);
  await espera(m, 1000);
  await foto(m, "07-celular-entrada");
  await entrar(m, /Fazer sem 3D/i);
  await espera(m, 1000);
  await foto(m, "08-celular-sem3d");
  passo("sem 3D em 360", await m.evaluate(() => ({
    largura: innerWidth, scrollWidth: document.documentElement.scrollWidth, estado: window.__curso.estado(),
    texto: document.body.innerText.length,
    aulas: document.querySelectorAll("[data-aula]").length, exercicios: document.querySelectorAll("[data-exercicio]").length,
    estacoes: document.querySelectorAll("[data-estacao-sem3d]").length,
  })));
  await m.screenshot({ path: join(pasta, "09-celular-sem3d-inteira.png"), fullPage: true, timeout: 120000 });
  await cel.close();
  const cel3 = await nav.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const t = await cel3.newPage();
  vigiar(t);
  await t.goto(URLBASE, { waitUntil: "load", timeout: 180000 });
  await pronto(t);
  await entrar(t, /Entrar na casa/i);
  await foto(t, "10-celular-3d");
  passo("3D no celular", await estado(t));
  await cel3.close();
} catch (e) {
  rel.erro_fatal = String(e).slice(0, 800);
  console.log("ERRO FATAL:", rel.erro_fatal);
} finally {
  await nav.close();
  servidor.kill();
  rel.erros_console = [...new Set(rel.erros_console)];
  rel.falhas_rede = [...new Set(rel.falhas_rede)];
  writeFileSync(join(pasta, "relatorio.json"), JSON.stringify(rel, null, 1));
  console.log("erros de console:", rel.erros_console.length, rel.erros_console.slice(0, 8));
  console.log("falhas de rede:", rel.falhas_rede.slice(0, 8));
  process.exit(rel.erro_fatal ? 1 : 0);
}
