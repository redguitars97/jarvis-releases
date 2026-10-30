// The home's welcome, the site's onboarding: after one click («Entra con la voce di Jarvis» or «Preferisco leggere»)
// Jarvis greets, asks «Che lavoro fai?», and the visitor answers with a tap or a few typed words. The answer is matched
// on the visitor's computer (trova.js) to a trade, a family of work, a life situation, a job the app would learn or a
// friendly «dimmi in due parole»; then Jarvis says what it would deliver, what it never does, and leads to the plan
// and the free trial. Voice and captions from voce.js; the same words as text without audio. The answer is remembered
// in this browser only (localStorage), to greet the visitor with it next time; nothing is sent anywhere. No
// microphone: the real spoken conversation is in the app. Without JavaScript the hero simply links to the trades.
(function () {
  var box = document.getElementById("benvenuto");
  if (!box || !window.JarvisVoce || !window.JarvisTrova || !window.JARVIS_MESTIERI || !window.JARVIS_VOCE_TESTI) return;
  var M = window.JARVIS_MESTIERI, T = window.JARVIS_VOCE_TESTI, trova = window.JarvisTrova(M, T);
  var site = window.JARVIS_SITE || {}, KEY = "jarvis-benvenuto";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel) { return box.querySelector(sel); };
  var gate = $(".wl-gate"), ask = $("[data-wl='domanda']"), out = $("[data-wl='esito']"), voiceBox = $("[data-voce]");
  var form = $(".wl-form"), input = $("#wl-input"), intro = $(".wl-intro"), hint = $(".wl-hint");
  var voice = false, last = null, highlight = [];
  var read = function () { try { return JSON.parse(window.localStorage.getItem(KEY) || "null"); } catch (e) { return null; } };
  var write = function (value) { try { window.localStorage.setItem(KEY, JSON.stringify(value)); } catch (e) { /* private window: not remembered */ } };
  var clipText = function (id) { var c = JarvisVoce.clip(id); return c ? c.sentences : []; };
  var el = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  var panel = JarvisVoce.panel(voiceBox, {
    onSentence: function (clip, index) { highlight.forEach(function (item) { item.el.classList.toggle("now", item.clip === clip.id && item.index.indexOf(index) >= 0); }); },
    onEnd: function () { highlight.forEach(function (item) { item.el.classList.remove("now"); }); },
    onMute: function () { setVoice(false); },
  });
  function setVoice(on) {
    voice = on;
    box.classList.toggle("wl-voice", on);
    var stored = read() || {};
    stored.voce = on; write(stored);
    if (!on) voiceBox.hidden = true;
  }
  function speak(ids) { if (voice) panel.say(ids); else panel.stop(); }
  function focus(target) { if (target) { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); } }
  function into(view) { if (view.getBoundingClientRect().top < 0 || view.getBoundingClientRect().top > window.innerHeight * 0.6) view.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); }

  // ---- The question: the trades first, then all of them by group, the families, and «non è un lavoro» ----
  function chip(label, onPick, cls) {
    var b = el("button", "wl-chip" + (cls ? " " + cls : ""), label);
    b.type = "button"; b.addEventListener("click", onPick);
    return b;
  }
  var roleById = {}; M.ruoli.forEach(function (r) { roleById[r.id] = r; });
  var first = $(".wl-chips");
  trova.inPrimoPiano.forEach(function (id) { first.appendChild(chip(roleById[id].chip, function () { choose({ tipo: "mestiere", id: id }, roleById[id].chip); })); });
  var moreButton = chip("Tutti i mestieri", function () {
    var open = more.hidden; more.hidden = !open; moreButton.setAttribute("aria-expanded", String(open));
    if (open) focus(more.querySelector("h3"));
  }, "wl-chip-more");
  moreButton.setAttribute("aria-expanded", "false"); moreButton.setAttribute("aria-controls", "wl-more");
  first.appendChild(moreButton);
  var more = $(".wl-more");
  M.gruppi.forEach(function (g) {
    var list = M.ruoli.filter(function (r) { return r.gruppo === g[0]; });
    if (!list.length) return;
    var group = el("div", "wl-group"); group.appendChild(el("h3", null, g[1]));
    var row = el("div", "wl-row");
    list.forEach(function (r) { row.appendChild(chip(r.chip, function () { choose({ tipo: "mestiere", id: r.id }, r.chip); })); });
    group.appendChild(row); more.appendChild(group);
  });
  var families = T.filter(function (c) { return c.kind === "famiglia"; });
  var fam = el("div", "wl-group"); fam.appendChild(el("h3", null, "Altri lavori"));
  var famRow = el("div", "wl-row");
  families.forEach(function (c) { famRow.appendChild(chip(c.label, function () { choose({ tipo: "famiglia", id: c.id }, c.label); })); });
  fam.appendChild(famRow); more.appendChild(fam);
  var life = $(".wl-life");
  [["v-studio", "Studio"], ["v-casa", "Sto a casa"], ["v-giorni", "Sono in pensione"], ["v-cerco", "Cerco lavoro"]].forEach(function (v) {
    life.appendChild(chip(v[1], function () { choose({ tipo: "vita", id: v[0] }, v[1]); }, "wl-chip-life"));
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value;
    var result;
    try { result = trova(text); } catch (e) { result = { tipo: "aiuto" }; }
    choose(result, text);
  });

  // ---- The answer ----
  function choose(result, said) {
    last = result;
    if (result.tipo === "aiuto") { helpMe(); return; }
    var stored = read() || {}; stored.r = result; write(stored);
    render(result);
    ask.hidden = true; out.hidden = false;
    into(box);
    focus(out.querySelector("h2"));
    speak(clipsFor(result));
    personalise(result);
  }
  function clipsFor(result) {
    if (result.tipo === "mestiere") return ["r-" + result.id, "fine-" + roleById[result.id].piano];
    if (result.tipo === "nuovo") return ["nuovo", "fine-scelta"];
    return [result.id, "fine-pro"];
  }
  // Not understood: one friendly sentence, the same choices, the tour and the trial; never an error, never a loop.
  function helpMe() {
    hint.hidden = false;
    hint.innerHTML = "";
    clipText("aiuto").forEach(function (s) { hint.appendChild(el("p", null, s)); });
    var row = el("div", "actions wl-help");
    row.appendChild(chip("Ascolta cosa so fare", function () { setVoiceIfNeeded(); panel.say(["vantaggi", "fine-scelta"]); }, "wl-chip-tour"));
    var trial = el("a", "button ghost small", "Chiedi la prova gratuita"); trial.href = "#scarica"; JarvisVoce.prova(trial, "");
    row.appendChild(trial);
    hint.appendChild(row);
    if (voice) panel.say(["aiuto"]);
    input.select();
    focus(hint);
  }
  function setVoiceIfNeeded() { if (!voice) setVoice(true); }

  function render(result) {
    out.innerHTML = "";
    highlight = [];
    var head = el("h2", "wl-name");
    var data = result.tipo === "mestiere" ? roleById[result.id] : result.tipo === "nuovo" ? null : trova.dati(result.id);
    if (result.tipo === "mestiere") { head.appendChild(document.createTextNode("Jarvis ")); head.appendChild(el("span", "role-name", data.nome)); }
    else if (result.tipo === "famiglia") { head.appendChild(document.createTextNode("Jarvis per ")); head.appendChild(el("span", "role-name", data.label.charAt(0).toLowerCase() + data.label.slice(1))); }
    else if (result.tipo === "vita") head.appendChild(el("span", "role-name", data.label));
    else { head.appendChild(document.createTextNode("Il tuo mestiere: ")); head.appendChild(el("span", "role-name", "«" + result.etichetta + "»")); }
    out.appendChild(head);

    if (result.tipo === "mestiere") {
      var works = el("ol", "wl-works");
      data.fa.forEach(function (pair, i) {
        var li = el("li"); li.appendChild(el("p", "ask", pair[0])); li.appendChild(el("p", null, pair[1]));
        works.appendChild(li);
        highlight.push({ el: li, clip: "r-" + data.id, index: data.quale.reduce(function (acc, w, k) { if (w === i) acc.push(k); return acc; }, []) });
      });
      out.appendChild(works);
      if (data.mai) {
        var never = el("p", "wl-never"); never.appendChild(el("b", null, "Mai")); never.appendChild(document.createTextNode(" " + data.mai + "."));
        out.appendChild(never);
        highlight.push({ el: never, clip: "r-" + data.id, index: [data.frasi.length - 1] });
      }
    } else {
      var id = result.tipo === "nuovo" ? "nuovo" : result.id, lines = el("ul", "wl-lines");
      clipText(id).forEach(function (s, k) { var li = el("li", null, s); lines.appendChild(li); highlight.push({ el: li, clip: id, index: [k] }); });
      out.appendChild(lines);
    }
    if (result.anche) {
      var also = trova.dati(result.anche.id) || roleById[result.anche.id], word = data.poi || "E per il tuo lavoro";
      var name = result.anche.tipo === "mestiere" ? "Jarvis " + also.nome : "Jarvis per " + also.label.charAt(0).toLowerCase() + also.label.slice(1);
      var p = el("p", "wl-also"); p.appendChild(document.createTextNode(word + ": "));
      p.appendChild(chip(name, function () { choose(result.anche, name); }));
      out.appendChild(p);
    }
    out.appendChild(plan(result, data));
    var foot = el("div", "wl-foot");
    foot.appendChild(chip(voice ? "Riascolta" : "Ascolta con la voce di Jarvis", function () { setVoice(true); speak(clipsFor(result)); }));
    foot.appendChild(chip("Cambia risposta", function () { panel.stop(); out.hidden = true; ask.hidden = false; hint.hidden = true; input.value = ""; focus(ask.querySelector("h2")); }));
    out.appendChild(foot);
    out.appendChild(extra());
  }

  // The plan, the price from config.js, the trial and the right page: one clear next step.
  function plan(result, data) {
    var card = el("div", "wl-plan");
    var which = result.tipo === "mestiere" ? data.piano : result.tipo === "nuovo" ? null : "pro";
    var prices = site.prices || {};
    var title = el("p", "wl-plan-name");
    if (which) {
      title.appendChild(document.createTextNode("Il piano per te: "));
      title.appendChild(el("b", null, which === "max" ? "Max" : "Pro"));
      if (prices[which]) title.appendChild(el("span", "wl-price", JarvisVoce.euro(prices[which]) + " una tantum"));
    } else {
      title.appendChild(document.createTextNode("Pro o Max"));
      if (prices.pro && prices.max) title.appendChild(el("span", "wl-price", JarvisVoce.euro(prices.pro) + " o " + JarvisVoce.euro(prices.max) + " una tantum"));
    }
    card.appendChild(title);
    var why = result.tipo === "mestiere" ? data.motivo
      : which ? "Per un'attività principale, o per te, basta Pro: 1 progetto, la squadra di 9 persone e 3 caselle email. Se poi segui più clienti, passi a Max pagando solo la differenza."
      : "Pro per un'attività principale; Max se segui più clienti, sviluppi software o fai campagne.";
    card.appendChild(el("p", null, why));
    card.appendChild(el("p", "wl-privacy", "I tuoi documenti restano sul tuo computer, e niente esce senza il tuo ok."));
    var actions = el("div", "actions");
    var trial = el("a", "button", "Chiedi la prova gratuita di 14 giorni");
    trial.href = "#scarica";
    JarvisVoce.prova(trial, result.tipo === "mestiere" ? data.chip : result.tipo === "nuovo" ? result.etichetta : data.label);
    actions.appendChild(trial);
    if (result.tipo === "mestiere") { var page = el("a", "button ghost", "La pagina di Jarvis " + data.nome); page.href = "per/" + data.id + ".html"; actions.appendChild(page); }
    else { var how = el("a", "button ghost", "Come diventa il tuo esperto"); how.href = "per/index.html#il-tuo"; actions.appendChild(how); }
    card.appendChild(actions);
    card.appendChild(el("p", "fine", "La prova è il piano Max completo, con i tuoi abbonamenti. Alla fine scegli Pro o Max e ritrovi tutto com'era."));
    if (data && data.pagine && data.pagine.length) {
      var near = el("p", "fine"); near.appendChild(document.createTextNode("Mestieri vicini, già pronti: "));
      data.pagine.forEach(function (id, i) { var a = el("a", null, roleById[id] ? roleById[id].chip : id); a.href = "per/" + id + ".html"; if (i) near.appendChild(document.createTextNode(", ")); near.appendChild(a); });
      card.appendChild(near);
    }
    return card;
  }
  // «Vuoi sapere altro?»: the short explanations, in the same voice or as text.
  function extra() {
    var wrap = el("div", "wl-extra");
    wrap.appendChild(el("p", "wl-extra-title", "Vuoi sapere altro?"));
    var row = el("div", "wl-row");
    [["vantaggi", "Perché Jarvis"], ["esempi", "Guardalo lavorare"], ["privacy", "Privacy"], ["come", "Come si installa"], ["prezzi", "Prezzi e licenza"], ["domande", "Domande"]].forEach(function (p) {
      row.appendChild(chip(p[1], function () {
        if (voice) panel.say([p[0]]);
        else { var c = JarvisVoce.clip(p[0]); text.innerHTML = ""; if (c) c.sentences.forEach(function (s) { text.appendChild(el("p", null, s)); }); text.hidden = false; focus(text); }
      }));
    });
    var text = el("div", "wl-extra-text"); text.hidden = true;
    wrap.appendChild(row); wrap.appendChild(text);
    return wrap;
  }

  // The answer known: the price note in «Pro e Max» speaks to the visitor's work.
  function personalise(result) {
    var note = document.getElementById("per-te");
    if (!note) return;
    var data = result.tipo === "mestiere" ? roleById[result.id] : result.tipo === "nuovo" ? null : trova.dati(result.id);
    if (!data) { note.hidden = true; return; }
    var name = result.tipo === "mestiere" ? "Jarvis " + data.nome : data.label;
    note.textContent = "Per te (" + name + "): " + (result.tipo === "mestiere" && data.piano === "max" ? "Max." : "Pro.") + " ";
    var link = el("a", null, "Rivedi la risposta"); link.href = "#inizio"; note.appendChild(link);
    note.hidden = false;
  }

  // ---- Entering ----
  function start(withVoice) {
    setVoice(withVoice);
    gate.hidden = true; ask.hidden = false;
    var hero = box.closest(".hero"); if (hero) hero.classList.add("wl-on");
    intro.innerHTML = "";
    if (!withVoice) clipText("saluto").forEach(function (s) { intro.appendChild(el("p", null, s)); });
    intro.hidden = withVoice;
    focus(ask.querySelector("h2"));
    into(box);
    if (withVoice) panel.say(["saluto"]);
  }
  box.querySelector("[data-wl-voce]").addEventListener("click", function () { start(true); });
  box.querySelector("[data-wl-leggi]").addEventListener("click", function () { start(false); });

  box.classList.add("wl-live");
  var nojs = $(".wl-nojs"); if (nojs) nojs.hidden = true;
  var stored = read();
  var valid = stored && stored.r && (stored.r.tipo === "mestiere" ? roleById[stored.r.id] : stored.r.tipo === "nuovo" ? !!stored.r.etichetta : trova.dati(stored.r.id));
  if (valid) {
    // Back again: the answer of last time, silent until a click.
    voice = false;
    gate.hidden = true; ask.hidden = true; out.hidden = false;
    box.closest(".hero").classList.add("wl-on");
    var welcome = $(".wl-back"); if (welcome) welcome.hidden = false;
    render(stored.r);
    personalise(stored.r);
  } else gate.hidden = false;
})();
