import { Sequelize } from 'sequelize';
import { MongoClient, Db } from 'mongodb';

// PostgreSQL configuration with Sequelize
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'express_api_db',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// MongoDB configuration
let mongoDb: Db | null = null;

export async function connectMongoDB(): Promise<Db> {
  if (mongoDb) return mongoDb;

  const client = new MongoClient(
    process.env.MONGODB_URI || 'mongodb://localhost:27017'
  );
  
  await client.connect();
  mongoDb = client.db(process.env.MONGODB_NAME || 'express_api_db');
  
  return mongoDb;
}

// Database connection tester
export async function testDatabaseConnection(): Promise<void> {
  try {
    // Test PostgreSQL
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');
    
    // Test MongoDB
    const mongo = await connectMongoDB();
    await mongo.command({ ping: 1 });
    console.log('✅ MongoDB connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    throw error;
  }
}
