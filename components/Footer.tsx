import { Logo } from "@/components/Logo";
import { Icon } from "@/components/ui";
import { company, footer } from "@/lib/content";

/* siteassist's inset footer panel (neutral-300, 8px inset from the viewport, radius .75em) holding only the footer:
   the logo and line, the live footer groups and the company details. The contact call is its own section above
   (components/home/Contact.tsx). No scroll reveals in here: they fire in the last pixels and read as a jump. */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-panel">
        <div className="footer-links">
          <div className="footer-brand">
            <Logo className="footer-logo" />
            <p>{company.tagline}</p>
            <ul className="footer-socials">
              {footer.socials.map((s) => <li key={s.name}><a href={s.href} target="_blank" rel="noopener" aria-label={`CSC Screeding on ${s.name}`}><Icon name={s.icon} /></a></li>)}
            </ul>
          </div>
          {footer.groups.map((g) => (
            <nav className="footer-col" key={g.title} aria-label={g.title}>
              <p className="footer-label">{g.title}</p>
              <ul>{g.links.map((l) => <li key={l.label}><a href={l.href} target="_blank" rel="noopener">{l.label}</a></li>)}</ul>
            </nav>
          ))}
        </div>

        <div className="footer-base">
          <img className="footer-partner" src={footer.partner.src} alt={footer.partner.alt} width={footer.partner.w} height={footer.partner.h} loading="lazy" />
          <address className="footer-address">
            <span>Registered Address</span>
            {company.address.map((l) => <span key={l}>{l}</span>)}
          </address>
          <p className="footer-legal"><span>{company.vat}</span><span>{company.number}</span><span>{company.copyright}</span></p>
        </div>
      </div>
    </footer>
  );
}
