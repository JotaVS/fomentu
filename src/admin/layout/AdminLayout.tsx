import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AdminLayout({ path,currentTitle,group,user,logout,children }: { path: string; currentTitle: string; group: string; user: User; logout: () => void; children: ReactNode; }) {
  return <div className="app-shell">
    <Sidebar path={path} />
    <div className="workspace">
      <Header currentTitle={currentTitle} group={group} user={user} logout={logout} />
      <main className="workspace-content">{children}</main>
      <footer className="workspace-footer">
        <span>Treinamento &quot;IA para Devs&quot; com Tiago Gouvêa</span>
      </footer>
    </div>
  </div>;
}
