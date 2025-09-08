// src/lib/portableText.ts
import { toHTML } from '@portabletext/to-html'

export function portableToHtml(blocks: any[]) {
  return toHTML(blocks ?? [], {
    components: {
      // Add ids on headings so deep links work: /page#h-<key>
      block: {
        h3: ({ children, value }: any) =>
          `<h3 id="h-${value?._key}" class="scroll-mt-24 text-xl font-semibold">${children}</h3>`,
        // (optional) other styles if you want
        h2: ({ children }: any) => `<h2 class="text-2xl font-bold">${children}</h2>`,
        normal: ({ children }: any) => `<p>${children}</p>`,
      },
      // You can add list, marks, images, etc. later as needed.
    },
  })
}

