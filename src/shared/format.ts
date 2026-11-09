export const MISSING_TEXT = 'Não informado';
export const MISSING_DATE = 'Data não informada';

/** Rótulo PT-BR de um valor; "Não informado" se ausente; o próprio valor se for desconhecido. */
export function labelOrMissing(labels: Readonly<Record<string, string>>, value: unknown): string {
  if (value === undefined || value === null || String(value).trim() === '') return MISSING_TEXT;
  const key = String(value);
  return Object.hasOwn(labels, key) ? labels[key] : key;
}

const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });

/** Data e hora no formato brasileiro, no fuso de Brasília. Aceita Date ou Timestamp do Firestore. */
export function formatDate(value: unknown): string {
  const date = value instanceof Date ? value
    : value && typeof (value as { toDate?: unknown }).toDate === 'function' ? (value as { toDate: () => Date }).toDate()
    : null;
  if (!date || Number.isNaN(date.getTime())) return MISSING_DATE;
  return dateFormat.format(date);
}
