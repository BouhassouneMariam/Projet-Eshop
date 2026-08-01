# Campagne QA d'observabilite

Ce guide permet de recreer un jeu de donnees deterministe dans Umami et GlitchTip sans utiliser de donnees personnelles.

## Scenarios generes

| Scenario | Navigateur declare | Evenements attendus |
| --- | --- | --- |
| Parcours complet | Chrome / Windows | `view_product`, `add_to_cart`, `checkout_start`, `checkout_success` |
| Abandon panier | Firefox / Linux | `view_product`, `add_to_cart` |
| Abandon checkout | Safari / macOS | `view_product`, `add_to_cart`, `checkout_start` |

La campagne ajoute aussi une erreur `CheckoutPaymentError` et deux transactions de performance dans GlitchTip. Les user-agents et adresses IP utilises sont des valeurs de test. Le script injecte les donnees par les endpoints de collecte : il ne remplace pas une validation visuelle du parcours dans un vrai navigateur.

## Prerequis

1. Demarrer la stack : `docker compose up --build -d`.
2. Verifier que `.env` contient `NEXT_PUBLIC_UMAMI_WEBSITE_ID` et `NEXT_PUBLIC_GLITCHTIP_DSN`.
3. Ne jamais committer le fichier `.env` ni la sortie brute contenant un DSN.

## Execution

Depuis PowerShell, a la racine du projet :

```powershell
$env:OBSERVABILITY_RUN_ID = "qa-observability-$(Get-Date -Format yyyyMMdd-HHmmss)"
npm run qa:observability
```

Si le fichier d'environnement est ailleurs :

```powershell
$env:OBSERVABILITY_ENV_FILE = "C:\chemin\vers\Projet-Eshop\.env"
npm run qa:observability
```

Conserver le `runId` et l'`eventId` affiches. Ils servent a filtrer la campagne dans les outils.

## Verification manuelle

Dans Umami (`http://umami.localhost:8080`) :

1. Ouvrir le site Eco-Hardware et filtrer la periode de la campagne.
2. Verifier les quatre evenements du funnel.
3. Ouvrir le rapport sauvegarde `Tunnel d'achat`.
4. Verifier les navigateurs Chrome, Firefox et Safari.
5. Verifier les Web Vitals de la page `/checkout/success`.

Dans GlitchTip (`http://glitchtip.localhost:8080`) :

1. Ouvrir l'organisation `ethan-martinez`, puis le projet `local`.
2. Ouvrir l'incident `CheckoutPaymentError` (numero court 2).
3. Verifier la stacktrace, les trois breadcrumbs, Safari 18.6 et macOS 15.6.
4. Ouvrir Performance et verifier `checkout.page_ready` et `checkout.confirmation_ready`.

## Captures attendues

- Dashboard Umami avec les evenements.
- Funnel Umami `Tunnel d'achat`.
- Incident GlitchTip avec stacktrace et contexte.
- Vue Performance GlitchTip avec les deux transactions.

Masquer tout identifiant sensible avant de partager les captures.
