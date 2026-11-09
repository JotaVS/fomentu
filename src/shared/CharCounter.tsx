/**
 * Contador de caracteres de um campo de texto longo (F01 e F04). Conta o texto aparado, como a
 * validação. Ligue-o ao campo com aria-describedby={id}.
 */
export function CharCounter({ id, value, max }: { id: string; value: string; max: number }) {
  const count = value.trim().length;
  const over = count > max;
  return <small id={id} className={over ? 'char-counter over' : 'char-counter'}>{count.toLocaleString('pt-BR')} de {max.toLocaleString('pt-BR')} caracteres</small>;
}
