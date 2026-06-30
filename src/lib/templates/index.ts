export type { TemplateCategory, TemplateMeta, Template } from "./types";
export { CATEGORY_LABELS, CATEGORY_ICONS } from "./types";
export { STYLE_PRESETS } from "./styles";
export { buildTemplate } from "./factory";
export type { TemplateConfig, SectionConfig, ProductConfig } from "./factory";
export { CATALOG } from "./catalog";
export type { CatalogEntry } from "./catalog";
export {
  getTemplateCount,
  getTemplateMetas,
  getTemplate,
  getTemplatesByCategory,
  getTemplatesByType,
  searchTemplates,
  getCategoryCounts,
  getTemplatePage,
} from "./registry";
