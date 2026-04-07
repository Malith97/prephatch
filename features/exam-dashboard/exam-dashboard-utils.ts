import type {
  ExamWorkspaceData,
  ExamWorkspaceMock,
  ExamWorkspaceResource,
  ExamWorkspaceResult,
  ExamWorkspaceWeakArea,
} from "../exams/mock-exam-workspace";

export type ExamTrendPoint = {
  label: string;
  score: number;
};

export type TopicMasteryDatum = {
  label: string;
  score: number;
  detail: string;
};

export type PracticeQuestionSet = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  ctaHref: string;
};

export type ExamRecommendation = {
  id: string;
  title: string;
  detail: string;
  href: string;
  ctaLabel: string;
};

function parsePercent(value: string): number | null {
  const match = value.match(/(\d{1,3})%/);

  return match ? Number(match[1]) : null;
}

export function getCanonicalMocks(exam: ExamWorkspaceData): ExamWorkspaceMock[] {
  return exam.mockExams.map((mock) => ({
    ...mock,
    href: mock.isLive ? `/exam/${exam.slug}/session/${mock.id}` : `/exam/${exam.slug}/mock-exams`,
  }));
}

export function getCanonicalResults(
  exam: ExamWorkspaceData,
): Array<ExamWorkspaceResult & { canOpen: boolean }> {
  return exam.previousResults.map((result) => {
    const canOpen = result.href.includes("latest-local");

    return {
      ...result,
      href: canOpen
        ? `/exam/${exam.slug}/results/latest-local`
        : `/exam/${exam.slug}/mock-exams`,
      canOpen,
    };
  });
}

export function getScoreTrend(exam: ExamWorkspaceData): ExamTrendPoint[] {
  return getCanonicalResults(exam)
    .map((result) => ({
      label: result.dateLabel,
      score: parsePercent(result.scoreLabel) ?? 0,
    }))
    .filter((point) => point.score > 0)
    .reverse();
}

export function getTopicMastery(exam: ExamWorkspaceData): TopicMasteryDatum[] {
  const weaknessData = exam.weakAreas.map((area) => ({
    label: area.topic,
    score: parsePercent(area.signal) ?? Math.max(exam.readiness.score - 12, 48),
    detail: area.note,
  }));

  return [
    ...weaknessData,
    {
      label: "Exam-time decision patterns",
      score: Math.min(exam.readiness.score + 7, 92),
      detail:
        "Confidence in process and constraint-first reasoning is ahead of the weakest technical topics.",
    },
  ];
}

export function getPracticeQuestionSets(
  exam: ExamWorkspaceData,
): PracticeQuestionSet[] {
  return exam.overview.focusAreas.map((focusArea, index) => ({
    id: `${exam.slug}-practice-${index + 1}`,
    title: `Practice set ${index + 1}`,
    description: focusArea,
    questionCount: 12 + index * 4,
    ctaHref: `/exam/${exam.slug}/mock-exams`,
  }));
}

export function getRecommendations(
  exam: ExamWorkspaceData,
): ExamRecommendation[] {
  const weakestArea = exam.weakAreas[0];
  const nextWeakArea = exam.weakAreas[1];
  const nextMock = getCanonicalMocks(exam).find((mock) => mock.isLive) ??
    getCanonicalMocks(exam)[0];

  const recommendations: ExamRecommendation[] = [];

  if (nextMock) {
    recommendations.push({
      id: `${exam.slug}-recommendation-next-mock`,
      title: `Retry ${nextMock.title}`,
      detail:
        "Use the next attempt to confirm whether the current weak areas are improving under timed pressure.",
      href: nextMock.href,
      ctaLabel: "Open mock",
    });
  }

  if (weakestArea) {
    recommendations.push({
      id: `${exam.slug}-recommendation-weakest-topic`,
      title: `Study ${weakestArea.topic}`,
      detail: weakestArea.note,
      href: `/exam/${exam.slug}/weak-areas`,
      ctaLabel: "Open weak areas",
    });
  }

  if (nextWeakArea) {
    recommendations.push({
      id: `${exam.slug}-recommendation-notes`,
      title: `Turn ${nextWeakArea.topic} into a cheat note`,
      detail:
        "Capture the default pattern in one short note so it is easier to recall during the next exam session.",
      href: `/exam/${exam.slug}/notes`,
      ctaLabel: "Open notes",
    });
  }

  return recommendations;
}

export function getWeakAreaScore(area: ExamWorkspaceWeakArea): number {
  return parsePercent(area.signal) ?? 0;
}

export function getPrimaryResource(
  resources: ExamWorkspaceResource[],
): ExamWorkspaceResource | null {
  return resources[0] ?? null;
}
