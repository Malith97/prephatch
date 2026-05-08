"use client";

import { useState } from "react";
import { Button } from "../ui/button";

export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="space-y-4"
      aria-label="Signup form"
      onSubmit={(event) => {
        event.preventDefault();
        setIsSubmitting(true);
        // Placeholder: replace with registration action.
        setTimeout(() => setIsSubmitting(false), 800);
      }}
    >
      <label className="phx-field">
        <span className="phx-label">Full name</span>
        <input className="phx-input" type="text" name="name" autoComplete="name" required />
      </label>
      <label className="phx-field">
        <span className="phx-label">Email</span>
        <input className="phx-input" type="email" name="email" autoComplete="email" required />
      </label>
      <label className="phx-field">
        <span className="phx-label">Password</span>
        <input className="phx-input" type="password" name="password" autoComplete="new-password" minLength={8} required />
      </label>
      <Button type="submit" className="w-full" aria-busy={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
