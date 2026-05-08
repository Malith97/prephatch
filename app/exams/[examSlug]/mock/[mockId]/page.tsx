import { redirect } from "next/navigation";

type MockPlayerPageProps = {
  params: {
    examSlug: string;
    mockId: string;
  };
};

export default function MockPlayerPage({ params }: MockPlayerPageProps) {
  console.info(
    `[routing] legacy_redirect from=/exams/${params.examSlug}/mock/${params.mockId} to=/exam/${params.examSlug}/session/${params.mockId}`,
  );
  redirect(`/exam/${params.examSlug}/session/${params.mockId}`);
}
