# Admin User Setup Guide

There are multiple ways to create an admin user for the bookstore application:

## Method 1: Automatic Admin Creation (Recommended)

The application automatically creates an admin user on startup if one doesn't exist:

- **Email:** `admin@bookstore.com`
- **Password:** `admin123`
- **Role:** `ADMIN`

**Note:** Change the password immediately after first login for security!

**If the automatic creation doesn't work**, check the console logs for any errors. You should see:
```
DataInitializer: Starting admin user initialization...
DataInitializer: Admin user not found. Creating new admin user...
Admin user created successfully!
```

If you don't see these messages, use one of the methods below.

## Method 2: Manual API Endpoint (Easiest if automatic fails)

If the automatic creation didn't work, you can manually trigger it via API:

```bash
POST http://localhost:8081/api/users/create-admin
```

This will create the admin user with:
- **Email:** `admin@bookstore.com`
- **Password:** `admin123`
- **Role:** `ADMIN`

**No authentication required** - this endpoint is public for initial setup.

## Method 3: Using MongoDB Compass

1. Open MongoDB Compass and connect to your database
2. Navigate to the `bookstore_db` database
3. Open the `users` collection
4. Click "Add Data" → "Insert Document"
5. Insert the following document (password must be BCrypt hashed):

```json
{
  "name": "Admin User",
  "email": "admin@bookstore.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "role": "ADMIN",
  "createdAt": {
    "$date": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note:** The password hash above is for `admin123`. To generate your own hash, you can:
- Use an online BCrypt generator
- Or register a user through the API and copy their password hash, then update the role

## Method 4: Through API (Register then Update Role)

1. Register a user through the API:
```bash
POST http://localhost:8081/api/users/register
{
  "name": "Admin User",
  "email": "admin@bookstore.com",
  "password": "yourSecurePassword"
}
```

2. Get the user ID from the response, then update the role to ADMIN:
```bash
PUT http://localhost:8081/api/users/{userId}/role
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "role": "ADMIN"
}
```

**Note:** You'll need to be authenticated (login first) to use the role update endpoint.

## Method 5: Using MongoDB Compass (Manual)

If you prefer to create the admin user directly in MongoDB:

1. **Generate a BCrypt hash** for your password. You can use:
   - Online tool: https://bcrypt-generator.com/
   - Or use the password hash from Method 1: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy` (for password: `admin123`)

2. **Open MongoDB Compass** and connect to your database

3. **Navigate to:** `bookstore_db` → `users` collection

4. **Click "Add Data" → "Insert Document"**

5. **Insert this document:**
```json
{
  "name": "Admin User",
  "email": "admin@bookstore.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "role": "ADMIN",
  "createdAt": {
    "$date": "2024-01-01T00:00:00.000Z"
  }
}
```

**Important:** Replace the password hash with your own if you want a different password!

## Changing Admin Password

To change the admin password:

1. Login with the current admin credentials
2. Use the update profile endpoint (if implemented)
3. Or update directly in MongoDB Compass (remember to hash the new password!)

## Security Recommendations

1. **Change default password immediately** after first login
2. Use a strong password (minimum 12 characters, mix of letters, numbers, symbols)
3. Consider implementing password reset functionality
4. For production, remove or disable the automatic admin creation

