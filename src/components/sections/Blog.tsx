import type { SectionOf, SiteDocument } from "@/lib/schema/page-schema";
import { HeadingBlock, ImagePlaceholder, SectionShell } from "./_shared";

export function Blog({ section }: { section: SectionOf<"blog">; document: SiteDocument }) {
  const { title, subtitle, columns, posts } = section.props;
  const cols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <SectionShell section={section}>
      <HeadingBlock title={title} subtitle={subtitle} />
      <div className={`grid gap-6 ${cols}`}>
        {posts.map((post, i) => (
          <article key={i} className="overflow-hidden rounded-[var(--wb-radius)]" style={{ background: "var(--wb-card)", border: "1px solid var(--wb-border)" }}>
            {post.image && <ImagePlaceholder src={post.image.src} alt={post.title} ratio="aspect-video" className="!rounded-none" />}
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2 text-xs" style={{ color: "var(--wb-muted-fg)" }}>
                <span>{post.date}</span>
                {post.author && <><span>·</span><span>{post.author}</span></>}
              </div>
              <h3 className="mb-1 font-semibold" style={{ fontFamily: "var(--wb-font-heading)" }}>{post.title}</h3>
              <p className="text-sm" style={{ color: "var(--wb-muted-fg)" }}>{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
