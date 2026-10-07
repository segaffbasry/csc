"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { EASE, EASE_IO, onIntro, reducedMotion } from "@/components/Motion";
import { Icon } from "@/components/ui";
import { company, footer, headerNav, nav, sections } from "@/lib/content";
import { getLenis } from "@/lib/scroll";

/* Full-screen menu: an Ink panel clips open from the top on csc-io, then the live navigation, the homepage sections
   and the contact lines rise in. One GSAP timeline in, the same timeline reversed out. Focus is trapped inside,
   Esc closes, and focus returns to the toggle. */
function Menu({ open, close }: { open: boolean; close: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const t = gsap.timeline({ paused: true, onReverseComplete: () => { el.style.visibility = "hidden"; } });
    t.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: EASE_IO }, 0)
      // opacity, not autoAlpha: the links must be focusable the moment the menu opens.
      .fromTo(el.querySelectorAll("[data-menu-in]"), { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: EASE, stagger: 0.035 }, 0.35);
    tl.current = t;
    return () => { t.kill(); };
  }, []);

  useEffect(() => {
    const el = root.current, t = tl.current; if (!el || !t) return;
    const lenis = getLenis();
    if (open) {
      el.style.visibility = "visible";
      t.timeScale(reducedMotion() ? 100 : 1).play();
      lenis?.stop();
      const focusables = () => Array.from(el.querySelectorAll<HTMLElement>("a[href], button"));
      focusables()[0]?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") { close(); return; }
        if (e.key !== "Tab") return;
        const f = focusables(), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
    if (t.progress() > 0) { lenis?.start(); t.timeScale(reducedMotion() ? 100 : 1.4).reverse(); }
  }, [open, close]);

  // Section links close the menu first; the link guard in Motion then scrolls.
  const onClick = (e: React.MouseEvent) => { if ((e.target as Element).closest('a[href^="#"]')) close(); };

  return (
    <div className="menu" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Menu" inert={!open} data-lenis-prevent onClick={onClick}>
      <div className="menu-inner wrap">
        <nav className="menu-main" aria-label="CSC Screeding">
          <ul>{nav.map((l) => <li key={l.label} data-menu-in><a href={l.href} target="_blank" rel="noopener">{l.label}</a></li>)}</ul>
        </nav>
        <div className="menu-side">
          <div data-menu-in>
            <p className="menu-label">On this page</p>
            <ul className="menu-list">{sections.map((s) => <li key={s.href}><a href={s.href}>{s.label}</a></li>)}</ul>
          </div>
          <div data-menu-in>
            <p className="menu-label">Get in Touch</p>
            <ul className="menu-list">
              <li><a href={company.phone.href}>{company.phone.label}</a></li>
              <li><a href={company.email.href}>{company.email.label}</a></li>
              {footer.socials.map((s) => <li key={s.name}><a href={s.href} target="_blank" rel="noopener">{s.name}</a></li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* No bar and no box: the logo on the left, the main live pages, the direct line and the menu toggle on the right.
   It is white over the film and full colour over the light page, decided by a probe of what sits behind it. It
   slides away on the way down and comes back on the way up. */
export function Header() {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => { setOpen(false); toggle.current?.focus(); }, []);

  // Kept in state, not added to className by hand: React rewrites className whenever the menu opens.
  const [hidden, setHidden] = useState(false);
  const [entered, setEntered] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const probe = () => {
      raf = 0;
      const h = bar.current?.offsetHeight ?? 80;
      const under = document.elementsFromPoint(window.innerWidth / 2, h / 2).find((e) => !e.closest(".site-header, .menu, .preloader"));
      setDark(!!under?.closest('[data-tone="dark"]'));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(probe);
      const y = window.scrollY, d = y - last;
      if (y < 120) { setHidden(false); last = y; return; }
      if (Math.abs(d) < 6) return;
      setHidden(d > 0);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    probe();
    const off = onIntro(() => setEntered(true));
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); off(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <header className={`site-header${open ? " is-open" : ""}${hidden && !open ? " is-hidden" : ""}${entered ? " is-in" : ""}${dark || open ? " is-dark" : ""}`} ref={bar}>
        <a href="#top" className="header-logo" aria-label="CSC Screeding, back to the top"><Logo title="" /></a>
        <nav className="header-nav" aria-label="Main">
          <ul>{headerNav.map((l) => <li key={l.label}><a href={l.href} target="_blank" rel="noopener">{l.label}</a></li>)}</ul>
        </nav>
        <a className="header-phone" href={company.phone.href}><Icon name="phone" /><span>{company.phone.label}</span></a>
        <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="site-menu" onClick={() => (open ? close() : setOpen(true))}>
          <span className="menu-toggle-label">{open ? "Close" : "Menu"}</span>
          <span className="menu-toggle-lines" aria-hidden="true"><i /><i /></span>
        </button>
      </header>
      <Menu open={open} close={close} />
    </>
  );
}
