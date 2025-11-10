# DAM (Digital Asset Management) Backend

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  <h2 align="center">Built with NestJS and MongoDB</h2>
</p>

## Overview

A robust backend API built with NestJS and MongoDB that provides a secure foundation for user authentication and management. This project implements industry-standard security practices including JWT authentication, password hashing with bcrypt, and protected routes.

### Key Technologies
- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications
- **MongoDB**: NoSQL database for flexible data storage
- **JWT**: JSON Web Tokens for secure authentication
- **Bcrypt**: Industry-standard password hashing
- **TypeScript**: For type-safe code and better developer experience

## Features

### Authentication System
- **User Registration**: Complete user signup with email verification
- **Secure Login**: JWT-based authentication system
- **Password Recovery**: Forgot and reset password functionality
- **Protected Routes**: Endpoint security with JWT Guards
- **Profile Management**: User profile viewing and updating

### Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with Guards
- Input validation and sanitization
- MongoDB injection prevention

### Data Management
- MongoDB integration with Mongoose
- Structured data schemas
- Indexed and unique fields
- Automatic timestamps

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (running locally or a remote connection)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dam-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Then edit .env with your specific values
```

Note: Make sure you have MongoDB running locally or update the MONGODB_URI in .env to point to your MongoDB instance.

## Running the Application

```bash
# development mode with hot reload
npm run start:dev

# production mode
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

#### Register New User
- **POST** `/auth/register`
- **Body:**
```json
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "avatarURL": "https://example.com/avatar.jpg"
}
```
- **Response:**
```json
{
    "user": {
        "_id": "user_id",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "avatarURL": "https://example.com/avatar.jpg",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    },
    "access_token": "jwt_token"
}
```

#### Login
- **POST** `/auth/login`
- **Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```
- **Response:**
```json
{
    "access_token": "jwt_token"
}
```

#### Get User Profile
- **GET** `/auth/profile`
- **Headers:** `Authorization: Bearer jwt_token`
- **Response:** User object without password

#### Forgot Password
- **POST** `/auth/forgot-password`
- **Body:**
```json
{
    "email": "john@example.com"
}
```
- **Response:**
```json
{
    "message": "Reset token generated successfully",
    "resetToken": "generated-token"
}
```

#### Reset Password
- **POST** `/auth/reset-password`
- **Body:**
```json
{
    "token": "reset-token",
    "newPassword": "new-password123"
}
```
- **Response:**
```json
{
    "message": "Password reset successfully"
}
```

## Database Schema

### User Schema
```typescript
{
    fullName: string,
    email: string (unique, indexed),
    password: string (hashed),
    phone: string,
    avatarURL: string (optional),
    resetToken: string (optional),
    resetTokenExpiry: Date (optional),
    createdAt: Date,
    updatedAt: Date
}
```

## Testing

### Using Postman
A comprehensive Postman collection is included (`DAM-Project.postman_collection.json`) with pre-configured requests for all endpoints.

1. Import the collection into Postman
2. Set up an environment with:
   - `baseUrl`: `http://localhost:3000`
   - `jwt_token`: Auto-populated after login

### Automated Tests
```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## Security Features

- Password Hashing with bcrypt
- JWT-based Authentication
- Protected Routes with Guards
- Input Validation
- MongoDB Injection Prevention

## Project Structure
```
src/
├── auth/
│   ├── dto/
│   │   ├── register.dto.ts
│   │   ├── login.dto.ts
│   │   ├── forgot-password.dto.ts
│   │   └── reset-password.dto.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── schemas/
│   └── user.schema.ts
├── app.module.ts
└── main.ts
```

## License

This project is licensed under the MIT License.
