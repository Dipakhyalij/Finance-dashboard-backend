const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const financialRoutes = require('./routes/financialRoutes');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Finance Dashboard API Documentation',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestDuration: true,
    tryItOutEnabled: true
  }
}));

// JSON endpoint for Swagger spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'Server is running',
    timestamp: new Date(),
    version: '1.0.0',
    documentation: 'http://localhost:5000/api-docs'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Finance Dashboard API',
    version: '1.0.0',
    status: 'active',
    documentation: 'http://localhost:5000/api-docs',
    health: 'http://localhost:5000/api/health'
  });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;