import type { SectionOf, SiteDocument } from "@/lib/schema/page-schema";
import { HeadingBlock, SectionShell } from "./_shared";

const FIELD_LABELS: Record<string, string> = { name: "Name", email: "Email", phone: "Phone", message: "Message", subject: "Subject" };

export function Contact({ section }: { section: SectionOf<"contact">; document: SiteDocument }) {
  const { title, subtitle, email, phone, address, formFields, submitLabel } = section.props;

  return (
    <SectionShell section={section}>
      <div className={section.variant === "split" ? "grid gap-10 md:grid-cols-2" : "mx-auto max-w-xl"}>
        <div>
          <HeadingBlock title={title} subtitle={subtitle} />
          {(email || phone || address) && (
            <div className="mt-4 space-y-2 text-sm" style={{ color: "var(--wb-muted-fg)" }}>
              {email && <p>✉ {email}</p>}
              {phone && <p>☎ {phone}</p>}
              {address && <p>📍 {address}</p>}
            </div>
          )}
        </div>
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          {formFields.map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium">{FIELD_LABELS[field] ?? field}</label>
              {field === "message" ? (
                <textarea rows={4} placeholder={`Your ${field}…`} className="w-full rounded-[var(--wb-radius)] border px-3 py-2 text-sm" style={{ borderColor: "var(--wb-border)", background: "var(--wb-muted)" }} />
              ) : (
                <input type={field === "email" ? "email" : "text"} placeholder={FIELD_LABELS[field]} className="w-full rounded-[var(--wb-radius)] border px-3 py-2 text-sm" style={{ borderColor: "var(--wb-border)", background: "var(--wb-muted)" }} />
              )}
            </div>
          ))}
          <button type="submit" className="rounded-[var(--wb-radius)] px-5 py-2.5 text-sm font-medium" style={{ background: "var(--wb-primary)", color: "var(--wb-primary-fg)" }}>
            {submitLabel}
          </button>
        </form>
      </div>
    </SectionShell>
  );
}
