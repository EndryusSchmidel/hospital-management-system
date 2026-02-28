🏥  Sistema de Gestão de Patrimônio Hospitalar (Full Stack)
    Solução completa para controle e rastreabilidade de ativos, contando com um Dashboard Administrativo em React e um Backend robusto em Java.

🖥️  Tecnologias Frontend
* **React + Vite**: Base para uma interface rápida e reativa.
* **CSS Modules**: Estilização organizada e sem conflitos de classes.
* **Lucide React**: Biblioteca de ícones profissionais.
* **Componentização**: Estrutura dividida em Modais, Sidebars e Tabelas para alta manutenção.
  
🛠️ Tecnologias Backend
* **Java 17 & Spring Boot 3**: Base do ecossistema backend.
* **Spring Data JPA & Hibernate**: Persistência de dados eficiente.
* **Hibernate Envers**: Implementado para garantir a auditoria e histórico de todas as movimentações de patrimônio.
* **Maven**: Gerenciamento de dependências e build.
* **Lombok**: Redução de código boilerplate.
* **Spring HATEOAS**: Implementação de Hypermedia para tornar a API navegável e aderente aos padrões RESTful avançados.

🚀 Diferenciais Técnicos
**Auditoria de Dados**: Cada criação ou edição de patrimônio gera um rastro de auditoria automático, essencial para conformidade hospitalar.

**Arquitetura em Camadas**: Separação clara entre Controller, Service, Repository e DTO para facilitar a manutenção e escalabilidade.

**Tratamento de Exceções**: Implementação de RestExceptionHandler para respostas de erro padronizadas e profissionais.

**HATEOAS** (Hypermedia as the Engine of Application State): 

Os recursos da API incluem links de navegação automática (como links para o próprio recurso ou para coleções), facilitando o consumo pelo front-end e seguindo as melhores práticas do mercado.

📂 Estrutura do Projeto
**PatrimonioController**: Exposição dos endpoints REST.

**PatrimonioService**: Concentração da lógica de negócio e regras de auditoria.

**PatrimonioRecordDto**: Utilização de Java Records para transferência de dados imutável e segura.

## 🔧 Como Executar

### 1. Backend (Java)
* Clone o repositório e acesse a pasta do backend.
* Certifique-se de ter o Java 17 e o PostgreSQL rodando.
* Execute: `./mvnw spring-boot:run`.

### 2. Frontend (React)
* Acesse a pasta `front-end`.
* Execute `npm install` para baixar as dependências.
* Execute `npm run dev` para iniciar o Dashboard em `localhost:5173`.

