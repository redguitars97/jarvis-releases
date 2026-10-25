// The animated presence of Jarvis, the same engine as the app (reactor.js, generated from the app's source).
// The hero plays a short story on a loop (ready, listens, works, answers, asks for your ok); the "Come lavora"
// section lets the visitor pick a state. The voice is simulated. Paused when off screen or the tab is hidden; one
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
    var api = {
      set: function (state) { engine.setMood(MOODS[state]); if (reduced) { engine.settle(); for (var i = 0; i < 60; i++) { t += 1 / 30; engine.step(1 / 30, t, { amp: 0.6, mic: 0.5 }); } draw(); } },
    };
    if (!reduced) requestAnimationFrame(function frame(now) {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) { last = now; return; }
      if (now - last < 1000 / 30 - 3) return;
      var dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 30; last = now; t += dt;
      if (onTick) onTick(dt);
      engine.step(dt, t, { amp: voice(t, 0), mic: voice(t * 0.93, 5.3) });
      draw();
    });
    return api;
  }

  // Hero: the story on a loop.
  var heroCanvas = document.getElementById("hero-presence"), caption = document.getElementById("hero-caption");
  if (heroCanvas) {
    document.querySelector(".presence-stage").classList.add("live");
    var story = [["idle", "Pronto", 3], ["listen", "Ti ascolto…", 3.5], ["think", "Ci lavoro: piano, ricerca, documenti", 5],
      ["speak", "Ti rispondo", 4], ["wait", "Aspetto il tuo ok", 4.5]], step = 0, elapsed = 0;
    var hero = mount(heroCanvas, function (dt) {
      elapsed += dt;
      if (elapsed > story[step][2]) { elapsed = 0; step = (step + 1) % story.length; hero.set(story[step][0]); caption.textContent = story[step][1]; caption.dataset.state = story[step][0]; }
    });
    hero.set(reduced ? "think" : "idle");
    if (reduced) caption.textContent = story[2][1];
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
