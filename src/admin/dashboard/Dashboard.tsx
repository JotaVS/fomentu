import { Icon } from '../../shared/Icon';
import { Button } from '@mantine/core';
import { navigation } from '../layout/navigation';

export function Dashboard({ group,checking,message,diagnose }: { group: string; checking: boolean; message: string; diagnose: () => void; }) {
  return <>

    <div className="welcome">
      <div>
        <div className="eyebrow">
          <span /> SEU ESPAÇO DE TRABALHO</div>
        <h1>Olá, {group.replace('group-','grupo ')} <span>✳</span>
        </h1>
        <p>Um espaço para acompanhar ideias e construir novas possibilidades.</p>
      </div>
      <Button component="a" variant="outline" className="button secondary" href="/cadastro">Ver página pública <Icon name="external" size={16} />
      </Button>
    </div>
    <section className="intro-panel">
      <div className="intro-copy">
        <span className="intro-label">
          <span /> FOMENTU · OFICINA</span>
        <h2>Boas ideias merecem<br />um bom começo.</h2>
        <p>Organize projetos e avaliações em um só lugar. Sua jornada começa por aqui.</p>
        <a href="/admin/projetos" className="intro-link">Explorar projetos <Icon name="arrow" size={17} />
        </a>
      </div>
      <div className="intro-decoration" aria-hidden="true">
        <span className="orbit orbit-one" />
        <span className="orbit orbit-two" />
        <span className="orbit orbit-three" />
        <div className="decoration-leaf">
          <Icon name="leaf" size={44} />
        </div>
        <span className="decoration-star">✳</span>
      </div>
    </section>
    <section className="section-heading">
      <div>
        <h2>Seu espaço de trabalho</h2>
        <p>Comece explorando as áreas do projeto.</p>
      </div>
      <span className="section-index">01 / 03</span>
    </section>
    <div className="feature-grid">{navigation.slice(1).map((item,index) => <a className="feature-card" href={item.href} key={item.href}>
      <div className={`feature-icon feature-icon-${index}`}>
        <Icon name={item.icon} size={22} />
      </div>
      <div className="feature-top">
        <span>0{index+1}</span>
        <Icon name="arrow" size={17} />
      </div>
      <h3>{item.label}</h3>
      <p>{['Acompanhe as ideias que chegam ao seu grupo.','Explore análises que ajudam a entender cada ideia.','Registre a perspectiva humana sobre os projetos.'][index]}</p>
      <span className="feature-link">Acessar área <Icon name="arrow" size={15} />
      </span>
    </a>)}</div>
    <section className="connection-panel">
      <div className="connection-icon">
        <Icon name="check" size={19} />
      </div>
      <div>
        <strong>Preparação do ambiente</strong>
        <p>Verifique a conexão com o banco antes de iniciar a oficina.</p>
      </div>
      <Button variant="outline" className="button outline" onClick={diagnose} disabled={checking}>{checking? 'Verificando...':'Verificar conexão'}</Button>
    </section>{message&&<p className="status-message" role="status">{message}</p>}
  </>;
}
