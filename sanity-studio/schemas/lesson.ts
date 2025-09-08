import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: r => r.required() }),
    defineField({
      name: 'domain', title: 'Domain', type: 'string',
      options: {
        list: [
          { title: 'Domain I: Ophthalmic Optics', value: 'optics' },
          { title: 'Domain II: Ocular Anatomy, Physiology, Pathology, and Refraction', value: 'ocular-anatomy' },
          { title: 'Domain III: Ophthalmic Products', value: 'ophthalmic-products' },
          { title: 'Domain IV. Instrumentation', value: 'instrumentation' },
          { title: 'Domain V. Dispensing Procedures', value: 'dispensing-procedures' },
          { title: 'Domain VI. Laws, Regulations, and Standards', value: 'laws-regulations-and-standards' },
        ]
      },
      validation: r => r.required()
    }),
    defineField({ name: 'summary', type: 'text', rows: 3 }),
    defineField({ name: 'body', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
  ],
})
