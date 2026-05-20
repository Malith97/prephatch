import type { AttemptAnswers, ScorePreview } from "./types";

export type AttemptStatus = "in_progress" | "submitted";

export type AttemptQuestionSnapshot = {
  questionId: string;
  topicLabel: string;
  correctOptionId: string;
};

export type AttemptQuestionResult = {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  topicLabel: string;
};

export type AttemptScore = ScorePreview & {
  computedAt: number;
};

export type ExamAttemptRecord = {
  attemptId: string;
  ownerUserId: string;
  organizationId: string;
  examId: string;
  examSlug: string;
  mockId: string;
  startedAt: number;
  endsAt: number;
  status: AttemptStatus;
  answers: AttemptAnswers;
  currentQuestionIndex: number;
  flaggedQuestionIds: string[];
  version: number;
  createdAt: number;
  updatedAt: number;
  submittedAt?: number;
  score?: AttemptScore;
  questionSnapshot: AttemptQuestionSnapshot[];
  submitIdempotency: Record<
    string,
    {
      submittedAt: number;
      version: number;
    }
  >;
};

export type PublicExamAttempt = {
  attemptId: string;
  organizationId: string;
  examId: string;
  examSlug: string;
  mockId: string;
  startedAt: number;
  endsAt: number;
  status: AttemptStatus;
  answers: AttemptAnswers;
  currentQuestionIndex: number;
  flaggedQuestionIds: string[];
  version: number;
  updatedAt: number;
  submittedAt?: number;
  score?: AttemptScore;
  reviewQuestions?: import("./types").Question[];
};

export type CreateAttemptRequest = {
  examSlug?: string;
  slug?: string;
  mock_exam_id?: string;
  examId?: string;
  organizationId?: string;
  mockId?: string;
  idempotencyKey?: string;
};

export type CreateAttemptResponse = {
  attempt: PublicExamAttempt;
  resumed: boolean;
};

export type AutosaveAttemptRequest = {
  answers?: AttemptAnswers;
  currentQuestionIndex?: number;
  flaggedQuestionIds?: string[];
  expectedVersion?: number;
};

export type AutosaveAttemptResponse = {
  attempt: PublicExamAttempt;
};

export type SubmitAttemptRequest = {
  idempotencyKey?: string;
};

export type SubmitAttemptResponse = {
  attempt: PublicExamAttempt;
  submittedAlready: boolean;
};
