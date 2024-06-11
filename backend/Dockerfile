# @author Kaan Tural
# Use the official OpenJDK 21 image as a parent image
FROM openjdk:21-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and project files
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml .

# Copy the source code
COPY src ./src

# Ensure the Maven wrapper is executable
RUN chmod +x mvnw

# Package the application without running tests
RUN ./mvnw clean package -DskipTests

# Expose the port the application runs on
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "target/husksheets-api-server-scrumlords-0.0.1-SNAPSHOT.jar"]