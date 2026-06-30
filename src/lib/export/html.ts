/**
 * html.ts — deterministic SiteDocument → standalone HTML serializer.
 * ------------------------------------------------------------------
 * No framework, no runtime. Walks the validated document and emits a
 * single self-contained .html string (theme tokens as CSS variables +
 * semantic markup per section). This is the "clean HTML/CSS" export.
 */
import type { Product, Section, SiteDocument, Theme } from "@/lib/schema/page-schema";

const RADIUS: Record<Theme["radius"], string> = {
  none: "0px",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  full: "9999px",
};
const PAD: Record<NonNullable<Section["paddingY"]>, string> = {
  none: "0",
  sm: "2rem",
  md: "3.5rem",
  lg: "5.5rem",
  xl: "8rem",
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Resolve a section's background token to concrete fg/bg colors. */
function surface(bg: Section["background"], t: Theme): { bg: string; fg: string } {
  switch (bg) {
    case "muted":
      return { bg: t.colors.muted, fg: t.colors.foreground };
    case "card":
      return { bg: t.colors.card, fg: t.colors.cardForeground };
    case "primary":
      return { bg: t.colors.primary, fg: t.colors.primaryForeground };
    case "inverted":
      return { bg: t.colors.foreground, fg: t.colors.background };
    default:
      return { bg: t.colors.background, fg: t.colors.foreground };
  }
}

function imagePlaceholder(alt: string, t: Theme): string {
  // We never invent URLs; export ships a styled placeholder carrying the alt text.
  return `<div class="wb-img" role="img" aria-label="${esc(alt)}"><span>${esc(alt)}</span></div>`;
}

function button(label: string, href: string, kind: string, t: Theme): string {
  const styles =
    kind === "primary"
      ? `background:${t.colors.primary};color:${t.colors.primaryForeground};`
      : kind === "secondary"
        ? `background:${t.colors.secondary};color:${t.colors.foreground};`
        : kind === "ghost"
          ? `background:transparent;color:inherit;border:1px solid ${t.colors.border};`
          : `background:transparent;color:${t.colors.primary};padding:0;`;
  return `<a class="wb-btn" href="${esc(href)}" style="${styles}">${esc(label)}</a>`;
}

/* ------------------------------------------------------------------ */
/* Section renderers                                                   */
/* ------------------------------------------------------------------ */

function renderSection(section: Section, doc: SiteDocument): string {
  if (section.visible === false) return "";
  const t = doc.theme;
  const { bg, fg } = surface(section.background, t);
  const pad = PAD[section.paddingY ?? "lg"];
  const inner = renderBody(section, doc);
  return `<section id="${esc(section.id)}" style="background:${bg};color:${fg};padding:${pad} 1.5rem;"><div class="wb-container">${inner}</div></section>`;
}

function renderBody(section: Section, doc: SiteDocument): string {
  const t = doc.theme;
  switch (section.type) {
    case "navbar": {
      const p = section.props;
      const links = p.links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join("");
      const cta = p.cta ? button(p.cta.label, p.cta.href, p.cta.variant, t) : "";
      return `<nav class="wb-nav"><span class="wb-logo">${esc(p.logo)}</span><div class="wb-nav-links">${links}</div>${cta}</nav>`;
    }
    case "hero": {
      const p = section.props;
      const eyebrow = p.eyebrow ? `<p class="wb-eyebrow">${esc(p.eyebrow)}</p>` : "";
      const ctas = `${button(p.primaryCta.label, p.primaryCta.href, p.primaryCta.variant, t)}${
        p.secondaryCta ? button(p.secondaryCta.label, p.secondaryCta.href, p.secondaryCta.variant, t) : ""
      }`;
      const media = p.image ? imagePlaceholderSafe(p.image.alt, t) : "";
      return `<div class="wb-hero ${section.variant}">${eyebrow}<h1>${esc(p.headline)}</h1><p class="wb-lead">${esc(
        p.subheadline
      )}</p><div class="wb-cta-row">${ctas}</div>${media}</div>`;
    }
    case "features": {
      const p = section.props;
      const items = p.items
        .map(
          (f) =>
            `<div class="wb-card"><div class="wb-ico">◆</div><h3>${esc(f.title)}</h3><p>${esc(
              f.description
            )}</p></div>`
        )
        .join("");
      return `${heading(p.title, p.subtitle)}<div class="wb-grid" style="--cols:${p.columns ?? 3}">${items}</div>`;
    }
    case "products": {
      const p = section.props;
      const ids = p.productIds.length ? p.productIds : doc.products.map((x) => x.id);
      const cards = ids
        .map((id) => doc.products.find((x) => x.id === id))
        .filter((x): x is Product => Boolean(x))
        .map(
          (prod) =>
            `<div class="wb-product">${imagePlaceholderSafe(prod.image.alt, t)}<div class="wb-product-body"><h3>${esc(
              prod.name
            )}</h3><p>${esc(prod.description)}</p><div class="wb-price"><strong>${money(prod.price, prod.currency)}</strong>${
              prod.compareAtPrice ? `<s>${money(prod.compareAtPrice, prod.currency)}</s>` : ""
            }</div></div></div>`
        )
        .join("");
      return `${heading(p.title, p.subtitle)}<div class="wb-grid" style="--cols:${p.columns ?? 3}">${cards}</div>`;
    }
    case "pricing": {
      const p = section.props;
      const cards = p.plans
        .map(
          (plan) =>
            `<div class="wb-card${plan.highlighted ? " wb-highlight" : ""}"><h3>${esc(plan.name)}</h3><div class="wb-plan-price"><strong>${esc(
              plan.price
            )}</strong>${plan.period ? `<span>${esc(plan.period)}</span>` : ""}</div>${
              plan.description ? `<p>${esc(plan.description)}</p>` : ""
            }<ul>${plan.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>${button(
              plan.cta.label,
              plan.cta.href,
              plan.cta.variant,
              t
            )}</div>`
        )
        .join("");
      return `${heading(p.title, p.subtitle)}<div class="wb-grid" style="--cols:${Math.min(p.plans.length, 3)}">${cards}</div>`;
    }
    case "testimonials": {
      const p = section.props;
      const items = p.items
        .map(
          (q) =>
            `<figure class="wb-card"><blockquote>${esc(q.quote)}</blockquote><figcaption>${esc(
              q.author
            )}${q.role ? ` · ${esc(q.role)}` : ""}</figcaption></figure>`
        )
        .join("");
      return `${heading(p.title, p.subtitle)}<div class="wb-grid" style="--cols:${Math.min(p.items.length, 3)}">${items}</div>`;
    }
    case "faq": {
      const p = section.props;
      const items = p.items
        .map(
          (q) =>
            `<details class="wb-faq"><summary>${esc(q.question)}</summary><p>${esc(q.answer)}</p></details>`
        )
        .join("");
      return `${heading(p.title, p.subtitle)}<div class="wb-faq-list">${items}</div>`;
    }
    case "cta": {
      const p = section.props;
      return `<div class="wb-hero centered"><h2>${esc(p.headline)}</h2>${
        p.subheadline ? `<p class="wb-lead">${esc(p.subheadline)}</p>` : ""
      }<div class="wb-cta-row">${button(p.primaryCta.label, p.primaryCta.href, p.primaryCta.variant, t)}${
        p.secondaryCta ? button(p.secondaryCta.label, p.secondaryCta.href, p.secondaryCta.variant, t) : ""
      }</div></div>`;
    }
    case "newsletter": {
      const p = section.props;
      return `<div class="wb-news"><h2>${esc(p.headline)}</h2>${
        p.subheadline ? `<p class="wb-lead">${esc(p.subheadline)}</p>` : ""
      }<form class="wb-news-form" onsubmit="return false"><input type="email" placeholder="${esc(
        p.placeholder ?? "you@example.com"
      )}"/><button type="submit">${esc(p.buttonLabel ?? "Subscribe")}</button></form>${
        p.disclaimer ? `<small>${esc(p.disclaimer)}</small>` : ""
      }</div>`;
    }
    case "logos": {
      const p = section.props;
      const logos = p.logos.map((l) => `<span class="wb-logo-item">${esc(l.name)}</span>`).join("");
      return `${p.title ? `<p class="wb-logos-title">${esc(p.title)}</p>` : ""}<div class="wb-logos">${logos}</div>`;
    }
    case "stats": {
      const p = section.props;
      const items = p.items
        .map((s) => `<div class="wb-stat"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`)
        .join("");
      return `${p.title ? heading(p.title) : ""}<div class="wb-grid" style="--cols:${p.items.length}">${items}</div>`;
    }
    case "gallery": {
      const p = section.props;
      const items = p.items.map((item: any) =>
        `<div class="wb-gallery-item">${imagePlaceholderSafe(item.image.alt, t)}${item.caption ? `<p>${esc(item.caption)}</p>` : ""}</div>`
      ).join("");
      return `${heading(p.title, p.subtitle)}<div class="wb-grid wb-cols-${p.columns ?? 3}">${items}</div>`;
    }
    case "team": {
      const p = section.props;
      const members = p.members.map((m: any) =>
        `<div class="wb-card" style="text-align:center"><div style="font-size:3rem;margin-bottom:0.5rem">👤</div><h3>${esc(m.name)}</h3><p style="color:var(--accent);font-size:.9rem">${esc(m.role)}</p>${m.bio ? `<p style="color:var(--muted-fg);font-size:.85rem">${esc(m.bio)}</p>` : ""}</div>`
      ).join("");
      return `${heading(p.title, p.subtitle)}<div class="wb-grid wb-cols-${p.columns ?? 3}">${members}</div>`;
    }
    case "blog": {
      const p = section.props;
      const posts = p.posts.map((post: any) =>
        `<div class="wb-card"><h3>${esc(post.title)}</h3><p style="font-size:.8rem;color:var(--muted-fg)">${esc(post.date)}${post.author ? ` · ${esc(post.author)}` : ""}</p><p>${esc(post.excerpt)}</p></div>`
      ).join("");
      return `${heading(p.title, p.subtitle)}<div class="wb-grid wb-cols-${p.columns ?? 3}">${posts}</div>`;
    }
    case "contact": {
      const p = section.props;
      const info = [p.email && `📧 ${esc(p.email)}`, p.phone && `📞 ${esc(p.phone)}`, p.address && `📍 ${esc(p.address)}`].filter(Boolean).map(i => `<p>${i}</p>`).join("");
      const fields = (p.formFields ?? ["name","email","message"]).map((f: string) =>
        f === "message" ? `<textarea placeholder="${esc(f)}" rows="4" style="width:100%;padding:.75rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--card);color:var(--fg)"></textarea>` :
        `<input type="${f === "email" ? "email" : "text"}" placeholder="${esc(f)}" style="width:100%;padding:.75rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--card);color:var(--fg)" />`
      ).join("");
      return `${heading(p.title, p.subtitle)}<div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem"><div>${info}</div><form style="display:flex;flex-direction:column;gap:1rem">${fields}<button class="wb-btn-primary">${esc(p.submitLabel ?? "Send")}</button></form></div>`;
    }
    case "comparison": {
      const p = section.props;
      const headerRow = `<tr><th></th>${p.plans.map((pl: any) => `<th${pl.highlighted ? ' style="color:var(--accent)"' : ""}>${esc(pl.name)}</th>`).join("")}</tr>`;
      const rows = p.features.map((f: any) =>
        `<tr><td>${esc(f.name)}</td>${f.values.map((v: any) => `<td>${typeof v === "boolean" ? (v ? "✓" : "—") : esc(String(v))}</td>`).join("")}</tr>`
      ).join("");
      return `${heading(p.title, p.subtitle)}<table style="width:100%;border-collapse:collapse;text-align:center" class="wb-table">${headerRow}${rows}</table>`;
    }
    case "timeline": {
      const p = section.props;
      const items = p.items.map((item: any) =>
        `<div style="display:flex;gap:1.5rem;padding-bottom:2rem"><div style="display:flex;flex-direction:column;align-items:center"><div style="width:12px;height:12px;border-radius:50%;background:var(--accent)"></div><div style="width:2px;flex:1;background:var(--border)"></div></div><div><p style="color:var(--accent);font-weight:600;font-size:.85rem">${esc(item.date)}</p><h3>${esc(item.title)}</h3><p style="color:var(--muted-fg)">${esc(item.description)}</p></div></div>`
      ).join("");
      return `${heading(p.title, p.subtitle)}<div style="max-width:600px;margin:0 auto">${items}</div>`;
    }
    case "video": {
      const p = section.props;
      let embedUrl = p.videoUrl;
      const ytMatch = p.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
      const vmMatch = p.videoUrl.match(/vimeo\.com\/(\d+)/);
      if (vmMatch) embedUrl = `https://player.vimeo.com/video/${vmMatch[1]}`;
      return `${p.title ? heading(p.title, p.subtitle) : ""}<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:var(--radius)"><iframe src="${esc(embedUrl)}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen></iframe></div>`;
    }
    case "banner": {
      const p = section.props;
      const colors: Record<string, string> = { info: "#3b82f6", success: "#22c55e", warning: "#eab308", promo: "var(--accent)" };
      const color = colors[p.style ?? "promo"] ?? "var(--accent)";
      return `<div style="display:flex;align-items:center;justify-content:center;gap:1rem;padding:1rem 2rem;background:${color};color:#fff;border-radius:var(--radius);font-weight:500"><span>${esc(p.text)}</span>${p.cta ? `<a href="${esc(p.cta.href)}" class="wb-btn-secondary" style="color:#fff;border-color:#fff">${esc(p.cta.label)}</a>` : ""}</div>`;
    }
    case "portfolio": {
      const p = section.props;
      const projects = p.projects.map((proj: any) =>
        `<div class="wb-card"><h3>${esc(proj.title)}</h3>${proj.category ? `<p style="color:var(--accent);font-size:.8rem;text-transform:uppercase">${esc(proj.category)}</p>` : ""}${proj.description ? `<p style="color:var(--muted-fg)">${esc(proj.description)}</p>` : ""}</div>`
      ).join("");
      return `${heading(p.title, p.subtitle)}<div class="wb-grid wb-cols-${p.columns ?? 3}">${projects}</div>`;
    }
    case "metrics": {
      const p = section.props;
      const items = p.items.map((item: any) => {
        const trend = item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "";
        const trendColor = item.trend === "up" ? "#22c55e" : item.trend === "down" ? "#ef4444" : "var(--muted-fg)";
        return `<div class="wb-stat"><span class="wb-stat-val">${item.prefix ?? ""}${esc(item.value)}${item.suffix ?? ""}</span><span class="wb-stat-label">${esc(item.label)} ${trend ? `<span style="color:${trendColor}">${trend}</span>` : ""}</span></div>`;
      }).join("");
      return `${p.title ? heading(p.title, p.subtitle) : ""}<div class="wb-stats">${items}</div>`;
    }
    case "footer": {
      const p = section.props;
      const cols = p.columns
        .map(
          (c) =>
            `<div><h4>${esc(c.heading)}</h4><ul>${c.links
              .map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)
              .join("")}</ul></div>`
        )
        .join("");
      return `<div class="wb-footer"><div class="wb-footer-brand"><span class="wb-logo">${esc(
        p.logo
      )}</span>${p.tagline ? `<p>${esc(p.tagline)}</p>` : ""}</div><div class="wb-footer-cols">${cols}</div></div><p class="wb-copy">${esc(
        p.copyright
      )}</p>`;
    }
  }
}

function imagePlaceholderSafe(alt: string, t: Theme): string {
  return imagePlaceholder(alt, t);
}

function heading(title: string, subtitle?: string): string {
  return `<div class="wb-head"><h2>${esc(title)}</h2>${subtitle ? `<p class="wb-lead">${esc(subtitle)}</p>` : ""}</div>`;
}

function money(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

/* ------------------------------------------------------------------ */
/* Document shell                                                      */
/* ------------------------------------------------------------------ */

export function renderSiteToHtml(doc: SiteDocument): string {
  const t = doc.theme;
  const page = doc.pages[0];
  const sections = page.sections.map((s) => renderSection(s, doc)).join("\n");
  const fonts = encodeURIComponent(`${t.fonts.heading}:wght@400;500;600;700`);
  const bodyFont = encodeURIComponent(`${t.fonts.body}:wght@400;500;600`);

  return `<!doctype html>
<html lang="en" data-mode="${t.mode}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(page.seo?.title ?? doc.meta.name)}</title>
<meta name="description" content="${esc(page.seo?.description ?? doc.meta.description)}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=${fonts}&family=${bodyFont}&display=swap" rel="stylesheet"/>
<style>
:root{
  --bg:${t.colors.background};--fg:${t.colors.foreground};--primary:${t.colors.primary};
  --primary-fg:${t.colors.primaryForeground};--secondary:${t.colors.secondary};--accent:${t.colors.accent};
  --muted:${t.colors.muted};--muted-fg:${t.colors.mutedForeground};--border:${t.colors.border};
  --card:${t.colors.card};--card-fg:${t.colors.cardForeground};--radius:${RADIUS[t.radius]};
  --font-heading:'${t.fonts.heading}',system-ui,sans-serif;--font-body:'${t.fonts.body}',system-ui,sans-serif;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--font-body);line-height:1.6;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:var(--font-heading);font-weight:600;line-height:1.15;letter-spacing:-0.02em;margin:0 0 .5rem}
h1{font-size:clamp(2.2rem,5vw,3.6rem)}h2{font-size:clamp(1.6rem,3vw,2.4rem)}p{margin:0 0 1rem}
a{color:inherit;text-decoration:none}
.wb-container{max-width:1140px;margin:0 auto}
.wb-btn{display:inline-flex;align-items:center;justify-content:center;padding:.7rem 1.3rem;border-radius:var(--radius);font-weight:500;margin:.25rem .5rem .25rem 0;transition:opacity .2s}
.wb-btn:hover{opacity:.88}
.wb-nav{display:flex;align-items:center;justify-content:space-between;gap:1rem}
.wb-nav-links{display:flex;gap:1.5rem;margin-left:auto;margin-right:1rem;color:var(--muted-fg)}
.wb-logo{font-family:var(--font-heading);font-weight:600;font-size:1.15rem}
.wb-eyebrow{display:inline-block;color:var(--accent);font-weight:500;font-size:.85rem;letter-spacing:.04em;text-transform:uppercase;margin-bottom:1rem}
.wb-hero{max-width:760px}.wb-hero.centered,.wb-hero .wb-cta-row{text-align:center}
.wb-hero.centered{margin:0 auto;text-align:center}
.wb-lead{color:var(--muted-fg);font-size:1.15rem;max-width:60ch}
.wb-hero.centered .wb-lead{margin-left:auto;margin-right:auto}
.wb-cta-row{margin-top:1.5rem}
.wb-head{text-align:center;max-width:60ch;margin:0 auto 3rem}
.wb-grid{display:grid;grid-template-columns:repeat(var(--cols,3),1fr);gap:1.25rem}
@media(max-width:820px){.wb-grid{grid-template-columns:1fr 1fr}.wb-nav-links{display:none}}
@media(max-width:520px){.wb-grid{grid-template-columns:1fr}}
.wb-card{background:var(--card);color:var(--card-fg);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem}
.wb-card h3{margin-top:.5rem}
.wb-highlight{outline:2px solid var(--primary);outline-offset:-2px}
.wb-ico{width:40px;height:40px;border-radius:var(--radius);background:var(--muted);display:flex;align-items:center;justify-content:center;color:var(--primary)}
.wb-img{aspect-ratio:4/3;background:var(--muted);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;margin-top:2rem;color:var(--muted-fg);font-size:.85rem}
.wb-product{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.wb-product .wb-img{margin:0;aspect-ratio:1/1;border-radius:0}
.wb-product-body{padding:1rem 1.1rem}.wb-product-body h3{font-size:1.05rem}
.wb-price{display:flex;gap:.6rem;align-items:baseline}.wb-price s{color:var(--muted-fg)}
.wb-plan-price{display:flex;align-items:baseline;gap:.3rem;margin:.5rem 0}.wb-plan-price strong{font-size:2rem}
.wb-card ul{list-style:none;padding:0;margin:1rem 0;color:var(--muted-fg)}.wb-card li{padding:.3rem 0}
.wb-card li::before{content:"✓";color:var(--primary);margin-right:.5rem}
.wb-faq-list{max-width:760px;margin:0 auto}
.wb-faq{border-bottom:1px solid var(--border);padding:1rem 0}.wb-faq summary{cursor:pointer;font-weight:500}
.wb-news{text-align:center;max-width:620px;margin:0 auto}
.wb-news-form{display:flex;gap:.5rem;justify-content:center;margin-top:1.25rem;flex-wrap:wrap}
.wb-news-form input{padding:.7rem 1rem;border-radius:var(--radius);border:1px solid var(--border);min-width:260px;background:var(--bg);color:var(--fg)}
.wb-news-form button{padding:.7rem 1.3rem;border-radius:var(--radius);border:none;background:var(--primary);color:var(--primary-fg);font-weight:500;cursor:pointer}
.wb-logos{display:flex;flex-wrap:wrap;gap:2.5rem;justify-content:center;align-items:center;opacity:.7}
.wb-logo-item{font-family:var(--font-heading);font-weight:600;font-size:1.25rem}
.wb-logos-title{text-align:center;color:var(--muted-fg);margin-bottom:1.5rem}
.wb-stat{text-align:center}.wb-stat strong{display:block;font-family:var(--font-heading);font-size:2.4rem}
.wb-stat span{color:var(--muted-fg)}
.wb-footer{display:flex;flex-wrap:wrap;gap:3rem;justify-content:space-between}
.wb-footer-cols{display:flex;gap:3rem;flex-wrap:wrap}.wb-footer h4{margin-bottom:.75rem}
.wb-footer ul{list-style:none;padding:0;margin:0;color:var(--muted-fg)}.wb-footer li{padding:.25rem 0}
.wb-copy{margin-top:2.5rem;color:var(--muted-fg);font-size:.85rem}
</style>
</head>
<body>
${sections}
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* Multi-page export — one HTML file per page                          */
/* ------------------------------------------------------------------ */

/** Render all pages to a map of { filename: htmlContent }. */
export function renderMultiPageHtml(doc: SiteDocument): Record<string, string> {
  const files: Record<string, string> = {};
  for (const page of doc.pages) {
    const singlePageDoc: SiteDocument = { ...doc, pages: [page] };
    const html = renderSiteToHtml(singlePageDoc);
    const filename = page.path === "/" ? "index.html" : `${page.path.replace(/^\//, "").replace(/\//g, "-")}.html`;
    files[filename] = html;
  }
  return files;
}
