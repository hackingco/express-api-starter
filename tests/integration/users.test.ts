import request from 'supertest';
import app from '../../src/index';
import { User } from '../../src/models/User';
import { generateToken } from '../../src/middleware/auth';

describe('User API Integration Tests', () => {
  let authToken: string;
  let testUser: User;

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'user',
    });

    // Generate auth token
    authToken = generateToken({
      id: testUser.id,
      email: testUser.email,
      role: testUser.role,
    });
  });

  describe('GET /api/users', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return users with valid authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 5);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user with admin role', async () => {
      // Create admin user
      const adminUser = await User.create({
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
      });

      const adminToken = generateToken({
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      });

      const newUser = {
        email: 'newuser@example.com',
        password: 'newpass123',
        name: 'New User',
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User created');
      
      // Verify user was created
      const createdUser = await User.findOne({ where: { email: newUser.email } });
      expect(createdUser).toBeTruthy();
    });

    it('should reject creation without admin role', async () => {
      const newUser = {
        email: 'another@example.com',
        password: 'pass123',
        name: 'Another User',
      };

      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newUser)
        .expect(403);
    });
  });
});
