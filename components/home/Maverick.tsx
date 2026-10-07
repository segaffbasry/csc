"use client";

import { useRef, useState } from "react";
import { Button, Icon } from "@/components/ui";
import { maverick } from "@/lib/content";

/* The Maverick in three moves:
   1. its own film (CSC's "Meet the Maverick Screed Truck", self-hosted) behind a poster of Spencer and the team,
      with the three access answers beside it. The film only loads and plays, with sound, when asked.
   2. the Lidl fit-out from the live Maverick page as a signature figure: the two methods drawn as week bars on one
      scale, so 3 weeks against 1 reads at a glance, with the 66% and Zero results.
   3. "Precision Technical Operations": the batching controls photograph and its three points. */
function Film() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => { video.current?.play().catch(() => {}); video.current?.focus(); });
  };
  return (
    <figure className="film frame" id="maverick-film" data-reveal="image">
      {playing ? (
        <video ref={video} src={maverick.film.src} poster={maverick.film.poster} controls playsInline preload="auto" aria-label={maverick.film.title} />
      ) : (
        <button className="film-poster" onClick={play} aria-label={`Play film: ${maverick.film.title}`}>
          <img src={maverick.film.poster} alt={maverick.film.alt} loading="lazy" data-parallax />
          <span className="film-play"><Icon name="play" /></span>
          <span className="film-cap">
            <span className="film-title">{maverick.film.title}</span>
            <span className="film-meta">{maverick.film.meta}</span>
          </span>
        </button>
      )}
    </figure>
  );
}

function CaseStudy() {
  const c = maverick.caseStudy;
  const max = Math.max(...c.rows.map((r) => r.weeks));
  return (
    <article className="case" aria-labelledby="case-title" data-reveal="label">
      <h3 id="case-title" className="case-title">{c.title}</h3>
      <p className="case-sub">{c.sub}</p>
      <p className="case-place">{c.place}</p>
      <ul className="case-rows">
        {c.rows.map((r) => (
          <li key={r.label} className="case-row">
            <div className="case-row-head">
              <span>{r.label}</span>
              <span className="case-weeks">{r.weeks} {r.weeks === 1 ? "Week" : "Weeks"}</span>
            </div>
            <span className="case-track" aria-hidden="true"><span className="case-bar" style={{ ["--w" as string]: `${(r.weeks / max) * 100}%` }} /></span>
            <p className="case-items">{r.items.join(" · ")}</p>
          </li>
        ))}
      </ul>
      <dl className="case-results">
        {c.results.map((r) => <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>)}
      </dl>
      <p className="case-challenge"><strong>The Challenge.</strong> {c.challenge}</p>
    </article>
  );
}

export function Maverick() {
  const ops = maverick.operations;
  return (
    <section className="section maverick" id="maverick" tabIndex={-1} aria-labelledby="maverick-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="maverick-title" className="h2" data-reveal="head">{maverick.title}</h2>
          <div>
            <p className="section-text" data-reveal="text">{maverick.text}</p>
            <ul className="tags" data-reveal="label">{maverick.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>

        <div className="maverick-grid">
          <Film />
          <div className="maverick-points">
            <h3 className="h3 maverick-points-title" data-reveal="label">{maverick.pointsTitle}</h3>
            <ul className="points points-tight" data-reveal="cards">
              {maverick.points.map((p) => <li key={p.title} className="point"><h4>{p.title}</h4><p>{p.text}</p></li>)}
            </ul>
            <div data-reveal="label"><Button href={maverick.spec.href} variant="line" icon="northeast">{maverick.spec.label}</Button></div>
          </div>
        </div>

        <div className="ops-grid">
          <CaseStudy />
          <div className="ops">
            <figure className="frame ops-photo" data-reveal="image"><img src={ops.image.src} alt={ops.image.alt} loading="lazy" data-parallax /></figure>
            <h3 className="h3" data-reveal="head">{ops.title}</h3>
            <p className="ops-text" data-reveal="text">{ops.text}</p>
            <ul className="ops-list" data-reveal="cards">
              {ops.points.map((p) => <li key={p.title}><h4>{p.title}</h4><p>{p.text}</p></li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
