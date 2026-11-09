# Modelo de dados: Projeto

Caminho: `groups/{groupId}/projects/{projectId}` (ID automático).

Este modelo é compartilhado pelas F02 (leitura), F03 e F04 (leitura e subcoleção `evaluations`).

## Campos gravados pelo cadastro público

| Campo | Tipo | Regra | Origem na spec |
| --- | --- | --- | --- |
| `title` | string | 3–100, sem espaços nas pontas | Nome da solução/empresa |
| `description` | string | 30–1.000 | Descrição da solução |
| `problem` | string | 30–1.000 | Problema ou oportunidade |
| `proponentName` | string | 3–120 | Nome completo |
| `proponentEmail` | string | ≤ 254, formato de e-mail, minúsculas | E-mail |
| `proponentProfile` | enum | `student`, `ufjf-staff`, `faculty`, `general-public`, `company` | Perfil |
| `partecArea` | enum | `health`, `logistics`, `it`, `creative-economy`, `agrifood`, `energy`, `none` | Área PARTEC-JF |
| `stage` | enum | `ideation`, `prototyping`, `mvp-validation`, `operation`, `traction`, `scale` | Estágio |
| `mvpStatus` | enum | `yes`, `no`, `validating` | Possui MVP validado |
| `mvpLink` | string (opcional) | ≤ 500, começa com `http://` ou `https://`; obrigatório se `mvpStatus == 'yes'` | Link do MVP |
| `consentAt` | timestamp | hora do servidor | Aceites LGPD e declaração (FR-007) |
| `createdAt` | timestamp | hora do servidor | FR-008 |
| `createdBy` | string | sempre `'public-form'` | FR-008 |

Os dois aceites são obrigatórios no formulário. Como só é possível enviar com ambos marcados,
grava-se apenas `consentAt`, a data e hora do aceite.

## Projetos do seed (existentes)

`{ title, description, createdBy: 'seed', createdAt }`. Os demais campos estão ausentes e a
interface os exibe como "Não informado".

## Rótulos (PT-BR)

| Valor | Rótulo |
| --- | --- |
| `student` | Estudante |
| `ufjf-staff` | TAE ou terceirizado da UFJF |
| `faculty` | Docente |
| `general-public` | Sociedade em geral |
| `company` | Pessoa jurídica (exceto MEI e sem fins lucrativos) |
| `health` | Saúde e Bem-Estar |
| `logistics` | Logística e Transportes |
| `it` | Tecnologia da Informação |
| `creative-economy` | Economia Criativa |
| `agrifood` | Agroalimentar |
| `energy` | Sistemas Elétricos e Energia |
| `none` | Nenhuma das áreas prioritárias |
| `ideation` … `scale` | Ideação, Prototipação, MVP em validação, Operação, Tração, Escala |
| `yes` / `no` / `validating` | Sim / Não / Em fase de validação |

## Ciclo de vida

Os projetos só são criados, pelo cadastro público ou pelo seed. Não há edição nem exclusão no
miniapp.
