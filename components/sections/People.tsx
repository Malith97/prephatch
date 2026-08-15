import Image from "next/image";
import StepLabel from "@/components/ui/StepLabel";

const people = [
  { image: "team-01.jpeg", name: "Hugh Williams", role: "Founder" },
  { image: "team-02.jpg", name: "Christopher Cook", role: "Co-Founder" },
  { image: "team-03.jpeg", name: "Danny Doan", role: "Head of Research" },
  { image: "team-04.jpeg", name: "Niusha Shafiabady", role: "Head of Marketing" },
  { image: "team-05.jpeg", name: "Dilina Fernando", role: "Head of People" },
];

export default function People() {
  return (
    <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
          <StepLabel number="" label="People / Leadership" />
          <div>
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
              The people behind the work.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              These portraits are part of the project materials currently
              available. Names, roles, and biographies will be confirmed before
              they are published as team information.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {people.map((person) => (
            <article
              key={person.name}
              className="group overflow-hidden rounded-[var(--radius-lg)] border border-gray-200 bg-[var(--surface)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] dark:border-gray-800"
            >
              <div className="overflow-hidden">
                <Image
                  src={`/images/team/${person.image}`}
                  alt={`${person.name}, ${person.role}`}
                  width={500}
                  height={500}
                  className="aspect-square w-full object-cover grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {person.name}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {person.role}
                </p>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                  Profile information to be confirmed.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
