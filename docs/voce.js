// The voice of Jarvis on the site: one player for the home's welcome (benvenuto.js) and the trade pages (mestiere.js).
// It plays clips made in advance with the app's voice (tools/parlante.mjs) and shows, as a caption, the sentence being
// said: the words come from the same texts the audio was made from, so what is heard is always what is written.
// Audio starts only from a click (browsers' rules, and manners); pause, skip and «Senza audio» stay visible while it
// speaks; Esc pauses. Without audio (blocked, missing, offline, or chosen) the same words are shown as text. No
// microphone, no external service, nothing sent anywhere. Also two small helpers the pages share: prices from
// config.js and the trial request by email.
(function () {
  var site = window.JARVIS_SITE || {};
  var euro = function (n) { return n.toLocaleString("it-IT") + " €"; };

  // A clip by id: the welcome's and the trades' (docs/voce/) or the short explanations (docs/parlante/).
  function clipOf(id, root) {
    root = root || "";
    var tempi = window.JARVIS_VOCE_TEMPI || {}, texts = window.JARVIS_VOCE_TESTI || [], i;
    for (i = 0; i < texts.length; i++) if (texts[i].id === id) return { id: id, label: texts[i].label, sentences: texts[i].sentences, src: root + "voce/" + id + ".mp3", tempi: tempi[id] };
    var trades = (window.JARVIS_MESTIERI && window.JARVIS_MESTIERI.ruoli) || [];
    for (i = 0; i < trades.length; i++) if ("r-" + trades[i].id === id) return { id: id, label: "Jarvis " + trades[i].nome, sentences: trades[i].frasi, src: root + "voce/" + id + ".mp3", tempi: tempi[id] };
    var presets = window.JARVIS_PARLANTE || [], ptempi = window.JARVIS_PARLANTE_TEMPI || {};
    for (i = 0; i < presets.length; i++) if (presets[i].id === id) return { id: id, label: presets[i].label, sentences: presets[i].sentences, src: root + "parlante/" + id + ".mp3", tempi: ptempi[id] };
    return null;
  }

  /**
   * A voice panel bound to its markup ([data-voce]): `say(clips, voice)` plays the clips one after the other with
   * their captions (voice) or shows their words at once (text). Callbacks: onSentence(clip, index) while it speaks,
   * onEnd() when the last clip ends or is skipped, onMute() when the visitor turns the audio off or it cannot play.
   */
  function panel(el, options) {
    options = options || {};
    var say = el.querySelector("[data-voce-say]"), pause = el.querySelector("[data-voce-pausa]"), skip = el.querySelector("[data-voce-salta]");
    var mute = el.querySelector("[data-voce-muto]"), bar = el.querySelector(".voce-bar i");
    var audio = null, queue = [], current = null, sentence = -1, label = "";
    var presence = function (on) { if (window.JarvisPresence) window.JarvisPresence.speak(on, on ? label : ""); };

    function render(clip, index) {
      say.innerHTML = "";
      var p = document.createElement("p");
      p.textContent = clip.sentences[index] || "";
      say.appendChild(p);
    }
    function tick() {
      if (!audio || !current) return;
      var t = current.tempi, now = audio.currentTime, length = audio.duration || (t && t.durata) || 0, index = 0;
      if (bar) bar.style.width = length ? Math.min(100, (now / length) * 100) + "%" : "0";
      if (t && t.frasi) { for (var i = 0; i < t.frasi.length; i++) if (now + 0.05 >= t.frasi[i]) index = i; }
      else index = Math.min(current.sentences.length - 1, Math.floor((now / (length || 1)) * current.sentences.length));
      if (index !== sentence) { sentence = index; render(current, index); if (options.onSentence) options.onSentence(current, index); }
    }
    function controls(playing) {
      if (!pause) return;
      pause.setAttribute("aria-label", playing ? "Pausa" : "Riprendi");
      pause.querySelector("use").setAttribute("href", playing ? "#i-pause" : "#i-play");
    }
    function halt() { if (audio) { var old = audio; audio = null; old.pause(); old.removeAttribute("src"); old.load(); } }
    function next() {
      halt();
      current = queue.shift() || null; sentence = -1;
      if (!current) { el.classList.remove("speaking"); presence(false); if (bar) bar.style.width = "0"; if (options.onEnd) options.onEnd(); return; }
      label = current.label || "Ti parlo";
      if (options.onClip) options.onClip(current);
      render(current, 0);
      var me = audio = new Audio();
      var mine = function (handler) { return function (event) { if (me === audio) handler(event); }; };
      me.preload = "auto"; me.src = current.src;
      me.addEventListener("timeupdate", mine(tick));
      me.addEventListener("playing", mine(function () { controls(true); el.classList.add("speaking"); presence(true); }));
      me.addEventListener("pause", mine(function () { if (!me.ended) { controls(false); presence(false); } }));
      me.addEventListener("ended", mine(next));
      me.addEventListener("error", mine(unavailable));
      var started = me.play();
      if (started && started.catch) started.catch(function (error) { if (me === audio && error && error.name !== "AbortError") unavailable(); });
    }
    // Without audio the words are still there: the panel says so once and the page goes on as text.
    function unavailable() {
      var rest = [current].concat(queue).filter(Boolean);
      halt(); queue = []; current = null; presence(false); el.classList.remove("speaking");
      show(rest, "Audio non disponibile: ecco il testo.");
      if (options.onMute) options.onMute(true);
    }
    function show(clips, note) {
      say.innerHTML = "";
      if (note) { var n = document.createElement("p"); n.className = "voce-note"; n.textContent = note; say.appendChild(n); }
      clips.forEach(function (clip) { clip.sentences.forEach(function (text) { var p = document.createElement("p"); p.textContent = text; say.appendChild(p); }); });
    }

    if (pause) pause.addEventListener("click", function () {
      if (!audio) return;
      if (audio.paused) { var p = audio.play(); if (p && p.catch) p.catch(unavailable); } else audio.pause();
    });
    if (skip) skip.addEventListener("click", function () { if (current) { if (options.onSentence) options.onSentence(current, -1); next(); } });
    if (mute) mute.addEventListener("click", function () {
      queue = []; halt(); current = null; presence(false); el.classList.remove("speaking");
      el.hidden = true;
      if (options.onMute) options.onMute(false);
      if (options.onEnd) options.onEnd(true);
    });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && audio && !audio.paused) audio.pause(); });

    return {
      say: function (ids, root) {
        halt();
        queue = ids.map(function (id) { return clipOf(id, root); }).filter(Boolean);
        el.hidden = false; controls(true);
        next();
      },
      stop: function () { queue = []; halt(); current = null; presence(false); el.classList.remove("speaking"); },
      speaking: function () { return !!current; },
    };
  }

  // Prices from config.js: «149 € una tantum» where the page has a place for them, nothing where they are not set.
  function prices(scope) {
    var p = site.prices || {};
    Array.prototype.forEach.call((scope || document).querySelectorAll("[data-price]"), function (el) {
      if (p[el.dataset.price]) el.textContent = euro(p[el.dataset.price]) + " una tantum, senza abbonamento";
    });
    Array.prototype.forEach.call((scope || document).querySelectorAll("[data-price-inline]"), function (el) {
      if (p[el.dataset.priceInline]) el.textContent = " costa " + euro(p[el.dataset.priceInline]);
    });
  }
  // The trial asked by email, with the trade already written: the link stays on the download section without an
  // address in config.js. The visitor's mail app opens; nothing is sent by the page.
  function prova(link, mestiere) {
    if (!link || !site.email) return;
    var body = "Ciao, vorrei provare Jarvis per 14 giorni con il piano Max.\n\n" + (mestiere ? "Il mio lavoro: " + mestiere + "\n" : "") +
      "Codice del computer: (lo trovi aprendo Jarvis, nella schermata di attivazione)\n\nGrazie";
    link.href = "mailto:" + site.email + "?subject=" + encodeURIComponent("Prova gratuita di Jarvis" + (mestiere ? " · " + mestiere : "")) + "&body=" + encodeURIComponent(body);
  }

  window.JarvisVoce = { clip: clipOf, panel: panel, prices: prices, prova: prova, euro: euro };
})();
