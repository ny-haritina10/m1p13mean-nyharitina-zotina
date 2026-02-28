# Document de Présentation de l'Application Web

## 1. Introduction et Présentation Générale

L'application web développée constitue une plateforme de gestion intégrée pour un centre commercial, offrant une infrastructure complète permettant l'administration centralisée des espaces commerciaux, la gestion des boutiques et le suivi des transactions commerciales. Cette solution numérique a été conçue selon une architecture moderne fondée sur le framework Angular 18 pour le frontend et Node.js/Express pour le backend, avec une base de données MongoDB.

Le système s'articule autour de trois rôles distincts, chacun disposant d'une interface personnalisée répondant à ses besoins spécifiques : l'administrateur du centre commercial, les gérants de boutiques (vendeurs), et les clients. Cette architecture multi-rôles permet une gestion fine des permissions et une expérience utilisateur optimisée pour chaque type d'acteur.

---

## 2. Description des Écrans par Rôle

### 2.1 Rôle Administrateur

L'administrateur dispose d'un panel complet d'outils pour gérer l'ensemble des opérations du centre commercial. Cette section détaille chaque écran accessible au travers du tableau de bord administratif.

#### 2.1.1 Tableau de Bord (Dashboard)

Le tableau de bord administratif constitue le point d'entrée principal pour l'administrateur. Cet écran affiche un aperçu synthétique de l'état actuel du centre commercial, incluant des indicateurs clés de performance tels que le nombre de boutiques actives, le taux d'occupation des espaces commerciaux, et les revenus générés. L'interface présente des cartes statistiques colorées facilitant la lecture rapide des informations essentielles.

#### 2.1.2 Gestion des Vendeurs

L'écran de gestion des vendeurs permet à l'administrateur de visualiser l'ensemble des boutiques enregistrées dans le système. Chaque vendeur est associé à un nom d'utilisateur, un nom de boutique, un numéro de téléphone, ainsi qu'un statut pouvant être « en attente », « approuvé », « rejeté » ou « suspendu ». L'administrateur dispose de fonctionnalités complètes incluant l'ajout de nouveaux vendeurs via un formulaire dédié, la modification des informations existantes, l'approbation des demandes en attente, le rejet ou la suspension de comptes. Un système de filtres par statut facilite la recherche et la gestion des vendeurs.

#### 2.1.3 Liste des Espaces Commerciaux

Cet écran présente l'inventaire complet des espaces commerciaux disponibles au sein du centre commercial. Chaque espace est caractérisé par son nom, son type (box, kiosque ou stand), son étage, son emplacement, sa surface en mètres carrés, son prix mensuel ainsi que son statut actuel (disponible, occupé ou en maintenance). L'interface propose des filtres multiples permettant de trier les espaces par statut, type et étage, facilitant ainsi la recherche d'espaces répondant à des critères spécifiques.

#### 2.1.4 Création d'un Nouvel Espace

L'écran de création d'espace commercial permet à l'administrateur d'ajouter de nouveaux espaces locatifs au système. Le formulaire récupère les informations essentielles : nom de l'espace, type, étage, emplacement précis, surface et prix mensuel. Cette fonctionnalité permet d'enrichir continuellement l'offre commerciale du centre.

#### 2.1.5 Disponibilité des Espaces

Cet écran offre une vue d'ensemble sur la disponibilité des différents espaces commerciaux. L'administrateur peut rapidement identifier les espaces libres, occupés ou en maintenance, facilitant ainsi la planification et l'attribution des espaces aux futurs locataires.

#### 2.1.6 Plan Interactif du Centre Commercial

Le plan interactif représente une innovation majeure de l'application, offrant une visualisation graphique de l'ensemble du centre commercial. Cet écran présente une carte SVG interactive permettant de naviguer entre les différents étages et de visualiser la position de chaque espace commercial. Chaque espace est représenté par un rectangle coloré selon son statut : vert pour disponible, rouge pour occupé, et gris pour maintenance. Un système de légende explique les codes couleur utilisés. En cliquant sur un espace, une fenêtre modale affiche les informations détaillées incluant le type, l'étage, le statut, la surface, le prix mensuel, et le cas échéant les informations du contrat en cours avec le locataire.

#### 2.1.7 Liste des Contrats

L'écran de gestion des contrats présente l'ensemble des baux commerciaux signés entre le centre commercial et les boutiques. Chaque contrat affiche les informations suivantes : boutique locataire, espace commercial attribué, date de début, date de fin, loyer mensuel et statut du contrat (actif, expiré ou résilié). L'administrateur peut filtrer les contrats par statut et dispose de la possibilité de résilier un contrat actif via un bouton d'action dédié.

#### 2.1.8 Création de Contrat

Cet écran permet à l'administrateur de créer un nouveau contrat de location. Le formulaire inclut les informations relatives au locataire (sélection parmi les vendeurs approuvés), l'espace commercial à attribuer, les dates de début et de fin du bail, ainsi que le montant du loyer mensuel. Cette fonctionnalité formalise la relation contractuelle entre le centre commercial et chaque locataire.

#### 2.1.9 Gestion des Loyers

L'écran de gestion des loyers constitue un module financier essentiel pour l'administrateur. Il présente des statistiques synthétiques incluant le total attendu, le total collecté, le montant impayé et le nombre de retards. Une grille de filtres permet de raffiner l'affichage par statut de paiement (en attente, payé, en retard), par mois et par année. Le tableau détaillé liste chaque loyer avec les informations du vendeur, l'espace concerné, le mois, le montant, les pénalités éventuelles, le total, la date d'échéance et le statut. L'administrateur peut marquer un loyer comme payé, générer une facture ou télécharger le PDF correspondant.

#### 2.1.10 Génération de Loyer

Cet écran permet de générer périodiquement les quittances de loyer pour l'ensemble des contrats actifs. L'administrateur peut sélectionner le mois et l'année concernés, puis lancer la génération qui crée automatiquement les écritures de loyer pour chaque espace occupé.

#### 2.1.11 Tableau de Bord Financier

Le tableau de bord financier offre une vision consolidée de la situation économique du centre commercial. Quatre cartes statistiques présentent le revenu total attendu, le revenu collecté, le montant impayé et le taux de collecte. Deux graphiques majeurs affichent les revenus du mois en cours et les revenus de l'année. Des indicateurs supplémentaires montrent le nombre de paiements effectués, en attente et en retard. Des boutons de navigation permettent d'accéder aux rapports mensuels, annuels et à la gestion des loyers.

#### 2.1.12 Rapport Mensuel

Cet écran génère un rapport détaillé des opérations du mois sélectionné. Il présente les revenus générés, le nombre de transactions, les espaces les plus demandés et diverses métriques pertinentes pour l'analyse mensuelle de la performance du centre commercial.

#### 2.1.13 Rapport Annuel

Le rapport annuel offre une vue d'ensemble sur l'exercice complet, avec des statistiques consolidées incluant les revenus totaux, l'évolution mensuelle, la comparaison avec l'année précédente et les tendances générales du centre commercial.

---

### 2.2 Rôle Boutique (Vendeur)

Les gérants de boutiques disposent d'une interface dédiée leur permettant de gérer leur activité commerciale au jour le jour. Cette section décrit l'ensemble des écrans disponibles pour ce rôle.

#### 2.2.1 Catalogue des Produits

L'écran du catalogue produits permet aux vendeurs de gérer l'inventaire de leur boutique. La liste affiche chaque produit avec son image, son nom, sa catégorie, son prix, son stock actuel et son statut (actif, inactif ou rupture de stock). Une barre de filtres permet de rechercher un produit par nom, de filtrer par catégorie et par statut. Chaque produit dispose d'actions de modification et de suppression. Un indicateur visuel signale les produits dont le stock est inférieur au seuil d'alerte défini.

#### 2.2.2 Ajout et Modification de Produit

Les écrans d'ajout et de modification de produit permettent de gérer les références du catalogue. Le formulaire inclut les informations suivantes : nom du produit, description, catégorie, prix, images, stock initial et seuil d'alerte de stock. Ces écrans permettent aux vendeurs de maintenir leur catalogue à jour et d'ajouter de nouvelles références.

#### 2.2.3 Catégories

Cet écran permet de visualiser et gérer les catégories de produits proposées dans la boutique. L'administrateur peut ajouter de nouvelles catégories, les modifier ou les désactiver si nécessaire.

#### 2.2.4 État des Stocks

L'écran d'état des stocks offre une vision détaillée et chronologique des mouvements de stock. Le tableau présente pour chaque produit : le stock initial, le total des entrées, le total des sorties, le stock actuel, le seuil d'alerte et l'état global (en stock, stock faible, rupture). Des filtres par date, catégorie et état du stock permettent une analyse pointue. Des statistiques récapitulatives montrent le nombre de produits en stock, en stock faible et en rupture.

#### 2.2.5 Mouvement de Stock

Cet écran permet d'enregistrer les mouvements de stock (entrées et sorties). Le vendeur peut sélectionner le produit concerné, le type de mouvement, la quantité et la date. Cette fonctionnalité assure un suivi précis de l'inventaire et permet de maintenir des données de stock fiables.

#### 2.2.6 Liste des Ventes

L'écran de liste des ventes présente l'historique complet des transactions réalisées en boutique. Chaque vente affiche la date, le client, le nombre de produits, le montant total et le statut de la commande. Cette vue permet aux vendeurs de suivre leur activité commerciale et de retracer l'historique des transactions.

#### 2.2.7 Formulaire de Vente

Le formulaire de vente permet d'enregistrer manuellement une nouvelle transaction. Le vendeur sélectionne les produits, indique les quantités, et le système calcule automatiquement le total. Cette fonctionnalité complète les achats effectués en ligne par les clients.

#### 2.2.8 Promotions

L'écran de gestion des promotions permet de définir des offres spéciales sur certains produits. La liste affiche chaque produit en promotion avec son prix normal, son prix promotionnel, le pourcentage de réduction, les dates de début et de fin, ainsi que le statut (active ou expirée). Le vendeur peut créer de nouvelles promotions ou supprimer celles en cours.

#### 2.2.9 Création de Promotion

Cet écran permet de définir une nouvelle promotion en sélectionnant le produit concerné, en indiquant le prix promotionnel et les dates de validité. Le système calcule automatiquement le pourcentage de réduction appliqué.

#### 2.2.10 Rapport Journalier

Le rapport journalier présente les statistiques de la journée en cours : nombre de ventes réalisées, chiffre d'affaires, produits les plus vendus, et tendances de la journée. Cet outil permet aux vendeurs de suivre leur performance quotidienne.

#### 2.2.11 Profil de la Boutique

L'écran de profil permet au vendeur de gérer les informations de sa boutique : nom de la boutique, coordonnées, horaires d'ouverture et autres informations pertinentes affichées aux clients.

---

### 2.3 Rôle Client

Les clients bénéficient d'une interface d'achat en ligne leur permettant de parcourir les produits, de gérer leur panier et de suivre leurs commandes. Cette section détaille les écrans dédiés aux clients.

#### 2.3.1 Liste des Produits

L'écran de liste des produits constitue la vitrine principale pour les clients. Il présente l'ensemble des produits disponibles dans les différentes boutiques du centre commercial. L'interface inclut une barre de recherche permettant de trouver des produits par mot-clé. Un système de filtres avancés permet de affiner la recherche par catégorie, par boutique, par fourchette de prix, par promotion et par ordre de tri. Les produits sont affichés sous forme de cartes avec leur image, leur nom, leur boutique, leur prix et un indicateur de promotion éventuelle. La pagination permet de naviguer entre les nombreuses pages de résultats.

#### 2.3.2 Détail d'un Produit

La page de détail d'un produit affiche les informations complètes : images multiples, nom, description, catégorie, boutique vendeuse, prix, disponibilité en stock et promotions applicables. Le client peut sélectionner la quantité désirée et ajouter le produit directement à son panier.

#### 2.3.3 Panier

L'écran du panier présente l'ensemble des produits sélectionnés par le client, groupés par boutique vendeuse. Pour chaque produit, le client peut modifier la quantité ou supprimer l'article. Le résumé du panier affiche le sous-total par boutique et le total général. Un bouton de passage à la commande permet de finaliser l'achat.

#### 2.3.4 Historique des Commandes

La page d'historique des commandes permet au client de suivre l'ensemble de ses achats. Chaque commande affiche la date, le nombre de produits, le montant total et le statut (en cours, livrée, annulée). Le client peut cliquer sur une commande pour en voir le détail.

#### 2.3.5 Détail d'une Commande

L'écran de détail d'une commande affiche les informations complètes d'une transaction spécifique : numéro de commande, date, statut, liste des produits achetés avec leurs prix et quantités, montant total, et informations de livraison. Cette interface permet au client de retracer précisément le contenu et le suivi de chaque commande.

---

## 3. Conclusion

L'application web présentée offre une solution complète et intégrée pour la gestion d'un centre commercial. Les trois interfaces distinctes répondent aux besoins spécifiques de chaque catégorie d'utilisateurs : l'administrateur dispose d'outils complets pour la gestion des espaces, des contrats et des finances ; les vendeurs peuvent gérer leur catalogue, leurs stocks et leurs promotions ; les clients bénéficient d'une expérience d'achat fluide et moderne. L'architecture technique moderne (Angular 18, Node.js, MongoDB) garantit performance, scalabilité et maintenabilité de la solution.