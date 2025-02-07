# API de Réservation de Films

## Description
Cette API permet aux utilisateurs de créer un compte, de s'authentifier, de rechercher des films et de réserver des séances.

## Technologies Utilisées
- NestJS
- TypeScript
- JWT pour l'authentification
- TMDB API pour récupérer les informations des films

## Installation

1. Cloner le dépôt :
   ```sh
   git clone <URL_DU_REPO>
   cd <NOM_DU_PROJET>
   ```
2. Installer les dépendances :
   ```sh
   npm install
   ```
3. Configurer les variables d'environnement (exemple dans `.env.example`).
4. Démarrer l'application :
   ```sh
   npm run start
   ```

## Endpoints

### 1. Authentification
#### Inscription
```http
POST /auth/signup
```
- **Description** : Créer un compte utilisateur
- **Body** :
  ```json
  {
    "email": "exemple@email.com",
    "password": "motdepasse"
  }
  ```
- **Réponse** :
  ```json
  {
    "message": "User créé avec succès"
  }
  ```

#### Connexion
```http
POST /auth/login
```
- **Description** : Se connecter à l'application
- **Body** : Identique à l'inscription
- **Réponse** :
  ```json
  {
    "access_token": "JWT_TOKEN"
  }
  ```

### 2. Réservations (Protégé par JWT)
#### Créer une réservation
```http
POST /reservations
```
- **Description** : Réserver un film
- **Body** :
  ```json
  {
    "userId": "123",
    "movieId": "456",
    "date": "2024-06-10"
  }
  ```

#### Récupérer les réservations d'un utilisateur
```http
GET /reservations/:id
```
- **Description** : Récupérer les réservations d'un utilisateur
- **Paramètres** : `id` (ID de l'utilisateur)

#### Annuler une réservation
```http
DELETE /reservations/:id
```
- **Description** : Supprime une réservation
- **Paramètres** : `id` (ID de la réservation)

### 3. Recherche de Films (TMDB)
#### Récupérer les films populaires
```http
GET /movies/popular
```

#### Rechercher un film
```http
GET /movies/search?query=<titre>
```

#### Récupérer les films populaires avec pagination
```http
GET /movies/popularPaginated?page=<num>
```

#### Recherche paginée
```http
GET /movies/searchPaginated?query=<titre>&page=<num>
```

## Sécurité
- JWT est utilisé pour protéger les endpoints sensibles.
- Les rôles (`user`) sont gérés via des guards NestJS.

## Auteur
Développé par [Ton Nom]

