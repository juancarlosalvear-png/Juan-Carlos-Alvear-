export default {
  layout: "layouts/prensa.njk",
  tipo: "prensa",
  permalink: (data) => `/en-la-prensa/${data.page.fileSlug}/`,
};
