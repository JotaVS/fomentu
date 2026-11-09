# Instruções do projeto

- Toda documentação criada ou alterada neste projeto DEVE ser escrita em português brasileiro (PT-BR), incluindo títulos, explicações, comentários e documentação técnica.
- Preserve no idioma original identificadores de código, comandos, nomes oficiais e citações ou trechos externos quando a tradução prejudicar sua precisão; explique o contexto em PT-BR.
- `src/` contém o código do frontend da aplicação, incluindo a interface administrativa em
  `src/admin/`. `functions/` contém o backend. A pasta `admin/` na raiz contém apenas scripts de
  gestão da oficina e não é a interface administrativa nem parte do frontend.

- Antes de trabalhar, leia `.specify/memory/constitution.md`,
  `specs/001-base-do-treinamento/spec.md`, `docs/features-draft.md` e os ADRs em `docs/adr/`.
- Considere os ADRs existentes no planejamento. Os grupos podem registrar novas decisões, incluindo
  a de IA, e devem seguir a organização por área definida no ADR 003.
- Use os componentes do Mantine nas interfaces, conforme o ADR 004, e mantenha o tema compartilhado.
- Atualize o estado das tarefas da base apenas com evidências de implementação e verificação.
- As quatro funcionalidades dos rascunhos são o exercício dos participantes; não as entregue prontas
  durante a preparação da base.
- Na especificação, prefira perguntar ao usuário sobre os detalhes e critérios de aceite antes de
  considerar a especificação pronta; registre as respostas e explicite premissas que permanecerem.
- Não misture especificação e planejamento: especifique o que deve acontecer e por quê; defina como
  implementar e as decisões técnicas no planejamento.
- Não implemente o sistema durante a especificação ou o planejamento. A implementação ocorre na
  etapa própria, após o planejamento.
- Não implemente testes de segurança das Security Rules do Firebase durante a oficina: os grupos
  de estudantes compartilham o mesmo banco e esse esforço não é prioridade da atividade.
- Na etapa de tarefas, gere no máximo quatro tarefas por funcionalidade. Para cada tarefa, preveja
  no máximo dois testes de integração no navegador, selecionando os cenários mais relevantes.
