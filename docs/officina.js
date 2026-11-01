// The Officina: the visitor picks a request, the reactor works (the app's presence engine, through presence.js) and
// the delivery comes out of the core, line by line; then the amber approval advances: «Mando il preventivo ai Rossi?
// Sì / No». The one orchestrated motion of the site, and only after a click (or while Jarvis's voice says that work,
// which the visitor started). On arrival the first delivery is already composed and still. With reduced motion, with
// the tab hidden or the section off screen, the delivery simply appears composed. Nothing is sent anywhere: «Sì» only
// says what the app would do. Without JavaScript the requests and what each delivers are plain text.
// Home: three common requests (below), or the chosen trade's three works (benvenuto.js calls JarvisOfficina.mestiere).
// Trade pages (tools/ruoli.mjs): the trade's works, and the voice of mestiere.js drives JarvisOfficina.show.
(function () {
  var root = document.getElementById("officina");
  if (!root) return;
  var bench = root.querySelector("[data-of-bench]"), list = root.querySelector("[data-of-reqs]");
  var out = root.querySelector("[data-of-out]"), status = root.querySelector("[data-of-status]"), who = root.querySelector("[data-of-who]");
  if (!bench || !list || !out) return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canvas = bench.querySelector("canvas"), stage = null, mood = "idle", inView = false, timers = [];
  var el = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  // ---- The reactor: on a trade page it is the page's own presence (it also speaks); on the home, a second stage ----
  function reactor(state) {
    mood = state;
    if (canvas && canvas.id === "hero-presence") { if (window.JarvisPresence && window.JarvisPresence.mood) window.JarvisPresence.mood(state); return; }
    if (stage) stage.set(state);
  }
  function startStage() { if (!stage && canvas && canvas.id !== "hero-presence" && window.JarvisStage) { stage = window.JarvisStage(canvas); stage.set(mood); } }
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) startStage();
      bench.classList.toggle("of-paused", !inView);
    }, { rootMargin: "200px 0px" }).observe(bench);
  } else { inView = true; startStage(); }

  // ---- The requests ----
  var read = function (li) {
    return { kind: li.getAttribute("data-of-kind") || "documento", ask: (li.querySelector(".of-ask") || li).textContent.trim(), get: ((li.querySelector(".of-get") || {}).textContent || "").trim() };
  };
  var DEFAULT = Array.prototype.map.call(list.querySelectorAll("li"), read);
  var DEFAULT_WHO = who ? who.innerHTML : "";
  var requests = DEFAULT, buttons = [], current = -1;

  function renderList() {
    list.innerHTML = "";
    buttons = requests.map(function (req, i) {
      var li = el("li"), b = el("button", "of-req");
      b.type = "button"; b.setAttribute("aria-pressed", "false");
      b.appendChild(el("span", "of-ask", req.ask));
      if (req.get) b.appendChild(el("span", "of-get", req.get));
      b.addEventListener("click", function () { run(i, true); });
      li.appendChild(b); list.appendChild(li);
      return b;
    });
  }

  // ---- The deliveries ----
  function holo(title, kind) {
    var box = el("div", "holo"), head = el("div", "holo-head");
    head.appendChild(el("p", "holo-title", title));
    if (kind) head.appendChild(el("span", "holo-kind", kind));
    box.appendChild(head);
    return box;
  }
  function lines(box, rows) {
    var ul = el("ul", "holo-lines");
    rows.forEach(function (row, i) {
      var li = el("li", row[2] || null); li.style.setProperty("--i", i);
      li.appendChild(el("span", null, row[0])); if (row[1]) li.appendChild(el("span", null, row[1]));
      ul.appendChild(li);
    });
    box.appendChild(ul);
    return rows.length;
  }
  function qr(seed) {
    var box = el("div", "qr"); box.setAttribute("aria-hidden", "true");
    for (var y = 0; y < 9; y++) for (var x = 0; x < 9; x++) {
      var corner = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
      var ring = corner && !((x % 6 === 1) && (y % 6 === 1)) ? true : false;
      var n = Math.sin((x * 31 + y * 17 + seed) * 12.9898) * 43758.5453;
      var on = corner ? ring : (n - Math.floor(n)) > 0.5;
      box.appendChild(el("i", on ? "on" : null));
    }
    return box;
  }
  var BUILD = {
    preventivo: function () {
      var box = holo("Preventivo · Famiglia Rossi", "PDF e Word");
      var n = lines(box, [["Demolizione e smaltimento", "dal tuo listino"], ["Impianto idraulico", "dal tuo listino"], ["Rivestimenti e sanitari", "dal tuo listino"], ["Consegna", "entro marzo", "total"]]);
      var meta = el("p", "holo-meta", "Bozza da controllare: i prezzi sono quelli del tuo listino."); meta.style.setProperty("--i", n); meta.className += " holo-body";
      box.appendChild(meta);
      return { box: box, steps: n + 1, q: "Mando il preventivo ai Rossi?", yes: "Nell'app partirebbe adesso, come allegato alla tua email. Qui è un esempio: non esce niente." };
    },
    email: function () {
      var box = holo("Risposta a Laura Bianchi", "Email");
      var a = el("p", "holo-body", "Gentile Laura, grazie del messaggio."); a.style.setProperty("--i", 0);
      var b = el("p", "holo-body", "Ci vediamo giovedì alle 10 in studio: le mando l'invito."); b.style.setProperty("--i", 1);
      var inv = el("p", "invite"); inv.style.setProperty("--i", 2);
      inv.appendChild(el("b", null, "Giovedì, ore 10")); inv.appendChild(el("span", null, "Invito in calendario per Laura Bianchi"));
      box.appendChild(a); box.appendChild(b); box.appendChild(inv);
      return { box: box, steps: 3, q: "Mando la risposta e l'invito a Laura?", yes: "Nell'app partirebbero adesso, dalla tua casella. Qui è un esempio: non esce niente." };
    },
    sito: function () {
      var box = holo("Trattoria Da Nino", "Anteprima");
      var row = el("div", "holo-site"); row.style.setProperty("--i", 0);
      var site = el("div", "mini-site"); site.setAttribute("aria-hidden", "true");
      site.appendChild(el("b", null, "Trattoria Da Nino")); site.appendChild(el("small", null, "Cucina di casa · Il menù"));
      site.appendChild(el("i")); site.appendChild(el("i")); site.appendChild(el("i"));
      row.appendChild(site); row.appendChild(qr(7));
      var meta = el("p", "holo-meta holo-body", "Un link e un QR temporanei: lo apri sul telefono e lo mostri al titolare."); meta.style.setProperty("--i", 1);
      box.appendChild(row); box.appendChild(meta);
      return { box: box, steps: 2, q: "Pubblico il sito della trattoria?", yes: "Nell'app andrebbe online adesso, dove hai scelto. Qui è un esempio: non esce niente." };
    },
    documento: function (req) {
      var text = req.get.replace(/\s+/g, " ").trim().replace(/\.$/, ""), sentences = text.split(/\.\s+(?=[A-ZÀ-Ú])/), first = sentences[0];
      var cut = first.indexOf(", "), title = cut > 8 ? first.slice(0, cut) : first, rest = cut > 8 ? first.slice(cut + 2) : "";
      var box = holo(title, sentences.some(function (s) { return /^Con (?:il piano )?Max\.?$/.test(s); }) ? "Con il piano Max" : "Bozza");
      var rows = rest ? rest.split(/,\s+|;\s+/).map(function (part) { return [part.charAt(0).toUpperCase() + part.slice(1), ""]; }) : [];
      sentences.slice(1).filter(function (s) { return !/^Con (?:il piano )?Max\.?$/.test(s); }).forEach(function (s) { rows.push([s.replace(/\.$/, ""), ""]); });
      var n = rows.length ? lines(box, rows) : 0;
      var meta = el("p", "holo-meta holo-body", "Bozza da controllare, con fonti e date."); meta.style.setProperty("--i", n);
      box.appendChild(meta);
      return { box: box, steps: n + 1, q: "La bozza è pronta. La approvi?", yes: "Nell'app la trovi nel progetto, e ciò che deve uscire parte solo adesso. Qui è un esempio: non esce niente." };
    },
  };
  function approval(made) {
    var box = el("div", "approve");
    box.setAttribute("role", "group"); box.setAttribute("aria-label", "Aspetta il tuo ok");
    box.appendChild(el("p", "approve-q", made.q));
    box.appendChild(el("p", "approve-why", "Esce solo se dici sì."));
    var actions = el("div", "approve-actions"), yes = el("button", null, "Sì"), no = el("button", null, "No");
    yes.type = no.type = "button";
    var reply = el("p", "approve-reply"); reply.setAttribute("aria-live", "polite");
    function answer(text) { box.classList.add("done"); reply.textContent = text; setState("idle", "Fatto. Tocca un'altra richiesta."); actions.remove(); }
    yes.addEventListener("click", function () { answer(made.yes); });
    no.addEventListener("click", function () { answer("Non esce niente. Nell'app gli diresti cosa cambiare, e la rifà."); });
    actions.appendChild(yes); actions.appendChild(no);
    box.appendChild(actions); box.appendChild(reply);
    return box;
  }

  function setState(state, text) {
    bench.setAttribute("data-state", state);
    if (status) status.textContent = text;
    reactor(state);
  }
  function clear() { timers.forEach(clearTimeout); timers = []; }

  // Request i: composed at once (arrival, reduced motion, off screen) or worked on and delivered (after a click).
  function run(i, animate) {
    if (!requests[i]) return;
    clear(); current = i;
    buttons.forEach(function (b, n) { b.setAttribute("aria-pressed", n === i ? "true" : "false"); });
    var req = requests[i], made = (BUILD[req.kind] || BUILD.documento)(req), ask = approval(made);
    out.classList.remove("of-anim"); out.innerHTML = "";
    var still = !animate || reduced || !inView || document.hidden;
    if (still) {
      out.appendChild(made.box); out.appendChild(ask);
      setState("wait", "Pronto. Aspetta il tuo ok.");
      return;
    }
    setState("think", "Lavora: " + req.ask);
    timers.push(setTimeout(function () {
      var delay = 0.55 + made.steps * 0.16;
      out.style.setProperty("--approve-delay", delay.toFixed(2) + "s");
      void out.offsetWidth; out.classList.add("of-anim");
      out.appendChild(made.box); out.appendChild(ask);
      timers.push(setTimeout(function () { setState("wait", "Pronto. Aspetta il tuo ok."); }, delay * 1000));
    }, 1300));
  }

  renderList();
  run(0, false);

  window.JarvisOfficina = {
    // The chosen trade's first three works (docs/mestieri.js: data.fa); returns the buttons, to light while it is said.
    mestiere: function (data) {
      if (!data || !data.fa) return [];
      requests = data.fa.slice(0, 3).map(function (pair) { return { kind: "documento", ask: pair[0], get: pair[1] }; });
      if (who) { who.innerHTML = ""; who.appendChild(document.createTextNode("Tre lavori di ")); who.appendChild(el("b", null, "Jarvis " + data.nome)); who.appendChild(document.createTextNode(". Toccane uno: lo prepara, poi aspetta il tuo ok.")); }
      renderList(); run(0, false);
      return buttons.slice();
    },
    reset: function () { requests = DEFAULT; if (who) who.innerHTML = DEFAULT_WHO; renderList(); run(0, false); },
    // While the voice says work i (the visitor pressed play): the same motion as a click, once per work.
    show: function (i, start) { if (i >= 0 && (start || i !== current)) run(i, true); },
    items: function () { return buttons.slice(); },
  };
})();
