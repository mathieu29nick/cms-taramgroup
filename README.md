# CMS Admin – Multi-Network Content Management System

## Description

CMS Admin est une application fullstack permettant la gestion d’articles multi-réseaux avec segmentation par rôle utilisateur (Admin / Editor).

Le projet comprend :

- Un backend Node.js + Express avec validation Zod
- Un frontend Next.js + Material UI
- Un système de rôles dynamique via Zustand
- Une segmentation par réseau
- Un dashboard analytique avec graphiques

L’objectif est de proposer une base solide, modulaire et extensible de CMS multi-tenant.

---

## Prérequis

- Node.js >= 18
- npm >= 9

---

## Installation

### 1️⃣ Cloner le projet

```bash
git clone <https://github.com/mathieu29nick/cms-taramgroup.git>
cd cms-taramgroup
```

### 2️⃣ Installer le backend

```bash
cd cms-backend
npm install
```

### 3️⃣ Installer le frontend

```bash
cd ../cms-frontend
npm install
```

---

## Lancement

### 🔹 Démarrer le backend

```bash
cd cms-backend
npm run dev
```

Backend disponible sur :

```
http://localhost:5000
```

---

### 🔹 Démarrer le frontend

```bash
cd cms-frontend
npm run dev
```

Frontend disponible sur :

```
http://localhost:3000
```

---

## Choix techniques

### Architecture choisie

Architecture séparée Frontend / Backend :

- Backend REST API (Express)
- Frontend Next.js (App Router)
- Stockage JSON local pour simplifier l’environnement

Ce choix permet :
- Séparation claire des responsabilités
- Facilité de migration vers base de données (PostgreSQL, MongoDB)
- Scalabilité future

---

### Technologies utilisées

#### Backend

- Node.js
- Express
- Zod (validation stricte des données)
- UUID
- Jest + Supertest (tests unitaires)
- Middleware RBAC (requireAdmin)

#### Frontend

- Next.js (App Router)
- React 19
- Material UI
- DataGrid MUI
- Recharts (graphiques)
- Zustand (state management global + persist)
- React Hook Form + Zod
- Tiptap (éditeur riche)

---

### Justification des choix

- Zustand choisi pour sa simplicité et performance (plus léger que Redux)
- Zod pour validation backend robuste
- MUI pour rapidité de développement et cohérence UI
- App Router pour modernité et séparation SSR / Client

---

### Compromis effectués

- Stockage JSON au lieu d’une base de données
- Pas d’authentification réelle (simulation via header x-role)
- Tests automatisés limités (3 tests principaux)

---

## Fonctionnalités implémentées

### Dashboard

- Total articles
- Répartition par statut
- Répartition par réseau
- Graphique camembert par catégorie
- 5 derniers articles publiés
- Dernières notifications envoyées

**Statut : ✅ Complet**

---

### Gestion des articles

- Tableau triable
- Recherche en temps réel
- Filtres combinables (statut, catégorie, réseau, featured)
- Pagination (20 items)
- Actions rapides
- Changement de statut en masse
- Éditeur riche (Tiptap)
- Auto-save draft toutes les 30 secondes
- Indicateur modifications non sauvegardées

**Statut : ✅ Complet**

---

### Gestion des catégories

- Liste avec couleurs
- Création / modification / suppression
- Compteur d’articles
- Suppression bloquée si utilisée
- Restriction Admin

**Statut : ✅ Complet**

---

### Gestion des réseaux

- Liste simple
- Nombre d’articles par réseau

**Statut : ✅ Complet**

---

### Notifications

- Formulaire d’envoi
- Destinataires multiples
- Sujet personnalisable
- Prévisualisation HTML
- Historique des envois
- Statut envoyé / échoué

**Statut : ✅ Complet**

---

### Import JSON

- Upload fichier
- Validation du format
- Rapport succès / erreurs

**Statut : ✅ Complet**

---

### RBAC (Role Based Access Control)

- Toggle Admin / Editor
- Permissions dynamiques sans refresh
- Sécurisation backend via middleware

**Statut : ✅ Complet**

---

## Tests

Tests unitaires implémentés avec **Jest + Supertest** :

- Validation Zod (400 Bad Request)
- RBAC (403 Forbidden)
- Logique métier (impossible de supprimer une catégorie utilisée)

Lancer les tests :

```bash
cd cms-backend
npm run test
```

Avec coverage :

```bash
npm run test -- --coverage
```

---

## Ce qui aurait été fait avec plus de temps

### Priorité haute

1. Implémentation JWT réelle
2. Base de données PostgreSQL
3. Pagination backend optimisée
4. Tests plus complets (services + mocks)
5. CI/CD GitHub Actions

### Priorité moyenne

6. Mode dark
7. Internationalisation
8. Optimisation performances DataGrid

### Priorité basse

9. Gestion d’images
10. Audit trail complet
11. Mode multi-tenant avancé

---

## Difficultés rencontrées

### 1️⃣ Hydration error (Next + MUI)

Problème : mismatch SSR  
Solution : utilisation de AppRouterCacheProvider pour Emotion.

---

### 2️⃣ Zustand + persist hydration

Problème : useEffect crash  
Solution : gestion propre des dépendances et initialisation stable.

---

### 3️⃣ Gestion des rôles dynamique

Problème : synchronisation front/back  
Solution : injection dynamique du header x-role via Zustand.

---

### 4️⃣ Validation stricte Zod

Problème : erreurs 400 inattendues  
Solution : alignement précis schéma backend / formulaire frontend.

---

## Conclusion

Le projet fournit une base solide de CMS multi-réseaux avec :

- Séparation claire front/back
- Validation robuste
- Segmentation par rôle
- UI moderne et cohérente
- Architecture extensible

---