/**
 * @file auth.test.js
 * @description Test suite for authentication endpoints in the Sweet Shop Management System.
 * Uses Jest and Supertest to test register and login functionality, including JWT cookie handling.
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import the Express app
const User = require('../models/User');

beforeAll(async () => {
  /**
   * @description Connect to MongoDB before running tests
   */
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  /**
   * @description Clean up test users and close MongoDB connection after all tests
   */
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Password123',
  };

  it('should register a new user and set JWT cookie', async () => {
    /**
     * @test
     * @description Test user registration endpoint.
     * Expects status 201, correct user email in response, and JWT cookie set.
     */
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);

    // Check JWT cookie header
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/token=/);
  });

  it('should not allow registering with existing email', async () => {
    /**
     * @test
     * @description Prevent registering a user with an email that already exists.
     * Expects status 400 and proper error message.
     */
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email already exists');
  });

  it('should login an existing user and set JWT cookie', async () => {
    /**
     * @test
     * @description Test login endpoint with correct credentials.
     * Expects status 200, correct user email, and JWT cookie set.
     */
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/token=/);
  });

  it('should not login with wrong password', async () => {
    /**
     * @test
     * @description Test login endpoint with incorrect password.
     * Expects status 400 and "Invalid credentials" message.
     */
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should not login non-existing user', async () => {
    /**
     * @test
     * @description Test login endpoint with email that does not exist.
     * Expects status 400 and "Invalid credentials" message.
     */
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'Password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
