import { Icon } from './Icon';

export function Brand() {
  return <a className="brand" href="/">
    <span className="brand-mark">
      <Icon name="leaf" size={22} />
    </span>
    <span>fomentu<span className="brand-dot">.</span>
      <small>OFICINA DE INOVAÇÃO</small>
    </span>
  </a>;
}
