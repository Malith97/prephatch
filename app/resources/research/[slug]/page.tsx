import { readMdxFile } from "@/lib/mdx";
import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import StepLabel from "@/components/ui/StepLabel";
import StatusBadge from "@/components/ui/StatusBadge";

export function generateStaticParams(): { slug: string }[] {
  const contentDir = path.join(process.cwd(), "content/research");
  
  try {
    const mdxFiles: { slug: string }[] = [];
    
    for (const dirent of fs.readdirSync(contentDir, { withFileTypes: true })) {
      if (dirent.isFile() && dirent.name.endsWith(".mdx")) {
        const nameWithoutExt = dirent.name.replace(/\.mdx$/, "");
        mdxFiles.push({ slug: nameWithoutExt });
      }
    }

    return mdxFiles;
  } catch {
    return [];
  }
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  
  try {
    const filePath = path.join(
      process.cwd(),
      "content/research/",
      `${slug}.mdx`,
    );

    if (!fs.existsSync(filePath)) return {};

    const mdxData: Record<string, unknown> & { body?: string } =
      readMdxFile(filePath);

    const title =
      typeof mdxData.title === "string" && mdxData.title.trim() !== ""
        ? mdxData.title
        : undefined;
    const description =
      typeof mdxData.summary === "string" && mdxData.summary.trim() !== ""
        ? mdxData.summary
        : undefined;

    return {
      title,
      ...(description && { description }),
    };
  } catch {
    return {};
  }
}

export default async function ResearchPage(props: {
  params: Promise<{ slug: string }>,
}) {
  const params = await props.params;

  const filePath = path.join(
    process.cwd(),
    "content/research/",
    `${params.slug}.mdx`,
  );
  let mdxData: Record<string, unknown> & { body?: string };

  try {
    if (!fs.existsSync(filePath)) return null;
    mdxData = readMdxFile(filePath);
  } catch {
    return null;
  }

  const title =
    typeof mdxData.title === "string" && mdxData.title.trim() !== ""
      ? mdxData.title
      : undefined;
  const summary =
    typeof mdxData.summary === "string" && mdxData.summary.trim() !== ""
      ? mdxData.summary
      : undefined;
  const date = typeof mdxData.date === "string" ? mdxData.date : undefined;
  const status = typeof mdxData.status === "string" ? mdxData.status : undefined;

  if (!title) return null;

  return (
    <article className="border-b border-gray-200 py-16 sm:py-24 lg:py-28 dark:border-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-4xl">
          <StepLabel number="Research archive" label="Note 01" />

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl sm:leading-tight">
            {title}
          </h1>

          {summary ? (
            <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              {summary}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-500">
            {date ? <time dateTime={date}>{date}</time> : null}
            {status ? (
              <StatusBadge
                status={status}
                variant={status === "draft" ? "draft" : "note"}
              />
            ) : null}
          </div>
        </header>

        <section className="prose prose-slate mt-16 max-w-3xl pt-10 dark:prose-invert sm:mt-20 sm:pt-12">
          {typeof mdxData.body === "string" &&
          mdxData.body.trim() !== "" ? (
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeMarkdown(mdxData.body) }}
            />
          ) : null}
        </section>
      </div>
    </article>
  );
}

function sanitizeMarkdown(markdown: string): string {
  return markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, '<em class="text-gray-600 dark:text-gray-400">$1</em>')

    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-2xl font-bold tracking-tight mb-6">$1</h2>',
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 class="text-4xl font-bold tracking-tight mb-6">$1</h1>',
    )

    .replace(/^\s*[-*] (.+)$/gm, "<li>$1</li>")

    .replace(/(<\/?li>)\n/gi, "$1\n")
    .replace(/\n<li>/g, "<ul><li>")
    .replace(/<\/li>\n/, "</li></ul>\n")

    .replace(
      /^```(\w+)?\n([\s\S]*?)^```\n/gm,
      '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md"><code>$2</code></pre>',
    )

    .replace(
      /`([^`]+)`/g,
      '<code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>',
    )

    .replace(/^\s*[-*] /gm, "")

    .replace(/^---$/gim, '<hr class="my-8" />');
}