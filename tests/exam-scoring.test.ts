import { describe, expect, it } from "vitest";

import { scoreAttempt } from "../server/exams/scoring";
import { awsSaaC03Exam } from "../server/mock-data/aws-saa-c03";

describe("scoreAttempt", () => {
  it("calculates counts, percentage, and scaled score preview", () => {
    const score = scoreAttempt(awsSaaC03Exam, {
      "networking-vpc": "b",
      "storage-durability": "c",
      "scaling-stateless": "d",
    });

    expect(score.correctCount).toBe(2);
    expect(score.incorrectCount).toBe(1);
    expect(score.unansweredCount).toBe(1);
    expect(score.percentageScore).toBe(50);
    expect(score.scaledScorePreview).toBe(550);
    expect(score.previewFormulaLabel).toContain("not a real certification score");
  });
});
