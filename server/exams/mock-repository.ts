import { getAttemptsRepository } from "./db-repository";
import type { ExamSummary, MockExam } from "./types";
import { resolveDevBypassOrganizationId } from "../../lib/auth/dev-bypass-identity";

type GetExamOptions = {
  organizationId?: string | null;
  includeAnswers?: boolean;
};

function resolveOrganizationId(options?: GetExamOptions): string {
  return (
    options?.organizationId?.trim() ||
    resolveDevBypassOrganizationId()
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
