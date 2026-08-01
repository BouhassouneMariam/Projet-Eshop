# Preuves de la campagne du 1er aout 2026

- Run Umami : `qa-observability-final2-20260801`
- Rapport Umami sauvegarde : `Tunnel d'achat`
- ID du rapport : `f81aeba5-7fc6-4fbc-89de-822731a62ede`
- Fenetre du funnel : 2026-08-01 14:37:50 UTC a 14:40:00 UTC
- ID Sentry envoye : `5569dcc2d95826369258d998aae415c1`
- ID affiche par GlitchTip pour l'evenement de reference : `019fbdc2b06375a193321c99f8ff00ae`
- Incident GlitchTip : numero court 2, projet `local`

Les exports de ce dossier ont ete verifies dans les bases locales Umami 3.1.0 et GlitchTip 6.1.8. Ils ne contiennent ni DSN, ni mot de passe, ni identifiant de site Umami.

## Captures d'ecran

| Preuve | Fichier | Lecture |
| --- | --- | --- |
| Evenements Umami | [01-umami-events-global.PNG](01-umami-events-global.PNG) | Vue globale de plusieurs essais techniques ; ces totaux ne servent pas au calcul du funnel. |
| Funnel Umami | [02-umami-funnel.PNG](02-umami-funnel.PNG) | Campagne de reference : `3 -> 3 -> 2 -> 1`. |
| Web Vitals Umami | [03-umami-performance.PNG](03-umami-performance.PNG) | LCP, INP, CLS, FCP et TTFB collectes. |
| Contexte GlitchTip | [04-glitchtip-error-context.PNG](04-glitchtip-error-context.PNG) | Incident, navigateur, OS, tags et tentative de paiement. |
| Diagnostic GlitchTip | [05-glitchtip-stacktrace-breadcrumbs.PNG](05-glitchtip-stacktrace-breadcrumbs.PNG) | Stacktrace et trois breadcrumbs. |
| Performance GlitchTip | [06-glitchtip-performance.PNG](06-glitchtip-performance.PNG) | Deux groupes de transactions et leurs durees moyennes. |

La procedure de reproduction et la checklist sont decrites dans [CAMPAGNE_QA.md](../../CAMPAGNE_QA.md).
