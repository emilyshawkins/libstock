# Libstock Senior Project

A full-stack library management system with Stripe payments, built with Java Spring Boot (backend) and React (frontend).

---

## Project Structure

```
libstock_backend/    # Java Spring Boot backend
libstock_frontend/   # React frontend
```

---

## Prerequisites

- **Java 17+** (for backend)
- **Node.js 16+ & npm** (for frontend)
- **MongoDB** (running locally or update connection string)
- **Stripe account** (for payment integration)

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone <your-github-repo-url>
cd libstock
```

---

### 2. Install & Run Backend

```sh
cd libstock_backend
./gradlew bootRun
```
The backend will start on [http://localhost:8080](http://localhost:8080).

---

### 3. Install & Run Frontend

```sh
cd libstock_frontend
npm install
npm start
```
The frontend will start on [http://localhost:3000](http://localhost:3000).

---

## Usage

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8080](http://localhost:8080)
- Make sure MongoDB is running before starting the backend.