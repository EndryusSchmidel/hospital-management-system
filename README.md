🏥 Sistema de Gestão de Patrimônio Hospitalar
Backend robusto desenvolvido para o controle e rastreabilidade de ativos em ambientes de saúde. O sistema foca em segurança de dados e auditoria completa de cada alteração realizada nos equipamentos.

🛠️ Tecnologias Utilizadas
Java 17 & Spring Boot 3: Base do ecossistema backend.

Spring Data JPA & Hibernate: Persistência de dados eficiente.

Hibernate Envers: Implementado para garantir a auditoria e histórico de todas as movimentações de patrimônio.

Maven: Gerenciamento de dependências e build.

Lombok: Redução de código boilerplate.

Spring HATEOAS: Implementação de Hypermedia para tornar a API navegável e aderente aos padrões RESTful avançados.

🚀 Diferenciais Técnicos
Auditoria de Dados: Cada criação ou edição de patrimônio gera um rastro de auditoria automático, essencial para conformidade hospitalar.

Arquitetura em Camadas: Separação clara entre Controller, Service, Repository e DTO para facilitar a manutenção e escalabilidade.

Tratamento de Exceções: Implementação de RestExceptionHandler para respostas de erro padronizadas e profissionais.

HATEOAS (Hypermedia as the Engine of Application State): 
Os recursos da API incluem links de navegação automática (como links para o próprio recurso ou para coleções), facilitando o consumo pelo front-end e seguindo as melhores práticas do mercado.

📂 Estrutura do Projeto
PatrimonioController: Exposição dos endpoints REST.

PatrimonioService: Concentração da lógica de negócio e regras de auditoria.

PatrimonioRecordDto: Utilização de Java Records para transferência de dados imutável e segura.

🔧 Como Executar
Clone o repositório: git clone https://github.com/EndryusSchmidel/patrimonio-hospitalar.git

Certifique-se de ter o Java 17 instalado.

Execute o comando: ./mvnw spring-boot:run

