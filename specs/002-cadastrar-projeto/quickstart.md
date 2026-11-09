# Verificação rápida: Cadastrar projeto (F01)

## Configuração

Em `.env.local`, defina o grupo do site:

```bash
VITE_GROUP_ID=group-01
```

## Testes automatizados

```bash
yarn test:firebase
```

```bash
yarn test:e2e:emulador
```

## Verificação manual

1. Rode `yarn firebase:emuladores` em um terminal e, em outro, `yarn dev` com
   `VITE_USE_EMULATORS=true`.
2. Abra `/cadastro` sem login, envie o formulário vazio e confira as mensagens em cada campo.
3. Marque "Possui MVP validado: Sim" sem link e confira o bloqueio.
4. Preencha tudo e envie. A mensagem de sucesso deve aparecer e o formulário deve ser limpo.
5. Na interface do emulador (`http://127.0.0.1:4000`), confira o documento em
   `groups/group-01/projects`, com `createdBy: 'public-form'` e as datas do servidor.
6. Caso de borda manual (ADR 002): remova `VITE_GROUP_ID`, reinicie o `yarn dev` e confira a
   mensagem de site não configurado.
