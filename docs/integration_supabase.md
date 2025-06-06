# Rapport d'intégration Supabase - Voisin Solidaire

## Introduction

Ce document présente l'intégration de Supabase comme backend pour l'application Voisin Solidaire. Cette intégration permet de transformer la maquette frontend en une application complètement fonctionnelle avec authentification et gestion des données en temps réel.

## Configuration de Supabase

L'intégration utilise les paramètres suivants :
- URL Supabase : `https://uqpcjxpbxnbrbjefkwar.supabase.co`
- Clé API anonyme : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcGNqeHBieG5icmJqZWZrd2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMDQ2ODMsImV4cCI6MjA2NDY4MDY4M30.DBtB4CcgKmW4BKee70uPKlfZBGssxSXrYCzTb3UOrOg`

## Services implémentés

### 1. Service d'authentification
- Inscription utilisateur
- Connexion utilisateur
- Déconnexion
- Récupération de la session active
- Récupération du profil utilisateur

### 2. Service de gestion des missions
- Récupération de toutes les missions
- Récupération d'une mission par ID
- Inscription à une mission
- Annulation d'une inscription
- Récupération des missions d'un utilisateur

### 3. Service de gestion des profils
- Récupération du profil utilisateur
- Mise à jour du profil
- Téléchargement d'avatar

## Structure de la base de données

L'intégration suppose la présence des tables suivantes dans Supabase :

1. **profiles** - Informations des utilisateurs
   - id (clé primaire, liée à auth.users)
   - email
   - first_name
   - last_name
   - avatar_url (optionnel)
   - preferences (JSON, optionnel)
   - stats (JSON, optionnel)

2. **missions** - Missions de bénévolat
   - id (clé primaire)
   - title
   - description
   - organization_name
   - organization_id
   - duration (en minutes)
   - distance (en km)
   - timing ('now', 'soon', ou date)
   - date (optionnel)
   - time_start (optionnel)
   - time_end (optionnel)
   - location (JSON)
   - spots_taken
   - spots_available
   - category
   - skills (tableau, optionnel)
   - impact (optionnel)
   - created_at

3. **mission_registrations** - Inscriptions aux missions
   - id (clé primaire)
   - user_id (clé étrangère vers profiles)
   - mission_id (clé étrangère vers missions)
   - status ('pending', 'confirmed', 'completed', 'cancelled')
   - created_at

## Fonctions RPC

L'intégration utilise les fonctions RPC suivantes :

1. **increment_spots_taken** - Incrémente le nombre de places prises pour une mission
   ```sql
   CREATE OR REPLACE FUNCTION increment_spots_taken(mission_id UUID)
   RETURNS void AS $$
   BEGIN
     UPDATE missions
     SET spots_taken = spots_taken + 1
     WHERE id = mission_id;
   END;
   $$ LANGUAGE plpgsql;
   ```

2. **decrement_spots_taken** - Décrémente le nombre de places prises pour une mission
   ```sql
   CREATE OR REPLACE FUNCTION decrement_spots_taken(mission_id UUID)
   RETURNS void AS $$
   BEGIN
     UPDATE missions
     SET spots_taken = GREATEST(0, spots_taken - 1)
     WHERE id = mission_id;
   END;
   $$ LANGUAGE plpgsql;
   ```

## Modifications apportées au frontend

1. **Création du client Supabase**
   - Fichier `src/lib/supabase.ts` avec configuration et services

2. **Adaptation des stores**
   - `authStore.ts` - Utilise maintenant les services d'authentification Supabase
   - `missionStore.ts` - Utilise les services de mission Supabase

3. **Mise à jour du contexte d'authentification**
   - `AuthContext.tsx` - Gère l'état d'authentification avec Supabase

4. **Adaptation des composants**
   - Pages de connexion et d'inscription connectées à Supabase
   - Composants de mission utilisant les données réelles

## Validation et tests

Pour valider l'intégration, les tests suivants doivent être effectués :

1. **Authentification**
   - Création d'un nouveau compte
   - Connexion avec un compte existant
   - Déconnexion
   - Persistance de session après rechargement de page

2. **Gestion des missions**
   - Affichage de la liste des missions
   - Filtrage des missions
   - Affichage du détail d'une mission
   - Inscription à une mission
   - Annulation d'une inscription

3. **Profil utilisateur**
   - Affichage des informations du profil
   - Mise à jour des informations du profil
   - Affichage des missions de l'utilisateur

## Prochaines étapes

1. **Optimisation des performances**
   - Mise en cache des données fréquemment utilisées
   - Pagination pour les listes de missions

2. **Fonctionnalités avancées**
   - Notifications en temps réel avec Supabase Realtime
   - Géolocalisation pour les missions à proximité
   - Système de recommandation basé sur les préférences utilisateur

3. **Sécurité**
   - Mise en place de Row Level Security (RLS) dans Supabase
   - Validation des données côté client et serveur
