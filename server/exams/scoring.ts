import type { AttemptAnswers, MockExam, ScorePreview } from "./types";

export const SCORE_PREVIEW_LABEL =
  "Scaled score preview only. This is not a real certification score.";

export function scoreAttempt(
  exam: MockExam,
  answers: AttemptAnswers,
): ScorePreview {
  const questionResults = exam.questions.map((question) => {
    const selectedOptionId = answers[question.id] ?? null;

    return {
      questionId: question.id,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      isCorrect: selectedOptionId === question.correctOptionId,
    };
  });

  const correctCount = questionResults.filter((result) => result.isCorrect).length;
  const unansweredCount = questionResults.filter(
    (result) => result.selectedOptionId === null,
  ).length;
  const incorrectCount = questionResults.length - correctCount - unansweredCount;
  const percentageScore = Number(
    ((correctCount / exam.questions.length) * 100).toFixed(2),
  );
  const scaledScorePreview = Math.round(100 + (percentageScore / 100) * 900);

  return {
    correctCount,
    incorrectCount,
    unansweredCount,
    percentageScore,
    scaledScorePreview,
    questionResults,
    previewFormulaLabel: SCORE_PREVIEW_LABEL,
  };
}
