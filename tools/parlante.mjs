// Generates the site's spoken audio offline, with the app's own voice: Pocket TTS «Giovanni» (Kyutai, CC BY 4.0) and
// the app's pronunciation and audio chain, read from the ai-studio checkout next to this repository (its
// resources/voice must be there: `npm run build` fetches it). Nothing is sent anywhere. Needs Node 24+ and ffmpeg with
// libmp3lame. Two groups of clips:
//
//   voce      the welcome of the home and the voice of each trade page: the greeting, the unknown trade and the
//             closing words from docs/voce/testi.js, one clip per trade from docs/mestieri.js (tools/ruoli.mjs makes
//             it from the app's role catalog) → docs/voce/<id>.mp3, timings in docs/voce/tempi.js
//   parlante  the short explanations of docs/parlante.js («Vuoi sapere altro?» after the welcome) → docs/parlante/<id>.mp3,
//             timings between the TEMPI markers of docs/parlante.js
//
//   node tools/parlante.mjs [percorso di ai-studio]        (default: ../ai-studio)
//
// A clip whose words have not changed since its file was made is left as it is (the timings keep a fingerprint of the
// words); PARLANTE_TUTTO=1 makes everything again, PARLANTE_SOLO=id,id only those, PARLANTE_GRUPPI=voce only a group.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, "..", "docs");
const studio = resolve(process.argv[2] ?? join(here, "..", "..", "ai-studio"));
const read = (path) => { const sandbox = { window: {} }; vm.runInNewContext(readFileSync(path, "utf8"), sandbox); return sandbox.window; };
// The fingerprint of a clip: its words and the respellings that touch them (a new respelling remakes only its clips).
const touching = (preset, lessico) => { const text = preset.sentences.join(" ").toLowerCase(); return lessico.filter(([written]) => text.includes(written.toLowerCase())); };
// (the app's own lexicon counts too: a respelling fixed in ai-studio's lexicon.it.ts remakes the clips with that word.
// Read as text here, before the voice code is bundled: only its plain [written, spoken] pairs matter for the fingerprint)
const appLexicon = (() => { try { return [...readFileSync(join(resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), "..", "..", "ai-studio")), "src", "shared", "i18n", "lexicon.it.ts"), "utf8").matchAll(/\["([^"\]]+)",\s*"([^"\]]+)"\]/g)].map((m) => [m[1], m[2]]); } catch { return []; } })();
const fingerprint = (preset, lessico) => createHash("sha256").update(JSON.stringify([preset.sentences, touching(preset, lessico), touching(preset, appLexicon)])).digest("hex").slice(0, 12);
export const legacyFingerprint = (preset, lessico) => createHash("sha256").update(JSON.stringify([preset.sentences, lessico])).digest("hex").slice(0, 12);

// The texts: the same files the pages use, evaluated without a page.
const parlanteSource = readFileSync(join(site, "parlante.js"), "utf8");
const parlante = read(join(site, "parlante.js"));
const testi = read(join(site, "voce", "testi.js"));
const mestieri = read(join(site, "mestieri.js")).JARVIS_MESTIERI;
if (!Array.isArray(parlante.JARVIS_PARLANTE) || !parlante.JARVIS_PARLANTE.length) throw new Error("Nessun testo in docs/parlante.js");
if (!Array.isArray(testi.JARVIS_VOCE_TESTI) || !mestieri) throw new Error("Mancano docs/voce/testi.js o docs/mestieri.js (node tools/ruoli.mjs)");
const tempiPath = join(site, "voce", "tempi.js");
const previousVoce = existsSync(tempiPath) ? JSON.parse((readFileSync(tempiPath, "utf8").match(/\/\*TEMPI\*\/([\s\S]*?)\/\*FINE TEMPI\*\//) ?? [, "{}"])[1]) : {};
const previousParlante = JSON.parse((parlanteSource.match(/\/\*TEMPI\*\/([\s\S]*?)\/\*FINE TEMPI\*\//) ?? [, "{}"])[1]);
const GROUPS = {
  voce: { out: join(site, "voce"), lessico: testi.JARVIS_VOCE_LESSICO ?? [], previous: previousVoce, source: "docs/voce/testi.js e docs/mestieri.js",
    clips: [...testi.JARVIS_VOCE_TESTI, ...mestieri.ruoli.map((r) => ({ id: `r-${r.id}`, label: `Jarvis ${r.nome}`, sentences: r.frasi }))] },
  parlante: { out: join(site, "parlante"), lessico: parlante.JARVIS_PARLANTE_LESSICO ?? [], previous: previousParlante, source: "docs/parlante.js",
    clips: parlante.JARVIS_PARLANTE },
};
const wanted = (process.env.PARLANTE_GRUPPI ?? "voce,parlante").split(",");
const only = process.env.PARLANTE_SOLO ? process.env.PARLANTE_SOLO.split(",") : null;
const all = process.env.PARLANTE_TUTTO === "1";
const todo = (group, clip) => {
  if (only) return only.includes(clip.id);
  if (all) return true;
  const before = group.previous[clip.id];
  // (fingerprints written before 30/10 covered the whole lexicon: still valid if made with today's lexicon minus PARLANTE_NUOVE)
  if (before && process.env.PARLANTE_NUOVE !== undefined) {
    const added = process.env.PARLANTE_NUOVE.split("|").filter(Boolean);
    if (before.testo === legacyFingerprint(clip, group.lessico.filter(([w]) => !added.includes(w)))) before.testo = fingerprint(clip, group.lessico.filter(([w]) => !added.includes(w)));
  }
  return !before || before.testo !== fingerprint(clip, group.lessico) || !existsSync(join(group.out, `${clip.id}.mp3`));
};
const pending = wanted.flatMap((name) => GROUPS[name].clips.filter((clip) => todo(GROUPS[name], clip)).map((clip) => [name, clip]));

// The app's voice code, bundled once into a temporary folder (ai-studio is only read).
const work = mkdtempSync(join(tmpdir(), "jarvis-parlante-"));
let v = null, voice = null, dictionaries = null, rate = 24000;
if (pending.length) {
  const entry = join(work, "entry.ts");
  const src = (path) => JSON.stringify(join(studio, "src", path));
  writeFileSync(entry, `
import { PocketTTS, SAMPLE_RATE } from ${src("main/voice/pocket")};
import { polish, renderSentence, PAUSE_SCALE } from ${src("main/voice/dsp")};
import { loadDictionaries, prepareForVoice } from ${src("main/voice/pronounce")};
import { speechPlan } from ${src("shared/speech")};
import { LEXICON } from ${src("shared/i18n/lexicon.it")};
export { PocketTTS, SAMPLE_RATE, polish, renderSentence, PAUSE_SCALE, loadDictionaries, prepareForVoice, speechPlan, LEXICON };
export { lufs } from ${src("main/voice/dsp")};
`);
  const require = createRequire(join(studio, "package.json"));
  const esbuild = require("esbuild");
  const ort = pathToFileURL(require.resolve("onnxruntime-node")).href;
  await esbuild.build({
    entryPoints: [entry], bundle: true, platform: "node", format: "esm", outfile: join(work, "voice.mjs"), logLevel: "warning",
    plugins: [{ name: "ort", setup(build) { build.onResolve({ filter: /^onnxruntime-node$/ }, () => ({ path: ort, external: true })); } }],
  });
  v = await import(pathToFileURL(join(work, "voice.mjs")).href);
  voice = await v.PocketTTS.load({ bundleDir: join(studio, "resources", "voice"), voice: "giovanni", threads: 4 });
  dictionaries = v.loadDictionaries(join(studio, "resources", "pronunciation"));
  rate = v.SAMPLE_RATE;
}
const seedOf = (text) => { let seed = 0; for (const char of text) seed = (Math.imul(seed, 31) + char.charCodeAt(0)) >>> 0; return seed % 100_000; };
// The speech plan's small random variation of the pauses, made repeatable: same text, same file.
const seeded = (seed) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const rms = (x, from, to) => { let s = 0; for (let i = from; i < to; i += 1) s += x[i] * x[i]; return Math.sqrt(s / Math.max(1, to - from)); };

/**
 * A whole explanation as the app speaks a reply (natural.ts `naturalWav`): one speech plan for the text (numbers,
 * pronunciation, one part per clause with the app's pauses), each part synthesized and polished by the worker's chain.
 * As the app's worker: its lexicon, the owner's (here the site's) respellings, all protected from further changes.
 * Returns the samples, the start of each written sentence, and the joins that may cut a word.
 */
async function explanation(preset, lessico) {
  const RESPELLED = v.LEXICON.map(([, spoken]) => spoken).filter((spoken) => !spoken.includes("-") && !spoken.includes(" "));
  const PROTECT = [...v.LEXICON.map(([, spoken]) => spoken), ...lessico.map(([, spoken]) => spoken)];
  const LITERAL = lessico.map(([, spoken]) => spoken);
  const parts = v.speechPlan(preset.sentences.join(" "), lessico, { random: seeded(seedOf(preset.id)) });
  const pieces = [], starts = [], joins = [], spoken = [];
  let length = 0, open = true;
  for (const part of parts) {
    if (open) { starts.push(Math.round((length / rate) * 100) / 100); open = false; }
    const prepared = v.prepareForVoice(part.text, dictionaries, PROTECT, RESPELLED, LITERAL);
    spoken.push(prepared);
    const { audio } = await v.renderSentence((input, options) => voice.speak(input, options), prepared, seedOf(part.text), { rate: 1.26 });
    const polished = v.polish(audio);
    // A part that starts or ends loud was probably cut in the middle of a sound.
    const edge = Math.round(rate * 0.012), body = rms(polished, 0, polished.length) || 1;
    const head = rms(polished, 0, edge) / body, tail = rms(polished, polished.length - edge, polished.length) / body;
    if (head > 0.35 || tail > 0.35) joins.push(`${part.text} (inizio ${head.toFixed(2)}, fine ${tail.toFixed(2)})`);
    pieces.push(polished); length += polished.length;
    if (part.pauseAfterMs) { const pause = new Float32Array(Math.round((rate * part.pauseAfterMs * v.PAUSE_SCALE) / 1000)); pieces.push(pause); length += pause.length; }
    if (/[.!?…]["»)]?$/.test(part.text.trim())) open = true;
  }
  if (starts.length !== preset.sentences.length) throw new Error(`${preset.id}: ${starts.length} frasi dette, ${preset.sentences.length} scritte (una sola . ? ! per frase)\n${parts.map((p) => p.text).join("\n")}`);
  const all = new Float32Array(length);
  let offset = 0;
  for (const piece of pieces) { all.set(piece, offset); offset += piece.length; }
  return { all: level(all), starts, joins, spoken };
}

/**
 * The whole file at the app's loudness (-16 LUFS) with headroom for the web: a gentle look-ahead limiter keeps sample
 * peaks under -1.8 dBFS, so the MP3 never clips (true peak measured under -1 dBTP) and every explanation sounds as loud.
 */
function level(x) {
  const TARGET = -16, CEILING = 10 ** (-1.8 / 20), ahead = Math.round(rate * 0.005), release = Math.exp(-1 / (rate * 0.08));
  for (let round = 0; round < 3; round += 1) {
    const gain = 10 ** ((TARGET - v.lufs(x)) / 20);
    const want = new Float32Array(x.length);
    for (let i = 0; i < x.length; i += 1) { const peak = Math.abs(x[i] * gain); want[i] = peak > CEILING ? CEILING / peak : 1; }
    const out = new Float32Array(x.length);
    let g = 1;
    for (let i = 0; i < x.length; i += 1) {
      let need = 1;
      for (let k = i; k < Math.min(x.length, i + ahead); k += 1) if (want[k] < need) need = want[k];
      g = need < g ? need : need - (need - g) * release;
      out[i] = x[i] * gain * g;
    }
    x = out;
  }
  return x;
}

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i += 1) data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), i * 2);
  const header = Buffer.alloc(44);
  header.write("RIFF", 0); header.writeUInt32LE(36 + data.length, 4); header.write("WAVE", 8); header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22); header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

// Timings of the clips that still exist, in the groups' order; files of clips no longer in the texts are removed.
const timings = { voce: {}, parlante: {} };
for (const name of Object.keys(GROUPS)) for (const clip of GROUPS[name].clips) if (GROUPS[name].previous[clip.id]) timings[name][clip.id] = GROUPS[name].previous[clip.id];
const written = () => {
  const order = (name) => Object.fromEntries(GROUPS[name].clips.filter((clip) => timings[name][clip.id]).map((clip) => [clip.id, timings[name][clip.id]]));
  writeFileSync(tempiPath, `// Start of each sentence and length of each clip of docs/voce/, in seconds, with a fingerprint of its words:\n// written by tools/parlante.mjs, read by docs/voce.js for the captions.\nwindow.JARVIS_VOCE_TEMPI = /*TEMPI*/${JSON.stringify(order("voce"))}/*FINE TEMPI*/;\n`);
  const marked = /\/\*TEMPI\*\/[\s\S]*?\/\*FINE TEMPI\*\//;
  const current = readFileSync(join(site, "parlante.js"), "utf8");
  if (!marked.test(current)) throw new Error("Segnaposto TEMPI non trovato in docs/parlante.js");
  writeFileSync(join(site, "parlante.js"), current.replace(marked, `/*TEMPI*/${JSON.stringify(order("parlante"))}/*FINE TEMPI*/`));
};

// PARLANTE_PROVA=1: only the speech plan, to read what the voice will say and check the sentences, without a file.
if (process.env.PARLANTE_PROVA === "1") {
  let wrong = 0;
  for (const [name, clip] of pending) {
    const lessico = GROUPS[name].lessico;
    const PROTECT = [...v.LEXICON.map(([, s]) => s), ...lessico.map(([, s]) => s)], LITERAL = lessico.map(([, s]) => s);
    const RESPELLED = v.LEXICON.map(([, s]) => s).filter((s) => !s.includes("-") && !s.includes(" "));
    const parts = v.speechPlan(clip.sentences.join(" "), lessico, { random: seeded(seedOf(clip.id)) });
    const ends = parts.filter((part) => /[.!?…]["»)]?$/.test(part.text.trim())).length;
    if (ends !== clip.sentences.length) { wrong += 1; console.log(`!! ${clip.id}: ${ends} frasi dette, ${clip.sentences.length} scritte`); }
    console.log(`${name}/${clip.id}`);
    for (const part of parts) console.log(`   · ${v.prepareForVoice(part.text, dictionaries, PROTECT, RESPELLED, LITERAL)}`);
  }
  await voice.release();
  rmSync(work, { recursive: true, force: true });
  process.exit(wrong ? 1 : 0);
}

try {
  for (const [name, clip] of pending) {
    const group = GROUPS[name];
    mkdirSync(group.out, { recursive: true });
    const { all, starts, joins, spoken } = await explanation(clip, group.lessico);
    const raw = join(work, `${clip.id}.wav`), mp3 = join(group.out, `${clip.id}.mp3`);
    writeFileSync(raw, wav(all));
    execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", raw, "-ac", "1", "-ar", "24000", "-c:a", "libmp3lame", "-b:a", "48k",
      "-metadata", `title=Jarvis: ${clip.label}`, "-metadata", "artist=Jarvis (voce Giovanni, Pocket TTS di Kyutai, CC BY 4.0)",
      "-metadata", `comment=Generato offline dai testi di ${group.source}; modello convertito in ONNX e quantizzato int8`, mp3]);
    timings[name][clip.id] = { durata: Math.round((all.length / rate) * 10) / 10, frasi: starts, testo: fingerprint(clip, group.lessico) };
    written();
    console.log(`${name}/${clip.id}: ${(all.length / rate).toFixed(1)} s, ${(statSync(mp3).size / 1024).toFixed(0)} KB, LUFS ${v.lufs(all).toFixed(1)}`);
    if (process.env.PARLANTE_PARTI) for (const part of spoken) console.log(`   · ${part}`);
    for (const join of joins) console.log(`   giunta da ascoltare: ${join}`);
  }
} finally {
  if (voice) await voice.release();
  rmSync(work, { recursive: true, force: true });
}
written();
for (const name of wanted) {
  const group = GROUPS[name], keep = new Set(group.clips.map((clip) => `${clip.id}.mp3`));
  for (const file of readdirSync(group.out)) if (file.endsWith(".mp3") && !keep.has(file)) { rmSync(join(group.out, file)); console.log(`${name}/${file}: rimosso, il testo non c'è più`); }
  const size = group.clips.reduce((sum, clip) => sum + (existsSync(join(group.out, `${clip.id}.mp3`)) ? statSync(join(group.out, `${clip.id}.mp3`)).size : 0), 0);
  console.log(`${name}: ${group.clips.length} clip, ${(size / 1024 / 1024).toFixed(2)} MB`);
}
console.log(pending.length ? `Fatti ${pending.length} clip; tempi scritti in docs/voce/tempi.js e docs/parlante.js` : "Niente da rifare: i testi non sono cambiati");
