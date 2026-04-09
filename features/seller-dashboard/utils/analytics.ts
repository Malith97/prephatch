import type {
  DateWindow,
  Enrollment,
  MockResult,
  RevenueRecord,
  SellerStudioSnapshot,
} from "../types";

export type PeriodKey = "30d" | "90d" | "365d" | "all";

export type CourseInsight = {
  courseId: string;
  courseTitle: string;
  enrollments: number;
  activeStudents: number;
  completionRate: number;
  averageScore: number;
  passRate: number;
  attempts: number;
  revenueMinor: number;
};

export type SellerAnalyticsSummary = {
  totalStudents: number;
  activeStudents: number;
  enrollments: number;
  completionRate: number;
  averageScore: number;
  passRate: number;
  mockAttempts: number;
  revenueMinor: number;
  netRevenueMinor: number;
  refundedOrders: number;
  courseInsights: CourseInsight[];
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type IncomeForecast = {
  projectedMinor: number;
  projected90Minor: number;
  dailyRunRateMinor: number;
  growthPercent: number;
  confidence: "low" | "medium" | "high";
};

function toTimestamp(value: string): number {
  return new Date(value).getTime();
}

function isInsideWindow(isoDate: string, window?: DateWindow): boolean {
  if (!window?.from && !window?.to) {
    return true;
  }

  const timestamp = toTimestamp(isoDate);
  if (Number.isNaN(timestamp)) {
    return false;
  }

  if (window.from) {
    const fromTs = toTimestamp(window.from);
    if (!Number.isNaN(fromTs) && timestamp < fromTs) {
      return false;
    }
  }

  if (window.to) {
    const toTs = toTimestamp(window.to);
    if (!Number.isNaN(toTs) && timestamp > toTs) {
      return false;
    }
  }

  return true;
}

function withinLastDays(isoDate: string, days: number): boolean {
  const timestamp = toTimestamp(isoDate);

  if (Number.isNaN(timestamp)) {
    return false;
  }

  const now = Date.now();
  return now - timestamp <= days * 24 * 60 * 60 * 1000;
}

function average(values: number[]): number {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, current) => sum + current, 0) / values.length;
}

function monthKey(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  if (!key.includes("-")) {
    return key;
  }

  const [year, month] = key.split("-");
  return `${year}-${month}`;
}

function toDateOnly(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "invalid";
  }

  return date.toISOString().slice(0, 10);
}

function groupMonthly<T>(
  list: T[],
  isoGetter: (item: T) => string,
  valueGetter: (item: T) => number,
): TrendPoint[] {
  const bucket = new Map<string, number[]>();

  list.forEach((item) => {
    const key = monthKey(isoGetter(item));
    const values = bucket.get(key) ?? [];
    values.push(valueGetter(item));
    bucket.set(key, values);
  });

  return [...bucket.entries()]
    .sort(([left], [right]) => (left > right ? 1 : -1))
    .map(([key, values]) => ({
      label: monthLabel(key),
      value: average(values),
    }));
}

function sumNetRevenue(records: RevenueRecord[]): number {
  return records
    .filter((record) => !record.refunded)
    .reduce((sum, record) => sum + record.netMinor, 0);
}

function uniqueCount(values: string[]): number {
  return new Set(values).size;
}

export function getWindowFromPeriod(period: PeriodKey): DateWindow | undefined {
  if (period === "all") {
    return undefined;
  }

  const days = period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  return {
    from,
    to: new Date().toISOString(),
  };
}

export function computeSellerAnalytics(
  snapshot: SellerStudioSnapshot,
  options?: {
    window?: DateWindow;
    courseId?: string;
  },
): SellerAnalyticsSummary {
  const courses = options?.courseId
    ? snapshot.courses.filter((course) => course.id === options.courseId)
    : snapshot.courses;
  const validCourseIds = new Set(courses.map((course) => course.id));

  const enrollments = snapshot.enrollments.filter(
    (enrollment) =>
      validCourseIds.has(enrollment.courseId) &&
      isInsideWindow(enrollment.enrolledAt, options?.window),
  );

  const results = snapshot.results.filter(
    (result) =>
      validCourseIds.has(result.courseId) &&
      isInsideWindow(result.submittedAt, options?.window),
  );

  const revenue = snapshot.revenueRecords.filter(
    (record) =>
      validCourseIds.has(record.courseId) &&
      isInsideWindow(record.createdAt, options?.window),
  );

  const activeStudentIds = enrollments
    .filter((enrollment) => enrollment.status === "active" && withinLastDays(enrollment.lastActiveAt, 14))
    .map((enrollment) => enrollment.studentId);

  const courseInsights: CourseInsight[] = courses.map((course) => {
    const courseEnrollments = enrollments.filter((entry) => entry.courseId === course.id);
    const courseResults = results.filter((entry) => entry.courseId === course.id);
    const courseRevenue = revenue.filter((entry) => entry.courseId === course.id);

    return {
      courseId: course.id,
      courseTitle: course.title,
      enrollments: courseEnrollments.length,
      activeStudents: uniqueCount(
        courseEnrollments
          .filter((entry) => entry.status === "active" && withinLastDays(entry.lastActiveAt, 14))
          .map((entry) => entry.studentId),
      ),
      completionRate: average(courseEnrollments.map((entry) => entry.completionPercent)),
      averageScore: average(courseResults.map((entry) => entry.scorePercent)),
      passRate:
        courseResults.length > 0
          ? (courseResults.filter((entry) => entry.passed).length / courseResults.length) * 100
          : 0,
      attempts: courseResults.length,
      revenueMinor: sumNetRevenue(courseRevenue),
    };
  });

  return {
    totalStudents: uniqueCount(enrollments.map((enrollment) => enrollment.studentId)),
    activeStudents: uniqueCount(activeStudentIds),
    enrollments: enrollments.length,
    completionRate: average(enrollments.map((enrollment) => enrollment.completionPercent)),
    averageScore: average(results.map((result) => result.scorePercent)),
    passRate:
      results.length > 0
        ? (results.filter((result) => result.passed).length / results.length) * 100
        : 0,
    mockAttempts: results.length,
    revenueMinor: revenue.reduce((sum, record) => sum + record.grossMinor, 0),
    netRevenueMinor: sumNetRevenue(revenue),
    refundedOrders: revenue.filter((record) => record.refunded).length,
    courseInsights,
  };
}

export function buildEnrollmentTrend(
  enrollments: Enrollment[],
  options?: {
    window?: DateWindow;
    courseId?: string;
  },
): TrendPoint[] {
  const filtered = enrollments.filter(
    (enrollment) =>
      (!options?.courseId || enrollment.courseId === options.courseId) &&
      isInsideWindow(enrollment.enrolledAt, options?.window),
  );

  const bucket = new Map<string, number>();
  filtered.forEach((entry) => {
    const key = monthKey(entry.enrolledAt);
    bucket.set(key, (bucket.get(key) ?? 0) + 1);
  });

  return [...bucket.entries()]
    .sort(([left], [right]) => (left > right ? 1 : -1))
    .map(([key, count]) => ({
      label: monthLabel(key),
      value: count,
    }));
}

export function buildScoreTrend(
  results: MockResult[],
  options?: {
    window?: DateWindow;
    courseId?: string;
  },
): TrendPoint[] {
  const filtered = results.filter(
    (result) =>
      (!options?.courseId || result.courseId === options.courseId) &&
      isInsideWindow(result.submittedAt, options?.window),
  );

  return groupMonthly(filtered, (item) => item.submittedAt, (item) => item.scorePercent);
}

export function buildRevenueTrend(
  revenue: RevenueRecord[],
  options?: {
    window?: DateWindow;
    courseId?: string;
  },
): TrendPoint[] {
  const filtered = revenue.filter(
    (record) =>
      !record.refunded &&
      (!options?.courseId || record.courseId === options.courseId) &&
      isInsideWindow(record.createdAt, options?.window),
  );

  return groupMonthly(filtered, (item) => item.createdAt, (item) => item.netMinor);
}

function toDailyRevenueSeries(records: RevenueRecord[]): number[] {
  const daily = new Map<string, number>();

  records
    .filter((record) => !record.refunded)
    .forEach((record) => {
      const key = toDateOnly(record.createdAt);
      daily.set(key, (daily.get(key) ?? 0) + record.netMinor);
    });

  return [...daily.entries()]
    .sort(([left], [right]) => (left > right ? 1 : -1))
    .map(([, value]) => value);
}

function linearForecast(values: number[], horizon: number): number {
  if (!values.length || horizon <= 0) {
    return 0;
  }

  if (values.length === 1) {
    return values[0] * horizon;
  }

  const n = values.length;
  let xSum = 0;
  let ySum = 0;
  let xySum = 0;
  let xxSum = 0;

  values.forEach((value, index) => {
    xSum += index;
    ySum += value;
    xySum += index * value;
    xxSum += index * index;
  });

  const denominator = n * xxSum - xSum * xSum;
  const slope = denominator === 0 ? 0 : (n * xySum - xSum * ySum) / denominator;
  const intercept = (ySum - slope * xSum) / n;

  let total = 0;
  for (let i = n; i < n + horizon; i += 1) {
    total += Math.max(0, intercept + slope * i);
  }

  return total;
}

export function predictIncome(
  revenueRecords: RevenueRecord[],
  options?: {
    courseId?: string;
  },
): IncomeForecast {
  const scoped = revenueRecords
    .filter((record) => !options?.courseId || record.courseId === options.courseId)
    .sort((left, right) => (left.createdAt > right.createdAt ? 1 : -1));

  const dailySeries = toDailyRevenueSeries(scoped);
  const dailyRunRateMinor = average(dailySeries);

  const projectedMinor = Math.round(linearForecast(dailySeries, 30));
  const projected90Minor = Math.round(linearForecast(dailySeries, 90));

  const recent = dailySeries.slice(-30);
  const prior = dailySeries.slice(-60, -30);
  const recentSum = recent.reduce((sum, value) => sum + value, 0);
  const priorSum = prior.reduce((sum, value) => sum + value, 0);
  const growthPercent =
    priorSum > 0 ? ((recentSum - priorSum) / priorSum) * 100 : recentSum > 0 ? 100 : 0;

  const confidence: IncomeForecast["confidence"] =
    dailySeries.length >= 25 ? "high" : dailySeries.length >= 10 ? "medium" : "low";

  return {
    projectedMinor,
    projected90Minor,
    dailyRunRateMinor,
    growthPercent,
    confidence,
  };
}
