import { Button } from "../ui/button";
import { Card } from "../ui/card";

const plans = [
  { name: "Starter", price: "$0", note: "Try core practice tools", perks: ["3 mock sessions/week", "Basic analytics", "Community support"] },
  { name: "Pro", price: "$19", note: "For focused exam prep", perks: ["Unlimited sessions", "Weak area coaching", "AI explanations"] },
  { name: "Team", price: "$49", note: "For institutions and cohorts", perks: ["Team dashboards", "Role-based access", "Priority support"] },
];

export function PricingGrid() {
  return (
    <section className="space-y-4">
      <h2 className="phx-heading-lg">Pricing</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className="h-full" title={plan.name} description={plan.note}>
            <p className="phx-heading-xl mb-4">{plan.price}<span className="phx-body-sm">/mo</span></p>
            <ul className="mb-5 space-y-2">
              {plan.perks.map((perk) => (
                <li key={perk} className="phx-body-sm">• {perk}</li>
              ))}
            </ul>
            <Button className="w-full" variant={plan.name === "Pro" ? "primary" : "secondary"}>
              Choose {plan.name}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
