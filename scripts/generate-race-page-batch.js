const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const sourceRoot = "./markdown/races"; // dossier contenant tes .md
const converterScript = "./scripts/generate-race-page.js"; // ton script actuel de conversion

// Fonction récursive pour parcourir tous les .md dans les sous-dossiers
function getAllMarkdownFiles(dirPath) {
  let results = [];
  fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(filePath)); // récursion
    } else if (file.endsWith(".md")) {
      results.push(filePath);
    }
  });
  return results;
}

const mdFiles = getAllMarkdownFiles(sourceRoot);

mdFiles.forEach(file => {
  console.log(`🔄 Conversion de ${file}...`);
  execSync(`node ${converterScript} "${file}"`, { stdio: "inherit" });
});

console.log("✅ Conversion batch terminée !");