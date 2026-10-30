// Generates the audio of «Jarvis parlante» (docs/parlante/<id>.mp3) from the texts in docs/parlante.js, offline, with
// the app's own voice: Pocket TTS «Giovanni» (Kyutai, CC BY 4.0) and the app's pronunciation and audio chain, read
// from the ai-studio checkout next to this repository (its resources/voice must be there: `npm run build` fetches it).
// Nothing is sent anywhere. Needs Node 24+ and ffmpeg with libmp3lame.
//
//   node tools/parlante.mjs [percorso di ai-studio]        (default: ../ai-studio)
//
// It also writes the start of each sentence into docs/parlante.js (between the TEMPI markers), for the captions.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, "..", "docs");
const studio = resolve(process.argv[2] ?? join(here, "..", "..", "ai-studio"));

// The texts: the same file the page uses, evaluated without a page.
const source = readFileSync(join(site, "parlante.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const presets = sandbox.window.JARVIS_PARLANTE;
if (!Array.isArray(presets) || !presets.length) throw new Error("Nessun testo in docs/parlante.js");

// The app's voice code, bundled once into a temporary folder (ai-studio is only read).
const work = mkdtempSync(join(tmpdir(), "jarvis-parlante-"));
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
const v = await import(pathToFileURL(join(work, "voice.mjs")).href);

const RESPELLED = v.LEXICON.map(([, spoken]) => spoken).filter((spoken) => !spoken.includes("-") && !spoken.includes(" "));
const LESSICO = sandbox.window.JARVIS_PARLANTE_LESSICO ?? [];
// As the app's worker: its lexicon, the owner's (here the site's) respellings, all protected from further changes.
const PROTECT = [...v.LEXICON.map(([, spoken]) => spoken), ...LESSICO.map(([, spoken]) => spoken)];
const LITERAL = LESSICO.map(([, spoken]) => spoken);
const voice = await v.PocketTTS.load({ bundleDir: join(studio, "resources", "voice"), voice: "giovanni", threads: 4 });
const dictionaries = v.loadDictionaries(join(studio, "resources", "pronunciation"));
const rate = v.SAMPLE_RATE;
const seedOf = (text) => { let seed = 0; for (const char of text) seed = (Math.imul(seed, 31) + char.charCodeAt(0)) >>> 0; return seed % 100_000; };
// The speech plan's small random variation of the pauses, made repeatable: same text, same file.
const seeded = (seed) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const rms = (x, from, to) => { let s = 0; for (let i = from; i < to; i += 1) s += x[i] * x[i]; return Math.sqrt(s / Math.max(1, to - from)); };

/**
 * A whole explanation as the app speaks a reply (natural.ts `naturalWav`): one speech plan for the text (numbers,
 * pronunciation, one part per clause with the app's pauses), each part synthesized and polished by the worker's chain.
 * Returns the samples, the start of each written sentence, and the joins that may cut a word.
 */
async function explanation(preset) {
  const parts = v.speechPlan(preset.sentences.join(" "), LESSICO, { random: seeded(seedOf(preset.id)) });
  const pieces = [], starts = [], joins = [];
  let length = 0, sentence = 0, open = true;
  for (const part of parts) {
    if (open) { starts.push(Math.round((length / rate) * 100) / 100); open = false; }
    const prepared = v.prepareForVoice(part.text, dictionaries, PROTECT, RESPELLED, LITERAL);
    const { audio } = await v.renderSentence((input, options) => voice.speak(input, options), prepared, seedOf(part.text), { rate: 1.26 });
    const polished = v.polish(audio);
    // A part that starts or ends loud was probably cut in the middle of a sound.
    const edge = Math.round(rate * 0.012), body = rms(polished, 0, polished.length) || 1;
    const head = rms(polished, 0, edge) / body, tail = rms(polished, polished.length - edge, polished.length) / body;
    if (head > 0.35 || tail > 0.35) joins.push(`${part.text} (inizio ${head.toFixed(2)}, fine ${tail.toFixed(2)})`);
    pieces.push(polished); length += polished.length;
    if (part.pauseAfterMs) { const pause = new Float32Array(Math.round((rate * part.pauseAfterMs * v.PAUSE_SCALE) / 1000)); pieces.push(pause); length += pause.length; }
    if (/[.!?…]["»)]?$/.test(part.text.trim())) { sentence += 1; open = true; }
  }
  if (starts.length !== preset.sentences.length) throw new Error(`${preset.id}: ${starts.length} frasi dette, ${preset.sentences.length} scritte (una sola . ? ! per frase)`);
  const all = new Float32Array(length);
  let offset = 0;
  for (const piece of pieces) { all.set(piece, offset); offset += piece.length; }
  return { all: level(all), starts, joins, parts: parts.map((part) => part.text) };
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

const out = join(site, "parlante");
mkdirSync(out, { recursive: true });
const only = process.env.PARLANTE_SOLO ? process.env.PARLANTE_SOLO.split(",") : null;
const previous = (source.match(/\/\*TEMPI\*\/([\s\S]*?)\/\*FINE TEMPI\*\//) ?? [])[1];
const timings = only && previous ? JSON.parse(previous) : {};
try {
  for (const preset of presets) {
    if (only && !only.includes(preset.id)) continue;
    const { all, starts, joins, parts } = await explanation(preset);
    const raw = join(work, `${preset.id}.wav`), mp3 = join(out, `${preset.id}.mp3`);
    writeFileSync(raw, wav(all));
    execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", raw, "-ac", "1", "-ar", "24000", "-c:a", "libmp3lame", "-b:a", "48k",
      "-metadata", `title=Jarvis parlante: ${preset.label}`, "-metadata", "artist=Jarvis (voce Giovanni, Pocket TTS di Kyutai, CC BY 4.0)",
      "-metadata", "comment=Generato offline dai testi di docs/parlante.js; modello convertito in ONNX e quantizzato int8", mp3]);
    timings[preset.id] = { durata: Math.round((all.length / rate) * 10) / 10, frasi: starts };
    console.log(`${preset.id}: ${(all.length / rate).toFixed(1)} s, ${(statSync(mp3).size / 1024).toFixed(0)} KB, LUFS ${v.lufs(all).toFixed(1)}`);
    if (process.env.PARLANTE_PARTI) for (const part of parts) console.log(`   · ${part}`);
    for (const join of joins) console.log(`   giunta da ascoltare: ${join}`);
  }
} finally {
  await voice.release();
  rmSync(work, { recursive: true, force: true });
}

const marked = /\/\*TEMPI\*\/[\s\S]*?\/\*FINE TEMPI\*\//;
if (!marked.test(source)) throw new Error("Segnaposto TEMPI non trovato in docs/parlante.js");
writeFileSync(join(site, "parlante.js"), source.replace(marked, `/*TEMPI*/${JSON.stringify(timings)}/*FINE TEMPI*/`));
console.log("Tempi scritti in docs/parlante.js");
