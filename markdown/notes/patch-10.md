# Patch 2.3 – Session 12
_Date: 18 Février 2025_

---

## Système

- Le système de fatigue a été modifié, pour se rapprocher de l'édition 2024 de D&D. Plus d'informations sont disponibles sur votre fiche de personnage, onglet Effets, en passant la souris sur la condition Épuisement.
- Les jets de précision et de dégâts utilisent désormais le système de jet d'attaque de D&D5e. Un immense merci au développeur Larkinabout pour ce changement.
	- Jusqu'à présent, il n'était pas possible de définir un dé de précision par type d'arme, et nous devions donc "tricher" en utilisant des méthodes compliquées et souvent peu efficace pour permettre les jets de précision.
	- Tout comme la mise à jour v4, il s'agit d'un changement majeur affectant toutes les aptitudes des joueurs ainsi que celles des monstres, il se peut donc que des problèmes et/ou oublis surviennent et je m'en excuse d'avance.
	- Grâce à ce changement, les activités "Précision" et "Dégâts" ont été regroupées en une seule activité "Attaque", réduisant ainsi le nombre de clics nécessaires pour réaliser une attaque. Cela change cependant légèrement la manière dont les armes polyvalentes s'utilisent à nouveau et je m'excuse pour la gêne occasionnée, ceci dit, il n'y aura normalement plus de changement à ce niveau.
	- La fenêtre de jet de dés de précision s'ouvre désormais automatiquement en réalisant une attaque. Le bouton dans le tchat reste disponible au cas où, mais il n'est plus nécessaire d'appuyer dessus.
	- La fenêtre de jet de dés de dégâts s'ouvre désormais automatiquement lorsqu'une attaque touche ou effleure. Le bouton dans le tchat reste disponible au cas où, mais il n'est plus nécessaire d'appuyer dessus.
	- Il est désormais possible d'effectuer un jet de précision avec avantage ou avec désavantage.
	- La plupart des bonus affectant la précision d'une créature sont désormais appliqués automatiquement, de la même manière que les bonus de dégâts.
- Certains boutons redondants du volet d'action ont été supprimé.
- Les Ental entreposés dans le coffre de guilde sont désormais affichés à côté des Ental du groupe.
- L'affichage du bonus à l'initiative de la fiche de personnage a été retiré.

---

## Classes

### Vagabond

- Le bonus de précision de Tir de pistage est désormais automatiquement ajouté aux attaques du compagnon du Vagabond.

---

## Problèmes résolus

- Les bonus de dégâts sont à nouveau affichés dans le calcul de la fenêtre de lancer de dés.
- Il est à nouveau possible de sélectionner l'arme équipée dans la fenêtre d'attaque d'opportunité. L'aptitude du même nom reste cependant disponible pour des activations manuelles.
- L'aptitude "Charge téméraire" du Lansquenet ne se déclenche plus lorsqu'un allié le cible.
- L'aptitude "Souffle" des Sentinelles ne déclenche plus le dé de dégâts bonus de Poussée Sanguine.

---

## Problèmes connus

- Une erreur de portée insuffisante peut survenir lors de l'utilisation d'une attaque d'opportunité. Elle est sans incidence et peut être ignorée.
- Certaines bulles d'informations sont en anglais suite à l'intégration du manuel des joueurs (2024) de D&D au système de jeu. La version FoundryVTT de ce dernier ne dispose pas encore de traduction française.
- Les joueurs ne peuvent pas afficher la description des objets depuis l'écran d'achat d'un marchand.

## MJ

- Le résultat d'un jet de précision (touché/effleurement/raté/critique) est désormais indiqué sous celui-ci, et est pris en compte lors du calcul des dégats.
	- Cependant, il n'est pas calculé correctement en cas d'effleurement lors de l'utilisation d'actions affectant plusieurs cibles et doit être calculé manuellement. 
- 1 niveau de fatigue est désormais automatiquement appliqué à un personnage tombant inconscient.
