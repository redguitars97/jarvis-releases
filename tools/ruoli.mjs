// Generates the «Per chi è» pages of the site: docs/per/index.html (Jarvis adapts to any trade, the built-in roles as
// examples) and docs/per/<id>.html, one per trade and one for the «Siti e app» function, from the app's own role
// catalog («Jarvis si trasforma»): ids, names, official sources (the pages the study reads first and the domains the
// dossier accepts) and reserved acts come from src/main/roles/profiles*.ts of the ai-studio checkout next to this
// repository, bundled with its esbuild (as tools/parlante.mjs does; ai-studio is only read). What the catalog has no
// words for (who the page is for, the example requests and what Jarvis hands back) is written below, by hand. Every line
// is a promise of the site: say only what the app does, as the app's proofs check it (build/release-checks.json, W94).
// A role added to the catalog stops the tool until its page texts are written here. The generated pages are committed
// as they are (no JavaScript needed to read them).
//
//   node tools/ruoli.mjs [percorso di ai-studio]        (default: ../ai-studio)
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..", "docs", "per");
const studio = resolve(process.argv[2] ?? join(here, "..", "..", "ai-studio"));

// The app's catalog, bundled once into a temporary folder.
const work = mkdtempSync(join(tmpdir(), "jarvis-ruoli-"));
const entry = join(work, "entry.ts");
writeFileSync(entry, `export { BUILTIN_ROLES } from ${JSON.stringify(join(studio, "src", "main", "roles", "profiles.it.ts"))};\nexport { planFit } from ${JSON.stringify(join(studio, "src", "main", "owner", "profile.ts"))};\n`);
const esbuild = createRequire(join(studio, "package.json"))("esbuild");
await esbuild.build({ entryPoints: [entry], bundle: true, platform: "node", format: "esm", outfile: join(work, "roles.mjs"), logLevel: "warning" });
const { BUILTIN_ROLES, planFit } = await import(pathToFileURL(join(work, "roles.mjs")).href);
rmSync(work, { recursive: true, force: true });

// Readable names of the official sites the catalog points to (by registrable host); an unknown host shows as itself.
const NOMI = {
  "acn.gov.it": "Agenzia per la Cybersicurezza Nazionale",
  "agcm.it": "Autorità Garante della Concorrenza e del Mercato",
  "agcom.it": "AGCOM, Autorità per le garanzie nelle comunicazioni",
  "agenziaentrate.gov.it": "Agenzia delle Entrate",
  "agid.gov.it": "AgID, Agenzia per l'Italia digitale",
  "alloggiatiweb.poliziadistato.it": "Alloggiati Web (Polizia di Stato)",
  "bancaditalia.it": "Banca d'Italia",
  "cortedicassazione.it": "Corte di cassazione",
  "csirt.gov.it": "CSIRT Italia",
  "developer.android.com": "Android Developers (Google)",
  "developer.apple.com": "Apple Developer",
  "developer.mozilla.org": "MDN Web Docs (Mozilla)",
  "developers.google.com": "Google Search Central",
  "digital-strategy.ec.europa.eu": "Commissione europea, strategia digitale",
  "efsa.europa.eu": "EFSA, Autorità europea per la sicurezza alimentare",
  "finanze.gov.it": "Dipartimento delle Finanze (MEF)",
  "garanteprivacy.it": "Garante per la protezione dei dati personali",
  "gazzettaufficiale.it": "Gazzetta Ufficiale",
  "giustizia.it": "Ministero della Giustizia",
  "iap.it": "Istituto dell'Autodisciplina Pubblicitaria",
  "ilportaledellautomobilista.it": "Il Portale dell'Automobilista (MIT)",
  "inail.it": "INAIL",
  "inps.it": "INPS",
  "iso.org": "ISO",
  "istat.it": "ISTAT",
  "kubernetes.io": "Kubernetes",
  "lavoro.gov.it": "Ministero del Lavoro",
  "mimit.gov.it": "Ministero delle Imprese e del Made in Italy",
  "ministeroturismo.gov.it": "Ministero del Turismo",
  "mit.gov.it": "Ministero delle Infrastrutture e dei Trasporti",
  "nodejs.org": "Node.js",
  "normattiva.it": "Normattiva, il testo vigente delle leggi",
  "notariato.it": "Consiglio Nazionale del Notariato",
  "owasp.org": "OWASP",
  "playwright.dev": "Playwright",
  "pmi.org": "Project Management Institute",
  "postgresql.org": "PostgreSQL",
  "salute.gov.it": "Ministero della Salute",
  "sistemats1.sanita.finanze.it": "Sistema Tessera Sanitaria",
  "sre.google": "Google SRE",
  "uibm.mise.gov.it": "Ufficio Italiano Brevetti e Marchi",
  "w3.org": "W3C",
  "web.dev": "web.dev (Google)",
};
// Sites that refuse automatic link checkers (the site's CI checks every link): named, not linked.
const SENZA_LINK = new Set(["iso.org", "pmi.org"]);
const hostOf = (url) => new URL(url).hostname.replace(/^www\./, "");

// How the functions read inside a sentence; the tool stops if the catalog's functions change.
const FUNZIONI = { marketing: "marketing", legale: "legale", amministrazione: "amministrazione", informatica: "IT", vendite: "vendite", "sviluppo-web": "siti e app" };

const GRUPPI = [
  ["professionisti", "Professionisti e studi"],
  ["imprese", "Imprese, negozi e locali"],
  ["sviluppo", "Sviluppo software e IT"],
  ["digitale", "Design, contenuti e prodotto"],
  ["freelance", "Freelance e agenzie"],
  ["aziende", "Aziende e associazioni"],
  ["ruoli-azienda", "Ruoli in azienda"],
  ["creator", "Creator e vendita online"],
];

// Common capabilities a role page may add, as the app does them.
const TELEGRAM_CLIENTI = "Risponde ai tuoi clienti su Telegram, con il computer acceso e Jarvis aperto: un bot separato dal tuo, che sa solo ciò che gli dai tu (le informazioni dell'attività, le risposte che approvi, il sito). Ciò che non sa lo chiede a te e impara la risposta che approvi; propone gli orari e prende gli appuntamenti (li scrive da solo in un calendario CalDAV, altrimenti li confermi tu), ti passa la conversazione quando serve e ti manda i riepiloghi.";
const CRM = "Manda contatti e lavori ai tuoi strumenti, con il tuo ok: HubSpot, Pipedrive, Odoo, oppure Make, n8n e Zapier con un webhook.";
// What the app added on 30/10, said only on the pages where it helps (each line is in the app's README and proofs).
const LINKEDIN = "Prepara post, caroselli e annunci per LinkedIn e ti apre la pagina: il testo è negli appunti, lo incolli e lo pubblichi tu, nel rispetto delle regole di LinkedIn.";
const VIDEO = "Fa video demo del tuo sito o del tuo lavoro, verticali per TikTok e Reels oppure orizzontali, con sceneggiatura, testi e voce; registra lo schermo solo con il tuo ok.";
const BLINDATO = "Piano blindato: prima di un lavoro importante, con due AI di fornitori diversi collegate, una attacca il piano dell'altra punto per punto, e si costruisce solo dopo.";
const PEC = "Manda le PEC con il tuo ok e legge le ricevute di accettazione e consegna, conservate come prova.";
const TURNI = "Prepara i turni del personale, controllati sui riposi di legge e sui limiti del contratto che scrivi tu, in Excel e PDF; i messaggi a ciascuno li mandi tu.";
const ECOMMERCE = "Si collega al tuo negozio WooCommerce o Shopify: legge ordini, prodotti e scorte, e cambia prezzi e scorte solo con il tuo ok.";
const PORTALI = "Apre i portali di Agenzia delle Entrate, INPS e SUAP: entri tu con SPID o CIE, poi ti guida passo per passo e si ferma prima di ogni invio.";
const ALLOGGIATI = "Prepara le schedine per Alloggiati Web, controllate sulle tabelle ufficiali, e le invia con la chiave della tua struttura solo dopo il tuo ok.";
// The same lines for trades whose texts were written before them.
const PIU = {
  commercialista: [PEC, PORTALI], "consulente-lavoro": [PEC, PORTALI], avvocato: [PEC], notaio: [PEC], "amministratore-condominio": [PEC],
  ristorazione: [TURNI], ricettiva: [ALLOGGIATI, TURNI], commercio: [ECOMMERCE, TURNI], estetica: [TURNI], pmi: [TURNI, PORTALI, LINKEDIN],
  sviluppatore: [BLINDATO, VIDEO], "sviluppatore-fullstack": [BLINDATO], "architetto-software": [BLINDATO], "agenzia-marketing": [VIDEO, LINKEDIN],
  "social-media-manager": [VIDEO, LINKEDIN], "sviluppo-web": [BLINDATO, VIDEO],
};

// The page texts the catalog has no words for, by role id. `mai`: lines added to the catalog's reserved acts.
const PAGINE = {
  commercialista: { gruppo: "professionisti", titolo: "Commercialisti e studi fiscali",
    perChi: "Per lo studio che segue imprese, professionisti e famiglie: buste paga da controllare, versamenti, scadenze e fatture elettroniche.",
    fa: [
      ["«Controllami la busta paga di Rossi»", "L'analisi voce per voce, con i conti rifatti in un foglio Excel e le differenze spiegate."],
      ["«Prepara l'F24 dell'acconto di novembre per Bianchi»", "La bozza sezione per sezione, con codici tributo e importi verificati sulle fonti ufficiali."],
      ["«Cosa scade a dicembre per i miei clienti?»", "Lo scadenzario con le date lette sulle fonti ufficiali, la data della verifica e i promemoria in calendario."],
      ["«Leggimi questa fattura .p7m»", "La lettura e il controllo della fattura elettronica; ti dice che la firma digitale non l'ha verificata."],
    ],
    mai: ["Non invia nulla al Sistema di Interscambio né all'Agenzia delle Entrate.", "Non trasmette dichiarazioni o versamenti e non firma al posto tuo."] },
  "consulente-lavoro": { gruppo: "professionisti", titolo: "Consulenti del lavoro",
    perChi: "Per chi gestisce cedolini, contributi e adempimenti dei dipendenti dei propri clienti.",
    fa: [
      ["«Ricontrolla i cedolini di ottobre»", "Imponibili, contributi, IRPEF, addizionali, TFR e ratei rifatti in un foglio, con le differenze spiegate."],
      ["«Prepara l'F24 di ritenute e contributi di novembre»", "La bozza per sezione, con i codici verificati sulle fonti ufficiali."],
      ["«Che adempimenti ho questo mese per i dipendenti?»", "Lo scadenzario del periodo con le fonti e i promemoria in calendario."],
      ["«Scrivi la lettera di contestazione per i ritardi ripetuti»", "Una bozza completa, con i campi da completare evidenti, da verificare da te."],
    ],
    mai: ["Non firma e non rappresenta i clienti davanti agli enti o all'ispettorato."] },
  avvocato: { gruppo: "professionisti", titolo: "Avvocati e studi legali",
    perChi: "Per lo studio che vuole meno tempo su termini, diffide e ricerche, e più tempo per i clienti.",
    fa: [
      ["«Entro quando posso appellare la sentenza notificata il 12 settembre?»", "Il conteggio giorno per giorno, con la sospensione feriale e le norme lette sulla fonte ufficiale, da verificare da te."],
      ["«Scrivi una diffida a Verdi per la fattura non pagata»", "La bozza della diffida con struttura completa e campi da completare evidenti."],
      ["«Trovami la giurisprudenza sul recesso dal contratto di agenzia»", "Norme e sentenze da fonti pubbliche gratuite, con estratto, link e data di lettura."],
      ["«Registra la riunione con il cliente»", "Il verbale con decisioni, cose da fare e la bozza dell'email di follow-up."],
    ],
    mai: ["Non dà pareri ai clienti al posto tuo: ogni testo è una bozza per te."] },
  notaio: { gruppo: "professionisti", titolo: "Notai e studi notarili",
    perChi: "Per lo studio che prepara le pratiche: documenti da raccogliere, norme da citare, parti da sentire e appuntamenti da fissare.",
    fa: [
      ["«Fammi la checklist dei documenti per la compravendita di via Roma»", "L'elenco dei documenti da chiedere alle parti, con le norme lette e la data della verifica."],
      ["«Trova il testo vigente delle norme sulla trascrizione del preliminare»", "Il testo vigente con estratto, link e data di lettura."],
      ["«Scrivi ai venditori per chiedere planimetria e visura»", "L'email pronta, che parte solo con il tuo ok."],
      ["«Fissa la firma con le parti giovedì alle 10»", "L'appuntamento in calendario e gli inviti alle parti, con il tuo ok."],
    ],
    mai: ["Non registra, non trascrive e non presenta nulla agli uffici.", "Non dà consulenza alle parti: prepara il lavoro per te."] },
  "tecnico-edile": { gruppo: "professionisti", titolo: "Geometri, architetti e ingegneri",
    perChi: "Per il tecnico che passa troppe ore su computi, documenti di sicurezza e preventivi.",
    fa: [
      ["«Fai il computo metrico del bagno da rifare, con il prezzario della Regione»", "Voci, unità, quantità calcolate dalle misure e prezzi dal prezzario indicato; importi e totali calcolati dal foglio."],
      ["«Prepara il POS per il cantiere di via Garibaldi»", "La struttura del piano con i campi da completare e i rimandi alle norme lette."],
      ["«Cosa dice la norma sulle distanze tra costruzioni?»", "La ricerca con il testo vigente, l'estratto e il link."],
      ["«Dal computo, prepara il preventivo per il cliente»", "Il preventivo in PDF e Word, con i totali controllati."],
    ],
    mai: ["Non deposita pratiche edilizie.", "Non assume il ruolo di direttore dei lavori o di coordinatore per la sicurezza."] },
  "studio-medico": { gruppo: "professionisti", titolo: "Studi medici e sanitari",
    perChi: "Per la segreteria dello studio: posta, agenda, avvisi ai pazienti e documenti dello studio. Non per la parte clinica.",
    fa: [
      ["«Riassumi la posta e dimmi chi chiede un appuntamento»", "Il riassunto della posta, con le richieste in evidenza e le risposte pronte per il tuo ok."],
      ["«Sposta le visite di giovedì e avvisa i pazienti»", "Gli appuntamenti spostati nel calendario e gli avvisi agli invitati, con il tuo ok."],
      ["«Prepara la bozza dell'informativa privacy dello studio»", "Una bozza strutturata con le fonti lette, da rivedere da te."],
      ["«Registra la riunione dello studio»", "Il verbale con decisioni e cose da fare."],
    ],
    mai: ["Non dà consigli medici a nessuno.", "Non decide nulla sui pazienti: organizza il lavoro della segreteria."],
    privacy: "Per tutto ciò che riguarda i pazienti usa un progetto «riservato»: lavora solo con i modelli sul tuo computer e non esce nulla." },
  "amministratore-condominio": { gruppo: "professionisti", titolo: "Amministratori di condominio",
    perChi: "Per chi segue più condomini tra assemblee, verbali, ripartizioni e richieste dei condòmini.",
    fa: [
      ["«Prepara la convocazione dell'assemblea con l'ordine del giorno»", "La convocazione in Word e PDF e l'email ai condòmini, che parte con il tuo ok."],
      ["«Registra l'assemblea e fammi il verbale»", "La bozza del verbale con decisioni e cose da fare, da rileggere e firmare tu."],
      ["«Ripartisci la spesa del tetto per millesimi»", "Il foglio Excel con la ripartizione calcolata, da controllare."],
      ["«Cosa dice il codice civile sulle maggioranze per i lavori straordinari?»", "Il testo vigente con l'estratto e il link."],
    ],
    mai: ["Non firma verbali o contratti.", "Non paga fornitori e non spende senza il tuo ok."] },

  artigiano: { gruppo: "imprese", titolo: "Artigiani e impiantisti",
    perChi: "Per elettricisti, idraulici, termotecnici, falegnami e chi lavora in cantiere: preventivi, documenti e clienti.",
    fa: [
      ["«Prepara la dichiarazione di conformità dell'impianto di casa Neri»", "La struttura con i campi obbligatori da completare e l'elenco degli allegati da unire."],
      ["«Fammi il preventivo per la caldaia nuova»", "Il preventivo in PDF con voci, totali controllati e condizioni."],
      ["«Il cliente non paga da tre mesi: scrivigli»", "Un sollecito formale in bozza, che parte solo con il tuo ok."],
      ["«Fissa il sopralluogo per martedì alle 9»", "L'appuntamento in calendario e l'invito al cliente."],
    ],
    mai: ["Non manda nulla al cliente senza il tuo ok."], extra: [TELEGRAM_CLIENTI] },
  ristorazione: { gruppo: "imprese", titolo: "Ristoranti, bar e pizzerie",
    perChi: "Per il locale che vuole menù chiari, registri in ordine e clienti che trovano risposta anche quando sei in cucina.",
    fa: [
      ["«Rifai il menù d'autunno con gli allergeni»", "Il menù con prezzi chiari e la bozza degli allergeni di ogni piatto secondo il Reg. UE 1169/2011, ricavata dalle ricette e dalle etichette, da controllare tu."],
      ["«Prepara i registri HACCP di temperature e pulizie»", "La struttura del piano di autocontrollo e i registri da compilare."],
      ["«Tre post per la serata di sabato»", "Testi e grafiche nei colori del locale, pubblicati all'ora che scegli con il tuo ok."],
      ["«Chi sono i concorrenti qui intorno?»", "Chi sono, prezzi, punti forti e deboli, con le fonti lette."],
    ],
    mai: ["Non dichiara un piatto senza allergeni se ricette ed etichette non lo dicono.", "Non pubblica nulla senza il tuo ok."], extra: [TELEGRAM_CLIENTI] },
  ricettiva: { gruppo: "imprese", titolo: "Hotel, B&B e affitti brevi",
    perChi: "Per chi ospita: comunicazioni degli ospiti, imposta di soggiorno, CIN e domande dei clienti.",
    fa: [
      ["«Prepara la comunicazione degli ospiti di stasera per Alloggiati Web»", "I dati pronti da inviare, con gli obblighi verificati sulle fonti ufficiali e datati."],
      ["«Quanto devo versare di imposta di soggiorno per ottobre?»", "Il calcolo con le tariffe dal regolamento del tuo Comune per l'anno in corso."],
      ["«Sistemiamo la scheda Google della struttura»", "La proposta e i contenuti della scheda, pronti da attivare."],
      ["«Rispondi agli ospiti che chiedono del check-in»", "Le risposte su Telegram con le informazioni che gli hai dato; ciò che non sa lo chiede a te."],
    ],
    mai: ["Non invia nulla alla Questura o al Comune senza il tuo ok.", "Password e codici dei portali li scrivi tu."], extra: [TELEGRAM_CLIENTI] },
  commercio: { gruppo: "imprese", titolo: "Negozi e commercio",
    perChi: "Per il negozio che vuole promozioni, social e clienti seguiti senza passare le sere al computer.",
    fa: [
      ["«Prepara la promo di Natale e il volantino»", "Promozioni e pacchetti con prezzi chiari, e la grafica nei colori del negozio."],
      ["«Chi sono i concorrenti qui intorno e quanto fanno pagare?»", "Un'analisi rapida con le fonti lette e cosa fare meglio."],
      ["«Prepara i post per i saldi»", "Il piano dei post, pubblicati all'ora che scegli con il tuo ok."],
      ["«Rispondi ai clienti che chiedono orari e disponibilità»", "Le risposte su Telegram; ciò che non sa lo chiede a te."],
    ],
    mai: ["Non incassa e non rimborsa.", "Non promette sconti che non hai deciso tu."], extra: [TELEGRAM_CLIENTI, CRM] },
  estetica: { gruppo: "imprese", titolo: "Estetica, parrucchieri e benessere",
    perChi: "Per centri estetici, parrucchieri e centri benessere: listini, pacchetti, schede cliente e appuntamenti.",
    fa: [
      ["«Crea il listino dei trattamenti e tre pacchetti per l'inverno»", "Listino e pacchetti con prezzi chiari, pronti da stampare e da pubblicare."],
      ["«Prepara la scheda cliente con il consenso privacy»", "La scheda con il consenso da raccogliere e registrare."],
      ["«Fammi un carosello per Instagram sui trattamenti viso»", "Testi e grafiche nei colori del salone, con il tuo ok prima di pubblicare."],
      ["«Rispondi a chi chiede un appuntamento»", "Su Telegram propone gli orari liberi secondo gli orari che hai scritto e prende l'appuntamento."],
    ],
    mai: ["Non pubblica e non scrive ai clienti senza il tuo ok.", "Non usa i dati dei clienti senza il consenso registrato."], extra: [TELEGRAM_CLIENTI] },
  "agente-immobiliare": { gruppo: "imprese", titolo: "Agenzie immobiliari",
    perChi: "Per l'agenzia che gestisce annunci, visite e contatti, e vuole rispondere a tutti senza perderne uno.",
    fa: [
      ["«Scrivi l'annuncio del trilocale di via Mazzini, con queste foto»", "Il testo e le grafiche dell'annuncio, pronti da pubblicare."],
      ["«Quali documenti servono per vendere questa casa?»", "La checklist con le fonti lette e la data della verifica."],
      ["«Fissa le visite di sabato e manda gli inviti»", "Gli appuntamenti in calendario e gli inviti, con il tuo ok."],
      ["«Rispondi a chi chiede dell'annuncio»", "Le risposte su Telegram con le informazioni che gli hai dato; la trattativa la passa a te."],
    ],
    mai: ["Non registra contratti.", "Non tratta il prezzo al posto tuo."], extra: [TELEGRAM_CLIENTI, CRM] },
  officina: { gruppo: "imprese", titolo: "Officine e carrozzerie",
    perChi: "Per l'officina che vuole preventivi chiari, promemoria ai clienti e telefono meno occupato.",
    fa: [
      ["«Prepara il preventivo per tagliando e freni della Panda di Rossi»", "Il preventivo in PDF con voci e totali controllati."],
      ["«Metti in calendario le revisioni dei clienti di questo elenco»", "I promemoria in calendario, uno per cliente."],
      ["«Cosa dice la norma sulla revisione dei veicoli?»", "Il testo vigente con l'estratto, il link e la data di lettura."],
      ["«Rispondi ai clienti che chiedono orari e appuntamenti»", "Le risposte su Telegram e gli appuntamenti negli orari che hai scritto."],
    ],
    mai: ["Non scrive ai clienti senza il tuo ok.", "Non promette tempi o prezzi che non hai deciso tu."], extra: [TELEGRAM_CLIENTI] },

  sviluppatore: { gruppo: "sviluppo", titolo: "Sviluppatori e software house",
    perChi: "Per chi scrive software: Jarvis usa Claude Code e Codex come motori e ci mette sopra squadra, revisione e il tuo ok.",
    fa: [
      ["«Aggiungi il login con email al gestionale e apri la pull request»", "Il lavoro su un branch dedicato, con test, revisione e la pull request. Con Max."],
      ["«La pipeline è rossa: guarda cosa si è rotto»", "Legge il passo e l'errore di GitHub Actions e propone la correzione con una nuova pull request."],
      ["«Fai la revisione di sicurezza di questo branch»", "Una revisione con un modello diverso dall'autore quando ne hai collegati più d'uno."],
      ["«Riprendi il lavoro di ieri su questo progetto»", "Riprende la sessione dello sviluppatore di quel progetto, anche dopo un riavvio."],
    ],
    mai: ["I comandi girano in un recinto del sistema: non vedono le chiavi dell'app.", "Non sceglie librerie a memoria: versioni e supporto verificati su fonti ufficiali datate."] },
  "sistemista-it": { gruppo: "sviluppo", titolo: "Sistemisti e tecnici IT",
    perChi: "Per chi segue reti, computer e server di uffici e clienti: diagnosi, procedure e documentazione.",
    fa: [
      ["«Analizza questo log e dimmi perché il servizio si ferma»", "Una diagnosi passo per passo, con le prove trovate nel file."],
      ["«Ci sono avvisi di sicurezza per la versione di questo software?»", "Gli avvisi trovati sulle fonti ufficiali, con link e data."],
      ["«Prepara lo script per creare gli utenti del nuovo ufficio»", "Lo script da rivedere, provato nel recinto del progetto."],
      ["«Scrivi la procedura di backup per il cliente, in Word»", "Il documento pronto da consegnare."],
    ],
    mai: ["Non esegue comandi fuori dal recinto del progetto senza il tuo ok.", "Password e credenziali le scrivi tu."] },
  "architetto-software": { gruppo: "sviluppo", titolo: "Architetti software",
    perChi: "Per chi deve decidere come costruire un prodotto: architettura, scelte tecniche e rischi.",
    fa: [
      ["«Progetta l'architettura per un gestionale con più sedi»", "Il piano tecnico con i diagrammi, le alternative considerate e i rischi."],
      ["«Scrivi la nota di decisione sul database»", "La nota di decisione (ADR) con contesto, opzioni, scelta e conseguenze."],
      ["«Scegli tra monolite e microservizi per questo prodotto»", "Il confronto sulle esigenze del prodotto, con versioni e supporto verificati su fonti ufficiali datate."],
    ] },
  "sviluppatore-backend": { gruppo: "sviluppo", titolo: "Sviluppatori backend",
    perChi: "Per chi scrive API, database e servizi.",
    fa: [
      ["«Scrivi l'endpoint per le prenotazioni con i test»", "Il codice su un branch dedicato, con i test, la revisione e la pull request. Con Max."],
      ["«Ottimizza questa query lenta»", "La causa e la correzione, con i test eseguiti nel recinto del progetto."],
      ["«Progetta lo schema del database degli ordini»", "Lo schema con le migrazioni e le scelte spiegate."],
    ] },
  "sviluppatore-frontend": { gruppo: "sviluppo", titolo: "Sviluppatori frontend",
    perChi: "Per chi costruisce interfacce web: componenti, pagine per ogni schermo, accessibilità e prestazioni.",
    fa: [
      ["«Costruisci il componente del carrello in React»", "Il componente su un branch dedicato, con i test e la pull request. Con Max."],
      ["«Rendi la pagina prodotto leggibile anche sul telefono»", "Le correzioni per telefono, tablet e computer, spiegate una per una."],
      ["«Collega il modulo all'API con gli stati di errore»", "Il modulo con caricamento, errori e conferma gestiti, e i test."],
    ] },
  "sviluppatore-fullstack": { gruppo: "sviluppo", titolo: "Sviluppatori full stack",
    perChi: "Per chi porta un prodotto dall'interfaccia al database.",
    fa: [
      ["«Costruisci la prima versione di un'app di prenotazioni»", "Il piano, il codice su un branch dedicato con i test e la pull request. Con Max."],
      ["«Sistema questo bug che parte dal modulo e arriva al database»", "Il percorso del bug ricostruito, la correzione e il test che lo riproduce."],
      ["«Porta in produzione il progetto»", "Il ramo e la pull request verificati; il rilascio parte con il tuo ok."],
    ] },
  "sviluppatore-mobile": { gruppo: "sviluppo", titolo: "Sviluppatori di app",
    perChi: "Per chi sviluppa app per iPhone e Android.",
    fa: [
      ["«Prepara l'app per la revisione dell'App Store»", "I controlli presi dalle regole ufficiali di Apple, la scheda dello store e l'informativa privacy in bozza."],
      ["«Sistema il crash all'avvio su Android»", "La causa cercata nei log, la correzione su un branch dedicato e la pull request. Con Max."],
      ["«Aggiungi le notifiche push all'app»", "Il lavoro con i test e la revisione, pronto per il tuo ok."],
    ] },
  "tester-qa": { gruppo: "sviluppo", titolo: "Tester e QA",
    perChi: "Per chi controlla che il software funzioni prima del rilascio.",
    fa: [
      ["«Scrivi i casi di test del checkout»", "I casi di test con passi, dati e risultato atteso."],
      ["«Automatizza i test end to end con Playwright»", "I test scritti ed eseguiti nel recinto del progetto, con l'esito vero di ogni prova."],
      ["«Scrivi un bug report riproducibile»", "Il report con passi, ambiente, risultato atteso e risultato ottenuto."],
    ] },
  "devops-sre": { gruppo: "sviluppo", titolo: "DevOps e SRE",
    perChi: "Per chi cura pipeline, server, rilasci e incidenti.",
    fa: [
      ["«Prepara la pipeline di rilascio con i test»", "La pipeline su un branch dedicato, con la pull request. Con Max."],
      ["«Scrivi il Dockerfile del servizio»", "Il Dockerfile con le versioni supportate verificate sulle fonti ufficiali."],
      ["«Scrivi il postmortem dell'incidente di ieri»", "Cronologia, causa, impatto e azioni, in un documento."],
    ] },
  cybersecurity: { gruppo: "sviluppo", titolo: "Sicurezza informatica",
    perChi: "Per chi deve proteggere app, siti e sistemi di un'azienda.",
    fa: [
      ["«Fai il threat model della nuova app»", "Le minacce, i rischi e le contromisure, in un documento."],
      ["«Verifica se l'azienda rientra nella NIS2»", "L'analisi con le fonti ufficiali dell'ACN e la data della lettura, da confermare da te."],
      ["«Scrivi la procedura di risposta a un incidente»", "La procedura passo per passo, con chi fa cosa."],
    ] },
  "data-analyst": { gruppo: "sviluppo", titolo: "Analisti dati e BI",
    perChi: "Per chi trasforma vendite, clienti e numeri in decisioni.",
    fa: [
      ["«Analizza le vendite dell'anno per prodotto e mese»", "Il foglio Excel con le formule e i grafici, e cosa dicono i numeri."],
      ["«Spiega perché il margine è sceso a marzo»", "Le cause trovate nei dati, con i conti nel foglio."],
      ["«Trova i clienti che non comprano da sei mesi»", "L'elenco dai tuoi dati, per la campagna che decidi tu."],
    ] },

  "graphic-designer": { gruppo: "digitale", titolo: "Graphic designer e studi grafici",
    perChi: "Per chi disegna loghi, identità visive, grafiche e impaginati per i clienti.",
    fa: [
      ["«Disegna tre proposte di logo per una pasticceria»", "Tre loghi vettoriali con il perché di ciascuno, leggibili anche piccoli e in bianco e nero."],
      ["«Prepara la brand identity con palette e caratteri»", "Il sistema visivo: colori, caratteri e regole d'uso, con il contrasto dei testi controllato."],
      ["«Fai le grafiche per la campagna di Natale»", "Le grafiche per i social nei colori del cliente, controllate prima della consegna."],
      ["«Il preventivo per logo e insegne, con i diritti d'uso»", "Il preventivo in PDF con le revisioni contate e i diritti d'uso scritti per uso, durata e territorio."],
    ] },
  "ux-ui-designer": { gruppo: "digitale", titolo: "UX e UI designer",
    perChi: "Per chi progetta app e siti: flussi, wireframe, design system e accessibilità.",
    fa: [
      ["«Disegna i wireframe del flusso di registrazione»", "Il flusso passo per passo e i wireframe, con le scelte spiegate."],
      ["«Rendi accessibile il modulo di contatto»", "La verifica WCAG del modulo con cosa correggere e la bozza della dichiarazione."],
      ["«Costruisci il design system dell'app»", "Colori, caratteri, misure e componenti con un nome, pronti per gli sviluppatori."],
    ] },
  "copywriter-content": { gruppo: "digitale", titolo: "Copywriter e content",
    perChi: "Per chi scrive siti, articoli, newsletter e campagne.",
    fa: [
      ["«Scrivi i testi della home del cliente»", "I testi nel tono del cliente, senza frasi fatte, pronti da usare."],
      ["«Prepara tre titoli per la campagna»", "Tre proposte con il perché di ciascuna."],
      ["«Rivedi il tono della newsletter»", "La newsletter rivista, con le modifiche spiegate."],
    ] },
  "seo-specialist": { gruppo: "digitale", titolo: "Specialisti SEO",
    perChi: "Per chi cura la visibilità dei siti nelle ricerche, con metodo e senza promesse.",
    fa: [
      ["«Fai l'audit SEO del sito del cliente»", "Cosa va, cosa no e cosa fare prima, pagina per pagina."],
      ["«Trova le parole chiave per un dentista a Bologna»", "Le parole chiave da presidiare e le pagine da scrivere, con le ricerche fatte."],
      ["«Sistema titoli e descrizioni delle pagine»", "I nuovi titoli e le descrizioni, pronti da applicare."],
    ] },
  "social-media-manager": { gruppo: "digitale", titolo: "Social media manager",
    perChi: "Per chi segue i profili social di un'attività o dei clienti.",
    fa: [
      ["«Prepara il piano editoriale di novembre per Instagram»", "Il piano con date, testi e grafiche, pubblicati all'ora che scegli con il tuo ok."],
      ["«Rispondi a questo commento negativo»", "La risposta proposta, nel tono del profilo."],
      ["«Fai il report del mese sui social»", "I risultati profilo per profilo, con la fonte; un dato non disponibile non diventa zero."],
    ] },
  "product-manager": { gruppo: "digitale", titolo: "Product manager",
    perChi: "Per chi decide cosa costruire e in che ordine.",
    fa: [
      ["«Scrivi le user story della nuova funzione»", "Le user story con i criteri di accettazione."],
      ["«Metti in ordine il backlog del trimestre»", "L'ordine proposto, con il perché di ogni scelta."],
      ["«Analizza i concorrenti del prodotto»", "Chi sono, cosa offrono e a che prezzo, con le fonti lette."],
    ] },
  "project-manager": { gruppo: "digitale", titolo: "Project manager",
    perChi: "Per chi porta i progetti in fondo: tempi, persone, rischi e clienti.",
    fa: [
      ["«Prepara il piano di progetto con milestone e responsabili»", "Il piano con le fasi, le date e chi fa cosa, in Excel o Word."],
      ["«Scrivi lo stato avanzamento per il cliente»", "Il documento pronto, che parte con il tuo ok."],
      ["«Organizza la riunione di kickoff»", "L'invito in calendario e, se la registri, il verbale con decisioni e cose da fare."],
    ] },

  "freelance-creativo": { gruppo: "freelance", titolo: "Freelance e creativi",
    perChi: "Per grafici, illustratori, copywriter e chi fa siti: clienti nuovi, preventivi, consegne e scadenze.",
    fa: [
      ["«Trova le attività qui vicino senza sito»", "L'elenco con un'offerta concreta per ognuna e la proposta con link e QR."],
      ["«Fammi il preventivo per il logo e il sito di Ciuffo»", "Il preventivo in PDF con voci, totali e condizioni."],
      ["«Prepara tre proposte di logo nei colori del cliente»", "Loghi vettoriali nei colori misurati dal suo sito."],
      ["«Che scadenze fiscali ho questo trimestre?»", "Lo scadenzario con le date dalle fonti ufficiali e i promemoria."],
    ],
    mai: ["Non firma contratti.", "Non manda preventivi o fatture senza il tuo ok."], extra: [CRM] },
  "agenzia-marketing": { gruppo: "freelance", titolo: "Agenzie di marketing e comunicazione",
    perChi: "Per l'agenzia che segue più clienti: piani editoriali, campagne, risultati e contatti.",
    fa: [
      ["«Prepara il piano editoriale di dicembre per i tre clienti»", "Un piano per cliente, ciascuno con il suo brand, nei suoi progetti. Con Max."],
      ["«Campagna Meta per il salone, budget 10 euro al giorno»", "La campagna pronta e in pausa: parte quando approvi il budget. Con Max."],
      ["«Ogni lunedì i risultati di Instagram e Facebook»", "I risultati profilo per profilo, ogni settimana."],
      ["«Manda i nuovi contatti a HubSpot»", "I contatti nel tuo CRM con il tuo ok, oppure in Make, n8n o Zapier con un webhook."],
    ],
    mai: ["Non spende budget senza il tuo ok.", "Non pubblica senza il tuo ok."], extra: [CRM] },

  pmi: { gruppo: "aziende", titolo: "Piccole e medie imprese",
    perChi: "Per l'azienda che vuole un assistente unico per marketing, amministrazione, legale, IT e vendite.",
    fa: [
      ["«Riassumi la posta di tutte le caselle e dimmi cosa è urgente»", "Il riassunto per casella, con le risposte pronte per il tuo ok."],
      ["«Fammi la presentazione per la banca con i numeri di questo Excel»", "La presentazione in PowerPoint e PDF, con i numeri presi dal foglio."],
      ["«Registra la riunione e prepara il follow-up»", "Il verbale e l'email, che parte con il tuo ok."],
      ["«Manda ogni nuovo contatto su Pipedrive»", "I contatti nel CRM con il tuo ok: HubSpot, Pipedrive, Odoo, o Make, n8n e Zapier."],
    ],
    mai: ["Non firma e non paga.", "Non invia email o post senza il tuo ok.", "Non sostituisce i professionisti per gli atti riservati a loro."], extra: [TELEGRAM_CLIENTI, CRM] },
  associazione: { gruppo: "aziende", titolo: "Associazioni ed enti del Terzo settore",
    perChi: "Per associazioni, APS e volontariato: assemblee, soci, eventi e adempimenti.",
    fa: [
      ["«Prepara la convocazione dell'assemblea dei soci»", "La convocazione e l'email ai soci, che parte con il tuo ok."],
      ["«Quali adempimenti ha un'APS iscritta al RUNTS?»", "Gli adempimenti con le fonti ufficiali e la data della verifica."],
      ["«Prepara la locandina dell'evento e i post»", "Grafica e testi, pubblicati all'ora che scegli con il tuo ok."],
      ["«Rispondi a chi chiede come iscriversi»", "Le risposte su Telegram; ciò che non sa lo chiede a te."],
    ],
    mai: ["Non deposita nulla al RUNTS o agli uffici.", "Non gestisce fondi."], extra: [TELEGRAM_CLIENTI] },

  // Trades added to the catalog on 30/10 (roles in companies, creators and services).
  "technical-leader": { gruppo: "sviluppo", titolo: "Tech lead e team leader tecnici",
    perChi: "Per chi guida una squadra di sviluppo: piani dello sprint, standard di revisione, scelte tecniche e debito tecnico.",
    fa: [
      ["«Prepara il piano tecnico dello sprint»", "Il piano con obiettivi, attività, dipendenze e rischi, pronto da discutere con la squadra."],
      ["«Scrivi gli standard di code review della squadra»", "Le regole della revisione, con esempi e i controlli di sicurezza da non saltare."],
      ["«Spiega al team la scelta tra due librerie»", "Il confronto con versioni e supporto verificati su fonti ufficiali datate, e la nota di decisione."],
      ["«Fai il punto sul debito tecnico»", "L'elenco con impatto, costo e un ordine proposto."],
    ], extra: [BLINDATO] },
  cto: { gruppo: "sviluppo", titolo: "CTO e responsabili della tecnologia",
    perChi: "Per chi decide la tecnologia dell'azienda: strategia, fornitori, architettura e sicurezza.",
    fa: [
      ["«Scrivi la strategia tecnologica del prossimo anno»", "Il documento con obiettivi, scelte, rischi e investimenti, pronto per la direzione."],
      ["«Prepara l'ADR per scegliere il cloud»", "La nota di decisione con contesto, opzioni, scelta e conseguenze, con le fonti ufficiali lette e datate."],
      ["«Valuta tre fornitori di CRM con criteri pesati»", "La matrice di confronto con pesi, punteggi e la fonte di ogni dato."],
      ["«Fai la roadmap tecnica per trimestre»", "La roadmap in una presentazione, con dipendenze e rischi."],
    ], extra: [BLINDATO] },
  "business-analyst": { gruppo: "ruoli-azienda", titolo: "Business analyst e analisti funzionali",
    perChi: "Per chi traduce i bisogni del cliente in requisiti chiari: workshop, processi e user story.",
    fa: [
      ["«Scrivi le user story con i criteri di accettazione»", "Le user story numerate, ognuna con criteri di accettazione verificabili."],
      ["«Disegna il processo as is e to be»", "I due processi passo per passo, con le differenze e i punti da chiarire."],
      ["«Prepara le domande per il workshop col cliente»", "La traccia del workshop, con le domande in ordine e cosa serve decidere."],
      ["«Fai la matrice di tracciabilità»", "Il foglio Excel che lega ogni requisito alle user story e ai test."],
    ] },
  pmo: { gruppo: "ruoli-azienda", titolo: "PMO e program manager",
    perChi: "Per chi tiene sotto controllo un portafoglio di progetti: stati, rischi, decisioni e comitati.",
    fa: [
      ["«Prepara lo status report settimanale del portafoglio»", "Lo stato di ogni progetto, con avanzamento, semaforo e decisioni da prendere."],
      ["«Aggiorna il RAID log»", "Rischi, azioni, problemi e decisioni in un foglio, con responsabili e date."],
      ["«Prepara il comitato di direzione»", "La presentazione con i progetti in ritardo, le cause e le richieste alla direzione."],
      ["«Fai il cruscotto dei progetti in ritardo»", "Il foglio con i ritardi calcolati dalle date, e i grafici."],
    ] },
  cfo: { gruppo: "ruoli-azienda", titolo: "Direttori finanziari e controller",
    perChi: "Per chi guida amministrazione e finanza: budget, cassa, indicatori e scostamenti.",
    fa: [
      ["«Prepara il budget dell'anno per centro di costo»", "Il foglio Excel con le formule, per centro di costo e mese, e le ipotesi scritte."],
      ["«Fai la previsione di cassa a 13 settimane»", "Entrate e uscite settimana per settimana, con il saldo e i punti critici."],
      ["«Spiega gli scostamenti del trimestre»", "Le differenze tra budget e consuntivo, con le cause trovate nei dati."],
      ["«Costruisci il cruscotto dei KPI finanziari»", "Gli indicatori calcolati dal foglio, con i grafici e le formule visibili."],
    ] },
  "hr-manager": { gruppo: "ruoli-azienda", titolo: "Risorse umane",
    perChi: "Per chi si occupa delle persone in azienda: selezione, inserimento, valutazione e welfare.",
    fa: [
      ["«Prepara la job description e l'annuncio per un magazziniere»", "La descrizione del ruolo e l'annuncio, controllato sulle regole contro le discriminazioni."],
      ["«Fai il piano di inserimento dei primi 90 giorni»", "Il piano settimana per settimana, con chi accompagna la persona nuova."],
      ["«Imposta la valutazione annuale delle prestazioni»", "La scheda di valutazione con i criteri e la traccia del colloquio."],
      ["«Proponi un piano di welfare aziendale»", "Le opzioni con le regole lette sulle fonti ufficiali e la data della verifica."],
    ], privacy: "Per i dati dei dipendenti e dei candidati usa un progetto «riservato»: lavora solo con i modelli sul tuo computer.", extra: [LINKEDIN] },
  recruiter: { gruppo: "ruoli-azienda", titolo: "Recruiter e selezione del personale",
    perChi: "Per chi cerca persone per la propria azienda o per i clienti: annunci, colloqui e contatti con i candidati.",
    fa: [
      ["«Scrivi l'annuncio per uno sviluppatore Java su LinkedIn»", "L'annuncio controllato sulle regole contro le discriminazioni, negli appunti: lo incolli e lo pubblichi tu."],
      ["«Prepara la griglia del colloquio»", "Le domande per competenza, con i criteri per valutare le risposte."],
      ["«Scrivi il messaggio di contatto a un candidato»", "Il messaggio personalizzato, che mandi tu."],
      ["«Fai il riepilogo dei candidati per il cliente»", "Il confronto dei profili, con i punti forti e i dubbi, da rivedere da te."],
    ], privacy: "Per i dati dei candidati usa un progetto «riservato»: lavora solo con i modelli sul tuo computer.", extra: [LINKEDIN] },
  "scrum-master": { gruppo: "ruoli-azienda", titolo: "Scrum master e agile coach",
    perChi: "Per chi facilita il lavoro agile di una squadra: sprint, retrospettive e flusso.",
    fa: [
      ["«Prepara la retrospettiva dello sprint»", "La traccia con le attività, le domande e il modello per le azioni decise."],
      ["«Misura il lead time del flusso kanban»", "I tempi calcolati dai dati che gli dai, in un foglio con i grafici."],
      ["«Spiega al cliente come lavoriamo a sprint»", "Un documento semplice, con il calendario degli incontri e cosa serve dal cliente."],
      ["«Prepara il planning con la squadra»", "L'ordine del giorno e la bozza dell'obiettivo dello sprint."],
    ] },
  "delivery-manager": { gruppo: "ruoli-azienda", titolo: "Delivery manager",
    perChi: "Per chi consegna servizi e progetti ai clienti: livelli di servizio, persone, avanzamento e margini.",
    fa: [
      ["«Prepara il report mensile degli SLA per il cliente»", "Il report con i livelli di servizio calcolati dai dati, e le cause degli scostamenti."],
      ["«Pianifica le persone sui progetti del trimestre»", "Il foglio delle assegnazioni, con i sovraccarichi in evidenza."],
      ["«Analizza la marginalità delle commesse»", "I margini per commessa calcolati dal foglio, con le cause delle differenze."],
      ["«Prepara la riunione di avanzamento col cliente»", "L'ordine del giorno, i punti aperti e, se la registri, il verbale."],
    ] },
  "account-manager": { gruppo: "ruoli-azienda", titolo: "Account manager e commerciali B2B",
    perChi: "Per chi segue clienti importanti: piani d'account, proposte, trattative e contatti.",
    fa: [
      ["«Prepara il piano dell'account per il cliente principale»", "Il piano con obiettivi, persone chiave, opportunità e prossimi passi."],
      ["«Scrivi la proposta commerciale per il rinnovo»", "La proposta in PDF e Word, con i prezzi e le condizioni che decidi tu."],
      ["«Aggiorna le trattative nel CRM»", "Le trattative aggiornate su HubSpot, Pipedrive o Odoo, con il tuo ok."],
      ["«Scrivi un post LinkedIn sul caso di successo»", "Il post negli appunti: lo incolli e lo pubblichi tu."],
    ], extra: [CRM, LINKEDIN] },
  "founder-ceo": { gruppo: "ruoli-azienda", titolo: "Fondatori e amministratori delegati",
    perChi: "Per chi guida un'azienda o una startup: piani, investitori, soci e lanci.",
    fa: [
      ["«Prepara il pitch per gli investitori»", "La presentazione con problema, soluzione, mercato e numeri presi dai tuoi file."],
      ["«Scrivi il piano dei prossimi 12 mesi con gli obiettivi»", "Il piano con obiettivi misurabili, responsabili e budget, in un foglio e in un documento."],
      ["«Prepara l'aggiornamento mensile per i soci»", "L'aggiornamento con risultati, cassa e richieste, che parte con il tuo ok."],
      ["«Scrivi un post LinkedIn sul lancio»", "Il post negli appunti: lo incolli e lo pubblichi tu."],
    ], extra: [LINKEDIN, VIDEO] },
  "fotografo-videomaker": { gruppo: "freelance", titolo: "Fotografi e videomaker",
    perChi: "Per chi fotografa e riprende matrimoni, eventi e aziende: preventivi, liberatorie, consegne e social.",
    fa: [
      ["«Prepara il preventivo per un matrimonio con foto e video»", "Il preventivo in PDF con pacchetti, tempi di consegna e diritti d'uso scritti."],
      ["«Scrivi la liberatoria per le foto dei partecipanti»", "La liberatoria con le regole del Garante lette e datate, da rivedere da te."],
      ["«Organizza la consegna della galleria al cliente»", "L'email con il link e le istruzioni, che parte con il tuo ok."],
      ["«Scrivi i post per mostrare l'ultimo servizio»", "I testi e le grafiche, pubblicati all'ora che scegli con il tuo ok."],
    ] },
  "event-planner": { gruppo: "freelance", titolo: "Wedding ed event planner",
    perChi: "Per chi organizza matrimoni ed eventi: budget, fornitori, scaletta e imprevisti.",
    fa: [
      ["«Prepara il budget del matrimonio con i fornitori»", "Il foglio con voci, acconti e scadenze, e i totali calcolati."],
      ["«Fai la scaletta della giornata minuto per minuto»", "Una scaletta per gli sposi e una per i fornitori."],
      ["«Scrivi le email ai fornitori per i preventivi»", "Le email pronte, che partono solo con il tuo ok."],
      ["«Prepara il piano B per la pioggia»", "Le alternative, con i costi e chi avvisare."],
    ] },
  "personal-trainer": { gruppo: "freelance", titolo: "Personal trainer e coach",
    perChi: "Per chi allena o segue le persone: schede, pacchetti, nuovi clienti e social.",
    fa: [
      ["«Prepara la scheda di allenamento per un principiante»", "La scheda con esercizi, serie e progressione, da adattare tu alla persona."],
      ["«Scrivi il pacchetto di lezioni con i prezzi»", "I pacchetti chiari, pronti da stampare e da pubblicare."],
      ["«Prepara il questionario d'ingresso»", "Il questionario con le domande e il consenso per i dati."],
      ["«Scrivi i post per presentare il corso»", "I testi e le grafiche, pubblicati all'ora che scegli con il tuo ok."],
    ], extra: [TELEGRAM_CLIENTI] },
  "content-creator": { gruppo: "creator", titolo: "Content creator e influencer",
    perChi: "Per chi crea contenuti su Instagram, TikTok e YouTube e lavora con i brand.",
    fa: [
      ["«Prepara il media kit per i brand»", "Il media kit con i numeri che gli dai, mai inventati, e i formati di collaborazione."],
      ["«Scrivi la proposta per una collaborazione sponsorizzata»", "La proposta con consegne, tempi, diritti e il prezzo che decidi tu."],
      ["«Pianifica i video della settimana»", "Il piano con idee, testi e date, pubblicati all'ora che scegli con il tuo ok."],
      ["«Come fatturo le sponsorizzazioni?»", "La spiegazione con le regole lette sulle fonti ufficiali e datate, da verificare con il tuo commercialista."],
    ], extra: [VIDEO] },
  "ugc-creator": { gruppo: "creator", titolo: "UGC creator",
    perChi: "Per chi gira video di prodotto per i brand, da usare nelle loro pubblicità.",
    fa: [
      ["«Prepara il listino dei video UGC per i brand»", "Il listino con formati, revisioni e diritti d'uso, e i prezzi che decidi tu."],
      ["«Scrivi lo script di un video prodotto da 30 secondi»", "Lo script scena per scena, con il testo a schermo e la durata."],
      ["«Rispondi a un brand che chiede i diritti per le pubblicità»", "La risposta con durata, canali e prezzo dei diritti, che mandi tu."],
      ["«Prepara il portfolio UGC»", "La pagina del portfolio, pubblicata con il tuo ok."],
    ] },
  "community-manager": { gruppo: "creator", titolo: "Community manager",
    perChi: "Per chi cura una community online: regole, moderazione, eventi e report.",
    fa: [
      ["«Scrivi le regole della community»", "Le regole chiare, con cosa succede a chi non le rispetta."],
      ["«Rispondi a questo commento offensivo»", "La risposta proposta nel tono della community, pubblicata solo con il tuo ok."],
      ["«Prepara il report mensile della community»", "I numeri del mese con la fonte; un dato non disponibile non diventa zero."],
      ["«Organizza un evento online per gli iscritti»", "Il programma, l'invito e i post di annuncio, con il tuo ok."],
    ] },
  podcaster: { gruppo: "creator", titolo: "Podcaster",
    perChi: "Per chi fa un podcast: episodi, ospiti, note e sponsor.",
    fa: [
      ["«Prepara la scaletta del prossimo episodio»", "La scaletta con i temi, i tempi e le domande."],
      ["«Scrivi le note dell'episodio e i capitoli»", "Le note e i capitoli con i minuti, dalla trascrizione dell'audio."],
      ["«Prepara le domande per l'ospite»", "Le domande ricavate da ciò che l'ospite ha pubblicato, con le fonti."],
      ["«Trova sponsor adatti al podcast»", "Un elenco di aziende vicine al tuo pubblico, con il perché e il messaggio di contatto."],
    ] },
  "ecommerce-seller": { gruppo: "creator", titolo: "Venditori online e su marketplace",
    perChi: "Per chi vende su Etsy, Amazon, Vinted, eBay o con un negozio online.",
    fa: [
      ["«Scrivi le schede prodotto per Etsy»", "Titoli e descrizioni chiari, con le informazioni dovute al consumatore."],
      ["«Calcola il margine dopo commissioni e spedizione»", "Il foglio con il margine per prodotto e le formule visibili."],
      ["«Rispondi a un cliente che vuole il reso»", "La risposta con le regole del recesso lette sulle fonti ufficiali, che mandi tu."],
      ["«Prepara le offerte per il Black Friday»", "Le offerte con il prezzo di riferimento indicato secondo le regole lette sulle fonti ufficiali, e i post."],
    ], extra: [ECOMMERCE] },
  "affiliate-marketer": { gruppo: "creator", titolo: "Affiliate marketer",
    perChi: "Per chi guadagna con i link di affiliazione: recensioni, confronti e commissioni.",
    fa: [
      ["«Scrivi una recensione onesta con link di affiliazione»", "La recensione dai dati che gli dai, con la dicitura di affiliazione in evidenza."],
      ["«Prepara la pagina di confronto tra tre prodotti»", "La pagina con la tabella e le fonti, pubblicata con il tuo ok."],
      ["«Controlla che la dicitura di affiliazione sia corretta»", "Il controllo con le regole dell'Autodisciplina Pubblicitaria lette e datate."],
      ["«Fai il report delle commissioni del mese»", "Il foglio con le commissioni per programma e per prodotto."],
    ] },
  "caf-patronato": { gruppo: "professionisti", titolo: "CAF e patronati",
    perChi: "Per chi assiste i cittadini con 730, ISEE, RED e successioni.",
    fa: [
      ["«Prepara l'elenco dei documenti per il 730»", "La checklist per il cittadino, con le regole lette sulle fonti ufficiali e la data della verifica."],
      ["«Controlla cosa manca per l'ISEE di questa famiglia»", "Cosa c'è e cosa manca, voce per voce, dai documenti che gli dai."],
      ["«Spiega al cittadino la scadenza del RED»", "Una spiegazione semplice, con la scadenza letta sul sito dell'INPS e datata."],
      ["«Prepara il riepilogo per la successione»", "Il riepilogo dei beni e dei documenti, da controllare da te."],
    ], privacy: "Per i dati dei cittadini usa un progetto «riservato»: lavora solo con i modelli sul tuo computer.", extra: [PORTALI] },

  // The one function with its own page: what most trades ask beyond their own work.
  "sviluppo-web": { gruppo: "funzioni", titolo: "Siti e app per la tua attività",
    perChi: "Una funzione che si unisce a ogni mestiere: il sito, la pagina di una promozione o la piccola app della tua attività.",
    fa: [
      ["«Fammi un sito per la mia attività»", "Il sito in anteprima, controllato su computer, tablet e telefono; la pubblicazione parte con il tuo ok."],
      ["«Prepara una pagina per la promozione di dicembre»", "La pagina con testi e immagini dell'attività, pronta da pubblicare con il tuo ok."],
      ["«Aggiungi l'informativa sui cookie al sito»", "La bozza dell'informativa e del consenso, con le regole del Garante lette e datate."],
    ] },
};

// The sales side of each trade page and of the home's welcome: the short name on the trade buttons and the trade's
// concrete problem (the headline of its page). Written by hand like PAGINE, and held to the same rule: only what the
// works listed above deliver. No numbers, testimonials or promises of results.
const VENDITA = {
  commercialista: ["Commercialista", "Buste paga, F24 e scadenze dei clienti: le bozze le prepara lui, con le fonti ufficiali."],
  "consulente-lavoro": ["Consulente del lavoro", "Cedolini da ricontrollare, F24 e adempimenti del mese: i conti li rifà lui, tu verifichi."],
  avvocato: ["Avvocato", "Termini, diffide e giurisprudenza: le bozze in meno tempo, la firma resta tua."],
  notaio: ["Notaio", "Documenti da raccogliere, norme vigenti e firme da fissare: la pratica arriva in ordine."],
  "tecnico-edile": ["Geometra, architetto, ingegnere", "Computi metrici, POS e preventivi: meno sere sui fogli, totali controllati."],
  "studio-medico": ["Studio medico", "Posta, agenda e avvisi ai pazienti: la segreteria dello studio torna in pari."],
  "amministratore-condominio": ["Amministratore di condominio", "Convocazioni, verbali e riparti per millesimi: da rileggere, non da scrivere."],
  artigiano: ["Artigiano, impiantista", "Preventivi, dichiarazioni di conformità e solleciti: le carte le prepara lui, tu resti in cantiere."],
  ristorazione: ["Ristorante, bar, pizzeria", "Menù con gli allergeni, registri HACCP e post del sabato, mentre tu sei in cucina."],
  ricettiva: ["Hotel, B&B, affitti brevi", "Alloggiati Web, imposta di soggiorno e domande degli ospiti: pronti prima del check-in."],
  commercio: ["Negozio", "Promozioni, volantini e post dei saldi, senza passare le sere al computer."],
  estetica: ["Estetista, parrucchiere", "Listini, pacchetti, post e richieste di appuntamento, mentre lavori in cabina o in salone."],
  "agente-immobiliare": ["Agenzia immobiliare", "Annunci, visite e richieste sugli immobili: una risposta a tutti, la trattativa resta tua."],
  officina: ["Officina, carrozzeria", "Preventivi chiari, promemoria delle revisioni e risposte ai clienti, anche mentre sei sotto un'auto."],
  sviluppatore: ["Sviluppatore", "Funzioni nuove, pipeline rosse e revisioni: Claude Code e Codex al lavoro, con squadra, revisione e il tuo ok."],
  "sistemista-it": ["Sistemista IT", "Log da leggere, avvisi di sicurezza e procedure per i clienti: la diagnosi arriva con le prove."],
  "architetto-software": ["Architetto software", "Architetture, note di decisione e scelte tecniche: alternative e rischi in fila, con fonti verificate."],
  "sviluppatore-backend": ["Backend", "Endpoint, query lente e schemi del database: il codice con i test, la pull request con il tuo ok."],
  "sviluppatore-frontend": ["Frontend", "Componenti, pagine per ogni schermo e stati di errore: il lavoro con i test, la pull request con il tuo ok."],
  "sviluppatore-fullstack": ["Full stack", "Dal modulo al database: la prima versione, i bug ricostruiti e il rilascio con il tuo ok."],
  "sviluppatore-mobile": ["App mobili", "Revisione dell'App Store, crash su Android e notifiche push: il lavoro con test e revisione."],
  "tester-qa": ["Tester e QA", "Casi di test, test end to end e bug report riproducibili, con l'esito vero di ogni prova."],
  "devops-sre": ["DevOps e SRE", "Pipeline, Dockerfile e postmortem: versioni verificate sulle fonti ufficiali, la produzione si tocca con il tuo ok."],
  cybersecurity: ["Sicurezza informatica", "Threat model, NIS2 e procedure per gli incidenti: documenti con le fonti ufficiali, da confermare da te."],
  "data-analyst": ["Analista dati", "Vendite, margini e clienti persi: i conti in un foglio con le formule, e cosa dicono i numeri."],
  "graphic-designer": ["Graphic designer", "Loghi, brand identity e grafiche di campagna: proposte motivate e preventivi con i diritti d'uso scritti."],
  "ux-ui-designer": ["UX e UI designer", "Flussi, wireframe, accessibilità e design system: le scelte spiegate, pronte per gli sviluppatori."],
  "copywriter-content": ["Copywriter", "Testi della home, titoli e newsletter: nel tono del cliente, senza frasi fatte."],
  "seo-specialist": ["Specialista SEO", "Audit, parole chiave e titoli delle pagine: con metodo, senza promettere il primo posto."],
  "social-media-manager": ["Social media manager", "Piani editoriali, commenti difficili e report del mese: i dati con la fonte, i post con il tuo ok."],
  "product-manager": ["Product manager", "User story, backlog e concorrenti: ogni scelta con il suo perché."],
  "project-manager": ["Project manager", "Piani di progetto, stati avanzamento e kickoff: chi fa cosa e quando, nero su bianco."],
  "freelance-creativo": ["Freelance creativo", "Clienti nuovi, preventivi e scadenze fiscali: meno amministrazione, più tempo per il lavoro creativo."],
  "agenzia-marketing": ["Agenzia di marketing", "Piani editoriali per ogni cliente, campagne Meta e report del lunedì, ogni cliente con il suo brand."],
  pmi: ["Piccola e media impresa", "La posta di tutte le caselle, la presentazione per la banca e i contatti nel CRM: un assistente per tutta l'azienda."],
  associazione: ["Associazione", "Assemblee, adempimenti del RUNTS e locandine degli eventi: meno carte per chi fa volontariato."],
  "technical-leader": ["Tech lead", "Sprint, standard di revisione e debito tecnico: la squadra allineata, le scelte scritte e motivate."],
  cto: ["CTO", "Strategia, fornitori e roadmap: decisioni tecniche scritte, confrontate e motivate."],
  "business-analyst": ["Business analyst", "Workshop, processi e user story: requisiti chiari prima che si scriva una riga di codice."],
  pmo: ["PMO", "Status report, RAID log e comitati: il portafoglio sotto controllo, senza rincorrere i fogli."],
  cfo: ["Direttore finanziario", "Budget, cassa a 13 settimane e scostamenti: i numeri in un foglio con le formule, spiegati."],
  "hr-manager": ["Risorse umane", "Annunci, inserimenti e valutazioni: le persone seguite con metodo, i loro dati al riparo."],
  recruiter: ["Recruiter", "Annunci, griglie di colloquio e messaggi ai candidati: meno tempo sui testi, più tempo con le persone."],
  "scrum-master": ["Scrum master", "Retrospettive, planning e flusso: la squadra facilitata, i tempi del lavoro misurati."],
  "delivery-manager": ["Delivery manager", "SLA, persone sui progetti e margini delle commesse: il report al cliente pronto ogni mese."],
  "account-manager": ["Account manager", "Piani d'account, proposte di rinnovo e trattative nel CRM: ogni cliente importante seguito."],
  "founder-ceo": ["Fondatore, CEO", "Pitch, piano dei 12 mesi e aggiornamenti ai soci: la parte scritta del guidare un'azienda."],
  "fotografo-videomaker": ["Fotografo, videomaker", "Preventivi, liberatorie e consegne delle gallerie: meno ufficio, più tempo dietro l'obiettivo."],
  "event-planner": ["Wedding ed event planner", "Budget, fornitori e scaletta minuto per minuto, con il piano B già pronto."],
  "personal-trainer": ["Personal trainer, coach", "Schede, pacchetti e post per i corsi: più tempo per allenare."],
  "content-creator": ["Content creator", "Media kit, proposte ai brand e piano dei video: i numeri veri, le collaborazioni chiare."],
  "ugc-creator": ["UGC creator", "Listino, script e diritti d'uso: ogni video per i brand venduto con le condizioni scritte."],
  "community-manager": ["Community manager", "Regole, moderazione ed eventi online: la community curata, le risposte difficili con il tuo ok."],
  podcaster: ["Podcaster", "Scalette, note dell'episodio e sponsor: il podcast preparato, tu pensi a registrare."],
  "ecommerce-seller": ["Venditore online", "Schede prodotto, margini e resi su Etsy, Amazon o Vinted: i conti chiari e le regole rispettate."],
  "affiliate-marketer": ["Affiliate marketer", "Recensioni oneste, confronti e commissioni: i link di affiliazione dichiarati come vogliono le regole."],
  "caf-patronato": ["CAF, patronato", "730, ISEE, RED e successioni: le checklist per i cittadini pronte, con le fonti ufficiali."],
};

// The plan a trade needs, as the app proposes it in its first start (owner/profile.ts `planFit`): it follows the
// situation, not the trade. Pro for a person working alone with one main activity, with what would make Max worth it
// for that trade («Pro, Max se…», `maxIf`); Max where the trade itself needs it (an agency's clients as separate
// projects, software development with pull requests on GitHub: src/shared/catalog/plans.ts). Never a price here:
// prices live in docs/config.js and the page shows them.
const fitDi = (role) => planFit([role]);
const MAX_SE = {
  clienti: "segui più clienti come progetti separati",
  campagne: "fai campagne Meta Ads",
  progetti: "aggiungi un'altra attività, con il suo progetto",
  collaboratori: "nello studio lavori con dei collaboratori",
  sviluppo: "sviluppi software con le pull request su GitHub",
  persone: "la squadra supera le 9 persone",
};
const MOTIVO = {
  pro: "Per chi lavora da solo con un'attività principale basta Pro: 1 progetto, la squadra di 9 persone e 3 caselle email, con voce, Telegram, documenti, grafiche e siti.",
  sviluppo: "Lo sviluppo su GitHub con le pull request, le riunioni tra agenti e i progetti senza limite sono nel piano Max.",
  clienti: "Segui più clienti: con Max ognuno ha il suo progetto, con i suoi file, le sue conversazioni e la sua squadra (Pro ha un progetto solo). Nel piano Max ci sono anche le riunioni tra agenti e le campagne Meta Ads.",
};
const oppure = (items) => (items.length > 1 ? `${items.slice(0, -1).join(", ")} o ${items.at(-1)}` : items[0]);
const motivoDi = (fit) => (fit.plan === "pro"
  ? `${MOTIVO.pro} Max ti serve se ${oppure(fit.maxIf.map((reason) => MAX_SE[reason]))}: passi a Max pagando solo la differenza.`
  : MOTIVO[fit.reasons.includes("sviluppo") ? "sviluppo" : "clienti"]);
const INCLUSO = {
  pro: ["1 progetto, 9 persone nella squadra (Studio di 8 + 1 specialista), 3 caselle email ognuna con il suo calendario.",
    "Voce, chat, Telegram, email, documenti, grafiche, siti, piani, modelli gratuiti e backup cifrato."],
  max: ["Progetti, persone della squadra e caselle email senza limite.",
    "In più: riunioni tra agenti, campagne Meta Ads, sviluppo su GitHub con le pull request, gruppo di dispositivi, strumenti MCP personalizzati."],
};

// What Jarvis says of a trade in its own voice (docs/voce/r-<id>.mp3, made by tools/parlante.mjs): the
// transformation, the first three works of the page word for word, and the first reserved act. One sentence per
// caption; `quale` says which work each sentence belongs to (-1: none), so the page can light it while it is said.
const frasiDi = (r) => {
  const frasi = [`Allora divento Jarvis ${r.nome}.`], quale = [-1];
  r.fa.slice(0, 3).forEach(([ask, get], i) => {
    frasi.push(`Mi chiedi: ${ask}${/[?!]»$/.test(ask) ? "" : "."}`); quale.push(i);
    for (const s of get.split(/(?<!\bReg\.)(?<=[a-zà-ù)»][.!?])\s+(?=[A-ZÀ-Ú«])/)) { frasi.push(s); quale.push(i); }
  });
  if (r.reserved[0]) { frasi.push(`E una cosa non la faccio mai: ${r.reserved[0].act}.`); quale.push(-1); }
  return { frasi, quale };
};

// The catalog, joined with the page texts: verticals in the catalog's order, then the function with a page.
const verticals = BUILTIN_ROLES.filter((role) => role.kind === "vertical");
const functions = BUILTIN_ROLES.filter((role) => role.kind === "horizontal");
const functionIds = functions.map((role) => role.id).sort().join(",");
if (functionIds !== Object.keys(FUNZIONI).sort().join(",")) throw new Error(`Le funzioni del catalogo (${functionIds}) non sono quelle di FUNZIONI: aggiorna tools/ruoli.mjs`);
const paged = [...verticals, ...functions.filter((role) => PAGINE[role.id])];
const missing = verticals.filter((role) => !PAGINE[role.id]).map((role) => role.id);
if (missing.length) throw new Error(`Ruoli del catalogo senza i testi del sito: ${missing.join(", ")}. Aggiungili in PAGINE (tools/ruoli.mjs).`);
const unknown = Object.keys(PAGINE).filter((id) => !BUILTIN_ROLES.some((role) => role.id === id));
if (unknown.length) throw new Error(`Testi del sito per ruoli che il catalogo non ha: ${unknown.join(", ")}`);
const senzaVendita = verticals.filter((role) => !VENDITA[role.id]).map((role) => role.id);
if (senzaVendita.length) throw new Error(`Ruoli del catalogo senza nome breve e problema: ${senzaVendita.join(", ")}. Aggiungili in VENDITA (tools/ruoli.mjs).`);
const nameOf = (role) => role.name.replace(/^Jarvis\s+/, "");
const RUOLI = paged.map((role) => {
  const r = { ...PAGINE[role.id], extra: [...(PAGINE[role.id].extra ?? []), ...(PIU[role.id] ?? [])], id: role.id, kind: role.kind, nome: nameOf(role), reserved: role.reserved, seeds: role.sources.seeds, domains: role.sources.domains,
    keywords: role.keywords, excludes: role.excludes ?? [] };
  const [chip, problema] = VENDITA[role.id] ?? [role.title, r.perChi];
  const fit = fitDi(role);
  return { ...r, chip, problema, piano: fit.plan, motivo: motivoDi(fit), ...frasiDi(r) };
});
const FUNZIONI_TESTO = (() => { const words = functions.map((role) => FUNZIONI[role.id]); return `${words.slice(0, -1).join(", ")} e ${words.at(-1)}`; })();
const MESTIERI = verticals.length;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const PIANO = { pro: "Pro", max: "Max" };

// The site's CI (html-validate, long-title) refuses a <title> over 70 characters: a role page whose full title would be
// longer keeps only «Jarvis <nome>», and any other title that long stops the tool.
const TITLE_MAX = 70;
const roleTitle = (r) => [`Jarvis ${r.nome} · ${r.titolo}`, `Jarvis ${r.nome}`].find((t) => t.length <= TITLE_MAX) ?? `Jarvis ${r.nome}`;
const head = (title, description, path) => { if (title.length > TITLE_MAX) throw new Error(`Titolo oltre ${TITLE_MAX} caratteri (${path}): ${title}`); return headHtml(title, description, path); };
const headHtml = (title, description, path) => `<!DOCTYPE html>
<!-- Generated by tools/ruoli.mjs from the app's role catalog: change the texts there and run it again. -->
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="../assets/icon.png">
<meta name="theme-color" content="#04070c">
<link rel="icon" type="image/png" href="../assets/favicon.png">
<link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&amp;family=IBM+Plex+Sans+Condensed:wght@500;600&amp;display=swap">
<link rel="stylesheet" href="../site.css">
</head>
<body class="sub-page">
<a class="skip" href="#contenuto">Vai al contenuto</a>
<header class="top">
  <div class="wrap top-row">
    <a class="brand" href="../index.html" aria-label="Jarvis, torna al sito"><img src="../assets/favicon.png" alt="" width="26" height="26">JARVIS</a>
    <nav class="sub-nav" aria-label="Sezioni">
      <a href="index.html"${path === "index" ? ' aria-current="page"' : ""}>Per chi è</a>
      <a href="../index.html#esempi">Esempi</a>
      <a href="../index.html#piani">Prezzi</a>
      <a href="../aiuto.html">Aiuto</a>
    </nav>
    <a class="button small" href="../index.html#scarica">Scarica</a>
  </div>
</header>
`;

const footer = (scripts = []) => `
<footer class="foot">
  <div class="wrap foot-row">
    <span class="brand small"><img src="../assets/favicon.png" alt="" width="20" height="20">JARVIS</span>
    <span>© 2026 Il vero Jarvis · Tutti i diritti riservati</span>
    <a href="index.html">Per chi è</a>
    <a href="../novita.html">Novità</a>
    <a href="../aiuto.html">Aiuto</a>
    <a href="../condizioni.html">Condizioni di licenza</a>
    <a href="../privacy.html">Privacy</a>
  </div>
</footer>
${scripts.map((src) => `<script src="${src}" defer></script>\n`).join("")}</body>
</html>
`;
const foot = footer();

// The four steps by which Jarvis becomes the expert of a trade, the same on every page.
const COME = [
  ["Capisce il tuo lavoro", "Dal tuo progetto, dai tuoi documenti e dal sito dell'attività: cosa fai, per chi, con quali strumenti."],
  ["Studia le fonti autorevoli", "Le fonti ufficiali del mestiere, lette con la data; quello che trova sul web ha fonte e scadenza."],
  ["Si dà procedure e controlli", "Come si fa quel lavoro, cosa va verificato prima di consegnarlo, cosa non deve mai fare."],
  ["Migliora con i risultati", "Dà un voto a ogni risultato e aggiorna da solo il suo fascicolo del mestiere, dalle fonti ufficiali e dai voti; tu dai solo 👍 o 👎."],
];

const comeHtml = (level) => `<ol class="become">
${COME.map(([b, s]) => `        <li><${level}>${esc(b)}</${level}><p>${esc(s)}</p></li>`).join("\n")}
      </ol>`;

const garanzie = `<ul class="pledges">
        <li><b>I tuoi file restano sul computer</b><span>Online va solo il pezzo che serve a rispondere.</span></li>
        <li><b>Niente esce senza il tuo ok</b><span>Email, post, invii e spese aspettano te.</span></li>
        <li><b>Paghi una volta</b><span>La licenza non scade.</span></li>
        <li><b>Soddisfatto o rimborsato</b><span>Entro 14 giorni dall'acquisto.</span></li>
      </ul>`;

function source({ url, topic }) {
  const host = hostOf(url), name = esc(NOMI[host] ?? host), about = `<small> · ${esc(topic)}</small>`;
  return SENZA_LINK.has(host) ? `<li><span>${name} (${esc(host)})${about}</span></li>` : `<li><a href="${esc(url)}" target="_blank" rel="noopener">${name}${about}</a></li>`;
}

// The icons the voice controls use (the home has them in its sprite).
const SPRITE = `<svg class="sprite" aria-hidden="true" focusable="false"><symbol id="i-play" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5.5v13l10.5-6.5z"/></symbol><symbol id="i-pause" viewBox="0 0 24 24"><path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></symbol></svg>`;

// The voice panel: the sentence being said, the controls (always visible while it speaks) and the voice's credit.
const pannelloVoce = (credit) => `<div class="voce" data-voce hidden>
        <div class="voce-say" data-voce-say></div>
        <div class="voce-controls" role="group" aria-label="Controlli della voce">
          <button type="button" class="voce-btn" data-voce-pausa aria-label="Pausa"><svg class="icon" aria-hidden="true"><use href="#i-pause"/></svg></button>
          <button type="button" class="voce-btn wide" data-voce-salta>Salta</button>
          <button type="button" class="voce-btn wide" data-voce-muto aria-pressed="false">Senza audio</button>
          <span class="voce-bar" aria-hidden="true"><i></i></span>
        </div>
        <p class="voce-credit">${credit}</p>
      </div>`;
const CREDITO = `Voce «Giovanni» di Pocket TTS (Kyutai), <a href="https://creativecommons.org/licenses/by/4.0/deed.it" target="_blank" rel="noopener">CC BY 4.0</a>, la stessa dell'app, generata in anticipo dai testi che leggi. Il sito non usa il microfono: la conversazione a voce vera è nell'app.`;

// The questions a trade asks before trying, with the honest answers (as the home and the app say them).
function dubbi(r) {
  const piano = PIANO[r.piano];
  const clienti = r.id === "studio-medico" ? "I dati dei pazienti escono dal computer?" : "I dati dei miei clienti escono dal computer?";
  const privacy = r.privacy ?? "Per i lavori più delicati usa un progetto «riservato»: lavora solo con i modelli sul tuo computer.";
  const atti = r.reserved.map((item) => item.act);
  const riservati = atti.length ? ` Gli atti riservati restano tuoi: mai ${esc(atti.join("; mai "))}. Se glielo chiedi, ti dice chi li compie.` : "";
  return `<details><summary>${esc(clienti)}</summary><p>Progetti, documenti e voce restano sul tuo computer. Online va solo il pezzo che serve a rispondere, e prima di inviarlo a Claude o ChatGPT codice fiscale, IBAN, nomi e indirizzi diventano segnaposto: è una pseudonimizzazione, non un'anonimizzazione. ${esc(privacy)} Jarvis non si addestra sui tuoi dati; i fornitori online che colleghi seguono le loro regole. <a href="../privacy.html">L'informativa sulla privacy</a>.</p></details>
      <details><summary>Prende il posto del professionista?</summary><p>No. Prepara il lavoro e te lo consegna in bozza, con fonti e date; lo rileggi tu e decidi cosa esce.${riservati}</p></details>
      <details><summary>Serve essere esperti di computer?</summary><p>No. Installi Jarvis come un'app, incolli la licenza e colleghi Claude o ChatGPT: al primo avvio li trova da solo e, se serve, ti guida a installare il programma ufficiale. Poi parli: «Ciao Jarvis», oppure tieni premuto lo spazio. Fuori casa gli scrivi su Telegram.</p></details>
      <details><summary>Quanto costa davvero, con Claude o ChatGPT?</summary><p>Jarvis si paga una volta, senza abbonamento: il piano ${piano}<span data-price-inline="${r.piano}"></span>. Per l'intelligenza artificiale usa il tuo abbonamento Claude o ChatGPT, se ce l'hai già: il prezzo lo decide il fornitore e lo paghi a lui, come oggi. Non ce l'hai? Puoi partire con i modelli gratuiti (Ollama sul computer, OmniRoute online) o con una chiave API e un tetto di spesa. Molte risposte (ora, calcoli, promemoria) non usano proprio l'AI.</p></details>
      <details><summary>Funziona senza internet?</summary><p>In parte. Voce e ascolto girano sul computer, e senza connessione lavora con i modelli di Ollama sul tuo computer (scaricati la prima volta), come in un progetto «riservato». Claude, ChatGPT, la posta, Telegram e le ricerche sul web hanno bisogno di internet.</p></details>
      <details><summary>Come fa a conoscere il mio mestiere?</summary><p>Capisce il tuo lavoro dal progetto, dai documenti e dal sito dell'attività; studia le fonti ufficiali, lette con la data; si dà procedure e controlli; migliora con i risultati, dai voti che dà a ogni consegna e dai tuoi 👍 e 👎. I riferimenti si aggiornano solo dalle fonti ufficiali, e un dato scaduto è detto «da verificare». Le procedure sono una guida per il modello, non la garanzia che le segua sempre: per questo ogni bozza riporta fonti e date, e la rileggi tu.</p></details>`;
}

// The data the page's voice needs: its sentences and plan (the closing words are in docs/voce/testi.js).
const datiVoce = (r) => JSON.stringify({ id: r.id, nome: r.nome, chip: r.chip, piano: r.piano, frasi: r.frasi, quale: r.quale }).replace(/</g, "\\u003c");

function rolePage(r) {
  const group = r.kind === "horizontal" ? "Funzioni di ogni azienda" : GRUPPI.find(([id]) => id === r.gruppo)[1];
  const never = [...r.reserved.map((item) => `          <li><b>Mai ${esc(item.act)}.</b><span>«${esc(item.wording)}»</span></li>`), ...(r.mai ?? []).map((line) => `          <li>${esc(line)}</li>`)];
  const three = r.fa.slice(0, 3), more = r.fa.slice(3);
  const vertical = r.kind === "vertical";
  const piano = PIANO[r.piano];
  return head(roleTitle(r), `${r.problema} ${r.perChi} Prova gratuita di 14 giorni.`, r.id) + `${SPRITE}
<main id="contenuto" class="role">
  <section class="role-hero">
    <div class="wrap">
      <p class="back"><a href="index.html">Tutti i mestieri</a></p>
      <p class="kicker">${esc(group)} · ${esc(r.titolo)}</p>
      <h1><span class="role-tag">Jarvis <span class="role-name">${esc(r.nome)}</span></span> <span class="role-problem">${esc(r.problema)}</span></h1>
      <p class="lead">${esc(r.perChi)}</p>
      <div class="actions">
        <a class="button" href="../index.html#scarica" data-prova data-mestiere="${esc(r.chip)}">Chiedi la prova gratuita</a>
${vertical ? `        <button type="button" class="button ghost" data-voce-play hidden><svg class="icon" aria-hidden="true"><use href="#i-play"/></svg>Ascolta Jarvis ${esc(r.nome)}</button>\n` : ""}      </div>
      <p class="fine">14 giorni del piano Max, completo, con i tuoi abbonamenti. Alla fine scegli Pro o Max e ritrovi i tuoi dati; con Pro le funzioni Max restano visibili ma bloccate.</p>
${vertical ? `      ${pannelloVoce(CREDITO)}\n      <script type="application/json" id="voce-mestiere">${datiVoce(r)}</script>\n` : ""}    </div>
  </section>

  <section class="band" aria-labelledby="fa-title">
    <div class="wrap">
      <h2 id="fa-title" class="section-title">Tre lavori che ti consegna</h2>
      <p class="section-lead">Richieste come le diresti tu, a voce, in chat o da Telegram. Esempi con nomi di fantasia.</p>
      <ol class="asks asks-3">
${three.map(([ask, get]) => `        <li><p class="ask">${esc(ask)}</p><p>${esc(get)}</p></li>`).join("\n")}
      </ol>
${more.length ? `      <p class="also"><b>E anche:</b> ${more.map(([ask, get]) => `${esc(ask)}: ${esc(get.charAt(0).toLowerCase() + get.slice(1))}`).join(" ")}</p>\n` : ""}${(r.extra ?? []).length ? `      <ul class="ticks role-extra">\n${r.extra.map((e) => `        <li>${esc(e)}</li>`).join("\n")}\n      </ul>\n` : ""}    </div>
  </section>

  <section aria-labelledby="mai-title">
    <div class="wrap split-role">
      <div class="never">
        <h2 id="mai-title" class="section-title">Cosa non fa mai</h2>
        <p>Gli atti riservati restano tuoi: Jarvis prepara il lavoro per il professionista, non lo sostituisce. Se glielo chiedi, ti dice chi lo compie.</p>
        <ul>
${never.join("\n")}
        </ul>
      </div>
      <div class="sources">
        <h2 class="section-title">Su cosa studia</h2>
        <p>Le pagine ufficiali che legge per prime, con la data della lettura; se un dato è scaduto, lo ricontrolla prima di usarlo.</p>
        <ul>
          ${r.seeds.map(source).join("\n          ")}
        </ul>
        <p class="allow">Nel suo fascicolo entra solo ciò che ritrova sui siti ufficiali del mestiere (${esc(r.domains.join(", "))}); il resto resta «da confermare» finché non lo confermi tu.</p>
      </div>
    </div>
  </section>

  <section id="piano" class="band" aria-labelledby="piano-title">
    <div class="wrap plan-pick">
      <div class="plan-for">
        <h2 id="piano-title" class="section-title">Il piano per te: ${piano}</h2>
        <p class="plan-price"><span data-price="${r.piano}">Si paga una volta, senza abbonamento.</span></p>
        <p>${esc(r.motivo)}</p>
        <ul class="ticks">
${INCLUSO[r.piano].map((line) => `          <li>${esc(line)}</li>`).join("\n")}
        </ul>
        <p class="fine"><a href="../index.html#piani">Confronta Pro e Max</a></p>
      </div>
      <div class="trial">
        <h3>La prova gratuita, in tre passi</h3>
        <ol class="trial-steps">
          <li><b>Scarica Jarvis</b><span>Per Mac o per Windows.</span></li>
          <li><b>Copia il codice del computer</b><span>Lo trovi nella schermata di attivazione.</span></li>
          <li><b>Mandacelo</b><span>Ricevi la licenza di prova del piano Max, per 14 giorni, con i tuoi abbonamenti.</span></li>
        </ol>
        <p>Alla fine scegli Pro o Max, incolli la licenza e ritrovi i tuoi dati; con Pro le funzioni Max restano visibili ma bloccate.</p>
      </div>
    </div>
  </section>

  <section aria-labelledby="dubbi-title">
    <div class="wrap narrow">
      <h2 id="dubbi-title" class="section-title">Prima di provarlo</h2>
      ${dubbi(r)}
    </div>
  </section>

  <section class="band role-cta" aria-labelledby="cta-title">
    <div class="wrap">
      <h2 id="cta-title" class="section-title">Prova Jarvis ${esc(r.nome)} sul tuo lavoro</h2>
      <p class="section-lead">14 giorni gratis del piano Max, con i tuoi abbonamenti e i tuoi documenti. Ti rispondiamo entro un giorno lavorativo.</p>
      <div class="actions">
        <a class="button" href="../index.html#scarica" data-prova data-mestiere="${esc(r.chip)}">Chiedi la prova gratuita</a>
      </div>
      ${garanzie}
      <p class="fine">Il tuo lavoro è un po' diverso? Jarvis si adatta anche al tuo modo di lavorare, e unisce il mestiere con ${esc(FUNZIONI_TESTO)}. <a href="index.html#il-tuo">Come si adatta</a>.</p>
    </div>
  </section>
</main>
` + footer(["../config.js", "../voce.js", "../voce/testi.js", "../voce/tempi.js", "../mestiere.js"]);
}

function hubPage() {
  const groups = GRUPPI.map(([id, label]) => {
    const roles = RUOLI.filter((r) => r.kind === "vertical" && r.gruppo === id);
    return `      <div class="role-group">
        <h3>${esc(label)}</h3>
        <ul>
${roles.map((r) => `          <li><a href="${r.id}.html"><b>${esc(r.titolo)}</b><span>Jarvis ${esc(r.nome)}</span></a></li>`).join("\n")}
        </ul>
      </div>`;
  }).join("\n");
  const fnList = functions.map((role) => PAGINE[role.id] ? `<a href="${role.id}.html">${esc(role.title)}</a>` : esc(role.title)).join(", ");
  return head("Per chi è Jarvis · Si adatta a ogni lavoro, anche al tuo", "Commercialisti, avvocati, artigiani, ristoranti, B&B, negozi, sviluppatori, designer, aziende: Jarvis studia il tuo mestiere sulle fonti ufficiali e diventa il tuo esperto. Mai gli atti riservati.", "index") + `
<main id="contenuto" class="role">
  <section class="role-hero">
    <div class="wrap">
      <p class="kicker">Per chi è</p>
      <h1>Si adatta a ogni lavoro. <span class="role-name">Anche al tuo.</span></h1>
      <p class="lead">Jarvis non è un assistente uguale per tutti. Capisce cosa fai, studia il tuo mestiere sulle fonti autorevoli e diventa il tuo esperto: il commercialista, l'artigiano, il ristoratore, lo sviluppatore. Qui sotto ${MESTIERI} mestieri già pronti; il tuo lavoro può non esserci, e va bene lo stesso.</p>
      <div class="actions">
        <a class="button" href="#il-tuo">E il tuo lavoro?</a>
        <a class="button ghost" href="#mestieri">${MESTIERI} mestieri</a>
      </div>
    </div>
  </section>

  <section class="band" aria-labelledby="come-title">
    <div class="wrap">
      <h2 id="come-title" class="section-title">Come diventa il tuo esperto</h2>
      <p class="section-lead">Lo stesso metodo per ogni mestiere, anche per uno che non è in elenco.</p>
      ${comeHtml("h3")}
      <ul class="ticks">
        <li><b>Il mestiere e le funzioni di ogni azienda.</b> Unisce il ruolo del tuo lavoro con ${esc(FUNZIONI_TESTO)}: lo stesso Jarvis fa il menù con gli allergeni e i post della settimana.</li>
        <li><b>Studia i tuoi concorrenti.</b> Chi sono, prezzi, punti forti e deboli, con le fonti lette, e cosa fare meglio.</li>
        <li><b>Mai gli atti riservati.</b> Non firma, non deposita, non trasmette, non rappresenta e non fa diagnosi: prepara il lavoro per il professionista.</li>
      </ul>
    </div>
  </section>

  <section id="il-tuo" aria-labelledby="tuo-title">
    <div class="wrap narrow">
      <h2 id="tuo-title" class="section-title">E il tuo lavoro?</h2>
      <p class="section-lead">Fai il barbiere, il fotografo di matrimoni, il vivaista? Diglielo, come a una persona nuova in negozio.</p>
      <ol class="sequence">
        <li><b>«Jarvis, ho una barberia in centro, lavoro su appuntamento»</b><span>Legge il tuo progetto e il sito della barberia, e ti chiede solo quello che manca, con una proposta.</span></li>
        <li><b>Diventa Jarvis il barbiere</b><span>Studia sulle fonti autorevoli quello che serve al tuo mestiere e si dà le sue procedure e i suoi controlli.</span></li>
        <li><b>«Prepara il listino e i post per dicembre»</b><span>Lavora come il tuo esperto, con il marketing e l'amministrazione che servono a un'attività come la tua.</span></li>
        <li><b>Ogni risultato lo rende migliore</b><span>Dà un voto a ciò che consegna e aggiorna da solo il suo fascicolo; tu dai solo 👍 o 👎.</span></li>
      </ol>
      <p class="fine">Esempio illustrativo con un'attività di fantasia.</p>
    </div>
  </section>

  <section id="mestieri" class="band" aria-labelledby="mestieri-title">
    <div class="wrap">
      <h2 id="mestieri-title" class="section-title">${MESTIERI} mestieri, già pronti</h2>
      <p class="section-lead">Per questi mestieri Jarvis parte già con procedure, fonti ufficiali e controlli.</p>
      <div class="role-groups">
${groups}
      </div>
      <p class="fine">E ${functions.length} funzioni che si uniscono a ogni mestiere: ${fnList}.</p>
    </div>
  </section>

  <section aria-labelledby="garanzie-title">
    <div class="wrap">
      <h2 id="garanzie-title" class="section-title">Le garanzie, per ogni mestiere</h2>
      ${garanzie}
      <p class="fine">Le condizioni complete sono nelle <a href="../condizioni.html">condizioni di licenza</a>; come Jarvis tratta i dati nell'<a href="../privacy.html">informativa sulla privacy</a>.</p>
    </div>
  </section>
</main>
` + foot;
}

// The trades for the home's welcome (docs/benvenuto.js) and for the voice tool: names, the words that recognise them
// (the catalog's own keywords and exclusions, matched on the visitor's computer), the plan, the first works and what
// Jarvis says of each. Only the trades: the functions join every trade and are not a job one does.
function mestieriJs() {
  const ruoli = RUOLI.filter((r) => r.kind === "vertical");
  const ordered = GRUPPI.flatMap(([id]) => ruoli.filter((r) => r.gruppo === id));
  const data = {
    gruppi: GRUPPI,
    ruoli: ordered.map((r) => ({ id: r.id, nome: r.nome, chip: r.chip, titolo: r.titolo, gruppo: r.gruppo, piano: r.piano, motivo: r.motivo,
      parole: r.keywords, escludi: r.excludes, fa: r.fa.slice(0, 3), mai: r.reserved[0] ? r.reserved[0].act : "", frasi: r.frasi, quale: r.quale })),
  };
  return `// Generated by tools/ruoli.mjs from the app's role catalog: change the texts there and run it again.\nwindow.JARVIS_MESTIERI = ${JSON.stringify(data)};\n`;
}

mkdirSync(out, { recursive: true });
writeFileSync(join(out, "index.html"), hubPage());
for (const r of RUOLI) writeFileSync(join(out, `${r.id}.html`), rolePage(r));
writeFileSync(resolve(here, "..", "docs", "mestieri.js"), mestieriJs());
console.log(`docs/per: ${MESTIERI} mestieri, ${RUOLI.length - MESTIERI} funzione con la sua pagina, ${functions.length} funzioni in tutto, e l'indice; docs/mestieri.js per il benvenuto`);
console.log(`Piano Max: ${RUOLI.filter((r) => r.piano === "max").map((r) => r.id).join(", ")}`);
