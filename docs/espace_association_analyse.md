# Analyse des besoins pour l'espace association

## Objectifs

Créer un espace dédié aux associations sur la plateforme Voisin Solidaire permettant de :
1. Gérer leur profil d'association
2. Créer et gérer des missions de bénévolat
3. Suivre les inscriptions des bénévoles
4. Analyser l'impact de leurs actions

## Parcours utilisateur association

### 1. Inscription et connexion
- Inscription spécifique pour les associations (avec validation)
- Connexion à l'espace association
- Récupération de mot de passe

### 2. Gestion du profil association
- Informations de base (nom, description, logo)
- Coordonnées et localisation
- Domaines d'intervention
- Équipe et contacts

### 3. Gestion des missions
- Création de nouvelles missions
- Modification des missions existantes
- Publication/dépublication de missions
- Suppression de missions
- Duplication de missions (pour les récurrentes)

### 4. Suivi des bénévoles
- Liste des bénévoles inscrits par mission
- Historique des participations
- Communication avec les bénévoles
- Validation des participations

### 5. Tableau de bord et analyses
- Statistiques de participation
- Impact des missions
- Évolution de l'engagement
- Rapports exportables

## Structure de données

### Association
```typescript
interface Association {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  address: string;
  city: string;
  postal_code: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  website?: string;
  phone?: string;
  email: string;
  categories: string[];
  created_at: string;
  updated_at: string;
}
```

### Mission (extension)
```typescript
interface Mission {
  // Champs existants...
  
  // Nouveaux champs
  association_id: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  recurring: boolean;
  recurring_pattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    end_date?: string;
  };
  requirements?: string;
  materials_provided?: string[];
  materials_needed?: string[];
  min_age?: number;
  accessibility_info?: string;
  contact_person?: {
    name: string;
    phone?: string;
    email?: string;
  };
}
```

### Participation (extension)
```typescript
interface MissionRegistration {
  // Champs existants...
  
  // Nouveaux champs
  attendance_confirmed: boolean;
  feedback_association?: string;
  feedback_volunteer?: string;
  rating_association?: number;
  rating_volunteer?: number;
  hours_completed?: number;
}
```

## Pages à développer

1. **Tableau de bord association**
   - Vue d'ensemble des missions et statistiques
   - Accès rapide aux fonctionnalités principales

2. **Gestion des missions**
   - Liste des missions avec filtres et recherche
   - Formulaire de création/édition de mission
   - Vue détaillée d'une mission

3. **Suivi des bénévoles**
   - Liste des bénévoles par mission
   - Profil de bénévole avec historique
   - Outils de communication

4. **Analyses et rapports**
   - Graphiques d'impact et de participation
   - Exportation de données
   - Indicateurs clés de performance

5. **Paramètres de l'association**
   - Édition du profil
   - Gestion des membres de l'association
   - Préférences de notification

## Intégration avec Supabase

### Tables supplémentaires
1. `associations` - Profils des associations
2. `association_members` - Membres des équipes association
3. `mission_templates` - Modèles pour missions récurrentes
4. `volunteer_feedback` - Retours sur les missions

### Fonctions RPC supplémentaires
1. `create_recurring_missions` - Génère des missions récurrentes
2. `calculate_association_impact` - Calcule les métriques d'impact
3. `validate_volunteer_participation` - Confirme la participation

## Considérations UX/UI

1. **Interface distincte**
   - Design adapté aux besoins des associations
   - Accès à des fonctionnalités avancées

2. **Ergonomie de gestion**
   - Formulaires intelligents avec suggestions
   - Actions par lot pour gérer plusieurs missions/bénévoles

3. **Visualisation des données**
   - Tableaux de bord interactifs
   - Graphiques d'évolution et de comparaison

4. **Responsive design**
   - Adaptation aux différents appareils
   - Focus sur desktop pour les tâches complexes
