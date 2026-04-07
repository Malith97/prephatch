import { redirect } from "next/navigation";

type MockPlayerPageProps = {
  params: {
    examSlug: string;
    mockId: string;
  };
};

export default function MockPlayerPage({ params }: MockPlayerPageProps) {
  redirect(`/exam/${params.examSlug}/session/${params.mockId}`);
}
