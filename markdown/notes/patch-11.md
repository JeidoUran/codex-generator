# Patch 2.4 – Session 13
_Date: 28 Février 2025_

---

## Système

- Le système de jeu a été mis à jour de la version 4.2.2 à la version 4.3.6.
	- Il est désormais possible d'envoyer la description d'un objet dans le tchat sans l'utiliser, en le cliquant droit et en sélectionnant l'option correspondante.
	- Les créatures similaires partageant la même initiative sont désormais groupées ensemble dans l'ordre des tours.
- Une nouvelle interface inspirée par Baldur's Gate 3 et programmée par <a href="https://github.com/BragginRites/bg3-inspired-hotbar">BragginRites et Dapoulp</a> a été ajoutée.
	- Afin d'accomoder la nouvelle interface, certains éléments, telle que la Pause, ont été déplacés
	- De même, la barre des macros est désormais réduite par défaut.
	- Afin d'épurer l'interface générale, la barre de Tokens a été retirée pour les joueurs.
	- Double-cliquer sur le portrait de votre personnage dans l'interface ouvre sa fiche de personnage.
	- Cliquer sur les formes au centre de l'interface permets de filtrer vos aptitudes et objets, respectivement par Action, Action bonus, Réaction.
	- Cliquer-droit sur une case vous permets de remplir les compartiments de l'interface automatiquement en fonction du type d'objet ou d'action désiré.
	- De la même façon, il est également possible de trier les éléments d'un compartiment.
	- Le compartiment situé sous les armes contient les actions génériques de D&D5e.
	- La taille de chaque compartiment peut être changée en déplacant les barres rouges de gauche à droite. Il est possible d'étendre l'interface en faisant coulisser les lignes rouges au delà de la limite max.
	- Il est possible d'ajouter ou retirer des lignes d'emplacements en appuyant sur les boutons + et -, à droite de l'interface.
	- L'interface permets également d'effectuer des jets de caractéristiques, en cliquant sur le bouton en forme de dé au dessus du portrait.
	- Le bouclier en haut à gauche du portrait indique votre défense, le diamant en haut à droite apparaît en combat uniquement et indique vos PA. Il est possible d'ajouter d'autres caractéristiques si besoin/envie.
	- L'interface a été préparée pour chaque personnage mais vous êtes évidemment libres de l'arranger comme bon vous semble.
	- La touche 'H' permets de masquer ou afficher l'interface.
	- Le volet d'actions reste disponible pour ceux le préférant.
- Le volet d'actions a été mis à jour.
	- Il faut désormais effectuer un clic droit pour dérouler la description d'un objet ou une aptitude.
	- Il faut désormais cliquer sur le bouton en forme de dé pour effectuer une action.
- La fiche des containers (sacs, étuis à potion) à été mise à jour.
- Les grenades de poison infligent désormais des dégâts de poison à l'impact, en plus de l'empoisonnement. En cas de réussite à la sauvegarde, seule la moitié des dégâts est infligé.
- 2 nouvelles apparences de dés ont été ajouté, "Cosmic Rays Blue" et "A House Divided".
- Un effet spécial est désormais joué lorsqu'un 1 est obtenu sur les jets de dés à partir du d6.

---

## Classes

### Lansquenet

- Une fenêtre demandant l'utilisation de Tranchant furieux apparaît automatiquement lorsqu'une attaque est réalisée et qu'il reste des utilisations restantes sur Tranchant furieux.
	- Il s'agit d'un changement expérimental, si la fenêtre de confirmation s'avère pénible, merci de me le signaler.
- L'aptitude 'Double frappe' fonctionne à nouveau comme prévu. De plus, il a été décidé que l'utilisation d'objets à distance ne participerait pas au décompte du dé de Double frappe.

---

## Problèmes résolus

- Les joueurs peuvent à nouveau consulter la description des objets sur l'interface des marchands.
- L'erreur de portée insuffisante qui apparaissait lors d'une attaque d'opportunité a été corrigée.
- Les hachettes et couteaux de lancer fonctionnent à nouveau comme prévu.

---

## Problèmes connus

- Une erreur "Tray container not found" peut apparaître lors de la connexion. Elle est sans incidence.
- Sur l'interface BG3, les objets consommables affichent 1/1 quelle que soit leur quantité.
- Il se peut que le compartiment à armes de l'interface BG3 dysfonctionne.
	- Si cela arrive, rafraîchir la page devrait régler le problème.
