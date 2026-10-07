"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import { EASE, EASE_IO, INTRO_DONE, reducedMotion } from "@/components/Motion";
import { getLenis } from "@/lib/scroll";

/* The company signing its name, built from the logo's own traced shapes. The CSC logo is two swooshes sweeping
   round two words, so it is drawn the way the swoosh moves: each swoosh wipes in left to right (a clip-path, which
   follows the arc's own direction), "CSC" rises letter by letter, then "screeding" follows a beat later. A counter
   and a hairline bar fill from 0 to 100 so the wait is visible (client feedback on earlier demos). Then the whole
   lock-up glides into the header logo position while the Ink curtain (the hero's opening colour, the film starts
   under an Ink overlay) lifts away to reveal the film. One timeline, 2.4s:
     0.05 to 0.60  grey swoosh wipes in;  0.20 to 0.75 blue swoosh
     0.30 to 0.90  "CSC" letters rise;    0.50 to 1.15 "screeding" letters rise
     0.00 to 1.70  counter and bar fill
     1.70 to 1.85  hold
     1.85 to 2.40  exit: logo to header, curtain lifts; handover fires at 1.85 so the hero entrance overlaps
   Plays on every load. Skipped with reduced motion, hidden without JavaScript, and never holds the page past 3.2s. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    let handed = false;
    const handover = () => {
      if (handed) return; handed = true;
      html.classList.remove("is-loading");
      html.dataset.intro = "done";
      getLenis()?.start();
      window.dispatchEvent(new Event(INTRO_DONE));
    };
    if (!el || !html.classList.contains("is-loading") || reducedMotion()) {
      if (el) el.style.display = "none";
      html.classList.add("logo-landed");
      handover();
      return;
    }
    window.scrollTo(0, 0);
    const mark = el.querySelector<HTMLElement>(".preloader-mark")!;
    const count = el.querySelector<HTMLElement>(".preloader-count")!;
    const q = (s: string) => el.querySelectorAll(`[data-part="${s}"]`);
    const target = document.querySelector<HTMLElement>(".header-logo .logo");
    const flight = () => {
      if (!target) return { x: 0, y: -40, scale: 0.4 };
      const a = mark.getBoundingClientRect(), b = target.getBoundingClientRect();
      return { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: b.width / a.width };
    };
    const progress = { v: 0 };

    const tl = gsap.timeline({ onComplete: () => { el.classList.remove("is-active"); el.style.display = "none"; html.classList.add("logo-landed"); } });
    tl.add(() => el.classList.add("is-active"), 0)
      .fromTo(q("swoosh-grey"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: EASE_IO }, 0.05)
      .fromTo(q("swoosh-blue"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: EASE_IO }, 0.2)
      .fromTo(q("csc"), { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: EASE, stagger: 0.05 }, 0.3)
      .fromTo(q("screeding"), { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: EASE, stagger: 0.02 }, 0.5)
      .to(progress, { v: 100, duration: 1.7, ease: "power1.inOut", onUpdate: () => { count.textContent = String(Math.round(progress.v)).padStart(3, "0"); } }, 0)
      .fromTo(el.querySelector(".preloader-bar"), { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: "power1.inOut" }, 0)
      .add(handover, 1.85)
      // Measured when the exit starts (tweens initialise lazily), so late layout shifts are accounted for.
      .to(mark, { x: () => flight().x, y: () => flight().y, scale: () => flight().scale, duration: 0.55, ease: EASE_IO }, 1.85)
      .to(el.querySelectorAll(".preloader-meta"), { autoAlpha: 0, duration: 0.25, ease: "none" }, 1.85)
      .fromTo(el.querySelector(".preloader-curtain"), { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.55, ease: EASE_IO }, 1.88);

    // Never hold the page: if the tab was hidden or throttled, finish anyway.
    const failsafe = window.setTimeout(() => { tl.progress(1); }, 3200);
    // Cleanup kills the timeline but leaves is-loading alone: React's dev double-mount runs it once before the real mount.
    return () => { window.clearTimeout(failsafe); tl.kill(); };
  }, []);

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader-curtain" />
      <div className="preloader-mark"><Logo title="" className="logo-on-dark" /></div>
      <div className="preloader-meta preloader-foot">
        <span className="preloader-count">000</span>
        <span className="preloader-track"><span className="preloader-bar" /></span>
      </div>
    </div>
  );
}
