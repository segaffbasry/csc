import { Button, Icon } from "@/components/ui";
import { company, contact } from "@/lib/content";

/* The live "Ready to Guarantee Your Programme?" call and its "Get in Touch" block, as their own section ahead of the
   footer (client feedback, 8 Oct: the contact must not sit inside the footer). A photo of the Maverick on the left;
   on the right the call, the two quote routes, the direct line, email and coverage, and the "Why Choose" list. */
export function Contact() {
  return (
    <section className="section contact" id="contact" tabIndex={-1} aria-labelledby="contact-title" data-late>
      <div className="wrap contact-grid">
        <figure className="frame contact-photo" data-reveal="image">
          <img src={contact.image.src} alt={contact.image.alt} loading="lazy" data-parallax />
        </figure>
        <div className="contact-main">
          <h2 id="contact-title" className="h2" data-reveal="head">{contact.title}</h2>
          <p className="section-text" data-reveal="text">{contact.text}</p>
          <div className="contact-actions" data-reveal="label">
            {contact.quotes.map((q, i) => <Button key={q.label} href={q.href} variant={i === 0 ? "primary" : "neutral"} icon="arrow">{q.label}</Button>)}
          </div>
          <ul className="contact-lines" data-reveal="cards">
            <li>
              <p className="contact-label">Direct Line</p>
              <a className="contact-big" href={company.phone.href}><Icon name="phone" />{company.phone.label}</a>
              <p className="contact-note">{company.hours}</p>
            </li>
            <li>
              <p className="contact-label">Email Estimating</p>
              <a className="contact-big contact-mail" href={company.email.href}><Icon name="mail" />{company.email.label}</a>
              <p className="contact-note">{contact.quoteText}</p>
            </li>
            <li>
              <p className="contact-label">{contact.coverage.title}</p>
              <p className="contact-big">{contact.coverage.text}</p>
              <p className="contact-note">{contact.coverage.note}</p>
            </li>
          </ul>
          <div className="contact-why" data-reveal="label">
            <p className="contact-label">{contact.whyTitle}</p>
            <ul className="checks">{contact.why.map((w) => <li key={w}><Icon name="check" />{w}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
