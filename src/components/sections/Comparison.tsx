import type { SectionOf, SiteDocument } from "@/lib/schema/page-schema";
import { HeadingBlock, SectionShell } from "./_shared";

export function Comparison({ section }: { section: SectionOf<"comparison">; document: SiteDocument }) {
  const { title, subtitle, plans, features } = section.props;

  return (
    <SectionShell section={section}>
      <HeadingBlock title={title} subtitle={subtitle} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left font-medium" style={{ color: "var(--wb-muted-fg)" }}>Feature</th>
              {plans.map((plan, i) => (
                <th key={i} className="px-4 py-3 text-center font-semibold" style={plan.highlighted ? { color: "var(--wb-primary)" } : {}}>
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feat, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--wb-border)" }}>
                <td className="px-4 py-3">{feat.name}</td>
                {feat.values.map((val, j) => (
                  <td key={j} className="px-4 py-3 text-center">
                    {typeof val === "boolean" ? (val ? "✓" : "—") : val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}
