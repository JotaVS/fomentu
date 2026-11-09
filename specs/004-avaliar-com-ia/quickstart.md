# Verificação rápida: Avaliar com IA (F03)

## Testes automatizados (sem consumir a IA real)

```bash
yarn test:firebase
```

```bash
yarn test:e2e:emulador
```

## Verificação manual no modo simulado

1. Com o emulador de Functions e `AI_MODE=mock`, entre no grupo e abra um projeto.
2. Gere uma análise. A prévia deve mostrar o texto simulado com o selo "Análise de IA simulada" e
   o aviso fixo.
3. Descarte, gere de novo e salve. A análise deve aparecer no histórico.
4. Gere mais uma vez e confira a confirmação de consumo de cota.
5. Caso de borda manual (ADR 002): com a prévia aberta, tente sair da página e confira o aviso.

## Verificação da integração real (separada)

Quando o instrutor configurar o provedor:

1. Gere análises para 3 projetos variados, incluindo um do seed e um criado pelo cadastro.
2. Confira o selo "Análise de IA", o modelo, os cinco critérios e a ausência de notas ou decisões
   (SC-004).
3. Registre o resultado e eventuais respostas fora do formato. Enquanto não houver integração
   real, registre a verificação como **pendente**.
