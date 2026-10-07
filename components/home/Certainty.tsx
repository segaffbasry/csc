import { certainty } from "@/lib/content";

/* siteassist's "What we do" statement (a 50px sentence over its own paragraph), carrying CSC's own argument. Under
   it, the fleet and team from above at the Slough yard, then the three reasons and the four live counters with
   the "Proven Performance" notes. */
export function Certainty() {
  return (
    <section className="section certainty" id="certainty" tabIndex={-1} aria-labelledby="certainty-title">
      <div className="wrap">
        <div className="statement">
          <h2 id="certainty-title" className="h2" data-reveal="head">{certainty.title}</h2>
          <p className="lead" data-reveal="text">{certainty.text}</p>
        </div>

        <div className="certainty-grid">
          <figure className="frame certainty-photo" data-reveal="image">
            <img src={certainty.image.src} alt={certainty.image.alt} loading="lazy" data-parallax />
          </figure>
          <ul className="points" data-reveal="cards">
            {certainty.points.map((p) => (
              <li key={p.title} className="point">
                <h3 className="h3">{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="stats">
          <p className="stats-lead" data-reveal="label">{certainty.statsLead}</p>
          <ul className="stats-list" data-reveal="cards">
            {certainty.stats.map((s) => (
              <li key={s.label} className="stat">
                <p className="stat-value">
                  {s.word ? s.word : <><span data-count={s.value}>{s.value.toLocaleString("en-GB")}</span>{s.unit}{s.suffix}</>}
                </p>
                <p className="stat-label">{s.label}</p>
                <p className="stat-note">{s.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
