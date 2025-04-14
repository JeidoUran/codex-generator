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
    <style>
      .class-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        margin: 1rem auto;
        max-width: 800px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.03);
        transition: background 0.3s;
      }

      .class-card:hover {
        background: rgba(255, 255, 255, 0.06);
      }

      .class-icon {
        height: 64px;
        width: 64px;
      }

      .class-card h2 {
        width: 200px;
        min-width: 200px;
      }

      .class-card p {
        margin-left: 1.5rem;
      }

      #search-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin: 0rem auto 2rem;
        flex-wrap: wrap;
      }

      #search-bar {
        padding: 0.5rem 1rem;
        font-size: 1.1rem;
        font-size: 1rem;
        font-family: 'Cinzel', serif;
        border-radius: 8px;
        border: 1px solid #88c0a9;
        background: rgba(0, 0, 0, 0.3);
        color: #e8ddc5;
        width: 90%;
        max-width: 400px;
        font-family: 'Cinzel', serif;
      }

      #search-bar::placeholder {
        font-family: 'Cinzel', serif;
      }

      .accueil {
        margin-top: 1rem;
      }

      .return-link {
        display: inline-block;
        max-width: 300px;
        white-space: nowrap;
      }
    </style>
  </head>
  <body>
    <canvas id="particles"></canvas>
    <header class="codex-header">
      <div class="header-top">
        <h1>📘 Index des Classes</h1>
        <div class="header-links" style="text-align: center; margin-top: 1rem; margin-bottom: 2rem;">
          <a href="/" class="carte-lien" style="display: inline-block; max-width: 300px;">← Retour au Codex</a>
        </div>
      </div>
      <p class="sous-titre">Consultez les profils des classes jouables du JDR</p>
    </header>
    <div style="text-align: center; margin-top: 3rem;">
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
