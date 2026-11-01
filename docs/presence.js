// The animated presence of Jarvis, the same engine as the app (reactor.js, generated from the app's source).
// The main stage follows real audio playback and its measured amplitude when available; the "Come lavora"
// section lets the visitor pick a simulated state. Paused when off screen or the tab is hidden; one
// still frame with reduced motion. The second canvas starts only when its section comes near.
(function () {
  if (!window.JarvisReactor) return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MOODS = {
    idle: { idle: 1, listen: 0, think: 0, speak: 0, wait: 0, fault: 0, dim: 0, work: 0 },
    listen: { idle: 0, listen: 1, think: 0, speak: 0, wait: 0, fault: 0, dim: 0, work: 0 },
    think: { idle: 0, listen: 0, think: 1, speak: 0, wait: 0, fault: 0, dim: 0, work: 0 },
    speak: { idle: 0, listen: 0, think: 0, speak: 1, wait: 0, fault: 0, dim: 0, work: 0 },
    wait: { idle: 0, listen: 0, think: 0, speak: 0, wait: 1, fault: 0, dim: 0, work: 0 },
  };
  function hash(n) { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
  function voice(t, seed) {
    var s = t * 4.3 + seed, i = Math.floor(s), f = s - i;
    var syl = Math.pow(Math.sin(Math.PI * f), 0.75) * (0.42 + 0.58 * hash(i + seed * 13));
    var gap = hash(Math.floor(t * 0.9 + seed * 0.37) * 7.1 + seed) < 0.16 ? 0.06 : 1;
    return syl * gap;
  }
  function mount(canvas, onTick) {
    var engine = new JarvisReactor.Reactor(), ctx = canvas.getContext("2d"), visible = true, t = 0, last = 0;
    function size() {
      var r = canvas.getBoundingClientRect(), dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.max(2, Math.round(r.width * dpr)); canvas.height = Math.max(2, Math.round(r.height * dpr));
    }
    size(); if (window.ResizeObserver) new ResizeObserver(function () { size(); if (reduced) draw(); }).observe(canvas);
    if (window.IntersectionObserver) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(canvas);
    function draw() { engine.draw(ctx, canvas.width, canvas.height, t, false); }
    var level = null;
    var api = {
      level: function (read) { level = read; },
      set: function (state) { engine.setMood(MOODS[state]); if (reduced) { engine.settle(); for (var i = 0; i < 60; i++) { t += 1 / 30; engine.step(1 / 30, t, { amp: 0.6, mic: 0.5 }); } draw(); } },
    };
    if (!reduced) requestAnimationFrame(function frame(now) {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) { last = now; return; }
      if (now - last < 1000 / 30 - 3) return;
      var dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 30; last = now; t += dt;
      if (onTick) onTick(dt);
      engine.step(dt, t, { amp: level ? level() : voice(t, 0), mic: level ? 0 : voice(t * 0.93, 5.3) });
      draw();
    });
    return api;
  }
  // Another stage on the page (the Officina): the same engine, driven by state, started by the caller.
  window.JarvisStage = function (canvas) { var stage = mount(canvas); stage.set("idle"); return stage; };

  // The main stage follows actual playback. The state explorer below remains an explicitly simulated demo.
  var heroCanvas = document.getElementById("hero-presence"), caption = document.getElementById("hero-caption");
  if (heroCanvas) {
    var figure = heroCanvas.closest(".presence-stage"), speaking = false;
    figure.classList.add("live");
    var hero = mount(heroCanvas), context = null, analyser = null, samples = null, source = null;
    hero.set("idle");
    hero.level(function () {
      if (!speaking || !analyser) return 0;
      analyser.getByteTimeDomainData(samples);
      var sum = 0;
      for (var i = 0; i < samples.length; i++) { var n = (samples[i] - 128) / 128; sum += n * n; }
      return Math.min(1, Math.sqrt(sum / samples.length) * 4);
    });
    window.JarvisPresence = {
      audio: function (audio) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        try {
          if (!context) { context = new AudioContext(); analyser = context.createAnalyser(); analyser.fftSize = 256; samples = new Uint8Array(analyser.fftSize); }
          if (source) source.disconnect();
          source = context.createMediaElementSource(audio);
          source.connect(context.destination); source.connect(analyser);
          if (context.state === "suspended") context.resume().catch(function () { /* captions remain available */ });
        } catch (e) { analyser = null; /* audio works without a reactive waveform */ }
      },
      // A state asked by the page (the Officina on a trade page: «Lavora», «Aspetta il tuo ok»), never over the voice.
      mood: function (state) { if (!speaking) hero.set(state); },
      speak: function (on, label) {
        speaking = on; hero.set(on ? "speak" : "idle");
        figure.classList.toggle("is-speaking", on);
        caption.dataset.state = on ? "speak" : "idle";
        caption.textContent = on ? (label || "JARVIS ti parla") : "Dimostrazione in pausa";
      },
    };
  }

  // "Come lavora": the visitor picks the state.
  var stateCanvas = document.getElementById("state-presence"), text = document.getElementById("state-text");
  if (stateCanvas) {
    var TEXT = {
      idle: "Pronto: dici «Ciao Jarvis» o tieni premuto lo spazio, e ti ascolta.",
      listen: "Ti ascolta: l'anello esterno diventa lo spettro della tua voce.",
      think: "Lavora: il nucleo accelera e attorno escono i pannelli del lavoro in corso, uno alla volta in primo piano.",
      speak: "Ti risponde: il contorno del nucleo segue la sua voce e ogni parola manda un'onda.",
      wait: "Aspetta il tuo ok: tutto diventa ambra e la richiesta, con i pulsanti, viene davanti al nucleo.",
    };
    // Started only when the section comes near: nothing to draw before then.
    var stage = null, wanted = "idle";
    var start = function () { if (stage) return; stage = mount(stateCanvas); stage.set(wanted); };
    if (window.IntersectionObserver) {
      var near = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { start(); near.disconnect(); } }, { rootMargin: "300px" });
      near.observe(stateCanvas);
    } else start();
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".state-buttons button"));
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        wanted = b.dataset.state; if (stage) stage.set(wanted); text.textContent = TEXT[b.dataset.state];
      });
    });
  }
})();
