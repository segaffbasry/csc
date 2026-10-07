import { Logo } from "@/components/Logo";
import { Button, Icon } from "@/components/ui";
import { company, contact, footer } from "@/lib/content";

/* siteassist's inset footer panel ("Let's talk" on neutral-300, 8px inset from the viewport, radius .75em), carrying
   CSC's closing call, its quote routes, direct lines and "Why Choose" list, then the live footer groups and the
   company details. No scroll reveals in here: they fire in the last pixels of the page and read as a jump. */
export function Footer() {
  return (
    <footer className="site-footer" aria-labelledby="contact-title">
      <div className="footer-panel" id="contact" tabIndex={-1}>
        <div className="footer-cta">
          <h2 id="contact-title" className="h2">{contact.title}</h2>
          <p className="footer-cta-text">{contact.text}</p>
          <div className="footer-cta-actions">
            {contact.quotes.map((q, i) => <Button key={q.label} href={q.href} variant={i === 0 ? "primary" : "neutral"} icon="arrow">{q.label}</Button>)}
          </div>
        </div>

        <div className="footer-contact">
          <div className="contact-block">
            <p className="footer-label">Direct Line</p>
            <a className="contact-big" href={company.phone.href}>{company.phone.label}</a>
            <p className="contact-note">{company.hours}</p>
          </div>
          <div className="contact-block">
            <p className="footer-label">Email Estimating</p>
            <a className="contact-big contact-mail" href={company.email.href}>{company.email.label}</a>
            <p className="contact-note">{contact.quoteText}</p>
          </div>
          <div className="contact-block">
            <p className="footer-label">{contact.coverage.title}</p>
            <p className="contact-big">{contact.coverage.text}</p>
            <p className="contact-note">{contact.coverage.note}</p>
          </div>
          <div className="contact-block">
            <p className="footer-label">{contact.whyTitle}</p>
            <ul className="checks checks-tight">{contact.why.map((w) => <li key={w}><Icon name="check" />{w}</li>)}</ul>
          </div>
        </div>

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
