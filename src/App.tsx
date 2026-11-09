import { useEffect,useState,type FormEvent } from 'react';
import { onAuthStateChanged,signInWithEmailAndPassword,signOut,type User } from 'firebase/auth';
import { doc,getDoc,serverTimestamp,setDoc } from 'firebase/firestore';
import { auth,groupFor,groupRef } from './lib/firebase';
import { PublicPage } from './public/PublicPage';
import { LoginPage } from './auth/LoginPage';
import { AdminLayout } from './admin/layout/AdminLayout';
import { titles } from './admin/layout/navigation';
import { Dashboard } from './admin/dashboard/Dashboard';
import { FeaturePage } from './admin/FeaturePage';

export function App() {
  const [user,setUser]=useState<User|null>(null);
  const [group,setGroup]=useState('');
  const [loading,setLoading]=useState(true);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [message,setMessage]=useState('');
  const [checking,setChecking]=useState(false);
  const path=window.location.pathname.replace(/\/$/,'')||'/';
  const admin=path==='/admin'||path.startsWith('/admin/');
  useEffect(() => onAuthStateChanged(auth,async current => {
    setUser(current); setGroup(''); setMessage('');
    if(current) { try { setGroup(await groupFor(current)); } catch(error) { setMessage(error instanceof Error? error.message:'Não foi possível identificar o grupo.'); } }
    setLoading(false);
  }),[]);
  async function login(event: FormEvent) {
    event.preventDefault(); setMessage('');
    try { await signInWithEmailAndPassword(auth,email,password); } catch { setMessage('Não foi possível entrar. Confira o e-mail e a senha.'); }
  }
  async function diagnose() {
    if(!user||!group) return;
    setChecking(true); setMessage('');
    try { const ref=doc(groupRef(group),'diagnostics',user.uid); await setDoc(ref,{ checkedAt: serverTimestamp() }); const result=await getDoc(ref); setMessage(result.exists()? 'Conexão confirmada. Seu grupo pode ler e gravar dados.':'Registro não encontrado.'); } catch { setMessage('Não foi possível verificar o acesso ao banco.'); } finally { setChecking(false); }
  }
  if(!admin) return <PublicPage path={path} />;
  if(loading) return <div className="loading">Carregando...</div>;
  if(!user) return <LoginPage email={email} password={password} message={message} setEmail={setEmail} setPassword={setPassword} login={login} />;
  const currentTitle=titles[path]||'Visão geral';
  return <AdminLayout path={path} currentTitle={currentTitle} group={group} user={user} logout={() => void signOut(auth)}>
    {group? path==='/admin'? <Dashboard group={group} checking={checking} message={message} diagnose={() => void diagnose()} />:<FeaturePage path={path} currentTitle={currentTitle} />:<div className="empty-panel"><h2>Não foi possível identificar seu grupo.</h2><p>{message||'Procure o instrutor para verificar sua conta.'}</p></div>}
  </AdminLayout>;
}
