// «Jarvis parlante»: short spoken explanations, chosen by the visitor. Off by default and remembered per visitor; the
// page is complete without it (no JavaScript, no audio, at night with the sound off). Audio starts only from a click.
// The texts below are the single source: tools/parlante.mjs reads them, speaks them offline exactly as the app does
// (its speech plan, pronunciation and voice, Pocket TTS «Giovanni», Kyutai, CC BY 4.0) into docs/parlante/<id>.mp3 and
// writes the sentence timings between the TEMPI markers. Change a text, run the tool again. Every spoken claim is also
// written on the page. One sentence per caption: each ends with one . ? or ! and has none inside.
// No external service, no tracking, nothing sent anywhere.
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
      "E imparo: valuto ogni risultato, e scelgo il modello che rende meglio.",
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
  var TEMPI = /*TEMPI*/{"vantaggi":{"durata":39.5,"frasi":[0,1.84,7.45,11.71,16.53,22.38,27.83,32.32,37.26]},"esempi":{"durata":31.1,"frasi":[0,1.85,7.11,10.49,14.73,18.22,23.33,27.74]},"cosa":{"durata":40,"frasi":[0,3.83,6.92,12.25,15.39,20.04,25.48,33.91,37.44]},"come":{"durata":24.8,"frasi":[0,1.91,7.29,11.2,16.85,21.48]},"stati":{"durata":22.1,"frasi":[0,3.24,5.34,8,12.13,17.85]},"privacy":{"durata":36.6,"frasi":[0,2.99,6.29,16.36,20.42,23.52,27.43,30.07,34.98]},"prezzi":{"durata":27.3,"frasi":[0,4.03,9.51,16.44,19.91,22.87]},"scarica":{"durata":23.1,"frasi":[0,4.57,6.77,11.99,15.56,19.35]},"domande":{"durata":26.6,"frasi":[0,2.27,6.45,10.73,16.83,21.53]}}/*FINE TEMPI*/;
  if (typeof window !== "undefined") { window.JARVIS_PARLANTE = PRESETS; window.JARVIS_PARLANTE_LESSICO = LESSICO; }
  if (typeof document === "undefined") return;

  var KEY = "jarvis-parlante";
  var remembered = function () { try { return window.localStorage.getItem(KEY) === "1"; } catch (e) { return false; } };
  var remember = function (on) { try { window.localStorage.setItem(KEY, on ? "1" : "0"); } catch (e) { /* private window: not remembered */ } };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var panel = document.getElementById("parlante"), toggle = document.querySelector(".talk-toggle"), invite = document.querySelector(".talk-invite");
  if (!panel || !toggle) return;
  var presetsBox = panel.querySelector(".talk-presets"), caption = document.getElementById("talk-caption"), nowLabel = panel.querySelector(".talk-now");
  var pauseButton = panel.querySelector("[data-talk-pause]"), stopButton = panel.querySelector("[data-talk-stop]");
  var bar = panel.querySelector(".talk-bar i"), clock = panel.querySelector(".talk-time");
  var transcript = panel.querySelector(".talk-text"), lines = transcript.querySelector("ol");
  var audio = null, current = null, sentence = -1, on = false, queue = [];
  var IDLE = "Scegli cosa ascoltare: l'audio parte solo quando premi.";

  var find = function (id) { for (var i = 0; i < PRESETS.length; i++) if (PRESETS[i].id === id) return PRESETS[i]; return null; };
  var seconds = function (s) { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  var length = function (preset) { var t = TEMPI[preset.id]; return t && t.durata ? " · " + Math.round(t.durata) + " s" : ""; };
  var total = PRESETS.reduce(function (sum, preset) { var t = TEMPI[preset.id]; return sum + (t && t.durata ? t.durata : 0); }, 0);
  var presence = function (speaking, label) { if (window.JarvisPresence) window.JarvisPresence.speak(speaking, label); };

  // «Ascolta tutto» first, then one button per preset; under the title of each section, its own «Ascolta».
  var allButton = document.createElement("button");
  allButton.type = "button"; allButton.className = "chip talk-chip talk-all"; allButton.setAttribute("aria-pressed", "false");
  allButton.textContent = "Ascolta tutto" + (total ? " · " + Math.round(total / 60) + " min" : "");
  allButton.addEventListener("click", function () { playAll(); });
  presetsBox.appendChild(allButton);
  var presetButtons = PRESETS.map(function (preset) {
    var button = document.createElement("button");
    button.type = "button"; button.className = "chip talk-chip"; button.setAttribute("aria-pressed", "false");
    button.textContent = preset.label + length(preset);
    button.addEventListener("click", function () { queue = []; play(preset.id); });
    presetsBox.appendChild(button);
    return button;
  });
  var hereButtons = PRESETS.map(function (preset) {
    var section = document.getElementById(preset.section), title = section && section.querySelector(".section-title");
    if (!title) return null;
    var button = document.createElement("button");
    button.type = "button"; button.className = "talk-here"; button.hidden = true;
    button.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-play"/></svg><span></span>';
    button.lastChild.textContent = "Ascolta: " + preset.label.toLowerCase() + length(preset);
    button.addEventListener("click", function () { queue = []; play(preset.id); });
    title.parentNode.insertBefore(button, title.nextSibling);
    return button;
  });

  function setMode(next) {
    on = next; remember(on);
    panel.hidden = !on;
    toggle.setAttribute("aria-pressed", String(on));
    toggle.setAttribute("aria-label", on ? "Disattiva Jarvis parlante" : "Attiva Jarvis parlante");
    document.body.classList.toggle("talking-mode", on);
    hereButtons.forEach(function (button) { if (button) button.hidden = !on; });
    if (!on) { queue = []; stop(); }
    room();
  }
  // Room at the bottom of the page for the docked panel, so it never covers the last lines.
  function room() { document.body.style.setProperty("--talk-room", on ? panel.offsetHeight + 16 + "px" : "0px"); }
  if (window.ResizeObserver) new ResizeObserver(room).observe(panel);

  function show(index) {
    if (index === sentence) return;
    sentence = index;
    var items = lines.children;
    for (var i = 0; i < items.length; i++) items[i].classList.toggle("now", i === index);
    caption.textContent = index >= 0 ? current.sentences[index] : current.label;
  }
  function tick() {
    if (!audio || !current) return;
    var t = TEMPI[current.id], now = audio.currentTime, length = audio.duration || (t && t.durata) || 0;
    bar.style.width = length ? Math.min(100, (now / length) * 100) + "%" : "0";
    clock.textContent = seconds(now) + " / " + seconds(length);
    var starts = t && t.frasi, index = 0;
    if (starts) { for (var i = 0; i < starts.length; i++) if (now + 0.05 >= starts[i]) index = i; }
    else index = Math.min(current.sentences.length - 1, Math.floor((now / (length || 1)) * current.sentences.length));
    show(index);
  }
  function controls(playing) {
    pauseButton.disabled = !current; stopButton.disabled = !current;
    pauseButton.setAttribute("aria-label", playing ? "Pausa" : "Riprendi");
    pauseButton.querySelector("use").setAttribute("href", playing ? "#i-pause" : "#i-play");
  }
  function pressed(preset) {
    allButton.setAttribute("aria-pressed", String(!!preset && allButton.dataset.running === "1"));
    presetButtons.forEach(function (button, i) { button.setAttribute("aria-pressed", String(PRESETS[i] === preset)); });
  }
  function playAll() {
    queue = PRESETS.map(function (preset) { return preset.id; });
    allButton.dataset.running = "1";
    play(queue.shift(), true);
  }
  function play(id, guided) {
    var preset = find(id);
    if (!preset) return;
    if (!guided) allButton.dataset.running = "";
    if (!on) setMode(true);
    halt();
    current = preset; sentence = -1;
    pressed(preset);
    if (nowLabel) nowLabel.textContent = preset.label + (allButton.dataset.running === "1" ? " · " + (PRESETS.indexOf(preset) + 1) + " di " + PRESETS.length : "");
    lines.innerHTML = "";
    preset.sentences.forEach(function (text) { var li = document.createElement("li"); li.textContent = text; lines.appendChild(li); });
    caption.textContent = preset.label;
    // The guided tour brings the section it explains into view.
    if (guided) { var section = document.getElementById(preset.section); if (section) section.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); }
    var me = audio = new Audio();
    var mine = function (handler) { return function (event) { if (me === audio) handler(event); }; };
    me.preload = "auto";
    me.src = "parlante/" + preset.id + ".mp3";
    me.addEventListener("timeupdate", mine(tick));
    me.addEventListener("playing", mine(function () { controls(true); presence(true, "Ti parlo: " + preset.label.toLowerCase()); }));
    me.addEventListener("pause", mine(function () { if (!me.ended) { controls(false); presence(false); } }));
    me.addEventListener("ended", mine(function () {
      if (queue.length) { play(queue.shift(), true); return; }
      presence(false); show(-1);
      caption.textContent = "Fine. Scegli un'altra spiegazione o continua a leggere.";
      allButton.dataset.running = ""; current = null; pressed(null); controls(false);
      if (nowLabel) nowLabel.textContent = "";
    }));
    me.addEventListener("error", mine(unavailable));
    controls(true);
    var started = me.play();
    if (started && started.catch) started.catch(function (error) { if (me === audio && error && error.name !== "AbortError") unavailable(); });
  }
  // Without audio (blocked, missing, offline) the explanation is still there, as text.
  function unavailable() {
    if (!current) return;
    queue = []; allButton.dataset.running = "";
    caption.textContent = "Audio non disponibile: ecco il testo.";
    transcript.open = true; controls(false); presence(false);
  }
  function halt() {
    if (audio) { var old = audio; audio = null; old.pause(); old.removeAttribute("src"); old.load(); }
  }
  function stop() {
    halt();
    queue = []; allButton.dataset.running = "";
    current = null; sentence = -1; pressed(null);
    caption.textContent = IDLE; bar.style.width = "0"; clock.textContent = "";
    if (nowLabel) nowLabel.textContent = "";
    for (var i = 0; i < lines.children.length; i++) lines.children[i].classList.remove("now");
    controls(false); presence(false);
  }

  pauseButton.addEventListener("click", function () {
    if (!audio) return;
    if (audio.paused) { var p = audio.play(); if (p && p.catch) p.catch(unavailable); } else audio.pause();
  });
  stopButton.addEventListener("click", stop);
  panel.querySelector("[data-talk-off]").addEventListener("click", function () { setMode(false); toggle.focus(); });
  toggle.addEventListener("click", function () { setMode(!on); if (on) allButton.focus(); });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape" && on && audio && !audio.paused) audio.pause(); });

  toggle.hidden = false;
  if (invite) {
    invite.hidden = false;
    var note = invite.querySelector("span");
    if (note && total) note.textContent = "circa " + Math.round(total / 60) + " minuti di audio, solo se premi; puoi fermarlo quando vuoi";
    invite.querySelector("[data-talk-open]").addEventListener("click", function () { playAll(); });
  }
  // Remembered: the panel comes back, silent until the visitor presses a button (browsers' autoplay rules, and manners).
  if (remembered()) setMode(true);
})();
