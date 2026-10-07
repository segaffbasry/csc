"use client";

import gsap from "gsap";
import { useRef, useState } from "react";
import { EASE, reducedMotion } from "@/components/Motion";
import { Icon } from "@/components/ui";
import { testimonials } from "@/lib/content";

/* siteassist's testimonial slider: a photograph and the quote on a grey (here Concrete 200) panel, with square
   arrow buttons in the section head. The quote cross-fades with a short rise; the count is announced politely.
   The arrow keys work when the panel has focus. */
export function Testimonials() {
  const [i, setI] = useState(0);
  const quote = useRef<HTMLDivElement>(null);
  const n = testimonials.items.length;
  const go = (d: number) => {
    const next = (i + d + n) % n;
    const el = quote.current;
    if (!el || reducedMotion()) { setI(next); return; }
    gsap.to(el, { autoAlpha: 0, y: -8, duration: 0.25, ease: "none", onComplete: () => {
      setI(next);
      gsap.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE });
    } });
  };
  const t = testimonials.items[i];

  return (
    <section className="section testimonials" id="testimonials" tabIndex={-1} aria-labelledby="testimonials-title" data-late>
      <div className="wrap">
        <div className="section-head section-head-row">
          <div>
            <h2 id="testimonials-title" className="h2" data-reveal="head">{testimonials.title}</h2>
            <p className="section-text" data-reveal="text">{testimonials.text}</p>
          </div>
          <div className="slider-nav" data-reveal="label">
            <button className="square-btn" onClick={() => go(-1)} aria-label="Previous testimonial"><Icon name="left" /></button>
            <button className="square-btn" onClick={() => go(1)} aria-label="Next testimonial"><Icon name="arrow" /></button>
          </div>
        </div>
        <div
          className="quote-panel"
          role="group"
          aria-roledescription="carousel"
          aria-label={testimonials.title}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}
          data-reveal="label"
        >
          <figure className="frame quote-photo"><img src={testimonials.image.src} alt={testimonials.image.alt} loading="lazy" /></figure>
          <div className="quote-body" ref={quote}>
            <p className="quote-stars" aria-label="Five stars">★★★★★</p>
            <blockquote className="quote-text">&ldquo;{t.quote}&rdquo;</blockquote>
            <p className="quote-name">{t.name}</p>
            {t.role && <p className="quote-role">{t.role}</p>}
            <p className="quote-project">{t.project}</p>
          </div>
          <p className="quote-count" aria-live="polite">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</p>
        </div>
      </div>
    </section>
  );
}
