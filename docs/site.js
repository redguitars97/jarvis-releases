// The conversation that plays when scrolled into view, and the values from config.js (prices, update period,
// contacts, demo link): anything not filled in stays hidden or keeps its generic wording.
(function () {
  var script = document.getElementById("script");
  if (script && "IntersectionObserver" in window) {
    script.classList.add("armed");
    var seen = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      script.classList.add("play"); seen.disconnect();
    }, { threshold: 0.35 });
    seen.observe(script);
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
      a.href = item[2]; a.textContent = item[1]; li.appendChild(a); list.appendChild(li);
    });
    document.getElementById("contatti").hidden = false;
    var nav = document.querySelector(".top nav"), contact = document.createElement("a");
    contact.href = "#contatti"; contact.textContent = "Contatti"; nav.appendChild(contact);
  }
})();
