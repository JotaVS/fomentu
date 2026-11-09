# Contrato: Security Rules do miniapp

Estrutura-alvo de `firestore.rules`, compartilhada pelas F01 e F04. O texto abaixo é um **esboço
de referência para a implementação**; os nomes e detalhes podem ser ajustados, desde que todos os
casos da tabela de verificação passem no emulador.

```text
match /groups/{groupId} {
  function isMember() {
    return request.auth != null && request.auth.token.groupId == groupId;
  }

  allow read: if isMember();                       // documento do grupo

  match /diagnostics/{id} { allow read, write: if isMember(); }   // página de diagnóstico da base

  match /projects/{projectId} {
    allow read: if isMember();
    allow create: if validPublicProject(request.resource.data);  // com ou sem login
    allow update, delete: if false;

    match /evaluations/{evaluationId} {
      allow read: if isMember();
      allow create: if isMember() && (validAiEvaluation() || validHumanEvaluation());   // F03/F04
      allow update: if isMember() && canEditOwnHumanEvaluation();                       // F04
      allow delete: if false;
    }
  }
}
```

`validPublicProject(data)` verifica:

- `data.keys().hasOnly([...todos os campos do modelo])` e `hasAll([...obrigatórios])`;
- tipos `string` e tamanhos mínimo e máximo de cada texto;
- `proponentEmail` corresponde a um padrão simples de e-mail e não tem maiúsculas;
- cada enum dentro da lista de valores permitidos;
- `mvpLink` presente quando `mvpStatus == 'yes'` e, quando presente, começando com `http(s)://`
  com até 500 caracteres;
- `createdBy == 'public-form'`, `createdAt == request.time` e `consentAt == request.time`.

As funções de avaliação estão no contrato da F04
([../../005-avaliar-como-humano/contracts/firestore-rules-evaluations.md](../../005-avaliar-como-humano/contracts/firestore-rules-evaluations.md)).

## Verificação (emulador)

| Contexto | Operação | Esperado |
| --- | --- | --- |
| Não autenticado | criar projeto válido em `group-01` | permitido |
| Não autenticado | ler, listar, alterar ou excluir projeto | negado |
| Não autenticado | criar com chave extra, chave faltando, tipo errado, texto longo ou enum inválido | negado |
| Não autenticado | criar com `mvpStatus: 'yes'` sem `mvpLink` | negado |
| Não autenticado | criar com `createdBy` diferente ou data do cliente | negado |
| Não autenticado | criar em `evaluations` ou `diagnostics` | negado |
| Membro do `group-01` | ler e listar projetos do `group-01` | permitido |
| Membro do `group-01` | ler projetos do `group-02` | negado |
| Membro do `group-01` | alterar ou excluir projeto | negado |
| Usuário sem claim | ler projetos | negado |
| Membro | ler e gravar `diagnostics` do próprio grupo | permitido |
