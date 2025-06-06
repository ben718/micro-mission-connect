# Arborescence et Parcours Utilisateur - Voisin Solidaire

## Structure du site

### 1. Zone Publique
- **Page d'accueil** - Présentation du concept et appel à l'action
- **Comment ça marche** - Explication du processus en 3 étapes
- **Témoignages** - Retours d'expérience de bénévoles et associations
- **FAQ** - Questions fréquentes
- **Inscription/Connexion** - Accès à l'espace personnel

### 2. Zone Authentifiée
- **Tableau de bord** - Vue d'ensemble personnalisée
- **Explorer les missions** - Recherche et filtrage des opportunités
- **Détail d'une mission** - Informations complètes et inscription
- **Mes missions** - Suivi des engagements passés, en cours et à venir
- **Profil utilisateur** - Informations personnelles et préférences
- **Impact** - Visualisation de l'impact personnel et collectif
- **Badges et récompenses** - Système de gamification

## Parcours utilisateur optimaux

### Parcours 1: Première visite et inscription
1. **Arrivée sur la page d'accueil**
   - Présentation du concept "Aider en 15 minutes"
   - Mise en avant des 3 promesses: 15 min minimum, <15 min de trajet, 2 clics
   - Call-to-action principal: "Rejoindre Voisin Solidaire"

2. **Inscription rapide**
   - Formulaire minimal: email + mot de passe (ou connexion sociale)
   - Option d'inscription en 1 clic via Google/Facebook
   - Pas de vérification d'email obligatoire pour commencer

3. **Onboarding personnalisé**
   - Demande de géolocalisation (avec explication claire de l'utilité)
   - Sélection des centres d'intérêt (max 3 catégories)
   - Définition des disponibilités habituelles (optionnel)

4. **Redirection vers le tableau de bord**
   - Message de bienvenue personnalisé
   - Suggestions de missions adaptées au profil
   - Guide visuel rapide des fonctionnalités principales

**Indicateurs de performance:**
- Temps total d'inscription < 1 minute
- Taux d'abandon < 20%
- Taux de complétion de l'onboarding > 80%

### Parcours 2: Recherche et participation à une mission

1. **Accès à l'explorateur de missions**
   - Depuis le tableau de bord ou la barre de navigation
   - Géolocalisation automatique (avec option de modification)
   - Affichage immédiat des missions à proximité

2. **Filtrage contextuel**
   - Filtre principal: "Disponible maintenant" (missions immédiates)
   - Filtres secondaires: durée (15min, 30min, 1h+), catégorie, distance
   - Affichage en liste ou carte interactive

3. **Consultation d'une mission**
   - Informations essentielles visibles sans scroll
   - Visualisation claire de la localisation et du temps de trajet
   - Présentation de l'impact attendu de la mission

4. **Inscription à la mission**
   - Bouton d'action principal "Participer" (1 clic)
   - Confirmation instantanée (sans attente de validation)
   - Instructions immédiates pour démarrer

5. **Après la mission**
   - Notification pour confirmer la réalisation
   - Feedback rapide sur l'expérience (1-5 étoiles)
   - Partage de l'impact réalisé et des points gagnés

**Indicateurs de performance:**
- Temps de recherche < 30 secondes
- Nombre de clics pour s'inscrire ≤ 2
- Taux de missions complétées > 80%

### Parcours 3: Suivi d'impact et engagement

1. **Accès au tableau de bord personnel**
   - Vue synthétique de l'activité et de l'impact
   - Statistiques visuelles: heures données, missions réalisées, impact généré
   - Prochaines missions planifiées

2. **Consultation de la page d'impact**
   - Visualisation détaillée des contributions
   - Comparaison avec la communauté locale
   - Objectifs personnalisés et progression

3. **Découverte des badges et récompenses**
   - Badges déjà obtenus mis en valeur
   - Prochains badges à débloquer avec conditions claires
   - Avantages associés aux niveaux d'engagement

4. **Partage social**
   - Option de partage d'une réalisation ou d'un badge
   - Message pré-formaté personnalisable
   - Invitation à rejoindre la communauté

**Indicateurs de performance:**
- Fréquence de consultation du tableau de bord > 1 fois/semaine
- Taux de partage social > 15%
- Taux de rétention après 1 mois > 50%

## Wireframes des écrans principaux

### 1. Page d'accueil (non connecté)
```
+-----------------------------------------------+
|  LOGO           COMMENT ÇA MARCHE   CONNEXION |
+-----------------------------------------------+
|                                               |
|  AIDER EN 15 MINUTES                          |
|  Missions de micro-bénévolat près de chez vous|
|                                               |
|  [REJOINDRE MAINTENANT]    [DÉCOUVRIR]        |
|                                               |
+-----------------------------------------------+
|                                               |
|  COMMENT ÇA MARCHE                            |
|  +----------+  +----------+  +----------+     |
|  | 1. TROUVE|  | 2. AIDE  |  | 3. MESURE|     |
|  | Mission  |  | 15min min|  | Impact   |     |
|  +----------+  +----------+  +----------+     |
|                                               |
+-----------------------------------------------+
|                                               |
|  MISSIONS POPULAIRES                          |
|  +----------+  +----------+  +----------+     |
|  | Mission 1|  | Mission 2|  | Mission 3|     |
|  | 15min    |  | 30min    |  | 15min    |     |
|  | 0.5km    |  | 1.2km    |  | 0.8km    |     |
|  +----------+  +----------+  +----------+     |
|                                               |
+-----------------------------------------------+
```

### 2. Tableau de bord (connecté)
```
+-----------------------------------------------+
|  LOGO      EXPLORER    MES MISSIONS    PROFIL |
+-----------------------------------------------+
|                                               |
|  Bonjour [Prénom],                            |
|                                               |
|  MISSIONS PRÈS DE CHEZ VOUS                   |
|  +----------+  +----------+  +----------+     |
|  | Mission 1|  | Mission 2|  | Mission 3|     |
|  | 15min    |  | 30min    |  | 15min    |     |
|  | 0.5km    |  | 1.2km    |  | 0.8km    |     |
|  +----------+  +----------+  +----------+     |
|                                               |
|  VOTRE IMPACT                                 |
|  +------------------+  +------------------+   |
|  | 3 missions       |  | 2 associations   |   |
|  | complétées       |  | aidées           |   |
|  +------------------+  +------------------+   |
|  +------------------+  +------------------+   |
|  | 45 minutes       |  | 2 badges         |   |
|  | de bénévolat     |  | obtenus          |   |
|  +------------------+  +------------------+   |
|                                               |
+-----------------------------------------------+
|  EXPLORER    MES MISSIONS    IMPACT    PROFIL |
+-----------------------------------------------+
```

### 3. Explorateur de missions
```
+-----------------------------------------------+
|  LOGO      EXPLORER    MES MISSIONS    PROFIL |
+-----------------------------------------------+
|                                               |
|  EXPLORER LES MISSIONS                        |
|                                               |
|  [DISPONIBLE MAINTENANT] [PLANIFIER]          |
|                                               |
|  Filtres: [15min] [30min] [1h+] [Catégories ▼]|
|                                               |
|  LISTE (12)         [CARTE]                   |
|                                               |
|  +-------------------------------------------+|
|  | Aide aux courses - Épicerie solidaire     ||
|  | 15 min • 0.5 km • Dans 10 min             ||
|  | Association: Les Restos du Cœur           ||
|  | [PARTICIPER]                              ||
|  +-------------------------------------------+|
|                                               |
|  +-------------------------------------------+|
|  | Distribution de repas - Centre d'accueil  ||
|  | 30 min • 1.2 km • Maintenant              ||
|  | Association: Secours Populaire            ||
|  | [PARTICIPER]                              ||
|  +-------------------------------------------+|
|                                               |
+-----------------------------------------------+
|  EXPLORER    MES MISSIONS    IMPACT    PROFIL |
+-----------------------------------------------+
```

### 4. Détail d'une mission
```
+-----------------------------------------------+
|  LOGO      EXPLORER    MES MISSIONS    PROFIL |
+-----------------------------------------------+
|                                               |
|  < RETOUR AUX MISSIONS                        |
|                                               |
|  Aide aux courses - Épicerie solidaire        |
|  15 min • 0.5 km • Dans 10 min                |
|                                               |
|  DESCRIPTION                                  |
|  Aidez à porter les courses des bénéficiaires |
|  de l'épicerie solidaire jusqu'à leur domicile|
|  ou leur véhicule. Particulièrement utile pour|
|  les personnes âgées ou à mobilité réduite.   |
|                                               |
|  INFORMATIONS                                 |
|  • Date: Aujourd'hui, 14h30-14h45             |
|  • Adresse: 12 rue des Lilas, 75011 Paris     |
|  • Association: Les Restos du Cœur            |
|  • Places: 2/3 disponibles                    |
|                                               |
|  [CARTE]                                      |
|                                               |
|  [PARTICIPER À CETTE MISSION]                 |
|                                               |
+-----------------------------------------------+
|  EXPLORER    MES MISSIONS    IMPACT    PROFIL |
+-----------------------------------------------+
```

### 5. Profil et impact
```
+-----------------------------------------------+
|  LOGO      EXPLORER    MES MISSIONS    PROFIL |
+-----------------------------------------------+
|                                               |
|  PROFIL    IMPACT    BADGES    PARAMÈTRES     |
|                                               |
|  VOTRE IMPACT                                 |
|                                               |
|  +------------------+  +------------------+   |
|  | 3 missions       |  | 2 associations   |   |
|  | complétées       |  | aidées           |   |
|  +------------------+  +------------------+   |
|  +------------------+  +------------------+   |
|  | 45 minutes       |  | 120 points       |   |
|  | de bénévolat     |  | d'impact         |   |
|  +------------------+  +------------------+   |
|                                               |
|  PROGRESSION                                  |
|  Niveau: Voisin Solidaire Débutant            |
|  [===========------] 45%                      |
|  Encore 2 missions pour devenir Intermédiaire |
|                                               |
|  HISTORIQUE D'IMPACT                          |
|  [GRAPHIQUE D'ÉVOLUTION]                      |
|                                               |
+-----------------------------------------------+
|  EXPLORER    MES MISSIONS    IMPACT    PROFIL |
+-----------------------------------------------+
```

## Interactions clés et micro-animations

Pour renforcer l'aspect intuitif et engageant de l'interface, plusieurs interactions clés et micro-animations seront implémentées :

1. **Transition fluide entre les écrans**
   - Animation de slide horizontal entre les pages principales
   - Effet de fade-in pour les éléments de contenu

2. **Feedback visuel immédiat**
   - Animation de pulsation sur les boutons d'action
   - Effet de confetti lors de la validation d'une mission
   - Animation de progression pour les barres de niveau

3. **Interactions carte/liste**
   - Transition fluide entre vue carte et vue liste
   - Animation de zoom sur la carte lors de la sélection d'une mission
   - Effet de survol sur les marqueurs de la carte

4. **Notifications contextuelles**
   - Animation subtile pour les notifications entrantes
   - Indicateurs de progression animés
   - Toast notifications non intrusives pour les confirmations

Ces parcours utilisateur et cette structure d'interface sont conçus pour maximiser l'engagement tout en minimisant les frictions, conformément au concept d'ubérisation du bénévolat qui requiert simplicité, rapidité et satisfaction immédiate.
