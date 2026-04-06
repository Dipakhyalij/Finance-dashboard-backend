const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: `
        A comprehensive Finance Data Processing and Access Control Dashboard API.
        
        ## Features
        - User authentication with JWT
        - Role-based access control (Viewer, Analyst, Admin)
        - Complete financial record management
        - Advanced dashboard analytics
        - User management for admins
        
        ## Roles & Permissions
        - **Viewer**: Read-only access to financial records
        - **Analyst**: Read access + dashboard insights
        - **Admin**: Full CRUD on users and all records
      `,
      contact: {
        name: 'API Support',
        email: 'support@financedashboard.com',
        url: 'https://github.com/yourusername/finance-dashboard-backend'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      termsOfService: 'http://localhost:5000/terms'
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server'
      },
      {
        url: 'https://api.financedashboard.com/api',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token here. Format: Bearer <token>'
        }
      },
      schemas: {
        // User Schemas
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', enum: ['viewer', 'analyst', 'admin'], example: 'viewer' },
            status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50, example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            role: { type: 'string', enum: ['viewer', 'analyst', 'admin'], default: 'viewer' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            token: { type: 'string', description: 'JWT token for authentication' },
            user: { $ref: '#/components/schemas/User' }
          }
        },
        
        // Financial Record Schemas
        FinancialRecord: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Record ID' },
            user: { type: 'string', description: 'User ID who created the record' },
            amount: { type: 'number', example: 5000.00 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
            category: { type: 'string', example: 'Salary' },
            date: { type: 'string', format: 'date', example: '2024-01-15' },
            description: { type: 'string', example: 'January salary payment' },
            isDeleted: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateFinancialRecordRequest: {
          type: 'object',
          required: ['amount', 'type', 'category'],
          properties: {
            amount: { type: 'number', minimum: 0.01, example: 5000.00 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
            category: { type: 'string', maxLength: 50, example: 'Salary' },
            date: { type: 'string', format: 'date', example: '2024-01-15' },
            description: { type: 'string', maxLength: 200, example: 'Monthly salary' }
          }
        },
        UpdateFinancialRecordRequest: {
          type: 'object',
          properties: {
            amount: { type: 'number', minimum: 0.01, example: 5500.00 },
            type: { type: 'string', enum: ['income', 'expense'] },
            category: { type: 'string', maxLength: 50, example: 'Salary' },
            date: { type: 'string', format: 'date' },
            description: { type: 'string', maxLength: 200 }
          }
        },
        
        // Dashboard Schemas
        DashboardSummary: {
          type: 'object',
          properties: {
            totalIncome: { type: 'number', example: 50000 },
            totalExpenses: { type: 'number', example: 25000 },
            netBalance: { type: 'number', example: 25000 },
            categoryTotals: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  income: { type: 'number' },
                  expense: { type: 'number' },
                  total: { type: 'number' }
                }
              }
            },
            recentTransactions: {
              type: 'array',
              items: { $ref: '#/components/schemas/FinancialRecord' }
            },
            monthlyTrends: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  month: { type: 'string', example: '2024-01' },
                  income: { type: 'number' },
                  expense: { type: 'number' },
                  net: { type: 'number' }
                }
              }
            },
            totalTransactions: { type: 'number', example: 25 }
          }
        },
        
        // Pagination
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 50 },
            pages: { type: 'integer', example: 5 }
          }
        },
        PaginatedRecordsResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { $ref: '#/components/schemas/FinancialRecord' } },
            pagination: { $ref: '#/components/schemas/Pagination' }
          }
        },
        
        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error message here' },
            errors: { type: 'array', items: { type: 'object' }, description: 'Validation errors' }
          }
        },
        
        // Update User Request
        UpdateUserRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['viewer', 'analyst', 'admin'] },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        UpdateUserRoleRequest: {
          type: 'object',
          required: ['role'],
          properties: {
            role: { type: 'string', enum: ['viewer', 'analyst', 'admin'], example: 'analyst' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Financial Records',
        description: 'CRUD operations for financial records'
      },
      {
        name: 'Dashboard',
        description: 'Dashboard analytics and insights'
      },
      {
        name: 'User Management',
        description: 'Admin-only user management endpoints'
      },
      {
        name: 'Health Check',
        description: 'API health monitoring'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;