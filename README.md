# MoraJunto — Organização colaborativa de tarefas domésticas

## 1. A dor escolhida e por que ela vale um negócio

### O problema

Estudantes universitários que compartilham casas ou apartamentos, especialmente moradores de repúblicas estudantis, enfrentam dificuldades para organizar e dividir as tarefas domésticas.

Atividades como limpar os ambientes, retirar o lixo, lavar a louça e organizar espaços comuns precisam ser realizadas continuamente. Entretanto, muitas vezes não existe uma definição clara de quem é responsável por cada atividade ou quando ela deve ser executada.

Essa falta de organização pode provocar:

- Sobrecarga de alguns moradores;
- Distribuição desigual das responsabilidades;
- Esquecimento de tarefas;
- Cobranças e discussões entre moradores;
- Dificuldade para acompanhar o que já foi realizado.

### A oportunidade de negócio

O problema representa uma oportunidade porque é recorrente, acontece em um contexto de convivência coletiva e exige algum tipo de organização contínua.

O MoraJunto propõe uma plataforma digital colaborativa que permite cadastrar tarefas domésticas, distribuir responsabilidades e acompanhar a conclusão das atividades.

A proposta de valor é simples: **ajudar moradores a dividir melhor as tarefas domésticas, reduzir esquecimentos e melhorar a convivência na residência.**

O público-alvo inicial são estudantes universitários que moram em repúblicas ou compartilham uma residência com outros estudantes.

O modelo de negócio considerado é o freemium: funcionalidades básicas gratuitas e recursos adicionais em um plano premium, com preço hipotético inicial de R$ 19,90 por residência ao mês. A cobrança não faz parte do MVP implementado.

### Pesquisa exploratória: hipóteses iniciais

Para estruturar o projeto, foi utilizada uma simulação educacional de pesquisa com 15 estudantes universitários. Os números abaixo são hipotéticos e não representam entrevistas ou respostas reais.

| Questão simulada | Resultado |
|---|---:|
| Relataram dificuldades na divisão das tarefas | 86,7% |
| Relataram conflitos relacionados às tarefas | 73,3% |
| Relataram esquecimentos de tarefas | 66,7% |
| Demonstraram interesse em rodízio automático | 80% |
| Declararam que usariam um aplicativo compartilhado | 80% |

Esses resultados servem apenas para formular hipóteses. A validação real deverá ocorrer por meio de entrevistas, testes com repúblicas e observação do uso do MVP.

---

## 2. Tamanho de mercado — TAM, SAM e SOM

O dimensionamento abaixo é uma estimativa inicial, construída com premissas ilustrativas para o exercício de validação do negócio.

Como referência de contexto, considera-se o número de matrículas presenciais na graduação no Brasil. Esse número não corresponde diretamente à quantidade de estudantes que moram em repúblicas.

### Premissas utilizadas

- Base de referência: aproximadamente 5 milhões de matrículas presenciais na graduação;
- Percentual hipotético de estudantes que compartilham moradia: 10%;
- Parcela inicialmente atendível pelo produto: 20% do mercado potencial;
- Participação inicial pretendida: 1% do mercado atendível;
- Média hipotética: quatro moradores por residência;
- Preço premium hipotético: R$ 19,90 por residência ao mês.

### Estimativa de mercado

| Indicador | Usuários potenciais | Residências estimadas |
|---|---:|---:|
| TAM | 503.748 | 125.937 |
| SAM | 100.750 | 25.188 |
| SOM | 1.008 | 252 |

**TAM — Total Addressable Market:** representa o mercado potencial total estimado de estudantes que compartilham moradia.

**SAM — Serviceable Available Market:** representa a parcela do mercado que o MoraJunto pretende atender inicialmente.

**SOM — Serviceable Obtainable Market:** representa uma meta inicial hipotética de participação no mercado atendível.

### Receita potencial ilustrativa

Considerando 252 residências no plano premium, ao preço de R$ 19,90 por mês:

- Receita mensal estimada: R$ 5.014,80;
- Receita anual estimada: R$ 60.177,60.

Esses valores não representam faturamento previsto ou validado. São cenários ilustrativos baseados nas premissas adotadas.

---

## 3. Business Model Canvas

| Bloco | Descrição |
|---|---|
| **Segmentos de clientes** | Estudantes universitários, moradores de repúblicas e jovens que compartilham apartamentos. |
| **Proposta de valor** | Organizar tarefas domésticas, distribuir responsabilidades e acompanhar o cumprimento das atividades. |
| **Canais** | Aplicação web, redes sociais, grupos universitários, centros acadêmicos e indicação entre estudantes. |
| **Relacionamento com clientes** | Autoatendimento, criação de residência, entrada de moradores por código e suporte digital. |
| **Fontes de receita** | Plano gratuito e plano premium por residência, com preço inicial hipotético de R$ 19,90 mensais. |
| **Recursos principais** | Plataforma digital, infraestrutura em nuvem, banco de dados, marca e equipe de desenvolvimento. |
| **Atividades principais** | Desenvolvimento e manutenção, gestão de usuários, evolução do produto, aquisição de clientes e suporte. |
| **Parcerias principais** | Universidades, centros acadêmicos, diretórios estudantis, comunidades universitárias e influenciadores. |
| **Estrutura de custos** | Desenvolvimento, hospedagem, manutenção, marketing, comunicação e atendimento. |

---

## 4. A tese que o MVP testa

### Tese central

Acreditamos que estudantes universitários que compartilham uma residência precisam de uma maneira simples e transparente de organizar as tarefas domésticas.

Nossa hipótese é que uma plataforma colaborativa que permita cadastrar atividades, distribuir responsabilidades e acompanhar as tarefas concluídas poderá melhorar a organização da residência e reduzir conflitos entre moradores.

O MVP busca verificar se os moradores conseguem utilizar a plataforma em conjunto, se retornam para acompanhar e concluir tarefas e se percebem valor suficiente para continuar utilizando o serviço.

### Principais hipóteses a validar

1. A divisão de tarefas domésticas é um problema recorrente nas repúblicas estudantis.
2. A distribuição desigual de responsabilidades provoca insatisfação e conflitos.
3. Os moradores demonstram interesse em utilizar uma plataforma compartilhada.
4. A atribuição clara de responsáveis facilita a organização das atividades.
5. O acompanhamento das tarefas concluídas melhora a transparência.
6. Uma residência consegue adotar a plataforma com a participação de vários moradores.
7. Parte dos usuários estaria disposta a pagar por recursos adicionais.

### O que o MVP efetivamente oferece

O MVP implementado é uma versão simplificada, concentrada nas funcionalidades essenciais para testar a organização colaborativa das tarefas domésticas.

- Cadastro, autenticação e acesso de usuários;
- Criação de uma residência pelo usuário administrador;
- Entrada de outros moradores por código de acesso;
- Visualização dos moradores da residência;
- Cadastro e gerenciamento de tarefas;
- Atribuição de um único responsável para cada tarefa;
- Definição de prazo e nível de esforço da tarefa;
- Visualização de tarefas pendentes, atrasadas e concluídas;
- Conclusão de tarefas pelo respectivo responsável;
- Registro da data e hora da conclusão;
- Painel com indicadores de tarefas e participação;
- Indicador de equilíbrio baseado nas tarefas concluídas e ponderadas pelo esforço.

### O que não faz parte desta versão

Para manter o MVP simples e concentrado na validação da proposta central, foram deixadas fora desta implementação:

- Tarefas recorrentes;
- Rodízio automático de responsabilidades;
- Geração automática de ocorrências;
- Reabertura de tarefas concluídas;
- Cancelamento avançado de tarefas recorrentes;
- Notificações automáticas;
- Relatórios avançados;
- Integração com pagamentos;
- Aplicativo nativo para celular;
- Chat interno;
- Divisão de despesas;
- Distribuição de tarefas por inteligência artificial.

A intenção é testar primeiro se a organização colaborativa das tarefas resolve um problema real antes de investir em funcionalidades adicionais.

---

## 5. Mega prompt utilizado na criação do MVP

O desenvolvimento do MoraJunto foi planejado com auxílio do ChatGPT. A especificação funcional foi transformada em um mega prompt em Markdown para orientar a construção da aplicação na plataforma Lovable.

O documento de planejamento original definiu aspectos como:

- Objetivo e proposta de valor do produto;
- Público-alvo e perfis de usuários;
- Funcionalidades da área pública e da área dos moradores;
- Criação de residências e entrada de moradores;
- Cadastro, atribuição e conclusão de tarefas;
- Indicadores de participação;
- Regras de acesso e permissões;
- Estrutura de dados;
- Requisitos de segurança;
- Critérios de aceitação.

O mega prompt original está disponível neste repositório:

[`documentacao/mega-prompt-morajunto.md`](documentacao/mega-prompt-morajunto.md)

**Observação:** o mega prompt registra o planejamento original do produto. O escopo efetivamente implementado no MVP é a versão simplificada descrita na seção 4 deste README.

---

## 6. Decisões funcionais e simplificações do MVP

Durante o planejamento e o refinamento da especificação, foram estabelecidas regras para o funcionamento do MoraJunto.

Na implementação simplificada, foram mantidas as seguintes regras:

| Tema | Regra implementada |
|---|---|
| Administração da residência | O criador da residência assume o papel de administrador. |
| Participação em residências | Cada usuário pode participar de uma residência por vez. |
| Atribuição de tarefas | Somente o administrador cadastra e atribui tarefas. |
| Responsável pela tarefa | Cada tarefa possui um único responsável. |
| Conclusão de tarefas | Somente o responsável pode concluir sua própria tarefa. |
| Edição de tarefas | O administrador pode editar tarefas enquanto estiverem pendentes. |
| Tarefas atrasadas | Permanecem identificadas como atrasadas enquanto não forem concluídas. |
| Pontuação | O esforço é classificado em baixo, médio ou alto, correspondendo a 1, 2 ou 3 pontos. |
| Indicador de equilíbrio | Considera as tarefas concluídas, ponderadas pelo esforço. |

As funcionalidades de recorrência, rodízio automático e gerenciamento avançado de ocorrências, previstas no planejamento original, não foram implementadas nesta versão.

A simplificação foi uma decisão de escopo para viabilizar a construção e a publicação de um MVP funcional, priorizando as operações essenciais do produto.

---

## 7. Tecnologias e publicação

- **Plataforma de desenvolvimento:** Lovable;
- **Backend:** Lovable Cloud;
- **Autenticação e persistência de dados:** recursos do Lovable Cloud;
- **Controle de versão e repositório de código:** GitHub.

**Aplicação publicada:**  
https://morajuntobrasil.lovable.app/

**Repositório GitHub:**  
https://github.com/alebramar/mora-junto

O aplicativo está publicado para demonstração e testes do MVP.

---

## 8. Evidências do funcionamento

Esta seção reúne evidências reais da aplicação implementada, demonstrando suas principais funcionalidades.

As capturas de tela deverão ser incluídas após a realização e organização dos registros da aplicação.

Sugestão de evidências:

1. Página inicial;
2. Cadastro e login;
3. Painel principal da residência;
4. Cadastro e gerenciamento de tarefas;
5. Lista de tarefas pendentes, atrasadas e concluídas;
6. Indicadores de participação e equilíbrio;
7. Administração dos moradores;
8. Aplicação em dispositivo móvel.

As imagens devem demonstrar a aplicação efetivamente executando, e não apenas telas conceituais ou protótipos.

---

## 9. Considerações finais

O MoraJunto foi concebido para testar uma oportunidade de negócio relacionada à organização das tarefas domésticas em residências compartilhadas.

O MVP prioriza a validação da proposta central: permitir que moradores organizem suas responsabilidades de forma colaborativa, transparente e simples.

A versão implementada contempla a criação de residências, o gerenciamento de tarefas, a atribuição de responsáveis, o acompanhamento de prazos e a visualização da participação dos moradores.

A evolução do produto dependerá dos resultados dos testes com usuários reais, da frequência de utilização e da disposição dos moradores em pagar por funcionalidades adicionais.
