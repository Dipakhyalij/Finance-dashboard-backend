# Finance Dashboard Backend System

A comprehensive, production-ready Finance Data Processing and Access Control Dashboard backend system built with Node.js, Express.js, MongoDB, and JWT authentication.

## 🚀 Features

### User & Role Management
- User registration and login with JWT authentication
- Role-based access control (Viewer, Analyst, Admin)
- User status management (active/inactive)
- Role-specific permissions:
  - **Viewer**: Read-only access to financial records
  - **Analyst**: Read access + dashboard insights and analytics
  - **Admin**: Full access (CRUD on users and all records)

### Financial Records Management
- Complete CRUD operations for financial records
- Fields: amount, type (income/expense), category, date, description
- Advanced filtering by date range, category, and type
- Pagination support
- Search functionality in description and category
- Soft delete for data preservation

### Dashboard Analytics
- Total income calculation
- Total expenses calculation
- Net balance
- Category-wise totals breakdown
- Recent transactions (last 10)
- Monthly summary trends

### Security Features
- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Input validation and sanitization
- Role-based access control middleware
- Protected routes with proper authorization

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Validation**: express-validator
- **Logging**: Morgan
- **Security**: CORS

## 📁 Project Structure
finance-dashboard-backend/
├── src/
│ ├── config/
│ │ └── database.js # MongoDB connection
│ ├── controllers/
│ │ ├── authController.js # Authentication logic
│ │ ├── financialController.js # Financial CRUD operations
│ │ └── userController.js # User management (admin)
│ ├── middleware/
│ │ ├── authMiddleware.js # JWT & role verification
│ │ ├── errorMiddleware.js # Global error handling
│ │ └── validationMiddleware.js # Input validation
│ ├── models/
│ │ ├── User.js # User schema
│ │ └── FinancialRecord.js # Financial record schema
│ ├── routes/
│ │ ├── authRoutes.js # Authentication endpoints
│ │ ├── financialRoutes.js # Financial endpoints
│ │ └── userRoutes.js # User management endpoints
│ ├── services/
│ │ └── dashboardService.js # Dashboard calculations
│ ├── utils/
│ │ └── validators.js # Validation rules
│ └── app.js # Express app configuration
├── .env # Environment variables
├── .gitignore # Git ignore file
├── package.json # Dependencies
└── server.js # Application entry point


## 📋 Prerequisites

- Node.js (v14.x or higher)
- MongoDB (v4.4 or higher) or MongoDB Atlas account
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd finance-dashboard-backend

## 📋 Prerequisites

- Node.js (v14.x or higher)
- MongoDB (v4.4 or higher) or MongoDB Atlas account
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Dipakhyalij/Finance-dashboard-backend.git
cd finance-dashboard-backend

NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance_dashboard
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_64_characters
JWT_EXPIRE=30d
BCRYPT_ROUNDS=10


# Development mode (with auto-reload)
npm run dev

# Production mode
npm start



📚 API Documentation
Authentication Endpoints
Method	Endpoint	Description	Access
POST	/api/auth/register	Register new user	Public
POST	/api/auth/login	Login user	Public
GET	/api/auth/me	Get current user info	Authenticated
Financial Records Endpoints
Method	Endpoint	Description	Access
POST	/api/financial/records	Create financial record	Authenticated
GET	/api/financial/records	Get all records (with filters)	Authenticated
GET	/api/financial/records/:id	Get single record	Authenticated
PUT	/api/financial/records/:id	Update record	Authenticated
DELETE	/api/financial/records/:id	Delete record (soft delete)	Authenticated
GET	/api/financial/dashboard	Get dashboard summary	Analyst+
User Management Endpoints (Admin Only)
Method	Endpoint	Description
GET	/api/users	Get all users
GET	/api/users/:id	Get user by ID
PUT	/api/users/:id	Update user
DELETE	/api/users/:id	Delete user
PATCH	/api/users/:id/role	Update user role
🔍 API Usage Examples
Register a User
bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "viewer"
  }'
Login
bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
Create Financial Record (Requires Token)
bash
curl -X POST http://localhost:5000/api/financial/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "date": "2024-01-15",
    "description": "January salary"
  }'
Get Dashboard Summary (Analyst+)
bash
curl -X GET "http://localhost:5000/api/financial/dashboard?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
Get Records with Filters & Pagination
bash
curl -X GET "http://localhost:5000/api/financial/records?type=expense&category=Rent&page=1&limit=10&startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
🗄️ Database Schema
User Schema
javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  role: Enum['viewer', 'analyst', 'admin'],
  status: Enum['active', 'inactive'],
  createdAt: Date,
  updatedAt: Date
}
Financial Record Schema
javascript
{
  user: ObjectId (ref: User),
  amount: Number (required, >0),
  type: Enum['income', 'expense'],
  category: String (required),
  date: Date (required),
  description: String (max 200 chars),
  isDeleted: Boolean (soft delete),
  deletedAt: Date
}
🎯 Role-Based Access Control
Permission	Viewer	Analyst	Admin
View financial records	✅	✅	✅
Create/update/delete records	❌	✅	✅
View dashboard insights	❌	✅	✅
Manage users	❌	❌	✅
Manage all records	❌	❌	✅
🧪 Testing
bash
# Run tests
npm test
📦 Dependencies
Production
express - Web framework

mongoose - MongoDB ODM

bcryptjs - Password hashing

jsonwebtoken - JWT authentication

dotenv - Environment variables

express-validator - Input validation

cors - Cross-origin support

morgan - HTTP logging

Development
nodemon - Auto-reload during development

jest - Testing framework

supertest - HTTP assertions

🔒 Security Best Practices
Passwords are hashed using bcrypt (10 rounds)

JWT tokens for stateless authentication

Input validation on all endpoints

Role-based access control middleware

Soft delete instead of permanent deletion

Environment variables for sensitive data

Error messages don't expose sensitive information

🚦 Error Handling
The API returns appropriate HTTP status codes:

200 - Success

201 - Created successfully

400 - Bad request (validation failed)

401 - Unauthorized (invalid token)

403 - Forbidden (insufficient permissions)

404 - Resource not found

500 - Server error

📈 Sample Dashboard Response
json
{
  "success": true,
  "data": {
    "totalIncome": 50000,
    "totalExpenses": 25000,
    "netBalance": 25000,
    "categoryTotals": {
      "Salary": { "income": 50000, "expense": 0, "total": 50000 },
      "Rent": { "income": 0, "expense": 15000, "total": 15000 },
      "Groceries": { "income": 0, "expense": 10000, "total": 10000 }
    },
    "recentTransactions": [...],
    "monthlyTrends": [
      { "month": "2024-01", "income": 50000, "expense": 25000, "net": 25000 }
    ],
    "totalTransactions": 25
  }
}
🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License.

👥 Authors
Your Name - Initial work

🙏 Acknowledgments
Express.js team for the amazing framework

MongoDB team for the database

All contributors and open-source libraries used

📧 Support
For support, email your-email@example.com or create an issue in the repository.

🚀 Quick Start Commands
bash
# Clone and install
git clone <repo-url>
cd finance-dashboard-backend
npm install

# Set up environment
cp .env.example .env  # Create .env with your values

# Start MongoDB
mongod

# In another terminal, start the app
npm run dev

# Test the API
curl http://localhost:5000/api/health


### for API documentation 
http://localhost:5000/api-docs