// The "martedì qualsiasi" conversation plays line by line the first time it scrolls into view.
(function () {
  var script = document.getElementById("script");
  if (!script || !("IntersectionObserver" in window)) return;
  script.classList.add("armed");
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      script.classList.add("play");
      seen.disconnect();
    });
  }, { threshold: 0.35 });
  seen.observe(script);
})();
