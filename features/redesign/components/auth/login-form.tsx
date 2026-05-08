"use client";

import { useState } from "react";
import { Button } from "../ui/button";

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="space-y-4"
      aria-label="Login form"
      onSubmit={(event) => {
        event.preventDefault();
        setIsSubmitting(true);
        // Placeholder: replace with auth action.
        setTimeout(() => setIsSubmitting(false), 800);
      }}
    >
      <label className="phx-field">
        <span className="phx-label">Email</span>
        <input className="phx-input" type="email" name="email" autoComplete="email" required />
      </label>
      <label className="phx-field">
        <span className="phx-label">Password</span>
        <input className="phx-input" type="password" name="password" autoComplete="current-password" required />
      </label>
      <Button type="submit" className="w-full" aria-busy={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
