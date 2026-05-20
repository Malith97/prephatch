import type { AttemptsRepository, RuntimeExam } from "../../server/exams/db-repository";
import { SCORE_PREVIEW_LABEL } from "../../server/exams/scoring";
import type { AttemptAnswers } from "../../server/exams/types";
import type { AttemptScore, PublicExamAttempt } from "../../server/exams/attempt-types";

const ORG_ID = "dev-organization";
const USER_A = "dev-user-a";
const USER_B = "dev-user-b";

const exam: RuntimeExam = {
  id: "exam-aws-saa-c03",
  examId: "exam-aws-saa-c03",
  examVersionId: "mock-version-free",
  packageVersionId: "package-version-free",
  packageTier: "free",
  organizationId: ORG_ID,
  slug: "aws-saa-c03",
  certificationCode: "SAA-C03",
  title: "AWS Solutions Architect Associate",
  description: "Free DB-backed preview mock.",
  durationMinutes: 20,
  passScore: 70,
  maxAttemptsPerUser: 3,
  questions: [
    {
      id: "question-snapshot-1",
      topicLabel: "Networking",
      prompt: "A workload in private subnets needs HTTPS ingress. Which architecture is best?",
      explanation: "A public ALB with private targets keeps hosts private while allowing controlled ingress.",
      correctOptionId: "B",
      options: [
        { id: "A", label: "A", text: "Expose EC2 instances with public IPs" },
        { id: "B", label: "B", text: "Use a public ALB with private targets" },
        { id: "C", label: "C", text: "Use a NAT gateway for inbound traffic" },
        { id: "D", label: "D", text: "Use private API Gateway without VPC link" },
      ],
    },
    {
      id: "question-snapshot-2",
      topicLabel: "Storage",
      prompt: "Which option improves object data durability the most?",
      explanation: "Versioning in S3 materially improves recovery and object durability posture.",
      correctOptionId: "A",
      options: [
        { id: "A", label: "A", text: "Enable S3 versioning" },
        { id: "B", label: "B", text: "Store only on one instance store" },
        { id: "C", label: "C", text: "Disable backups" },
        { id: "D", label: "D", text: "Keep data only in cache" },
      ],
    },
  ],
};

type StoredAttempt = PublicExamAttempt & {
  ownerUserId: string;
  examVersionId: string;
  snapshotAnswers: Record<string, string>;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function scoreAttempt(questions: RuntimeExam["questions"], answers: AttemptAnswers, snapshotAnswers?: Record<string, string>): AttemptScore {
  const questionResults = questions.map((question) => {
    const selectedOptionId = answers[question.id] ?? null;
    const correctOptionId = snapshotAnswers?.[question.id] ?? question.correctOptionId;
    return {
      questionId: question.id,
      selectedOptionId,
      correctOptionId,
      isCorrect: selectedOptionId === correctOptionId,
      topicLabel: question.topicLabel,
    };
  });
  const correctCount = questionResults.filter((result) => result.isCorrect).length;
  const unansweredCount = questionResults.filter((result) => result.selectedOptionId === null).length;
  const incorrectCount = questionResults.length - correctCount - unansweredCount;
  const percentageScore = Number(((correctCount / questions.length) * 100).toFixed(2));

  return {
    correctCount,
    incorrectCount,
    unansweredCount,
    percentageScore,
    scaledScorePreview: Math.round(100 + (percentageScore / 100) * 900),
    questionResults,
    previewFormulaLabel: SCORE_PREVIEW_LABEL,
    computedAt: Date.now(),
  };
}

export class FakeAttemptsRepository implements AttemptsRepository {
  private attempts = new Map<string, StoredAttempt>();
  private creationRequests = new Map<string, string>();

  async listCatalogPackages(): Promise<RuntimeExam[]> {
    return [clone(exam)];
  }

  async findRuntimeExam(input: { includeAnswers: boolean; examSlug?: string; examId?: string; mockId?: string; mockExamId?: string }): Promise<RuntimeExam | null> {
    if (input.examSlug && input.examSlug !== exam.slug) {
      return null;
    }
    if (input.examId && input.examId !== exam.id) {
      return null;
    }
    if (input.mockExamId && input.mockExamId !== exam.examVersionId) {
      return null;
    }
    return this.examForMode(input.includeAnswers);
  }

  async findRuntimeExamByVersion(input: { examVersionId: string; includeAnswers: boolean }): Promise<RuntimeExam | null> {
    return input.examVersionId === exam.examVersionId ? this.examForMode(input.includeAnswers) : null;
  }

  async hasAccess(input: { userId: string }): Promise<boolean> {
    return input.userId === USER_A || input.userId === USER_B;
  }

  async findActiveAttempt(input: { userId: string; examVersionId: string }): Promise<PublicExamAttempt | null> {
    return clone(Array.from(this.attempts.values()).find(
      (attempt) =>
        attempt.ownerUserId === input.userId &&
        attempt.examVersionId === input.examVersionId &&
        attempt.status === "in_progress",
    ) ?? null);
  }

  async createAttempt(input: { userId: string; exam: RuntimeExam; mockId: string; idempotencyKey?: string }): Promise<{ attempt: PublicExamAttempt; resumed: boolean }> {
    const requestKey = input.idempotencyKey ? `${input.userId}:${input.exam.examVersionId}:${input.idempotencyKey}` : null;
    if (requestKey) {
      const existingId = this.creationRequests.get(requestKey);
      if (existingId) {
        return { attempt: clone(this.attempts.get(existingId)!), resumed: true };
      }
    }

    const active = await this.findActiveAttempt({ userId: input.userId, examVersionId: input.exam.examVersionId });
    if (active) {
      return { attempt: active, resumed: true };
    }

    const now = Date.now();
    const attempt: StoredAttempt = {
      attemptId: `attempt-${this.attempts.size + 1}`,
      ownerUserId: input.userId,
      organizationId: ORG_ID,
      examId: input.exam.examId,
      examSlug: input.exam.slug,
      mockId: input.mockId,
      examVersionId: input.exam.examVersionId,
      startedAt: now,
      endsAt: now + input.exam.durationMinutes * 60_000,
      status: "in_progress",
      answers: {},
      currentQuestionIndex: 0,
      flaggedQuestionIds: [],
      version: 1,
      updatedAt: now,
      snapshotAnswers: Object.fromEntries(input.exam.questions.map((question) => [question.id, question.correctOptionId])),
    };
    this.attempts.set(attempt.attemptId, attempt);
    if (requestKey) {
      this.creationRequests.set(requestKey, attempt.attemptId);
    }
    return { attempt: clone(attempt), resumed: false };
  }

  async getAttempt(input: { userId: string; attemptId: string; examSlug?: string }): Promise<PublicExamAttempt | null> {
    const attempt = this.attempts.get(input.attemptId);
    if (!attempt || attempt.ownerUserId !== input.userId) {
      return null;
    }
    if (input.examSlug && input.examSlug !== attempt.examSlug) {
      return null;
    }
    return clone(attempt);
  }

  async getLatestSubmittedAttempt(input: { userId: string; examSlug: string }): Promise<PublicExamAttempt | null> {
    return clone(Array.from(this.attempts.values()).reverse().find(
      (attempt) => attempt.ownerUserId === input.userId && attempt.examSlug === input.examSlug && attempt.status === "submitted",
    ) ?? null);
  }

  async autosaveAttempt(input: { userId: string; attemptId: string; answers?: AttemptAnswers; currentQuestionIndex?: number; flaggedQuestionIds?: string[]; expectedVersion?: number }): Promise<PublicExamAttempt> {
    const attempt = this.attempts.get(input.attemptId);
    if (!attempt || attempt.ownerUserId !== input.userId) {
      throw new Error("attempt_not_found");
    }
    if (input.expectedVersion !== undefined && input.expectedVersion !== attempt.version) {
      const error = new Error("version_conflict") as Error & { attempt?: PublicExamAttempt };
      error.attempt = clone(attempt);
      throw error;
    }
    if (input.answers) {
      for (const [questionId, optionId] of Object.entries(input.answers)) {
        const question = exam.questions.find((candidate) => candidate.id === questionId);
        if (!question || !question.options.some((option) => option.id === optionId)) {
          throw new Error("invalid_answer_payload");
        }
      }
      attempt.answers = { ...attempt.answers, ...input.answers };
    }
    if (input.currentQuestionIndex !== undefined) {
      attempt.currentQuestionIndex = input.currentQuestionIndex;
    }
    if (input.flaggedQuestionIds) {
      attempt.flaggedQuestionIds = [...input.flaggedQuestionIds];
    }
    attempt.version += 1;
    attempt.updatedAt = Date.now();
    return clone(attempt);
  }

  async submitAttempt(input: { userId: string; attemptId: string }): Promise<{ attempt: PublicExamAttempt; submittedAlready: boolean; expired: boolean }> {
    const attempt = this.attempts.get(input.attemptId);
    if (!attempt || attempt.ownerUserId !== input.userId) {
      throw new Error("attempt_not_found");
    }
    if (attempt.status === "submitted") {
      return { attempt: clone(attempt), submittedAlready: true, expired: false };
    }
    attempt.status = "submitted";
    attempt.submittedAt = Date.now();
    attempt.version += 1;
    attempt.score = scoreAttempt(exam.questions, attempt.answers, attempt.snapshotAnswers);
    attempt.reviewQuestions = clone(exam.questions).map((question) => ({
      ...question,
      correctOptionId: attempt.snapshotAnswers[question.id] ?? question.correctOptionId,
    }));
    return { attempt: clone(attempt), submittedAlready: false, expired: Date.now() > attempt.endsAt };
  }

  async listAttemptsForOwner(input: { userId: string }): Promise<PublicExamAttempt[]> {
    return Array.from(this.attempts.values())
      .filter((attempt) => attempt.ownerUserId === input.userId)
      .map((attempt) => clone(attempt));
  }

  clearForTests(): void {
    this.attempts.clear();
    this.creationRequests.clear();
    exam.questions[0].correctOptionId = "B";
    exam.questions[1].correctOptionId = "A";
  }

  mutateCorrectAnswer(questionId: string, correctOptionId: string): void {
    const question = exam.questions.find((candidate) => candidate.id === questionId);
    if (question) {
      question.correctOptionId = correctOptionId;
    }
  }

  private examForMode(includeAnswers: boolean): RuntimeExam {
    const copy = clone(exam);
    if (!includeAnswers) {
      copy.questions = copy.questions.map((question) => ({
        ...question,
        correctOptionId: "",
        explanation: "",
      }));
    }
    return copy;
  }
}

export const fakeExam = exam;
