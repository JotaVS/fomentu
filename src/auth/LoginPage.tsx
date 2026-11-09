import type { FormEvent } from 'react';
import { Brand } from '../shared/Brand';
import { Icon } from '../shared/Icon';

type Props={ email: string; password: string; message: string; setEmail: (value: string) => void; setPassword: (value: string) => void; login: (event: FormEvent) => void; };

export function LoginPage({ email,password,message,setEmail,setPassword,login }: Props) {
  return <div className="login-page">
    <header className="login-header">
      <Brand />
      <a href="/">Voltar ao início <Icon name="arrow" size={16} />
      </a>
    </header>
    <main className="login-main">
      <div className="login-intro">
        <span className="eyebrow">
          <span /> ÁREA ADMINISTRATIVA</span>
        <h1>Bem-vindo<br />
          <em>de volta.</em>
        </h1>
        <p>Entre para acompanhar as ideias e o trabalho do seu grupo.</p>
        <div className="intro-art">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="login-card">
        <div className="login-card-icon">
          <Icon name="leaf" size={22} />
        </div>
        <h2>Entrar na plataforma</h2>
        <p>Use os dados de acesso fornecidos pelo instrutor.</p>
        <form onSubmit={login}>
          <label>E-mail<input type="email" autoComplete="username" placeholder="seuemail@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label>Senha<input type="password" autoComplete="current-password" placeholder="Digite sua senha" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>{message&&<p role="status" className="form-error">{message}</p>}<button className="button primary login-submit">Entrar <Icon name="arrow" size={18} />
          </button>
        </form>
        <div className="login-help">Problemas para acessar? <strong>Procure o instrutor.</strong>
        </div>
      </div>
    </main>
    <footer className="public-footer">Treinamento &quot;IA para Devs&quot; com Tiago Gouvêa</footer>
  </div>;
}
