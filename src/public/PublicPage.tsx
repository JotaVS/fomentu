import { publicGroupId } from '../lib/firebase';
import { Brand } from '../shared/Brand';
import { Icon } from '../shared/Icon';

export function PublicPage({ path }: { path: string; }) {
  return <div className="public-page">
    <header className="public-header">
      <Brand />
      <nav aria-label="Navegação principal">
        <a href="/cadastro">Cadastrar projeto</a>
        <a className="public-admin" href="/admin">Área administrativa <Icon name="arrow" size={16} />
        </a>
      </nav>
    </header>
    <main className="public-content">
      <div className="eyebrow">
        <span /> UM ESPAÇO PARA BOAS IDEIAS</div>
      <h1>{path==='/cadastro'? 'Sua ideia começa aqui.':<>Ideias de hoje.<br />
        <em>Impactos de amanhã.</em>
      </>}</h1>
      <p>{path==='/cadastro'? 'O cadastro público será especificado e desenvolvido durante a oficina. Ele solicitará o nome e o e-mail do proponente.':'Um lugar para apresentar ideias, construir possibilidades e dar o próximo passo em novos projetos.'}</p>{path==='/cadastro'&&!publicGroupId()&&<p role="alert">Grupo do site não configurado. Procure o responsável pela aplicação.</p>}{path!=='/cadastro'&&<a className="button primary" href="/cadastro">Cadastrar uma ideia <Icon name="arrow" size={18} />
      </a>}<div className="public-note">
        <span className="note-icon">
          <Icon name="leaf" size={18} />
        </span>
        <span>
          <strong>Desenvolvido para a oficina</strong>
          <br />Fomentu · Espaço de treinamento</span>
      </div>
    </main>
    <footer className="public-footer">Treinamento &quot;IA para Devs&quot; com Tiago Gouvêa</footer>
  </div>;
}
