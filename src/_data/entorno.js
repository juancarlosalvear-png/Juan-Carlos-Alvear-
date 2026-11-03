// Dirección pública del sitio. En GitHub la calcula automáticamente el flujo de publicación;
// localmente se usa el campo "url" de site.json.
import fs from "node:fs";

export default function () {
  let url = process.env.SITE_URL;
  if (!url) {
    try { url = JSON.parse(fs.readFileSync("src/_data/site.json", "utf8")).url; } catch { url = ""; }
  }
  return {
    url: String(url || "").replace(/\/+$/, ""),
    anio: new Date().getFullYear(),
    compilado: new Date().toISOString(),
  };
}
