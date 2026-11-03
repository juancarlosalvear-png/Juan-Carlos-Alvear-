export default {
  layout: "layouts/publicacion.njk",
  tipo: "publicacion",
  permalink: (data) => `/publicaciones/${data.page.fileSlug}/`,
};
