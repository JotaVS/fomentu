// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { Brand } from '../src/shared/Brand';

describe('marca', () => {
  it('permite voltar para a página inicial', () => {
    render(<Brand />);
    expect(screen.getByRole('link', { name: /fomentu/i })).toHaveAttribute('href', '/');
  });
});
