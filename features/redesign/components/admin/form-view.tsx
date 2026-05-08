"use client";

import { Button } from "../ui/button";

export function FormView({ title }: { title: string }) {
  return (
    <section className="phx-card" aria-label={title}>
      <h2 className="phx-heading-sm mb-4">{title}</h2>
      <form className="grid gap-4 sm:grid-cols-2">
        <label className="phx-field sm:col-span-2">
          <span className="phx-label">Title</span>
          <input className="phx-input" name="title" required />
        </label>
        <label className="phx-field">
          <span className="phx-label">Category</span>
          <input className="phx-input" name="category" required />
        </label>
        <label className="phx-field">
          <span className="phx-label">Price</span>
          <input className="phx-input" name="price" inputMode="decimal" required />
        </label>
        <label className="phx-field sm:col-span-2">
          <span className="phx-label">Description</span>
          <textarea className="phx-input min-h-28" name="description" required />
        </label>
        <div className="sm:col-span-2">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </section>
  );
}
