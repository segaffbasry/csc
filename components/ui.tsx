import type { ReactNode } from "react";

// Simple Icons path (CC0) for the one brand account; the rest are drawn here on a 24px grid.
const youtube = "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z";

const glyphs = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />,
  left: <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />,
  northeast: <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" />,
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" />,
  pause: <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />,
  close: <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" />,
  phone: <path d="M6.6 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.1 6.1l1.3-2 4 1.5v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.5 5.6a2 2 0 0 1 2.1-2.1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  mail: <g fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3.5" y="5.5" width="17" height="13" rx="1" /><path d="M3.5 6.5l8.5 6.5 8.5-6.5" /></g>,
  youtube: <path d={youtube} fill="currentColor" />,
};

export type IconName = keyof typeof glyphs;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={`icon ${className ?? ""}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {glyphs[name]}
    </svg>
  );
}

const external = (href: string) => !href.startsWith("#") && !href.startsWith("tel:") && !href.startsWith("mailto:");

/* siteassist.com's .button, measured from its stylesheet: Geist Mono 500, uppercase, letter-spacing .04em,
   line-height 1.5, padding .75em 1.5em, radius .25em, `transition: all .2s cubic-bezier(.215,.61,.355,1)`.
   Variants follow its own: primary (violet, hover #8133fe, here Royal to Royal Light), neutral (neutral-300, hover
   neutral-200 with neutral-700 text), line (transparent with a 1px bottom border, hover to neutral-600) and a
   white variant for the film. Outbound links open in a new tab. */
export function Button({ href, children, variant = "primary", icon, className }: {
  href: string; children: ReactNode; variant?: "primary" | "neutral" | "line" | "white"; icon?: IconName; className?: string;
}) {
  return (
    <a href={href} className={`btn btn-${variant} ${className ?? ""}`} {...(external(href) ? { target: "_blank", rel: "noopener" } : {})}>
      {icon && <Icon name={icon} />}
      <span>{children}</span>
    </a>
  );
}
