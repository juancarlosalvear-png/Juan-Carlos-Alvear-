# Guía de publicación y administración del sitio

**Sitio web profesional de Juan Carlos Alvear Sepúlveda**

Esta guía explica, paso a paso, cómo poner el sitio en Internet y cómo mantenerlo actualizado sin depender de un desarrollador.

---

## 1. Cómo funciona el sitio

| Componente | Servicio | Costo | Función |
|---|---|---|---|
| Código y contenidos | GitHub (repositorio) | Gratuito | Guarda todos los textos, documentos e imágenes, con historial completo de cambios (respaldo automático). |
| Alojamiento | GitHub Pages | Gratuito | Publica el sitio en Internet con HTTPS. |
| Panel de administración | Pages CMS (app.pagescms.org) | Gratuito | Formularios web para crear y editar publicaciones, subir documentos y modificar datos. |
| Formulario de contacto | FormSubmit (o Web3Forms) | Gratuito | Envía los mensajes del formulario a su correo, con protección contra spam. |
| Dominio | NIC Chile | Pago anual de NIC Chile | Dirección propia, por ejemplo `juancarlosalvear.cl`. |

Cada vez que usted guarda un cambio en el panel, GitHub compila y publica automáticamente el sitio en uno o dos minutos.

**Por qué esta arquitectura:** las páginas son archivos ya preparados. No hay servidor ni base de datos que mantener o que puedan ser atacados, el sitio carga muy rápido y el costo es nulo. El acceso al panel usa su cuenta GitHub (con verificación en dos pasos), así que no se almacenan contraseñas en el sitio.

---

## 2. Publicación inicial (se hace una sola vez)

### 2.1 Crear el repositorio en GitHub
1. Ingrese a <https://github.com> con su cuenta y active la **verificación en dos pasos** (*Settings → Password and authentication*).
2. Pulse **New repository**. Use como nombre, por ejemplo, `sitio-web`. Puede ser **público** o **privado**: GitHub Pages en repositorios privados requiere un plan pagado de GitHub.
3. En el repositorio vacío, pulse **uploading an existing file**, arrastre **todo el contenido** de la carpeta del sitio (incluidas las carpetas `.github` y el archivo `.pages.yml`) y pulse **Commit changes**.
   > Si el navegador no permite arrastrar carpetas ocultas (las que empiezan con punto), use la aplicación **GitHub Desktop** para subir la carpeta completa.

### 2.2 Activar GitHub Pages
1. En el repositorio: **Settings → Pages**.
2. En **Source**, elija **GitHub Actions**.
3. Vaya a la pestaña **Actions**. Verá el proceso **Publicar sitio** en ejecución. Al terminar (marca verde), el sitio estará disponible en `https://SU-USUARIO.github.io/sitio-web/`.

### 2.3 Conectar su dominio .cl
1. En NIC Chile, en la administración de su dominio, configure los servidores DNS de su proveedor o los registros que corresponda:
   - Para `www.juancarlosalvear.cl`: un registro **CNAME** que apunte a `SU-USUARIO.github.io`.
   - Para el dominio sin `www`: cuatro registros **A** que apunten a `185.199.108.153`, `185.199.109.153`, `185.199.110.153` y `185.199.111.153`.
   (Verifique estos valores en la documentación oficial de GitHub: *“Managing a custom domain for your GitHub Pages site”*.)
2. En el repositorio, cree el archivo `src/static/CNAME` con una sola línea: `www.juancarlosalvear.cl`.
3. En **Settings → Pages → Custom domain**, escriba el mismo dominio y active **Enforce HTTPS** cuando esté disponible.
4. En el panel, en **Datos generales del sitio**, actualice el campo **Dirección del sitio**.

El flujo de publicación detecta el archivo `CNAME` y ajusta automáticamente todas las direcciones, el mapa del sitio y los metadatos.

### 2.4 Activar el formulario de contacto
El formulario usa **FormSubmit**, que no requiere registro:
1. Ya publicado el sitio, envíe un mensaje de prueba desde la página **Contacto**.
2. Recibirá en `juancarlosalvear@gmail.com` un correo de FormSubmit que pide **confirmar** el formulario. Pulse el enlace.
3. Desde ese momento, todos los mensajes llegarán a su correo. Incluye verificación antispam (captcha) y un campo trampa para robots.

**Alternativa (Web3Forms):** si prefiere este servicio, obtenga una clave gratuita en <https://web3forms.com> con su correo. En el panel, en *Datos generales → Formulario de contacto*, elija `web3forms` y pegue la clave.

---

## 3. Uso del panel de administración (Pages CMS)

**Ingreso:** <https://app.pagescms.org> → *Sign in with GitHub* → la primera vez, autorice la aplicación (*Install*) **solo para el repositorio del sitio** → abra el repositorio.

Solo pueden editar las personas con acceso de escritura al repositorio. Usted controla esos permisos en *Settings → Collaborators* de GitHub.

### 3.1 Publicar un artículo
1. Menú **Publicaciones → Add an entry**.
2. Complete los campos: **Título**, **Bajada o resumen**, **Fecha**, **Categoría**, **Imagen de portada** (opcional) y **Contenido**. El editor permite títulos, listas, negritas, enlaces, tablas e imágenes.
3. En **Referencias y fuentes**, agregue cada fuente con su texto y su enlace.
4. Si aún no desea publicarlo, marque **Borrador**.
5. Pulse **Save**. En uno o dos minutos el artículo aparecerá en el sitio y en *Últimos artículos* de la portada.

### 3.2 Subir un documento a la biblioteca
1. Menú **Biblioteca digital → Add an entry**.
2. Escriba el **Nombre**, la **Descripción** y la **Categoría**, y suba el **Archivo**. Se aceptan PDF, Word, Excel, PowerPoint, CSV, ODT y ZIP.
3. El sitio calcula automáticamente el **formato** y el **tamaño** del archivo.
4. Marque **Mostrar en la portada** si desea destacarlo.

> Recomendación: use archivos de menos de 25 MB. GitHub rechaza archivos de más de 100 MB.

### 3.3 Centro de conocimiento
Menú **Centro de conocimiento → Add an entry**. Indique título, materia, tipo, fuente y **enlace a la fuente oficial**, o suba un archivo. Use el campo **Orden** para definir la posición.

### 3.4 Proyectos
Menú **Proyectos**. Cada ficha tiene objetivo, contexto, participación, resultados verificables, datos de dimensión, fotografías y documentos complementarios.

### 3.5 Trayectoria, áreas y datos generales
- **Trayectoria profesional:** agregue o modifique cargos. El primero de la lista se muestra como cargo actual.
- **Áreas de especialización:** título, ícono, descripción y respaldo.
- **Datos generales del sitio:** nombre, cargo actual, correo, LinkedIn, otros perfiles, **fotografía profesional**, currículum público, formulario y códigos de Google.

### 3.6 Incorporar su fotografía
En **Datos generales del sitio → Fotografía profesional**, suba una imagen vertical (proporción 4:5, al menos 800 × 1000 píxeles, en JPG o WebP). Reemplazará automáticamente el monograma de la portada y de *Sobre mí*.

### 3.7 Eliminar o corregir contenido
Abra la entrada y use **Delete** o edite y guarde. Todo cambio queda registrado. Si se equivoca, en GitHub (*Commits*) puede ver y recuperar cualquier versión anterior.

---

## 4. Buscadores y estadísticas

### Google Search Console
1. Ingrese a <https://search.google.com/search-console> y agregue su dominio como **propiedad con prefijo de URL**.
2. Elija el método **etiqueta HTML** y copie solo el valor de `content="…"`.
3. Péguelo en el panel, en **Datos generales → Código de verificación de Google Search Console**, y guarde.
4. Vuelva a Search Console, pulse **Verificar** y, en **Sitemaps**, envíe `sitemap.xml`.

### Google Analytics 4 (opcional)
Cree una propiedad en <https://analytics.google.com>, copie el **ID de medición** (`G-XXXXXXX`) y péguelo en **Datos generales → ID de Google Analytics 4**. Si el campo queda vacío, el sitio no carga ningún código de seguimiento.

### Qué ya está implementado
Títulos y descripciones por página, URLs claras, estructura semántica, metadatos Open Graph para LinkedIn y WhatsApp, imagen social, datos estructurados (*schema.org Person* y *Article*), `sitemap.xml`, `robots.txt` y dirección canónica.

---

## 5. Seguridad y privacidad: buenas prácticas

- Mantenga activa la verificación en dos pasos de GitHub. Es la única llave del panel.
- No publique documentos institucionales internos, datos de terceros, RUT, domicilios ni información reservada.
- El currículum publicado es una **versión pública** sin RUT, domicilio ni teléfono. Si actualiza su CV, suba una versión con esos datos eliminados.
- El sitio aplica una política de seguridad de contenidos (CSP) que solo permite recursos propios y los servicios autorizados.
- El sitio no usa variables de entorno ni claves secretas. La clave de Web3Forms es pública por diseño y está limitada a su correo.

---

## 6. Alojamiento alternativo (Netlify o Vercel)
El proyecto incluye `netlify.toml` y `vercel.json`. Para usar esas plataformas, importe el repositorio desde su panel. Las instrucciones de compilación se detectan automáticamente y el panel Pages CMS sigue funcionando igual. En ese caso, defina la variable `SITE_URL` con la dirección del sitio, o actualice el campo **Dirección del sitio**.

---

## 7. Estructura de carpetas (referencia técnica)

```
.pages.yml                 Configuración del panel de administración
.github/workflows/         Publicación automática en GitHub Pages
eleventy.config.js         Configuración del generador (Eleventy 3)
src/_data/                 Datos: site.json, trayectoria.json, areas.json, formacion.json
src/publicaciones/         Artículos (un archivo .md por artículo)
src/biblioteca/            Fichas de documentos
src/conocimiento/          Fichas del centro de conocimiento
src/proyectos/             Fichas de proyectos
src/media/documentos/      Archivos descargables
src/media/imagenes/        Fotografías e imágenes
src/assets/                Estilos, tipografías, scripts y logotipos
```

Para revisar el sitio en su computador (opcional): instale Node.js 22 y ejecute `npm install` y luego `npm run serve` en la carpeta del proyecto.
