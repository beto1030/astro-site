// schema/index.ts
import type { SchemaTypeDefinition } from 'sanity'
import page from './page'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    page,
    // add other document/object types here
  ],
}

