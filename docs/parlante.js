// Short spoken explanations of Jarvis, offered after the home's welcome («Vuoi sapere altro?», benvenuto.js) and played
// by docs/voce.js with their captions. Only the words live here: the texts below are the single source, tools/parlante.mjs
// speaks them offline exactly as the app does (its speech plan, pronunciation and voice, Pocket TTS «Giovanni», Kyutai,
// CC BY 4.0) into docs/parlante/<id>.mp3 and writes the sentence timings between the TEMPI markers. Change a text, run
// the tool again. Every spoken claim is also written on the page. One sentence per caption: each ends with one . ? or !
// and has none inside. No external service, no tracking, nothing sent anywhere.
(function () {
  var PRESETS = [
    { id: "vantaggi", label: "I vantaggi", section: "vero", sentences: [
      "Ciao, sono Jarvis.",
      "Mi parli, e io lavoro: sul tuo computer, con il tuo abbonamento ChatGPT o Claude.",
      "Ti sento: mi dici «Ciao Jarvis», in italiano, e ti ascolto.",
      "So: conosco i tuoi progetti e i tuoi clienti, e il giorno dopo riprendo il filo.",
      "Faccio: ti consegno il lavoro finito, come un preventivo, o un sito con il suo link.",
      "Chiedo: prima di un'email, di un post o di una spesa, aspetto il tuo ok.",
      "E se mi manca un dato, ti chiedo solo quello, con una proposta.",
      "E imparo: do un voto a ogni risultato, e scelgo il modello che rende meglio.",
      "A te basta un pollice, in su o in giù.",
    ] },
    { id: "esempi", label: "Guardalo lavorare", section: "esempi", sentences: [
      "Ecco qualche esempio.",
      "Mi chiedi com'è messa la giornata, e ti dico gli appuntamenti e i lavori pronti.",
      "Mi chiedi i ristoranti qui vicino senza un sito.",
      "Li trovo, e ti preparo una proposta da mostrare al titolare.",
      "Chiedi una campagna a Elena, della mia squadra.",
      "Lei e Matteo la preparano, e la lasciano in pausa finché non approvi il budget.",
      "Dal telefono mi chiedi le email importanti, e rispondi con un sì.",
      "E se registri una riunione, alla fine ti do il verbale.",
    ] },
    { id: "cosa", label: "Cosa sa fare", section: "cosa-fa", sentences: [
      "Preparo preventivi, presentazioni e fogli di calcolo.",
      "Riassumo la posta e fisso gli appuntamenti.",
      "Preparo loghi, locandine e contenuti per i social, nei colori dei tuoi clienti.",
      "E li pubblico nel giorno e nell'ora che scegli.",
      "Trascrivo le riunioni e le chiamate, con le decisioni e le cose da fare.",
      "Organizzo i viaggi, con percorsi e alloggi, e prenoto solo con il tuo ok.",
      "Per molti mestieri trovi procedure pronte: per il commercialista, l'avvocato, l'artigiano, il ristorante e il bed and breakfast.",
      "Sono sempre bozze, controllate su fonti ufficiali.",
      "Con il piano Max preparo le campagne e il software.",
    ] },
    { id: "come", label: "Come funziona", section: "come", sentences: [
      "Funziona in tre passi.",
      "Primo: installi Jarvis sul Mac o su Windows, e incolli la licenza.",
      "Secondo: colleghi il tuo abbonamento ChatGPT o Claude.",
      "Al primo avvio lo trovo da solo, e se serve ti guido a installare il programma ufficiale.",
      "Terzo: mi dici «Ciao Jarvis», oppure tieni premuto lo spazio.",
      "E quando sei fuori casa, mi mandi un messaggio su Telegram.",
    ] },
    { id: "stati", label: "Cosa vedi mentre lavora", section: "stati", sentences: [
      "Mentre lavoro, vedi sempre cosa sto facendo.",
      "Al centro c'è il mio nucleo.",
      "Quando ti ascolto, segue la tua voce.",
      "Quando lavoro, intorno compaiono i pannelli del lavoro in corso.",
      "E quando mi serve una tua decisione, tutto diventa ambra, e la richiesta ti viene davanti.",
      "Qui accanto puoi provare tu: premi uno stato, e guarda come cambio.",
    ] },
    { id: "privacy", label: "Privacy e controllo", section: "fiducia", sentences: [
      "I tuoi documenti restano sul tuo computer.",
      "Online va solo il pezzo che serve a rispondere.",
      "E prima di inviarlo a ChatGPT o a Claude, nascondo i dati sensibili: codice fiscale, coordinate bancarie, nomi e indirizzi diventano segnaposto.",
      "I dati veri restano qui, e te li rimetto nella risposta.",
      "Su Telegram arrivano solo i segnaposto.",
      "Un progetto riservato, invece, non esce affatto.",
      "Decidi tu quanta autonomia darmi.",
      "Anche con la massima, le email, i post pubblici e le spese te li chiedo sempre.",
      "E non mi addestro sui tuoi dati.",
    ] },
    { id: "prezzi", label: "Prezzi e licenza", section: "piani", sentences: [
      "Jarvis si paga una volta sola, senza abbonamento.",
      "Il piano Pro costa 149 euro, ed è per chi ha un'attività principale.",
      "Il piano Max costa 349 euro, ed è per chi segue più clienti, sviluppa software e fa campagne.",
      "La licenza non scade, e vale per due computer.",
      "Include dodici mesi di aggiornamenti.",
      "E se entro quattordici giorni non fa per te, ti restituiamo quanto hai pagato.",
    ] },
    { id: "scarica", label: "Scarica e prova", section: "scarica", sentences: [
      "Puoi scaricare Jarvis per Mac e per Windows, e attivarlo con la licenza.",
      "Preferisci provarlo prima?",
      "Chiedi la prova gratuita di quattordici giorni del piano Max, con i tuoi abbonamenti.",
      "Alla fine scegli il piano, e ritrovi tutto com'era.",
      "La demo gratuita, con risposte simulate, è in arrivo.",
      "Per la licenza o per la prova, scrivici: i contatti sono qui sotto.",
    ] },
    { id: "domande", label: "Le domande più frequenti", section: "domande", sentences: [
      "Serve un abbonamento?",
      "Basta il tuo Claude o ChatGPT: lo uso io, al posto tuo.",
      "Se lavori già con ChatGPT o con Claude, io ci aggiungo tre cose.",
      "La voce in italiano, una squadra che conosce i tuoi progetti, e il lavoro consegnato finito.",
      "E mi trovi anche sul telefono, con Telegram, quando il computer è acceso.",
      "E se qualcosa non va, dimmelo: preparo io la segnalazione, e te la faccio rileggere.",
    ] },
  ];
  // How the voice must say a few words, given to the app's speech plan exactly like the owner's lexicon in the app.
  var LESSICO = [["ok", "okèi"], ["post", "pòst"], ["ChatGPT", "Ciat-Gipitì"]];
  // Start of each sentence and length of the file, in seconds (written by tools/parlante.mjs).
  var TEMPI = /*TEMPI*/{"vantaggi":{"durata":40,"frasi":[0,1.84,7.63,11.89,16.71,22.56,28.01,32.5,37.76],"testo":"213d100790cd"},"esempi":{"durata":31.1,"frasi":[0,1.85,7.11,10.49,14.73,18.22,23.34,27.75],"testo":"35348a4b45a4"},"cosa":{"durata":40,"frasi":[0,3.74,6.83,12.27,15.21,19.86,25.3,33.73,37.26],"testo":"8d6171a72bdf"},"come":{"durata":24.5,"frasi":[0,1.91,7.06,10.86,16.51,21.14],"testo":"5ac2c988aa21"},"stati":{"durata":22.1,"frasi":[0,3.24,5.32,7.98,12.13,17.85],"testo":"d73fa638760a"},"privacy":{"durata":37,"frasi":[0,2.95,6.25,16.39,20.45,23.55,27.46,30.1,35.34],"testo":"7974ad1bdb0b"},"prezzi":{"durata":27.2,"frasi":[0,4.03,9.51,16.43,19.9,22.79],"testo":"639b7848372b"},"scarica":{"durata":23.1,"frasi":[0,4.56,6.76,11.98,15.55,19.34],"testo":"cbc039e60c99"},"domande":{"durata":26.9,"frasi":[0,2.27,6.45,11.01,17.11,21.82],"testo":"c793a57f9c28"}}/*FINE TEMPI*/;
  if (typeof window !== "undefined") { window.JARVIS_PARLANTE = PRESETS; window.JARVIS_PARLANTE_LESSICO = LESSICO; window.JARVIS_PARLANTE_TEMPI = TEMPI; }
})();
