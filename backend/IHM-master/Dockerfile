# ---- Build Stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# Copy pom and source code
COPY pom.xml .
COPY src ./src
# Build the jar without running tests
RUN mvn -B clean package -DskipTests

# ---- Runtime Stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy the jar from the builder stage
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
