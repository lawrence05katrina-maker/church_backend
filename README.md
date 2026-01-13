# 🚀 Backend Setup Guide - Devasahayam Mount Shrine Website

## 📋 Prerequisites

Before setting up the backend, make sure you have the following installed:

### 1. **Node.js & npm**
- Download and install Node.js (v16 or higher) from: https://nodejs.org/
- npm comes bundled with Node.js
- Verify installation:
```bash
node --version
npm --version
```

### 2. **PostgreSQL Database**
- Download and install PostgreSQL from: https://www.postgresql.org/downloads/
- During installation, remember the password you set for the `postgres` user
- Verify installation:
```bash
psql --version
```

### 3. **Git (Optional)**
- Download from: https://git-scm.com/downloads
- Only needed if you want to clone from repository

---

## 🛠️ Step-by-Step Setup

### Step 1: Extract and Navigate to Backend Folder
```bash
# Extract the zip file you received
# Navigate to the backend folder
cd path/to/backend
```

### Step 2: Install Dependencies
```bash
# Install all required npm packages
npm install
```

### Step 3: Database Setup

#### 3.1 Create Database
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create the database
CREATE DATABASE shrine_db;

# Exit psql
\q
```

#### 3.2 Run Database Schema
```bash
# Run the schema file to create all tables
psql -U postgres -d shrine_db -f ../database/schema.sql
```

### Step 4: Environment Configuration

#### 4.1 Update .env File
Open `backend/.env` file and update the database credentials:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shrine_db

# JWT Configuration (keep as is)
JWT_SECRET=shrine_jwt_secret_key_2024_devasahayam_mount_secure_token
JWT_EXPIRES_IN=24h

# Admin Configuration (keep as is)
ADMIN_SESSION_TIMEOUT=24h
```

**⚠️ Important:** Replace `YOUR_POSTGRES_PASSWORD_HERE` with your actual PostgreSQL password.

### Step 5: Create Uploads Directory
```bash
# Create uploads directories for file storage
mkdir -p uploads/gallery
mkdir -p uploads/donations
mkdir -p uploads/payments
mkdir -p uploads/management
```

### Step 6: Start the Backend Server

#### Development Mode (with auto-restart):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

---

## 🔧 Available Commands

```bash
# Install dependencies
npm install

# Start server in development mode (auto-restart on changes)
npm run dev

# Start server in production mode
npm start

# Check if server is running
curl http://localhost:5000/api/health
```

---

## 🌐 API Endpoints

Once the server is running, you can access:

- **Base URL:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`
- **Admin Login:** `http://localhost:5000/api/admin/login`
- **Donations:** `http://localhost:5000/api/donations`
- **Gallery:** `http://localhost:5000/api/gallery`
- **Contact:** `http://localhost:5000/api/contact`

---

## 🔐 Default Admin Setup

### Create First Admin User
After the server is running, you need to create an admin user. You can do this by:

1. **Using Database Direct Insert:**
```sql
-- Connect to database
psql -U postgres -d shrine_db

-- Insert admin user (password: admin123)
INSERT INTO admins (username, password, email, role) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@shrine.com', 'admin');
```

2. **Default Login Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

**⚠️ Important:** Change the default password immediately after first login!

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # API route handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication & validation
│   ├── db/            # Database connection
│   ├── app.js         # Express app configuration
│   ├── server.js      # Server startup
│   └── index.js       # Main entry point
├── uploads/           # File storage directory
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
└── README.md         # Documentation
```

---

## 🐛 Troubleshooting

### Common Issues:

#### 1. **Database Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Make sure PostgreSQL is running and credentials in `.env` are correct.

#### 2. **Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process using port 5000 or change port in `server.js`.

#### 3. **Permission Denied on Uploads**
```
Error: EACCES: permission denied, mkdir 'uploads'
```
**Solution:** Create uploads directory manually or check folder permissions.

#### 4. **Module Not Found**
```
Error: Cannot find module 'express'
```
**Solution:** Run `npm install` to install all dependencies.

---

## 🔄 Testing the Setup

### 1. **Health Check**
```bash
curl http://localhost:5000/api/health
# Should return: {"status": "OK", "message": "Server is running"}
```

### 2. **Database Connection**
```bash
curl http://localhost:5000/api/donations
# Should return: {"success": true, "data": []}
```

### 3. **Admin Login**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "shrine@admin123"}'
# Should return: {"success": true, "token": "..."}
```

---

## 📞 Support

If you encounter any issues:

1. **Check the console logs** for error messages
2. **Verify all prerequisites** are installed correctly
3. **Double-check database credentials** in `.env` file
4. **Ensure PostgreSQL service** is running
5. **Check if port 5000** is available

---

## 🚀 Next Steps

After successful setup:

1. **Change default admin password**
2. **Set up the frontend** to connect to this backend
3. **Configure file upload limits** if needed
4. **Set up SSL certificates** for production
5. **Configure backup strategy** for the database

---

## 📝 Notes

- The server runs on **port 5000** by default
- All uploaded files are stored in the `uploads/` directory
- Database uses **PostgreSQL** with connection pooling
- JWT tokens expire after **24 hours**
- CORS is enabled for frontend integration

**🎉 Your backend should now be running successfully!**