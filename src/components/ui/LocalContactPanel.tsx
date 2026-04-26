import { ExternalLink, Phone, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import type { ArizonaContact } from "../../data/arizonaContacts";

interface LocalContactPanelProps {
  contacts: ArizonaContact[];
  title?: string;
}

export function LocalContactPanel({
  contacts,
  title = "Local Arizona contacts"
}: LocalContactPanelProps) {
  const [isCallCapable, setIsCallCapable] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setIsCallCapable(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <section className="local-contact-panel">
      <div className="local-contact-panel__header">
        <ShieldCheck size={20} />
        <div>
          <h3>{title}</h3>
          <p>Suggested nearby or relevant resources based on the report context.</p>
        </div>
      </div>

      <div className="contact-grid">
        {contacts.map((contact) => (
          <article className="contact-card" key={contact.id}>
            <span>{contact.label}</span>
            <h4>{contact.organization}</h4>
            <p>{contact.relevance}</p>
            <div className="contact-links">
              {contact.phone ? (
                isCallCapable ? (
                  <a
                    className="phone-call-link"
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                    aria-label={`Call ${contact.organization}`}
                  >
                    <Phone size={15} />
                    {contact.phone}
                  </a>
                ) : (
                  <span className="phone-text" aria-label={`Phone number for ${contact.organization}`}>
                    <Phone size={15} />
                    {contact.phone}
                  </span>
                )
              ) : null}
              {contact.url ? (
                <a href={contact.url} target="_blank" rel="noreferrer">
                  <ExternalLink size={15} />
                  Website
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
