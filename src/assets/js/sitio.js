// Funciones del sitio: menú móvil, filtros de búsqueda, copiar enlace y animaciones discretas.
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", function () {
    // ---- Menú móvil ----
    var boton = document.querySelector("[data-menu-boton]");
    var menu = document.querySelector("[data-menu]");
    if (boton && menu) {
      boton.addEventListener("click", function () {
        var abierto = boton.getAttribute("aria-expanded") === "true";
        boton.setAttribute("aria-expanded", String(!abierto));
        menu.classList.toggle("abierto", !abierto);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.classList.contains("abierto")) {
          boton.setAttribute("aria-expanded", "false");
          menu.classList.remove("abierto");
          boton.focus();
        }
      });
    }

    // ---- Filtros (publicaciones, biblioteca, conocimiento) ----
    var normalizar = function (t) {
      return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    };
    document.querySelectorAll("[data-filtro-lista]").forEach(function (lista) {
      var texto = lista.querySelector("[data-filtro-texto]");
      var chips = lista.querySelectorAll("[data-filtro-categoria]");
      var formato = lista.querySelector("[data-filtro-formato]");
      var estado = lista.querySelector("[data-filtro-estado]");
      var sinResultados = lista.querySelector("[data-sin-resultados]");
      var items = lista.querySelectorAll("[data-item]");
      var grupos = lista.querySelectorAll("[data-grupo]");
      var categoria = "";

      // Permite enlazar a una categoría: ?categoria=Normativa
      var params = new URLSearchParams(location.search);
      if (params.get("categoria")) categoria = params.get("categoria");
      if (params.get("q") && texto) texto.value = params.get("q");

      function aplicar() {
        var q = normalizar(texto ? texto.value.trim() : "");
        var f = formato ? formato.value : "";
        var visibles = 0;
        items.forEach(function (it) {
          var ok = (!categoria || it.dataset.categoria === categoria) &&
                   (!f || it.dataset.formato === f) &&
                   (!q || normalizar(it.dataset.texto).indexOf(q) !== -1);
          it.hidden = !ok;
          if (ok) visibles++;
        });
        grupos.forEach(function (g) { g.hidden = !g.querySelector("[data-item]:not([hidden])"); });
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.filtroCategoria === categoria)); });
        if (sinResultados) sinResultados.hidden = visibles !== 0;
        if (estado) {
          var filtrado = q || categoria || f;
          estado.textContent = filtrado ? visibles + (visibles === 1 ? " resultado" : " resultados") : "";
        }
      }
      if (texto) texto.addEventListener("input", aplicar);
      if (formato) formato.addEventListener("change", aplicar);
      chips.forEach(function (c) {
        c.addEventListener("click", function () { categoria = c.dataset.filtroCategoria; aplicar(); });
      });
      aplicar();
    });

    // ---- Copiar enlace ----
    document.querySelectorAll("[data-copiar]").forEach(function (b) {
      b.addEventListener("click", function () {
        var aviso = document.querySelector("[data-copiar-aviso]");
        var url = b.getAttribute("data-copiar");
        var listo = function () { if (aviso) { aviso.textContent = "Enlace copiado"; setTimeout(function () { aviso.textContent = ""; }, 2500); } };
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(listo, function () { prompt("Copie el enlace:", url); });
        else prompt("Copie el enlace:", url);
      });
    });

    // ---- Formulario: evita envíos dobles ----
    document.querySelectorAll("[data-formulario]").forEach(function (form) {
      form.addEventListener("submit", function () {
        var b = form.querySelector("[type=submit]");
        if (b) { b.disabled = true; b.textContent = "Enviando…"; }
      });
    });

    // ---- Animaciones discretas al desplazarse ----
    var elementos = document.querySelectorAll(".revelar");
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -8% 0px" });
      elementos.forEach(function (el) { obs.observe(el); });
    } else {
      elementos.forEach(function (el) { el.classList.add("visible"); });
    }
  });
})();
