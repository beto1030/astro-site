import { toHTML } from '@portabletext/to-html'

export function renderPortableText(blocks: any[]) {
  return toHTML(blocks ?? [], {
    components: {
      // Add the block key as the anchor id so /topics/<slug>#h-<key> works
      block: {
        h3: ({ children, value }: any) =>
          `<h3 id="h-${value?._key}" class="scroll-mt-24 text-xl font-semibold">${children}</h3>`,
        normal: ({ children }: any) => `<p>${children}</p>`,
      },
    }
  })
}

