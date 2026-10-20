import { profile } from '../data/profile.js';
import UIIcon from './UIIcon.jsx';

export default function MailApp({ contact }) {
  const links = contact.links.filter(link => link.href);
  return <article className="mail-app">
    <header className="app-toolbar mail-toolbar"><span><UIIcon name="mail" />{profile.ui.compose}</span>
      {contact.email && <a className="button button--primary" href={`mailto:${contact.email}?subject=${encodeURIComponent(contact.subject)}`}>
        <UIIcon name="send" size={15} />{contact.emailLabel}</a>}
    </header>
    <dl className="mail-fields">
      <div><dt>{profile.ui.to}</dt><dd>{contact.email ? <a className="mail-recipient" href={`mailto:${contact.email}`}>{contact.email}</a>
        : <span className="mail-placeholder">{contact.emailPlaceholder}</span>}</dd></div>
      <div><dt>{profile.ui.subject}</dt><dd>{contact.subject}</dd></div>
    </dl>
    <div className="mail-body"><h2>{contact.title}</h2><p>{contact.message}</p>
      {links.length > 0 && <><p className="mail-links-heading">{profile.ui.contactOptions}</p><ul className="contact-links">
        {links.map(link => <li key={link.id}><a href={link.href} target="_blank" rel="noopener noreferrer">
          <UIIcon name="link" size={16} /><span>{link.label}</span><UIIcon name="external" size={13} />
        </a></li>)}
      </ul></>}
    </div>
  </article>;
}
