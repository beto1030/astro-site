import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schema } from './schema'

export default defineConfig({
  name: 'default',
  title: 'ABO Study Studio',
  projectId: 'ahqeb3rb',
  dataset: 'production',  // or 'abo'
  plugins: [
      deskTool(),
      visionTool(),
  ],
  schema,
})
