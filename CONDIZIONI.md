# Jarvis — condizioni di licenza per l'utente

> **Bozza del 24/10/2026, da far verificare a un avvocato prima della vendita.** Riporta le decisioni commerciali già
> prese e gli obblighi delle licenze dei componenti inclusi.

## 1. Cosa acquisti

- Una **licenza d'uso perpetua** di Jarvis (piano Pro o Max) per **2 computer**, indicati nella licenza.
- **Aggiornamenti inclusi per 12 mesi** dall'acquisto. Dopo, Jarvis continua a funzionare con l'ultima versione
  ricevuta. Il rinnovo degli aggiornamenti per altri 12 mesi è facoltativo.
- **Correzioni di sicurezza gratuite** per ogni licenza valida, anche dopo i 12 mesi.
- **Soddisfatto o rimborsato entro 14 giorni** dall'acquisto.

Il software resta di proprietà dell'autore. Non è permesso rivenderlo, distribuirlo, decompilarlo o aggirare il
controllo della licenza, salvo quanto consentito dalla legge.

## 2. I tuoi dati e i servizi che colleghi

- Jarvis lavora sul tuo computer: progetti, conversazioni, memorie e file restano lì, con backup cifrati.
- Quando colleghi un servizio di intelligenza artificiale (abbonamenti Claude o ChatGPT, chiavi API, OmniRoute) o altri
  servizi (email, calendario, GitHub, Meta, Telegram), i contenuti necessari alla richiesta vengono inviati a quel
  servizio secondo le **sue** condizioni. I costi di quei servizi sono a tuo carico. I progetti segnati come
  «riservati» usano solo modelli sul tuo computer.
- Le azioni verso l'esterno (invio di email, pubblicazioni, spese, cancellazioni) richiedono il tuo ok secondo il
  livello di autonomia che scegli. Resti responsabile di ciò che approvi.
- Le segnalazioni di problemi che decidi di inviare finiscono nelle issue pubbliche di questo repository, senza dati
  personali.

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
| cloudflared (Cloudflare), per le anteprime temporanee dei siti, scaricato dalle release ufficiali | Apache-2.0 |
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
- Telegram: [@iltuojarvis](https://t.me/iltuojarvis)
