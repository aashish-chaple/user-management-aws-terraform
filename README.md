# Cloud Web Application

This is a simple cloud-based web application built using **Node.js** and **Express**. It provides essential API endpoints to ensure that the application is up and running. The application includes health check routes and other basic functionalities for cloud service readiness. It is designed to be scalable and deployable on cloud platforms.

## Features
- Health Check API (`/healthz`) to verify the health of the application.
- CORS support for cross-origin requests.
- JSON and URL-encoded data parsing.
- Easy-to-extend architecture for additional routes and services.

## Technologies
- **Node.js**: JavaScript runtime environment for server-side applications.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **dotenv**: Module to load environment variables from a `.env` file.

## Prerequisites
Ensure that you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20.x or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- Environment variables configured in `.env` file (such as `PORT`).

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/cloudsheesh/webapp.git

cd webapp

### 2. Install the dependencies

npm install

### 3. Start the node server
npm start

### 4. Expected Output

GET /healthz:

- Returns a 200 OK if the application is healthy.
- Returns 503 Service Unavailable if the DB connection fails.
- Accepts no body or query parameters. If any payload is provided, it returns 400 Bad Request.

ALL /healthz:

- Returns 405 Method Not Allowed for any HTTP methods other than GET.