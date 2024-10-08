const request = require("supertest");
const configureApp = require("../app").default;
const { sequelize } = require("../../db");
const bcrypt = require("bcrypt");
import { User } from "../models/userModel";

let appServer;
let app;
let userId;
let basicAuthHeader;

beforeAll(async () => {
  app = configureApp(); // Get the configured app instance
  appServer = app.listen();

  // Create a user for testing
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const user = await User.create({
    email: "testuser@gmail.com",
    password: passwordHash,
    first_name: "Test",
    last_name: "User",
  });

  userId = user.id;

  // Basic auth header for testing
  const credentials = Buffer.from("testuser@gmail.com:Password123!").toString(
    "base64"
  );
  basicAuthHeader = `Basic ${credentials}`; // Fixing the syntax for the header
});

afterAll(async () => {
  console.log("sequelize: " + sequelize);
  await sequelize.close();
  if (appServer) {
    appServer.close(); // Close the server
  }
});

/* Assignment 1 */

// Test for successful health check
describe("Test 1 | HealthCheck Success", () => {
  it("Expect 200 for success", async () => {
    const res = await request(app).get("/healthz");
    expect(res.statusCode).toEqual(200);
  });
});

// Test for unsuccessful health check (mocking database connection failure)
describe("Test 2 | HealthCheck Database Unavailable", () => {
  beforeAll(() => {
    // Mock the database connection to simulate failure
    jest.spyOn(sequelize, "authenticate").mockImplementationOnce(() => {
      throw new Error("Database connection failed");
    });
  });

  it("Expect 503 Service Unavailable", async () => {
    const res = await request(app).get("/healthz");
    expect(res.statusCode).toEqual(503);
  });
});

// Test for invalid method
describe("Test 3 | HealthCheck Invalid Method", () => {
  it("Expect 405 for invalid method", async () => {
    const res = await request(app).post("/healthz");
    expect(res.statusCode).toEqual(405);
  });
});

// Test for invalid query parameters
describe("Test 4 | HealthCheck Invalid Query Param", () => {
  it("Expect 400 for invalid query param", async () => {
    const res = await request(app).get("/healthz").query({ key: "value" });
    expect(res.statusCode).toEqual(400);
  });
});

// Test for payload in request
describe("Test 5 | HealthCheck Payload", () => {
  it("Expect 400 for payload in request", async () => {
    const res = await request(app).get("/healthz").send({ key: "value" });
    expect(res.statusCode).toEqual(400);
  });
});

// Test for cache-control header
describe("Test 6 | HealthCheck Cache-Control Header", () => {
  it("Should not cache response", async () => {
    const res = await request(app).get("/healthz");
    expect(res.headers["cache-control"]).toBe(
      "no-cache, no-store, must-revalidate"
    );
  });
});

// Test for no payload in response
describe("Test 7 | HealthCheck No Payload in Response", () => {
  it("Expect no payload in response", async () => {
    const res = await request(app).get("/healthz");
    expect(res.body).toEqual({}); // Ensure response body is empty
  });
});

// Test for undefined routes
describe("Test 8 | HealthCheck Undefined Route", () => {
  it("Expect 404 for undefined route", async () => {
    const res = await request(app).get("/undefined-route");
    expect(res.statusCode).toEqual(404);
  });
});

/* Assignment 2 */

// Create a new user
describe("Test 9 | Create a new user", () => {
  it("should create a new user successfully", async () => {
    const res = await request(app).post("/v1/user").send({
      email: "newuser@gmail.com",
      password: "NewPassword@123",
      first_name: "New",
      last_name: "User",
    });

    expect(res.statusCode).toEqual(201);
  });

  it("should return 400 when creating a user with an existing email", async () => {
    const res = await request(app).post("/v1/user").send({
      email: "testuser@gmail.com",
      password: "Password123!",
      first_name: "Test",
      last_name: "User",
    });

    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 for an invalid email format", async () => {
    const res = await request(app).post("/v1/user").send({
      email: "invalidemail.com",
      password: "Password123!",
      first_name: "Short",
      last_name: "Password",
    });

    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 for missing fields", async () => {
    const res = await request(app).post("/v1/user").send({
      email: "newuser@gmail.com",
      first_name: "New",
      last_name: "User",
    });

    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 Bad Request when 'account_created' is included in the request body", async () => {
    const res = await request(app).post("/v1/user").send({
      first_name: "New",
      last_name: "User",
      email: "newuser@example.com",
      password: "password",
      account_created: "2023-01-01T00:00:00Z",
    });

    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 Bad Request when 'account_updated' is included in the request body", async () => {
    const res = await request(app).post("/v1/user").send({
      first_name: "New",
      last_name: "User",
      email: "newuser@example.com",
      password: "password",
      account_updated: "2023-01-01T00:00:00Z",
    });

    expect(res.statusCode).toEqual(400);
  });
});

// Get user information
describe("Test 10 | Get user information", () => {

  it("should return 401 if no authorization header is provided", async () => {
    const res = await request(app).get("/v1/user/self");
    expect(res.statusCode).toEqual(401);
  });

  it("should return 401 for invalid Basic credentials", async () => {
    const invalidAuthHeader = `Basic ${Buffer.from(
      "wronguser@gmail.com:WrongPassword"
    ).toString("base64")}`;
    const res = await request(app)
      .get("/v1/user/self")
      .set("Authorization", invalidAuthHeader);
    expect(res.statusCode).toEqual(401);
  });
});

// Unauthorized Access and Method Not Allowed
describe("Test 12 | Unauthorized Access and Method Not Allowed", () => {
  it("should return 405 Method Not Allowed for DELETE request", async () => {
    const res = await request(app).delete("/v1/user/self");
    expect(res.statusCode).toEqual(405);
  });

  it("should return 405 Method Not Allowed for PATCH request", async () => {
    const res = await request(app).patch("/v1/user/self");
    expect(res.statusCode).toEqual(405);
  });

  it("should return 405 Method Not Allowed for HEAD request", async () => {
    const res = await request(app).head("/v1/user/self");
    expect(res.statusCode).toEqual(405);
  });

  it("should return 405 Method Not Allowed for OPTIONS request", async () => {
    const res = await request(app).options("/v1/user/self");
    expect(res.statusCode).toEqual(405);
  });
});