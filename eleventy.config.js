// Configuración del sitio — Eleventy 3
// Compila el contenido de /src en /_site. GitHub Actions publica /_site en GitHub Pages.
import fs from "node:fs";
import path from "node:path";
import { HtmlBasePlugin } from "@11ty/eleventy";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const FORMATOS = {
  pdf: "PDF", doc: "Word", docx: "Word", xls: "Excel", xlsx: "Excel", xlsm: "Excel",
  csv: "CSV", ppt: "PowerPoint", pptx: "PowerPoint", odt: "Texto", ods: "Planilla",
  odp: "Presentación", txt: "Texto", zip: "ZIP", jpg: "Imagen", jpeg: "Imagen",
  png: "Imagen", webp: "Imagen", mp4: "Video",
};

function aFecha(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d) ? null : d;
}

export default function (eleventyConfig) {
  // Rutas relativas correctas tanto con dominio propio como en usuario.github.io/repositorio
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Archivos que se copian sin procesar
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/media");
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // Borradores: una entrada con "borrador: true" no se publica
  eleventyConfig.addPreprocessor("borradores", "*", (data) => {
    if (data.borrador === true) return false;
  });

  // ---------- Colecciones ----------
  const porFecha = (a, b) => (aFecha(b.data.date) || 0) - (aFecha(a.data.date) || 0);
  eleventyConfig.addCollection("publicaciones", (api) =>
    api.getFilteredByGlob("src/publicaciones/*.md").sort(porFecha));
  eleventyConfig.addCollection("proyectos", (api) =>
    api.getFilteredByGlob("src/proyectos/*.md").sort(porFecha));
  eleventyConfig.addCollection("biblioteca", (api) =>
    api.getFilteredByGlob("src/biblioteca/*.md").sort(porFecha));
  eleventyConfig.addCollection("conocimiento", (api) =>
    api.getFilteredByGlob("src/conocimiento/*.md")
      .sort((a, b) => (a.data.orden ?? 99) - (b.data.orden ?? 99) || a.data.title.localeCompare(b.data.title, "es")));

  // ---------- Filtros ----------
  eleventyConfig.addFilter("fechaLarga", (v) => {
    const d = aFecha(v); if (!d) return "";
    return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("fechaCorta", (v) => {
    const d = aFecha(v); if (!d) return "";
    return `${String(d.getUTCDate()).padStart(2, "0")}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${d.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("fechaISO", (v) => { const d = aFecha(v); return d ? d.toISOString().slice(0, 10) : ""; });
  eleventyConfig.addFilter("anio", (v) => { const d = aFecha(v); return d ? d.getUTCFullYear() : ""; });

  // Formato y tamaño de un archivo de la biblioteca, calculados automáticamente
  eleventyConfig.addFilter("formatoArchivo", (ruta) => {
    if (!ruta) return "Enlace";
    const ext = path.extname(String(ruta)).slice(1).toLowerCase();
    return FORMATOS[ext] || ext.toUpperCase() || "Archivo";
  });
  eleventyConfig.addFilter("extension", (ruta) =>
    ruta ? path.extname(String(ruta)).slice(1).toLowerCase() : "");
  eleventyConfig.addFilter("tamanoArchivo", (ruta) => {
    if (!ruta || /^https?:/i.test(ruta)) return "";
    try {
      const bytes = fs.statSync(path.join("src", decodeURI(String(ruta)))).size;
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
      return `${(bytes / 1048576).toFixed(1).replace(".", ",")} MB`;
    } catch { return ""; }
  });

  eleventyConfig.addFilter("formatos", (items) =>
    [...new Set((items || []).map((i) => i.data.archivo
      ? (FORMATOS[path.extname(String(i.data.archivo)).slice(1).toLowerCase()] || path.extname(String(i.data.archivo)).slice(1).toUpperCase())
      : "Enlace externo"))].sort((a, b) => a.localeCompare(b, "es")));
  eleventyConfig.addFilter("limitar", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("categorias", (items, campo = "categoria") =>
    [...new Set((items || []).map((i) => i.data[campo]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")));
  eleventyConfig.addFilter("destacados", (items) => (items || []).filter((i) => i.data.destacado));
  eleventyConfig.addFilter("textoPlano", (html) =>
    String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  eleventyConfig.addFilter("minimoLectura", (html) => {
    const palabras = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(palabras / 200));
  });
  eleventyConfig.addFilter("urlAbsoluta", (ruta, base) => {
    try { return new URL(ruta, base).href; } catch { return ruta; }
  });
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: false, // el texto de las publicaciones se trata como texto, no como código
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md"],
  };
}
