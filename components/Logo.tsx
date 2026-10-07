import { LOGO_H, LOGO_W, logoParts } from "@/lib/logo";

/* The CSC Screeding lock-up, rebuilt from its own traced shapes (scripts/logo.py): "CSC", the nine letters of
   "screeding" and the two swooshes. Each shape is its own <path> with a data-part so the preloader can build it.
   Colours come from CSS custom properties (--logo-csc, --logo-scr, --logo-swg, --logo-swb), so one component serves
   the full-colour logo on light ground and the white logo on the film. */
export function Logo({ title = "CSC Screeding", className }: { title?: string; className?: string }) {
  return (
    <svg
      className={`logo ${className ?? ""}`}
      viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {logoParts.map((p, i) => (
        <path key={i} d={p.d} className={`lg-${p.group === "swoosh" ? `sw-${p.char}` : p.group}`} data-part={p.group === "swoosh" ? `swoosh-${p.char}` : p.group} />
      ))}
    </svg>
  );
}
