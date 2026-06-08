export const products = [
  {
    slug: "clavier-bambou-flow",
    sku: "EH-KB-001",
    name: "Clavier Bambou Flow",
    tagline: "Un clavier compact, reconditionnable et silencieux.",
    description:
      "Concu pour les postes hybrides, ce clavier mise sur une coque en fibres vegetales, des switchs remplacables et une finition mate qui evite le tout plastique brillant.",
    category: "Bureautique",
    price: 89,
    rating: 4.8,
    color: "#6f845f",
    featured: true,
    features: [
      "Switchs hot-swap pour allonger la duree de vie",
      "Coque biosourcee avec base anti-glisse recyclee",
      "Format compact ideal pour les petits espaces"
    ],
    specifications: {
      Connectivite: "USB-C / Bluetooth",
      Autonomie: "80 heures",
      Poids: "620 g",
      Garantie: "3 ans"
    }
  },
  {
    slug: "hub-usb-c-reloop",
    sku: "EH-HB-014",
    name: "Hub USB-C Reloop",
    tagline: "Le dock minimal pour bureaux nomades.",
    description:
      "Un hub aluminium recycle qui centralise affichage, charge et stockage sans multiplier les adaptateurs au quotidien.",
    category: "Bureautique",
    price: 59,
    rating: 4.5,
    color: "#b5835a",
    featured: false,
    features: [
      "Sortie HDMI 4K pour ecran externe",
      "Lecteur SD integre pour creatifs mobiles",
      "Aluminium recycle et faible chauffe"
    ],
    specifications: {
      Ports: "6 en 1",
      Puissance: "100W pass-through",
      Materiau: "Aluminium recycle",
      Garantie: "2 ans"
    }
  },
  {
    slug: "station-solaire-nomad-grid",
    sku: "EH-EN-031",
    name: "Station Solaire Nomad Grid",
    tagline: "Une batterie modulaire pour les setups autonomes.",
    description:
      "Pensee pour les freelances et petites equipes terrain, cette batterie portable combine panneaux pliables, ports rapides et suivi de consommation simplifie.",
    category: "Energie",
    price: 219,
    rating: 4.9,
    color: "#d4a15c",
    featured: true,
    features: [
      "Charge solaire ou secteur selon le contexte",
      "Affichage de charge clair en facade",
      "Construction reparable par modules"
    ],
    specifications: {
      Capacite: "256 Wh",
      Sorties: "USB-C / AC / DC",
      Poids: "3.1 kg",
      Garantie: "4 ans"
    }
  },
  {
    slug: "routeur-low-power-mesh",
    sku: "EH-NW-022",
    name: "Routeur Low-Power Mesh",
    tagline: "Reseau stable, conso reduite et maintenance simple.",
    description:
      "Un routeur pour petits bureaux qui reduit la consommation electrique sans sacrifier la couverture ni la securite du reseau.",
    category: "Reseau",
    price: 149,
    rating: 4.6,
    color: "#4f6d7a",
    featured: true,
    features: [
      "Mode economie d'energie la nuit",
      "Interface simple pour les equipes non techniques",
      "Compatible maillage pour ateliers et coworking"
    ],
    specifications: {
      WiFi: "Wi-Fi 6",
      Portee: "200 m2",
      Consommation: "9W",
      Garantie: "3 ans"
    }
  },
  {
    slug: "support-ecran-reclaim",
    sku: "EH-OF-008",
    name: "Support Ecran Reclaim",
    tagline: "Rehausseur reglable fabrique en acier recycle.",
    description:
      "Ce support ecran remet l'ergonomie au centre avec une structure en metal recycle, un passage de cables integre et une tablette basse pour petits accessoires.",
    category: "Bureautique",
    price: 74,
    rating: 4.4,
    color: "#8d6a5a",
    featured: false,
    features: [
      "Reglage rapide sans outil",
      "Acier recycle a haute resistance",
      "Plateau inferieur pour clavier ou carnet"
    ],
    specifications: {
      Hauteur: "3 positions",
      ChargeMax: "18 kg",
      Finition: "Poudre mate",
      Garantie: "5 ans"
    }
  },
  {
    slug: "mini-serveur-breeze-core",
    sku: "EH-SV-043",
    name: "Mini Serveur Breeze Core",
    tagline: "Le petit noeud sobre pour lab, NAS ou observabilite.",
    description:
      "Compact, discret et peu energivore, ce mini serveur sert de base ideale pour auto-heberger des services comme dashboards, logs ou analytics.",
    category: "Reseau",
    price: 329,
    rating: 4.9,
    color: "#556b2f",
    featured: true,
    features: [
      "Parfait pour self-hosting et experimentation",
      "Ventilation silencieuse en charge legere",
      "Maintenance facile grace aux panneaux acces rapide"
    ],
    specifications: {
      Processeur: "8 coeurs basse consommation",
      Memoire: "16 Go",
      Stockage: "512 Go NVMe",
      Garantie: "3 ans"
    }
  }
];

export const featuredProducts = products.filter((product) => product.featured).slice(0, 4);

export const productCategories = [
  {
    name: "Bureautique",
    description: "Accessoires et ergonomie pour des postes de travail plus propres et mieux equipes."
  },
  {
    name: "Energie",
    description: "Solutions nomades et modules de charge pour alimenter les usages critiques."
  },
  {
    name: "Reseau",
    description: "Materiel compact pour connecter, auto-heberger et superviser sans surconsommer."
  }
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}
