import { Text } from '@mantine/core';

/**
 * Contador de caracteres de um campo de texto longo (F01 e F04). Conta o texto aparado, como a
 * validação. Use-o como `description` do campo do Mantine, que já o liga por aria-describedby.
 */
export function CharCounter({ value, max }: { value: string; max: number }) {
  const count = value.trim().length;
  return <Text component="span" size="xs" c={count > max ? 'red.8' : 'dimmed'} fw={count > max ? 700 : undefined}>
    {count.toLocaleString('pt-BR')} de {max.toLocaleString('pt-BR')} caracteres
  </Text>;
}
