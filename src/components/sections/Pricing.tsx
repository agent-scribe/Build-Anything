import type { SectionOf } from "@/lib/schema/page-schema";
import { Icon, HeadingBlock, SectionShell, SiteButton } from "./_shared";

export function Pricing({ section }: { section: SectionOf<"pricing"> }) {
  const { title, subtitle, plans } = section.props;
  const cols = Math.min(plans.length, 3);
  return (
    <SectionShell section={section}>
      <HeadingBlock title={title} subtitle={subtitle} />
      <div
        className="mx-auto grid max-w-5xl gap-6"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {plans.map((plan, i) => (
          <div
            key={i}
            className="flex flex-col rounded-[var(--wb-radius)] p-6"
            style={{
              background: "var(--wb-card)",
              border: plan.highlighted
                ? "2px solid var(--wb-primary)"
                : "1px solid var(--wb-border)",
            }}
          >
            <h3 className="text-lg font-medium" style={{ fontFamily: "var(--wb-font-heading)" }}>
              {plan.name}
            </h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-semibold">{plan.price}</span>
              {plan.period ? (
                <span style={{ color: "var(--wb-muted-fg)" }}>{plan.period}</span>
              ) : null}
            </div>
            {plan.description ? (
              <p className="mt-2 text-sm" style={{ color: "var(--wb-muted-fg)" }}>
                {plan.description}
              </p>
            ) : null}
            <ul className="my-6 space-y-2.5 text-sm">
              {plan.features.map((feature, fi) => (
                <li key={fi} className="flex items-start gap-2">
                  <Icon
                    name="check"
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: "var(--wb-primary)" }}
                  />
                  <span style={{ color: "var(--wb-muted-fg)" }}>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <SiteButton link={plan.cta} className="w-full" />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
