# Usa Java 17
FROM eclipse-temurin:17-jdk

# Diretório dentro do container
WORKDIR /app

# Copia os arquivos
COPY . .

# Permite rodar o mvnw
RUN chmod +x mvnw

# Builda o projeto
RUN ./mvnw clean package -DskipTests

# Porta usada pela aplicação
EXPOSE 8080

# Comando para rodar o backend
CMD ["java", "-jar", "target/projeto-hospital-0.0.1-SNAPSHOT.jar"]
