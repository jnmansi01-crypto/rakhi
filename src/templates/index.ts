// src/templates/index.ts
// Central registry of all available templates.
// Each template is lazy-loaded so only the relevant bundle is fetched.

import type { TemplatePlugin } from './types';

/** Map of templateId → dynamic importer */
const registry: Record<string, () => Promise<{ default: TemplatePlugin }>> = {
  // Template 01 — Raksha Bandhan 2025 (default)
  'rakhi-2025': () => import('./rakhi-2025/template.config'),

  // Template 02 — add here:
  // 'template-id': () => import('./template-id/template.config'),
};


/** Default template used for legacy records that have no templateId */
export const DEFAULT_TEMPLATE_ID = 'rakhi-2025';

/**
 * Load a template plugin by its ID.
 * Falls back to the default template if the ID is unknown.
 */
export async function getTemplate(id?: string | null): Promise<TemplatePlugin> {
  const key = (id && id in registry) ? id : DEFAULT_TEMPLATE_ID;
  const mod = await registry[key]();
  return mod.default;
}

/** Synchronous check — does this template ID exist in the registry? */
export function isValidTemplateId(id: string): boolean {
  return id in registry;
}

/** All registered template IDs */
export function allTemplateIds(): string[] {
  return Object.keys(registry);
}
