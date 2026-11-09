// A configuração pública não autoriza acesso; a conta usa a claim do Firebase.
export function validGroupName(name: unknown): name is string {
  return typeof name === 'string' && /^[a-z0-9](?:[a-z0-9-]{0,13}[a-z0-9])?$/.test(name);
}
export function groupIdFromName(name: unknown): string | null {
  return validGroupName(name) ? `group-${name}` : null;
}
export function validGroupId(group: unknown): group is string {
  return typeof group === 'string' && group.startsWith('group-') && validGroupName(group.slice(6));
}
