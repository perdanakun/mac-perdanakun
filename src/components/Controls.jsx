import { useId } from 'react';
import UIIcon from './UIIcon.jsx';
import { profile } from '../data/profile.js';

export function IconButton({ icon, label, className = '', ...props }) {
  return <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} {...props}>
    <UIIcon name={icon} />
  </button>;
}

export function SearchField({ value, onChange, label, className = '' }) {
  const id = useId();
  return <div className={`search-field ${className}`}>
    <UIIcon name="search" size={16} />
    <label className="sr-only" htmlFor={id}>{label}</label>
    <input id={id} type="search" value={value} placeholder={label} onChange={event => onChange(event.target.value)} />
    {value && <button type="button" className="search-clear" aria-label={profile.ui.clearSearch}
      onClick={() => { onChange(''); document.getElementById(id)?.focus(); }}><UIIcon name="close" size={12} /></button>}
  </div>;
}
