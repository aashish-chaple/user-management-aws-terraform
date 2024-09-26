# Health Check RESTful API

This is a simple HealthCheck REST API built using **Node.js** and **Express**. The health check API allows us to monitor the health of the application instance and alert us when something is not working as expected. The health check API prevents us from sending traffic to unhealthy application instances and automatically replace/repair them. It also helps us improve user experience by not routing their quests to unhealthy instances.

## Features
- Health Check API (`/healthz`) to verify the health of the application.
- CORS support for cross-origin requests.
- JSON and URL-encoded data parsing.
- Easy-to-extend architecture for additional routes and services.

## Technologies
- **Node.js**: JavaScript runtime environment for server-side applications
- **Express.js**: Used for routing
- **PostgreSQL**: For Database
- **Sequelize**: ORM

## Prerequisites
Ensure that you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20.x or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- Environment variables configured in `.env` file (such as `PORT`, `HOST`, `DB_USER_NAME` etc).

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/cloudsheesh/webapp.git

### 2. Change the Directory

cd webapp

### 3. Install the dependencies

npm install

### 4: Set Up PostgreSQL Database
 
Make sure PostgreSQL is installed and running on your local machine. Create a database for the project:
 
psql
CREATE DATABASE webapp_db;
 
### 5: Configure Environment Variables
 
Create a `.env` file in the root of the project with the following environment variables:
 
DB_HOST=localhost
DB_USER=your_db_username
DB_PASS=your_db_password
DB_NAME=webapp_db
DB_PORT=5432
PORT=8080


### 6. Start the node server
npm start

### 7. Expected Output

GET /healthz:

- Returns a 200 OK if the application is healthy.
- Returns 503 Service Unavailable if the DB connection fails.
- Accepts no body or query parameters. If any payload is provided, it returns 400 Bad Request.

ALL /healthz:

- Returns 405 Method Not Allowed for any HTTP methods other than GET.