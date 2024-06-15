# Husksheets

<img src="husksheets_logo.jpeg" alt="HuskSheets Logo" width="300"/>

### THE solution to YOUR everyday Spreadsheeting Needs! 

#### a creation of: team #redlight
- **Arinjay Singh**
- **Troy Caron**
- **Kaan Tural**
- **Parnika Jain**
- **Nicholas O'Sullivan**

---

## Installation
To get started with HuskSheets, follow these steps:

### Prerequisites
- Docker
- Node.js and npm
- Java (JDK 17+)
- Maven

### Clone the Repository
```bash
git clone [repository link]
cd husksheets
```

### Backend Setup
```bash
cd backend
./mvnw clean install
./mvnw clean package -DskipTests
```

### Frontend Setup
```bash
cd client
npm install
npm run build
```

## Usage
To run the application locally, use the following commands:

### Running the Backend
```bash
cd backend
java -jar target/husksheets-api-server-scrumlords-0.0.1-SNAPSHOT.jar
```

### Running the Frontend, 2 options:
```bash
cd client
./client.js --url --name --password --publisher --sheet #streamlined startup to spreadsheet editor
```

#### or 
```bash
cd client
npm run dev 
```
##### ex: ./client.js --url="https://husksheets.fly.dev/api/v1" --name="alice" --password="ert*hdu4GGwkw89" --publisher="alice" --sheet="S15"
The sheet will not open immediately, it requires the user to press the "Load" button.
## Makefile Commands
The Makefile provides a set of commands to streamline various tasks. Here are the available targets:

### Default Target
```bash
make
```
Builds both the backend and frontend.

### Backend Targets
```bash
make backend-deps      # Install backend dependencies
make backend-build     # Build the backend
make backend-run       # Run the backend
make backend-test      # Run backend tests
```

### Frontend Targets
```bash
make frontend-deps     # Install frontend dependencies
make frontend-build    # Build the frontend
make frontend-run      # Run the frontend
make frontend-test     # Run frontend tests
```

### Docker Targets
```bash
make docker-backend    # Build the backend Docker image
make docker-frontend   # Build the frontend Docker image
make docker-run-backend # Run the backend in a Docker container
make docker-run-frontend # Run the frontend in a Docker container
make docker-test-backend # Run backend tests in Docker
make docker-test-frontend # Run frontend tests in Docker
make docker-contain    # Build both backend and frontend Docker images
make docker-run        # Run both backend and frontend Docker containers
make docker-test       # Run tests for both backend and frontend in Docker
```

### Miscellaneous Targets
```bash
make create-env-file   # Create .env.local file for setting client local environment
make clean             # Clean the project
make docker-clean      # Stop and remove Docker containers
```

## Configuration
### Environment Variables
The project uses environment variables for configuration. Create a `.env.local` file in the `client` directory for frontend configuration. Example:
```env
NEXT_PUBLIC_URL=https://your-backend-url
NEXT_PUBLIC_NAME=your-username
NEXT_PUBLIC_PASSWORD=your-password
NEXT_PUBLIC_PUBLISHER=your-publisher-name
NEXT_PUBLIC_SHEET=your-sheet-name
```

## Contributing
We welcome contributions (After we unfreeze our Repository)! Please follow these steps to contribute:
1. Fork the repository.
2. Run some given make commands and get a feel for the code.
3. Create a new branch for your feature or bug fix.
4. Commit your changes.
5. Push to your branch.
6. Create a pull request.
7. Wait for review! It might take a while though...

## License
😉 No License

## Acknowledgements
Special thanks to our team members and course staff for their support and guidance throughout this project.

---

## Project Overview
The course project is a distributed collaborative spreadsheet application called Husksheets. It consists of:
1. A server with a persistent store.
2. A client able to create and open spreadsheets.
3. A user interface that displays sheets and allows editing them.

You are to design and implement Husksheets following best software engineering practices.

### Server Specification V1
The Husksheet Server accepts REST API requests from clients. The following endpoints are supported:
- `register()`
- `getPublishers()`
- `createSheet(Argument)`
- `getSheets(Argument)`
- `deleteSheet(Argument)`
- `getUpdatesForSubscription(Argument)`
- `getUpdatesForPublished(Argument)`
- `updatePublished(Argument)`
- `updateSubscription(Argument)`

Where `Result` is a JSON object returned by the REST call, and `Argument` is an object provided in the body of the request.

### Sheet Update
A sheet is a set of cells indexed by references. Cells can have numeric or character values, or can hold formulas that determine how the value of the cell is computed.

A Ref (or reference) is a string like `$A1` that consists of three parts: `$`, `A`, `1`. The first part is a mandatory dollar sign, followed by a column identifier and a row identifier.

An Update is a newline-separated sequence of `(Ref, Term)` pairs, where a Term can be either a value or a formula. For example:
```
$A1 1
$a2 "help"
$B1 -1.01
$C4 ""
$c1 = SUM($A1:$B1)
```
