// Script Node.js de conversion Markdown → Patch Note Codex HTML
const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({ html: true });

const slugify = str => str.normalize("NFD")
  .replace(/\p{Diacritic}/gu, "") // enlève les accents
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")    // remplace les caractères non alphanumériques par des tirets
  .replace(/(^-|-$)/g, "");       // enlève les tirets en début/fin

const args = process.argv.slice(2);
const inputPath = args[0];

const footerPath = path.resolve(__dirname, "footer.html");
const footerHTML = fs.readFileSync(footerPath, "utf8");

const classIcons = {
  "Souverain": "sovereign",
  "Envouteur": "hexer",
  "Imperial": "imperial",
  "Lansquenet": "landsknecht",
  "Mage guerrier": "war-magus",
  "Moine": "monk",
  "Necromancien": "necromancer",
  "Shogun": "shogun",
  "Heraut": "harbinger",
  "Dragoon": "dragoon",
  "Vagabond": "rover",
  "Troubadour": "troubadour",
  "Pistolero": "gunner"
};

if (!inputPath) {
  console.error("❌ Veuillez spécifier un fichier markdown à convertir.");
  process.exit(1);
}

const relativePath = path.relative("markdown", inputPath); // Ex: "notes/nom.md"
const outputBaseName = relativePath.replace(/\.md$/, ".html");
const outputPath = path.join("output", outputBaseName);

// Assure-toi que le dossier de destination existe :
fs.mkdirSync(path.dirname(outputPath), { recursive: true });


const raw = fs.readFileSync(inputPath, "utf8");
const lines = raw.split(/\r?\n/);

let titrePatch = "";
let datePatch = "";
let htmlSections = [];
let navLinks = [];
let currentSection = null;
let currentClasse = null;
let lastItem = null;

for (let line of lines) {
  if (line.startsWith("# ")) {
    titrePatch = line.replace("# ", "").trim();
  } else if (line.toLowerCase().startsWith("_date:")) {
    datePatch = line.replace(/_date:/i, "").replace(/_/g, "").trim();
  } else if (line.startsWith("## ")) {
    if (currentSection) htmlSections.push(currentSection);
    const title = line.replace("## ", "");
    const id = slugify(title);
    navLinks.push({ id, title });
    currentSection = {
      type: "section",
      title,
      id,
      content: [],
    };
    currentClasse = null;
  } else if (line.startsWith("### ")) {
    if (!currentSection || currentSection.title !== "Classes") continue;
    currentClasse = {
      type: "classe",
      title: line.replace("### ", ""),
      items: [],
    };
    currentSection.content.push(currentClasse);
  } else if (line.startsWith("- ")) {
    const item = { text: line.replace("- ", "").trim(), notes: [] };
    if (currentClasse) {
      currentClasse.items.push(item);
    } else if (currentSection) {
      currentSection.content.push(item);
    }
    lastItem = item;
  } else if (/^\s+- /.test(line) && lastItem) {
    lastItem.notes.push(line.replace(/^\s+- /, "").trim());
  }
}
if (currentSection) htmlSections.push(currentSection);

function renderSection(section) {
  let html = `\n<section class="patch-section" id="${section.id}">\n  <h2 class="patch-titre">\n    <img src="../assets/images/notes-big.png" class="image image-h2">\n    ${section.title}\n  </h2>`;

  const renderItem = (item) => {
    let rendered = `\n    <li><img src="../assets/images/notes-medium.png" class="image"><div class="image-texte">${item.text}`;
    if (item.notes && item.notes.length > 0) {
      for (const note of item.notes) {
        rendered += `<div class="note-expliquee">${note}</div>`;
      }
    }
    rendered += `</div></li>`;
    return rendered;
  };

  if (section.title === "Classes") {
    for (let classe of section.content) {
      const classNameNormalized = classe.title.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
      const iconName = classIcons[classe.title] || classIcons[classNameNormalized] || "notes-medium"
      html += `\n  <div class="classe-subsection">\n    <h3 class="classe-nom">\n      <img src="../assets/images/class-icons/${iconName}.png" class="image image-h3">\n      ${classe.title}\n    </h3>\n    <ul class="image-list">`;
      if (!iconName || iconName === "notes-medium") {
        console.warn(`⚠️ Icône manquante pour la classe : "${classe.title}"`);
      }
      for (let item of classe.items) {
        html += renderItem(item);
      }
      html += `\n    </ul>\n  </div>`;
    }
  } else {
    html += `\n  <ul class="image-list">`;
    for (let item of section.content) {
      html += renderItem(item);
    }
    html += `\n  </ul>`;
  }

  return html;
}

const navigationHTML = `\n<nav class="patch-nav">\n  <ul>\n    ${navLinks.map(link => `<li><a href="#${link.id}"><span class="rune"><img src="../assets/images/notes-big.png" class="image patch-nav-image"></span> ${link.title}</a></li>`).join("\n    ")}\n  </ul>\n</nav>`;

const body = htmlSections.map(renderSection).join("\n");

const finalHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${titrePatch}</title>
  <link rel="icon" href="../favicon.png" type="image/png">
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
  <canvas id="particles"></canvas>
  <header class="codex-header" id="top">
    <div class="header-top">
    <h1><img src="../assets/images/silver-scroll.png" class="image codex-silver-scroll-header"> ${titrePatch}</h1>
    <div class="fixed-header-links">
      <a href="index.html" class="carte-lien" style="display: inline-block; max-width: 300px;"><i class="fa-solid fa-arrow-left"></i> Index des patchs</a>
      <a href="/" class="carte-lien" style="display: inline-block; max-width: 300px;"><i class="fa-solid fa-arrow-left"></i> Retour au Codex</a>
    </div>
    </div>
    <p class="sous-titre">Publié le ${datePatch}</p>
  </header>
  <main class="accueil">
    <section class="intro">
      ${navigationHTML}
    </section>
    ${body}
  </main>

  <button id="backToTop" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" aria-label="Retour en haut"><i class="fa-solid fa-arrow-up"></i> Retour en haut</button>

  ${footerHTML}

  <script>
    window.addEventListener('scroll', () => {
        document.getElementById('backToTop').classList.toggle('show', window.scrollY > 300);
    });
  </script>
  <script src="../particles.js"></script>
</body>
</html>`;

fs.writeFileSync(outputPath, finalHtml, "utf8");
console.log("✅ Patch Note Codex généré avec succès :", outputPath);
