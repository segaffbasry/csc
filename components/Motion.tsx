"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { getLenis, setLenis } from "@/lib/scroll";
import { splitWords } from "@/lib/split";

gsap.registerPlugin(ScrollTrigger, CustomEase);

/* The three curves on the page, all read off siteassist.com's stylesheet (also exposed in globals.css):
     csc-out     cubic-bezier(.35,1,.6,1)      its body background transition; every reveal uses it
     csc-io      cubic-bezier(.625,.05,0,1)    its .solutions-img scale; image clips, menu and preloader exits
     --ease-btn  cubic-bezier(.215,.61,.355,1) its .button transition (CSS only) */
CustomEase.create("csc-out", "M0,0 C0.35,1 0.6,1 1,1");
CustomEase.create("csc-io", "M0,0 C0.625,0.05 0,1 1,1");
export const EASE = "csc-out";
export const EASE_IO = "csc-io";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Handover from the preloader: the hero, header and scroll wait for this.
export const INTRO_DONE = "intro:done";
export const introDone = () => document.documentElement.dataset.intro === "done";
export function onIntro(fn: () => void) {
  if (introDone()) { fn(); return () => {}; }
  window.addEventListener(INTRO_DONE, fn, { once: true });
  return () => window.removeEventListener(INTRO_DONE, fn);
}

const format = (n: number) => Math.round(n).toLocaleString("en-GB");

/* Page-wide behaviour:
   - the link guard: a private demo, so links keep their live hrefs but never leave the page; "#" links scroll
     through Lenis instead
   - Lenis on the GSAP ticker, synced with ScrollTrigger, stopped while the preloader plays
   - the reveal vocabulary, declared in markup with data-reveal (table in README.md):
       head   a heading: the whole phrase fades and rises once
       text   a paragraph: its words rise out of a mask, a few thousandths apart
       label  labels, meta lines and buttons: a short fade and rise
       cards  a list: its children reveal in batches as they arrive
       image  a frame that clips open from the bottom; an <img data-parallax> inside drifts with the scroll
   - data-parallax: siteassist's initGlobalParallax (yPercent from start to end, scrub true, clamp() start/end)
   - data-count: stat counters, once
   Anything inside [data-late] (the last sections) plays at 0.75 of the duration. Every move plays once. */
export function Motion() {
  useEffect(() => {
    const guard = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      e.preventDefault();
      if (!href.startsWith("#")) return;
      const target = href === "#top" ? 0 : document.querySelector<HTMLElement>(href);
      if (target === null) return;
      const lenis = getLenis();
      // A link inside the menu fires while the menu still has Lenis stopped: start it so this scroll survives.
      if (lenis) { lenis.start(); lenis.scrollTo(target as HTMLElement | number, { duration: 1.4 }); }
      else if (typeof target === "number") window.scrollTo({ top: 0 });
      else target.scrollIntoView();
      if (typeof target !== "number") target.focus?.({ preventScroll: true });
    };
    document.addEventListener("click", guard, true);
    document.addEventListener("auxclick", guard, true);
    const unguard = () => { document.removeEventListener("click", guard, true); document.removeEventListener("auxclick", guard, true); };

    if (reducedMotion()) return unguard;

    /* siteassist runs Lenis at lerp 0.6, which is close to native. 0.12 is used instead: a softer glide, and the
       value that removed the "jump at the bottom" on earlier demos (README, Decisions). */
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();

    const ctx = gsap.context(() => {
      const pace = (el: Element) => (el.closest("[data-late]") ? 0.75 : 1);
      const once = (el: Element, start = "top 88%") => ({ trigger: el, start, once: true });

      gsap.utils.toArray<HTMLElement>('[data-reveal="head"]').forEach((el) => {
        gsap.fromTo(el, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1 * pace(el), ease: EASE, scrollTrigger: once(el) });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="text"]').forEach((el) => {
        const words = splitWords(el);
        gsap.set(el, { autoAlpha: 1 });
        gsap.fromTo(words, { yPercent: 105 }, { yPercent: 0, duration: 0.9 * pace(el), ease: EASE, stagger: 0.006, scrollTrigger: once(el) });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="label"]').forEach((el) => {
        gsap.fromTo(el, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 * pace(el), ease: EASE, scrollTrigger: once(el, "top 94%") });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="cards"]').forEach((list) => {
        const items = Array.from(list.children) as HTMLElement[];
        gsap.set(list, { autoAlpha: 1 });
        gsap.set(items, { y: 36, autoAlpha: 0 });
        ScrollTrigger.batch(items, {
          start: "top 92%", once: true,
          onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1 * pace(list), ease: EASE, stagger: 0.08 }),
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="image"]').forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3 * pace(el), ease: EASE_IO, scrollTrigger: once(el, "top 90%") });
      });

      // siteassist's initGlobalParallax, with the brief's ~10% travel as the default (theirs is 20 to -20).
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((target) => {
        const trigger = target.parentElement ?? target;
        const start = Number(target.dataset.parallaxStart ?? -6), end = Number(target.dataset.parallaxEnd ?? 6);
        gsap.set(target, { scale: 1.14 });
        gsap.fromTo(target, { yPercent: start }, {
          yPercent: end, ease: "none",
          scrollTrigger: { trigger, start: "clamp(top bottom)", end: "clamp(bottom top)", scrub: true },
        });
      });

      // The Lidl week bars draw once the figure is in view (a CSS transition on .case-bar, keyed off .is-drawn).
      gsap.utils.toArray<HTMLElement>(".case").forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: () => el.classList.add("is-drawn") });
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const box = { v: 0 };
        el.textContent = "0";
        gsap.to(box, { v: to, duration: 1.6, ease: EASE, scrollTrigger: once(el), onUpdate: () => { el.textContent = format(box.v); } });
      });
    });
    document.documentElement.classList.add("motion-ready");

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      unguard();
      window.removeEventListener("load", refresh);
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
