export default function AssistantOrb({ small = false, active = false }) {
  return <span className={`assistant-orb${small ? ' assistant-orb--small' : ''}`} data-active={active || undefined} aria-hidden="true"><span /></span>;
}
