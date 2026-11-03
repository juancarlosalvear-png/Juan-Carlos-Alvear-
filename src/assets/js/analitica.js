// Google Analytics 4: se activa solo si se define "google_analytics" en la configuración del sitio.
(function () {
  var s = document.currentScript, id = s && s.getAttribute("data-ga");
  if (!id) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
})();
