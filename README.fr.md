<p align="right"><a href="README.md">Read in English</a></p>

# Shopify Bundle Selector — Sélecteur de paliers "Achetez plus, économisez plus"

Un sélecteur de paliers d'achat intégré au thème, pour les fiches produit
Shopify : le client choisit "Achetez 1 / 3 / 5" (ou tout autre palier
configuré), chacun avec sa propre réduction, et ajoute tout le pack au panier
en un seul clic — avec un sélecteur de variante (couleur, taille…) distinct
pour chaque unité du pack.

Conçu pour le thème **Shopify Horizon**. Aucune application tierce, aucun
abonnement mensuel, aucun poids ajouté à la page au-delà d'un petit web
component.

| Bundle Selector activé | Boutons d'achat natifs |
|---|---|
| ![Fiche produit avec le Bundle Selector : trois paliers, "Achetez 3" sélectionné avec les sélecteurs de couleur/taille par unité](docs/screenshots/bundle-selector-active.png) | ![Même produit avec les boutons standards de quantité et d'ajout au panier du thème](docs/screenshots/native-buy-buttons.png) |

## Fonctionnalités

- Nombre de paliers configurable, chacun avec un libellé, un sous-titre
  optionnel, et sa propre réduction : pourcentage, montant fixe, ou N unités
  offertes
- Badge de coin optionnel par palier (ex. "Plus populaire", "Meilleure
  offre")
- Économie affichée en `-15%` ou `-29,99$` — le marchand choisit le format
- Si le produit a des variantes, chaque unité d'un palier à plusieurs unités
  a son propre menu déroulant — on peut commander un pack de 3 en trois
  couleurs différentes en une seule commande
- Un clic ajoute chaque unité comme sa propre ligne de panier, taguée avec
  une propriété `_bundle_id` partagée, pour pouvoir les regrouper/suivre en
  aval
- Entièrement configurable depuis l'éditeur de thème : couleurs,
  typographie, espacement — aucune modification de code nécessaire pour le
  personnaliser
- Peut être fusionné dans le bloc natif "Boutons d'achat" du thème derrière
  une simple case à cocher, pour que le marchand puisse l'activer ou le
  désactiver par produit sans manipuler de blocs (voir
  `docs/integration-guide.md`)

## Contenu du dépôt

Ce dépôt contient **uniquement le code personnalisé de cette fonctionnalité**
— pas le thème Horizon complet, qui appartient à Shopify. Ces fichiers sont
à copier dans un thème Horizon existant (ou dérivé de Horizon).

| Chemin | Rôle |
|---|---|
| `blocks/bundle-tier.liquid` | Bloc enfant — un par palier. Calcule le prix, affiche la ligne, gère les sélecteurs de variante par unité |
| `blocks/bundle-selector.liquid` | Bloc parent autonome — à utiliser si tu veux le sélecteur comme bloc indépendant |
| `snippets/bundle-selector-styles.liquid` | Tout le CSS |
| `assets/bundle-selector.js` | Le web component `<bundle-selector-component>` — bascule entre paliers, résolution des variantes, ajout au panier |
| `locales/*.json`, `locales/*.schema.json` | Traductions anglais + français (texte client et éditeur) |
| `docs/integration-guide.md` | Comment l'installer en autonome, ou le fusionner dans le bloc natif de boutons d'achat de ton thème |
| `docs/gotchas.md` | Pièges techniques rencontrés en le construisant, pour ne pas les retrouver toi-même |

## Démarrage rapide

1. Copie `blocks/`, `snippets/`, `assets/` et les clés de `locales/` dans
   ton thème.
2. Dans l'éditeur de thème, ajoute le bloc **Bundle selector** à un modèle
   de produit, puis ajoute un ou plusieurs blocs **Bundle tier** en dessous.
3. Configure le libellé, le nombre d'unités et la réduction de chaque
   palier.

Pour la version fusionnée dans le bloc natif de boutons d'achat
(recommandée en production — permet au marchand de l'activer par produit
avec une seule case à cocher), voir `docs/integration-guide.md`.

## Limitation connue : prix affiché vs. prix au panier

Le prix affiché dans le sélecteur est **destiné à l'affichage uniquement**
— il n'est pas automatiquement appliqué au moment du paiement. Pour que le
prix facturé corresponde à ce qui est affiché, il faut choisir :

1. **Une réduction Shopify native correspondante**, configurée manuellement
   dans Admin → Réductions (le plus simple, zéro code — demande de garder
   les deux synchronisés à la main)
2. **Une Shopify Function** qui lit les propriétés de ligne `_bundle_id` /
   `_bundle_tier` déjà posées par ce sélecteur et applique la réduction
   automatiquement (solution propre et fiable, mais un développement
   d'extension d'app complet — pas du code de thème)
3. **Des variantes/produits de bundle dédiés** à prix fixe, pour que le
   sélecteur ajoute une vraie variante "Pack de 3" plutôt que 3× la variante
   normale

À trancher avec le propriétaire de la boutique *avant* de le mettre en place
— ça détermine l'ampleur du travail côté backend.

## Licence

MIT — voir `LICENSE`.
