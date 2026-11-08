# ADR 002 — Estratégia de testes da oficina

**Estado:** aceito para a base do treinamento.

## Contexto

Os grupos precisam verificar os critérios de aceite durante uma oficina curta, com testes repetíveis
que não dependam de dados de outros grupos nem de respostas variáveis de um serviço externo.

## Opções consideradas

1. Validar apenas manualmente, ao final da implementação.
2. Combinar testes automatizados em partes e no navegador com uma conferência manual.

## Decisão

Adotar a segunda opção. Usar Vitest para testes locais, Playwright para fluxos no navegador e os
emuladores Firebase para os testes que precisam de autenticação ou banco isolados. Escolher testes
com base nos critérios de aceite definidos pelo grupo.

Na oficina, escrever os testes de um comportamento antes da implementação e confirmar que falham
pelo motivo esperado. Implementar por partes, executar os testes relacionados e conferir se os que
já passavam continuam verdes. Alterar um teste revisado somente quando o grupo identificar e revisar
um problema nele. Ao final, executar os testes e verificar um caso de borda manualmente.

Quando houver testes de IA, usar respostas simuladas para resultados determinísticos e verificar a
integração real separadamente. Os testes do fluxo completo devem incluir um projeto criado pela
aplicação, não depender somente do seed.

## Consequências

- A base já contém testes de isolamento e de entrada no navegador; eles não cobrem as quatro
  funcionalidades que os participantes construirão.
- Os comandos existentes, capturas e requisitos dos emuladores estão no README principal.
- Atualmente o Vitest descobre `tests/**/*.test.ts`. A configuração ainda não está preparada para
  descobrir `.test.tsx`, e não há biblioteca de testes de componentes instalada.
- O serviço real de IA ainda não foi configurado. Testar uma simulação não comprova a integração real.
