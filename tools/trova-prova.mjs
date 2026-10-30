// Checks the welcome's matcher (docs/trova.js) on a hundred answers to «Che lavoro fai?»: trades, families of work,
// life situations, typos, slang, other languages, nonsense, emoji, empty and very long answers. Every answer must land
// on a valid path without an exception; where the right path is clear, it must be that one. Offline, no dependencies.
//
//   node tools/trova-prova.mjs
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const docs = resolve(dirname(fileURLToPath(import.meta.url)), "..", "docs");
const context = { window: {} };
vm.createContext(context);
for (const file of ["mestieri.js", "voce/testi.js", "trova.js"]) vm.runInContext(readFileSync(join(docs, file), "utf8"), context);
const { JARVIS_MESTIERI: mestieri, JARVIS_VOCE_TESTI: testi, JarvisTrova } = context.window;
const trova = JarvisTrova(mestieri, testi);
const roles = new Set(mestieri.ruoli.map((r) => r.id));
const clips = new Map(testi.map((c) => [c.id, c]));

// [answer, expected] — expected: "mestiere:<id>", "famiglia:<id>", "vita:<id>", "vita:<id>+<kind>:<id>", "nuovo", "aiuto",
// or "*" when any valid path is fine (the point is that it never breaks).
const CASES = [
  // The owner's examples
  ["elettricista", "mestiere:artigiano"],
  ["faccio l'elettricista", "mestiere:artigiano"],
  ["sono una studentessa universitaria, diventerò assistente sociale", "vita:v-studio+famiglia:f-sociale"],
  ["studio servizio sociale", "vita:v-studio+famiglia:f-sociale"],
  ["casalinga", "vita:v-casa"],
  ["imprenditore edile", "mestiere:artigiano"],
  ["muratore", "mestiere:artigiano"],
  ["professoressa d'italiano", "famiglia:f-scuola"],
  ["ingegnere meccanico", "famiglia:f-progettazione"],
  ["casalinga, faccio doposcuola a bambini di elementari, medie e superiori", "vita:v-casa+famiglia:f-scuola"],
  ["progetto sedili per aerei", "famiglia:f-progettazione"],
  ["designer di sedili per aerei", "famiglia:f-progettazione"],
  // Trades of the catalog, in the ways people say them
  ["commercialista", "mestiere:commercialista"],
  ["Sono un commercialista", "mestiere:commercialista"],
  ["comercialista", "mestiere:commercialista"],
  ["commercialisti associati", "mestiere:commercialista"],
  ["ho uno studio legale", "mestiere:avvocato"],
  ["avvocata", "mestiere:avvocato"],
  ["faccio l'avvocato a milano", "mestiere:avvocato"],
  ["notaio", "mestiere:notaio"],
  ["geometra", "mestiere:tecnico-edile"],
  ["architetto", "mestiere:tecnico-edile"],
  ["ingegnere civile", "mestiere:tecnico-edile"],
  ["idraulico", "mestiere:artigiano"],
  ["idraulici", "mestiere:artigiano"],
  ["imbianchino", "mestiere:artigiano"],
  ["ho una pizzeria", "mestiere:ristorazione"],
  ["ristorante", "mestiere:ristorazione"],
  ["cameriera in un bar", "mestiere:ristorazione"],
  ["chef", "mestiere:ristorazione"],
  ["ho un b&b", "mestiere:ricettiva"],
  ["bed and breakfast", "mestiere:ricettiva"],
  ["affitti brevi su airbnb", "mestiere:ricettiva"],
  ["albergo", "mestiere:ricettiva"],
  ["ho un negozio di scarpe", "mestiere:commercio"],
  ["commessa", "mestiere:commercio"],
  ["e-commerce", "mestiere:commercio"],
  ["parrucchiera", "mestiere:estetica"],
  ["estetista", "mestiere:estetica"],
  ["centro estetico", "mestiere:estetica"],
  ["agente immobiliare", "mestiere:agente-immobiliare"],
  ["meccanico", "mestiere:officina"],
  ["carrozziere", "mestiere:officina"],
  ["programmatore", "mestiere:sviluppatore"],
  ["sviluppatore frontend", "mestiere:sviluppatore-frontend"],
  ["full stack developer", "mestiere:sviluppatore-fullstack"],
  ["sistemista", "mestiere:sistemista-it"],
  ["social media manager", "mestiere:social-media-manager"],
  ["grafico", "*"],
  ["fotografo di matrimoni", "mestiere:fotografo-videomaker"],
  ["agenzia di comunicazione", "mestiere:agenzia-marketing"],
  ["dentista", "mestiere:studio-medico"],
  ["amministratore di condominio", "mestiere:amministratore-condominio"],
  ["consulente del lavoro", "mestiere:consulente-lavoro"],
  ["presidente di un'associazione", "mestiere:associazione"],
  ["titolare di una srl", "*"],
  // Trades added on 30/10
  ["sono il tech lead di una squadra di 6", "mestiere:technical-leader"],
  ["business analyst", "mestiere:business-analyst"],
  ["lavoro nel pmo", "mestiere:pmo"],
  ["direttrice finanziaria", "mestiere:cfo"],
  ["controller", "mestiere:cfo"],
  ["lavoro nelle risorse umane", "mestiere:hr-manager"],
  ["hr manager", "mestiere:hr-manager"],
  ["cto di una startup", "mestiere:cto"],
  ["faccio la recruiter", "mestiere:recruiter"],
  ["scrum master", "mestiere:scrum-master"],
  ["delivery manager", "mestiere:delivery-manager"],
  ["key account manager", "mestiere:account-manager"],
  ["sono la fondatrice di una startup", "mestiere:founder-ceo"],
  ["amministratore delegato", "mestiere:founder-ceo"],
  ["videomaker", "mestiere:fotografo-videomaker"],
  ["youtuber", "mestiere:content-creator"],
  ["faccio l'influencer", "mestiere:content-creator"],
  ["creo video ugc per i brand", "mestiere:ugc-creator"],
  ["community manager", "mestiere:community-manager"],
  ["ho un podcast", "mestiere:podcaster"],
  ["vendo su vinted", "mestiere:ecommerce-seller"],
  ["vendo su amazon", "mestiere:ecommerce-seller"],
  ["affiliate marketing", "mestiere:affiliate-marketer"],
  ["wedding planner", "mestiere:event-planner"],
  ["organizzo matrimoni", "mestiere:event-planner"],
  ["allenatrice di pallavolo", "*"],
  ["istruttrice di yoga", "mestiere:personal-trainer"],
  ["lavoro al caf", "mestiere:caf-patronato"],
  ["patronato", "mestiere:caf-patronato"],
  // Families of work without a trade of their own
  ["maestra elementare", "famiglia:f-scuola"],
  ["insegnante", "famiglia:f-scuola"],
  ["sono un'insegnante di matematica", "famiglia:f-scuola"],
  ["prof di inglese al liceo", "famiglia:f-scuola"],
  ["personal trainer", "mestiere:personal-trainer"],
  ["educatrice al nido", "famiglia:f-scuola"],
  ["infermiera", "famiglia:f-sociale"],
  ["oss", "famiglia:f-sociale"],
  ["badante", "famiglia:f-sociale"],
  ["musicista", "famiglia:f-creativi"],
  ["scrittrice", "famiglia:f-creativi"],
  ["sarta", "famiglia:f-creativi"],
  ["operaio metalmeccanico", "famiglia:f-produzione"],
  ["lavoro in fabbrica", "famiglia:f-produzione"],
  ["camionista", "famiglia:f-trasporti"],
  ["tassista", "famiglia:f-trasporti"],
  ["agricoltore", "famiglia:f-agricoltura"],
  ["ho un'azienda agricola", "famiglia:f-agricoltura"],
  ["panettiere", "famiglia:f-agricoltura"],
  ["impiegata comunale", "famiglia:f-pubblico"],
  ["dipendente pubblico", "famiglia:f-pubblico"],
  ["impiegato in banca", "famiglia:f-ufficio"],
  ["segretaria", "famiglia:f-ufficio"],
  ["agente di commercio", "famiglia:f-ufficio"],
  ["assicuratore", "famiglia:f-ufficio"],
  // Not a job
  ["sono in pensione", "vita:v-giorni"],
  ["pensionato", "vita:v-giorni"],
  ["niente", "vita:v-giorni"],
  ["non lavoro", "vita:v-giorni"],
  ["studente", "vita:v-studio"],
  ["faccio l'università", "vita:v-studio"],
  ["sto a casa con i bambini", "vita:v-casa"],
  ["mamma a tempo pieno", "vita:v-casa"],
  ["cerco lavoro", "vita:v-cerco"],
  ["disoccupato", "vita:v-cerco"],
  ["sono in cassa integrazione, prima facevo il muratore", "vita:v-cerco+mestiere:artigiano"],
  // Jobs the app would learn
  ["barbiere", "nuovo"],
  ["faccio il barbiere", "nuovo"],
  ["sono un vivaista", "*"],
  ["sono un apicoltore", "*"],
  ["faccio il sommelier", "nuovo"],
  ["lavoro come guida turistica", "nuovo"],
  // Typos, slang, nonsense, other languages, edge cases
  ["boh", "aiuto"],
  ["asdfgh", "aiuto"],
  ["", "aiuto"],
  ["   ", "aiuto"],
  ["🙂🙂", "aiuto"],
  ["?!", "aiuto"],
  ["I'm a lawyer", "*"],
  ["je suis boulanger", "*"],
  ["ich bin Elektriker", "*"],
  ["un po' di tutto", "*"],
  ["lavoro", "aiuto"],
  ["ciao jarvis", "*"],
  ["<script>alert(1)</script>", "*"],
  ["x".repeat(5000), "*"],
  ["faccio " + "molte cose ".repeat(60), "*"],
  [null, "aiuto"],
  [undefined, "aiuto"],
  [12345, "*"],
];

const valid = (result) => {
  if (!result || typeof result !== "object") return false;
  if (result.tipo === "mestiere") return roles.has(result.id);
  if (result.tipo === "famiglia" || result.tipo === "vita") {
    const clip = clips.get(result.id);
    if (!clip || clip.kind !== result.tipo) return false;
    return !result.anche || valid(result.anche);
  }
  if (result.tipo === "nuovo") return typeof result.etichetta === "string" && result.etichetta.length > 0 && result.etichetta.length <= 40;
  return result.tipo === "aiuto";
};
const shape = (r) => (r.tipo === "nuovo" || r.tipo === "aiuto" ? r.tipo : `${r.tipo}:${r.id}${r.anche ? `+${r.anche.tipo}:${r.anche.id}` : ""}`);

let failed = 0, shown = 0;
for (const [answer, expected] of CASES) {
  let result;
  try { result = trova(answer); } catch (error) { failed += 1; console.log(`ECCEZIONE  ${JSON.stringify(answer)?.slice(0, 60)}: ${error.message}`); continue; }
  const ok = valid(result) && (expected === "*" || shape(result) === expected);
  if (!ok) failed += 1;
  if (!ok || process.env.TUTTI) { shown += 1; console.log(`${ok ? "ok" : "NO"}  ${JSON.stringify(answer)?.slice(0, 60)} → ${shape(result)}${result.etichetta ? ` «${result.etichetta}»` : ""}${ok ? "" : `  (atteso ${expected})`}`); }
}
console.log(`${CASES.length} risposte, ${CASES.length - failed} su un percorso valido e atteso, ${failed} da correggere`);
process.exit(failed ? 1 : 0);
