"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { EASE, EASE_IO, onIntro, reducedMotion } from "@/components/Motion";
import { Marquee } from "@/components/home/Marquee";
import { Button, Icon } from "@/components/ui";
import { company, hero } from "@/lib/content";
import { splitWords } from "@/lib/split";

/* siteassist's hero, restaged with CSC's own film: full-bleed footage (the Kingston Cemfloor C25 pour, cut from
   CSC's "Maverick in Action" film), a mono uppercase headline over a hairline rule, the line of copy and the
   registered office's coordinates under it, and the client logos along the foot.
   Entrance waits for intro:done: the film settles from 1.08 scale, the headline words rise out of their masks, the
   rule draws, the copy, buttons and logos follow. The film is muted, has a pause control, pauses off-screen and
   falls back to its local poster. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const el = root.current, v = video.current; if (!el || !v) return;
    const reduce = reducedMotion();
    if (reduce) { v.pause(); setPaused(true); userPaused.current = true; }

    // Off-screen, the film stops; back on screen it resumes unless the visitor paused it.
    const io = new IntersectionObserver(([e]) => {
      if (userPaused.current) return;
      if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
    }, { threshold: 0.05 });
    io.observe(el);

    if (reduce) { el.classList.add("is-armed"); return () => io.disconnect(); }

    const words = Array.from(el.querySelectorAll<HTMLElement>(".hero-line")).flatMap((l) => splitWords(l));
    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 110 });
      gsap.set(".hero-rule", { scaleX: 0 });
      gsap.set("[data-hero-in]", { autoAlpha: 0, y: 16 });
    }, el);
    el.classList.add("is-armed");

    const off = onIntro(() => {
      ctx.add(() => {
        gsap.timeline()
          .fromTo(".hero-film", { scale: 1.08 }, { scale: 1, duration: 1.8, ease: EASE }, 0)
          .to(words, { yPercent: 0, duration: 1, ease: EASE, stagger: 0.05 }, 0.1)
          .to(".hero-rule", { scaleX: 1, duration: 1.1, ease: EASE_IO }, 0.35)
          .to("[data-hero-in]", { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.07 }, 0.55);
      });
    });
    return () => { off(); io.disconnect(); ctx.revert(); };
  }, []);

  const toggle = () => {
    const v = video.current; if (!v) return;
    if (v.paused) { userPaused.current = false; v.play().catch(() => {}); setPaused(false); }
    else { userPaused.current = true; v.pause(); setPaused(true); }
  };

  return (
    <section className="hero" id="top" ref={root} data-tone="dark" aria-labelledby="hero-title">
      <div className="hero-media" aria-hidden="true">
        <video ref={video} className="hero-film" src={hero.film.src} poster={hero.film.poster} autoPlay muted loop playsInline preload="auto" />
        <div className="hero-shade" />
      </div>
      <div className="hero-inner wrap">
        <div className="hero-main">
          <h1 id="hero-title" className="hero-title">
            <span className="sr-only">CSC Screeding: </span>
            {hero.title.map((line) => <span className="hero-line" key={line}>{line}</span>)}
          </h1>
          <span className="hero-rule" aria-hidden="true" />
          <div className="hero-row">
            <p className="hero-text" data-hero-in>{hero.text}</p>
            <p className="hero-coords" data-hero-in><span className="hero-blink" aria-hidden="true" />{company.coords}</p>
          </div>
          <div className="hero-actions" data-hero-in>
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={company.phone.href} variant="white" icon="phone">Call Now {company.phone.label}</Button>
          </div>
        </div>
        <div className="hero-foot" data-hero-in>
          <p className="hero-clients-title">{hero.clientsTitle}</p>
          <Marquee className="hero-clients" label={hero.clientsTitle}>
            {hero.clients.map((c) => (
              <li key={c.name} className="client"><img src={c.src} alt={c.name} width={c.w} height={c.h} style={{ aspectRatio: `${c.w} / ${c.h}` }} /></li>
            ))}
          </Marquee>
          <button className="film-toggle" onClick={toggle} aria-label={paused ? "Play background film" : "Pause background film"}>
            <Icon name={paused ? "play" : "pause"} />
          </button>
        </div>
      </div>
    </section>
  );
}
