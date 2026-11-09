import type { IconName } from '../../shared/Icon';

export const navigation: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin', label: 'Visão geral', icon: 'grid' },
  { href: '/admin/projetos', label: 'Projetos', icon: 'folder' },
  { href: '/admin/avaliacao-ia', label: 'Avaliação com IA', icon: 'spark' },
  { href: '/admin/parecer', label: 'Parecer humano', icon: 'message' },
];
export const titles: Record<string, string> = { '/admin': 'Visão geral', '/admin/projetos': 'Projetos', '/admin/avaliacao-ia': 'Avaliação com IA', '/admin/parecer': 'Parecer humano' };
