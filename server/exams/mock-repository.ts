import { awsSaaC03Exam } from "../mock-data/aws-saa-c03";
import type { ExamSummary, MockExam } from "./types";

const mockExams: MockExam[] = [awsSaaC03Exam];

export function listExamSummaries(): ExamSummary[] {
  return mockExams.map((exam) => ({
    id: exam.id,
    slug: exam.slug,
    certificationCode: exam.certificationCode,
    title: exam.title,
    description: exam.description,
    durationMinutes: exam.durationMinutes,
    questionCount: exam.questions.length,
  }));
}

export function getExamBySlug(examSlug: string): MockExam | null {
  return mockExams.find((exam) => exam.slug === examSlug) ?? null;
}
