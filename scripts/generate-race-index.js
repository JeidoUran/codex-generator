
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const slugify = str => str.normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const racesDir = path.join(__dirname, "../output/races");
const outputPath = path.join(racesDir, "index.html");

const footerPath = path.join(__dirname, "footer.html");
const footerHTML = fs.readFileSync(footerPath, "utf8");

const raceFiles = fs.readdirSync(racesDir)
  .filter(f => f.endsWith(".html") && f !== "index.html");

const raceCards = [];

for (const file of raceFiles) {
  const filePath = path.join(racesDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(content);

  const fullTitle = $('title').text().trim();
  const titre = fullTitle.split('|')[0].trim();
  const slug = slugify(titre);
  const desc = $('meta[name="description"]').attr("content") || "Cette race n'a pas encore de description.";
  const imageName = file.replace(/\.html$/, ".png");
  const imagePath = `../../assets/images/race-icons/${imageName}`;

  raceCards.push({
    slug,
    html: `
      <a href="${file}" class="carte-lien class-card" data-nom="${titre.toLowerCase()}" data-description="${desc.toLowerCase()}">
        <img src="${imagePath}" alt="${titre}" class="image class-icon">
        <h2>${titre}</h2>
        <p>${desc}</p>
      </a>`
  });
}

raceCards.sort((a, b) => a.slug.localeCompare(b.slug));
const cartesHtml = raceCards.map(c => c.html).join("\n");

const finalHtml = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Races | Codex - Etrian Odyssey TTRPG</title>
    <link rel="icon" href="../../favicon.png" type="image/png">
    <link rel="stylesheet" href="../../style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  </head>
  <body>
    <canvas id="particles"></canvas>
    <header class="codex-header">
      <a href="/" class="banniere-link"><img src="../../assets/images/banniere.png" alt="Bannière" class="banniere"></a>
      <h1>Index des Races</h1>
      <p class="sous-titre">L’archive vivante des Égarés</p>
    </header>

    <nav class="nav-magique">
      <a href="/">Accueil</a>
      <a href="../../notes/">Patch Notes</a>
      <a href="../../regles/">Règles</a>
      <a href="../../univers/">Univers</a>
      <a href="../../musique">Musiques</a>
      <a href="../../ressources/">Ressources</a>
      <a href="../../credits">Crédits</a>
    </nav>

    <main class="accueil">
      <!--<div id="search-wrapper">
        <input type="text" id="search-bar" placeholder="Rechercher une race...">
      </div>-->
      ${cartesHtml}
    </main>
    <button id="backToTop" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" aria-label="Retour en haut"><i class="fa-solid fa-arrow-up"></i> Retour en haut</button>
    ${footerHTML}
    <script src="../../scripts/particles.js"></script>
    <!--<script>
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
    </script>-->
  </body>
</html>`;

fs.writeFileSync(outputPath, finalHtml, "utf8");
console.log("✅ Index des races généré avec succès dans:", outputPath);
