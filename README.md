# 🏥 HMS - Hospital Management System (v1.0)
### **Gestão Estratégica, Auditoria Crítica e Conformidade Hospitalar**

<div align="center">
  <video src="https://github.com/user-attachments/assets/4590457b-ab1b-472a-89b9-d79d37247ef0" 
    width="100%" 
    autoplay 
    loop 
    muted 
    playsinline 
    style="border-radius: 12px; border: 1px solid #334155;">
  </video>
  
  <p align="center">
    <br />
    <a href="https://hospital-management-system-gilt-kappa.vercel.app/"><strong>🌐 Explorar Demo Online</strong></a>
    &nbsp; • &nbsp;
    <a href="https://hospital-management-system-7gyi.onrender.com/swagger-ui/index.html"><strong>📖 Documentação da API</strong></a>
    &nbsp; • &nbsp;
    <a href="https://www.linkedin.com/in/endryus-schmidel"><strong>💼 LinkedIn do Autor</strong></a>
  </p>
</div>

---

## 💡 A Visão do Projeto
Em ambientes hospitalares, a disponibilidade de um ativo (como um desfibrilador ou respirador) é uma questão de vida ou morte. O **HMS** foi projetado para ir além de um simples inventário; ele é uma ferramenta de **compliance e governança**. 

O sistema resolve três dores críticas:
1. **Rastreabilidade Total:** Quem alterou o quê e quando? (Auditoria via Hibernate Envers).
2. **Visibilidade Financeira:** Qual o valor patrimonial alocado por setor em tempo real?
3. **Segurança de Dados:** Controle rigoroso de acesso (RBAC) em conformidade com as diretrizes da LGPD para sistemas administrativos.

---

## 🚀 Diferenciais de Engenharia

### 🛡️ Backend: Robustez e Auditoria (Java 21 & Spring Boot 3.4)
*   **Auditoria de Dados (Audit Trail):** Implementação do **Hibernate Envers** para manter um histórico imutável de todas as entidades. Desenvolvi uma lógica customizada no `PatrimonioService` para recuperar dados de itens deletados, garantindo que nenhum rastro de informação seja perdido.
*   **Segurança Stateless:** Autenticação via **JWT (JSON Web Tokens)** com controle de acesso baseado em Roles (`ADMIN`, `USER`, `VISITANTE`).
*   **Arquitetura Limpa:** Uso de **Java Records** para DTOs imutáveis e `@ControllerAdvice` para um tratamento de exceções global e padronizado.
*   **Documentação Viva:** Swagger/OpenAPI configurado para suportar testes autenticados diretamente pela interface.

### 🎨 Frontend: UX Premium e Performance (React & TypeScript)
*   **Advanced Theme Engine:** Arquitetura de CSS baseada em **Variáveis Globais** (não apenas utilitários), permitindo um Dark Mode nativo, persistente e performático.
*   **Reatividade de Dados:** Integração com **Chart.js** utilizando `MutationObserver` para garantir que os gráficos se adaptem às mudanças de tema sem necessidade de recarregar a página.
*   **Design Responsivo "Smart":** Substituição de tabelas tradicionais por **Cards Expansíveis** em dispositivos móveis, priorizando a usabilidade do técnico em campo.
*   **Interceptadores de Resiliência:** Axios configurado para gerenciar automaticamente expiração de tokens e erros de permissão (401/403), mantendo o fluxo do usuário fluido.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.4, Spring Security, JPA/Hibernate, Envers, Maven |
| **Frontend** | React (Vite), TypeScript, CSS Variables, Lucide React, Axios, Chart.js |
| **Database** | PostgreSQL |
| **DevOps/Infra** | Docker, Render (API), Vercel (Web), GitHub Actions |
| **Relatórios** | OpenPDF (iText) para exportação de inventários |

---

## 📂 Destaques do Código (Deep Dive)

### Auditoria de Itens Deletados
Diferente de implementações básicas, o HMS consegue consultar o banco de auditoria para reconstruir o estado de um patrimônio que já não existe na tabela principal:
```java
// Exemplo da lógica implementada no PatrimonioService
public List<PatrimonioHistoryDTO> getFullHistory(Long id) {
    AuditReader reader = AuditReaderFactory.get(entityManager);
    // Recupera todas as revisões, incluindo a de deleção
    List<Number> revisions = reader.getRevisions(PatrimonioModel.class, id);
    // ... lógica de mapeamento para Timeline do Frontend
}
```

---

## 🔧 Instalação e Execução

### Pré-requisitos
* Java 21
* Node.js 18+
* PostgreSQL rodando localmente ou via Docker

### Setup Rápido
1. **Clone e Backend:**
   ```bash
   git clone https://github.com/seu-usuario/hms-backend
   cd hms-backend
   # Configure o application.properties com seu DB
   ./mvnw spring-boot:run
   ```

2. **Frontend:**
   ```bash
   cd hms-frontend
   npm install
   npm run dev
   ```

---

## 👨‍💻 Autor e Contato

**Endryus Schmidel** - *Software Engineer Intern / ADS Student*

<p align="left">
  <a href="https://www.linkedin.com/in/endryus-schmidel">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="mailto:endryus.dev@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
</p>
