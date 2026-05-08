import { Button } from "../ui/button";

export function LandingHero() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="space-y-5">
        <p className="phx-kicker">Exam Prep, Rebuilt</p>
        <h1 className="phx-heading-xl max-w-3xl">Practice smarter with focused mocks, analytics, and guided revision.</h1>
        <p className="phx-body-md max-w-2xl">
          PrepHatch helps you move from guessing to confidence with clean workflows for studying, simulation, and
          progress tracking.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Start Free</Button>
          <Button variant="secondary">Browse Packages</Button>
        </div>
      </div>

      <div className="phx-hero-panel">
        <div className="phx-stat-tile">
          <span className="phx-stat-label">Mock Completion</span>
          <span className="phx-stat-value">82%</span>
        </div>
        <div className="phx-stat-tile">
          <span className="phx-stat-label">Average Score</span>
          <span className="phx-stat-value">71/100</span>
        </div>
        <div className="phx-stat-tile">
          <span className="phx-stat-label">Weak Areas Solved</span>
          <span className="phx-stat-value">14 topics</span>
        </div>
      </div>
    </section>
  );
}
