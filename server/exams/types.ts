export type QuestionOption = {
  id: string;
  label: string;
  text: string;
};

export type Question = {
  id: string;
  prompt: string;
  explanation: string;
  correctOptionId: string;
  options: QuestionOption[];
};

export type MockExam = {
  id: string;
  slug: string;
  certificationCode: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: Question[];
};

export type ExamSummary = {
  id: string;
  slug: string;
  certificationCode: string;
  title: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
};

export type AttemptAnswers = Record<string, string>;

export type StoredAttempt = {
  examId: string;
  examSlug: string;
  startedAt: number;
  endsAt: number;
  status: "in_progress" | "submitted";
  answers: AttemptAnswers;
  submittedAt?: number;
};

export type QuestionResult = {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
};

export type ScorePreview = {
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  percentageScore: number;
  scaledScorePreview: number;
  questionResults: QuestionResult[];
  previewFormulaLabel: string;
};
