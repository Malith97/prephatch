import { getAttemptsRepository } from "./db-repository";
import type { ExamSummary, MockExam } from "./types";

type GetExamOptions = {
  organizationId?: string | null;
  includeAnswers?: boolean;
};

const DEFAULT_DEV_ORG_ID = "22222222-2222-4222-8222-222222222222";

function resolveOrganizationId(options?: GetExamOptions): string {
  return (
    options?.organizationId?.trim() ||
    process.env.DEV_BYPASS_ORGANIZATION_ID?.trim() ||
    DEFAULT_DEV_ORG_ID
  );
}

export async function listExamSummaries(options?: GetExamOptions): Promise<ExamSummary[]> {
  const exams = await getAttemptsRepository().listCatalogPackages();
  return exams.map((exam) => ({
    id: exam.id,
    slug: exam.slug,
    certificationCode: exam.certificationCode,
    title: exam.title,
    description: exam.description,
    durationMinutes: exam.durationMinutes,
    questionCount: exam.questions.length,
  }));
}

export async function getExamBySlug(
  examSlug: string,
  options?: GetExamOptions,
): Promise<MockExam | null> {
  const exam = await getAttemptsRepository().findRuntimeExam({
    organizationId: resolveOrganizationId(options),
    examSlug,
    includeAnswers: options?.includeAnswers ?? true,
  });

  return exam;
}
