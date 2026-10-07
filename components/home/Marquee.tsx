"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";
import { reducedMotion } from "@/components/Motion";

/* siteassist's initMarqueeScrollDirection, ported: the list is duplicated, every copy runs xPercent -100 on a linear
   loop of duration speed x (content width / viewport width) x multiplier (speed 30; multiplier 1, 0.5 under
   991px, 0.25 under 479px, exactly as theirs), and
   the direction flips with the scroll direction. Its extra scroll-speed drift (scrub 0) is kept at 2vw.
   Copies are aria-hidden so screen readers hear the list once. Reduced motion: a static wrapped row. */
export function Marquee({ children, className, label, speed = 30 }: { children: ReactNode; className?: string; label: string; speed?: number }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    const track = el.querySelector<HTMLElement>(".marquee-track")!;
    const first = track.querySelector<HTMLElement>(".marquee-list")!;
    const copy = first.cloneNode(true) as HTMLElement;
    copy.setAttribute("aria-hidden", "true");
    copy.querySelectorAll("img").forEach((i) => i.setAttribute("alt", ""));
    track.appendChild(copy);
    el.classList.add("is-running");

    const multiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
    const lists = track.querySelectorAll(".marquee-list");
    const duration = speed * (first.offsetWidth / window.innerWidth) * multiplier;
    // totalProgress(0.5), as theirs: starts deep inside the endless repeat so reversing never hits time 0.
    const anim = gsap.to(lists, { xPercent: -100, repeat: -1, duration, ease: "none" }).totalProgress(0.5);
    const st = ScrollTrigger.create({
      trigger: el, start: "top bottom", end: "bottom top",
      onUpdate: (self) => anim.timeScale(self.direction === 1 ? 1 : -1),
    });
    const drift = gsap.fromTo(track, { x: "2vw" }, { x: "-2vw", ease: "none", scrollTrigger: { trigger: el, start: "0% 100%", end: "100% 0%", scrub: 0 } });
    return () => { anim.kill(); st.kill(); drift.scrollTrigger?.kill(); drift.kill(); copy.remove(); el.classList.remove("is-running"); gsap.set(lists, { clearProps: "all" }); };
  }, [speed]);

  return (
    <div className={`marquee ${className ?? ""}`} ref={root}>
      <div className="marquee-track">
        <ul className="marquee-list" aria-label={label}>{children}</ul>
      </div>
    </div>
  );
}
