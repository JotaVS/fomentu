import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, groupFor, groupRef } from './lib/firebase';
import './style.css';

type IconName = 'grid' | 'folder' | 'spark' | 'message' | 'arrow' | 'external' | 'check' | 'logout' | 'leaf' | 'plus';
const paths: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  folder: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></>,
  spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/></>,
  message: <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 10h8M8 14h5"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  external: <><path d="M13 5h6v6M19 5l-9 9"/><path d="M19 14v5H5V5h5"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  logout: <><path d="M10 17v2H5V5h5v2M14 8l4 4-4 4M8 12h10"/></>,
  leaf: <><path d="M20 4C9 4 4 8 4 15a5 5 0 0 0 5 5c7 0 11-5 11-16Z"/><path d="M5 19c2-4 5-7 10-10"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
};
function Icon({ name, size = 20 }: { name: IconName; size?: number }) { return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>; }
const navigation: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin', label: 'Visão geral', icon: 'grid' },
  { href: '/admin/projetos', label: 'Projetos', icon: 'folder' },
  { href: '/admin/avaliacao-ia', label: 'Avaliação com IA', icon: 'spark' },
  { href: '/admin/parecer', label: 'Parecer humano', icon: 'message' },
];
const titles: Record<string, string> = { '/admin': 'Visão geral', '/admin/projetos': 'Projetos', '/admin/avaliacao-ia': 'Avaliação com IA', '/admin/parecer': 'Parecer humano' };
function Brand() { return <a className="brand" href="/"><span className="brand-mark"><Icon name="leaf" size={22}/></span><span>fomentu<span className="brand-dot">.</span><small>OFICINA DE INOVAÇÃO</small></span></a>; }

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [group, setGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const admin = path === '/admin' || path.startsWith('/admin/');
  useEffect(() => onAuthStateChanged(auth, async current => {
    setUser(current); setGroup(''); setMessage('');
    if (current) { try { setGroup(await groupFor(current)); } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível identificar o grupo.'); } }
    setLoading(false);
  }), []);
  async function login(event: FormEvent) {
    event.preventDefault(); setMessage('');
    try { await signInWithEmailAndPassword(auth, email, password); } catch { setMessage('Não foi possível entrar. Confira o e-mail e a senha.'); }
  }
  async function diagnose() {
    if (!user || !group) return;
    setChecking(true); setMessage('');
    try { const ref = doc(groupRef(group), 'diagnostics', user.uid); await setDoc(ref, { checkedAt: serverTimestamp() }); const result = await getDoc(ref); setMessage(result.exists() ? 'Conexão confirmada. Seu grupo pode ler e gravar dados.' : 'Registro não encontrado.'); } catch { setMessage('Não foi possível verificar o acesso ao banco.'); } finally { setChecking(false); }
  }
  if (!admin) return <div className="public-page"><header className="public-header"><Brand/><nav aria-label="Navegação principal"><a href="/cadastro">Cadastrar projeto</a><a className="public-admin" href="/admin">Área administrativa <Icon name="arrow" size={16}/></a></nav></header><main className="public-content"><div className="eyebrow"><span/> UM ESPAÇO PARA BOAS IDEIAS</div><h1>{path === '/cadastro' ? 'Sua ideia começa aqui.' : <>Ideias de hoje.<br/><em>Impactos de amanhã.</em></>}</h1><p>{path === '/cadastro' ? 'O cadastro público será especificado e desenvolvido durante a oficina. Ele solicitará o nome e o e-mail do proponente.' : 'Um lugar para apresentar ideias, construir possibilidades e dar o próximo passo em novos projetos.'}</p>{path !== '/cadastro' && <a className="button primary" href="/cadastro">Cadastrar uma ideia <Icon name="arrow" size={18}/></a>}<div className="public-note"><span className="note-icon"><Icon name="leaf" size={18}/></span><span><strong>Desenvolvido para a oficina</strong><br/>Fomentu · Espaço de treinamento</span></div></main><footer className="public-footer">Treinamento &quot;IA para Devs&quot; com Tiago Gouvêa</footer></div>;
  if (loading) return <div className="loading">Carregando...</div>;
  if (!user) return <div className="login-page"><header className="login-header"><Brand/><a href="/">Voltar ao início <Icon name="arrow" size={16}/></a></header><main className="login-main"><div className="login-intro"><span className="eyebrow"><span/> ÁREA ADMINISTRATIVA</span><h1>Bem-vindo<br/><em>de volta.</em></h1><p>Entre para acompanhar as ideias e o trabalho do seu grupo.</p><div className="intro-art"><span/><span/><span/></div></div><div className="login-card"><div className="login-card-icon"><Icon name="leaf" size={22}/></div><h2>Entrar na plataforma</h2><p>Use os dados de acesso fornecidos pelo instrutor.</p><form onSubmit={login}><label>E-mail<input type="email" autoComplete="username" placeholder="seuemail@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Senha<input type="password" autoComplete="current-password" placeholder="Digite sua senha" value={password} onChange={e => setPassword(e.target.value)} required /></label>{message && <p role="status" className="form-error">{message}</p>}<button className="button primary login-submit">Entrar <Icon name="arrow" size={18}/></button></form><div className="login-help">Problemas para acessar? <strong>Procure o instrutor.</strong></div></div></main><footer className="public-footer">Treinamento &quot;IA para Devs&quot; com Tiago Gouvêa</footer></div>;
  const currentTitle = titles[path] || 'Visão geral';
  return <div className="app-shell"><aside className="sidebar"><Brand/><div className="sidebar-section-label">ESPAÇO DE TRABALHO</div><nav className="sidebar-nav" aria-label="Menu administrativo">{navigation.map(item => <a key={item.href} href={item.href} className={path === item.href ? 'active' : ''} aria-current={path === item.href ? 'page' : undefined}><Icon name={item.icon} size={19}/><span>{item.label}</span></a>)}</nav><div className="sidebar-bottom"><div className="sidebar-help"><span className="sidebar-help-icon"><Icon name="leaf" size={18}/></span><strong>Uma ideia de cada vez.</strong><p>Explore, construa e faça acontecer.</p></div><a className="sidebar-public" href="/cadastro"><Icon name="external" size={17}/> Página pública</a></div></aside><div className="workspace"><header className="topbar"><div className="breadcrumb"><span>Espaço de trabalho</span><span className="breadcrumb-separator">/</span><strong>{currentTitle}</strong></div><div className="account"><span className="group-pill"><span/> {group || 'Sem grupo'}</span><span className="avatar">{group ? group.slice(-2) : '?'}</span><div className="account-name"><strong>Meu grupo</strong><small>{user.email}</small></div><button className="logout" onClick={() => void signOut(auth)} aria-label="Sair" title="Sair"><Icon name="logout" size={19}/></button></div></header><main className="workspace-content">{group ? path === '/admin' ? <><div className="welcome"><div><div className="eyebrow"><span/> SEU ESPAÇO DE TRABALHO</div><h1>Olá, {group.replace('group-', 'grupo ')} <span>✳</span></h1><p>Um espaço para acompanhar ideias e construir novas possibilidades.</p></div><a className="button secondary" href="/cadastro">Ver página pública <Icon name="external" size={16}/></a></div><section className="intro-panel"><div className="intro-copy"><span className="intro-label"><span/> FOMENTU · OFICINA</span><h2>Boas ideias merecem<br/>um bom começo.</h2><p>Organize projetos e avaliações em um só lugar. Sua jornada começa por aqui.</p><a href="/admin/projetos" className="intro-link">Explorar projetos <Icon name="arrow" size={17}/></a></div><div className="intro-decoration" aria-hidden="true"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><span className="orbit orbit-three"/><div className="decoration-leaf"><Icon name="leaf" size={44}/></div><span className="decoration-star">✳</span></div></section><section className="section-heading"><div><h2>Seu espaço de trabalho</h2><p>Comece explorando as áreas do projeto.</p></div><span className="section-index">01 / 03</span></section><div className="feature-grid">{navigation.slice(1).map((item, index) => <a className="feature-card" href={item.href} key={item.href}><div className={`feature-icon feature-icon-${index}`}><Icon name={item.icon} size={22}/></div><div className="feature-top"><span>0{index + 1}</span><Icon name="arrow" size={17}/></div><h3>{item.label}</h3><p>{['Acompanhe as ideias que chegam ao seu grupo.', 'Explore análises que ajudam a entender cada ideia.', 'Registre a perspectiva humana sobre os projetos.'][index]}</p><span className="feature-link">Acessar área <Icon name="arrow" size={15}/></span></a>)}</div><section className="connection-panel"><div className="connection-icon"><Icon name="check" size={19}/></div><div><strong>Preparação do ambiente</strong><p>Verifique a conexão com o banco antes de iniciar a oficina.</p></div><button className="button outline" onClick={diagnose} disabled={checking}>{checking ? 'Verificando...' : 'Verificar conexão'}</button></section>{message && <p className="status-message" role="status">{message}</p>}</> : <><div className="page-heading"><div className="eyebrow"><span/> ESPAÇO DE TRABALHO</div><h1>{currentTitle}</h1><p>Uma área para desenvolver as funcionalidades da sua equipe.</p></div><section className="empty-panel"><div className="empty-icon"><Icon name={navigation.find(item => item.href === path)?.icon || 'folder'} size={28}/></div><span className="empty-label">PRONTO PARA COMEÇAR</span><h2>É aqui que as ideias ganham forma.</h2><p>Esta área será especificada e construída pelo seu grupo durante a oficina.</p><a className="button outline" href="/admin">Voltar à visão geral <Icon name="arrow" size={16}/></a></section></> : <div className="empty-panel"><h2>Não foi possível identificar seu grupo.</h2><p>{message || 'Procure o instrutor para verificar sua conta.'}</p></div>}</main><footer className="workspace-footer"><span>Treinamento &quot;IA para Devs&quot; com Tiago Gouvêa</span></footer></div></div>;
}

createRoot(document.getElementById('root')!).render(<App />);
