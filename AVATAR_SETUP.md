# Piano Learning Game - Avatar System Backend Setup

## 📋 Overview

This backend provides a complete avatar system for your piano learning game. Users can create custom anime-style avatars that assist them during gameplay with expressions, states, energy management, leveling, and outfit customization.

---

## ✨ Features

### Avatar Creation & Customization
- **Multiple Avatar Styles**: Anime, Cartoon, Pixel, Realistic
- **Customization Options**:
  - Body type (slim, round, athletic)
  - Skin tone, hairstyle, hair color
  - Eye style and color
  - Clothing and accessories
- **Multiple Avatars Per User**: Create and manage multiple avatars

### Gameplay Integration
- **Real-time State Management**:
  - Expression (happy, sad, excited, thinking, neutral)
  - State (idle, playing, celebrating, thinking)
  - Energy level (0-100%)

### Progression System
- **Experience & Leveling**: Earn XP and level up avatars
- **Outfit Unlocking**: Unlock and equip different outfits
- **Statistics Tracking**: Monitor avatar progress

### API Documentation
- **Swagger UI**: Interactive API documentation at `/api/docs`
- **JWT Authentication**: Secure endpoints with bearer tokens
- **CORS Enabled**: Support for mobile apps (Android & iOS)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

If `@nestjs/swagger` wasn't installed yet:
```bash
npm install @nestjs/swagger
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dam-learning-game
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### 3. Start Development Server

```bash
npm run start:dev
```

Server will run on `http://localhost:3000`

### 4. Access Swagger Documentation

Open browser and navigate to:
```
http://localhost:3000/api/docs
```

---

## 📁 Project Structure

```
src/
├── avatar/                    # Avatar module
│   ├── avatar.controller.ts   # API endpoints
│   ├── avatar.service.ts      # Business logic
│   ├── avatar.module.ts       # Module definition
│   └── dto/
│       ├── create-avatar.dto.ts
│       ├── update-avatar.dto.ts
│       └── avatar-response.dto.ts
├── schemas/
│   ├── avatar.schema.ts       # MongoDB avatar schema
│   └── user.schema.ts         # Existing user schema
├── auth/                      # Authentication (existing)
├── app.module.ts              # Root module
└── main.ts                    # Application entry point
```

---

## 📚 Database Schema

### Avatar Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,              // Reference to User
  name: String,
  customization: {
    style: String,               // "anime", "cartoon", "pixel", "realistic"
    bodyType: String,
    skinTone: String,
    hairstyle: String,
    hairColor: String,
    eyeStyle: String,
    eyeColor: String,
    clothingType: String,
    clothingColor: String,
    accessories: [String]
  },
  isActive: Boolean,             // Current active avatar
  expression: String,            // "happy", "sad", "excited", "thinking", "neutral"
  avatarImageUrl: String,
  energy: Number,                // 0-100
  experience: Number,            // Total XP
  level: Number,                 // Avatar level
  state: String,                 // "idle", "playing", "celebrating", "thinking"
  outfits: {
    unlocked: [String],
    equipped: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication Required (Bearer Token)

All endpoints below require JWT authentication header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Avatar Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/avatars` | Create new avatar |
| GET | `/api/avatars` | Get all user avatars |
| GET | `/api/avatars/active` | Get active avatar |
| GET | `/api/avatars/:avatarId` | Get specific avatar |
| PUT | `/api/avatars/:avatarId` | Update avatar details |
| POST | `/api/avatars/:avatarId/activate` | Set as active |
| DELETE | `/api/avatars/:avatarId` | Delete avatar |

### Gameplay Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/avatars/:avatarId/expression` | Update expression |
| PUT | `/api/avatars/:avatarId/state` | Update state |
| PUT | `/api/avatars/:avatarId/energy` | Modify energy |
| POST | `/api/avatars/:avatarId/experience` | Add experience |
| GET | `/api/avatars/:avatarId/stats` | Get avatar stats |

### Outfit Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/avatars/:avatarId/outfits/:outfitId/equip` | Equip outfit |
| POST | `/api/avatars/:avatarId/outfits/:outfitId/unlock` | Unlock outfit |

---

## 📱 Example Requests

### Create Avatar

```bash
curl -X POST http://localhost:3000/api/avatars \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Luna",
    "customization": {
      "style": "anime",
      "bodyType": "slim",
      "skinTone": "light",
      "hairstyle": "long",
      "hairColor": "black",
      "eyeStyle": "big",
      "eyeColor": "blue",
      "clothingType": "casual",
      "clothingColor": "pink",
      "accessories": ["glasses"]
    }
  }'
```

### Get Active Avatar

```bash
curl http://localhost:3000/api/avatars/active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Avatar Energy (Gameplay)

```bash
curl -X PUT http://localhost:3000/api/avatars/AVATAR_ID/energy \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"energyDelta": -10}'
```

### Add Experience

```bash
curl -X POST http://localhost:3000/api/avatars/AVATAR_ID/experience \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"xpGain": 100}'
```

---

## 🧪 Testing with Swagger

1. Open `http://localhost:3000/api/docs` in your browser
2. Click **Authorize** button (top right)
3. Enter your JWT token: `Bearer <your_token>`
4. Test endpoints directly from the UI
5. All request/response bodies are documented

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run linter
npm run lint

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Format code
npm run format
```

---

## 🔐 Authentication Flow

1. User logs in via Google/Facebook/Local auth → Receives JWT token
2. Frontend stores JWT token
3. All API requests include token in Authorization header
4. Backend validates JWT and extracts userId from token
5. Operations automatically scoped to authenticated user

---

## 📊 MongoDB Queries Reference

### Find all avatars for a user
```javascript
db.avatars.find({ userId: ObjectId("...") })
```

### Find active avatar
```javascript
db.avatars.findOne({ userId: ObjectId("..."), isActive: true })
```

### Update avatar energy
```javascript
db.avatars.updateOne(
  { _id: ObjectId("...") },
  { $set: { energy: 85 } }
)
```

### Add experience
```javascript
db.avatars.updateOne(
  { _id: ObjectId("...") },
  { $inc: { experience: 100 } }
)
```

---

## 🐛 Troubleshooting

### Connection Issues
- **Issue**: MongoDB connection failed
  - **Solution**: Check `MONGODB_URI` in `.env` file
  - Ensure MongoDB cluster allows connections from your IP

### Authentication Failed
- **Issue**: 401 Unauthorized errors
  - **Solution**: Verify JWT token is valid and not expired
  - Check token format: `Authorization: Bearer <token>`

### Swagger Not Loading
- **Issue**: `/api/docs` returns 404
  - **Solution**: Ensure `@nestjs/swagger` is installed
  - Run `npm install @nestjs/swagger`

### Build Errors
- **Issue**: TypeScript compilation errors
  - **Solution**: Run `npm run lint --fix` to auto-fix issues
  - Delete `dist/` folder and rebuild: `npm run build`

---

## 📋 Checklist Before Deployment

- [ ] MongoDB connection tested
- [ ] JWT secret changed from default
- [ ] CORS origins updated for production
- [ ] Environment variables set correctly
- [ ] Build passes without errors: `npm run build`
- [ ] All tests pass: `npm run test`
- [ ] Swagger docs accessible

---

## 🚀 Deployment Tips

### Environment Variables for Production
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod_user:prod_pass@cluster.mongodb.net/dam-game
JWT_SECRET=<very-secure-random-string>
CORS_ORIGIN=https://yourdomain.com
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

---

## 📖 Additional Documentation

- **[AVATAR_SYSTEM.md](./AVATAR_SYSTEM.md)** - Detailed API documentation
- **[MOBILE_INTEGRATION.md](./MOBILE_INTEGRATION.md)** - Android & iOS integration guides
- **[.env.example](./.env.example)** - Environment variables template

---

## 🤝 Next Steps

1. **Frontend Integration**: Use the endpoints in Kotlin (Android) or Swift (iOS)
2. **Avatar Image Generation**: Implement avatar rendering service
3. **Dialog System**: Design assistant dialogs for gameplay
4. **Analytics**: Track avatar usage and progression
5. **Leaderboard**: Implement avatar ranking system

---

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review Swagger documentation at `/api/docs`
3. Check MongoDB connection and data
4. Verify JWT tokens are valid

---

**Happy coding! 🎵🎮**

Version: 1.0.0  
Last Updated: November 2024
