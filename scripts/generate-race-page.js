// Script Node.js de conversion d'une classe (format Markdown) en HTML pour le Codex
const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({ html: true });

const footerPath = path.join(__dirname, "footer.html"); // adapte le chemin si besoin
const footerHTML = fs.readFileSync(footerPath, "utf8");

const args = process.argv.slice(2);
const inputPath = args[0];

if (!inputPath) {
  console.error("❌ Veuillez spécifier un fichier markdown à convertir.");
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");
const lines = raw.split(/\r?\n/);
const slugify = str => str.normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const formatCout = (val) => {
  switch (val.toLowerCase()) {
    case "action":
      return '<img src="../../assets/images/action-costs/action.png" alt="Action" class="image action-icon">2 PA (Action)';
    case "bonus":
      return '<img src="../../assets/images/action-costs/bonus-action.png" alt="Bonus" class="image action-icon">1 PA (Action Bonus)';
    case "combo":
      return '<img src="../../assets/images/action-costs/combo-action.png" alt="Combo" class="image action-icon">1 PA (Action Combo)';
    case "reaction":
      return '<img src="../../assets/images/action-costs/reaction.png" alt="Reaction" class="image action-icon">1 PA (Réaction)';
    case "heavy":
      return '<img src="../../assets/images/action-costs/heavy-action.png" alt="Heavy" class="image action-icon">3 PA (Action Complexe)';
    case "passive":
      return '<img src="../../assets/images/action-costs/passive-action.png" alt="Passive" class="image action-icon">Passif';
    case "spec":
      return '<img src="../../assets/images/action-costs/specialisation.png" alt="Specialisation" class="image action-icon">Spécialisation';
    case "special":
      return '<img src="../../assets/images/action-costs/special.png" alt="Special" class="image action-icon">Spécial';
    default:
      return val;
  }
};

const raceIcons = {
  "Brouni": "brouni",
  "Celestrien": "celestrian",
  "Earthlain": "earthlain",
  "Therian": "therian",
  "Sentinelle": "sentinel",
  "Vaisseau": "vessel"
};

const normalizeLabel = str =>
  str.normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const rawTraitIcons = {
  "Augmentation de caractéristique": "ability-score-increase",
  "Alignement": "alignment",
  "Langues": "languages",
  "Vitesse de déplacement": "speed",
  "Compétences supplémentaires": "bonus-skills",
  "Compétences d'Union": "union-skills"
};

const traitIcons = {};
for (const key in rawTraitIcons) {
  traitIcons[normalizeLabel(key)] = rawTraitIcons[key];
}

let nomRace = "";
let description = [];
let shortDescription = "";
let iconeRace = "";
let images = [];
let traits = [];
let aptitudes = [];
let currentAptitude = null;
let section = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  if (line.startsWith("# ")) {
    nomRace = line.replace("# ", "").trim();
    const nomRaceSansAccent = nomRace.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
    iconeRace = raceIcons[nomRaceSansAccent] || "default";
  } else if (line.startsWith("![")) {
    const match = line.match(/\((.*?)\)/);
    if (match) images.push(match[1]);
  } else if (line.toLowerCase() === "## traits raciaux") {
    section = "details";
  } else if (line.toLowerCase().startsWith("## aptitudes")) {
    section = "aptitudes";
  } else if (line.startsWith("## ")) {
    const titre = line.replace(/^##\s+/, "").trim();
    const id = slugify(titre);
    const lower = titre.toLowerCase();
    
  } else if (line.startsWith("### ")) {
    const nom = line.replace("### ", "").trim();
  if (section === "aptitudes") {  
      if (currentAptitude) aptitudes.push(currentAptitude);
      currentAptitude = {
        id: slugify(line.replace("### ", "")),
        nom: line.replace("### ", "").trim(),
        icone: "",
        cout: "",
        description: []
      };
    }
  } else if (line.toLowerCase().startsWith("icone:")) {
    if (section === "aptitudes" && currentAptitude) currentAptitude.icone = line.split(":")[1].trim();    
  } else if (line.toLowerCase().startsWith("coût:") || line.toLowerCase().startsWith("cout:")) {
    const rawCout = line.split(":")[1].trim();
    if (section === "aptitudes" && currentAptitude) currentAptitude.cout = formatCout(rawCout);
  } else if (section === "details" && line.startsWith("- ")) {
    const detailMatch = line.match(/- \*\*(.+?)\*\*:? ?(.*)/);
    if (detailMatch) {
      const label = detailMatch[1].trim();
      const value = detailMatch[2].trim();

      const iconName = traitIcons[normalizeLabel(label)] || null;

      const iconHTML = iconName ? `<img src="../../assets/images/race-traits/${iconName}.png" class="image details-icon"> ` : "";

      traits.push(`<strong>${iconHTML}${label} :</strong> ${value}`);
    } else {
      traits.push(line.replace("- ", ""));
    }
  } else if (section === null && line) {
    if (line.toLowerCase().startsWith("_short description_")) {
      shortDescription = line.replace(/_short description_/i, "").trim();
    } else {
      description.push(line);
    }
  } else if (section === "aptitudes" && currentAptitude && line) {
    currentAptitude.description.push(line);
  }  
}
if (currentAptitude) aptitudes.push(currentAptitude);

const nomRaceSansAccent = nomRace.normalize("NFD").replace(/\p{Diacritic}/gu, "");

const traitsHTML = traits.map(item => `<li><div class="image-texte">${item}</div></li>`).join("\n");

const aptitudesHTML = aptitudes.map(a => `
  <article id="${a.id}">
  <h3>
    <img src="${a.icone}" class="image skill-icon">
    ${a.nom}
    <span>${a.cout}</span>
  </h3>
    <p>${a.description.join(" ")}</p>
  </article>`).join("\n"); 

const finalHtml = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>${nomRace}</title>
    <meta name="description" content="${shortDescription || description[0] || nomRace}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../../favicon.png" type="image/png">
    <link rel="stylesheet" href="../../style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  </head>
  <body>
    <canvas id="particles"></canvas>
    <header class="codex-header">
      <div class="header-top">
        <h1>
          <img src="../../assets/images/race-icons/${iconeRace}.png" class="image class-icon"> ${nomRace}
        </h1>
        <div class="fixed-header-links">
          <a href="index.html" class="carte-lien" style="display: inline-block; max-width: 300px;"><i class="fa-solid fa-arrow-left"></i> Index des races</a>
          <a href="/" class="carte-lien" style="display: inline-block; max-width: 300px;"><i class="fa-solid fa-arrow-left"></i> Retour au Codex</a>
        </div>
      </div>
      <div>
      <div class="illustration-wrapper single">
      ${images.slice(1).map(img => `
          <img src="${img}" alt="Illustration ${nomRace}" class="illustration-race">
        `).join("\n")} 
        </div>
        </div>
    </header>
    <main class="accueil">
      <section class="intro-collapsible click" id="intro">
        <p>${description.join(" ")} </p>
        <button class="toggle-intro" onclick="toggleIntro()">Afficher la suite</button>
      </section>
      <section class="patch-section">
        <h2 class="patch-titre" id="details">
          <img src="../../assets/images/notes-big.png" class="image image-h2"> Traits raciaux
        </h2>
        <ul class="image-list"> ${traitsHTML} </ul>
      </section>
      <section class="patch-section">
        <div class="toggle-section">
          <h2 class="patch-titre" id="aptitudes">
            <img src="../../assets/images/notes-big.png" class="image image-h2"> Aptitudes raciales <button class="toggle-button" onclick="toggleSection(this)">▲</button>
          </h2>
        </div>
        <div class="collapsible-content expanded">
          <div class="patch-list"> ${aptitudesHTML} </div>
        </div>
      </section>
    </main>
    <button id="backToTop" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" aria-label="Retour en haut"><i class="fa-solid fa-arrow-up"></i> Retour en haut</button>
    ${footerHTML}
    <script>
      function toggleIntro() {
        const section = document.getElementById("intro");
        section.classList.toggle("expanded");
        const btn = section.querySelector("button");
        btn.textContent = section.classList.contains("expanded") ? "Réduire" : "Afficher la suite";
      }
    </script>
    <script>
      function toggleSection(button) {
        const content = button.closest("section").querySelector(".collapsible-content");
        const isOpen = content.classList.contains("expanded");
        if (isOpen) {
          content.classList.remove("expanded");
          button.textContent = "▼";
        } else {
          content.classList.add("expanded");
          button.textContent = "▲";
        }
      }
    </script>
    <script>
      window.addEventListener('scroll', () => {
        document.getElementById('backToTop').classList.toggle('show', window.scrollY > 300);
      });
    </script>
  </body>
</html>`;

const relativePath = path.relative("markdown", inputPath); // Ex: "classes/sovereign.md"
const outputBaseName = relativePath.replace(/\.md$/, ".html");
const outputPath = path.join("output", outputBaseName);

// Création du dossier cible si nécessaire
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

fs.writeFileSync(outputPath, finalHtml, "utf8");
console.log("✅ Page de classe générée avec succès :", outputPath);
