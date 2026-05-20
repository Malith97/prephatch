#!/usr/bin/env node
import assert from "node:assert/strict";
import { scoreSnapshot } from "./free-mock-flow.mjs";

const questions = [
  { examVersionQuestionId: "q1", topicLabel: "Logic", correctOptionId: "B", points: 1 },
  { examVersionQuestionId: "q2", topicLabel: "Aptitude", correctOptionId: "D", points: 1 },
  { examVersionQuestionId: "q3", topicLabel: "Logic", correctOptionId: "A", points: 1 },
];

const score = scoreSnapshot(questions, { q1: "B", q2: "A", q3: "A" }, 70);
assert.equal(score.totalQuestions, 3);
assert.equal(score.correctAnswers, 2);
assert.equal(score.rawScore, 2);
assert.equal(score.maxScore, 3);
assert.equal(score.percentage, 66.67);
assert.equal(score.passed, false);
assert.equal(score.topicScores.Logic.correct, 2);
assert.equal(score.topicScores.Aptitude.incorrect, 1);
console.log("free-mock-flow scoring unit test passed");
