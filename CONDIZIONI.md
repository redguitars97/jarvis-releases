# Il vero Jarvis — condizioni di licenza per l'utente

Il vero Jarvis («Jarvis») è un'applicazione per macOS e Windows. Queste condizioni dicono cosa acquisti, cosa include la
licenza e gli obblighi delle licenze dei componenti inclusi.

## 1. Cosa acquisti

Jarvis funziona su **macOS 13 o successivo** (Apple Silicon e Intel) e su **Windows 10 e 11 a 64 bit**. Alcune
funzioni usano programmi e account di altri fornitori (vedi «Cosa serve, funzione per funzione» nel README).


- Una **licenza d'uso perpetua** di Jarvis (piano Pro o Max) per **2 computer**, indicati nella licenza.
- **Aggiornamenti inclusi per 12 mesi** dall'acquisto. Dopo, Jarvis continua a funzionare per sempre con l'ultima
  versione ricevuta in quel periodo. Le versioni pubblicate più tardi si attivano solo con il rinnovo degli
  aggiornamenti per altri 12 mesi, che è facoltativo. I tuoi dati restano sempre tuoi ed esportabili con un backup.
- **Correzioni di sicurezza gratuite** per ogni licenza valida, anche dopo i 12 mesi.
- **Licenze sostituite.** Quando una licenza viene riemessa (nuovo computer, rinnovo, passaggio a Max), quella
  precedente non può essere disattivata a distanza sui computer non collegati a internet: va usata solo la nuova.
- **Soddisfatto o rimborsato entro 14 giorni** dall'acquisto.
- **Passaggio da Pro a Max** in qualsiasi momento, pagando la differenza tra i due prezzi in vigore: la licenza Max
  sostituisce quella Pro, con gli stessi computer e la stessa scadenza degli aggiornamenti.
- **Licenza di prova**, su richiesta: piano Max per 14 giorni su un computer, una per persona e per computer. Alla
  scadenza Jarvis chiede la licenza completa; i dati restano sul computer.

Il software resta di proprietà dell'autore. Non è permesso rivenderlo, distribuirlo, decompilarlo o aggirare il
controllo della licenza, salvo quanto consentito dalla legge.

## 2. I tuoi dati e i servizi che colleghi

- Jarvis lavora sul tuo computer: progetti, conversazioni, memorie e file restano lì. I backup sono cifrati quando
  scegli una password; senza password il file di backup è leggibile da chi lo apre. Come e quando i dati escono dal
  computer lo spiega l'[informativa sulla privacy](PRIVACY.md).
- Quando colleghi un servizio di intelligenza artificiale (abbonamenti Claude o ChatGPT, chiavi API, OmniRoute) o altri
  servizi (email, calendario, GitHub, Meta, Telegram), i contenuti necessari alla richiesta vengono inviati a quel
  servizio secondo le **sue** condizioni. I costi di quei servizi sono a tuo carico. I progetti segnati come
  «riservati» usano solo modelli sul tuo computer.
- Le azioni verso l'esterno (invio di email, pubblicazioni, spese, cancellazioni) richiedono il tuo ok secondo il
  livello di autonomia che scegli. Resti responsabile di ciò che approvi.
- Le segnalazioni di problemi che decidi di inviare finiscono nelle issue pubbliche di questo repository. Jarvis toglie
  chiavi, indirizzi e numeri che riconosce, ma la rileggi tu prima di inviarla; per dati riservati usa l'email.

## 3. La voce di Jarvis

La voce di Jarvis è generata sul tuo computer dal modello **Pocket TTS** di Kyutai, distribuito con licenza
**CC BY 4.0**: il modello italiano e la voce «Giovanni» sono stati convertiti in ONNX e quantizzati int8 per Jarvis;
la struttura ONNX viene da KevinAHM/pocket-tts-onnx (CC BY 4.0). Usa la voce in modo lecito: non per ingannare
qualcuno facendola passare per la voce di una persona reale.

Se in una versione futura la voce cambia modello, questa sezione riporterà la sua attribuzione.

## 4. Componenti di terze parti

| Componente | Licenza |
| --- | --- |
| Pocket TTS, modello vocale (Kyutai), convertito in ONNX e quantizzato int8 | CC BY 4.0 |
| Struttura ONNX di Pocket TTS (KevinAHM/pocket-tts-onnx) | CC BY 4.0 |
| Accenti delle parole italiane (Wiktionary, tramite kaikki.org) | CC BY-SA 4.0 |
| CMU Pronouncing Dictionary (Carnegie Mellon University) | BSD |
| ONNX Runtime (Microsoft) | MIT |
| Whisper, riconoscimento vocale (OpenAI, versione ONNX) | MIT |
| Tesseract, lettura del testo nelle immagini | Apache-2.0 |
| Electron, React e le altre librerie dell'interfaccia | MIT e licenze simili |
| cloudflared (Cloudflare), per le anteprime temporanee dei siti, scaricato dalle release ufficiali e verificato con la loro impronta | Apache-2.0 |
| Elenco delle località (GeoNames) | CC BY 4.0 |

Servizi online gratuiti che Jarvis usa nel rispetto delle loro condizioni, con l'attribuzione mostrata accanto ai dati:
- **Meteo:** MET Norway (Istituto meteorologico norvegese), dati CC BY 4.0.
- **Ricerca:** Wikipedia (contenuti CC BY-SA), oppure Brave Search con la tua chiave.
- **Luoghi e indirizzi:** Geoapify con la tua chiave gratuita, dati © OpenStreetMap contributors (ODbL).
- **Cambi valuta:** Frankfurter (tassi della BCE).
- **Anteprime dei siti:** Cloudflare Quick Tunnels, solo per anteprime temporanee.

## 5. Garanzie e responsabilità

Jarvis è fornito «così com'è», salvo le garanzie che la legge non permette di escludere. L'autore non risponde dei
danni indiretti derivanti dall'uso del software o dei servizi di terzi collegati, nei limiti consentiti dalla legge.

## 6. Contatti

- Email: jarvis@macomediaagency.com
- Telegram: [@ilverojarvis](https://t.me/ilverojarvis)
