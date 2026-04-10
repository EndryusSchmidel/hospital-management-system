# --- Etapa 1: Build (Aumentamos para Java 21) ---
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# 💡 Estratégia de Cache: Copiamos o pom.xml primeiro e baixamos as dependências.
# Isso evita baixar tudo de novo se você só mudar uma linha de código Java.
COPY pom.xml .
RUN mvn dependency:go-offline

# Agora copiamos o código fonte e buildamos
COPY src ./src
RUN mvn clean package -DskipTests

# --- Etapa 2: Runtime (Uso de JRE para ser mais leve) ---
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copiamos apenas o JAR gerado na etapa anterior
# 💡 Dica: Usamos um wildcard (*) caso o nome do seu projeto mude um pouco
COPY --from=build /app/target/*.jar app.jar

# Configuração de performance para containers
ENV JAVA_OPTS="-Xmx512M -Xms256M"

EXPOSE 8080

# Rodando com flags de otimização
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]