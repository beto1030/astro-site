import { type SchemaTypeDefinition } from 'sanity'
import lesson from './schemas/lesson'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [lesson],
}
