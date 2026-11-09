import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { App } from './App';
import { theme } from './shared/theme';
import '@mantine/core/styles.css';
import './style.css';

createRoot(document.getElementById('root')!).render(<MantineProvider theme={theme}><App /></MantineProvider>);
