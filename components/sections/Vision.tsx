import Image from "next/image";
import StepLabel from "@/components/ui/StepLabel";

export default function Vision() {
  return (
    <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:gap-20">
          <div>
            <StepLabel number="07" label="Current direction" className="mb-5" />
            <p className="max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-5xl sm:leading-tight">
              Make AI-supported work easier to understand, improve, and trust.
            </p>
          </div>
          <figure>
            <Image
              src="/images/hero/hero-02.jpeg"
              alt="Fine lines moving through a structured field"
              width={679}
              height={455}
              className="w-full rounded-[var(--radius-lg)] border border-gray-200 shadow-[var(--shadow-soft)] grayscale dark:border-gray-800"
            />
            <figcaption className="mt-3 text-xs text-gray-500 dark:text-gray-500">
              A visual reference for work moving through systems, constraints,
              and decisions.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
