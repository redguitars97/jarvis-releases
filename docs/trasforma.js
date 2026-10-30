// «Per chi è» on the home: Jarvis becomes a trade, one example at a time, in one place, while the core turns faster at
// each change. Without JavaScript, or with reduced motion, the examples are simply listed and nothing moves. It stops
// when off screen, when the tab is hidden, while the pointer or the keyboard is on it, and with the «Pausa» button.
(function () {
  var box = document.querySelector("[data-morph]");
  if (!box) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var items = Array.prototype.slice.call(box.querySelectorAll(".morph-list li"));
  var button = box.querySelector(".morph-pause");
  if (items.length < 2 || !button) return;
  var current = 0, timer = null, paused = false, held = false, visible = true, EVERY = 3800;

  box.classList.add("live");
  items[0].classList.add("on");
  button.hidden = false;

  function show(i) {
    items[current].classList.remove("on");
    current = i;
    items[current].classList.add("on");
    box.classList.remove("shift"); void box.offsetWidth; box.classList.add("shift");
    setTimeout(function () { box.classList.remove("shift"); }, 900);
  }
  function running() { return !paused && !held && visible && !document.hidden; }
  function schedule() {
    clearTimeout(timer); timer = null;
    if (running()) timer = setTimeout(function () { show((current + 1) % items.length); schedule(); }, EVERY);
  }
  button.addEventListener("click", function () {
    paused = !paused;
    button.setAttribute("aria-pressed", paused ? "true" : "false");
    button.textContent = paused ? "Riprendi" : "Pausa";
    schedule();
  });
  // Reading or using a link: the example stays where it is.
  box.addEventListener("pointerenter", function () { held = true; schedule(); });
  box.addEventListener("pointerleave", function () { held = false; schedule(); });
  box.addEventListener("focusin", function (event) { if (event.target !== button) { held = true; schedule(); } });
  box.addEventListener("focusout", function () { held = false; schedule(); });
  document.addEventListener("visibilitychange", schedule);
  if (window.IntersectionObserver) new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0.2 }).observe(box);
  schedule();
})();
