// A trade page (docs/per/<id>.html, made by tools/ruoli.mjs): prices from config.js, the trial asked by email with the
// trade written in, and «Ascolta Jarvis …»: the trade said in the app's voice, then the plan and the trial, with the
// captions of what is said. While a work is said, the Officina of the page delivers it (officina.js). The page is
// complete without JavaScript and without audio.
(function () {
  if (!window.JarvisVoce) return;
  JarvisVoce.prices();
  Array.prototype.forEach.call(document.querySelectorAll("[data-prova]"), function (link) { JarvisVoce.prova(link, link.dataset.mestiere); });

  // The catalogue works without JS; search progressively opens just the matching groups.
  var search = document.querySelector("[data-catalogue-search]");
  if (search) {
    search.hidden = false;
    var input = search.querySelector("input"), status = search.querySelector("[data-catalogue-status]");
    var groups = Array.prototype.slice.call(document.querySelectorAll(".role-group"));
    var normalize = function (s) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); };
    input.addEventListener("input", function () {
      var q = normalize(input.value.trim()), count = 0;
      groups.forEach(function (group) {
        var matches = 0;
        Array.prototype.forEach.call(group.querySelectorAll("li"), function (li) {
          var show = normalize(li.textContent).indexOf(q) >= 0;
          li.hidden = !show; if (show) matches++;
        });
        count += matches; group.hidden = matches === 0; group.open = !!q && matches > 0;
      });
      status.textContent = q ? (count ? (count === 1 ? "1 mestiere trovato" : count + " mestieri trovati") : "Nessun mestiere trovato. Torna alla ricerca in home: JARVIS può studiare anche un nuovo mestiere.") : "Scegli una categoria o cerca il tuo mestiere.";
    });
    status.textContent = "Scegli una categoria o cerca il tuo mestiere.";
  }
  document.querySelectorAll(".nav-menu a").forEach(function (link) { link.addEventListener("click", function () { link.closest("details").open = false; }); });
  var dataEl = document.getElementById("voce-mestiere"), play = document.querySelector("[data-voce-play]"), box = document.querySelector("[data-voce]");
  if (!dataEl || !play || !box) return;
  var data;
  try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
  window.JARVIS_MESTIERI = { ruoli: [{ id: data.id, nome: data.nome, frasi: data.frasi }] };
  // The visitor who listens has chosen this trade: the home greets them with it next time.
  var remember = function () { try { window.localStorage.setItem("jarvis-benvenuto", JSON.stringify({ r: { tipo: "mestiere", id: data.id } })); } catch (e) { /* not remembered */ } };
  var officina = window.JarvisOfficina || null;
  var works = officina ? officina.items() : Array.prototype.slice.call(document.querySelectorAll(".asks-3 li"));
  var panel = JarvisVoce.panel(box, {
    onSentence: function (clip, index) {
      var which = clip.id === "r-" + data.id && index >= 0 ? data.quale ? data.quale[index] : -1 : -1;
      works.forEach(function (li, i) { li.classList.toggle("now", i === which); });
      // (each work starts on its «Mi chiedi: …» sentence: the Officina delivers it while it is said)
      if (officina && which >= 0 && which !== (data.quale || [])[index - 1]) officina.show(which, true);
    },
    onEnd: function () { works.forEach(function (li) { li.classList.remove("now"); }); play.hidden = false; },
    onMute: function () { play.hidden = false; },
  });
  play.hidden = false;
  play.addEventListener("click", function () {
    remember();
    play.hidden = true;
    var stage = document.querySelector(".presence-stage, .of-bench");
    if (stage && window.matchMedia("(max-width: 860px)").matches) stage.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    panel.say(["r-" + data.id, "fine-" + data.piano], "../");
    var pause = box.querySelector("[data-voce-pausa]");
    if (pause) pause.focus();
  });
})();
