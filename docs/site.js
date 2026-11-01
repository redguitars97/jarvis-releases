// What every page shares: the values from config.js (prices, update period, computers, demo link, contacts and
// profiles: anything not filled in stays hidden or keeps its generic wording), the menu, the phone's thumb bar, and on
// «Come funziona, in dettaglio» the index that follows the reading and the blocks that open from a link. No motion
// here: the one orchestrated motion of the site is the Officina (officina.js). No tracking, nothing sent anywhere.
(function () {
  var c = window.JARVIS_SITE || {};
  var all = function (selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); };
  var euro = function (n) { return n.toLocaleString("it-IT") + " €"; };

  // ---- Prices and licence, from config.js ----
  all("[data-amount]").forEach(function (el) { var v = c.prices && c.prices[el.getAttribute("data-amount")]; if (v) el.textContent = euro(v); });
  all("[data-price]").forEach(function (el) { var v = c.prices && c.prices[el.getAttribute("data-price")]; if (v) el.textContent = euro(v) + " una tantum"; });
  all("[data-updates]").forEach(function (el) { if (c.updatesMonths) el.textContent = c.updatesMonths + " mesi di aggiornamenti inclusi"; });
  all("[data-devices]").forEach(function (el) { if (c.devicesIncluded) el.textContent = "Vale su " + c.devicesIncluded + " computer tuoi"; });
  all("[data-renewal]").forEach(function (el) {
    if (!c.renewal || !c.updatesMonths || !(c.renewal.pro || c.renewal.max)) return;
    el.textContent = "Dopo " + c.updatesMonths + " mesi Jarvis continua a funzionare con l'ultima versione ricevuta. Vuoi le successive? Rinnovi " + c.updatesMonths + " mesi di aggiornamenti" +
      (c.renewal.pro ? " a " + euro(c.renewal.pro) + " (Pro)" : "") + (c.renewal.max ? (c.renewal.pro ? " o " : " a ") + euro(c.renewal.max) + " (Max)" : "") + ", quando vuoi.";
  });
  if (c.demoUrl) {
    var demo = document.getElementById("demo-link"), soon = document.getElementById("demo-soon");
    if (demo) { demo.href = c.demoUrl; demo.hidden = false; }
    if (soon) soon.hidden = true;
  }

  // ---- Contacts and profiles ----
  var items = [];
  if (c.email) items.push(["Email", c.email, "mailto:" + c.email]);
  if (c.whatsapp) items.push(["WhatsApp", c.whatsapp, "https://wa.me/" + c.whatsapp.replace(/[^\d]/g, "")]);
  if (c.telegram) items.push(["Telegram", "@" + c.telegram, "https://t.me/" + c.telegram]);
  if (c.instagram) items.push(["Instagram", "@" + c.instagram, "https://www.instagram.com/" + c.instagram + "/"]);
  if (c.tiktok) items.push(["TikTok", "@" + c.tiktok, "https://www.tiktok.com/@" + c.tiktok]);
  var list = document.getElementById("contacts");
  if (list && items.length) {
    items.forEach(function (item) {
      var li = document.createElement("li"), name = document.createElement("span"), a = document.createElement("a");
      name.textContent = item[0]; a.href = item[2]; a.textContent = item[1];
      if (/^https?:/.test(item[2])) { a.target = "_blank"; a.rel = "noopener"; }
      li.appendChild(name); li.appendChild(a); list.appendChild(li);
    });
    var box = document.getElementById("contatti"); if (box) box.hidden = false;
  }
  var social = document.getElementById("social");
  if (social) {
    items.filter(function (item) { return /^https?:/.test(item[2]) && item[0] !== "WhatsApp"; }).forEach(function (item) {
      var a = document.createElement("a"); a.href = item[2]; a.target = "_blank"; a.rel = "noopener"; a.textContent = item[0];
      a.setAttribute("aria-label", item[0] + " " + item[1]); social.appendChild(a);
    });
    social.hidden = !social.children.length;
  }

  // ---- Menu: choosing a section closes it; Esc closes it ----
  all(".menu").forEach(function (menu) {
    all("a", menu).forEach(function (link) { link.addEventListener("click", function () { menu.open = false; }); });
    menu.addEventListener("keydown", function (event) { if (event.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary").focus(); } });
  });

  // ---- A trade's name in a headline: from its design size down, until its longest word fits the column ----
  function fitNames() {
    all(".hero h1.chosen-role .role-name, .role-hero h1 .role-name").forEach(function (el) {
      // (the article stays with its noun: «il commercialista», never «il» alone on a line)
      if (el.firstChild && el.firstChild.nodeType === 3) el.firstChild.data = el.firstChild.data.replace(/^(il|lo|la|i|gli|le|un|uno|una|per) /i, "$1\u00a0");
      el.style.fontSize = "";
      var size = parseFloat(getComputedStyle(el).fontSize), floor = 24;
      for (var step = 0; step < 40 && el.scrollWidth > el.clientWidth + 1 && size > floor; step += 1) { size = Math.max(floor, size * 0.94); el.style.fontSize = size + "px"; }
    });
  }
  window.JarvisFitNames = fitNames;
  fitNames();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNames);
  var fitting = false;
  window.addEventListener("resize", function () { if (fitting) return; fitting = true; requestAnimationFrame(function () { fitting = false; fitNames(); }); });

  // ---- The phone's thumb bar: after the first screen, never over the download, the voice player or a field ----
  var thumb = document.querySelector(".thumb-bar");
  if (thumb && "IntersectionObserver" in window) {
    var first = document.querySelector(".hero, .role-hero"), goal = document.getElementById("scarica") || document.querySelector(".role-cta");
    var voice = document.querySelector("[data-voce]");
    var bench = document.querySelector(".of-bench");
    var past = false, atGoal = false, typing = false, atBench = false;
    var update = function () { thumb.classList.toggle("show", past && !atGoal && !typing && !atBench && !(voice && !voice.hidden)); };
    // (the Officina's approval has its own buttons at the bottom of the bench: no bar over them)
    if (bench) new IntersectionObserver(function (e) { atBench = e[0].isIntersecting; update(); }, { rootMargin: "0px 0px -120px 0px" }).observe(bench);
    if (first) new IntersectionObserver(function (e) { past = !e[0].isIntersecting; update(); }).observe(first);
    if (goal) new IntersectionObserver(function (e) { atGoal = e[0].isIntersecting; update(); }).observe(goal);
    if (voice && window.MutationObserver) new MutationObserver(update).observe(voice, { attributes: true, attributeFilter: ["hidden"] });
    document.addEventListener("focusin", function (e) { typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName); update(); });
    document.addEventListener("focusout", function () { typing = false; update(); });
  }

  // ---- A link to a closed part (from this page or from outside) opens it ----
  function openTarget(id) {
    var el = id && document.getElementById(id);
    for (var node = el; node; node = node.parentElement) if (node.tagName === "DETAILS" && !node.classList.contains("menu")) node.open = true;
    return el;
  }
  all('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () { openTarget(decodeURIComponent(link.getAttribute("href").slice(1))); });
  });
  window.addEventListener("hashchange", function () { openTarget(decodeURIComponent(location.hash.slice(1))); });
  if (location.hash) { var start = openTarget(decodeURIComponent(location.hash.slice(1))); if (start) start.scrollIntoView(); }

  // ---- «Come funziona, in dettaglio»: the index marks the block being read ----
  var index = all(".doc-index a");
  if (index.length && "IntersectionObserver" in window) {
    var byId = {};
    index.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var mark = function (id) {
      index.forEach(function (a) { a.setAttribute("aria-current", a === byId[id] ? "true" : "false"); });
      var a = byId[id], strip = a && a.closest("ol");
      if (a && strip && strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left: a.offsetLeft - 16, behavior: "auto" });
    };
    Object.keys(byId).forEach(function (id) {
      var block = document.getElementById(id);
      if (block) new IntersectionObserver(function (e) { if (e[0].isIntersecting) mark(id); }, { rootMargin: "-30% 0px -65% 0px" }).observe(block);
    });
  }
})();
