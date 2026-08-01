# Rapport d'observabilite - Eco-Hardware

## Perimetre

La campagne QA du 1er aout 2026 valide le funnel e-commerce, la remontee d'une erreur de paiement et la collecte de performance. L'echantillon est volontairement petit et synthetique : trois sessions representent trois comportements distincts. Les resultats demontrent le fonctionnement de l'instrumentation, mais ne permettent pas de conclure sur le comportement de vrais clients.

## Resultats du funnel

| Etape | Visiteurs | Passage depuis l'etape precedente | Abandon |
| --- | ---: | ---: | ---: |
| `view_product` | 3 | 100 % | 0 % |
| `add_to_cart` | 3 | 100 % | 0 % |
| `checkout_start` | 2 | 66,7 % | 33,3 % |
| `checkout_success` | 1 | 50 % | 50 % |

Le taux de conversion global est de **33,3 %** : une session sur trois atteint `checkout_success`. Le taux de non-conversion est donc de **66,7 %**.

Le premier abandon intervient dans le panier : une session sur trois n'ouvre pas le checkout, soit 33,3 % de perte entre `add_to_cart` et `checkout_start`. Le second intervient pendant le checkout : une session sur deux ayant commence cette etape ne termine pas le paiement, soit 50 %. Sur cet echantillon, le checkout est donc la principale zone de friction.

Ces taux servent de preuve fonctionnelle. Pour une analyse produit fiable, il faudra observer davantage de sessions reelles sur une periode plus longue et segmenter par appareil, navigateur, source d'acquisition et cause d'erreur.

## Erreur de paiement

L'erreur volontaire est declenchee a la troisieme tentative de paiement. Le code simule l'indisponibilite du prestataire et leve `CheckoutPaymentError` avec le code `PAYMENT_PROVIDER_UNAVAILABLE`.

GlitchTip regroupe les occurrences sous l'incident numero 2. L'evenement de reference contient :

- la stacktrace vers `CheckoutPage.handleSubmit` et `simulateGatewayFailure` ;
- trois breadcrumbs qui reconstituent le passage du panier au checkout, le clic et la tentative 3 ;
- le contexte Safari 18.6, macOS 15.6 et Mac ;
- le numero de tentative et le scenario QA sous forme de tags ;
- des informations metier non sensibles : montant, nombre d'articles et mode de paiement.

Ces elements permettent de reproduire le probleme, de localiser la ligne fautive et de mesurer sa frequence sans demander au client une description technique.

## Performance

Umami a recu les Web Vitals de la confirmation de commande : LCP 690 ms, INP 72 ms, CLS 0,02, FCP 410 ms et TTFB 95 ms. Sur cet echantillon synthetique, ces valeurs se situent sous les seuils usuels de bonne experience : LCP 2,5 s, INP 200 ms, CLS 0,1, FCP 1,8 s et TTFB environ 0,8 s.

GlitchTip contient egalement trois echantillons pour chaque transaction applicative :

| Transaction | Moyenne | p95 |
| --- | ---: | ---: |
| `checkout.page_ready` | 420 ms | 427,176 ms |
| `checkout.confirmation_ready` | 310 ms | 342,802 ms |

La collecte fonctionne, mais trois mesures restent insuffisantes pour etablir une tendance. Le p95 devient utile sur un volume reel et doit etre compare dans le temps apres chaque livraison.

## Interet des outils

Umami apporte la vision produit : pages consultees, evenements, progression dans le tunnel et segmentation par navigateur. Il permet de voir **ou** les visiteurs abandonnent.

GlitchTip apporte la vision technique : exception, stacktrace, breadcrumbs, contexte d'execution et traces de performance. Il permet d'expliquer **pourquoi** une etape echoue ou ralentit.

Les deux outils sont complementaires. Umami detecte une baisse de conversion ; GlitchTip aide ensuite a relier cette baisse a une erreur ou une degradation de performance.

## Preuves visuelles

| Preuve | Capture |
| --- | --- |
| Evenements Umami | [Vue globale](evidence/2026-08-01/01-umami-events-global.PNG) |
| Funnel de reference | [Tunnel d'achat](evidence/2026-08-01/02-umami-funnel.PNG) |
| Web Vitals Umami | [Performance Umami](evidence/2026-08-01/03-umami-performance.PNG) |
| Erreur et contexte | [Incident GlitchTip](evidence/2026-08-01/04-glitchtip-error-context.PNG) |
| Stacktrace et breadcrumbs | [Diagnostic GlitchTip](evidence/2026-08-01/05-glitchtip-stacktrace-breadcrumbs.PNG) |
| Transactions applicatives | [Performance GlitchTip](evidence/2026-08-01/06-glitchtip-performance.PNG) |

La vue globale Umami regroupe plusieurs essais de mise au point. Les calculs de conversion reposent uniquement sur le funnel de reference `3 -> 3 -> 2 -> 1`.

## Conclusion et suites

L'instrumentation attendue est operationnelle et la campagne couvre les trois parcours demandes sur trois user-agents differents. Le funnel sauvegarde `Tunnel d'achat` isole la campagne entre 14:37:50 et 14:40:00 UTC.

Les six captures d'interface sont versionnees avec les exports dans `evidence/2026-08-01`. Pour completer la demonstration le jour de la soutenance, il est recommande de rejouer au moins un parcours dans un vrai navigateur afin de confirmer le comportement de bout en bout.

## Sources des seuils

- [Core Web Vitals](https://web.dev/articles/vitals?hl=fr)
- [First Contentful Paint](https://web.dev/articles/fcp)
- [Time to First Byte](https://web.dev/articles/optimize-ttfb)
