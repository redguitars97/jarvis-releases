<div align="center">

<img src="docs/assets/icon.png" alt="Jarvis" width="132" height="132">

# Jarvis

**L'assistente che lavora per te: parla, capisce i tuoi progetti, guida una squadra di agenti e porta a termine il lavoro.**

Per imprenditori, freelance e professionisti · Italiano

[![macOS](https://img.shields.io/badge/macOS-Apple%20Silicon%20e%20Intel-9fdcff?logo=apple&logoColor=white&labelColor=04070c)](#installazione)
[![Windows](https://img.shields.io/badge/Windows-10%20e%2011-9fdcff?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0zIDNoOC41djguNUgzek0xMi41IDNIMjF2OC41aC04LjV6TTMgMTIuNWg4LjVWMjFIM3pNMTIuNSAxMi41SDIxVjIxaC04LjV6Ii8+PC9zdmc+&labelColor=04070c)](#installazione)
[![Telegram](https://img.shields.io/badge/Telegram-dal%20telefono-9fdcff?logo=telegram&logoColor=white&labelColor=04070c)](#cosa-sa-fare)

[![Ultima versione](https://img.shields.io/github/v/release/redguitars97/jarvis-releases?label=versione&color=9fdcff&labelColor=04070c)](https://github.com/redguitars97/jarvis-releases/releases/latest)
[![Download](https://img.shields.io/github/downloads/redguitars97/jarvis-releases/total?label=download&color=9fdcff&labelColor=04070c)](https://github.com/redguitars97/jarvis-releases/releases)
[![Sito](https://img.shields.io/github/actions/workflow/status/redguitars97/jarvis-releases/sito.yml?branch=main&label=sito&labelColor=04070c)](https://github.com/redguitars97/jarvis-releases/actions/workflows/sito.yml)
[![Segnalazioni aperte](https://img.shields.io/github/issues/redguitars97/jarvis-releases?label=segnalazioni&color=f4b544&labelColor=04070c)](https://github.com/redguitars97/jarvis-releases/issues)

**[Sito di Jarvis](https://redguitars97.github.io/jarvis-releases/)** ·
[Scarica l'ultima versione](https://github.com/redguitars97/jarvis-releases/releases/latest) ·
[Cosa sa fare](#cosa-sa-fare) ·
[Licenza](#licenza-e-aggiornamenti) ·
[Domande frequenti](#domande-frequenti)

</div>

---

> Le prime versioni pubbliche arriveranno qui. Questo repository contiene solo gli installer e le note di rilascio.

**Il modo più semplice:** installi Jarvis, colleghi il tuo abbonamento Claude o ChatGPT (al primo avvio lo trova da solo)
e gli parli. Modelli gratuiti, chiavi API e Gemini sono per chi vuole di più: li trovi più sotto e, sul sito, in «Per
utenti avanzati». Sul sito, se vuoi, **Jarvis ti accoglie a voce**: ti chiede che lavoro fai (tocchi il tuo o lo
scrivi in due parole, riconosciuto sul tuo computer), ti dice cosa ti consegnerebbe, cosa non fa mai e quale piano ti
serve, con la stessa voce dell'app (Pocket TTS di Kyutai, voce «Giovanni», CC BY 4.0), generata in anticipo e mostrata
sempre come sottotitoli; oppure leggi, senza audio. Il sito non usa il microfono: la conversazione a voce vera è
nell'app. Ogni mestiere ha la sua pagina in [Per chi è](https://redguitars97.github.io/jarvis-releases/per/).

**Lavora con gli strumenti che usi già:** Claude · ChatGPT e Codex · Ollama · OmniRoute · Gmail e ogni casella IMAP\* ·
calendari CalDAV e iCloud · GitHub · Instagram, Facebook e Meta Ads · TikTok (dal browser) · Netlify · Google Chrome ed Edge · Zoom, Meet e Teams · Word, Excel,
PowerPoint e PDF.

<sub>\* Compatibilità email Microsoft (Outlook, Hotmail, Microsoft 365) in arrivo.</sub>

## Vedi sempre cosa sta facendo

Al centro c'è il nucleo di Jarvis. **Ti ascolta**: l'anello esterno diventa lo spettro della tua voce. **Lavora**: attorno
al nucleo escono i pannelli del lavoro in corso. **Ti risponde**: il nucleo segue la sua voce. **Aspetta il tuo ok**:
tutto diventa ambra e la richiesta, con i pulsanti, viene in primo piano. Guardalo dal vivo sul
[sito](https://redguitars97.github.io/jarvis-releases/#stati).

## Il vero Jarvis

Un assistente con questo nome deve fare cinque cose. Jarvis le fa tutte, sul tuo computer e con gli abbonamenti che hai
già.

| | |
| --- | --- |
| **Ti sente.** | Dici «Ciao Jarvis» e chiedi. Ascolto e voce girano sul tuo computer, in italiano, anche mentre sta lavorando ad altro. |
| **Sa.** | Conosce i tuoi progetti, i clienti e le loro regole, e riprende il filo di ogni lavoro anche il giorno dopo. |
| **Fa.** | Consegna il lavoro finito: il sito con il link, il preventivo in PDF, l'invito nel calendario, la campagna pronta in pausa. |
| **Chiede.** | Prima di ogni email, post, pubblicazione o spesa aspetta il tuo ok: dall'app, a voce o da Telegram. Se manca un dato essenziale chiede solo quello, in un messaggio, con una proposta: basta «decidi tu». |
| **Impara.** | Dà da solo un voto a ogni risultato controllato e sceglie il modello del tuo abbonamento che rende meglio per quel lavoro. |

## Più progetti insieme, un solo Jarvis

Mentre la squadra lavora a un cliente, puoi già chiedere qualcosa per un altro, o una cosa veloce per te. Ogni
richiesta resta legata al suo progetto, dall'inizio alla risposta.

| | |
| --- | --- |
| **AUTO impara dai risultati** | Jarvis valuta da solo il lavoro verificato: discreto, buono, ottimo, super. Usa i risultati di attività comparabili per scegliere modello e ragionamento; tu dai soltanto un pollice. I criteri sono nella sezione AUTO qui sotto. |
| **Più progetti, ciascuno con il suo filo** | Puoi far avanzare il sito di un cliente e le modifiche di un altro. Jarvis tiene distinti lavori, file e conversazioni e riprende il contesto pertinente: ogni lavoro segue la sua richiesta, due modifiche alla stessa cartella non si accavallano, e lo sviluppatore ritrova la sessione di quel progetto, anche il giorno dopo. |
| **Lo guidi a voce, anche mentre lavora** | Chiedi un aggiornamento, passa a un altro progetto o fai una domanda veloce. Jarvis sa a quale lavoro ti riferisci e ti chiede di precisarlo quando serve: «ferma il piano di Ciuffo» mette in pausa solo quello, un «sì» con due richieste in attesa ti chiede quale. Se un lavoro finisce mentre parli d'altro, te lo dice a parte, con il nome del progetto. |

Per esempio, con due progetti di prova: «Crea il sito della Pizzeria Da Mario» → «Cambia il colore del sito di Ciuffo»
(un secondo lavoro, mentre il primo continua) → «Che ore sono?» (risponde subito, senza cambiare progetto) → «Riprendi
il primo sito» (torna alla pizzeria, con la sessione dello sviluppatore di quel sito). <sub>Esempio illustrativo: la
sequenza è simulata; il comportamento è quello che i controlli automatici dell'app verificano a ogni versione.</sub>

## AUTO: il modello giusto per ogni fase, dentro il tuo abbonamento

Con Claude Pro o ChatGPT Plus i limiti finiscono presto se ogni richiesta va al modello più potente con il
ragionamento al massimo. **AUTO** decide tre cose per ogni fase di un lavoro: chi deve intervenire, quale modello del
tuo abbonamento usare e quanto deve ragionare.

| | |
| --- | --- |
| **Leggero quando basta, potente quando serve** | Una riscrittura o una mail al modello leggero del tuo piano (per esempio Haiku o Luna), un sito con il brief a quello intermedio, un'architettura o una diagnosi difficile al più capace. Ragionamento basso di norma, medio quando la fase lo richiede, alto solo con un motivo (per esempio «pensaci bene»). Se un modello leggero non basta, il lavoro passa una volta a uno più capace dello stesso abbonamento. |
| **I modelli che hai davvero** | L'elenco dei modelli del tuo account letto da Claude Code, da Codex o dalla tua chiave, senza spendere nulla per provarli. Un modello che il tuo piano non include resta fuori; uno nuovo del tuo abbonamento entra senza aggiornare l'app, e non viene trattato come il più potente finché il fornitore non lo descrive così. |
| **Se scegli tu, la tua scelta resta** | Un modello scelto in chat («usa Claude») o dato a una persona della squadra vale per tutto quel lavoro: sviluppo, deleghe, revisioni e riassunti, con il ragionamento che hai scelto, senza abbassarlo per risparmiare; quello scelto per un ruolo vale per il lavoro di quel ruolo. Mai un altro modello senza il tuo sì: al limite il lavoro aspetta il ripristino. Una revisione indipendente con un altro modello te la chiede prima. |
| **Un budget per lavoro, una quota per account** | Deleghe, correzioni, revisioni e riassunti di un lavoro condividono lo stesso budget, con spazio tenuto per il controllo finale: i lavori accessori aspettano, quelli in corso finiscono. Due collegamenti allo stesso account sono una sola quota. La quota residua la vedi solo se il fornitore la comunica; altrimenti Jarvis lo dice e non inventa percentuali. |
| **Meno lavoro inutile, stessa qualità** | Solo gli strumenti e il contesto che servono, il resto recuperato quando occorre; lo sviluppatore riprende la sua sessione, nelle correzioni e, con Claude Code e Codex, anche nella richiesta successiva sullo stesso progetto o dopo un riavvio se la scelta del modello è la stessa (le API ricevono la cronologia e il riassunto); prima i controlli automatici, poi il revisore, niente revisioni ripetute sullo stesso materiale; la squadra interviene quando serve una competenza, le riunioni si chiudono a decisione presa. |
| **Chat e attività con il loro filo** | Claude Code, Codex e Gemini CLI riprendono anche la sessione della chat principale e della persona nel progetto. Se una sessione non si può recuperare Jarvis lo dichiara e passa il punto del lavoro. Le attività indipendenti possono procedere insieme; quelle che usano il risultato di un'altra aspettano. Gli agenti identificati mostrano avvio ed esito in chat e sul telefono collegato: un esito non confermato resta tale. |
| **Modifiche locali e pull request** | Controlla tutti i repository collegati al progetto, anche frontend e backend separati. Può preparare la PR delle modifiche già presenti: controlli e revisione su una copia, poi sorgente/destinazione visibili nell'ok prima di commit, push e PR. Un branch ambiguo va indicato, uno stato non leggibile è segnalato. |
| **Gemini** | Con un account Google personale: la chiave di Google AI Studio, che si crea gratis (alcuni modelli gratuiti entro i limiti di Google, gli altri a consumo). Dal 18 giugno 2026 Google non serve più Gemini CLI agli account personali (AI Pro, Ultra o gratuito) e non consente di usare Antigravity da un'app come Jarvis con un piano personale. Con una licenza aziendale Gemini Code Assist: collegamento dedicato tramite il Gemini CLI ufficiale, installato da te, senza spese oltre quota. Il CLI può cambiare modello automaticamente: se chiedi un modello esatto Jarvis lo segnala prima di iniziare. Non offre sottoagenti nativi in Jarvis. |
| **Vedi dove va il consumo** | Sotto ogni risposta modello, ragionamento e motivo della scelta; in Attività ogni lavoro diviso per fase (sviluppo, revisioni, riassunti, errori). La scelta di prima (il modello di ogni collegamento e il ragionamento per ruolo) resta disponibile nelle Connessioni, in modalità avanzata; le protezioni su budget, quote e scelte tue restano. |
| **AUTO impara dai risultati** | Ogni risultato controllato riceve da Jarvis un voto (discreto, buono, ottimo, super) con il modello, il ragionamento e il tipo di lavoro che l'hanno prodotto; i giri di correzione dello stesso lavoro valgono un risultato solo. AUTO rilegge le pagelle della combinazione che sta per usare: un modello più leggero prende un lavoro solo dopo buoni risultati suoi su lavori dello stesso tipo e con lo stesso ragionamento, mai per una revisione o un lavoro a rischio; da basso a medio quando basso rende poco, mai ad alto per questo. Tu dai soltanto 👍 o 👎, anche su un singolo passo di un piano: il pollice sul risultato pesa anche su chi l'ha prodotto, e in Attività vedi quando il tuo giudizio e i controlli non coincidono. |

Nessuno può promettere una giornata illimitata con quote finite: dipendono dal piano, dal modello, dal contesto e dagli
strumenti, e da ciò che fai con lo stesso account fuori da Jarvis. Prima di ogni versione la scelta di AUTO è provata su
una giornata di lavoro di riferimento simulata; il consumo reale dipende dal tuo uso e si verifica sugli abbonamenti veri.

## Si adatta a ogni lavoro, anche al tuo

Jarvis capisce cosa fai, studia il tuo mestiere sulle fonti autorevoli, si dà procedure e controlli e migliora con i
risultati, aggiornando da solo il suo fascicolo del mestiere. 57 mestieri sono già pronti come esempi
(professionisti, imprese e negozi, sviluppo software e IT, design, contenuti e prodotto, creator e vendita online,
freelance, aziende e associazioni, ruoli in azienda: una pagina ciascuno sul [sito](https://redguitars97.github.io/jarvis-releases/per/)); per un lavoro che
non è in elenco studia il mestiere e lo diventa. Unisce il mestiere con 6 funzioni (marketing, legale, amministrazione,
IT, vendite e siti e app) e studia i tuoi concorrenti. Gli atti riservati
restano tuoi: non firma, non deposita, non trasmette, non rappresenta e non fa diagnosi.

- **Risponde ai tuoi clienti su Telegram**, con il computer acceso e Jarvis aperto: un bot separato dal tuo, che sa
  solo ciò che gli dai tu (le informazioni dell'attività, le risposte che approvi, il sito); ciò che non sa lo chiede a
  te e impara la risposta approvata, propone gli orari e prende gli appuntamenti (da solo con un calendario CalDAV,
  altrimenti li confermi tu), ti passa la conversazione e ti manda i riepiloghi.
- **Si collega ai tuoi strumenti:** HubSpot, Pipedrive e Odoo (letture libere, scritture con il tuo ok), e Make, n8n e
  Zapier con un webhook in uscita, firmato. Da internet verso Jarvis non arriva nulla.

Le novità di ogni versione sono sul sito, in [Novità](https://redguitars97.github.io/jarvis-releases/novita.html).

## Cosa sa fare

| | |
| --- | --- |
| **Si parla come a una persona** | «Ciao Jarvis», e chiedi. Risponde con Giovanni, una voce italiana naturale generata sul tuo computer, senza limiti d'uso: numeri, orari, date, sigle e parole inglesi detti come li direbbe una segretaria, accenti giusti, domande con l'intonazione giusta e pause naturali. I nomi dei tuoi clienti li dice come gli insegni tu. Capisce sul computer in circa un secondo, riconosce il suo nome anche quando il riconoscimento lo storpia, alle domande semplici risponde subito e se gli serve tempo te lo dice («Ho capito, controllo»). Se dici qualcosa senza chiamarlo, te lo mostra invece di ignorarti. Capisce quando stai parlando anche a voce bassa o con il rumore della stanza (un ventilatore, la strada), e ogni frase arriva da sola. L'ascolto è già incluso nell'installer: niente da scegliere né da scaricare. |
| **Conosce il tuo lavoro** | Legge i tuoi progetti e documenti, che restano sul tuo computer, e risponde senza che tu dica dove guardare. |
| **Ha una squadra** | Lo Studio di Jarvis: otto persone con un nome, un ruolo e più competenze (prodotto, sviluppo, UX, grafica, marketing e SEO, commerciale, segreteria, revisione), sempre le stesse. Ogni progetto ne usa una parte, con obiettivi e orari propri; se serve, Jarvis chiama al volo chi ha la competenza giusta. «Presentami la squadra» te la mostra collegata a Jarvis, intera o progetto per progetto. |
| **Fa le cose, non le spiega** | Siti pubblicati con il link, preventivi in PDF e Word, Excel, presentazioni, grafiche, email, pull request su GitHub. Email e post pubblici aspettano sempre il tuo ok; per il resto decidi tu quanta autonomia dargli (di base chiede per tutto ciò che va ad altre persone o non si può annullare). |
| **Riunioni con il verbale** | «Registra la riunione»: trascrive sul computer anche l'audio della call (Zoom, Meet, Teams), poi riassunto, decisioni, cose da fare e bozza dell'email di follow-up, anche in Word. |
| **Appuntamenti e inviti** | Fissa, sposta e annulla gli appuntamenti nel calendario e avvisa gli invitati, sempre con il tuo ok. Con iCloud e gli altri calendari CalDAV cambia l'appuntamento direttamente; con Google (collegato con il link, in sola lettura) per quelli fissati da te manda l'aggiornamento agli invitati, che entra nei calendari quando lo accettano. Google Calendar resta in sola lettura: per scrivere direttamente serve un calendario CalDAV. Crea anche appuntamenti che si ripetono (ogni settimana nei giorni scelti, ogni mese…, per un certo numero di volte o fino a una data) e ne sposta o annulla una sola volta o tutta la serie; «da questa in poi» si fa dall'app del calendario. |
| **Lavoro da professionista, non «da AI»** | Siti, grafiche, testi, post e documenti devono sembrare firmati da un professionista senior che conosce il cliente: i fatti veri del cliente al posto delle frasi da brochure, scelte di design difendibili al posto dei gradienti viola e delle card tutte uguali, immagini senza l'aria finta da AI. Un controllo trova i segni del lavoro generato e lo rimanda indietro prima che tu lo veda; un post pieno di frasi fatte viene riscritto prima di chiederti l'ok. |
| **Il brand di ogni cliente** | Colori misurati dal suo sito, tono di voce, listino e logo: grafiche, siti, testi e campagne nascono coerenti. |
| **Foto e illustrazioni** | Con il tuo abbonamento ChatGPT, nei limiti del tuo piano; gratis quando un modello gratuito basta, dopo un controllo di qualità; loghi e grafiche vettoriali sempre gratis. Una chiave API (Gemini o OpenAI) entra solo se nessun abbonamento può farle. |
| **Clienti nuovi, dal nome** | «Rifacciamo il sito di …, a …»: legge da solo scheda Google, sito attuale, social e concorrenti, ricava brand e logo, propone la strategia (anche per i settori con pubblicità limitata) e consegna il sito con l'anteprima. Se l'attività non ha la scheda Google, la prepara pronta da attivare. |
| **Social pubblicati all'ora giusta** | Piano editoriale, caroselli per Instagram e TikTok, testi e hashtag per piattaforma; pubblica su Instagram e Facebook a un'ora fissata, con il computer acceso e il tuo ok in quel momento (anche dal telefono), sul profilo giusto anche con più punti vendita; per TikTok usa il browser dove consentito, oppure consegna il pacchetto; musica solo se disponibile e autorizzata. Se lo chiedi, ogni settimana i risultati di Instagram e Facebook profilo per profilo; per TikTok usa i dati accessibili dal browser/MCP o forniti da te, dichiarando quelli mancanti. |
| **Anteprime con link e QR** | Un sito appena fatto si vede subito dal telefono, con link e QR temporanei, senza account; poi lo pubblichi dove vuoi. |
| **Detta in qualsiasi app** | Una scorciatoia (⌘⇧Spazio), parli, e il testo compare dove stai scrivendo. Tutto sul computer. |
| **Non si ferma ai limiti** | Divide il lavoro quando un modello accetta poche immagini alla volta; se tutti gli abbonamenti hanno finito i limiti, ti dice quando tornano e riprende da solo, se vuoi, avvisandoti anche su Telegram. |
| **Sempre aggiornato** | Regole delle piattaforme, hashtag, prezzi e norme verificati da fonti ufficiali, salvati con la data e, se scaduti, ricontrollati prima di riusarli. |
| **Procedure di lavoro incluse** | Jarvis include 55 procedure di lavoro per sviluppo, ricerca, design, marketing e revisione, e per mestieri e piccole attività (commercialisti, avvocati, artigiani ed edilizia, ristorazione, B&B). Affiancano la squadra con metodi e criteri di consegna: versioni da verificare, fonti da citare e risultati da controllare prima di presentarli. Claude Code e Codex le ricevono come skill native; con le altre connessioni Jarvis le carica con un suo strumento. Sono una guida per il modello, non la garanzia che le segua sempre. |
| **Pronto per il tuo mestiere** | Procedure pronte per commercialisti (busta paga, F24, scadenze, fatture elettroniche), avvocati (diffide, termini), artigiani ed edilizia (computo metrico, sicurezza), ristorazione (allergeni, HACCP) e B&B (Alloggiati Web, imposta di soggiorno). Sempre bozze, controllate su fonti ufficiali. |
| **Skill di terzi, controllate** | Aggiungi competenze da un link: Jarvis lascia fuori script ed eseguibili, segnala le istruzioni sospette e installa solo dopo il tuo ok. |
| **Usa il browser per te** | Apre i siti, compila i moduli e prenota in una finestra di Chrome che vedi. Prima di inviare o pagare ti chiede l'ok; password e carte le scrivi sempre tu. |
| **Viaggi e trasferte** | Percorsi tappa per tappa con il link della mappa, alloggi con le ricerche già filtrate per le tue date, la prenotazione nel browser solo con il tuo ok e poi l'appuntamento in calendario. Carta, CVV e codici li inserisci tu: Jarvis non li legge e non li salva. |
| **Piani in più passi** | Un lavoro lungo diventa un piano: lo approvi una volta e i passi vanno avanti da soli, con i controlli. Ogni passo ti mostra il suo risultato, e puoi giudicarlo con un pollice. |
| **Un revisore sulle consegne** | Un secondo modello ricontrolla siti, documenti, testi e codice contro la tua richiesta: corregge ciò che è sbagliato o rischioso (al massimo due giri) e annota le rifiniture; se resta qualcosa di aperto arriva come bozza e decidi tu. Se il controllo non si può fare, te lo dice invece di darlo per buono. |
| **Prodotti software completi** | Dall'idea al prodotto: requisiti, concorrenti, architettura, design system, logo e splash screen, sviluppo su un branch dedicato, test, revisione e pull request verso il branch di sviluppo. Vede le pipeline di GitHub Actions: se una è rossa legge il passo e l'errore e propone la correzione con una nuova pull request. Squadre pronte: prodotto completo, app mobile, brand e grafica, sito e SEO. |
| **Anche dal telefono** | Su Telegram: messaggi, vocali, foto, posizione, approvazioni con un tocco. Quello che chiedi dal telefono ha la risposta sul telefono; le approvazioni chieste dal computer arrivano anche lì; `/squadra` mostra chi c'è nel progetto e ogni persona si chiama con un comando. Con il computer bloccato la squadra continua a lavorare e i messaggi arrivano lì. |
| **Risposte senza AI, quando basta il computer** | Ora, data, conti detti come vengono, meteo, una ricetta dal sito che la pubblica, un fatto dell'enciclopedia confermato da una seconda fonte, il testo di una foto: Jarvis li riconosce per significato e risponde subito con la fonte, senza consumare un modello. Nel dubbio decide un modello; dai tuoi 👍 e 👎 impara. |
| **Prima i modelli gratuiti** | Ollama sul tuo computer e OmniRoute, che unisce i livelli gratuiti di decine di fornitori: Jarvis li installa e li configura da solo. Poi i tuoi abbonamenti Claude o ChatGPT (o la licenza aziendale Gemini Code Assist), usati fino in fondo e, dentro ciascuno, con il modello adatto a ogni fase (AUTO); le chiavi API solo quando gli abbonamenti sono al limite o mancano. Sotto ogni risposta ti dice quale motore ha risposto e perché. |
| **Scegli quanto ragiona, o lascia fare ad AUTO** | AUTO sceglie per ogni fase il modello e quanto deve ragionare; se preferisci, scegli tu per ogni ruolo il modello e il livello (rapido, medio, alto…), e la tua scelta vale per il lavoro di quel ruolo. Jarvis mostra solo i livelli che quel modello offre davvero. |
| **Spese sotto controllo** | Tetto di spesa API al giorno e al mese: prima di ogni chiamata una stima prudente del costo (prezzi ufficiali, o una quota fissa per i modelli senza prezzo), poi il costo comunicato dal fornitore; ogni operazione registrata con modello, tempo e costo. |
| **I tuoi dati sono tuoi** | Progetti, memorie e file stanno sul tuo computer; online va solo ciò che serve al modello o al servizio che usi (vedi le domande in fondo). Backup cifrati con la password che scegli, aggiornamenti che non toccano i dati. |
| **Nasconde i dati sensibili** | Prima di inviare qualcosa a un cervello online (Claude, ChatGPT…), codice fiscale, IBAN, partita IVA, carte, email, telefoni, nomi e indirizzi, anche dei campi di buste paga e certificati, diventano segnaposto ([CF_1], [NOME_1]…); il rilevamento è sul computer e gli importi restano in chiaro. I dati veri restano qui e tornano al loro posto nella risposta; su Telegram e sugli altri dispositivi arrivano solo i segnaposto. Si attiva da sola con un dato o un documento sensibile e si regola per chat o progetto. È una pseudonimizzazione, non un'anonimizzazione: il progetto «riservato» resta la protezione massima. |

## Perché Jarvis, se hai già Claude o ChatGPT

Claude Cowork, Claude Code e Codex sono ottimi assistenti di un solo fornitore. Jarvis non li sostituisce: **li usa,
insieme**, e ci mette sopra ciò che serve a chi lavora con i clienti.

| Leva | Cosa significa per te |
| --- | --- |
| **Tutti i tuoi cervelli, uno sopra l'altro** | Gli abbonamenti Claude e ChatGPT diventano motori di Jarvis, insieme ai modelli gratuiti sul computer e online. In automatico, quando uno finisce i limiti il lavoro passa al successivo; se hai scelto tu un modello, Jarvis aspetta quello. Se li finiscono tutti, riprende da solo quando tornano. |
| **Un controllore diverso dall'autore** | Il lavoro di un modello lo rivede un altro modello, contro la tua richiesta, al massimo due giri; se hai collegato fornitori diversi (per esempio Claude e ChatGPT), di un'altra azienda. Dentro uno strumento di un solo fornitore non si può. |
| **Lavoro consegnato, non spiegato** | Sito con anteprima, link e QR; preventivo in PDF; appuntamento come invito; riunione come verbale con la bozza di follow-up; campagna pronta e in pausa. Sempre con il tuo ok su ciò che esce. |
| **Una squadra che conosce i tuoi clienti** | Otto persone con nome, ruolo e competenze, sempre le stesse, assegnate ai progetti. Ogni cliente ha il suo brand, le sue chat e le sue memorie. |
| **Spesa chiara, strumenti liberi** | Jarvis si paga una volta. Prima strumenti gratuiti e open source, poi gli abbonamenti che hai già, le API solo con un tetto; motore e costo stimato sotto ogni risposta, il consumo di ogni lavoro fase per fase in Attività. |
| **I dati restano tuoi, in italiano** | Progetti, memorie e voce sul computer. Un progetto riservato va solo ai modelli sul tuo computer. Voce e ascolto in italiano, sul computer, senza limiti d'uso. |

Dove loro sono più forti, onestamente: se scrivi codice tutto il giorno, Claude Code e Codex restano eccellenti, e
Jarvis li usa come motori. Per il lavoro che continua a computer spento ci sono le attività in cloud di Claude; Jarvis
lavora sul tuo computer: continua anche a schermo bloccato, lo tiene sveglio finché c'è lavoro in corso e, se lo
metti in standby, ti avvisa su Telegram e riprende al risveglio.

## Chi c'è dietro Jarvis

Jarvis è progettato e sviluppato da **Mattia, Senior Software Engineer e Technical Leader con più di 10 anni di
esperienza in aziende enterprise**. Non è un esperimento messo insieme con qualche strumento AI: è costruito con le regole del software che
le aziende usano ogni giorno.

- **Collaudato prima di ogni versione:** oltre cinquecento controlli automatici a ogni modifica, i percorsi completi
  dell'app su Windows e macOS provati come li userebbe un cliente, e ogni promessa del sito legata alle sue prove:
  senza, la versione non esce.
- **Sicuro per costruzione:** email e post a tuo nome solo con il tuo ok, chiavi nel portachiavi del sistema, backup
  cifrati con la tua password, modelli e motori gratuiti installati solo se corrispondono all'impronta pubblicata da
  chi li produce, aggiornamenti che non toccano i dati.
- **Licenze rispettate:** componenti e servizi scelti verificando licenze e condizioni d'uso, con le attribuzioni dovute;
  l'elenco completo dei componenti, con le loro licenze, è dentro l'app (Impostazioni → Componenti di terze parti).

## Pro e Max

| Cosa include | Pro | Max |
| --- | --- | --- |
| **Prezzo (una tantum)** | **149 €** | **349 €** |
| Aggiornamenti inclusi | 12 mesi | 12 mesi |
| Rinnovo degli aggiornamenti (altri 12 mesi, facoltativo) | 59 € | 139 € |
| Computer per licenza | 2 | 2 |
| Progetti | 1 | Senza limite |
| Persone nella squadra di Jarvis | 9 (Studio di 8 + 1 specialista) | Senza limite |
| Caselle email, ognuna con il suo calendario | 3 | Senza limite |
| Riunioni tra agenti | — | ✓ |
| Campagne Meta Ads preparate per intero (partono solo con il tuo ok sul budget) | — | ✓ |
| Sviluppo software su GitHub (pull request) | — | ✓ |
| Gruppo di dispositivi (stessi progetti su più computer) | — | ✓ |
| Strumenti MCP personalizzati | — | ✓ |
| Apprendimento che applica da solo i consigli | — | ✓ |
| Voce, chat, Telegram, email, documenti, grafiche, siti, piani, modelli gratuiti, backup cifrato | ✓ | ✓ |

Nell'app le funzioni Max restano visibili, segnate con «Max». Nella **demo** è tutto sbloccato, con risposte simulate: per collegare i tuoi abbonamenti serve la versione completa.

**Vuoi provarlo sul serio?** Chiedi la **prova gratuita di 14 giorni del piano Max**, con i tuoi abbonamenti e i tuoi progetti: ci mandi il codice del computer e ricevi una licenza di prova. Alla fine scegli Pro o Max, incolli la licenza e ritrovi tutto com'era.

## Licenza e aggiornamenti

- **Paghi una volta.** Nessun abbonamento a Jarvis: l'intelligenza artificiale la scegli tu, anche gratis.
- **La licenza non scade.** Jarvis continua a funzionare per sempre sui computer indicati nella licenza.
- **Aggiornamenti inclusi per 12 mesi.** Dopo, resti sull'ultima versione ricevuta.
- **Correzioni di sicurezza sempre gratuite** per ogni licenza valida, anche dopo i 12 mesi.
- **Rinnovo facoltativo** (Pro 59 €, Max 139 € per altri 12 mesi): incolli la nuova licenza in Impostazioni → Licenza.
- **Due computer per licenza**, per esempio il Mac di casa e il PC dell'ufficio: una sola licenza, valida su tutti e due. Cambi computer? Ti mandiamo la licenza per quello nuovo.
- **Da Pro a Max quando vuoi:** paghi solo la differenza (oggi 200 €), ricevi la nuova licenza e la incolli in Impostazioni → Licenza. Progetti, squadra e dati restano dove sono; la scadenza degli aggiornamenti non cambia.
- **Soddisfatto o rimborsato entro 14 giorni.**
- Le condizioni complete sono in [CONDIZIONI.md](CONDIZIONI.md).
- Come Jarvis tratta i dati: [PRIVACY.md](PRIVACY.md).
- **Come si acquista:** scrivici (contatti qui sotto); paghi con bonifico o con un link di pagamento e ricevi la licenza via email.

## Contatti

- Email: **jarvis@macomediaagency.com**
- Telegram: **[@ilverojarvis](https://t.me/ilverojarvis)**
- Instagram: **[@ilverojarvis](https://www.instagram.com/ilverojarvis/)**
- TikTok: **[@ilverojarvis](https://www.tiktok.com/@ilverojarvis)**

## Se qualcosa non va

Dillo a Jarvis: **«Jarvis, segnala un problema»**, oppure premi il pulsante con l'insetto (nella barra laterale e nella Home) o «Segnala» accanto a un errore in Attività. Prepara lui la segnalazione con
versione, sistema e ultimi errori, togliendo chiavi, indirizzi e numeri che riconosce, e la apre tra le [issue di questo repository](https://github.com/redguitars97/jarvis-releases/issues),
dove ne segui la risoluzione. Le issue sono pubbliche: rileggila prima di inviarla, e per dati riservati scrivi all'email qui sopra.

## Funzioni facoltative e per sviluppatori

- **Lettura accurata dei documenti:** LightOnOCR-3 nel tuo Ollama (747 MB), per tabelle, colonne e scansioni rovinate; tutto sul computer, con il lettore standard come riserva.
- **Trascrizione accurata:** riunioni e file audio con Whisper large-v3-turbo (1,1 GB), scaricato solo con un clic.
- **Chi parla nelle riunioni:** riconosce le voci sul computer (28 MB); nel verbale Persona 1, Persona 2… e poi «Persona 1 è Marco». L'audio non viene salvato e le impronte delle voci si cancellano appena il verbale è scritto.
- **Comandi lunghi in background** per lo sviluppo (server, build, test), controllati e fermati da Jarvis.
- **Git LFS:** i file grandi gestiti con Git LFS entrano nelle pull request.
- **Mappe:** con la chiave gratuita di Geoapify; senza, i servizi pubblici di OpenStreetMap, più lenti.
- **Comandi isolati anche su Windows** (AppContainer), come su macOS.
- **Skill di terzi controllate** prima dell'installazione: quelle con problemi gravi sono bloccate.
- **Più letture in un passo** con i cervelli a consumo (API): più ricerche e pagine in un solo passaggio, meno testo inviato.

## Installazione

**macOS 13 o successivo (Apple Silicon e Intel).** Scarica il file `.dmg` per il tuo Mac (`arm64` per Apple Silicon), aprilo e trascina Jarvis in Applicazioni.

**Windows 10 e 11.** Scarica il file `.exe` e aprilo. Se Windows mostra «PC protetto», scegli *Ulteriori informazioni →
Esegui comunque*. Lo chiede una sola volta.

Al primo avvio Jarvis trova da solo quello che c'è già: i tuoi abbonamenti, i modelli locali, il tuo nome, le cartelle
dei progetti. Poi ti saluta. Se serve, ti chiede di attivarlo con la licenza: copi il codice del computer e incolli la
licenza che ricevi.

### Requisiti

| | Minimo | Consigliato |
| --- | --- | --- |
| Sistema | macOS 13 / Windows 10 (64 bit) | macOS 14+ / Windows 11 |
| Memoria | 8 GB | 16 GB (per i modelli gratuiti sul computer) |
| Spazio | 2 GB | 10 GB con un modello locale |

### Cosa serve, funzione per funzione

Per le funzioni comuni non serve il terminale; Gemini CLI richiede l’installazione indicata sotto. Alcune funzioni usano programmi di altri, che Jarvis installa o ti guida a
installare con il tuo ok:

| Funzione | Cosa serve | Chi lo installa |
| --- | --- | --- |
| Voce, ascolto, chat, documenti, grafiche vettoriali | Niente: voce e ascolto sono già nell'installer | Jarvis, da solo |
| Modelli gratuiti sul computer / online | Ollama / OmniRoute, internet per scaricarli, 3–8 GB di spazio per un modello | Jarvis, con un clic |
| Abbonamento Claude | Claude Code (programma ufficiale di Anthropic) e il tuo accesso | Jarvis, con il programma ufficiale |
| Abbonamento ChatGPT | Codex (programma ufficiale di OpenAI) e il tuo accesso | Jarvis, con un clic, dal pacchetto ufficiale di OpenAI (circa 170 MB, controllato byte per byte; niente Homebrew né Node.js) |
| Gemini CLI (licenza aziendale Gemini Code Assist) | Gemini CLI ufficiale, login con l'account di lavoro e il progetto Google Cloud della licenza; quote della licenza | Jarvis, con un clic, dal pacchetto ufficiale di Google (circa 21 MB, controllato byte per byte; niente Node.js da installare), poi Accedi da Jarvis |
| Siti su GitHub, pull request | Git e un account GitHub | Jarvis avvia l'installazione ufficiale da Collegamenti → Programmi (Mac: strumenti di Apple; Windows: winget); l'account è tuo |
| Browser che compila e prenota | Google Chrome o Microsoft Edge (non Safari) | Tu (Collegamenti → Programmi apre la pagina di Chrome) |
| Anteprime con link pubblico | cloudflared di Cloudflare | Jarvis, la prima volta |
| Foto e illustrazioni | Abbonamento ChatGPT, un modello gratuito o una chiave API con tetto di spesa | Tu scegli quale |

Abbonamenti e chiavi API sono contratti tuoi con quei fornitori: limiti e costi li decidono loro. Jarvis ti mostra cosa
usa e quanto stima di spendere, ma non può garantire le condizioni di un altro fornitore.

**Comandi nei progetti, Mac e Windows.** Quando un cervello lavora su un progetto (test, build, script), su macOS i
comandi girano in un recinto del sistema: scrivono solo nella cartella del progetto, non leggono chiavi e password, e
usano la rete solo per scaricare le dipendenze o con il tuo ok; il codice e gli script che il modello fa girare non
hanno rete, e se gliene serve te lo chiede. Su Windows i comandi girano in un recinto del sistema analogo
(AppContainer): scrivono solo nel progetto e in una cartella temporanea privata, non vedono chiavi e segreti, e usano la
rete solo per i comandi approvati come tali; dove il recinto non è disponibile, uno script o del codice scritto al
momento chiede sempre il tuo ok. Su ogni sistema Jarvis controlla cosa fa il comando, lo tiene nella
cartella del progetto senza le chiavi dell'app e chiede le approvazioni che hai scelto; su Windows i processi lasciati
in background da un comando vengono fermati quando il comando finisce. Codex lavora con un profilo di permessi di
Jarvis: legge e scrive solo nel progetto (più strumenti e sistema in lettura), non vede chiavi né il proprio login e
non ha rete; su macOS sempre, su Windows 11 24H2 o successivo con il sandbox MXC di Windows, altrimenti su Windows
limita solo le scritture. Su progetti di
terzi di cui non ti fidi, la modalità «Chiedimi tutto» ti fa decidere ogni passo.

## Aggiornamenti

Jarvis ti avvisa quando esce una versione nuova. La installi sopra la vecchia e i tuoi dati restano dove sono; prima di
ogni aggiornamento dei dati ne fa una copia di sicurezza. La licenza indica fino a quando gli aggiornamenti sono inclusi: le versioni uscite fino a quella data si
attivano, quelle successive chiedono il rinnovo (la versione che hai continua a funzionare per sempre).

## Domande frequenti

<details>
<summary>Serve un abbonamento a un'intelligenza artificiale?</summary>

No. Puoi usare il tuo abbonamento Claude o ChatGPT, una chiave API (anche quella gratuita di Gemini), oppure i modelli gratuiti: Jarvis li installa e li
prepara da solo. Molte risposte (ora, calcoli, promemoria, stato della squadra, spese) non usano proprio l'AI.
</details>

<details>
<summary>I miei documenti finiscono online?</summary>

Restano sul tuo computer. Esce solo: il pezzo che serve a rispondere, se usi un modello online; ciò che scrivi o ricevi
su Telegram; con Max e due computer in gruppo, una copia dei progetti nella tua cartella cloud; le segnalazioni che
decidi di inviare. Un progetto «riservato» usa solo i modelli sul tuo computer.
</details>

<details>
<summary>La licenza scade?</summary>

No. Vale per sempre sui computer indicati. Ha una data solo il periodo di aggiornamenti inclusi: dopo, Jarvis continua
a funzionare con l'ultima versione ricevuta, e puoi rinnovare quando vuoi.
</details>

<details>
<summary>Posso usarlo su più computer?</summary>

Sì, su due computer con la stessa licenza: quando la chiedi ci mandi i codici di tutti e due (li trovi nella schermata
«Attiva Jarvis»), oppure aggiungi il secondo più avanti. Ogni computer ha i suoi dati. Con **Max** i due computer
formano un gruppo e lavorano sugli stessi progetti, sincronizzati attraverso una cartella cloud che hai già (iCloud
Drive, OneDrive, Dropbox).
</details>

<details>
<summary>Posso provarlo prima di comprarlo?</summary>

Sì, in due modi. La **demo** (in arrivo) mostra tutto con risposte simulate. La **prova di 14 giorni del piano
Max** è Jarvis completo, con i tuoi abbonamenti: chiedila con il codice del computer. Una prova per persona e per
computer. Alla fine incolli la licenza che scegli e continui da dove eri.
</details>

<details>
<summary>Posso passare da Pro a Max?</summary>

Sì, quando vuoi: paghi la differenza tra i due prezzi e ricevi una licenza Max che sostituisce quella Pro, con gli stessi
computer e la stessa scadenza degli aggiornamenti. Da lì in poi il rinnovo facoltativo è quello del piano Max.
</details>

<details>
<summary>Cosa succede se cambio computer?</summary>

Fai un backup da Impostazioni, installi Jarvis sul computer nuovo e chiedi una licenza con il nuovo codice. Poi
ripristini il backup.
</details>

---

<div align="center"><sub>© 2026 Il vero Jarvis · Tutti i diritti riservati</sub></div>

## Telegram: progetti, squadra e messaggi in attesa

Nel gruppo con Argomenti e il bot amministratore, un nuovo argomento creato dal titolare diventa un progetto
nell'app; rinominarlo aggiorna quel progetto. `/squadra` elenca partecipanti e persone chiamabili, `/nome` o `@Nome`
affida un compito nella chat del progetto. Una richiesta scritta riceve testo; un vocale riceve anche la voce,
quando la sintesi è disponibile. Modello, ragionamento comunicato, strumenti e fonti sono nel messaggio scritto.

Computer spento o app chiusa: il bot elabora all'avvio solo gli aggiornamenti ancora disponibili su Telegram,
conservati dal servizio **al massimo per 24 ore**. Ricevuti sul computer, sono salvati nella coda locale prima della
conferma al servizio. Gli ok arrivano anche mentre un lavoro è in attesa; `/coda` mostra le richieste aperte.
Un lavoro interrotto senza esito finale richiede verifica prima di ripeterlo. Non è un servizio cloud attivo a
computer spento e non può recuperare l'intera cronologia passata del gruppo.

Le email e i calendari si associano ai progetti da Collegamenti → Utilizzato in. Con più mittenti o calendari
compatibili Jarvis chiede quale usare, salvo un'unica associazione specifica. CalDAV consente scrittura e rilettura;
un link ICS resta di sola lettura. Le API si scelgono dal catalogo per nome, separatamente dai login degli
abbonamenti; il formato della chiave non viene indovinato o spedito ad altri provider per provarlo.


Le notifiche in attesa di rete hanno anche una coda locale durevole in uscita. «In attesa» non significa «consegnato»:
un invio confermato non si ripete, un invio con risposta persa resta incerto e va verificato sul telefono prima di
ritentare. Il comando del bot `coda` mostra richieste e consegne aperte. Nessuna promessa di trascrizione perfetta:
le pronunce si possono insegnare e i contenuti degli invii vanno controllati nell'approvazione.

Svuotare una chat richiede conferma: archivia lo scambio e azzera riassunti e sessioni usati come contesto, mantenendo
progetto, squadra, file, ricordi e attività programmate. Lo storico locale, i backup e i messaggi già su Telegram
restano: non è una cancellazione definitiva. Dallo stesso pannello, con un secondo passaggio, puoi eliminare per sempre
l'archivio di quella chat, anche sugli altri tuoi dispositivi. Il topic usa poi il nuovo contesto. Con più dispositivi aggiornare entrambi
e terminare i lavori su tutti prima dello svuotamento. Eliminare il progetto ferma invece anche il lavoro futuro collegato.
