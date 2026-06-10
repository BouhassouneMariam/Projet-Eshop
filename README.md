# Eco-Hardware Shop

Application e-commerce de demonstration avec une stack locale Docker Compose :

- application Next.js
- proxy Nginx
- GlitchTip pour le suivi des erreurs
- PostgreSQL dedie a GlitchTip
- Redis/Valkey pour GlitchTip
- Umami pour l'analytics
- PostgreSQL dedie a Umami

## Prerequis

- Docker Desktop
- Node.js, seulement si vous voulez lancer l'app hors Docker

## Configuration

Copier le fichier d'exemple :

```powershell
Copy-Item .env.example .env
```

Puis modifier les valeurs dans `.env`.

Pour une stack locale de demonstration, les domaines attendus sont :

- app : `http://app.localhost:8080`
- Umami : `http://umami.localhost:8080`
- GlitchTip : `http://glitchtip.localhost:8080`

Les valeurs `GLITCHTIP_SECRET_KEY`, `GLITCHTIP_POSTGRES_PASSWORD`, `UMAMI_APP_SECRET` et `UMAMI_POSTGRES_PASSWORD` doivent etre remplacees par des valeurs aleatoires avant un usage partage ou durable.

## Lancement avec Docker

Depuis la racine du projet :

```powershell
docker compose up --build
```

En arriere-plan :

```powershell
docker compose up --build -d
```

Arreter la stack :

```powershell
docker compose down
```

Supprimer aussi les donnees persistantes :

```powershell
docker compose down -v
```

## URLs locales

- Application : `http://app.localhost:8080`
- Application, alias : `http://localhost:8080`
- Umami : `http://umami.localhost:8080`
- GlitchTip : `http://glitchtip.localhost:8080`

## Configuration Umami

1. Ouvrir `http://umami.localhost:8080`.
2. Se connecter avec les identifiants par defaut si l'instance est neuve :

```text
admin
umami
```

3. Changer le mot de passe.
4. Creer un site avec le domaine `app.localhost`.
5. Copier le Website ID dans `.env` :

```env
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

Le script Umami est deja prevu via :

```env
NEXT_PUBLIC_UMAMI_SCRIPT_URL=http://umami.localhost:8080/script.js
```

Relancer ensuite la stack :

```powershell
docker compose up --build -d
```

## Configuration GlitchTip

1. Ouvrir `http://glitchtip.localhost:8080`.
2. Creer un compte, une organisation, puis un projet.
3. Choisir la plateforme Next.js.
4. Copier la DSN du projet dans `.env` :

```env
NEXT_PUBLIC_GLITCHTIP_DSN=http://public-key@glitchtip.localhost:8080/project-id
```

Relancer ensuite la stack :

```powershell
docker compose up --build -d
```

Pour tester l'envoi d'une erreur depuis le navigateur, ouvrir `http://app.localhost:8080`, puis executer dans la console :

```js
setTimeout(() => {
  throw new Error("Test GlitchTip");
}, 1000);
```

## Lancement en developpement hors Docker

Installer les dependances :

```powershell
npm install
```

Lancer Next.js :

```powershell
npm run dev
```

L'application sera disponible sur `http://localhost:3000`.

## Donnees persistantes

Docker Compose declare des volumes pour conserver les donnees entre deux redemarrages :

- `glitchtip_postgres_data`
- `glitchtip_redis_data`
- `glitchtip_uploads`
- `umami_postgres_data`

Utiliser `docker compose down -v` seulement si vous voulez repartir de zero.
