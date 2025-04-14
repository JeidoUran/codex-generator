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
    default:
      return val;
  }
};

const spellSectionIcons = {
  "sorts mineurs": "cantrip.png",
  "sorts de premier niveau": "spell-slot1.png",
  "sorts de second niveau": "spell-slot2.png",
  "sorts de troisième niveau": "spell-slot3.png"
};


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

const normalizeLabel = str =>
  str.normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const rawDetailIcons = {
  "Points de vie": "health",
  "Dés de vie": "hit-dice",
  "DD des jets de sauvegarde": "saving-throw-dc",
  "Précision des sorts": "spell-accuracy",
  "Modificateur d'attaque magique": "spellcasting-mod",
  "Maîtrises": "masteries",
  "Jets de sauvegarde": "saving-throw",
  "Compétences": "skills",
  "Équipement de départ": "starting-equipment"
};

const detailIcons = {};
for (const key in rawDetailIcons) {
  detailIcons[normalizeLabel(key)] = rawDetailIcons[key];
}

let nomClasse = "";
let description = [];
let shortDescription = "";
let iconeClasse = "";
let images = [];
let details = [];
let aptitudes = [];
let specialisations = [];
let currentAptitude = null;
let currentSpec = null;
let currentSpecAptitude = null;
let currentSortSection = null;
let sortSections = [];
let section = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  if (line.startsWith("# ")) {
    nomClasse = line.replace("# ", "").trim();
    const nomClasseSansAccent = nomClasse.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
    iconeClasse = classIcons[nomClasseSansAccent] || "default";
  } else if (line.startsWith("![")) {
    const match = line.match(/\((.*?)\)/);
    if (match) images.push(match[1]);
  } else if (line.toLowerCase() === "## details") {
    section = "details";
  } else if (line.toLowerCase() === "## aptitudes") {
    section = "aptitudes";
  } else if (line.toLowerCase() === "## spécialisations") {
    section = "specialisations";
  } else if (line.startsWith("## ")) {
    const titre = line.replace(/^##\s+/, "").trim();
    const id = slugify(titre);
    const lower = titre.toLowerCase();
  
    if (spellSectionIcons[lower]) {
      currentSortSection = {
        id,
        titre,
        sorts: []
      };
      sortSections.push(currentSortSection);
      section = "sorts"; // nouvelle catégorie logique
      continue;
    } else {
      section = null;
      currentSortSection = null;
    }
  } else if (line.startsWith("### ")) {
    const nom = line.replace("### ", "").trim();
    if (section === "sorts" && currentSortSection) {
      currentSortSection.sorts.push({
        id: slugify(nom),
        nom,
        icone: "",
        cout: "",
        description: []
      });
    } else if (section === "aptitudes") {  
      if (currentAptitude) aptitudes.push(currentAptitude);
      currentAptitude = {
        id: slugify(line.replace("### ", "")),
        nom: line.replace("### ", "").trim(),
        icone: "",
        cout: "",
        description: []
      };
    } else if (section === "specialisations") {
      if (currentSpecAptitude && currentSpec) currentSpec.aptitudes.push(currentSpecAptitude);
      if (currentSpec) specialisations.push(currentSpec);
      currentSpecAptitude = null;
      currentSpec = {
        nom: line.replace("### ", "").trim(),
        id: slugify(line.replace("### ", "")),
        icone: "",
        aptitudes: []
      };
    }
  } else if (line.toLowerCase().startsWith("icone:") && currentSpec && !currentSpecAptitude) {
    currentSpec.icone = line.split(":")[1].trim();
  } else if (line.startsWith("#### ") && section === "specialisations" && currentSpec) {
    if (currentSpecAptitude) currentSpec.aptitudes.push(currentSpecAptitude);
    currentSpecAptitude = {
      id: slugify(line.replace("### ", "")),
      nom: line.replace("#### ", "").trim(),
      icone: "",
      cout: "",
      description: []
    };
  } else if (line.toLowerCase().startsWith("icone:")) {
    if (section === "aptitudes" && currentAptitude) currentAptitude.icone = line.split(":")[1].trim();
    if (section === "specialisations" && currentSpecAptitude) currentSpecAptitude.icone = line.split(":")[1].trim();
    if (section === "sorts" && currentSortSection?.sorts?.length > 0) {
      currentSortSection.sorts[currentSortSection.sorts.length - 1].icone = line.split(":")[1].trim();
    }    
  } else if (line.toLowerCase().startsWith("coût:") || line.toLowerCase().startsWith("cout:")) {
    const rawCout = line.split(":")[1].trim();
    if (section === "aptitudes" && currentAptitude) currentAptitude.cout = formatCout(rawCout);
    if (section === "specialisations" && currentSpecAptitude) currentSpecAptitude.cout = formatCout(rawCout);
    if (section === "sorts" && currentSortSection?.sorts?.length > 0) {
      currentSortSection.sorts[currentSortSection.sorts.length - 1].cout = formatCout(rawCout);
    }
  } else if (section === "details" && line.startsWith("- ")) {
    const detailMatch = line.match(/- \*\*(.+?)\*\*:? ?(.*)/);
    if (detailMatch) {
      const label = detailMatch[1].trim();
      const value = detailMatch[2].trim();

      const iconName = detailIcons[normalizeLabel(label)] || null;

      const iconHTML = iconName ? `<img src="../../assets/images/class-details/${iconName}.png" class="image details-icon"> ` : "";

      details.push(`<strong>${iconHTML}${label} :</strong> ${value}`);
    } else {
      details.push(line.replace("- ", ""));
    }
  } else if (section === null && line) {
    if (line.toLowerCase().startsWith("_short description_")) {
      shortDescription = line.replace(/_short description_/i, "").trim();
    } else {
      description.push(line);
    }
  } else if (section === "aptitudes" && currentAptitude && line) {
    currentAptitude.description.push(line);
  } else if (section === "specialisations" && currentSpecAptitude && line) {
    currentSpecAptitude.description.push(line);
  } else if (section === "sorts" && currentSortSection?.sorts?.length > 0 && line) {
    const currentSort = currentSortSection.sorts[currentSortSection.sorts.length - 1];
    const dataMatch = line.match(/Temps d'incantation\s*:\s*(.+?),\s*Portée\s*:\s*(.+?),\s*Composants\s*:\s*(.+?),\s*Durée\s*:\s*(.+?),\s*Attaque\/Sauvegarde\s*:\s*(.+)/i);

    if (dataMatch) {
      const [_, cast, range, comp, duration, save] = dataMatch;
      const iconPath = "../../assets/images/spell-details";
    
      currentSort.description.push(`<div class="spell-data-icons">
        <div class="spell-info-block"><img src="${iconPath}/cast-time.png" title="Temps d'incantation" class="spell-info-icon cast-time"> ${cast}</div>
        <div class="spell-info-block"><img src="${iconPath}/range.png" title="Portée" class="spell-info-icon"> ${range}</div>
        <div class="spell-info-block"><img src="${iconPath}/component.png" title="Composants" class="spell-info-icon components"> ${comp}</div>
        <div class="spell-info-block"><img src="${iconPath}/duration.png" title="Durée" class="spell-info-icon"> ${duration}</div>
        <div class="spell-info-block"><img src="${iconPath}/save.png" title="Type de jet de sauvegarde ou attaque" class="spell-info-icon"> ${save}</div>
      </div>`);
    } else {
      currentSort.description.push(line);
    }
    
  }  
}
if (currentAptitude) aptitudes.push(currentAptitude);
if (currentSpecAptitude && currentSpec) currentSpec.aptitudes.push(currentSpecAptitude);
if (currentSpec) specialisations.push(currentSpec);

const nomClasseSansAccent = nomClasse.normalize("NFD").replace(/\p{Diacritic}/gu, "");

// Lecture du tableau de progression, si disponible
const tablePath = path.resolve(__dirname, `../progressions/progression-${slugify(nomClasse)}.html`);
let tableHTML = "";
if (fs.existsSync(tablePath)) {
  tableHTML = fs.readFileSync(tablePath, "utf8");
}

const navLinks = [
  { href: "#details", label: "Détails" },
  { href: "#aptitudes", label: "Aptitudes" },
  ...aptitudes.map(a => ({ href: `#${a.id}`, label: a.nom })),
  ...(specialisations.length > 0 ? [{ href: "#specialisations", label: "Spécialisations" }] : []),
  ...specialisations.flatMap(spec => [
    { href: `#${spec.id}`, label: spec.nom },
    ...spec.aptitudes.map(a => ({ href: `#${a.id}`, label: a.nom }))
  ]),
  // Ajoute ici les sections de sorts AVANT la progression
  ...sortSections.flatMap(section => [
    { href: `#${section.id}`, label: section.titre },
    ...section.sorts.map(sort => ({ href: `#${sort.id}`, label: sort.nom }))
  ]),
  { href: "#progression-table", label: "Progression par niveau" }
];

const sectionsPrincipales = ["#details", "#aptitudes", "#specialisations", "#sorts-mineurs", "#sorts-de-premier-niveau", "#sorts-de-second-niveau", "#sorts-de-troisieme-niveau", "#progression-table", "#magierkaiser", "#arztkaiser", "#starkekaiser", "#devouement-au-controle", "#devouement-a-la-restreinte", "#devouement-a-la-vengeance"];

const navHTML = `\n<div class="class-nav">\n  ${navLinks.map(l => {
  const cls = sectionsPrincipales.includes(l.href) ? 'section-link' : 'sub-link';
  return `<a href="${l.href}" class="${cls}">${l.label}</a>`;
}).join("\n  ")}\n</div>`;

const detailsHTML = details.map(item => `<li><div class="image-texte">${item}</div></li>`).join("\n");

const aptitudesHTML = aptitudes.map(a => `
  <article id="${a.id}">
  <h3>
    <img src="${a.icone}" class="image skill-icon">
    ${a.nom}
    <span>${a.cout}</span>
  </h3>
    <p>${a.description.join(" ")}</p>
  </article>`).join("\n");

const specialisationsHTML = specialisations.map(spec => `
  <section class="patch-section">
  <div class="toggle-section">
    <h2 class="patch-titre" id="${spec.id}">
      <img src="${spec.icone}" class="image class-icon">
      ${spec.nom}
      <button class="toggle-button" onclick="toggleSection(this)">▲</button>
    </h2>
    </div>
    <div class="collapsible-content expanded">
    <div class="patch-list">
      ${spec.aptitudes.map(a => `
        <article id="${a.id}">
        <h3>
          <img src="${a.icone}" class="image skill-icon">
          ${a.nom}
          <span>${a.cout}</span>
        </h3>
          <p>${a.description.join(" ")}</p>
        </article>`).join("\n")}
    </div>
    </div>
  </section>`).join("\n");

  const sortsHTML = sortSections.map(section => `
    <section class="patch-section">
      <div class="toggle-section">
        <h2 class="patch-titre" id="${section.id}">
          <img src="../../assets/images/action-costs/${spellSectionIcons[section.titre.toLowerCase()]}" class="image image-h2">
          ${section.titre}
          <button class="toggle-button" onclick="toggleSection(this)">▲</button>
        </h2>
    </div>
    <div class="collapsible-content expanded">
      <div class="patch-list">
        ${section.sorts.map(s => `
        <article id="${s.id}">
        <h3>
          <img src="${s.icone}" class="image skill-icon">
          ${s.nom}
          <span>${s.cout}</span>
        </h3>
          <p>${s.description.join(" ")}</p>
        </article>`).join("\n")}
      </div>
    </section>`).join("\n");  

const finalHtml = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>${nomClasse}</title>
    <meta name="description" content="${shortDescription || description[0] || nomClasse}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../../favicon.png" type="image/png">
    <link rel="stylesheet" href="../../style.css">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  </head>
  <body>
    <canvas id="particles"></canvas> ${navHTML} <header class="codex-header">
      <div class="header-top">
        <h1>
          <img src="../../assets/images/class-icons/${iconeClasse}.png" class="image class-icon"> ${nomClasse}
        </h1>
        <div class="fixed-header-links">
          <a href="index.html" class="carte-lien" style="display: inline-block; max-width: 300px;"><i class="fa-solid fa-arrow-left"></i> Index des classes</a>
          <a href="/" class="carte-lien" style="display: inline-block; max-width: 300px;"><i class="fa-solid fa-arrow-left"></i> Retour au Codex</a>
        </div>
      </div>
      <div>
      <div class="illustration-wrapper double">
      ${images.slice(1).map(img => `
          <img src="${img}" alt="Illustration ${nomClasse}" class="illustration-classe">
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
          <img src="../../assets/images/notes-big.png" class="image image-h2"> Détails de la classe
        </h2>
        <ul class="image-list"> ${detailsHTML} </ul>
      </section>
      <section class="patch-section">
        <div class="toggle-section">
          <h2 class="patch-titre" id="aptitudes">
            <img src="../../assets/images/notes-big.png" class="image image-h2"> Aptitudes de classe <button class="toggle-button" onclick="toggleSection(this)">▲</button>
          </h2>
        </div>
        <div class="collapsible-content expanded">
          <div class="aptitude-search-container">
            <input type="text" id="aptitude-search" placeholder="Rechercher une aptitude..." />
          </div>
          <div class="patch-list"> ${aptitudesHTML} </div>
        </div>
      </section>
      <h2 class="patch-titre" id="specialisations">
        <img src="../../assets/images/notes-big.png" class="image image-h2"> Spécialisations
      </h2>
    ${specialisationsHTML}
    ${sortsHTML}
    ${tableHTML}
    </main>
    <button id="backToTop" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" aria-label="Retour en haut"><i class="fa-solid fa-arrow-up"></i> Retour en haut</button> ${footerHTML} <script>
      document.addEventListener("DOMContentLoaded", function() {
            const navContainer = document.querySelector('.class-nav');
            const navLinks = document.querySelectorAll('.class-nav a[href^="#"]');
            const sections = [...document.querySelectorAll("h2.patch-titre, article")];
            let lastActive = null;
            const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                        if (entry.isIntersecting) {
                          const id = entry.target.getAttribute("id");
                          const activeLink = [...navLinks].find(link => link.getAttribute("href") === \`#$\{id}\`);
         
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
             rootMargin: "-30% 0px -60% 0px",
             threshold: 0.1
         });
         
         sections.forEach(section => observer.observe(section));
         });
      
    </script>
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        const searchInput = document.getElementById("aptitude-search");
        const aptitudeArticles = document.querySelectorAll("article");
        searchInput.addEventListener("input", function() {
          const value = searchInput.value.toLowerCase();
          aptitudeArticles.forEach(article => {
            const title = article.querySelector("h3")?.textContent?.toLowerCase() || "";
            const content = article.textContent?.toLowerCase() || "";
            if (title.includes(value) || content.includes(value)) {
              article.style.display = "";
            } else {
              article.style.display = "none";
            }
          });
        });
      });
    </script>
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
    <script>
      function toggleMobileNav(btn) {
        const overlay = document.getElementById("mobileNav");
        overlay.classList.toggle("show");
        btn.classList.toggle("open");
        btn.textContent = overlay.classList.contains("show") ? "✕" : "☰";
      }
    </script>
    <script src="../../particles.js"></script>
    <button class="mobile-nav-toggle" onclick="toggleMobileNav(this)">☰</button>
    <div class="mobile-nav-overlay" id="mobileNav">
      <div class="mobile-nav-content"> ${navLinks.map(l => { const cls = sectionsPrincipales.includes(l.href) ? 'section-link' : 'sub-link'; return ` <a href="${l.href}" class="${cls}" onclick="toggleMobileNav()">${l.label}</a>`; }).join("\n")} </div>
    </div>
  </body>
</html>`;

const relativePath = path.relative("markdown", inputPath); // Ex: "classes/sovereign.md"
const outputBaseName = relativePath.replace(/\.md$/, ".html");
const outputPath = path.join("output", outputBaseName);

// Création du dossier cible si nécessaire
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

fs.writeFileSync(outputPath, finalHtml, "utf8");
console.log("✅ Page de classe générée avec succès :", outputPath);
