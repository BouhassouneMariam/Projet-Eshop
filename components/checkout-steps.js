const steps = [
  {
    id: "cart",
    label: "Panier",
    description: "Verifier les articles"
  },
  {
    id: "checkout",
    label: "Paiement",
    description: "Livraison et reglement"
  },
  {
    id: "success",
    label: "Confirmation",
    description: "Commande validee"
  }
];

export function CheckoutSteps({ current }) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === current)
  );

  return (
    <ol className="checkout-steps" aria-label="Etapes du tunnel d'achat">
      {steps.map((step, index) => {
        let state = "upcoming";

        if (index < currentIndex) {
          state = "complete";
        } else if (index === currentIndex) {
          state = "current";
        }

        return (
          <li
            aria-current={state === "current" ? "step" : undefined}
            className={`checkout-step checkout-step-${state}`}
            key={step.id}
          >
            <span className="step-index">0{index + 1}</span>
            <span className="step-copy">
              <strong className="step-label">{step.label}</strong>
              <span className="step-description">{step.description}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
