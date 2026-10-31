// What Jarvis says on the site beyond each trade (the trades are in docs/mestieri.js, made by tools/ruoli.mjs): the
// greeting of the welcome, the unknown trade and the closing words for each plan. The single source of these words:
// tools/parlante.mjs speaks them offline with the app's voice into docs/voce/<id>.mp3 and the pages show them as
// captions, so what is said is always what is written. One sentence per caption: each ends with one . ? or ! and has
// none inside. No prices here (they live in docs/config.js): the page shows them next to the words.
window.JARVIS_VOCE_TESTI = [
  { id: "saluto", label: "Benvenuto", sentences: [
    "Ciao, sono Jarvis.",
    "Lavoro sul tuo computer, con il tuo abbonamento Claude o ChatGPT, e divento l'esperto del tuo mestiere.",
    "Ti consegno il lavoro pronto, e prima di ciò che esce ti chiedo l'ok.",
    "Allora: che lavoro fai?",
  ] },
  { id: "nuovo", label: "Il tuo mestiere", sentences: [
    "Questo mestiere non è ancora tra i miei esempi, e va bene lo stesso.",
    "Nell'app me lo racconti, come a una persona nuova in negozio.",
    "Leggo il tuo progetto e il sito dell'attività, e ti chiedo solo quello che manca.",
    "Poi studio il mestiere sulle fonti autorevoli, e mi do procedure e controlli.",
    "Gli atti riservati restano tuoi: non firmo, non deposito e non faccio diagnosi.",
  ] },
  { id: "fine-pro", label: "Il piano per te", sentences: [
    "I tuoi documenti restano sul tuo computer, ed email, post e pagamenti aspettano il tuo ok.",
    "Per un lavoro come il tuo basta il piano Pro: si paga una volta, senza abbonamento.",
    "E puoi provarmi gratis per quattordici giorni, completo, con i tuoi abbonamenti.",
    "Qui ti parlo soltanto: la conversazione a voce vera è nell'app.",
  ] },
  { id: "fine-max", label: "Il piano per te", sentences: [
    "I tuoi documenti restano sul tuo computer, ed email, post e pagamenti aspettano il tuo ok.",
    "Per un lavoro come il tuo serve il piano Max: si paga una volta, senza abbonamento.",
    "E puoi provarmi gratis per quattordici giorni, completo, con i tuoi abbonamenti.",
    "Qui ti parlo soltanto: la conversazione a voce vera è nell'app.",
  ] },
  { id: "fine-scelta", label: "Il piano per te", sentences: [
    "I tuoi documenti restano sul tuo computer, ed email, post e pagamenti aspettano il tuo ok.",
    "Se hai un'attività principale basta il piano Pro; se segui più clienti, sviluppi software o fai campagne, c'è Max.",
    "Si pagano una volta, senza abbonamento, e puoi provarmi gratis per quattordici giorni.",
    "Qui ti parlo soltanto: la conversazione a voce vera è nell'app.",
  ] },

  // When the answer is not a job: one sentence the welcome says, then the choices (never an error, never a loop).
  { id: "aiuto", label: "Dimmi in due parole", sentences: [
    "Non ho capito bene il tuo lavoro.",
    "Dimmelo in due parole: per esempio, faccio l'idraulico, oppure sono un'insegnante.",
    "Oppure scegli qui sotto, o ascolta in un minuto cosa so fare.",
  ] },

  // Families of work without a trade of their own in the app's catalog: what the app really does for anyone there
  // (documents, mail, calendar, meetings, research with sources), what stays out, and that in the app Jarvis studies
  // that work on official sources and becomes its expert (a learned role, roles/synthesize.ts). `parole`: the words
  // that recognise the family (docs/trova.js matches them on the visitor's computer); `pagine`: the closest trades.
  { id: "f-scuola", kind: "famiglia", label: "Scuola, formazione e sport", piano: "pro", pagine: ["associazione", "freelance-creativo"],
    parole: ["insegnante", "insegnanti", "professore", "professoressa", "prof", "docente", "maestro", "maestra", "maestre", "educatrice", "educatore", "formatore",
      "formatrice", "doposcuola", "ripetizioni", "lezioni private", "tutor", "scuola", "istruzione", "preside", "dirigente scolastico", "insegno", "insegnare",
      "istruttore", "istruttrice", "scuola guida", "logopedista per bambini", "asilo", "nido",
      "baby sitter", "babysitter", "tata", "pedagogista", "corsi di formazione"],
    sentences: [
      "Per chi insegna, educa o allena: nell'app mi racconti il tuo lavoro, e lo studio sulle fonti ufficiali per diventare il tuo esperto.",
      "Già da subito preparo lezioni, schede ed esercizi in Word, PDF o PowerPoint.",
      "Tengo il calendario, e preparo le email per le famiglie, che partono solo con il tuo ok.",
      "Il registro elettronico non lo tocco: voti e assenze restano tuoi.",
      "E i dati degli studenti li tieni in un progetto riservato, che non esce dal computer.",
    ] },
  { id: "f-progettazione", kind: "famiglia", label: "Ingegneria e progettazione", piano: "pro", pagine: ["tecnico-edile", "architetto-software"],
    parole: ["ingegnere meccanico", "ingegnera meccanica", "ingegnere industriale", "ingegnere gestionale", "ingegnere elettronico", "ingegnere elettrico",
      "ingegnere chimico", "ingegnere aerospaziale", "ingegnere navale", "ingegnere biomedico", "ingegnere ambientale", "ingegnere energetico",
      "progettista meccanico", "progettista industriale", "progettazione meccanica", "progettazione industriale", "disegnatore tecnico", "disegnatrice tecnica",
      "industrial designer", "product designer", "designer industriale", "ufficio tecnico", "cad", "sedili", "aerei", "aereo", "aeronautica", "aerospaziale",
      "automotive", "stampi", "prototipi", "meccatronica", "ricerca e sviluppo"],
    sentences: [
      "Per chi progetta, in un ufficio tecnico o da libero professionista: nell'app mi racconti cosa progetti, e studio le norme e le fonti ufficiali del tuo settore.",
      "Già da subito preparo relazioni tecniche, offerte e presentazioni, con i conti controllati in un foglio Excel.",
      "Cerco norme e documentazione con la fonte e la data, e dalle riunioni ti preparo il verbale.",
      "I disegni restano nei tuoi programmi di progettazione: io lavoro sui documenti intorno al progetto.",
      "E la firma e le responsabilità del progetto restano tue.",
    ] },
  { id: "f-sociale", kind: "famiglia", label: "Sociale e cura delle persone", piano: "pro", pagine: ["studio-medico", "associazione"],
    parole: ["assistente sociale", "servizio sociale", "servizi sociali", "operatore sociale", "operatrice sociale", "educatore professionale", "oss",
      "operatore socio sanitario", "operatrice socio sanitaria", "infermiere", "infermiera", "badante", "caregiver", "cooperativa sociale", "comunita",
      "casa di riposo", "rsa", "assistenza domiciliare", "mediatore culturale", "mediatrice culturale", "volontariato sociale", "sociologo", "sociologa"],
    sentences: [
      "Per chi lavora nel sociale o nella cura delle persone: nell'app mi racconti il tuo lavoro, e lo studio sulle fonti ufficiali.",
      "Già da subito preparo relazioni e verbali in bozza, tengo agenda e appuntamenti, e riassumo la posta.",
      "I dati delle persone che segui li tieni in un progetto riservato: lavora solo con i modelli sul tuo computer.",
      "Non faccio diagnosi e non valuto le persone: le decisioni restano tue.",
    ] },
  { id: "f-creativi", kind: "famiglia", label: "Arte, spettacolo e mestieri creativi", piano: "pro", pagine: ["freelance-creativo", "graphic-designer"],
    parole: ["musicista", "cantante", "artista", "pittore", "pittrice", "scultore", "scrittore", "scrittrice", "attore", "attrice", "ballerino", "ballerina",
      "regista", "dj", "band", "teatro", "stilista", "sarta", "sarto", "tatuatore", "tatuatrice", "ceramista", "orafo", "orafa", "artigiano artistico",
      "fumettista", "giornalista", "blogger"],
    sentences: [
      "Per chi crea: musica, immagini, testi, spettacoli o oggetti fatti a mano.",
      "Nell'app mi racconti il tuo lavoro, e lo studio sulle fonti del tuo settore.",
      "Già da subito preparo preventivi, contratti in bozza e post per i social, e ti tengo le scadenze.",
      "Faccio anche loghi, locandine e il sito con i tuoi lavori, pubblicato con il tuo ok.",
      "Un parere legale vincolante su un contratto, invece, resta a un professionista.",
    ] },
  { id: "f-produzione", kind: "famiglia", label: "Fabbrica e produzione", piano: "pro", pagine: ["pmi", "data-analyst"],
    parole: ["operaio", "operaia", "fabbrica", "produzione", "produciamo", "azienda che produce", "manifattura", "metalmeccanico", "metalmeccanica",
      "stabilimento", "capo reparto", "caporeparto", "responsabile qualita", "magazziniere", "magazziniera", "logistica di magazzino", "tornitore",
      "saldatore", "falegnameria industriale", "mobilificio", "tipografia", "packaging industriale", "industria", "industriale"],
    sentences: [
      "Per chi lavora in un'azienda che produce: nell'app mi racconti cosa fate, e studio il settore sulle fonti ufficiali.",
      "Già da subito preparo offerte, schede tecniche e presentazioni, e leggo i numeri di un foglio Excel.",
      "Riassumo la posta, dalle riunioni ti preparo decisioni e cose da fare, e cerco le norme con la fonte e la data.",
      "Il gestionale di produzione non lo tocco: lavoro sui documenti e sui dati che mi dai.",
    ] },
  { id: "f-trasporti", kind: "famiglia", label: "Trasporti e consegne", piano: "pro", pagine: ["pmi", "officina"],
    parole: ["autista", "camionista", "autotrasportatore", "autotrasporto", "trasporti", "corriere", "consegne", "spedizioni", "spedizioniere", "taxi",
      "tassista", "ncc", "noleggio con conducente", "autobus", "logistica", "rider", "trasloco", "traslochi", "pilota", "ferroviere", "marittimo"],
    sentences: [
      "Per chi guida, consegna o organizza spedizioni: nell'app mi racconti il tuo lavoro, e studio le regole del settore sulle fonti ufficiali.",
      "Già da subito organizzo percorsi e trasferte con i link delle mappe, e ti tengo le scadenze in calendario.",
      "Preparo preventivi e documenti, e con il computer acceso rispondo ai clienti su Telegram con le informazioni che mi dai.",
      "Nei portali dei corrieri e degli enti entri tu: io ti preparo i dati.",
    ] },
  { id: "f-agricoltura", kind: "famiglia", label: "Agricoltura e cibo", piano: "pro", pagine: ["commercio", "ristorazione"],
    parole: ["agricoltore", "agricoltrice", "contadino", "contadina", "azienda agricola", "agriturismo", "allevatore", "allevatrice", "allevamento",
      "viticoltore", "vignaiolo", "cantina", "vino", "olio", "frantoio", "apicoltore", "miele", "caseificio", "panificio", "panettiere", "fornaio",
      "macelleria", "macellaio", "pescatore", "vivaio", "vivaista", "floricoltore", "agronomo", "agronoma", "campi", "serra"],
    sentences: [
      "Per chi coltiva, alleva o produce cibo e vino: nell'app mi racconti la tua azienda, e studio le regole del settore sulle fonti ufficiali.",
      "Già da subito preparo schede dei prodotti, listini e grafiche, e i post per farli conoscere.",
      "Ti tengo le scadenze in calendario, e preparo domande e documenti in bozza.",
      "I registri e i portali come il SIAN restano tuoi, o del tuo centro di assistenza: io ti preparo i dati.",
    ] },
  { id: "f-pubblico", kind: "famiglia", label: "Pubblica amministrazione", piano: "pro", pagine: ["associazione", "pmi"],
    parole: ["comunale", "dipendente comunale", "dipendente pubblico", "dipendente pubblica", "pubblica amministrazione", "pa", "ente pubblico", "ministero", "lavoro in regione",
      "asl", "funzionario", "funzionaria", "impiegato comunale", "impiegata comunale", "statale", "ufficio tecnico comunale", "polizia locale", "vigile",
      "carabiniere", "poliziotto", "militare", "tribunale", "cancelliere", "inps", "agenzia delle entrate"],
    sentences: [
      "Per chi lavora in un ente pubblico: nell'app mi racconti il tuo ufficio, e studio le norme sulle fonti ufficiali, con la data della lettura.",
      "Già da subito preparo bozze di lettere, relazioni e atti, e riassumo la posta.",
      "Il protocollo e i programmi dell'ente restano fuori: lavoro sui documenti che mi dai.",
      "I dati dei cittadini li tieni in un progetto riservato, che non esce dal computer, e firme e provvedimenti restano tuoi.",
    ] },
  { id: "f-ufficio", kind: "famiglia", label: "Ufficio, banca e assicurazioni", piano: "pro", pagine: ["pmi", "commercialista"],
    parole: ["impiegato", "impiegata", "segretario", "segretaria", "segreteria", "receptionist", "amministrativo", "amministrativa", "ufficio", "back office",
      "bancario", "bancaria", "banca", "consulente finanziario", "consulente finanziaria", "promotore finanziario",
      "assicuratore", "assicurazioni", "agente assicurativo", "broker", "agente di commercio", "rappresentante", "venditore", "venditrice", "commerciale",
      "call center", "customer care", "manager", "dirigente", "imprenditore", "imprenditrice", "consulente", "libero professionista", "libera professionista"],
    sentences: [
      "Per chi lavora in ufficio, in banca, in assicurazione o nelle vendite: nell'app mi racconti il tuo lavoro, e studio il tuo settore sulle fonti ufficiali.",
      "Già da subito riassumo la posta di tutte le caselle, preparo le risposte e fisso gli appuntamenti.",
      "Preparo presentazioni e fogli Excel con i numeri controllati, e dalle riunioni ti preparo il verbale.",
      "Ciò che esce, un'email o un'offerta, aspetta sempre il tuo ok.",
    ] },

  // Not a job: who studies, stays at home, is retired or looks for work. What Jarvis does for them, without
  // pretending it is for their job; a small activity on the side (a doposcuola) is followed like a trade.
  { id: "v-studio", kind: "vita", label: "Per chi studia", piano: "pro", poi: "Quando lavorerai",
    parole: ["studente", "studentessa", "studenti", "universita", "universitaria", "universitario", "uni", "facolta", "laurea", "laureando", "laureanda",
      "tesi", "esami", "vado al liceo", "frequento il liceo", "liceale", "sto studiando", "studio all", "studio per", "dottorando", "dottoranda", "specializzando", "erasmus", "master"],
    sentences: [
      "Jarvis nasce per il lavoro, ma ti aiuta anche a studiare.",
      "Riassumo dispense e articoli, preparo schemi e presentazioni, e cerco le fonti con il link e la data.",
      "Trascrivo le registrazioni delle lezioni, e ti tengo il calendario degli esami.",
      "E quando lavorerai, mi racconti il tuo mestiere, e lo studio per diventare il tuo esperto.",
    ] },
  { id: "v-casa", kind: "vita", label: "Per te e la tua famiglia", piano: "pro", poi: "E per la tua attività",
    parole: ["casalinga", "casalingo", "casalinghe", "a casa", "sto a casa", "mamma", "papa", "genitore", "faccio la mamma", "mamma a tempo pieno",
      "nonna", "nonno", "gestisco la casa", "mi occupo della casa", "mi occupo dei figli"],
    sentences: [
      "Jarvis nasce per il lavoro, ma ti aiuta anche a casa.",
      "Ti tengo appuntamenti e scadenze di famiglia, riassumo la posta, e preparo lettere e documenti.",
      "Organizzo i viaggi, con percorsi e alloggi, e prenoto solo con il tuo ok.",
      "E se hai una piccola attività, come un doposcuola o delle lezioni private, la seguo come un mestiere.",
    ] },
  { id: "v-giorni", kind: "vita", label: "Per la vita di tutti i giorni", piano: "pro", poi: "E per la tua attività",
    parole: ["pensionato", "pensionata", "pensionati", "in pensione", "pensione", "non lavoro piu", "ritirato", "ritirata", "non lavoro", "nessun lavoro", "niente", "nulla", "al momento niente", "nessuno"],
    sentences: [
      "Jarvis nasce per il lavoro, ma ti aiuta anche nella vita di tutti i giorni.",
      "Mi parli in italiano, e ti rispondo a voce: niente menu da imparare.",
      "Ti ricordo appuntamenti e scadenze, ti riassumo la posta, e preparo lettere e documenti.",
      "Organizzo i viaggi, con percorsi e alloggi, e prenoto solo con il tuo ok.",
      "Per medicine e terapie, invece, chiedi sempre al tuo medico.",
    ] },
  { id: "v-cerco", kind: "vita", label: "Per chi cerca lavoro", piano: "pro", poi: "Il lavoro che cerchi",
    parole: ["disoccupato", "disoccupata", "cerco lavoro", "cerco un lavoro", "in cerca di lavoro", "senza lavoro", "inoccupato", "inoccupata",
      "cassa integrazione", "naspi", "tra un lavoro e l altro"],
    sentences: [
      "Jarvis nasce per il lavoro, e ti aiuta anche a trovarne uno.",
      "Preparo il curriculum e le lettere di presentazione, in Word e in PDF.",
      "Cerco le offerte e le aziende della tua zona, con il link e la data in cui le ho lette.",
      "E se vuoi metterti in proprio, ti aiuto con il sito, il listino e i primi post.",
    ] },
];
// How the voice must say a few words, given to the app's speech plan exactly like the owner's lexicon in the app.
window.JARVIS_VOCE_LESSICO = [["ok", "okèi"], ["post", "pòst"], ["ChatGPT", "Ciat-Gipitì"], ["Reg. UE", "regolamento europeo"], ["millecentosessantanove/duemilaundici", "millecentosessantanove del duemilaundici"],
  ["F24", "effe ventiquattro"], ["DevOps", "dev-òps"], ["Dockerfile", "Dockerfile"], ["SIAN", "SIAN"], ["wireframe", "uàier-freim"], ["milestone", "màil-ston"],
  ["end to end", "end tu end"], ["palette", "palèt"], ["home", "hòum"], ["Actions", "ècscions"], ["Alloggiati Web", "alloggiati uèb"],
  ["as is", "es ìs"], ["to be", "tu bì"], ["CAF", "caf"], ["ISEE", "ìsee"], ["RED", "rèd"], ["RAID", "rèid"], ["affiliate", "affìliet"], ["Odoo", "odù"]];
