import { Button } from "../ui/button";

export function CTAStrip() {
  return (
    <section className="phx-card flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="phx-heading-md">Ready to improve your exam readiness?</h2>
        <p className="phx-body-sm mt-1">Start with a free guided mock session and get instant topic insights.</p>
      </div>
      <Button>Start Now</Button>
    </section>
  );
}
