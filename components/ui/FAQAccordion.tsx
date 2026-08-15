"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Accessible single-open accordion for FAQ-style content.
 * Uses native <button aria-expanded> semantics instead of <details> for
 * consistent styling across browsers.
 */
export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="text-lg font-medium tracking-tight text-gray-900 dark:text-gray-100">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-transform duration-200 dark:border-gray-700 dark:text-gray-400",
                  open && "rotate-45 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400",
                )}
              >
                +
              </span>
            </button>
            <div
              className={cn(
                "grid overflow-hidden transition-all duration-300 ease-in-out",
                open ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="min-h-0">
                <p className="max-w-2xl text-base text-gray-600 dark:text-gray-400">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
