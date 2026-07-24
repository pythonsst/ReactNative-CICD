export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
}

/** Templates shipped in the app. Each maps to a renderer in ./html.ts. */
export const templates: TemplateMeta[] = [
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Classic maroon & gold framed design',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Airy, centered, minimal with gold rules',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column with a maroon sidebar',
  },
];

export const defaultTemplateId = templates[0].id;

export function getTemplate(id: string): TemplateMeta {
  return templates.find(t => t.id === id) ?? templates[0];
}
