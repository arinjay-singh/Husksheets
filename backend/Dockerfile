FROM openjdk:21-jdk

WORKDIR /app

COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml .
COPY src ./src

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/husksheets-api-server-scrumlords-0.0.1-SNAPSHOT.jar"]