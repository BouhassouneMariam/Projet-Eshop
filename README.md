# Eco-Hardware Shop

Application e-commerce de demonstration concue pour repondre au sujet "E-Shop Monitor". Le projet met en place un tunnel d'achat instrumente, une collecte analytics self-hosted avec Umami, et une remontee des erreurs et traces de performance avec GlitchTip.

L'objectif est de pouvoir :

- suivre les etapes du tunnel d'achat avec des evenements personnalises
- mesurer la conversion et les abandons dans Umami
- capturer les erreurs frontend et les informations de debug dans GlitchTip
- faire tourner toute la stack localement avec Docker Compose

## Dossier de rendu observabilite

- [Rapport d'observabilite](docs/observability/RAPPORT_OBSERVABILITE.md)
- [Procedure de campagne QA](docs/observability/CAMPAGNE_QA.md)
- [Preuves du 1er aout 2026](docs/observability/evidence/2026-08-01/README.md)

## Stack technique

- Next.js 14
- React 18
- Nginx
- Umami
- GlitchTip
- PostgreSQL pour Umami
- PostgreSQL pour GlitchTip
- Redis pour GlitchTip
- Docker Compose

## Fonctionnalites de l'application

L'application contient les ecrans suivants :

- page d'accueil
- catalogue produits
- fiche produit
- panier
- checkout
- page de confirmation

Le tunnel d'achat est instrumente avec les evenements suivants :

- `view_product`
- `add_to_cart`
- `checkout_start`
- `checkout_success`

Le projet contient aussi :

- une panne de paiement volontaire une fois sur trois
- une collecte des pages vues et des evenements dans Umami
- une capture des erreurs frontend dans GlitchTip
- un suivi de performance du checkout et de la page de confirmation

## Arborescence utile

- `app/` : pages Next.js
- `components/` : composants UI et logique client
- `lib/analytics.js` : envoi des evenements vers Umami
- `lib/payment.js` : simulation de la panne de paiement
- `lib/performance.js` : instrumentation performance checkout / confirmation
- `docker-compose.yml` : orchestration locale
- `infrastructure/nginx/default.conf` : reverse proxy local

## Prerequis

- Docker Desktop
- WSL2 actif sur Windows si Docker Desktop l'utilise
- Node.js seulement si vous voulez lancer l'application hors Docker

## Variables d'environnement

Le fichier `.env.example` sert de modele commun.

Le fichier `.env` est local a chaque machine et ne doit pas etre commit.

Copier le modele :

```powershell
Copy-Item .env.example .env
```

Exemple de configuration minimale :

```env
HTTP_PORT=8080

NEXT_PUBLIC_UMAMI_SCRIPT_URL=http://umami.localhost:8080/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_GLITCHTIP_DSN=

GLITCHTIP_SECRET_KEY=change-me-generate-a-long-random-secret
GLITCHTIP_DOMAIN=http://glitchtip.localhost:8080
GLITCHTIP_EMAIL_URL=consolemail://
GLITCHTIP_DEFAULT_FROM_EMAIL=glitchtip@example.local
GLITCHTIP_ENABLE_USER_REGISTRATION=true
GLITCHTIP_ENABLE_ORGANIZATION_CREATION=true
GLITCHTIP_POSTGRES_DB=glitchtip
GLITCHTIP_POSTGRES_USER=glitchtip
GLITCHTIP_POSTGRES_PASSWORD=change-me

UMAMI_APP_SECRET=change-me-generate-a-long-random-secret
UMAMI_POSTGRES_DB=umami
UMAMI_POSTGRES_USER=umami
UMAMI_POSTGRES_PASSWORD=change-me
```

Notes importantes :

- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` est recupere apres creation du site Umami
- `NEXT_PUBLIC_GLITCHTIP_DSN` est recuperee apres creation du projet GlitchTip
- si chaque membre du binome utilise sa propre stack locale, ces deux valeurs peuvent etre differentes d'une machine a l'autre

## Lancement de la stack

Depuis la racine du projet :

```powershell
docker compose up --build -d
```

Verifier l'etat des services :

```powershell
docker compose ps
```

Arreter la stack :

```powershell
docker compose down
```

Supprimer aussi les volumes persistants :

```powershell
docker compose down -v
```

## URLs locales

- application : `http://app.localhost:8080`
- alias application : `http://localhost:8080`
- Umami : `http://umami.localhost:8080`
- GlitchTip : `http://glitchtip.localhost:8080`

## Configuration Umami

1. Ouvrir `http://umami.localhost:8080`
2. Se connecter avec les identifiants par defaut :

```text
admin
umami
```

3. Changer le mot de passe
4. Creer un site, par exemple :
   - name : `Eco-Hardware`
   - domain : `app.localhost`
5. Copier le `Website ID`
6. Renseigner dans `.env` :

```env
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

7. Relancer la stack :

```powershell
docker compose up --build -d
```

### Ce que Umami mesure dans ce projet

Metriques standards :

- visiteurs
- visites
- pages vues
- bounce rate
- duree moyenne de visite

Evenements personnalises :

- `view_product`
- `add_to_cart`
- `checkout_start`
- `checkout_success`

Proprietes envoyees avec les evenements :

- `product_slug`
- `product_name`
- `product_category`
- `product_price`
- `cart_total`
- `item_count`
- `shipping_price`
- `shipping_speed`
- `payment_method`
- `attempt_number`
- `ref`
- `utm_source`
- `utm_medium`
- `utm_campaign`

### Funnel recommande

Dans Umami, creer un funnel avec :

- name : `Tunnel d'achat`
- window : `60 minutes`

Steps :

1. `Triggered event` -> `view_product`
2. `Triggered event` -> `add_to_cart`
3. `Triggered event` -> `checkout_start`
4. `Triggered event` -> `checkout_success`

## Configuration GlitchTip

1. Ouvrir `http://glitchtip.localhost:8080`
2. Creer un compte
3. Creer une organisation, une team, puis un projet
4. Choisir la plateforme `Next.js`
5. Copier la DSN du projet
6. Renseigner dans `.env` :

```env
NEXT_PUBLIC_GLITCHTIP_DSN=http://public-key@glitchtip.localhost:8080/project-id
```

7. Relancer la stack :

```powershell
docker compose up --build -d
```

### Ce que GlitchTip remonte dans ce projet

- erreurs frontend non gerees
- stacktrace JavaScript
- navigateur
- OS
- breadcrumbs
- traces de navigation et de chargement
- spans de performance custom :
  - `checkout.page_ready`
  - `checkout.confirmation_ready`

## Simulation de la panne de paiement

Le paiement est volontairement defectueux une fois sur trois pour valider la remontee d'erreur dans GlitchTip.

Comportement attendu :

- tentatives 1 et 2 : paiement accepte
- tentative 3 : erreur `CheckoutPaymentError`

L'erreur remontee simule un probleme de provider de paiement :

```text
Cannot read properties of undefined (reading 'authorize')
```

## Procedure de test recommandee

### Test Umami

1. Ouvrir l'application
2. Aller sur le catalogue
3. Ouvrir une fiche produit
4. Ajouter au panier
5. Aller au checkout
6. Finaliser une commande
7. Verifier dans Umami :
   - les pages vues
   - les evenements
   - le funnel

Pour obtenir un funnel plus parlant, faire aussi :

- un parcours complet
- un abandon au panier
- un abandon au checkout

Idealement, utiliser plusieurs visiteurs :

- autre navigateur
- navigation privee
- autre machine

### Test GlitchTip

1. Ajouter un produit au panier
2. Aller au checkout
3. Refaire des tentatives de paiement jusqu'a la troisieme tentative
4. Verifier dans GlitchTip :
   - l'erreur `CheckoutPaymentError`
   - la stacktrace
   - les breadcrumbs
   - les informations navigateur / OS

## Lancement hors Docker

Installer les dependances :

```powershell
npm install
```

Lancer Next.js :

```powershell
npm run dev
```

L'application sera disponible sur `http://localhost:3000`.

## Volumes persistants

Les volumes Docker declares sont :

- `glitchtip_postgres_data`
- `glitchtip_redis_data`
- `glitchtip_uploads`
- `umami_postgres_data`

Utiliser `docker compose down -v` seulement si vous voulez repartir de zero.

## Reponse au cahier des charges

Etat du sujet :

- infrastructure Docker multi-services : fait
- application web e-commerce : fait
- GlitchTip avec PostgreSQL et Redis dedies : fait
- Umami avec base dediee : fait
- capture des erreurs frontend : fait
- simulation d'un paiement defectueux : fait
- suivi de performance des pages cles : fait
- tunnel d'achat avec 4 evenements personnalises : fait
- analyse du funnel dans Umami : fait

## Depannage

Si `docker compose up --build -d` semble bloque sur Windows :

1. fermer les terminaux Docker en cours
2. fermer Docker Desktop
3. lancer dans PowerShell administrateur :

```powershell
wsl --shutdown
```

4. relancer Docker Desktop
5. attendre que le moteur soit completement demarre
6. relancer :

```powershell
docker compose up --build -d
```

