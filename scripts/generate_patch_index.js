// Script Node.js pour générer notes/index.html à partir de tous les patchs HTML dans notes/
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const footerPath = path.join(__dirname, "footer.html"); // adapte le chemin si besoin
const footerHTML = fs.readFileSync(footerPath, "utf8");

const notesDir = path.join(__dirname, "../output/notes");
const outputPath = path.join(notesDir, "index.html");

const patchFiles = fs
  .readdirSync(notesDir)
  .filter((f) => /^patch-.*\.html$/.test(f))
  .sort((a, b) =>
    b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" })
  );

let cartesHtml = "";

for (const file of patchFiles) {
  const filePath = path.join(notesDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(content);

  const fullTitle = $("title").text().trim();
  const titre = fullTitle.split("|")[0].trim();
  const date = $(".sous-titre").text();

  cartesHtml += `
  <a href="${file}" class="carte-lien large patch" data-patch="${file}">
    <h2><img src="../assets/images/silver-scroll.png" class="image codex-silver-scroll-patch"> ${titre}</h2>
    <p>${date}</p>
    <span class="patch-nouveau" hidden><img src="../assets/images/exclam_mark.png" class="image new-patch"></span>
  </a>`;
}

const finalHtml =
  `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Patchs | Codex - Etrian Odyssey TTRPG</title>
    <link rel="icon" href="../favicon.png" type="image/png">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  </head>
  <body>
    <canvas id="particles"></canvas>
    <header class="codex-header">
      <a href="/" class="banniere-link"><img src="../assets/images/banniere.png" alt="Bannière" class="banniere"></a>
      <h1>Historique des Patch Notes</h1>
      <p class="sous-titre">L’archive vivante des Égarés</p>
    </header>

    <nav class="nav-magique">
      <a href="/">Accueil</a>
      <a href="../notes/">Patch Notes</a>
      <a href="../resumes/">Résumés</a>
      <a href="../regles/">Règles</a>
      <a href="../univers/">Univers</a>
      <a href="../musique">Musiques</a>
      <a href="../ressources/">Ressources</a>
      <a href="../credits">Crédits</a>
    </nav>

  <main class="accueil">
    <div id="top-bar">
      <button class="btn-lu" id="tout-lu">
        <img src="../assets/images/icon_checkbox.png" class="image mark-as-read-btn"> Tout marquer comme lu
      </button>
    </div> ` +
  cartesHtml +
  ` <div style="text-align: center; margin-top: 3rem;"></div>
    </main>
    <button id="backToTop" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" aria-label="Retour en haut"><i class="fa-solid fa-arrow-up"></i> Retour en haut</button>
    
    ${footerHTML}

    <script>
      const vues = JSON.parse(localStorage.getItem("patchesVus") || "[]");
      const patches = Array.from(document.querySelectorAll(".carte-lien[data-patch]"));
      let tousLus = true;
      patches.forEach(carte => {
        const patch = carte.getAttribute("data-patch");
        const badge = carte.querySelector(".patch-nouveau");
        if (!vues.includes(patch)) {
          badge.hidden = false;
          tousLus = false;
        }
        carte.addEventListener("click", () => {
          if (!vues.includes(patch)) {
            vues.push(patch);
            localStorage.setItem("patchesVus", JSON.stringify(vues));
          }
        });
      });
      const boutonLu = document.getElementById("tout-lu");
      const zoneBouton = document.getElementById("zone-bouton-lu");
      if (tousLus) {
        boutonLu.style.display = "none";
      }
      boutonLu.addEventListener("click", () => {
        const tous = patches.map(c => c.getAttribute("data-patch"));
        localStorage.setItem("patchesVus", JSON.stringify(tous));
        document.querySelectorAll(".patch-nouveau").forEach(badge => badge.hidden = true);
        boutonLu.style.display = "none";
      });
    </script>
    <script src="../scripts/particles.js"></script>
    <script src="../scripts/backToTop.js"></script>
  </body>
</html>`;

fs.writeFileSync(outputPath, finalHtml, "utf8");
console.log("✅ Index des patchs généré avec succès dans:", outputPath);
