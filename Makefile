# @author Kaan Tural
# Define variables
BACKEND_DIR = ./backend
FRONTEND_DIR = ./client
DOCKER_IMAGE_NAME = RedLightScrumLords

# Phony targets
.PHONY: all test build docker clean

# Default target
all: build

# Backend targets
backend-deps:
	cd $(BACKEND_DIR) && ./mvnw clean install

backend-build: backend-deps
	cd $(BACKEND_DIR) && ./mvnw clean package -DskipTests

backend-run: backend-build
	cd $(BACKEND_DIR) && java -jar target/husksheets-api-server-scrumlords-0.0.1-SNAPSHOT.jar

backend-test:
	cd $(BACKEND_DIR) && ./mvnw test

# Frontend targets
frontend-deps:
	cd $(FRONTEND_DIR) && npm install

frontend-build: frontend-deps
	cd $(FRONTEND_DIR) && npm run build

frontend-run: frontend-build
	cd $(FRONTEND_DIR) && npm run dev

frontend-test:
	cd $(FRONTEND_DIR) && npm test

# Docker targets
docker-backend:
	cd $(BACKEND_DIR) && docker build -t $(DOCKER_IMAGE_NAME)-backend .

docker-frontend:
	cd $(FRONTEND_DIR) && docker build -t $(DOCKER_IMAGE_NAME)-frontend .

docker: docker-backend docker-frontend

# Test all
test: backend-test frontend-test

# Build all
build: backend-build frontend-build

# Clean targets
clean:
	cd $(BACKEND_DIR) && ./mvnw clean
	cd $(FRONTEND_DIR) && rm -rf node_modules
	cd $(FRONTEND_DIR) && rm -rf .next
