import type { User } from 'firebase/auth';
import { Icon } from '../../shared/Icon';

export function Header({ currentTitle,group,user,logout }: { currentTitle: string; group: string; user: User; logout: () => void; }) {
  return <header className="topbar">
    <div className="breadcrumb">
      <span>Espaço de trabalho</span>
      <span className="breadcrumb-separator">/</span>
      <strong>{currentTitle}</strong>
    </div>
    <div className="account">
      <span className="group-pill">
        <span /> {group||'Sem grupo'}</span>
      <span className="avatar">{group ? group.slice(6, 8).toUpperCase() : '?'}</span>
      <div className="account-name">
        <strong>Meu grupo</strong>
        <small>{user.email}</small>
      </div>
      <button className="logout" onClick={logout} aria-label="Sair" title="Sair">
        <Icon name="logout" size={19} />
      </button>
    </div>
  </header>;
}
