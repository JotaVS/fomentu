# Contrato: regras da subcoleção `evaluations`

Complementa a estrutura definida na F01
([../../002-cadastrar-projeto/contracts/firestore-rules-projects.md](../../002-cadastrar-projeto/contracts/firestore-rules-projects.md)).
O texto é um esboço de referência para a implementação.

```text
function sameAuthor(data) {
  return data.createdByUid == request.auth.uid
      && data.createdByEmail == request.auth.token.email
      && data.createdAt == request.time;
}

function validAiEvaluation() {            // F03
  let d = request.resource.data;
  return d.keys().hasOnly(['source','mode','model','content','analysis','promptVersion',
                           'createdAt','createdByUid','createdByEmail'])
      && d.source == 'ai' && d.mode in ['live', 'mock']
      && d.content is string && d.content.size() > 0 && d.content.size() <= 20000
      && d.promptVersion is string
      && (!('analysis' in d) || d.analysis is map)
      && sameAuthor(d);
}

function validHumanFields(d) {            // F04
  return d.reviewerName is string && d.reviewerName.size() >= 2 && d.reviewerName.size() <= 120
      && d.content is string && d.content.size() >= 30 && d.content.size() <= 3000
      && d.criteria is map
      && d.criteria.keys().hasOnly(['businessModel','innovation','market','trl','partec']);
      // tamanho de cada critério verificado individualmente (≤ 1.000)
}

function validHumanEvaluation() {
  let d = request.resource.data;
  return d.keys().hasOnly(['source','reviewerName','content','criteria',
                           'createdAt','createdByUid','createdByEmail'])
      && d.source == 'human' && validHumanFields(d) && sameAuthor(d);
}

function canEditOwnHumanEvaluation() {
  return resource.data.source == 'human'
      && resource.data.createdByUid == request.auth.uid
      && request.resource.data.diff(resource.data).affectedKeys()
           .hasOnly(['reviewerName','content','criteria','updatedAt'])
      && request.resource.data.updatedAt == request.time
      && validHumanFields(request.resource.data);
}
```

## Verificação (emulador)

| Contexto | Operação | Esperado |
| --- | --- | --- |
| `user-a` (`group-01`) | criar parecer válido com o próprio `uid` | permitido |
| `user-a` | criar parecer com `createdByUid` de outro | negado |
| `user-a` | criar com chave extra, síntese curta ou `source` inválida | negado |
| `user-a` | editar o próprio parecer (campos permitidos) | permitido |
| `user-a` | alterar `createdByUid`, `createdAt` ou `source` | negado |
| `user-b` (`group-01`) | editar parecer do `user-a` | negado |
| qualquer membro | excluir avaliação | negado |
| qualquer membro | editar parecer do seed | negado |
| `user-a` | criar análise de IA válida | permitido |
| `user-a` | alterar análise de IA | negado |
| membro do `group-02` | ler ou escrever avaliações do `group-01` | negado |
| não autenticado | ler ou escrever avaliações | negado |
