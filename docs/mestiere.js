// A trade page (docs/per/<id>.html, made by tools/ruoli.mjs): prices from config.js, the trial asked by email with the
// trade written in, and «Ascolta Jarvis …»: the trade said in the app's voice, then the plan and the trial, with the
// captions of what is said. The page is complete without JavaScript and without audio.
(function () {
  if (!window.JarvisVoce) return;
  JarvisVoce.prices();
  Array.prototype.forEach.call(document.querySelectorAll("[data-prova]"), function (link) { JarvisVoce.prova(link, link.dataset.mestiere); });

  var dataEl = document.getElementById("voce-mestiere"), play = document.querySelector("[data-voce-play]"), box = document.querySelector("[data-voce]");
  if (!dataEl || !play || !box) return;
  var data;
  try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
  window.JARVIS_MESTIERI = { ruoli: [{ id: data.id, nome: data.nome, frasi: data.frasi }] };
  // The visitor who listens has chosen this trade: the home greets them with it next time.
  var remember = function () { try { window.localStorage.setItem("jarvis-benvenuto", JSON.stringify({ r: { tipo: "mestiere", id: data.id } })); } catch (e) { /* not remembered */ } };
  var works = Array.prototype.slice.call(document.querySelectorAll(".asks-3 li"));
  var panel = JarvisVoce.panel(box, {
    onSentence: function (clip, index) {
      var which = clip.id === "r-" + data.id && index >= 0 ? data.quale ? data.quale[index] : -1 : -1;
      works.forEach(function (li, i) { li.classList.toggle("now", i === which); });
    },
    onEnd: function () { works.forEach(function (li) { li.classList.remove("now"); }); play.hidden = false; },
    onMute: function () { play.hidden = false; },
  });
  play.hidden = false;
  play.addEventListener("click", function () {
    remember();
    play.hidden = true;
    panel.say(["r-" + data.id, "fine-" + data.piano], "../");
    var pause = box.querySelector("[data-voce-pausa]");
    if (pause) pause.focus();
  });
})();
