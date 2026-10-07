import { Button, Icon } from "@/components/ui";
import { services } from "@/lib/content";

/* The two live service cards ("Commercial Fit-Out" and "Residential Projects") with their "Screeding Expertise"
   twins merged in. Laid out like siteassist's industry cards: a photograph with the title over it (8px radius),
   then the copy, eight checks in two columns and the live quote link. */
export function Services() {
  return (
    <section className="section band services" id="services" tabIndex={-1} aria-labelledby="services-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="services-title" className="h2" data-reveal="head">{services.title[0]} {services.title[1]}</h2>
          <p className="section-text" data-reveal="text">{services.text}</p>
        </div>
        <ul className="service-grid" data-reveal="cards">
          {services.items.map((s) => (
            <li key={s.id} className="service" id={s.id}>
              <div className="service-media">
                <img src={s.image.src} alt={s.image.alt} loading="lazy" />
                <div className="service-cap">
                  <h3 className="service-title">{s.title}</h3>
                  <p className="service-sub">{s.sub}</p>
                </div>
              </div>
              <div className="service-body">
                <p>{s.text}</p>
                <ul className="checks">
                  {s.bullets.map((b) => <li key={b}><Icon name="check" />{b}</li>)}
                </ul>
                <Button href={s.cta.href} icon="arrow">{s.cta.label}</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
