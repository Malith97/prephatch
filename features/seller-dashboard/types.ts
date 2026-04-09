export type CourseStatus = "draft" | "published" | "unpublished" | "archived";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type QuestionStatus = "draft" | "published" | "archived";
export type QuestionType = "single_choice" | "multiple_choice";
export type QuestionDifficulty = "easy" | "medium" | "hard";
export type ExamStatus = "draft" | "published" | "unpublished";
export type EnrollmentStatus = "active" | "completed" | "inactive";

export type PricingConfig = {
  priceMinor: number;
  currency: string;
  discountPercent: number;
  discountLabel?: string;
};

export type SellerCourse = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: CourseLevel;
  status: CourseStatus;
  updatedAt: string;
  publishedAt?: string;
  pricing: PricingConfig;
};

export type QuestionOption = {
  id: string;
  label: string;
  text: string;
};

export type SellerQuestion = {
  id: string;
  courseId: string;
  status: QuestionStatus;
  type: QuestionType;
  title: string;
  questionText: string;
  prompt: string;
  context: string;
  category: string;
  keywords: string[];
  difficulty: QuestionDifficulty;
  marks: number;
  options: QuestionOption[];
  correctOptionIds: string[];
  explanation: string;
  createdAt: string;
  updatedAt: string;
  source: "manual" | "csv";
};

export type MockExamConfig = {
  id: string;
  courseId: string;
  title: string;
  status: ExamStatus;
  questionCount: number;
  durationMinutes: number;
  passScore: number;
  randomizeQuestions: boolean;
  questionIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type SellerStudent = {
  id: string;
  name: string;
  email: string;
  country: string;
  joinedAt: string;
};

export type Enrollment = {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
  progressPercent: number;
  completionPercent: number;
  status: EnrollmentStatus;
  lastActiveAt: string;
  totalAttempts: number;
};

export type MockResult = {
  id: string;
  studentId: string;
  courseId: string;
  mockExamId: string;
  scorePercent: number;
  passed: boolean;
  submittedAt: string;
  durationMinutes: number;
};

export type RevenueRecord = {
  id: string;
  courseId: string;
  studentId: string;
  grossMinor: number;
  discountMinor: number;
  netMinor: number;
  refunded: boolean;
  couponCode?: string;
  createdAt: string;
};

export type PayoutSummary = {
  id: string;
  periodLabel: string;
  grossMinor: number;
  feesMinor: number;
  netMinor: number;
  status: "paid" | "processing";
  paidAt?: string;
};

export type SellerStudioSnapshot = {
  sellerId: string;
  courses: SellerCourse[];
  questions: SellerQuestion[];
  mockExamConfigs: MockExamConfig[];
  students: SellerStudent[];
  enrollments: Enrollment[];
  results: MockResult[];
  revenueRecords: RevenueRecord[];
  payouts: PayoutSummary[];
};

export type DateWindow = {
  from?: string;
  to?: string;
};
