import js from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config({ ignores: ['dist/**', 'node_modules/**', 'functions/**'] }, js.configs.recommended, ...tseslint.configs.recommended, { files: ['**/*.{js,ts,tsx}'], languageOptions: { globals: { console: 'readonly', process: 'readonly' } } });
