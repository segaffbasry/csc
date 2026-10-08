import { Button } from "@/components/ui";
import { projects } from "@/lib/content";

/* THE COPIED INTERACTION: siteassist.com's "Solutions" list hover (home page, .solutions-item). Rebuilt from its
   stylesheet and inline <style>:
     .solutions-link        border-bottom 1px neutral-900, padding 1.75em 0 1.5em; :hover border-bottom-color violet
     .solutions-item:hover  color violet (here Royal), z-index 2
     .solutions-row         grid 3em 1fr, gap 1em, items centred
     .solutions-heading     Geist Mono, uppercase (set here in Inter 600, sentence case: client feedback, 8 Oct)
     .solutions-img         12em wide, aspect-ratio 2 / 2.5, radius .25em, absolute at inset calc(50% - 7em) 0 auto
                            auto, transform scale(0), transition transform 0s cubic-bezier(.625,.05,0,1),
                            pointer-events none
     @media (min-width: 992px) .solutions-item:hover .solutions-img { transform: scale(1); transition-duration: 600ms }
   So the photo grows out of nothing over 600ms on the way in and vanishes instantly on the way out. The element
   order is theirs too: the <img> sits before the link inside each item. The easing is --ease-preview and the
   duration --preview-in in globals.css. Their first column is an index number; CSC's rows show the sector there
   instead (house rule: no index numbers). Under 992px, as on siteassist, there is no preview; a thumbnail shows
   in the row instead so the photography is still there on touch screens. */
export function Projects() {
  return (
    <section className="section projects" id="projects" tabIndex={-1} aria-labelledby="projects-title">
      <div className="wrap projects-grid">
        <div className="projects-intro">
          <h2 id="projects-title" className="h2" data-reveal="head">{projects.title}</h2>
          <p className="section-text" data-reveal="text">{projects.text}</p>
          <div data-reveal="label"><Button href={projects.all.href} icon="arrow">{projects.all.label}</Button></div>
        </div>
        <ul className="pj-list" data-reveal="cards">
          {projects.items.map((p) => (
            <li key={p.title} className="pj-item">
              <img className="pj-img" src={p.image} alt="" loading="lazy" />
              <a className="pj-link" href={p.href} target="_blank" rel="noopener">
                <span className="pj-row">
                  <span className="pj-sector">{p.sector}</span>
                  <span className="pj-col">
                    <span className="pj-thumb" aria-hidden="true"><img src={p.image} alt="" loading="lazy" /></span>
                    <span className="pj-title">{p.title}</span>
                    <span className="pj-meta">{p.category} · {p.tags.join(" · ")}</span>
                    <span className="pj-text">{p.text}</span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
