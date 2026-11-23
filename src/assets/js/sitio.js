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


    // ---- Visor ampliable de recortes y páginas ----
    var enlacesVisor = document.querySelectorAll("[data-visor]");
    if (enlacesVisor.length) {
      var visor = document.createElement("div");
      visor.className = "visor";
      visor.setAttribute("role", "dialog");
      visor.setAttribute("aria-modal", "true");
      visor.setAttribute("aria-label", "Visor de imágenes");
      visor.innerHTML = '<div class="visor__barra"><p class="visor__leyenda" data-v-leyenda></p><div class="visor__botones">' +
        '<button type="button" class="visor__boton" data-v-ant aria-label="Imagen anterior">‹</button>' +
        '<button type="button" class="visor__boton" data-v-sig aria-label="Imagen siguiente">›</button>' +
        '<button type="button" class="visor__boton" data-v-zoom aria-label="Ampliar o reducir">＋</button>' +
        '<button type="button" class="visor__boton" data-v-cerrar aria-label="Cerrar">✕</button></div></div>' +
        '<div class="visor__escenario"><img class="visor__img" alt="" data-v-img></div>';
      document.body.appendChild(visor);
      var vImg = visor.querySelector("[data-v-img]");
      var vLey = visor.querySelector("[data-v-leyenda]");
      var vAnt = visor.querySelector("[data-v-ant]");
      var vSig = visor.querySelector("[data-v-sig]");
      var vZoom = visor.querySelector("[data-v-zoom]");
      var vCerrar = visor.querySelector("[data-v-cerrar]");
      var grupo = [], indice = 0, origen = null;

      var mostrar = function (i) {
        indice = i;
        var a = grupo[i];
        var interno = a.querySelector("img");
        vImg.src = a.getAttribute("href");
        vImg.alt = interno ? interno.alt : (a.getAttribute("data-leyenda") || "");
        vLey.textContent = a.getAttribute("data-leyenda") || "";
        visor.classList.remove("ampliado");
        vZoom.textContent = "＋";
        vAnt.disabled = i === 0;
        vSig.disabled = i === grupo.length - 1;
        visor.querySelector(".visor__escenario").scrollTop = 0;
      };
      var abrir = function (a) {
        var nombre = a.getAttribute("data-visor-grupo");
        grupo = Array.prototype.filter.call(enlacesVisor, function (x) {
          return x.getAttribute("data-visor-grupo") === nombre && x.getAttribute("href");
        });
        // Evita repetidos dentro del mismo grupo
        var vistos = {};
        grupo = grupo.filter(function (x) { var h = x.getAttribute("href"); if (vistos[h]) return false; vistos[h] = true; return true; });
        var idx = 0;
        grupo.forEach(function (x, n) { if (x.getAttribute("href") === a.getAttribute("href")) idx = n; });
        origen = a;
        visor.classList.add("abierto");
        document.body.classList.add("visor-abierto");
        mostrar(idx);
        vCerrar.focus();
      };
      var cerrar = function () {
        visor.classList.remove("abierto", "ampliado");
        document.body.classList.remove("visor-abierto");
        vImg.removeAttribute("src");
        if (origen) origen.focus();
      };
      var alternarZoom = function () {
        var on = visor.classList.toggle("ampliado");
        vZoom.textContent = on ? "－" : "＋";
      };

      enlacesVisor.forEach(function (a) {
        a.addEventListener("click", function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault();
          abrir(a);
        });
      });
      vCerrar.addEventListener("click", cerrar);
      vAnt.addEventListener("click", function () { if (indice > 0) mostrar(indice - 1); });
      vSig.addEventListener("click", function () { if (indice < grupo.length - 1) mostrar(indice + 1); });
      vZoom.addEventListener("click", alternarZoom);
      vImg.addEventListener("click", alternarZoom);
      visor.addEventListener("click", function (e) { if (e.target === visor || e.target.classList.contains("visor__escenario")) cerrar(); });
      document.addEventListener("keydown", function (e) {
        if (!visor.classList.contains("abierto")) return;
        if (e.key === "Escape") cerrar();
        else if (e.key === "ArrowLeft" && indice > 0) mostrar(indice - 1);
        else if (e.key === "ArrowRight" && indice < grupo.length - 1) mostrar(indice + 1);
        else if (e.key === "Tab") {
          var focos = Array.prototype.filter.call(visor.querySelectorAll("button"), function (b) { return !b.disabled; });
          var primero = focos[0], ultimo = focos[focos.length - 1];
          if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
          else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
        }
      });
    }

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
