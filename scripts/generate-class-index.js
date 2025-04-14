// Script Node.js pour générer regles/classes/index.html à partir des fichiers HTML de chaque classe
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const classesDir = path.join(__dirname, "regles", "classes");
const outputPath = path.join(classesDir, "index.html");

const footerPath = path.join(__dirname, "footer.html"); // adapte le chemin si besoin
const footerHTML = fs.readFileSync(footerPath, "utf8");

const classFiles = fs.readdirSync(classesDir)
  .filter(f => f.endsWith(".html") && f !== "index.html");

let cartesHtml = "";

for (const file of classFiles) {
  const filePath = path.join(classesDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(content);

  const titre = $("title").text().trim() || file.replace(/\.html$/, "");
  const desc = $('meta[name="description"]').attr("content") || "Cette classe n'a pas encore de description.";
  const imageName = file.replace(/\.html$/, ".png");
  const imagePath = `../../assets/images/class-icons/${imageName}`;

  cartesHtml += `
  <a href="${file}" class="carte-lien class-card" data-nom="${titre.toLowerCase()}">
    <img src="${imagePath}" alt="${titre}" class="image class-icon">
    <h2>${titre}</h2>
    <p>${desc}</p>
  </a>`;
}

const finalHtml = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Index des Classes</title>
    <link rel="icon" href="../../favicon.png" type="image/png">
    <link rel="stylesheet" href="../../style.css">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel&display=swap" rel="stylesheet">

  </head>
  <body>
    <canvas id="particles"></canvas>
    <header class="codex-header">
      <div class="header-top">
          <h1><img src="../../assets/images/green-book.png" class="image codex-image-header"> Index des Classes</h1>        <div class="header-links" style="text-align: center; margin-top: 1rem; margin-bottom: 2rem;">
          <a href="/" class="carte-lien" style="display: inline-block; max-width: 300px;">← Retour au Codex</a>
        </div>
      </div>
      <p class="sous-titre">Consultez les profils des classes jouables du JDR</p>
    </header>
    <div class="fixed-header-links">
      <a href="/" class="carte-lien" style="display: inline-block; max-width: 300px;">← Retour au Codex</a>
    </div>
    <main class="accueil">
      <input type="text" id="search-bar" placeholder="Rechercher une classe..."> ${cartesHtml}
    </main>
    <button id="backToTop" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" aria-label="Retour en haut">↑ Retour en haut</button> ${footerHTML} <script src="../../particles.js"></script>
    <script>
      const searchInput = document.getElementById("search-bar");
      const cards = document.querySelectorAll(".class-card");
      searchInput.addEventListener("input", e => {
        const val = e.target.value.toLowerCase();
        cards.forEach(card => {
          card.style.display = card.dataset.nom.includes(val) ? "block" : "none";
        });
      });
    </script>
    <script>
      window.addEventListener('scroll', () => {
        document.getElementById('backToTop').classList.toggle('show', window.scrollY > 300);
      });
    </script>
  </body>
</html>`;

fs.writeFileSync(outputPath, finalHtml, "utf8");
console.log("✅ Index des classes généré avec succès dans:", outputPath);
