import { Button } from "@/components/ui";
import { insights } from "@/lib/content";

/* "Latest Articles": the three posts on the live homepage as siteassist-style cards (8px radius photo, small meta
   line, title, two-line summary). Each opens the post on cscscreeding.co.uk. */
export function Insights() {
  return (
    <section className="section band insights" id="insights" tabIndex={-1} aria-labelledby="insights-title" data-late>
      <div className="wrap">
        <div className="section-head section-head-row">
          <div>
            <h2 id="insights-title" className="h2" data-reveal="head">{insights.title}</h2>
            <p className="section-text" data-reveal="text">{insights.text}</p>
          </div>
          <div data-reveal="label"><Button href={insights.all.href} variant="line" icon="northeast">{insights.all.label}</Button></div>
        </div>
        <ul className="article-grid" data-reveal="cards">
          {insights.items.map((a) => (
            <li key={a.title}>
              <a className="article" href={a.href} target="_blank" rel="noopener">
                <span className="article-media"><img src={a.image} alt="" loading="lazy" /></span>
                <span className="article-meta">{a.date} · {a.read} · {a.category}</span>
                <span className="article-title">{a.title}</span>
                <span className="article-text">{a.text}</span>
                <span className="article-more">Read More<span className="sr-only">: {a.title}</span></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
