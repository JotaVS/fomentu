# Verificação rápida: Consultar projetos (F02)

## Testes automatizados

```bash
yarn test
```

```bash
yarn test:e2e:emulador
```

## Verificação manual

1. Com os emuladores e o setup de teste executados, entre como `grupo01@fomentu.com`.
2. Abra **Projetos** e confira a ordem por data, a contagem e os selos.
3. Aplique "Área: Saúde e Bem-Estar" mais "Sem parecer humano", abra um projeto e volte. Os filtros
   devem continuar aplicados.
4. Abra um projeto do seed e confira a etiqueta "Exemplo" e os campos "Não informado".
5. Caso de borda manual (ADR 002): acesse `/admin/projetos/nao-existe` e confira "Projeto não
   encontrado".
6. Abra o menu **Avaliação com IA** e confira que ele leva à lista filtrada por "Sem análise de IA".
