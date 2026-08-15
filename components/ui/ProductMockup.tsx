import StatusBadge from "@/components/ui/StatusBadge";

const resources = [
  { name: "Model routing", tag: "Comparison", confidence: 82 },
  { name: "Context limits", tag: "Evaluation", confidence: 64 },
  { name: "Review handoff", tag: "Workflow", confidence: 91 },
];

/**
 * A stylised, non-functional preview of the AI Resource Layer concept.
 * Illustrates the working direction described in Solutions/Hero copy —
 * it is a design mockup, not a screenshot of a shipped product.
 */
export default function ProductMockup() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-gray-200 bg-[var(--surface)] shadow-[var(--shadow-lift)] dark:border-gray-800">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-[var(--surface-muted)] px-4 py-3 dark:border-gray-800">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        <span className="ml-3 text-xs font-medium text-gray-500 dark:text-gray-500">
          AI Resource Layer — prototype
        </span>
      </div>

      <div className="grid gap-px bg-gray-200 dark:bg-gray-800 sm:grid-cols-[minmax(0,9rem)_1fr]">
        {/* sidebar */}
        <div className="hidden bg-[var(--surface)] p-4 sm:block">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-500">
            Filters
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {["By purpose", "By limits", "By evidence"].map((label) => (
              <li key={label} className="rounded-md px-2 py-1.5 hover:bg-[var(--surface-muted)]">
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* main */}
        <div className="bg-[var(--surface)] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Task: split a review pass across models
            </p>
            <StatusBadge status="In Development" variant="development" />
          </div>

          <div className="mt-4 space-y-2.5">
            {resources.map((resource) => (
              <div
                key={resource.name}
                className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-gray-200 bg-[var(--surface-muted)] px-3.5 py-3 dark:border-gray-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {resource.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{resource.tag}</p>
                </div>
                <div className="flex w-24 items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-1.5 rounded-full bg-blue-600"
                      style={{ width: `${resource.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs tabular-nums text-gray-500 dark:text-gray-500">
                    {resource.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
