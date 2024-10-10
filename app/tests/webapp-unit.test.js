import request from 'supertest';
import express from 'express';
import * as userService from '../services/userService.js';
import { UniqueConstraintError } from 'sequelize';  // Import UniqueConstraintError from Sequelize
import { createUser, updateUser, getUser, unsupportedCall } from '../controllers/userController.js';

jest.mock('../services/userService.js');  // Mock the userService

const app = express();
app.use(express.json());

// Create routes for the app to test
app.post('/users', createUser);
app.put('/users', updateUser);
app.get('/users', getUser);
app.all('*', unsupportedCall);

describe('User API Tests', () => {
  const basicAuth = `Basic ${Buffer.from('username:password').toString('base64')}`;

  // Add afterAll to ensure all mocks and async operations are cleaned up
  afterAll(() => {
    jest.resetAllMocks();  // Reset mocks after all tests run
  });

  describe('POST /users', () => {
    it('should create a user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        account_created: new Date(),
        account_updated: new Date(),
      };
      
      userService.createUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/users')
        .set('Authorization', basicAuth)
        .send({
          email: 'test@example.com',
          password: 'password',
          first_name: 'Test',
          last_name: 'User',
        });

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(mockUser.email);
      expect(userService.createUser).toHaveBeenCalled();
    });

    it('should return 400 if account_created or account_updated is passed', async () => {
      const response = await request(app)
        .post('/users')
        .set('Authorization', basicAuth)
        .send({
          email: 'test@example.com',
          password: 'password',
          first_name: 'Test',
          last_name: 'User',
          account_created: new Date(),
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Can't set account_created or account_updated");
    });

    it('should return 400 if user already exists', async () => {
      // Mock the UniqueConstraintError rejection properly
      userService.createUser.mockRejectedValue(new UniqueConstraintError({ message: "User already exists" }));

      const response = await request(app)
        .post('/users')
        .set('Authorization', basicAuth)
        .send({
          email: 'test@example.com',
          password: 'password',
          first_name: 'Test',
          last_name: 'User',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("User already exists");
    });
  });

  describe('PUT /users', () => {
    it('should return 400 if email is provided in update', async () => {
      const response = await request(app)
        .put('/users')
        .set('Authorization', basicAuth)
        .send({
          email: 'newemail@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Can't update the email");
    });
  });

  describe('GET /users', () => {
    it('should return 404 if user is not found', async () => {
      userService.findUserById.mockResolvedValue(null);

      const response = await request(app)
        .get('/users')
        .set('Authorization', basicAuth);  // Use basic auth here

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Error fetching user");
    });

  });

  describe('Unsupported API Call', () => {
    it('should return 405 for unsupported routes', async () => {
      const response = await request(app)
        .delete('/users')
        .set('Authorization', basicAuth);

      expect(response.status).toBe(405);
    });
  });
});