import { readMdxFile } from "@/lib/mdx";
import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";

export function generateStaticParams(): { slug: string }[] {
  const contentDir = process.cwd() + "/content/research/";
  
  try {
    // List all .mdx files in the research directory (non-recursive)
    const mdxFiles: { slug: string }[] = [];
    
    for (const dirent of fs.readdirSync(contentDir, { withFileTypes: true })) {
      if (dirent.isFile() && dirent.name.endsWith(".mdx")) {
        // Extract slug from filename without extension and leading "first-" prefix if present
        const nameWithoutExt = dirent.name.replace(/\.mdx$/, "");
        
        // Skip the first-post placeholder for now, or include it with its actual slug
        mdxFiles.push({ slug: nameWithoutExt });
      }
    }

    return mdxFiles;
  } catch {
    return [];
  }
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  
  // Read the MDX file to get its frontmatter for metadata
  try {
    const filePath = path.join(process.cwd(), "content/research/", `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) return {};

    const mdxData: Record<string, unknown> & { body?: string } = readMdxFile(filePath);
    
    // Only generate metadata if title and summary are present (not empty placeholders)
    const title = typeof mdxData.title === "string" && mdxData.title.trim() !== "" ? mdxData.title : undefined;
    const description = 
      typeof mdxData.summary === "string" && mdxData.summary.trim() !== "" 
        ? `${mdxData.summary}` // Use summary as the meta description for now
        : undefined;

    return {
      title,
      ...(description && { description }),
    };
  } catch {
    return {};
  }
}

export default async function ResearchPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  
  // Read the MDX file to get its content and metadata for rendering
  try {
    const filePath = path.join(process.cwd(), "content/research/", `${params.slug}.mdx`);

    if (!fs.existsSync(filePath)) return null;

    const mdxData: Record<string, unknown> & { body?: string } = readMdxFile(filePath);
    
    // Skip rendering placeholder posts with empty titles/summaries (status !== "draft")
    const title = typeof mdxData.title === "string" && mdxData.title.trim() !== "" ? mdxData.title : undefined;

    if (!title) return null;

    return (
      <article className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <header>
            {typeof mdxData.status === "string" && 
              mdxData.status.toLowerCase() !== "draft" ? (
              // Published or other status — show title and summary as header content
              <>
                <h1 className="text-4xl font-bold tracking-tight mb-6">
                  {title}
                </h1>
                
                {/* Optional: Show a subtitle/summary line if available */}
                {typeof mdxData.summary === "string" && 
                 mdxData.summary.trim() !== "" ? (
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    {mdxData.summary}
                  </p>
                ) : null}

                {/* Status badge if not a draft */}
                {(typeof mdxData.status === "string" && 
                 ["published", "research note", "technical report"].includes(mdxData.status.toLowerCase())) ? (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800">
                    {mdxData.status}
                  </div>
                ) : null}

              </>
            ) : null}
          </header>

          {/* Render the MDX body content */}
          <section className="prose prose-slate max-w-none dark:prose-invert">
            {typeof mdxData.body === "string" && 
             mdxData.body.trim() !== "" ? (
              // Simple text rendering — in a real setup, you'd use @mdx-js/react for full MDX parsing
              <div dangerouslySetInnerHTML={{ __html: sanitizeMarkdown(mdxData.body) }} />
            ) : null}

          </section>
        </div>
      </article>
    );
  } catch {
    return null;
  }
}

// Simple markdown-to-HTML sanitizer for basic text rendering without external deps
function sanitizeMarkdown(markdown: string): string {
  let html = markdown
  
    // Escape HTML entities first to prevent XSS from raw content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

    // Convert basic inline formatting (bold, italic) — optional if body is plain text only
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, '<em class="text-gray-600 dark:text-gray-400">$1</em>')

    // Convert basic block elements (headers) — optional if body is plain text only
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold tracking-tight mb-6">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold tracking-tight mb-6">$1</h1>')

    // Convert list items (unordered) — optional if body is plain text only
    .replace(/^\s*[-*] (.+)$/gm, '<li>$1</li>')

    // Wrap lists in <ul> tags — optional if body is plain text only
    .replace(/(<\/?li>)\n/gi, "$1\n")
    .replace(/\n<li>/g, "<ul><li>")
    .replace(/<\/li>\n/, "</li></ul>\n")

    // Convert code blocks (fenced with triple backticks) — optional if body is plain text only
    .replace(/^```(\w+)?\n([\s\S]*?)^```\n/gm, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md"><code>$2</code></pre>')

    // Convert inline code (single backticks) — optional if body is plain text only
    .replace(/`([^`]+)`/g, '<code class="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>')

    // Remove any remaining list markers that weren't converted (cleanup) — optional if body is plain text only
    .replace(/^\s*[-*] /gm, "")

    // Convert horizontal rules — optional if body is plain text only
    .replace(/^---$/gim, '<hr class="my-8" />')

    ;

  return html;
}