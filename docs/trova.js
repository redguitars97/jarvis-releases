// «Che lavoro fai?»: the visitor's answer matched to a path, on the visitor's computer only (no network, no model).
// The index comes from the app's role catalog (docs/mestieri.js: names, the catalog's keywords and exclusions) plus a
// few site aliases below, and from the families of work and the life situations of docs/voce/testi.js. Every answer
// lands somewhere: a trade, a family of work, a life situation (with the job or the side activity it names, if any),
// a job the app would learn («nuovo»), or «aiuto» — a friendly «dimmi in due parole», never an error.
// tools/trova-prova.mjs feeds it a hundred answers in node; the page calls window.JarvisTrova(mestieri, testi).
(function (root) {
  // The trades the home puts first: large, well covered by what Jarvis does today and reached directly by the person
  // who decides (sector study of 30/10/2026; the ranking and its reasons are in the notes for the owner).
  var IN_PRIMO_PIANO = ["artigiano", "commercialista", "ristorazione", "ricettiva", "tecnico-edile", "avvocato", "estetica", "commercio", "agenzia-marketing", "sviluppatore"];

  // Words people use for a trade that the catalog does not list (the catalog wins; these only add).
  var ALIAS = {
    artigiano: ["edile", "edilizia", "imprenditore edile", "imprenditrice edile", "costruzioni", "costruttore", "carpentiere", "piastrellista", "fabbro",
      "serramentista", "lattoniere", "posatore", "termoidraulica", "antennista", "manutentore", "tuttofare", "giardiniere", "elettricista"],
    commercio: ["commessa", "commesso", "negoziante", "bottega", "tabaccheria", "edicola", "ferramenta", "profumeria", "abbigliamento", "gioielleria",
      "fioraio", "fiorista", "libreria", "cartoleria", "ottica", "erboristeria", "venditore ambulante", "ambulante", "mercato"],
    ristorazione: ["cuoco", "cuoca", "chef", "cameriere", "cameriera", "barista", "barman", "gelataio", "pasticcere", "pasticciera", "rosticceria", "osteria", "locale"],
    ricettiva: ["albergatore", "albergatrice", "affittacamere", "host", "case vacanza", "appartamenti per turisti"],
    estetica: ["estetiste", "parrucchieri", "acconciatrice", "onicotecnica", "massaggiatore", "massaggiatrice", "centro benessere"],
    officina: ["meccanica auto", "autoriparatore", "carrozziera", "elettrauto"],
    "studio-medico": ["medico di base", "medico di famiglia", "pediatra", "odontoiatra", "osteopata", "nutrizionista", "dietista", "ostetrica", "segretaria medica"],
    commercialista: ["ragioniere", "ragioniera", "consulente fiscale", "dottore commercialista", "tributarista", "revisore"],
    avvocato: ["avvocata", "avvocatessa", "praticante avvocato", "giurista"],
    "tecnico-edile": ["ingegnere civile", "ingegnere edile", "architetta", "geometri"],
    sviluppatore: ["informatico", "informatica", "ingegnere informatico", "developer", "programmatrice", "coder"],
    "agente-immobiliare": ["immobiliarista", "mediatore immobiliare"],
    "freelance-creativo": ["illustratrice", "grafica freelance"],
    "personal-trainer": ["istruttore di yoga", "istruttrice di yoga", "insegnante di yoga", "istruttore di pilates", "istruttrice di pilates", "palestra", "trainer"],
    associazione: ["presidente dell associazione", "volontario", "volontaria", "pro loco", "parrocchia", "asd", "societa sportiva"],
    pmi: ["titolare di azienda", "titolare d azienda", "direttore generale", "piccola azienda", "azienda di famiglia"],
  };

  // Words that carry no trade: articles, verbs of being and doing, small words. «non» stays (non lavoro).
  var STOP = {};
  ("il lo la i gli le l un uno una un di del dello della dei degli delle d da dal dallo dalla dai dagli dalle in nel nello nella nei negli nelle a al allo alla ai agli alle " +
   "e ed o oppure per con su sul sulla tra fra mi ti si ci vi me te se io tu lui lei noi voi loro sono sei siamo siete sono e era ero faccio fai fa facciamo fate " +
   "fanno lavoro lavori lavora lavoriamo lavorate come che chi mio mia miei mie tuo tua nostro nostra ho hai ha abbiamo avete hanno presso ora adesso " +
   "attualmente occupo occupa occupiamo cosa sto stai sta essere fare tipo diciamo beh boh ciao salve allora quindi poi anche ancora gia piu molto un po " +
   "mestiere professione lavorare vorrei voglio diventare diventero futuro qualcosa cose cosi via ecc etc tipo ok si").split(" ").forEach(function (w) { STOP[w] = 1; });

  function norm(text) {
    return String(text || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’'`´]/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
  }
  // A light stem, so that singular and plural, masculine and feminine meet: professore, professoressa → professor.
  function stem(w) {
    if (w.length <= 3) return w;
    if (/essa$/.test(w) && w.length > 6) w = w.slice(0, -4);
    else if (/trice$/.test(w)) w = w.slice(0, -5) + "tor";
    else if (/trici$/.test(w)) w = w.slice(0, -5) + "tor";
    else w = w.replace(/[aeiou]+$/, "");
    if (/[cg]h$/.test(w)) w = w.slice(0, -1);
    return w;
  }
  function tokens(text) { return norm(text).split(" ").filter(function (w) { return w && !STOP[w]; }).map(stem); }
  function distance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i]; var best = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }

  // The job a sentence names when nothing is known about it: «faccio il barbiere», «sono una vivaista».
  var PATTERN = /(?:^|\b)(?:faccio (?:il|lo|la|l'|l’|i|gli|le)\s*|sono (?:un|una|uno|un'|un’|il|la|lo|l'|l’)\s*|lavoro (?:come|da)\s+|di mestiere faccio (?:il|la|l'|lo)?\s*|mi occupo di\s+|ho (?:un|una|uno|un')\s*)([a-zà-ÿ' -]{3,60})/i;
  var SUFFIX = /(iere|iera|ista|isti|iste|tore|trice|aio|aia|ologo|ologa|ante|ente|ere|essa|ario|aria|ino|ina|ese)$/;

  function create(mestieri, testi) {
    var index = [], byId = {};
    function add(kind, id, phrase, order) {
      var toks = tokens(phrase);
      if (!toks.length) return;
      var weight = toks.join("").length;
      index.push({ kind: kind, id: id, toks: toks, weight: weight, short: weight < 4, order: order });
    }
    (mestieri.ruoli || []).forEach(function (r, i) {
      byId[r.id] = { kind: "mestiere", data: r };
      r.parole.concat(r.chip.split(","), [r.nome.replace(/^(il|lo|la|l'|i|gli|le)\s*/i, ""), r.titolo.replace(/\(.*\)/, "")], ALIAS[r.id] || [])
        .forEach(function (p) { add("mestiere", r.id, p, i); });
      r.escludiToks = (r.escludi || []).map(tokens);
    });
    (testi || []).forEach(function (clip, i) {
      if (clip.kind !== "famiglia" && clip.kind !== "vita") return;
      byId[clip.id] = { kind: clip.kind, data: clip };
      clip.parole.forEach(function (p) { add(clip.kind, clip.id, p, 100 + i); });
    });
    var RANK = { mestiere: 0, famiglia: 1, vita: 2 };
    var has = function (list, sub) {
      outer: for (var s = 0; s + sub.length <= list.length; s++) { for (var k = 0; k < sub.length; k++) if (list[s + k] !== sub[k]) continue outer; return true; }
      return false;
    };

    function trova(input) {
      var raw = String(input == null ? "" : input).slice(0, 200);
      var t = tokens(raw);
      if (!t.length) return { tipo: "aiuto" };
      // «studio …» is the one where a word means two things: «studio legale» is a firm, «studio servizio sociale» a student.
      var n = norm(raw);
      var matches = [];
      if (/^(io )?studio\b/.test(n) && !/^(io )?studio (legale|medico|tecnico|notarile|dentistico|associato|commercialista|fotografico|grafico|di (architettura|ingegneria|grafica|design|consulenza))/.test(n))
        matches.push({ e: { kind: "vita", id: "v-studio", weight: 6, order: 999 }, start: 0, end: 1 });
      var shortOk = t.length <= 3;
      index.forEach(function (e) {
        if (e.short && !shortOk) return;
        if (e.kind === "mestiere") { var r = byId[e.id].data; if (r.escludiToks.some(function (x) { return x.length && has(t, x); })) return; }
        for (var s = 0; s + e.toks.length <= t.length; s++) {
          var ok = true, fuzzy = false;
          for (var k = 0; k < e.toks.length && ok; k++) {
            var a = t[s + k], b = e.toks[k];
            if (a === b) continue;
            if (e.toks.length === 1 && b.length >= 5 && a.length >= 4) {
              var max = b.length >= 8 ? 2 : 1;
              if (distance(a, b, max) <= max) { fuzzy = true; continue; }
            }
            ok = false;
          }
          if (ok) matches.push({ e: e, start: s, end: s + e.toks.length, w: fuzzy ? e.weight * 0.8 : e.weight });
        }
      });
      matches.forEach(function (m) { if (m.w == null) m.w = m.e.weight; });
      matches.sort(function (a, b) { return b.w - a.w || RANK[a.e.kind] - RANK[b.e.kind] || a.start - b.start || a.e.order - b.e.order; });
      var taken = [], score = {};
      matches.forEach(function (m) {
        for (var i = m.start; i < m.end; i++) if (taken[i]) return;
        for (var j = m.start; j < m.end; j++) taken[j] = true;
        var key = m.e.kind + ":" + m.e.id;
        score[key] = (score[key] || 0) + m.w + 1; // (each word found is one more piece of evidence)
      });
      var best = { mestiere: null, famiglia: null, vita: null };
      Object.keys(score).forEach(function (key) {
        var kind = key.split(":")[0], id = key.slice(kind.length + 1);
        if (!best[kind] || score[key] > best[kind].score) best[kind] = { id: id, score: score[key] };
      });
      var work = best.mestiere && (!best.famiglia || best.mestiere.score >= best.famiglia.score) ? { tipo: "mestiere", id: best.mestiere.id }
        : best.famiglia ? { tipo: "famiglia", id: best.famiglia.id } : null;
      if (best.vita) return work ? { tipo: "vita", id: best.vita.id, anche: work } : { tipo: "vita", id: best.vita.id };
      if (work) return work;
      // A job the app would learn: named after «faccio il…», «sono un…», or one or two words that sound like a job.
      var named = raw.toLowerCase().match(PATTERN), label = "";
      if (named) label = named[1];
      else if (/^[a-zà-ÿ' -]{4,30}$/i.test(raw.trim()) && raw.trim().split(/\s+/).length <= 2 && SUFFIX.test(norm(raw).split(" ")[0])) label = raw.trim().toLowerCase();
      label = label.split(/[,.;:!?]| che | e | ed | per | a | in | da | con /)[0].replace(/\s+/g, " ").trim();
      if (label.split(" ").length <= 4 && /[a-zà-ÿ]{3}/i.test(label) && tokens(label).length) return { tipo: "nuovo", etichetta: label.slice(0, 40) };
      return { tipo: "aiuto" };
    }
    trova.dati = function (id) { return byId[id] ? byId[id].data : null; };
    trova.inPrimoPiano = IN_PRIMO_PIANO.filter(function (id) { return byId[id]; });
    return trova;
  }

  root.JarvisTrova = create;
})(typeof window !== "undefined" ? window : globalThis);
