# ADR 004 — Interface com Mantine

**Estado:** aceito para a oficina.

## Contexto

Os grupos precisam montar interfaces consistentes no tempo limitado da oficina, mantendo a
identidade visual do Fomentu e evitando a criação de componentes básicos do zero.

## Opções consideradas

1. Criar componentes e estilos manualmente.
2. Usar shadcn/ui com Tailwind CSS e manter os componentes no projeto.
3. Usar Mantine, com componentes prontos e tema configurável.

## Decisão

Usar Mantine como biblioteca visual obrigatória nas interfaces da aplicação. Ao construir ou
alterar telas, utilizar seus componentes para campos, botões, tabelas, alertas e demais elementos
disponíveis. Componentes específicos devem ser compostos a partir do Mantine e organizados por
área, conforme o ADR 003.

O tema compartilhado fica em `src/shared/theme.ts`. A área administrativa e o login usam
componentes Mantine; o CSS existente preserva o layout e a identidade visual da base. As telas
existentes podem ser migradas gradualmente conforme forem alteradas.

## Consequências

- Os grupos podem importar componentes prontos e focar nas funcionalidades.
- O tema permite manter cores e estilo coerentes entre as telas.
- Campos, validações, telas e critérios das quatro funcionalidades continuam a cargo dos grupos.
