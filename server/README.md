# 🔧 ProjectPort Backend

Robust Node.js/Express API server for the ProjectPort platform with MySQL database, JWT authentication, and comprehensive project management endpoints.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Development](#development)
- [Deployment](#deployment)

---

## 🎯 Overview

The ProjectPort backend is a RESTful API server that handles:

- User authentication and authorization
- Lead and project management
- Payment tracking
- Milestone management
- Notifications
- Business analytics

Built with security, scalability, and maintainability in mind.

---

## ✨ Features

### Core Features

- **JWT Authentication**: Secure token-based auth with 7-day expiry
- **Role-Based Access Control**: Admin and client roles with middleware
- **Lead Management**: Capture, review, convert leads to projects
- **Project Management**: Full CRUD operations with status tracking
- **Payment Tracking**: Schedule and monitor project payments
- **Milestone System**: Break projects into trackable milestones
- **Notifications**: Real-time in-app notifications
- **Analytics**: Dashboard statistics and metrics

### Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **SQL Injection Protection**: Parameterized queries
- **CORS**: Configured for specific origins
- **JWT Verification**: Token validation on protected routes
- **Input Validation**: Required field checks
- **Error Handling**: Comprehensive error responses

---

## 🛠️ Tech Stack

| Technology       | Version | Purpose                |
| ---------------- | ------- | ---------------------- |
| **Node.js**      | 20.x    | Runtime environment    |
| **Express.js**   | 4.x     | Web framework          |
| **MySQL2**       | 3.x     | Database driver        |
| **bcryptjs**     | 2.x     | Password hashing       |
| **jsonwebtoken** | 9.x     | JWT authentication     |
| **dotenv**       | 16.x    | Environment management |
| **cors**         | 2.x     | Cross-origin requests  |

---

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm 9+
- MySQL 8.0+
- Git

### Steps

1. **Navigate to server directory**:

```bash
cd server
```

2. **Install dependencies**:

```bash
npm install
```

3. **Create environment file**:

```bash
touch .env
```

Add configuration (see [Configuration](#configuration) section)

4. **Setup database**:

```bash
# Login to MySQL
mysql -u root -p

# Run schema
source ../database_schema.sql
```

5. **Start server**:

```bash
# Development
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:4000`

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in `/server`:

```env
# Server Configuration
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-change-in-production

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=projectport
DB_PORT=3306
DB_CONNECTION_LIMIT=10

# Optional: Email Service (Future Enhancement)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=ProjectPort <noreply@projectport.com>

# Optional: File Upload (Future Enhancement)
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### Important Notes

⚠️ **JWT_SECRET**: Must be a strong, random string (minimum 32 characters)
⚠️ **DB_PASSWORD**: Never commit to version control
⚠️ **CLIENT_ORIGIN**: Update for production deployment

### Generating Secure JWT Secret

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online tool
# https://randomkeygen.com/
```

---

## 🗄️ Database Schema

### Tables Overview

1. **users**: Client and admin accounts
2. **leads**: Project inquiries before conversion
3. **projects**: Active client projects
4. **milestones**: Project milestone tracking
5. **payments**: Payment schedules and history
6. **project_updates**: Status updates and notes
7. **project_assignments**: Team member assignments
8. **notifications**: User notifications
9. **quotations**: Generated quotes (optional)

### Key Relationships

```
users (1) ──────< projects (N)
projects (1) ────< milestones (N)
projects (1) ────< payments (N)
projects (1) ────< project_updates (N)
leads (1) ───────> users (1) [converted_user_id]
```

### Sample Database Queries

```sql
-- Get all projects with client details
SELECT p.*, u.full_name, u.email
FROM projects p
JOIN users u ON p.client_id = u.id
WHERE p.status = 'in_progress';

-- Get project completion percentage
SELECT
  p.project_name,
  COUNT(m.id) as total_milestones,
  SUM(CASE WHEN m.status = 'completed' THEN 1 ELSE 0 END) as completed,
  ROUND(SUM(CASE WHEN m.status = 'completed' THEN 1 ELSE 0 END) / COUNT(m.id) * 100, 2) as completion_percent
FROM projects p
LEFT JOIN milestones m ON p.id = m.project_id
GROUP BY p.id;

-- Get payment summary
SELECT
  payment_type,
  COUNT(*) as count,
  SUM(amount) as total,
  AVG(amount) as average
FROM payments
WHERE status = 'paid'
GROUP BY payment_type;
```

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:4000/api
```

### Authentication Endpoints

#### POST `/auth/register`

Register a new client user.

**Request**:

```json
{
  "email": "client@example.com",
  "password": "securepass123",
  "full_name": "John Doe",
  "phone": "1234567890",
  "company": "Tech Corp"
}
```

**Response** (200):

```json
{
  "ok": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "client@example.com",
    "full_name": "John Doe",
    "role": "client"
  }
}
```

#### POST `/auth/login`

Authenticate user and get token.

**Request**:

```json
{
  "email": "admin@projectport.com",
  "password": "admin123"
}
```

**Response** (200):

```json
{
  "ok": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@projectport.com",
    "role": "admin",
    "full_name": "Aryan Gupta"
  }
}
```

#### GET `/auth/me`

Get current authenticated user.

**Headers**:

```
Authorization: Bearer {token}
```

**Response** (200):

```json
{
  "ok": true,
  "user": {
    "id": 1,
    "email": "admin@projectport.com",
    "full_name": "Aryan Gupta",
    "role": "admin"
  }
}
```

---

### Lead Endpoints

#### POST `/leads`

Create a new project inquiry (public endpoint).

**Request**:

```json
{
  "projectName": "E-commerce Website",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "company": "Fashion Retail Co",
  "typeKey": "ecommerce",
  "typeLabel": "E-commerce Website",
  "techStack": "React, Node.js, MySQL",
  "description": "Need a modern online store",
  "budget": 50000,
  "estimate": {
    "base": 40000,
    "features": 5000,
    "hosting": 2000,
    "cms": 3000,
    "final": 50000
  },
  "modules": ["products", "cart", "checkout"],
  "addons": ["payment-gateway", "analytics"],
  "resources": [],
  "hosting": "shared",
  "cms": "wordpress",
  "estimatedTimeWeeks": 8
}
```

**Response** (200):

```json
{
  "ok": true,
  "leadId": 15,
  "message": "Thank you! We'll contact you within 24 hours."
}
```

#### GET `/leads` 🔒 Admin

Get all leads.

**Query Parameters**:

- `status` (optional): Filter by status (new, contacted, converted, rejected)

**Response** (200):

```json
{
  "ok": true,
  "leads": [
    {
      "id": 15,
      "project_name": "E-commerce Website",
      "full_name": "Jane Smith",
      "email": "jane@example.com",
      "status": "new",
      "budget": 50000,
      "created_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### GET `/leads/:id` 🔒 Admin

Get lead details.

**Response** (200):

```json
{
  "ok": true,
  "lead": {
    "id": 15,
    "project_name": "E-commerce Website",
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543210",
    "company": "Fashion Retail Co",
    "type_key": "ecommerce",
    "description": "Need a modern online store",
    "budget": 50000,
    "estimate_json": {...},
    "status": "new",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

#### POST `/leads/:id/convert` 🔒 Admin

Convert lead to client and create project.

**Request**:

```json
{
  "password": "client123"
}
```

**Response** (200):

```json
{
  "ok": true,
  "message": "Lead successfully converted to client!",
  "user": {
    "id": 25,
    "email": "jane@example.com",
    "full_name": "Jane Smith",
    "password": "client123"
  },
  "project": {
    "id": 42,
    "name": "E-commerce Website"
  }
}
```

---

### Project Endpoints

#### GET `/projects` 🔒

Get all projects (filtered by role).

**Query Parameters**:

- Admin: Gets all projects
- Client: Gets only their projects

**Response** (200):

```json
{
  "ok": true,
  "projects": [
    {
      "id": 42,
      "project_name": "E-commerce Website",
      "client_id": 25,
      "client_name": "Jane Smith",
      "client_email": "jane@example.com",
      "status": "approved",
      "priority": "high",
      "budget": 50000,
      "estimate_final": 50000,
      "start_date": null,
      "end_date": null,
      "created_at": "2025-01-15T11:00:00Z"
    }
  ]
}
```

#### GET `/projects/:id` 🔒

Get project details with milestones, updates, payments.

**Response** (200):

```json
{
  "ok": true,
  "project": {
    "id": 42,
    "project_name": "E-commerce Website",
    "client_name": "Jane Smith",
    "status": "in_progress",
    "milestones": [...],
    "updates": [...],
    "payments": [...],
    "assignments": [...]
  }
}
```

#### PATCH `/projects/:id` 🔒 Admin

Update project details.

**Request**:

```json
{
  "status": "in_progress",
  "priority": "high",
  "start_date": "2025-01-20",
  "end_date": "2025-03-20",
  "estimated_weeks": 8
}
```

**Response** (200):

```json
{
  "ok": true,
  "message": "Project updated successfully"
}
```

#### DELETE `/projects/:id` 🔒 Admin

Delete a project.

**Response** (200):

```json
{
  "ok": true,
  "message": "Project deleted successfully"
}
```

---

### Milestone Endpoints

#### POST `/projects/:id/milestones` 🔒 Admin

Add milestone to project.

**Request**:

```json
{
  "title": "Design Phase Complete",
  "description": "All mockups and wireframes approved",
  "due_date": "2025-02-01"
}
```

**Response** (200):

```json
{
  "ok": true,
  "message": "Milestone created successfully"
}
```

#### PATCH `/milestones/:id` 🔒 Admin

Update milestone status/progress.

**Request**:

```json
{
  "status": "completed",
  "percentage": 100
}
```

**Response** (200):

```json
{
  "ok": true,
  "message": "Milestone updated successfully"
}
```

---

### Payment Endpoints

#### POST `/projects/:id/payments` 🔒 Admin

Add payment to project.

**Request**:

```json
{
  "amount": 20000,
  "payment_type": "advance",
  "due_date": "2025-01-25",
  "status": "pending",
  "notes": "50% advance payment"
}
```

**Response** (200):

```json
{
  "ok": true,
  "message": "Payment added successfully"
}
```

#### PATCH `/payments/:id` 🔒 Admin

Update payment status.

**Request**:

```json
{
  "status": "paid"
}
```

**Response** (200):

```json
{
  "ok": true,
  "message": "Payment updated successfully"
}
```

---

### Notification Endpoints

#### GET `/notifications` 🔒

Get user's notifications.

**Response** (200):

```json
{
  "ok": true,
  "notifications": [
    {
      "id": 123,
      "title": "Project Status Updated",
      "message": "Your project moved to in_progress",
      "type": "info",
      "is_read": false,
      "link": "/client/projects/42",
      "created_at": "2025-01-15T12:00:00Z"
    }
  ]
}
```

#### PATCH `/notifications/:id/read` 🔒

Mark notification as read.

**Response** (200):

```json
{
  "ok": true
}
```

---

### Dashboard Stats

#### GET `/dashboard/stats` 🔒

Get role-specific dashboard statistics.

**Admin Response** (200):

```json
{
  "ok": true,
  "stats": {
    "totalProjects": 45,
    "pendingProjects": 8,
    "activeProjects": 12,
    "totalClients": 32,
    "newLeads": 15
  }
}
```

**Client Response** (200):

```json
{
  "ok": true,
  "stats": {
    "myProjects": 3,
    "activeProjects": 1,
    "completedProjects": 1
  }
}
```

---

## 🔐 Authentication

### JWT Implementation

**Token Generation**:

```javascript
const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
```

**Token Usage**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Middleware

#### authMiddleware

Verifies JWT token and adds user to request.

```javascript
// Usage
app.get("/api/protected", authMiddleware, (req, res) => {
  // req.user contains authenticated user
});
```

#### adminOnly

Ensures user has admin role.

```javascript
// Usage
app.post("/api/admin-only", authMiddleware, adminOnly, (req, res) => {
  // Only admins can access
});
```

---

## ❌ Error Handling

### Error Response Format

```json
{
  "ok": false,
  "error": "Error message here"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (no/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

### Common Error Scenarios

```javascript
// Missing required fields
{
  "ok": false,
  "error": "Email, password and full name are required"
}

// Invalid credentials
{
  "ok": false,
  "error": "Invalid credentials"
}

// Unauthorized
{
  "ok": false,
  "error": "No token provided"
}

// Admin access required
{
  "ok": false,
  "error": "Admin access required"
}
```

---

## 🔧 Development

### Project Files

```
server/
├── index.js              # Main server file with all routes
├── db.js                 # MySQL connection pool
├── utils/
│   └── generateSitemap.js  # Sitemap generator
├── .env                  # Environment configuration
├── package.json
└── node_modules/
```

### Code Structure

```javascript
// 1. Dependencies
require("dotenv").config();
const express = require("express");

// 2. App initialization
const app = express();

// 3. Middleware
app.use(express.json());
app.use(cors());

// 4. Custom middleware
const authMiddleware = async (req, res, next) => {
  /*...*/
};

// 5. Routes
app.post("/api/auth/login", async (req, res) => {
  /*...*/
});

// 6. Error handler
app.use((err, req, res, next) => {
  /*...*/
});

// 7. Start server
app.listen(PORT);
```

### Database Connection

```javascript
// db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
```

### Testing

```bash
# Test database connection
node -e "require('./db').query('SELECT 1').then(() => console.log('DB OK'))"

# Test JWT generation
node generate-hash.js

# Test authentication
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@projectport.com","password":"admin123"}'
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Update CLIENT_ORIGIN to production domain
- [ ] Use environment-specific database
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS
- [ ] Add rate limiting
- [ ] Enable compression
- [ ] Setup logging
- [ ] Configure monitoring

### Environment Setup

**Production `.env`**:

```env
NODE_ENV=production
PORT=4000
CLIENT_ORIGIN=https://projectport.com
JWT_SECRET=production-secret-minimum-32-characters
DB_HOST=production-db-host
DB_USER=production-user
DB_PASSWORD=production-password
DB_NAME=projectport
```

### Deployment Platforms

#### Railway

1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

#### Render

1. Create new Web Service
2. Connect repository
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add environment variables

#### VPS (Manual)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/aryanony/ProjectPort.git
cd ProjectPort/server
npm install

# Setup PM2 for process management
npm install -g pm2
pm2 start index.js --name projectport-api
pm2 save
pm2 startup
```

### Database Backup

```bash
# Backup
mysqldump -u root -p projectport > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p projectport < backup_20250115.sql
```

---

## 🐛 Troubleshooting

### Server won't start

```bash
# Check if port is in use
lsof -i :4000

# Kill process
kill -9 <PID>
```

### Database connection error

```bash
# Test connection
mysql -u root -p -h localhost -e "SELECT 1"

# Check .env values
cat .env | grep DB_
```

### JWT errors

- Verify JWT_SECRET is set
- Check token expiry
- Ensure Authorization header format

---

## 📚 API Documentation Tools

For interactive API documentation, consider adding:

- **Swagger/OpenAPI**: Auto-generated API docs
- **Postman Collection**: Shareable API collection
- **Insomnia**: REST client workspace

---

## 🤝 Contributing

See main [README.md](../README.md) for guidelines.

---

## 📄 License

MIT License - See [LICENSE](../LICENSE)

---

<p align="center">
  Made with ❤️ for ProjectPort
</p>
