import type { Question } from "../../types";

export function QuestionPanel({ question }: { question: Question }) {
  return (
    <article className="phx-card" aria-live="polite">
      <p className="phx-label mb-3">
        Question {question.index} of {question.total}
      </p>
      <h2 className="phx-heading-md">{question.prompt}</h2>
    </article>
  );
}
