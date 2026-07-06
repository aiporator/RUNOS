import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import Reveal from '@/components/marketing/reveal';
import { arr, btnVolt, label } from '@/components/marketing/styles';
import { ARTICLES, getArticle, otherArticles, type ArticleBlock } from '@/lib/articles';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} — RunOS`,
    description: article.dek,
  };
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00.000Z`);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="mb-4 mt-11 font-display text-[24px] font-semibold leading-tight tracking-[-0.01em]">
          {block.text}
        </h2>
      );
    case 'quote':
      return (
        <blockquote className="my-8 border-l-[3px] border-volt py-1 pl-6 font-display text-[19px] font-medium leading-snug tracking-[-0.01em] text-paper/90">
          {block.text}
        </blockquote>
      );
    case 'list':
      return (
        <ul className="my-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[15.5px] leading-relaxed text-muted">
              <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-volt" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'p':
    default:
      return <p className="mb-5 text-[15.5px] leading-relaxed text-muted">{block.text}</p>;
  }
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = otherArticles(slug);

  return (
    <main className="overflow-x-clip bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />

      <article className="pb-[100px] pt-[160px]">
        <div className="mx-auto max-w-[720px] px-6">
          <Link
            href="/articles"
            className="mb-8 inline-flex items-center gap-2 text-[13px] font-semibold text-muted-2 transition-colors hover:text-volt"
          >
            ← All articles
          </Link>

          <span className={`${label} text-volt`}>{article.category}</span>
          <h1 className="mb-5 font-display text-[clamp(28px,4.5vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em]">
            {article.title}
          </h1>
          <p className="mb-6 max-w-[62ch] text-[16.5px] leading-relaxed text-muted">{article.dek}</p>
          <div className="mb-11 flex items-center gap-2 border-b border-line pb-6 text-[13px] text-muted-2">
            <span>The RunOS team</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readMinutes} min read</span>
          </div>

          <div>
            {article.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          <Reveal className="mt-12 rounded-card border border-volt/25 bg-volt/8 p-7 text-center">
            <Link href={article.cta.href} className={`group ${btnVolt}`}>
              {article.cta.label} <span className={arr}>→</span>
            </Link>
          </Reveal>

          {related.length > 0 && (
            <div className="mt-16 border-t border-line pt-10">
              <h3 className={`${label} text-muted-2`}>Keep reading</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/articles/${r.slug}`}
                    className="group block rounded-card border border-line bg-bg-2 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-volt/40"
                  >
                    <div className="font-display text-[15px] font-semibold leading-snug transition-colors group-hover:text-volt">
                      {r.title}
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">{r.dek}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <MarketingFooter anchorPrefix="/" />
    </main>
  );
}
