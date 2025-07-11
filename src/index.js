const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    project: 'test-swarm-project-1752223830056',
    timestamp: new Date().toISOString()
  });
});

// Main endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to test-swarm-project-1752223830056',
    description: 'Automated test project created by GitHub Project Creation Swarm',
    version: '1.0.0'
  });
});

// Echo endpoint
app.post('/echo', (req, res) => {
  res.json({ 
    echo: req.body,
    timestamp: new Date().toISOString()
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
