// The page in motion and the values from config.js (prices, update period, contacts, demo link): anything not filled
// in stays hidden or keeps its generic wording. Without JavaScript, or with reduced motion, everything is simply shown
// and nothing moves. Motion uses transform and opacity only; work happens in one requestAnimationFrame per scroll.
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var phone = window.matchMedia("(max-width: 760px)");
  var root = document.documentElement;
  var all = function (selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); };
  var observe = function (el, options, cb) {
    if (!("IntersectionObserver" in window)) { cb(true, el); return; }
    new IntersectionObserver(function (entries) { entries.forEach(function (e) { cb(e.isIntersecting, e.target, e); }); }, options).observe(el);
  };

  // ---- Scroll: progress (where scroll timelines are missing), parallax layers ----
  var depthLayers = all("[data-depth]"), bands = all(".band, .demos");
  var scrollTimeline = window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()");
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight, max = root.scrollHeight - vh;
    if (!scrollTimeline) root.style.setProperty("--sp", max > 0 ? (y / max).toFixed(4) : 0);
    if (reduced) return;
    root.style.setProperty("--sy", Math.min(y, 1600).toFixed(1));
    depthLayers.forEach(function (el) { el.style.setProperty("--py", (Math.min(y, vh) * Number(el.dataset.depth)).toFixed(1)); });
    bands.forEach(function (band) {
      var r = band.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      band.style.setProperty("--pv", (((r.top + r.height / 2) - vh / 2) / vh).toFixed(3));
    });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // ---- Reveals, dividers, marquee: start when seen, pause when away ----
  all(".reveal").forEach(function (el) {
    observe(el, { threshold: 0.15 }, function (visible) { if (visible) el.classList.add("in"); });
  });
  all(".aurora, .marquee").forEach(function (el) {
    observe(el, { rootMargin: "100px" }, function (visible) { el.classList.toggle("paused", !visible); });
  });

  // ---- Counters count up once ----
  all("[data-count]").forEach(function (el) {
    var target = Number(el.dataset.count), done = false;
    if (reduced) return;
    el.textContent = "0";
    observe(el, { threshold: 0.6 }, function (visible) {
      if (!visible || done) return;
      done = true;
      var start = performance.now(), duration = 1400;
      (function frame(now) {
        var k = Math.min(1, (now - start) / duration), eased = 1 - Math.pow(1 - k, 3);
        el.textContent = String(Math.round(target * eased));
        if (k < 1) requestAnimationFrame(frame);
      })(start);
    });
  });

  // ---- The connector wall lights up once, tile after tile ----
  var wall = document.getElementById("wall");
  if (wall) {
    all("li", wall).forEach(function (li, i) { li.style.setProperty("--i", i); });
    observe(wall, { threshold: 0.15 }, function (visible) { if (visible) wall.classList.add("lit"); });
  }

  // ---- Sticky story: the step in the middle of the screen lights the stack ----
  var story = document.querySelector(".story"), stack = story && story.querySelector(".stack");
  if (story) {
    var storySteps = all("li[data-step]", story);
    var lightStep = function (n) {
      story.dataset.step = n; stack.dataset.active = n;
      storySteps.forEach(function (li) { li.classList.toggle("active", li.dataset.step === String(n)); });
    };
    lightStep(0);
    storySteps.forEach(function (li) {
      observe(li, { rootMargin: "-45% 0px -45% 0px" }, function (visible) { if (visible) lightStep(li.dataset.step); });
    });
  }

  // ---- Cursor light and a slight tilt on cards (mouse only) ----
  if (finePointer && !reduced) {
    all(".features article, .licence article, .three article, .downloads article").forEach(function (el) { el.classList.add("tilt"); });
    all(".wall li, .ladder li, .marquee-track li").forEach(function (el) { el.classList.add("glow"); });
    document.addEventListener("pointermove", function (event) {
      var card = event.target.closest && event.target.closest(".tilt, .glow");
      if (!card) return;
      var r = card.getBoundingClientRect(), x = (event.clientX - r.left) / r.width, y = (event.clientY - r.top) / r.height;
      card.style.setProperty("--mx", (x * 100).toFixed(1) + "%"); card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      if (card.classList.contains("tilt")) { card.style.setProperty("--ry", ((x - 0.5) * 6).toFixed(2) + "deg"); card.style.setProperty("--rx", ((0.5 - y) * 6).toFixed(2) + "deg"); }
    }, { passive: true });
    document.addEventListener("pointerout", function (event) {
      var card = event.target.closest && event.target.closest(".tilt");
      if (card && !card.contains(event.relatedTarget)) { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); }
    });
  }

  // ---- The examples: tabs on a computer, a swipeable strip on a phone ----
  var tabs = all(".demo-tabs [role=tab]");
  var stage = document.querySelector(".demo-window"), track = document.querySelector(".demo-track"), replay = document.querySelector(".replay");
  if (tabs.length && stage && track) {
    var panels = tabs.map(function (tab) { return document.getElementById(tab.getAttribute("aria-controls")); });
    var current = 0, auto = true, inView = false, timer = null, started = false;
    // Dots and a hint for the phone strip.
    var dots = document.createElement("div"); dots.className = "dots";
    var hint = document.createElement("p"); hint.className = "swipe-hint"; hint.textContent = "Scorri per gli altri esempi";
    panels.forEach(function (panel, i) {
      var dot = document.createElement("button"); dot.type = "button";
      dot.setAttribute("aria-label", "Esempio " + (i + 1) + ": " + tabs[i].querySelector("b").textContent);
      dot.addEventListener("click", function () { auto = false; go(i); });
      dots.appendChild(dot);
    });
    stage.appendChild(dots); stage.appendChild(hint);
    var dotButtons = all("button", dots);

    var bar = function (value) { tabs[current].style.setProperty("--p", value); };
    var stop = function () { clearTimeout(timer); timer = null; };
    function play() {
      stop(); started = true;
      var steps = all(".step", panels[current]);
      steps.forEach(function (step) { step.classList.remove("on", "gone"); });
      panels[current].style.setProperty("--shift", 0);
      replay.hidden = true;
      if (reduced) { steps.forEach(function (step) { step.classList.add(step.classList.contains("typing") ? "gone" : "on"); }); bar(1); return; }
      var total = steps.reduce(function (sum, step) { return sum + (Number(step.dataset.wait) || 800); }, 0), elapsed = 0, index = 0;
      bar(0);
      (function next() {
        if (index >= steps.length) {
          replay.hidden = false;
          if (auto) timer = setTimeout(function () { go((current + 1) % tabs.length); }, 4500);
          return;
        }
        var step = steps[index], wait = Number(step.dataset.wait) || 800;
        timer = setTimeout(function () {
          var before = steps[index - 1];
          if (before && before.classList.contains("typing")) before.classList.add("gone");
          step.classList.add("on"); follow(step); elapsed += wait; bar(elapsed / total); index += 1; next();
        }, wait);
      })();
    }
    // On a phone the chat slides up so the message that just arrived sits at the bottom of the window.
    function follow(step) {
      if (!phone.matches || reduced) return;
      var run = panels[current], box = run.getBoundingClientRect(), shift = Number(run.style.getPropertyValue("--shift")) || 0;
      var bottom = step.getBoundingClientRect().bottom - box.top + shift;
      run.style.setProperty("--shift", Math.max(0, Math.round(bottom + 12 - run.clientHeight)));
    }
    // Shows example i: on a computer by switching panel, on a phone by sliding the strip (the strip then calls activate).
    function activate(i) {
      current = i;
      tabs.forEach(function (tab, n) { tab.setAttribute("aria-selected", n === i ? "true" : "false"); tab.tabIndex = n === i ? 0 : -1; tab.style.setProperty("--p", 0); });
      dotButtons.forEach(function (dot, n) { dot.setAttribute("aria-current", n === i ? "true" : "false"); });
      if (!phone.matches) panels.forEach(function (panel, n) { panel.hidden = n !== i; });
      if (inView || reduced) play();
    }
    function go(i) {
      if (phone.matches) track.scrollTo({ left: i * track.clientWidth, behavior: reduced ? "auto" : "smooth" });
      else activate(i);
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { auto = false; go(i); });
      tab.addEventListener("keydown", function (event) {
        var move = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
        if (!move) return;
        event.preventDefault(); auto = false;
        var to = (i + move + tabs.length) % tabs.length; tabs[to].focus(); go(to);
      });
    });
    replay.addEventListener("click", function () { play(); });
    var settle = null;
    track.addEventListener("scroll", function () {
      if (!phone.matches) return;
      clearTimeout(settle);
      settle = setTimeout(function () { var i = Math.round(track.scrollLeft / track.clientWidth); if (i !== current) activate(i); }, 120);
    }, { passive: true });
    track.addEventListener("pointerdown", function () { auto = false; }, { passive: true });
    // On a computer, reserve the height of the tallest example, so the page below never jumps when one changes.
    function measure() {
      var tallest = 0;
      track.style.removeProperty("--run-h");
      // On a phone each example is a chat window of fixed height: nothing to reserve.
      if (phone.matches) return;
      panels.forEach(function (panel) {
        var wasHidden = panel.hidden; panel.hidden = false; panel.classList.add("measure");
        tallest = Math.max(tallest, panel.offsetHeight);
        panel.classList.remove("measure"); panel.hidden = wasHidden && !phone.matches;
      });
      track.style.setProperty("--run-h", tallest + "px");
    }
    function layout() {
      panels.forEach(function (panel, n) { panel.hidden = !phone.matches && n !== current; });
      measure();
      if (phone.matches) track.scrollLeft = current * track.clientWidth;
    }
    layout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    var resizing = null;
    window.addEventListener("resize", function () { clearTimeout(resizing); resizing = setTimeout(layout, 150); });
    if (phone.addEventListener) phone.addEventListener("change", layout);
    activate(0);
    // Plays only while the window is on screen: leaving it stops, coming back starts the example again.
    observe(stage, { threshold: 0.3 }, function (visible) {
      inView = visible;
      if (visible && (!started || !timer)) play();
      else if (!visible) { stop(); started = false; }
    });
  }

  var c = window.JARVIS_SITE || {};
  var euro = function (n) { return n.toLocaleString("it-IT") + " €"; };
  ["pro", "max"].forEach(function (plan) {
    var el = document.querySelector('[data-price="' + plan + '"]');
    if (el && c.prices && c.prices[plan]) el.textContent = euro(c.prices[plan]) + " una tantum";
  });
  var updates = document.querySelector("[data-updates]");
  if (updates && c.updatesMonths) updates.textContent = c.updatesMonths + " mesi di versioni nuove inclusi nel prezzo. Dopo, Jarvis continua a funzionare con l'ultima versione ricevuta.";
  var renewal = document.querySelector("[data-renewal]");
  if (renewal && c.renewal && (c.renewal.pro || c.renewal.max) && c.updatesMonths) {
    renewal.textContent = "Vuoi le versioni successive? Rinnovi " + c.updatesMonths + " mesi di aggiornamenti" +
      (c.renewal.pro ? " a " + euro(c.renewal.pro) + " (Pro)" : "") + (c.renewal.max ? (c.renewal.pro ? " o " : " a ") + euro(c.renewal.max) + " (Max)" : "") + ", quando vuoi.";
  }
  var devices = document.querySelector("[data-devices]");
  if (devices && c.devicesIncluded) devices.textContent = "Una licenza vale per " + c.devicesIncluded + (c.devicesIncluded === 1 ? " computer" : " computer") + " tuoi. Cambi computer? Ti mandiamo la licenza per quello nuovo.";

  if (c.demoUrl) {
    var link = document.getElementById("demo-link"); link.href = c.demoUrl; link.hidden = false;
    document.getElementById("demo-soon").hidden = true;
  }

  var list = document.getElementById("contacts"), items = [];
  if (c.email) items.push(["Email", c.email, "mailto:" + c.email]);
  if (c.whatsapp) items.push(["WhatsApp", c.whatsapp, "https://wa.me/" + c.whatsapp.replace(/[^\d]/g, "")]);
  if (c.telegram) items.push(["Telegram", "@" + c.telegram, "https://t.me/" + c.telegram]);
  if (list && items.length) {
    items.forEach(function (item) {
      var li = document.createElement("li"), a = document.createElement("a");
      li.innerHTML = "<span></span>"; li.firstChild.textContent = item[0];
      a.href = item[2]; a.textContent = item[1];
      if (/^https?:/.test(item[2])) { a.target = "_blank"; a.rel = "noopener"; }
      li.appendChild(a); list.appendChild(li);
    });
    document.getElementById("contatti").hidden = false;
    var nav = document.querySelector(".top nav"), contact = document.createElement("a");
    contact.href = "#contatti"; contact.textContent = "Contatti"; nav.appendChild(contact);
  }

  var thumb = document.querySelector(".thumb-bar");
  if (thumb) {
    if (!items.length) { document.getElementById("thumb-contact").remove(); thumb.style.gridTemplateColumns = "1fr"; }
    var pastHero = false, atDownload = false;
    var update = function () { thumb.classList.toggle("show", pastHero && !atDownload); };
    observe(document.querySelector(".hero"), { threshold: 0 }, function (visible) { pastHero = !visible; update(); });
    observe(document.getElementById("scarica"), { threshold: 0 }, function (visible) { atDownload = visible; update(); });
  }
})();
