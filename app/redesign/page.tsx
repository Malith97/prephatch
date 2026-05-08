import { Suspense } from "react";
import {
  AnswerOptions,
  AppShell,
  AuthWrapper,
  DashboardOverview,
  DashboardOverviewSkeleton,
  ExamHeader,
  FAQSection,
  FeaturesGrid,
  FilterPanel,
  FormView,
  InsightsPanel,
  LandingHero,
  LoginForm,
  PackageList,
  PackageListSkeleton,
  PaletteNav,
  ProgressTabs,
  PublicShell,
  QuestionPanel,
  ResultsSummary,
  ScoreChart,
  SignupForm,
  TableView,
  TestimonialList,
  TimerBar,
  WeakAreasList,
} from "../../features/redesign/components";
import { getDashboardMetrics, getMarketplacePackages, getSampleQuestion, getWeakAreas } from "../../features/redesign/lib/mock-data";

const appNav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/my-exams", label: "My Exams" },
  { href: "/dashboard/marketplace", label: "Marketplace", badge: "New" },
  { href: "/dashboard/settings", label: "Settings" },
];

const question = getSampleQuestion();
const weakAreas = getWeakAreas();

export default function RedesignPage() {
  const metricsPromise = getDashboardMetrics();
  const packagePromise = getMarketplacePackages();

  return (
    <div className="space-y-12 pb-12">
      <PublicShell>
        <div className="space-y-10">
          <LandingHero />
          <FeaturesGrid />
          <TestimonialList />
          <FAQSection />
        </div>
      </PublicShell>

      <section className="phx-page-bg py-8">
        <div className="phx-container grid gap-6 lg:grid-cols-2">
          <AuthWrapper title="Welcome back" subtitle="Sign in to continue your prep flow.">
            <LoginForm />
          </AuthWrapper>
          <AuthWrapper title="Create your account" subtitle="Start your guided exam prep journey.">
            <SignupForm />
          </AuthWrapper>
        </div>
      </section>

      <section className="phx-page-bg py-8">
        <div className="phx-container grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <FilterPanel providers={["All", "PrepHatch Labs", "CertSprint"]} levels={["All", "Beginner", "Advanced"]} onChange={() => undefined} />
          <Suspense fallback={<PackageListSkeleton />}>
            <PackageList packagesPromise={packagePromise} />
          </Suspense>
        </div>
      </section>

      <AppShell title="Learner Dashboard" navItems={appNav}>
        <Suspense fallback={<DashboardOverviewSkeleton />}>
          <DashboardOverview metricsPromise={metricsPromise} />
        </Suspense>
        <div className="mt-4">
          <ProgressTabs />
        </div>
      </AppShell>

      <section className="phx-page-bg py-8">
        <div className="phx-container grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <ExamHeader title="Mock Exam: Product Analytics" />
            <TimerBar durationSeconds={3600} initialElapsed={870} />
            <QuestionPanel question={question} />
            <AnswerOptions options={question.options} />
          </div>
          <PaletteNav total={40} current={7} />
        </div>
      </section>

      <section className="phx-page-bg py-8">
        <div className="phx-container space-y-4">
          <ResultsSummary score={78} percentile={84} timeSpent="54m" />
          <div className="grid gap-4 lg:grid-cols-2">
            <ScoreChart
              points={[
                { label: "Mock 1", value: 58 },
                { label: "Mock 2", value: 66 },
                { label: "Mock 3", value: 72 },
                { label: "Mock 4", value: 78 },
              ]}
            />
            <WeakAreasList areas={weakAreas} />
          </div>
        </div>
      </section>

      <section className="phx-page-bg py-8">
        <div className="phx-container grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <TableView
            title="Seller / Admin Table"
            columns={[
              { id: "name", label: "Package" },
              { id: "owner", label: "Owner" },
              { id: "status", label: "Status" },
            ]}
            rows={[
              { name: "Analytics Pro", owner: "Team A", status: "Published" },
              { name: "Cloud Secure", owner: "Team B", status: "Draft" },
            ]}
          />
          <div className="space-y-4">
            <FormView title="Create / Edit Package" />
            <InsightsPanel
              items={[
                { label: "Monthly Revenue", value: "$24.8k", detail: "+12% vs last month" },
                { label: "Active Learners", value: "1,482", detail: "Daily active uptrend" },
                { label: "Completion Rate", value: "68%", detail: "Improved in timed sessions" },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
