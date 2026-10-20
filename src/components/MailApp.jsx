export default function MailApp({ contact }) {
  const links = contact.links.filter(link => link.href);
  return (
    <article className="mail-app">
      <h2>{contact.title}</h2>
      <p>{contact.message}</p>
      {contact.email ? <address>
        <a className="button button--primary" href={`mailto:${contact.email}?subject=${encodeURIComponent(contact.subject)}`}>
          {contact.emailLabel}
        </a>
        <span className="mail-address">{contact.email}</span>
      </address> : <p className="mail-placeholder">{contact.emailPlaceholder}</p>}
      {links.length > 0 && <ul className="contact-links">
        {links.map(link => <li key={link.id}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a></li>)}
      </ul>}
    </article>
  );
}
