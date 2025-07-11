import request from 'supertest';
import app from '../../src/index';

describe('E2E: User Registration and Authentication Flow', () => {
  it('should complete full user registration and login flow', async () => {
    const userData = {
      email: 'e2e@example.com',
      password: 'securePass123!',
      name: 'E2E Test User',
    };

    // Step 1: Register new user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(registerResponse.body).toHaveProperty('message', 'User registered successfully');
    expect(registerResponse.body).toHaveProperty('userId');

    // Step 2: Login with new user
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200);

    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('user');
    expect(loginResponse.body.user.email).toBe(userData.email);

    const authToken = loginResponse.body.token;

    // Step 3: Access protected route
    const profileResponse = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(profileResponse.body).toHaveProperty('email', userData.email);
    expect(profileResponse.body).toHaveProperty('name', userData.name);

    // Step 4: Update profile
    const updateResponse = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated Name' })
      .expect(200);

    expect(updateResponse.body).toHaveProperty('message', 'Profile updated');

    // Step 5: Logout
    const logoutResponse = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(logoutResponse.body).toHaveProperty('message', 'Logged out successfully');
  });

  it('should handle invalid registration attempts', async () => {
    // Missing required fields
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'incomplete@example.com' })
      .expect(400);

    // Invalid email format
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: 'pass123',
        name: 'Test User',
      })
      .expect(400);

    // Weak password
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'weak@example.com',
        password: '123',
        name: 'Test User',
      })
      .expect(400);
  });
});
