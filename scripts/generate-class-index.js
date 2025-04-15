const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

// Utilitaire de slug
const slugify = str => str.normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

// Ordre voulu
const ordreClasses = [
  "Souverain", "Envouteur", "Impérial", "Lansquenet",
  "Mage guerrier", "Moine", "Necromancien", "Shogun",
  "Heraut", "Dragoon", "Vagabond", "Troubadour", "Pistolero"
].map(slugify);

const classesDir = path.join(__dirname, "../output/classes");
const outputPath = path.join(classesDir, "index.html");

const footerPath = path.join(__dirname, "footer.html");
const footerHTML = fs.readFileSync(footerPath, "utf8");

const classFiles = fs.readdirSync(classesDir)
  .filter(f => f.endsWith(".html") && f !== "index.html");

const classCards = [];

for (const file of classFiles) {
  const filePath = path.join(classesDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(content);

  const titre = $("title").text().trim() || file.replace(/\.html$/, "");
  const slug = slugify(titre);
  const desc = $('meta[name="description"]').attr("content") || "Cette classe n'a pas encore de description.";
  const imageName = file.replace(/\.html$/, ".png");
  const imagePath = `../../assets/images/class-icons/${imageName}`;

  classCards.push({
    slug,
    html: `
      <a href="${file}" class="carte-lien class-card" data-nom="${titre.toLowerCase()}" data-description="${desc.toLowerCase()}">
        <img src="${imagePath}" alt="${titre}" class="image class-icon">
        <h2>${titre}</h2>
        <p>${desc}</p>
      </a>`
  });
}

// Tri par ordre voulu
classCards.sort((a, b) => {
  const indexA = ordreClasses.indexOf(a.slug);
  const indexB = ordreClasses.indexOf(b.slug);
  return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
});

const cartesHtml = classCards.map(c => c.html).join("\n");

const finalHtml = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Index des Classes</title>
    <link rel="icon" href="../../favicon.png" type="image/png">
    <link rel="stylesheet" href="../../style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

  </head>
  <body>
    <canvas id="particles"></canvas>
    <header class="codex-header">
      <div class="header-top">
        <h1><img src="../../assets/images/green-book.png" class="image codex-image-header"> Index des Classes</h1>
      </div>
      <p class="sous-titre">Consultez les profils des classes jouables du JDR</p>
      <div class="fixed-header-links">
      <a href="/" class="carte-lien" style="display: inline-block; max-width: 300px;"><i class="fa-solid fa-arrow-left"></i> Retour au Codex</a>
    </div>
    </header>
    <main class="accueil">
    <div id="search-wrapper">
      <input type="text" id="search-bar" placeholder="Rechercher une classe...">
    </div>
      ${cartesHtml}
    </main>
    <button id="backToTop" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" aria-label="Retour en haut"><i class="fa-solid fa-arrow-up"></i> Retour en haut</button>
    ${footerHTML}
    <script src="../../particles.js"></script>
    <script>
      const searchInput = document.getElementById("search-bar");
      const cards = document.querySelectorAll(".class-card");
      searchInput.addEventListener("input", e => {
        const val = e.target.value.toLowerCase();
        cards.forEach(card => {
          if (card.dataset.nom.includes(val) || card.dataset.description.includes(val)) {
            card.style.removeProperty("display");
          } else {
            card.style.display = "none";
          }
        });
      });

      window.addEventListener('scroll', () => {
        document.getElementById('backToTop').classList.toggle('show', window.scrollY > 300);
      });
    </script>
  </body>
</html>`;

fs.writeFileSync(outputPath, finalHtml, "utf8");
console.log("✅ Index des classes généré avec succès dans:", outputPath);
