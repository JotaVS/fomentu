import { Brand } from '../../shared/Brand';
import { Icon } from '../../shared/Icon';
import { isProjectDetail, navigation } from './navigation';

export function Sidebar({ path }: { path: string; }) {
  return <aside className="sidebar">
    <Brand />
    <div className="sidebar-section-label">ESPAÇO DE TRABALHO</div>
    <nav className="sidebar-nav" aria-label="Menu administrativo">{navigation.map(item => <a key={item.href} href={item.href} className={path===item.href || (item.href==='/admin/projetos' && isProjectDetail(path)) ? 'active':''} aria-current={path===item.href? 'page':undefined}>
      <Icon name={item.icon} size={19} />
      <span>{item.label}</span>
    </a>)}</nav>
    <div className="sidebar-bottom">
      <div className="sidebar-help">
        <span className="sidebar-help-icon">
          <Icon name="leaf" size={18} />
        </span>
        <strong>Uma ideia de cada vez.</strong>
        <p>Explore, construa e faça acontecer.</p>
      </div>
      <a className="sidebar-public" href="/cadastro">
        <Icon name="external" size={17} /> Página pública</a>
    </div>
  </aside>;
}
