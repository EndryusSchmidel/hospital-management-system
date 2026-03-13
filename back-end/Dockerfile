# Etapa 1 - Build com Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2 - Rodar aplicação
FROM eclipse-temurin:17-jdk

WORKDIR /app
COPY --from=build /app/target/projeto-hospital-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
