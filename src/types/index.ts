/** Public type surface — import app-wide types from "@/types". */
export type {
  SiteDocument,
  Page,
  Section,
  SectionType,
  SectionOf,
  Theme,
  Product,
  Link,
  ImageRef,
} from "@/lib/schema/page-schema";

export type { GenerationBrief } from "@/lib/ai/generator-prompt";
export type { GenerationEvent, GenStage } from "@/lib/ai/pipeline";
export type { EditorStatus } from "@/lib/store/useEditorStore";
export type { CartLine, CartTotals } from "@/lib/ecommerce/types";
