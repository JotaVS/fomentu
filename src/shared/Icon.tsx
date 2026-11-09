import type { ReactNode } from 'react';

export type IconName='grid'|'folder'|'spark'|'message'|'arrow'|'external'|'check'|'logout'|'leaf'|'plus';
const paths: Record<IconName,ReactNode>={
  grid: <>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </>,
  folder: <>
    <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </>,
  spark: <>
    <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
  </>,
  message: <>
    <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 1 1 21 11.5Z" />
    <path d="M8 10h8M8 14h5" />
  </>,
  arrow: <>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </>,
  external: <>
    <path d="M13 5h6v6M19 5l-9 9" />
    <path d="M19 14v5H5V5h5" />
  </>,
  check: <path d="m5 12 4 4L19 6" />,
  logout: <>
    <path d="M10 17v2H5V5h5v2M14 8l4 4-4 4M8 12h10" />
  </>,
  leaf: <>
    <path d="M20 4C9 4 4 8 4 15a5 5 0 0 0 5 5c7 0 11-5 11-16Z" />
    <path d="M5 19c2-4 5-7 10-10" />
  </>,
  plus: <path d="M12 5v14M5 12h14" />,
};
export function Icon({ name,size=20 }: { name: IconName; size?: number; }) { return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>; }
