## Especificação funcional e técnica para desenvolvimento do MVP no Lovable

**Versão:** 1.0 — Especificação consolidada

---Plano de implementação — MoraJunto (MVP)
Todo o app em português brasileiro, com Lovable Cloud para login, dados e rotinas automáticas.
Pontos ambíguos e decisões propostas
Horizonte de geração das ocorrências: gerar com antecedência apenas o próximo ciclo (ex.: semana seguinte) por meio de uma rotina automática de hora em hora. Isso evita criar meses de ocorrências que ficariam desatualizadas se o rodízio mudar.
Prazo da ocorrência: a tarefa tem "duração do prazo" (ex.: diária = mesmo dia, semanal = 7 dias após a data prevista, mensal = fim do ciclo). Para tarefas únicas, o prazo é informado diretamente.
Status "atrasada": fica gravado (pendente → atrasada) pela mesma rotina automática e também é calculado na consulta. Assim aparece corretamente mesmo sem ninguém ter o app aberto.
Modalidade variável: o administrador escolhe o responsável de cada ocorrência. Por padrão, a nova ocorrência repete o último responsável escolhido.
Cancelar ocorrência: permitido somente a administradores, com justificativa registrada.
Administrador geral da plataforma: só a estrutura de papéis (tabela separada). Não haverá telas, conforme a prioridade do documento.
Categorias: 8 predefinidas e personalizadas por residência.
Recuperação de senha: por e-mail, usando o envio padrão do Cloud.
Saída voluntária: o morador pode sair sozinho. O último administrador fica bloqueado até promover outro.
Telas
Públicas: Início (problema, benefícios, como funciona, chamada para cadastro) e Planos (Gratuito / Premium R$ 19,90 por residência ao mês, sem cobrança real).
Acesso: Cadastro, Login, Esqueci a senha, Nova senha, Aceitar convite (/convite/:token e campo de código).
Primeira entrada: Criar residência ou Entrar com código.
Moradores: Painel, Minhas tarefas, Todas as tarefas, Calendário (dia/semana/mês), Indicadores (semanal/mensal/geral, sem ranking), Histórico, Perfil.
Administração da residência: Painel admin com alertas de reatribuição e atrasos; Tarefas (criar/editar/cancelar); Rodízio (ordem

# 1. INSTRUÇÃO GERAL AO LOVABLE

Atue como um desenvolvedor de software full-stack experiente, arquiteto de soluções, especialista em UX/UI e segurança de aplicações web.

Desenvolva uma aplicação web responsiva chamada **MoraJunto**, destinada a estudantes universitários que compartilham casas ou apartamentos, especialmente moradores de repúblicas estudantis.

A aplicação deverá permitir que os moradores organizem colaborativamente as tarefas domésticas, distribuam responsabilidades, estabeleçam rodízios e acompanhem a execução das atividades.

O objetivo é construir um MVP funcional, e não apenas um protótipo visual.

### Requisitos obrigatórios

1. Utilize o Lovable Cloud como infraestrutura de backend da aplicação.
2. Utilize os recursos do Lovable Cloud para autenticação, banco de dados e demais serviços necessários.
3. Não utilize banco de dados externo próprio, como Firebase ou outro serviço de backend contratado separadamente.
4. Não substitua funcionalidades reais por dados fictícios ou interações meramente visuais.
5. Implemente validações tanto na interface quanto no backend.
6. Garanta isolamento dos dados entre diferentes residências.
7. Implemente controle de acesso de acordo com os perfis e permissões definidos neste documento.
8. Desenvolva uma interface intuitiva, moderna, simples e responsiva.
9. Priorize a conclusão de um MVP funcional, evitando funcionalidades desnecessárias.
10. Não altere silenciosamente as regras de negócio especificadas neste documento.

Antes de iniciar a implementação, analise integralmente esta especificação, identifique eventuais ambiguidades técnicas e apresente um plano de implementação.

Não descarte requisitos para simplificar o desenvolvimento sem informar explicitamente.

---

# 2. CONTEXTO DO PRODUTO

## 2.1. Nome

MoraJunto.

## 2.2. Problema que o produto resolve

Estudantes universitários que compartilham uma residência frequentemente enfrentam dificuldades para organizar e dividir as tarefas domésticas.

A falta de definição clara de responsabilidades pode provocar:

- Distribuição desigual das atividades;
- Sobrecarga de alguns moradores;
- Esquecimento de tarefas;
- Atrasos na execução;
- Cobranças e conflitos;
- Falta de transparência sobre a participação de cada morador.

## 2.3. Proposta de valor

O MoraJunto oferece uma plataforma colaborativa para organizar tarefas domésticas, distribuir responsabilidades, estabelecer rodízios e acompanhar a participação dos moradores.

## 2.4. Público-alvo

Estudantes universitários que compartilham casas ou apartamentos, especialmente moradores de repúblicas estudantis.

## 2.5. Objetivo do MVP

Validar se moradores de uma residência compartilhada conseguem utilizar uma plataforma digital para organizar suas tarefas domésticas, distribuir responsabilidades e acompanhar a execução das atividades.

---

# 3. ARQUITETURA E TECNOLOGIA

Desenvolva uma aplicação web responsiva, acessível por navegadores em computadores, tablets e smartphones.

## 3.1. Backend

Utilize exclusivamente o Lovable Cloud como backend gerenciado da aplicação.

Utilize os recursos disponíveis para:

- Autenticação;
- Persistência de dados;
- Gerenciamento de usuários;
- Armazenamento, caso necessário;
- Operações de backend;
- Regras de acesso e autorização.

Não crie dependência de banco de dados externo próprio.

## 3.2. Organização da aplicação

Organize a aplicação em quatro áreas:

1. Área pública;
2. Área dos moradores;
3. Área administrativa da residência;
4. Área administrativa geral da plataforma, somente se sua implementação for compatível com o prazo e sem comprometer as funcionalidades essenciais do MVP.

## 3.3. Interface

A interface deverá apresentar:

- Design moderno e limpo;
- Navegação simples;
- Hierarquia visual clara;
- Boa legibilidade;
- Componentes consistentes;
- Feedback visual das ações;
- Estados de carregamento;
- Mensagens de sucesso e erro;
- Confirmação para operações importantes;
- Layout adaptado a dispositivos móveis.

Utilize português brasileiro em todos os textos da aplicação.

---

# 4. PERFIS DE USUÁRIO E PERMISSÕES

A aplicação deverá trabalhar com os seguintes perfis.

## 4.1. Administrador da residência

É o morador que possui permissões administrativas sobre a residência.

Uma residência poderá ter mais de um administrador.

Responsabilidades:

- Gerenciar informações da residência;
- Convidar novos moradores;
- Gerenciar participantes;
- Criar tarefas;
- Editar tarefas;
- Cancelar tarefas;
- Definir responsáveis;
- Configurar rodízios;
- Gerenciar recorrências;
- Consultar indicadores;
- Realizar reatribuições quando necessário;
- Gerenciar convites.

**Regra importante:** ser administrador não significa ter permissão para concluir uma tarefa atribuída a outro morador.

O administrador somente poderá concluir uma ocorrência quando também for o responsável por ela.

## 4.2. Morador

O morador possui permissões básicas.

Poderá:

- Consultar informações da residência;
- Visualizar os moradores;
- Consultar tarefas;
- Visualizar responsáveis;
- Consultar prazos;
- Visualizar o calendário;
- Acompanhar indicadores;
- Concluir ocorrências pelas quais seja responsável;
- Consultar seu histórico de atividades.

Não poderá:

- Criar tarefas;
- Atribuir tarefas;
- Alterar responsáveis;
- Administrar convites;
- Gerenciar outros moradores;
- Alterar configurações administrativas.

## 4.3. Administrador geral da plataforma

Se implementado, deverá possuir perfil separado dos administradores de residência.

Sua função será administrativa e operacional sobre a plataforma.

Não deverá ser confundido com o administrador de uma residência.

O acesso administrativo geral não deverá ser concedido automaticamente a usuários comuns.

Para o MVP, sua implementação é secundária. Priorize as funcionalidades de administração das residências.

---

# 5. CADASTRO, AUTENTICAÇÃO E ACESSO

Implemente:

- Cadastro de usuários;
- Login;
- Logout;
- Recuperação de senha, conforme os recursos disponíveis;
- Persistência da sessão;
- Proteção das rotas privadas.

Cada usuário deverá possuir uma conta individual.

O sistema deverá identificar o usuário autenticado e aplicar suas permissões em todas as operações.

## 5.1. Participação em residências

Um usuário poderá participar de apenas uma residência por vez.

Não permitir que um usuário ativo ingresse em uma segunda residência.

Caso deseje participar de outra residência, deverá primeiro encerrar sua participação na residência atual, respeitando as regras de saída.

A validação deverá ocorrer no backend, e não apenas na interface.

---

# 6. CRIAÇÃO DE RESIDÊNCIAS E CONVITES

## 6.1. Criação da residência

Um usuário autenticado poderá criar uma residência.

Na criação, deverá informar:

- Nome da residência;
- Descrição opcional;
- Informações básicas de identificação.

O usuário que criar a residência será automaticamente seu primeiro administrador.

Uma residência poderá possuir múltiplos administradores.

## 6.2. Convites de moradores

O administrador poderá convidar moradores por dois mecanismos:

1. Link compartilhável;
2. Código exclusivo de convite.

Os dois mecanismos deverão permitir o ingresso de novos moradores na residência.

## 6.3. Regras dos convites

Cada convite deverá possuir:

- Identificação interna;
- Residência associada;
- Código ou token exclusivo;
- Data de criação;
- Data de validade;
- Limite de utilizações;
- Quantidade de utilizações;
- Situação do convite;
- Identificação do administrador que o criou.

Os convites deverão:

- Possuir validade configurável;
- Respeitar o limite de utilizações;
- Poder ser revogados pelo administrador;
- Não permitir utilização após a expiração;
- Não permitir utilização após a revogação;
- Não permitir duplicidade de participação;
- Não permitir que o mesmo usuário ingresse em duas residências;
- Ser validados no backend.

O código de convite não poderá ser utilizado como identificador interno da residência.

## 6.4. Fluxo de ingresso

1. O administrador gera o convite.
2. O administrador compartilha o link ou código.
3. O interessado acessa o link ou informa o código.
4. Caso não tenha conta, realiza o cadastro.
5. Caso já possua conta, autentica-se.
6. O sistema valida o convite.
7. O sistema verifica se o usuário já participa de outra residência.
8. Se todas as condições forem atendidas, o usuário ingressa na residência.
9. O sistema registra a participação.

Apresente mensagens claras para convites inválidos, expirados, revogados ou esgotados.

---

# 7. GESTÃO DE MORADORES

O administrador deverá possuir uma tela para consultar os moradores da residência.

Cada participante deverá apresentar:

- Nome;
- E-mail, quando apropriado;
- Perfil;
- Data de ingresso;
- Situação da participação.

O administrador poderá:

- Consultar participantes;
- Promover um morador a administrador;
- Remover privilégios administrativos;
- Encerrar a participação de um morador.

## 7.1. Saída de morador

Quando um morador sair da residência:

1. Sua participação deverá ser encerrada.
2. Seu acesso aos dados privados da residência deverá ser revogado.
3. Seu histórico de atividades deverá ser preservado.
4. Ele deverá ser removido dos participantes dos rodízios futuros.
5. O sistema deverá identificar ocorrências pendentes ou atrasadas atribuídas a ele.
6. O administrador deverá receber uma indicação de que existem ocorrências que precisam de reatribuição.

A reatribuição das ocorrências abertas será manual e realizada pelo administrador.

O sistema não deverá escolher automaticamente outro responsável.

**Regra de proteção:** uma residência deverá manter pelo menos um administrador ativo. Não permitir a saída ou remoção do último administrador sem que outro seja designado previamente.

---

# 8. CADASTRO E GERENCIAMENTO DE TAREFAS

Somente administradores poderão criar e atribuir tarefas.

Cada tarefa deverá possuir os seguintes campos:

- Nome;
- Descrição;
- Categoria;
- Nível de esforço;
- Frequência;
- Modalidade de atribuição;
- Responsável, quando aplicável;
- Data inicial;
- Prazo;
- Situação;
- Histórico.

## 8.1. Categorias

Permitir categorias de tarefas, como:

- Limpeza;
- Cozinha;
- Banheiro;
- Organização;
- Lavanderia;
- Lixo;
- Áreas comuns;
- Outras.

Permitir o uso de categorias predefinidas e, se viável, personalizadas.

## 8.2. Nível de esforço

Cada tarefa deverá possuir um nível de esforço:

| Nível | Pontuação |
|---|---:|
| Baixo | 1 |
| Médio | 2 |
| Alto | 3 |

Essa pontuação será utilizada no cálculo dos indicadores de participação.

## 8.3. Frequência

Permitir os seguintes tipos:

- Única;
- Diária;
- Semanal;
- Mensal.

## 8.4. Modalidade de atribuição

Permitir três modalidades:

**Fixa:** a tarefa será atribuída a um responsável definido pelo administrador.

**Variável:** o administrador poderá definir ou alterar o responsável de cada ocorrência.

**Rodízio:** o sistema distribuirá as ocorrências sequencialmente entre os participantes configurados.

A atribuição deverá ser definida pelo administrador.

---

# 9. OCORRÊNCIAS DAS TAREFAS

Uma tarefa recorrente deverá possuir uma estrutura de ocorrências independentes.

A tarefa representa a definição da atividade.

A ocorrência representa uma execução específica daquela atividade.

Exemplo:

Tarefa: Limpar o banheiro.

Frequência: Semanal.

Ocorrências:

- Semana 1: João;
- Semana 2: Maria;
- Semana 3: Pedro;
- Semana 4: Ana.

Cada ocorrência deverá possuir:

- Identificador próprio;
- Tarefa de origem;
- Responsável único;
- Data prevista;
- Prazo;
- Status;
- Data de conclusão, quando aplicável;
- Histórico de alterações.

**Regra obrigatória:** cada ocorrência poderá possuir somente um responsável ativo por vez.

Não permitir atribuição simultânea da mesma ocorrência a vários moradores.

---

# 10. REGRAS DE RECORRÊNCIA

As tarefas recorrentes deverão gerar ocorrências independentes.

## 10.1. Funcionamento

Ao criar uma tarefa recorrente, o sistema deverá gerar suas ocorrências conforme a frequência definida.

A conclusão de uma ocorrência não deverá concluir automaticamente as demais.

Cada ocorrência deverá possuir seu próprio status.

## 10.2. Geração automática

A geração de novas ocorrências não poderá depender de o usuário abrir a aplicação.

Utilize um mecanismo confiável de backend ou agendamento disponível no Lovable Cloud.

O sistema deverá evitar a geração duplicada de ocorrências.

A operação deverá ser idempotente: executar novamente o processo não poderá criar uma segunda ocorrência para o mesmo ciclo da tarefa.

Cada ocorrência deverá possuir uma referência única ao ciclo de recorrência correspondente, permitindo identificar se aquela execução já foi gerada.

A geração de ocorrências deverá respeitar a data inicial, a frequência e o cancelamento da tarefa.

## 10.3. Cancelamento de recorrência

Quando o administrador cancelar uma tarefa recorrente:

- Não deverão ser geradas novas ocorrências futuras;
- As ocorrências já existentes deverão ser preservadas;
- As ocorrências concluídas deverão manter seu histórico;
- As ocorrências pendentes deverão continuar disponíveis para tratamento;
- O cancelamento deverá ser registrado no histórico.

O cancelamento deverá afetar somente as ocorrências futuras.

---

# 11. REGRAS DO RODÍZIO

O rodízio deverá distribuir as ocorrências entre os moradores participantes.

## 11.1. Ordem sequencial

O sistema deverá manter uma sequência de participantes.

Exemplo:

1. João;
2. Maria;
3. Pedro;
4. Ana.

A distribuição seguirá essa ordem, retornando ao primeiro participante após o último.

## 11.2. Avanço do rodízio

A regra definida é:

**O rodízio avança na criação da próxima ocorrência, independentemente de a ocorrência anterior ter sido concluída.**

Isso significa que:

- A criação da primeira ocorrência atribui o primeiro responsável;
- A criação da segunda ocorrência atribui o próximo responsável;
- A criação da terceira ocorrência atribui o seguinte;
- A conclusão da ocorrência não controla o avanço do rodízio.

Não aguardar a conclusão de uma tarefa para avançar a sequência.

A atualização da posição do rodízio e a criação da ocorrência deverão ser executadas de maneira consistente, evitando atribuições duplicadas ou saltos na sequência em situações de execução simultânea.

## 11.3. Alterações no rodízio

Alterações na composição do rodízio deverão respeitar as ocorrências já atribuídas.

Uma alteração futura não deverá modificar automaticamente responsáveis de ocorrências existentes.

Quando um morador sair da residência:

- Ele deverá ser removido das próximas distribuições;
- Ocorrências já atribuídas a ele deverão ser preservadas;
- Ocorrências abertas deverão ser tratadas pelo administrador;
- A reatribuição será manual.

## 11.4. Histórico

Registrar alterações relevantes no rodízio, incluindo:

- Inclusão de participantes;
- Remoção de participantes;
- Mudanças na sequência;
- Alterações administrativas.

---

# 12. CONCLUSÃO DAS TAREFAS

A conclusão deverá obedecer a uma regra rígida de autorização.

**Somente o responsável pela ocorrência poderá concluí-la.**

O administrador não poderá concluir uma ocorrência atribuída a outro morador.

O administrador poderá concluir uma ocorrência somente quando ele próprio for o responsável.

## 12.1. Ao concluir uma ocorrência

O sistema deverá:

- Alterar o status para concluída;
- Registrar a data e hora;
- Registrar o usuário responsável pela conclusão;
- Atualizar os indicadores de participação;
- Registrar o evento no histórico.

## 12.2. Reabertura

Permitir que uma ocorrência concluída seja reaberta por um administrador, mediante registro da justificativa e da ação no histórico.

Ao reabrir:

- O status deverá retornar a pendente ou atrasada, conforme o prazo;
- A pontuação anteriormente contabilizada deverá deixar de compor os indicadores de conclusão;
- Uma nova conclusão deverá ser necessária para voltar a pontuar.

A reabertura não deverá apagar o histórico anterior.

---

# 13. TAREFAS ATRASADAS

Uma ocorrência será considerada atrasada quando seu prazo tiver sido ultrapassado e ela ainda não estiver concluída ou cancelada.

As tarefas atrasadas deverão permanecer visíveis até que sejam tratadas.

Não remover automaticamente tarefas atrasadas.

Não concluir tarefas atrasadas automaticamente.

Não alterar o rodízio em razão do atraso.

O sistema deverá permitir que o administrador consulte as ocorrências atrasadas e tome as providências necessárias.

A ocorrência poderá ser:

- Concluída pelo responsável;
- Reatribuída pelo administrador;
- Cancelada, quando permitido pelas regras da tarefa.

O histórico deverá preservar as alterações realizadas.

A classificação como atrasada deverá ser atualizada de maneira consistente, mesmo quando nenhum usuário estiver com a aplicação aberta.

---

# 14. STATUS DAS TAREFAS E OCORRÊNCIAS

Utilizar os seguintes status:

| Status | Significado |
|---|---|
| Pendente | Ocorrência aguardando execução. |
| Concluída | Ocorrência finalizada pelo responsável. |
| Atrasada | Prazo ultrapassado sem conclusão. |
| Cancelada | Ocorrência cancelada conforme ação autorizada. |

O status atrasada deverá ser determinado a partir do prazo e do estado da ocorrência, sem apagar sua condição de pendência.

As alterações de status deverão respeitar as permissões definidas.

Uma ocorrência cancelada não deverá gerar pontos nos indicadores.

---

# 15. INDICADORES DE PARTICIPAÇÃO E EQUILÍBRIO

Criar uma área de indicadores que permita acompanhar a participação dos moradores nas tarefas domésticas.

O objetivo é proporcionar transparência e estimular uma distribuição mais equilibrada das responsabilidades.

**Não transformar os indicadores em ranking competitivo ou mecanismo de punição.**

## 15.1. Pontuação por esforço

Cada ocorrência concluída contribuirá com a pontuação de esforço definida para sua tarefa:

- Baixo: 1 ponto;
- Médio: 2 pontos;
- Alto: 3 pontos.

Somente ocorrências concluídas deverão gerar pontos.

Ocorrências pendentes, atrasadas ou canceladas não deverão pontuar.

## 15.2. Indicador individual

Apresentar:

- Quantidade de ocorrências concluídas;
- Pontuação total acumulada;
- Participação percentual no total de pontos concluídos;
- Histórico por período.

## 15.3. Indicador coletivo

Apresentar:

- Total de tarefas concluídas pela residência;
- Pontuação total acumulada;
- Participação de cada morador;
- Distribuição das responsabilidades concluídas.

## 15.4. Cálculo da participação

Calcular a participação percentual de cada morador da seguinte forma:

Pontuação individual do morador dividida pela soma das pontuações de todos os moradores, multiplicada por 100.

Exemplo:

- João: 10 pontos;
- Maria: 20 pontos;
- Pedro: 10 pontos;
- Total: 40 pontos.

Participação:

- João: 25%;
- Maria: 50%;
- Pedro: 25%.

Quando não houver pontos acumulados, apresentar uma mensagem informando que ainda não existem dados suficientes.

## 15.5. Períodos de consulta

Permitir consulta:

- Semanal;
- Mensal;
- Histórico geral.

## 15.6. Cuidados de interpretação

O indicador representa participação nas tarefas concluídas, ponderada pelo esforço estimado.

Não afirmar que ele mede perfeitamente a justiça ou a dificuldade real de cada atividade.

Não utilizar a pontuação como ranking ou instrumento de constrangimento.

A pontuação deverá ser calculada a partir das ocorrências e seus registros de conclusão, evitando duplicidade de contabilização.

---

# 16. DASHBOARD DA RESIDÊNCIA

Criar um painel principal para os moradores.

O dashboard deverá apresentar:

- Nome da residência;
- Quantidade de moradores;
- Tarefas pendentes;
- Tarefas concluídas;
- Tarefas atrasadas;
- Próximas tarefas;
- Responsáveis;
- Próximos prazos;
- Indicadores de participação.

O dashboard deverá permitir que os usuários identifiquem rapidamente o que precisa ser feito.

## 16.1. Dashboard do administrador

Além das informações gerais, deverá apresentar:

- Acesso ao gerenciamento de moradores;
- Gestão de convites;
- Cadastro e edição de tarefas;
- Gerenciamento de rodízios;
- Ocorrências que exigem reatribuição;
- Tarefas atrasadas;
- Configurações da residência.

## 16.2. Dashboard do morador

Deverá priorizar:

- Minhas tarefas;
- Próximos prazos;
- Tarefas pendentes;
- Tarefas concluídas;
- Histórico pessoal;
- Indicadores de participação.

As informações administrativas não deverão aparecer como ações disponíveis para moradores comuns.

---

# 17. CALENDÁRIO E VISUALIZAÇÃO DAS TAREFAS

Criar uma tela de calendário para visualizar as ocorrências.

Permitir consulta por:

- Dia;
- Semana;
- Mês.

Cada ocorrência deverá apresentar:

- Nome da tarefa;
- Responsável;
- Data prevista;
- Prazo;
- Status.

Utilizar distinção visual clara entre ocorrências pendentes, concluídas e atrasadas.

O calendário deverá refletir as informações reais armazenadas no backend.

---

# 18. TELAS DA APLICAÇÃO

Implementar, no mínimo, as seguintes telas.

## 18.1. Área pública

**Página inicial**

Apresentar:

- Nome e identidade visual do MoraJunto;
- Explicação do problema;
- Benefícios da plataforma;
- Como funciona;
- Principais funcionalidades;
- Chamada para cadastro ou acesso.

**Página de planos**

Apresentar a proposta freemium:

- Plano gratuito;
- Plano premium;
- Benefícios de cada modalidade.

O plano premium poderá exibir o preço hipotético de R$ 19,90 por residência ao mês.

Não implementar cobrança real neste MVP.

## 18.2. Área de autenticação

- Cadastro;
- Login;
- Recuperação de senha;
- Aceitação de convite.

## 18.3. Área dos moradores

- Dashboard;
- Minhas tarefas;
- Todas as tarefas;
- Calendário;
- Indicadores;
- Histórico;
- Perfil do usuário.

## 18.4. Área administrativa da residência

- Dashboard administrativo;
- Gerenciamento de tarefas;
- Cadastro de tarefas;
- Edição de tarefas;
- Gerenciamento de rodízios;
- Gerenciamento de moradores;
- Convites;
- Ocorrências atrasadas;
- Reatribuição de ocorrências;
- Configurações da residência.

---

# 19. MODELO DE DADOS

Estruture o banco de dados de forma consistente, com relacionamentos e integridade referencial.

As entidades principais deverão contemplar:

## 19.1. profiles

Dados complementares dos usuários.

Campos sugeridos:

- id;
- nome;
- email;
- created_at;
- updated_at.

O identificador deverá estar relacionado ao usuário autenticado.

## 19.2. households

Dados das residências.

Campos sugeridos:

- id;
- nome;
- descrição;
- created_at;
- updated_at.

## 19.3. memberships

Relacionamento entre usuários e residências.

Campos sugeridos:

- id;
- household_id;
- user_id;
- role;
- status;
- joined_at;
- left_at.

Restringir a participação ativa de um usuário a uma única residência.

## 19.4. invitations

Convites para ingresso nas residências.

Campos sugeridos:

- id;
- household_id;
- token ou código exclusivo;
- created_by;
- expires_at;
- usage_limit;
- usage_count;
- status;
- created_at;
- revoked_at.

## 19.5. categories

Categorias de tarefas.

Campos sugeridos:

- id;
- household_id, quando personalizada;
- nome;
- descrição;
- created_at.

## 19.6. tasks

Definições das tarefas.

Campos sugeridos:

- id;
- household_id;
- nome;
- descrição;
- category_id;
- effort_level;
- effort_points;
- frequency;
- assignment_mode;
- start_date;
- due_date, quando aplicável;
- recurrence_configuration;
- status;
- created_by;
- created_at;
- updated_at;
- cancelled_at.

## 19.7. task_occurrences

Ocorrências independentes das tarefas.

Campos sugeridos:

- id;
- task_id;
- household_id;
- responsible_user_id;
- scheduled_date;
- due_date;
- recurrence_key;
- status;
- completed_at;
- completed_by;
- created_at;
- updated_at.

Cada ocorrência deverá ter um único responsável.

A combinação da tarefa de origem e da referência do ciclo de recorrência deverá impedir a criação duplicada da mesma ocorrência.

## 19.8. rotation_participants

Participantes dos rodízios.

Campos sugeridos:

- id;
- task_id;
- user_id;
- position;
- active;
- created_at;
- updated_at.

A posição atual do rodízio deverá ser armazenada de maneira consistente, para impedir saltos ou duplicações.

## 19.9. activity_logs

Registro de atividades importantes.

Campos sugeridos:

- id;
- household_id;
- user_id;
- entity_type;
- entity_id;
- action;
- previous_value;
- new_value;
- created_at.

## 19.10. platform_roles

Perfis administrativos gerais da plataforma, caso implementados.

Campos sugeridos:

- id;
- user_id;
- role;
- created_at.

Os nomes e tipos definitivos poderão ser ajustados às convenções técnicas do Lovable Cloud, preservando todos os relacionamentos e requisitos de negócio.

---

# 20. SEGURANÇA E CONTROLE DE ACESSO

A segurança deverá ser implementada desde o início.

## 20.1. Autenticação

- Proteger todas as áreas privadas;
- Verificar a identidade do usuário no backend;
- Não confiar apenas em informações armazenadas no navegador;
- Impedir operações de usuários não autenticados.

## 20.2. Isolamento das residências

Cada residência deverá possuir dados isolados.

Um usuário de uma residência não poderá consultar, alterar ou excluir informações de outra residência.

Aplicar políticas de acesso no banco de dados e nas operações de backend.

## 20.3. Autorização

Validar no backend as permissões de:

- Administradores;
- Moradores;
- Administradores gerais, se implementados.

Não confiar exclusivamente na ocultação de botões ou telas.

## 20.4. Conclusão de tarefas

O backend deverá verificar se o usuário autenticado é o responsável pela ocorrência antes de permitir a conclusão.

Não permitir que um administrador conclua uma ocorrência atribuída a outro morador.

## 20.5. Convites

Validar no backend:

- Existência do convite;
- Validade;
- Situação;
- Limite de utilização;
- Residência associada;
- Elegibilidade do usuário;
- Ausência de participação ativa em outra residência.

O consumo do convite deverá ser protegido contra uso concorrente que ultrapasse seu limite.

## 20.6. Dados e segredos

- Não expor chaves privadas;
- Não armazenar senhas em tabelas próprias;
- Não expor dados sensíveis desnecessariamente;
- Utilizar mecanismos seguros de autenticação;
- Proteger operações administrativas;
- Validar entradas;
- Registrar ações administrativas importantes.

---

# 21. EXPERIÊNCIA DO USUÁRIO

A aplicação deverá ser simples o suficiente para que uma república consiga começar a utilizá-la sem treinamento.

Priorizar:

- Cadastro rápido;
- Criação simples da residência;
- Convite fácil dos moradores;
- Cadastro intuitivo de tarefas;
- Visualização clara de responsabilidades;
- Conclusão simples das atividades;
- Indicadores compreensíveis.

Utilizar mensagens objetivas.

Exemplos:

- "Residência criada com sucesso."
- "Convite gerado."
- "Você já participa de uma residência."
- "Tarefa concluída."
- "Você não é o responsável por esta tarefa."
- "Esta tarefa está atrasada."
- "Existem tarefas que precisam ser reatribuídas."

Evitar mensagens técnicas para usuários finais.

---

# 22. ESCOPO FORA DO MVP

Não implementar nesta primeira versão, salvo se houver tempo sem comprometer os requisitos essenciais:

- Aplicativos nativos para Android e iOS;
- Integração com WhatsApp;
- Chat interno;
- Divisão de despesas;
- Inteligência artificial para distribuição de tarefas;
- Pagamentos e assinaturas reais;
- Notificações push avançadas;
- Integrações externas complexas.

A reatribuição de tarefas após a saída de moradores será manual pelo administrador.

A cobrança premium será apenas demonstrativa, sem integração de pagamento.

---

# 23. CRITÉRIOS DE ACEITAÇÃO E TESTES

A implementação somente deverá ser considerada funcional quando os seguintes cenários forem testados.

## 23.1. Cadastro e autenticação

- Um usuário consegue criar uma conta.
- Um usuário consegue realizar login.
- Um usuário consegue encerrar sua sessão.
- Rotas privadas exigem autenticação.

## 23.2. Residências

- Um usuário consegue criar uma residência.
- O criador torna-se administrador.
- Uma residência pode ter múltiplos administradores.
- Um usuário não consegue participar de duas residências simultaneamente.

## 23.3. Convites

- O administrador consegue gerar link.
- O administrador consegue gerar código.
- Um convidado consegue ingressar usando convite válido.
- Convites expirados são recusados.
- Convites revogados são recusados.
- Limites de utilização são respeitados.

## 23.4. Permissões

- O administrador consegue criar tarefas.
- O morador não consegue criar tarefas.
- O administrador consegue atribuir responsáveis.
- O morador não consegue alterar responsáveis.
- Um administrador não consegue concluir tarefa atribuída a outro morador.
- O responsável consegue concluir sua ocorrência.

## 23.5. Recorrência

- Tarefas únicas geram uma ocorrência.
- Tarefas recorrentes geram ocorrências independentes.
- A conclusão de uma ocorrência não conclui as próximas.
- Não são geradas ocorrências duplicadas.
- O cancelamento impede novas ocorrências futuras.
- Ocorrências anteriores são preservadas.
- A geração de ocorrências não depende da abertura da aplicação.

## 23.6. Rodízio

- O rodízio distribui ocorrências sequencialmente.
- O rodízio avança na criação da próxima ocorrência.
- O avanço não depende da conclusão da ocorrência anterior.
- Alterações futuras não modificam atribuições já realizadas.
- A saída de morador o remove das distribuições futuras.
- A criação simultânea de ocorrências não provoca duplicidade ou avanço incorreto da sequência.

## 23.7. Atrasos e reatribuição

- Ocorrências vencidas e não concluídas aparecem como atrasadas.
- Ocorrências atrasadas permanecem visíveis.
- O atraso não altera o rodízio.
- A saída de morador identifica ocorrências abertas.
- O administrador consegue realizar reatribuição manual.

## 23.8. Indicadores

- Somente ocorrências concluídas pontuam.
- A pontuação respeita os níveis de esforço.
- A participação percentual é calculada corretamente.
- A reabertura retira a pontuação da ocorrência até nova conclusão.
- A consulta semanal e mensal apresenta resultados coerentes.
- Uma ocorrência não é contabilizada mais de uma vez.

## 23.9. Segurança

- Um usuário não acessa dados de outra residência.
- Um morador não executa operações administrativas.
- Um convite inválido não permite ingresso.
- O backend verifica as permissões.
- Dados e segredos não são expostos indevidamente.
- A saída de um morador revoga seu acesso à residência.

## 23.10. Responsividade

- A aplicação funciona em computadores.
- A aplicação funciona em tablets.
- A aplicação funciona em smartphones.
- Os elementos de navegação e formulários permanecem utilizáveis em telas pequenas.

---

# 24. DIRETRIZES DE IMPLEMENTAÇÃO NO LOVABLE

Implemente o projeto em etapas, preservando a consistência da arquitetura.

Ordem recomendada:

1. Estrutura visual e identidade do produto;
2. Autenticação;
3. Criação e gerenciamento de residências;
4. Convites e ingresso de moradores;
5. Perfis e permissões;
6. Cadastro e gerenciamento de tarefas;
7. Ocorrências e recorrências;
8. Rodízios;
9. Conclusão e histórico;
10. Dashboard e indicadores;
11. Segurança e isolamento de dados;
12. Testes e ajustes responsivos.

Não avance para funcionalidades complexas antes de validar as etapas fundamentais.

Sempre que uma funcionalidade for implementada:

- Verifique seu funcionamento;
- Teste os fluxos principais;
- Confira as permissões;
- Corrija erros identificados;
- Preserve funcionalidades que já estejam funcionando.

Não substitua funcionalidades existentes por versões simplificadas sem informar.

Não considere uma funcionalidade concluída apenas porque sua tela foi criada. Ela deverá estar conectada ao backend e executar as operações reais previstas.

Se algum requisito não puder ser implementado com os recursos disponíveis, informe:

- Qual requisito não foi atendido;
- Qual limitação foi encontrada;
- Qual alternativa técnica foi proposta;
- Qual impacto a alternativa terá no comportamento do produto.

Não invente resultados de testes.

---

# 25. REVISÃO FINAL OBRIGATÓRIA

Antes de considerar o MVP concluído, realize uma revisão integral da aplicação.

Verifique:

1. Se todos os requisitos funcionais foram implementados;
2. Se as regras de negócio foram respeitadas;
3. Se os perfis e permissões funcionam corretamente;
4. Se as operações persistem os dados;
5. Se as ocorrências recorrentes são geradas corretamente;
6. Se o rodízio avança conforme definido;
7. Se a conclusão respeita o responsável único;
8. Se os indicadores utilizam somente ocorrências concluídas;
9. Se o isolamento entre residências está funcionando;
10. Se não existem erros críticos de segurança;
11. Se as telas funcionam em dispositivos móveis;
12. Se os fluxos principais podem ser executados sem intervenção técnica.

Apresente um relatório final contendo:

- Funcionalidades implementadas;
- Funcionalidades parcialmente implementadas;
- Funcionalidades não implementadas;
- Problemas encontrados;
- Correções realizadas;
- Testes executados;
- Limitações conhecidas.

Não declare que uma funcionalidade foi implementada ou testada sem que isso tenha sido efetivamente verificado.

---

# 26. RESULTADO ESPERADO

Entregar uma aplicação web funcional, responsiva e publicada, que permita a uma república estudantil:

- Criar sua residência;
- Convidar moradores;
- Gerenciar participantes;
- Cadastrar tarefas domésticas;
- Distribuir responsabilidades;
- Organizar rodízios;
- Acompanhar ocorrências;
- Registrar conclusões;
- Visualizar atrasos;
- Consultar indicadores de participação.

O resultado deverá ser um MVP utilizável por uma residência real, com dados persistidos, autenticação, permissões e isolamento entre residências.

**Prioridade máxima:** provar que o MoraJunto resolve, de maneira simples e funcional, o problema de organização e distribuição das tarefas domésticas em residências compartilhadas.

Não priorize quantidade de funcionalidades em detrimento do funcionamento correto das funcionalidades essenciais.

**Instrução final:** ao concluir a implementação, apresente claramente o que foi efetivamente construído, o que foi testado e o que ainda depende de trabalho adicional. A existência de uma tela ou botão não deve ser considerada prova de que a funcionalidade está operacional.
