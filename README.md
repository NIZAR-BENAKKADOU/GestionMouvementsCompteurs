# 📟 Gestion des Mouvements Compteurs

> Système de gestion des abonnés, compteurs et tournées de relevé — développé avec **ASP.NET Core 8** et **React.js**

---

## 🗂️ Table des matières

- [Présentation](#-présentation)
- [Architecture du projet](#-architecture-du-projet)
- [Technologies utilisées](#-technologies-utilisées)
- [Structure des dossiers](#-structure-des-dossiers)
- [Fonctionnalités](#-fonctionnalités)
- [Authentification](#-authentification)
- [API — Endpoints principaux](#-api--endpoints-principaux)
- [Lancer le projet en local](#-lancer-le-projet-en-local)
- [Comptes par défaut](#-comptes-par-défaut)

---

## 📌 Présentation

**GestionMouvementsCompteurs** est une application web full-stack permettant la gestion complète des abonnés, abonnements, tournées de relevé et mouvements de compteurs d'eau ou d'électricité.

Elle propose :
- Un **backend RESTful** sécurisé avec JWT
- Un **frontend React** moderne et responsive
- Une architecture **Clean Architecture / Domain-Driven Design (DDD)**

---

## 🏗️ Architecture du projet

Le projet respecte les principes de la **Clean Architecture** avec une séparation stricte en 4 couches :

```
┌─────────────────────────────────────────────┐
│              GestionCompteurs.API            │  ← Couche Présentation (Controllers, HTTP)
├─────────────────────────────────────────────┤
│         GestionCompteurs.Application         │  ← Couche Application (Services, DTOs, Interfaces)
├─────────────────────────────────────────────┤
│           GestionCompteurs.Domain            │  ← Couche Domaine (Entités, Enums)
├─────────────────────────────────────────────┤
│        GestionCompteurs.Infrastructure       │  ← Couche Infrastructure (EF Core, Repositories)
└─────────────────────────────────────────────┘
         gestion-compteurs-frontend             ← Frontend React.js
```

### Principes appliqués
- **DIP** — Dependency Inversion Principle (injection via interfaces)
- **Repository Pattern** — abstraction de l'accès aux données
- **DTO Pattern** — séparation des modèles de transfert
- **Service Layer** — logique métier isolée

---

## 🛠️ Technologies utilisées

### Backend
| Technologie | Rôle |
|---|---|
| ASP.NET Core 8 | Framework Web API |
| Entity Framework Core | ORM / accès base de données |
| SQL Server | Base de données relationnelle |
| JWT Bearer | Authentification stateless |
| BCrypt.Net | Hachage des mots de passe |
| Swagger / OpenAPI | Documentation de l'API |

### Frontend
| Technologie | Rôle |
|---|---|
| React.js 18 | Framework UI |
| React Router | Navigation SPA |
| Context API | Gestion d'état (Auth) |
| Axios / Fetch | Appels HTTP vers l'API |
| CSS Vanilla | Styles personnalisés |

---

## 📁 Structure des dossiers

```
GestionMouvementsCompteurs/
│
├── GestionCompteurs.API/               # Couche API
│   ├── Controllers/
│   │   ├── AbonneController.cs
│   │   ├── AbonnementController.cs
│   │   ├── AgenceController.cs
│   │   ├── AuthController.cs
│   │   ├── EtudeController.cs
│   │   ├── MouvementCompteurController.cs
│   │   └── TourneeController.cs
│   └── Program.cs
│
├── GestionCompteurs.Application/       # Couche Application
│   ├── DTOs/
│   ├── Interfaces/
│   ├── Services/
│   └── Validators/
│
├── GestionCompteurs.Domain/            # Couche Domaine
│   ├── Entities/
│   │   ├── Abonne.cs
│   │   ├── Abonnement.cs
│   │   ├── Agence.cs
│   │   ├── Etude.cs
│   │   ├── MouvementCompteur.cs
│   │   ├── Tournee.cs
│   │   └── Utilisateur.cs
│   └── Enums/
│
├── GestionCompteurs.Infrastructure/    # Couche Infrastructure
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   └── Repositories/
│
└── gestion-compteurs-frontend/         # Frontend React
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Abonnes.jsx
        │   ├── Abonnements.jsx
        │   ├── Agences.jsx
        │   ├── Tournees.jsx
        │   ├── Etudes.jsx
        │   ├── MouvementsCompteur.jsx
        │   ├── Analytics.jsx
        │   └── Login.jsx
        ├── components/
        ├── contexts/
        │   └── AuthContext.jsx
        └── services/
```

---

## ✨ Fonctionnalités

| Module | Description |
|---|---|
| 🏢 **Agences** | Gestion des agences (CRUD complet) |
| 👤 **Abonnés** | Gestion des abonnés avec import CSV |
| 📋 **Abonnements** | Suivi des contrats d'abonnement |
| 🗺️ **Tournées** | Planification des tournées de relevé |
| 📊 **Études** | Gestion des études techniques |
| 🔄 **Mouvements Compteur** | Enregistrement des relevés et mouvements |
| 📈 **Analytics** | Tableau de bord avec statistiques et graphiques |
| 🔐 **Authentification** | Login sécurisé avec JWT |

---

## 🔐 Authentification

L'application utilise **JWT (JSON Web Token)** pour sécuriser les endpoints.

- Le token est généré à la connexion via `POST /api/auth/login`
- Il doit être envoyé dans le header HTTP : `Authorization: Bearer <token>`
- Deux rôles sont définis : **Administration** et **Consultation**

---

## 🔌 API — Endpoints principaux

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Connexion utilisateur |
| `GET` | `/api/agences` | Liste des agences |
| `GET` | `/api/abonnes` | Liste des abonnés |
| `GET` | `/api/abonnements` | Liste des abonnements |
| `GET` | `/api/tournees` | Liste des tournées |
| `GET` | `/api/etudes` | Liste des études |
| `GET` | `/api/mouvementcompteur` | Liste des mouvements |
| `POST` | `/api/abonnes/import` | Import CSV d'abonnés |

> 📖 La documentation complète est disponible via **Swagger UI** sur : `http://localhost:5000/swagger`

---

## 🚀 Lancer le projet en local

### Prérequis
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- SQL Server (local ou distant)

### 1. Backend — ASP.NET Core API

```bash
# Se placer dans le dossier API
cd GestionCompteurs.API

# Configurer la chaîne de connexion dans appsettings.json
# "DefaultConnection": "Server=localhost;Database=GestionCompteurs;..."

# Appliquer les migrations
dotnet ef database update

# Lancer l'API
dotnet run
```

> L'API démarre sur `http://localhost:5000`  
> Swagger disponible sur `http://localhost:5000/swagger`

### 2. Frontend — React.js

```bash
# Se placer dans le dossier frontend
cd gestion-compteurs-frontend

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

> Le frontend démarre sur `http://localhost:3000`

---

## 👤 Comptes par défaut

Deux comptes sont créés automatiquement au démarrage de l'API :

| Login | Mot de passe | Rôle |
|---|---|---|
| `admin` | `Admin123!` | Administration (accès complet) |
| `consultation` | `Consul123!` | Consultation (lecture seule) |

---

## 👨‍💻 Auteur

**BENAKKADOU Nizar**  
Projet académique — Gestion des Mouvements Compteurs

---

*Développé avec ❤️ en ASP.NET Core 8 & React.js*
