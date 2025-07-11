import { sequelize } from '../src/config/database';

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DB_NAME = 'test_db';

// Database setup and teardown
beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Failed to setup test database:', error);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error('Failed to close database connection:', error);
  }
});

// Clear data between tests
afterEach(async () => {
  const models = Object.values(sequelize.models);
  await Promise.all(
    models.map(model => model.destroy({ where: {}, force: true }))
  );
});
