# Patch 2.1 – Session 10
_Date: 29 Janvier 2025_

---

## Système

- Le système de jeu a été mis à jour de la version 4.1.2 à la version 4.2.2. Il s'agit d'une mise à jour relativement mineur apportant quelques nouveautés notamment sur les passages de niveau et les repos.
	- L'interface des passages de niveau à été mise à jour.
	- Lors d'un repos court ou long, un détail des ressources récupérées est désormais affiché dans le tchat.
- Le message de rappel d'inspiration a été modifié.
- L'effet du plat à base de viande de Grand lynx s'applique désormais automatiquement si la cible est prise en tenaille.
- La taille du coffre de guilde a été augmentée (10 x 10 -> 15 x 15).
	- La taille du coffre de guilde continuera d'augmenter en fonction des besoins du groupe.
- En préparation à l'implémentation d'une future fonctionnalité, les onglets de la fiche de personnage ont été déplacés vers le bas.
- Il est désormais possible de séparer une pile d'objets en plusieurs piles (Clic droit sur un objet -> Diviser).
- Il est désormais possible de rassembler des piles d'un même objet en une seule pile (Clic droit sur un objet -> Condenser).
- Les lancers de dés sont désormais enregistrés, à des fins statistiques. Ces statistiques sont accessibles dans les contrôles sur la gauche de l'écran, en cliquant sur le bouton en forme de D20, ou sur demande.

---

## Classes

### Souverain

- Ordre de protection calcule désormais le nombre de dés d'Inspiration à consommer et consomme la valeur correcte. De plus, les dés consommés au delà du 2ème sont correctement rendus au Souverain.

### Vagabond

- Le compagnon du Vagabond est désormais correctement compté lors de l'activation du mode Groupe.

---

## Problèmes résolus

- Le bug général rencontré par certains joueurs a été identifié et l'application utilisée pour accéder à Foundry à été changée en conséquence.
- L'aptitude Négociation du Souverain fonctionne désormais comme prévu.
- Les Dés d'Inspiration du Souverain ne sont plus réinitialisés à 0 à la fin d'un combat.
- Il est à nouveau possible de réaliser des attaques d'opportunités via la fenêtre apparaissant lorsqu'une créature hostile s'éloigne.
	- Cependant, il est pour l'instant impossible de sélectionner l'arme équipée. L'aptitude "Attaque d'opportunité" est sélectionnée par défaut à la place et invoque l'arme équipée dans le tchat.
- 1 PA n'est plus rendu lorsque l'option "Oui" de la fenêtre d'Attaque d'opportunité est sélectionnée.
- Les torches ne comptent plus comme une arme pouvant déclencher des attaques d'opportunité.
- Bien que la plupart des problèmes rencontrés lors de la session précédente aient été corrigés, il reste une possibilité que des problèmes imprévus surviennent, la mise à jour effectuée avant la dernière session étant colossale, il m'est impossible d'effectuer tous les tests nécessaires à un fonctionnement parfait. Je m'excuse donc par avance si nous rencontrons à nouveau des problèmes ce soir.
---

## Problèmes connus

- Certains consommables affichent [object Object] à la place de leur catégorie.