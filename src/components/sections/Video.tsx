import type { SectionOf, SiteDocument } from "@/lib/schema/page-schema";
import { HeadingBlock, SectionShell } from "./_shared";

function getEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

export function Video({ section }: { section: SectionOf<"video">; document: SiteDocument }) {
  const { title, subtitle, videoUrl } = section.props;

  return (
    <SectionShell section={section}>
      {(title || subtitle) && <HeadingBlock title={title ?? ""} subtitle={subtitle} />}
      <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-[var(--wb-radius)]" style={{ border: "1px solid var(--wb-border)" }}>
        <iframe src={getEmbedUrl(videoUrl)} className="absolute inset-0 h-full w-full" allowFullScreen allow="autoplay; encrypted-media" />
      </div>
    </SectionShell>
  );
}
