// O limite de 15 caracteres mantém o ID do site dentro dos 30 aceitos pelo Hosting.
export const validGroupName = name => typeof name === 'string' && /^[a-z0-9](?:[a-z0-9-]{0,13}[a-z0-9])?$/.test(name);
export const validGroup = group => typeof group === 'string' && group.startsWith('group-') && validGroupName(group.slice(6));
export function groupFromArgument(value) {
  const name = value;
  if (!validGroupName(name)) throw new Error('Use um nome de 1 a 15 caracteres: letras minúsculas, números e hífen, sem hífen no início ou fim.');
  return `group-${name}`;
}
