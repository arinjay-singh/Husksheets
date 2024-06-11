# @author Kaan Tural
# Define variables
BACKEND_DIR = ./backend
FRONTEND_DIR = ./client
BACKEND_IMAGE_NAME = redlightscrumlords-backend
FRONTEND_IMAGE_NAME = redlightscrumlords-frontend
BACKEND_CONTAINER_NAME = backend-container
FRONTEND_CONTAINER_NAME = frontend-container

# Phony targets
.PHONY: all test build docker docker-test docker-clean clean

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
	cd $(FRONTEND_DIR)/test && npm install && npm test

# Docker targets
docker-backend:
	cd $(BACKEND_DIR) && docker build -t $(BACKEND_IMAGE_NAME) .

docker-frontend:
	cd $(FRONTEND_DIR) && docker build -t $(FRONTEND_IMAGE_NAME) .

docker-run-backend:
	docker run --name $(BACKEND_CONTAINER_NAME) -d -p 8080:8080 $(BACKEND_IMAGE_NAME)

docker-run-frontend:
	docker run --name $(FRONTEND_CONTAINER_NAME) -d -p 3000:3000 $(FRONTEND_IMAGE_NAME)

docker-test-backend:
	docker run --rm $(BACKEND_IMAGE_NAME) ./mvnw test

docker-test-frontend:
	docker run --rm $(FRONTEND_IMAGE_NAME) /bin/sh -c "cd /app/test && npm install && npm test"

docker-contain: docker-backend docker-frontend

docker-run: docker-run-backend docker-run-frontend

docker-test: docker-test-backend docker-test-frontend

docker: docker-run docker-test

# Test all
test: backend-test frontend-test

# Run all
run: backend-run frontend-run

# Build all
build: backend-build frontend-build

# Clean targets
clean:
	cd $(BACKEND_DIR) && ./mvnw clean
	cd $(FRONTEND_DIR) && rm -rf node_modules
	cd $(FRONTEND_DIR) && rm -rf .next

# Stop and remove containers
docker-clean:
	docker stop $(BACKEND_CONTAINER_NAME) $(FRONTEND_CONTAINER_NAME) || true
	docker rm $(BACKEND_CONTAINER_NAME) $(FRONTEND_CONTAINER_NAME) || true