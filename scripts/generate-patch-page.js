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
  "Souverain": "souverain",
  "Envouteur": "envouteur",
  "Imperial": "imperial",
  "Lansquenet": "lansquenet",
  "Mage guerrier": "mage-guerrier",
  "Moine": "moine",
  "Necromancien": "necromancien",
  "Shogun": "shogun",
  "Heraut": "heraut",
  "Dragoon": "dragoon",
  "Vagabond": "vagabond",
  "Troubadour": "troubadour",
  "Pistolero": "pistolero"
};

const raceIcons = {
  "Brouni": "brouni",
  "Celestrien": "celestrien",
  "Earthlain": "earthlain",
  "Therian": "therian",
  "Sentinelle": "sentinelle",
  "Vaisseau": "vaisseau",
  "Général": "general"
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
  if (!currentSection) return;
  const title = line.replace("### ", "").trim();

  if (currentSection.title === "Classes") {
    currentClasse = {
      type: "classe",
      title,
      icon: classIcons[title] || null,
      items: [],
    };
    currentSection.content.push(currentClasse);
  } else if (currentSection.title === "Races") {
    currentClasse = {
      type: "race",
      title,
      icon: raceIcons[title] || null,
      items: [],
    };
    currentSection.content.push(currentClasse);
  }
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
  } else if (section.title === "Races") {
    for (let race of section.content) {
      const raceNameNormalized = race.title.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
      const iconName = raceIcons[race.title] || raceIcons[raceNameNormalized] || "notes-medium"
      html += `\n  <div class="classe-subsection">\n    <h3 class="classe-nom">\n      <img src="../assets/images/race-icons/${iconName}.png" class="image image-h3">\n      ${race.title}\n    </h3>\n    <ul class="image-list">`;
      if (!iconName || iconName === "notes-medium") {
        console.warn(`⚠️ Icône manquante pour la classe : "${race.title}"`);
      }
      for (let item of race.items) {
        html += renderItem(item);
      }
      html += `\n    </ul>\n  </div>`;
    }
  } else {
    html += `\n  <ul class="image-list">`;
    for (let item of section.content) {
      html += renderItem(item);
    }
    html += `\n  </ul></section>`;
  }

  return html;
}

const navigationHTML = `\n<nav class="patch-nav">\n ${navLinks.map(link => `<a href="#${link.id}" class="section-link">${link.title}</a>`).join("\n    ")}\n  </nav>`;

const body = htmlSections.map(renderSection).join("\n");

const finalHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${titrePatch} | Codex - Etrian Odyssey TTRPG</title>
  <link rel="icon" href="../favicon.png" type="image/png">
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
  <canvas id="particles"></canvas>

  ${navigationHTML}

  <header class="codex-header" id="top">
    <img src="../assets/images/banniere.png" alt="Bannière" class="banniere">
    <h1><img src="../assets/images/silver-scroll.png" class="image codex-image-header"> ${titrePatch}</h1>
    <p class="sous-titre">Publié le ${datePatch}</p>
    <div class="fixed-header-links">
      <a href="index.html" class="carte-lien" style="display: inline-block; max-width: 300px;"><i class="fa-solid fa-arrow-left"></i> Index des patchs</a>
    </div>
  </header>

  <nav class="nav-magique">
    <a href="/">Accueil</a>
    <a href="../notes/">Patch Notes</a>
    <a href="../regles/">Règles</a>
    <a href="../univers/">Univers</a>
    <a href="../musique">Musiques</a>
    <a href="../ressources/">Ressources</a>
    <a href="../credits">Crédits</a>
  </nav>

<main class="accueil">
    ${body}
  </main>

  <button id="backToTop" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" aria-label="Retour en haut"><i class="fa-solid fa-arrow-up"></i> Retour en haut</button>
  <div id="lightbox" class="lightbox" onclick="closeLightbox()">
    <img id="lightbox-img" src="" alt="Portrait" />
  </div>

  ${footerHTML}

  <script>
  document.addEventListener("DOMContentLoaded", function() {
        const navContainer = document.querySelector('.patch-nav');
        const navLinks = document.querySelectorAll('.patch-nav a[href^="#"]');
        const sections = [...document.querySelectorAll(".patch-section")];

        let lastActive = null;
        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            const activeLink = [...navLinks].find(link => link.getAttribute("href") === \`#\${id}\`);
            if (activeLink && activeLink !== lastActive) {
              navLinks.forEach(link => link.classList.remove("active"));
              activeLink.classList.add("active");

              // Scroll l'élément actif dans le menu si partiellement masqué
              const linkTop = activeLink.getBoundingClientRect().top;
              const navTop = navContainer.getBoundingClientRect().top;
              const linkBottom = linkTop + activeLink.offsetHeight;
              const navBottom = navTop + navContainer.offsetHeight;

              if (linkTop < navTop || linkBottom > navBottom) {
                activeLink.scrollIntoView({ behavior: "smooth", block: "center" });
              }

              lastActive = activeLink;
            }
          }
        });
      }, {
        rootMargin: "-20% 0px -30% 0px",
        threshold: 0.1
      });

     
     sections.forEach(section => observer.observe(section));
     });
</script>
  <script src="../scripts/backToTop.js"></script>
  <script src="../scripts/particles.js"></script>
  <script src="../scripts/lightbox.js"></script>
</body>
</html>`;

fs.writeFileSync(outputPath, finalHtml, "utf8");
console.log("✅ Patch Note Codex généré avec succès :", outputPath);