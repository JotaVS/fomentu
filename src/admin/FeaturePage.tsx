import { Icon } from '../shared/Icon';
import { navigation } from './layout/navigation';

export function FeaturePage({ path,currentTitle }: { path: string; currentTitle: string; }) {
  return <>

    <div className="page-heading">
      <div className="eyebrow">
        <span /> ESPAÇO DE TRABALHO</div>
      <h1>{currentTitle}</h1>
      <p>Uma área para desenvolver as funcionalidades da sua equipe.</p>
    </div>
    <section className="empty-panel">
      <div className="empty-icon">
        <Icon name={navigation.find(item => item.href===path)?.icon||'folder'} size={28} />
      </div>
      <span className="empty-label">PRONTO PARA COMEÇAR</span>
      <h2>É aqui que as ideias ganham forma.</h2>
      <p>Esta área será especificada e construída pelo seu grupo durante a oficina.</p>
      <a className="button outline" href="/admin">Voltar à visão geral <Icon name="arrow" size={16} />
      </a>
    </section>

  </>;
}
