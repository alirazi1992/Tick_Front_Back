# IT Ticketing System - Backend API

A complete, production-ready backend API for an IT ticketing system built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Client, Engineer, Admin)
  - Secure password hashing with bcrypt
  - Refresh token support

- **Ticket Management**
  - Create, read, update, delete tickets
  - Ticket assignment to technicians
  - Status tracking and priority management
  - Response/comment system
  - Dynamic custom fields per category
  - File attachments support

- **Category Management**
  - Dynamic category and subcategory creation
  - Custom fields configuration
  - Bulk category updates

- **File Upload**
  - Secure file upload with validation
  - Support for images, PDFs, and documents
  - File size limits and type validation

- **Security**
  - Helmet.js for security headers
  - Rate limiting
  - CORS configuration
  - Input validation and sanitization

- **Logging & Monitoring**
  - Winston logger
  - Request logging with Morgan
  - Error tracking

## 📋 Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (v5 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation

1. **Clone the repository or navigate to the backend directory:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**

```bash
cp .env.example .env
```

4. **Configure environment variables:**

Edit `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_PREFIX=/api/v1

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ticketing_system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-change-this
JWT_REFRESH_EXPIRE=30d

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads

# Admin User (for seeding)
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=123456
ADMIN_NAME=مدیر سیستم
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000` with hot-reload enabled.

### Production Mode

```bash
# Build the project
npm run build

# Start the server
npm start
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "09123456789",
  "department": "IT",
  "role": "client"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client"
    },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  }
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/v1/auth/updateprofile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "09123456789",
  "department": "IT"
}
```

#### Update Password
```http
PUT /api/v1/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### Ticket Endpoints

#### Create Ticket
```http
POST /api/v1/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Computer not working",
  "description": "My computer won't turn on",
  "priority": "high",
  "category": "hardware",
  "subCategory": "computer-not-working",
  "dynamicFields": {
    "deviceBrand": "Dell",
    "deviceModel": "Latitude 7490"
  }
}
```

#### Get All Tickets
```http
GET /api/v1/tickets
Authorization: Bearer <token>

# Query parameters (optional):
# ?status=open
# ?priority=high
# ?category=hardware
# ?search=computer
```

#### Get Single Ticket
```http
GET /api/v1/tickets/:ticketId
Authorization: Bearer <token>
```

#### Update Ticket (Admin/Engineer only)
```http
PUT /api/v1/tickets/:ticketId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "urgent"
}
```

#### Delete Ticket (Admin only)
```http
DELETE /api/v1/tickets/:ticketId
Authorization: Bearer <token>
```

#### Add Response to Ticket (Engineer/Admin only)
```http
POST /api/v1/tickets/:ticketId/responses
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I've checked your computer. The power supply is faulty.",
  "status": "in-progress"
}
```

#### Assign Ticket to Technician (Admin only)
```http
PUT /api/v1/tickets/:ticketId/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "technicianId": "user-id",
  "technicianName": "Ali Technician",
  "technicianEmail": "ali@company.com"
}
```

#### Get Ticket Statistics
```http
GET /api/v1/tickets/stats
Authorization: Bearer <token>
```

### Category Endpoints

#### Get All Categories
```http
GET /api/v1/categories
Authorization: Bearer <token>
```

#### Get Single Category
```http
GET /api/v1/categories/:categoryId
Authorization: Bearer <token>
```

#### Create Category (Admin only)
```http
POST /api/v1/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoryId": "hardware",
  "label": "Hardware Issues",
  "description": "Problems related to physical equipment",
  "subIssues": {
    "computer": {
      "id": "computer",
      "label": "Computer Problems",
      "description": "Issues with computers",
      "fields": [
        {
          "id": "brand",
          "label": "Brand",
          "type": "text",
          "required": true
        }
      ]
    }
  }
}
```

#### Update Category (Admin only)
```http
PUT /api/v1/categories/:categoryId
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Updated Label",
  "description": "Updated description"
}
```

#### Bulk Update Categories (Admin only)
```http
PUT /api/v1/categories/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "categories": {
    "hardware": {
      "label": "Hardware",
      "subIssues": { ... }
    }
  }
}
```

#### Delete Category (Admin only)
```http
DELETE /api/v1/categories/:categoryId
Authorization: Bearer <token>
```

### File Upload Endpoints

#### Upload Files
```http
POST /api/v1/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [file1, file2, ...]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "name": "document.pdf",
        "url": "/uploads/document-1234567890.pdf",
        "size": 245678,
        "mimeType": "application/pdf",
        "uploadedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

#### Delete File
```http
DELETE /api/v1/upload/:filename
Authorization: Bearer <token>
```

## 🔐 User Roles

### Client
- Create tickets
- View own tickets
- View ticket responses

### Engineer (Technician)
- View assigned tickets
- Update ticket status
- Add responses to tickets
- Update assigned tickets

### Admin
- Full access to all tickets
- Assign tickets to engineers
- Manage categories
- Manage users
- Delete tickets

## 📝 Default Users (Seeded on First Run)

```javascript
// Admin
Email: admin@company.com
Password: 123456

// Client
Email: ahmad@company.com
Password: 123456

// Engineer
Email: ali@company.com
Password: 123456
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # MongoDB connection
│   │   └── index.ts      # App configuration
│   ├── controllers/      # Route controllers
│   │   ├── authController.ts
│   │   ├── ticketController.ts
│   │   ├── categoryController.ts
│   │   └── uploadController.ts
│   ├── middleware/       # Custom middleware
│   │   ├── auth.ts       # Authentication & authorization
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   └── upload.ts
│   ├── models/           # Mongoose models
│   │   ├── User.ts
│   │   ├── Ticket.ts
│   │   └── Category.ts
│   ├── routes/           # API routes
│   │   ├── authRoutes.ts
│   │   ├── ticketRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   └── uploadRoutes.ts
│   ├── utils/            # Utility functions
│   │   ├── logger.ts
│   │   ├── jwt.ts
│   │   ├── appError.ts
│   │   └── seed.ts
│   └── server.ts         # App entry point
├── uploads/              # Uploaded files
├── logs/                 # Log files
├── .env.example          # Environment variables example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing

```bash
npm test
```

## 📦 Building for Production

```bash
npm run build
```

This will compile TypeScript to JavaScript in the `dist/` directory.

## 🔧 Development Tools

- **Linting:**
  ```bash
  npm run lint
  ```

- **Format Code:**
  ```bash
  npm run format
  ```

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/ticketing_system |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| ALLOWED_ORIGINS | CORS allowed origins | http://localhost:3000 |
| MAX_FILE_SIZE | Maximum file upload size | 10485760 (10MB) |

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Contains sensitive information
2. **Use strong JWT secrets** - Generate random, long strings
3. **Enable HTTPS in production** - Use SSL certificates
4. **Regular dependency updates** - Keep packages up to date
5. **Input validation** - All user inputs are validated
6. **Rate limiting** - Prevents abuse and DDoS attacks

## 🚀 Deployment

### Deploy to Production Server

1. Set NODE_ENV to production
2. Use a process manager like PM2
3. Set up MongoDB Atlas or managed MongoDB
4. Configure reverse proxy (Nginx)
5. Enable HTTPS

### Using PM2

```bash
npm install -g pm2
npm run build
pm2 start dist/server.js --name ticketing-api
pm2 save
pm2 startup
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📧 Support

For support, email support@company.com or create an issue in the repository.

## 🙏 Acknowledgments

- Express.js for the web framework
- MongoDB for the database
- JWT for authentication
- TypeScript for type safety
- All contributors and maintainers

---

**Made with ❤️ for IT Support Teams**
