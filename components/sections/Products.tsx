import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Tag';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { products, productsCopy } from '@/lib/content';

/**
 * S6 — the two flagship products, in alternating full-width blocks.
 *
 * The video column comes first in the DOM on both rows; the reversal on the
 * second row is a grid-order change only, so reading order stays logical for
 * screen readers and keyboard users.
 */
export function Products() {
  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="defer-paint border-t border-line"
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <div className="shell">
        <header className="mb-14 max-w-3xl md:mb-20">
          <Eyebrow>{productsCopy.eyebrow}</Eyebrow>
          <h2 id="products-heading" className="mt-4">
            {productsCopy.heading}
          </h2>
        </header>

        <div className="flex flex-col gap-20 md:gap-28">
          {products.map((product, i) => (
            <article
              key={product.id}
              className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
            >
              <Reveal
                className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-2' : ''}`}
              >
                <VideoPlayer
                  title={product.title}
                  posterKind={product.poster}
                  sources={product.sources}
                />
              </Reveal>

              <Reveal
                index={1}
                className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <h3 className="text-[clamp(1.5rem,2.6vw,2rem)]">{product.title}</h3>
                <p className="mt-4 text-body">{product.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
