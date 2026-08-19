# GestionMouvementsCompteurs - Docker Setup

## Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré

## Lancer l'application

```bash
docker-compose up --build
```

Le premier démarrage prend environ **2-3 minutes** (téléchargement des images, compilation, init SQL Server).

## Accès
| Service | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **API Swagger** | http://localhost:5141/swagger |
| **SQL Server** | localhost:1433 (sa / GestionC0mpt3urs!Docker) |

## Première utilisation
1. Ouvrir http://localhost:3000/swagger
2. Créer un utilisateur via `POST /api/Auth/register` :
```json
{ "login": "admin", "password": "Password123!", "role": "Administration" }
```
3. Se connecter sur http://localhost:3000 avec ces identifiants

## Arrêter l'application
```bash
docker-compose down
```

## Supprimer les données (réinitialiser la BDD)
```bash
docker-compose down -v
```

## Structure des fichiers Docker
```
GestionMouvementsCompteurs/
├── docker-compose.yml          <- Orchestre les 3 services
├── Dockerfile.api              <- Build de l'API .NET 8
├── Dockerfile.sqlserver        <- SQL Server + init auto
├── init.sql                    <- Schema de la base de données
├── init-db.sh                  <- Script d'init SQL Server
└── gestion-compteurs-frontend/
    ├── Dockerfile              <- Build React + nginx
    └── nginx.conf              <- Config nginx SPA
```
