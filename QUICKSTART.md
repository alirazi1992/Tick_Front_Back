# Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js v16+ installed
- [ ] MongoDB installed and running
- [ ] Git installed

## Setup Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings (optional - defaults work for local development)
```

### 3. Start MongoDB
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 4. Run the Backend
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

### 5. Verify Installation
Open your browser and visit:
- API Root: http://localhost:5000
- Health Check: http://localhost:5000/health

You should see a JSON response confirming the server is running.

### 6. Test the API

#### Login with Default Admin User
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "123456"
  }'
```

Copy the `token` from the response and use it in subsequent requests.

#### Get All Tickets
```bash
curl http://localhost:5000/api/v1/tickets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues

### MongoDB Connection Error
**Problem:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running
2. Check MONGODB_URI in .env file
3. Verify MongoDB is listening on port 27017

### Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Change PORT in .env to another port (e.g., 5001)
2. Or kill the process using port 5000

### TypeScript Errors
**Problem:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Connect Frontend:**
   - Update frontend API base URL to `http://localhost:5000/api/v1`
   - Add CORS origin in .env: `ALLOWED_ORIGINS=http://localhost:3000`

2. **Customize:**
   - Change default admin credentials in .env
   - Modify JWT secrets
   - Adjust rate limiting settings

3. **Production Deployment:**
   - Set NODE_ENV=production
   - Use MongoDB Atlas
   - Set up HTTPS
   - Use PM2 for process management

## Available Scripts

```bash
npm run dev       # Start development server with hot reload
npm run build     # Build TypeScript to JavaScript
npm start         # Start production server
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
```

## Default Users

After first run, these users are automatically created:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | 123456 |
| Client | ahmad@company.com | 123456 |
| Engineer | ali@company.com | 123456 |

**⚠️ Change these passwords in production!**

## API Documentation

Full API documentation is available in [README.md](README.md)

## Support

If you encounter any issues:
1. Check the logs in `logs/` directory
2. Verify environment variables in `.env`
3. Make sure MongoDB is running
4. Check Node.js version: `node --version` (should be v16+)

---

**Happy Coding! 🚀**
