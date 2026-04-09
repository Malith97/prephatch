import type {
  DateWindow,
  Enrollment,
  MockResult,
  RevenueRecord,
  SellerCourse,
  SellerQuestion,
  SellerStudioSnapshot,
} from "../../features/seller-dashboard/types";
import { sellerStudioSeed } from "./seed";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isInsideWindow(isoDate: string, window?: DateWindow): boolean {
  if (!window?.from && !window?.to) {
    return true;
  }

  const timestamp = new Date(isoDate).getTime();
  if (Number.isNaN(timestamp)) {
    return false;
  }

  if (window.from) {
    const from = new Date(window.from).getTime();
    if (!Number.isNaN(from) && timestamp < from) {
      return false;
    }
  }

  if (window.to) {
    const to = new Date(window.to).getTime();
    if (!Number.isNaN(to) && timestamp > to) {
      return false;
    }
  }

  return true;
}

export function getSellerStudioSeed(): SellerStudioSnapshot {
  return clone(sellerStudioSeed);
}

export function listSellerCourses(): SellerCourse[] {
  return clone(sellerStudioSeed.courses);
}

export function listSellerQuestions(): SellerQuestion[] {
  return clone(sellerStudioSeed.questions);
}

export function listEnrollments(window?: DateWindow): Enrollment[] {
  return sellerStudioSeed.enrollments
    .filter((enrollment) => isInsideWindow(enrollment.enrolledAt, window))
    .map((entry) => clone(entry));
}

export function listResults(window?: DateWindow): MockResult[] {
  return sellerStudioSeed.results
    .filter((result) => isInsideWindow(result.submittedAt, window))
    .map((entry) => clone(entry));
}

export function listRevenue(window?: DateWindow): RevenueRecord[] {
  return sellerStudioSeed.revenueRecords
    .filter((record) => isInsideWindow(record.createdAt, window))
    .map((entry) => clone(entry));
}
