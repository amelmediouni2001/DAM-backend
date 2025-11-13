# Avatar System Documentation

## Overview
This document provides a complete guide for the avatar system in the Piano Learning Game backend. The avatar system allows users to create, customize, and manage their avatars that assist them while playing.

---

## 📊 Database Schema

### Avatar Collection

```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  userId: ObjectId,                 // Reference to User
  name: String,                     // Avatar name (e.g., "Luna", "Max")
  
  customization: {
    style: String,                  // 'anime', 'cartoon', 'pixel', 'realistic'
    bodyType: String,               // 'slim', 'round', 'athletic'
    skinTone: String,               // 'light', 'medium', 'dark', 'brown'
    hairstyle: String,              // 'short', 'long', 'curly', 'straight'
    hairColor: String,              // 'black', 'brown', 'blonde', 'red'
    eyeStyle: String,               // 'round', 'almond', 'cat', 'big'
    eyeColor: String,               // 'blue', 'brown', 'green'
    clothingType: String,           // 'casual', 'formal', 'sporty'
    clothingColor: String,
    accessories: [String]           // ['glasses', 'hat', 'earrings']
  },
  
  isActive: Boolean,                // Currently active avatar
  expression: String,               // 'happy', 'sad', 'excited', 'thinking', 'neutral'
  avatarImageUrl: String,           // URL to generated avatar image
  
  energy: Number,                   // 0-100 (reset daily or after sleep)
  experience: Number,               // Total XP earned
  level: Number,                    // Avatar level (XP-based)
  
  state: String,                    // 'idle', 'playing', 'celebrating', 'thinking'
  
  outfits: {
    unlocked: [String],             // Outfit IDs user has unlocked
    equipped: String                // Currently equipped outfit ID
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- `userId`: For fast lookups of all user avatars
- `userId + isActive`: For finding active avatar

---

## 🔧 API Endpoints

### 1. Create Avatar
**POST** `/api/avatars`

Create a new avatar with customization options.

**Request Body:**
```json
{
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
    "accessories": ["glasses", "hat"]
  },
  "avatarImageUrl": "https://example.com/avatar.png"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439010",
  "name": "Luna",
  "customization": { ... },
  "isActive": true,
  "expression": "happy",
  "energy": 100,
  "experience": 0,
  "level": 1,
  "state": "idle",
  "outfits": {
    "unlocked": ["outfit_default"],
    "equipped": "outfit_default"
  }
}
```

---

### 2. Get All Avatars
**GET** `/api/avatars`

Retrieve all avatars for the authenticated user.

**Response:** `200 OK`
```json
[
  { /* avatar object 1 */ },
  { /* avatar object 2 */ }
]
```

---

### 3. Get Active Avatar
**GET** `/api/avatars/active`

Get the currently active avatar.

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Luna",
  ...
}
```

---

### 4. Get Avatar by ID
**GET** `/api/avatars/:avatarId`

Retrieve a specific avatar by ID.

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  ...
}
```

---

### 5. Update Avatar
**PUT** `/api/avatars/:avatarId`

Update avatar details (name, customization, expression, state, energy, outfit).

**Request Body:**
```json
{
  "name": "Luna Updated",
  "expression": "excited",
  "state": "celebrating",
  "energy": 85,
  "equippedOutfit": "outfit_premium"
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  ...
}
```

---

### 6. Set Avatar as Active
**POST** `/api/avatars/:avatarId/activate`

Set a specific avatar as the active one.

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "isActive": true,
  ...
}
```

---

### 7. Delete Avatar
**DELETE** `/api/avatars/:avatarId`

Delete an avatar (must have at least one avatar remaining).

**Response:** `200 OK`
```json
{
  "message": "Avatar deleted successfully"
}
```

---

## 🎮 Gameplay Endpoints

### 8. Update Avatar Expression
**PUT** `/api/avatars/:avatarId/expression`

Update the avatar's facial expression during gameplay.

**Request Body:**
```json
{
  "expression": "excited"
}
```

**Valid values:** `happy`, `sad`, `excited`, `thinking`, `neutral`

---

### 9. Update Avatar State
**PUT** `/api/avatars/:avatarId/state`

Update the avatar's state during gameplay.

**Request Body:**
```json
{
  "state": "playing"
}
```

**Valid values:** `idle`, `playing`, `celebrating`, `thinking`

---

### 10. Update Avatar Energy
**PUT** `/api/avatars/:avatarId/energy`

Modify avatar energy during gameplay (e.g., -10 for energy consumed, +10 for recovery).

**Request Body:**
```json
{
  "energyDelta": -10
}
```

**Note:** Energy is automatically clamped between 0-100.

---

### 11. Add Experience
**POST** `/api/avatars/:avatarId/experience`

Award experience points to the avatar. Automatically handles leveling (1 level = 100 XP).

**Request Body:**
```json
{
  "xpGain": 50
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "experience": 50,
  "level": 1,
  ...
}
```

---

### 12. Get Avatar Stats
**GET** `/api/avatars/:avatarId/stats`

Retrieve avatar statistics for display in UI.

**Response:** `200 OK`
```json
{
  "level": 2,
  "experience": 150,
  "energy": 85,
  "outfitsUnlocked": 3
}
```

---

## 👕 Outfit Management

### 13. Equip Outfit
**POST** `/api/avatars/:avatarId/outfits/:outfitId/equip`

Equip an outfit on the avatar (must be unlocked first).

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "outfits": {
    "unlocked": ["outfit_default", "outfit_casual", "outfit_premium"],
    "equipped": "outfit_premium"
  },
  ...
}
```

---

### 14. Unlock Outfit
**POST** `/api/avatars/:avatarId/outfits/:outfitId/unlock`

Unlock a new outfit for the avatar (typically after achievements or milestones).

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "outfits": {
    "unlocked": ["outfit_default", "outfit_casual", "outfit_premium"],
    "equipped": "outfit_default"
  },
  ...
}
```

---

## 🔐 Authentication

All endpoints require JWT authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📱 Mobile Integration

### Android (Kotlin)
```kotlin
// Create avatar
val avatarRequest = CreateAvatarRequest(
    name = "Luna",
    customization = AvatarCustomization(
        style = "anime",
        bodyType = "slim",
        // ... other customization fields
    )
)
apiService.createAvatar(token, avatarRequest)

// Update energy during gameplay
apiService.updateAvatarEnergy(token, avatarId, -10)

// Add experience after level completion
apiService.addAvatarExperience(token, avatarId, 100)
```

### iOS (SwiftUI)
```swift
// Fetch active avatar
struct AvatarResponse: Codable {
    let id: String
    let name: String
    let customization: AvatarCustomization
    let energy: Int
    let level: Int
}

let activeAvatar = try await apiService.fetchActiveAvatar(token: token)

// Update expression
try await apiService.updateExpression(
    token: token,
    avatarId: avatarId,
    expression: "excited"
)
```

---

## 💾 Example Avatar Profiles

### Avatar 1: Luna (Anime Style)
```json
{
  "name": "Luna",
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
```

### Avatar 2: Max (Cartoon Style)
```json
{
  "name": "Max",
  "style": "cartoon",
  "bodyType": "athletic",
  "skinTone": "medium",
  "hairstyle": "short",
  "hairColor": "brown",
  "eyeStyle": "round",
  "eyeColor": "brown",
  "clothingType": "sporty",
  "clothingColor": "blue",
  "accessories": ["headphones", "hat"]
}
```

---

## 🔄 Gameplay Flow Example

### During Piano Practice Session

```
1. GET /api/avatars/active
   → Returns active avatar

2. PUT /api/avatars/:id/state
   Body: { "state": "playing" }
   → Avatar starts playing animation

3. PUT /api/avatars/:id/expression
   Body: { "expression": "excited" }
   → Avatar shows excitement

4. PUT /api/avatars/:id/energy
   Body: { "energyDelta": -5 }
   → Reduce energy as time passes

5. [User completes a piece]

6. POST /api/avatars/:id/experience
   Body: { "xpGain": 100 }
   → Award experience

7. PUT /api/avatars/:id/state
   Body: { "state": "celebrating" }
   → Celebration animation

8. PUT /api/avatars/:id/expression
   Body: { "expression": "happy" }
   → Show happiness
```

---

## 📊 Future Enhancement Ideas

1. **Avatar Personalities**: Add personality traits that affect dialogue
2. **Relationship System**: Track user-avatar relationship level
3. **Mini-games**: Avatar-specific mini-games for bonuses
4. **Cosmetic Shop**: Use in-game currency for outfit purchases
5. **Avatar Customization Presets**: Save and share custom avatar designs
6. **Avatar Animations**: More complex animations for different states
7. **Social Features**: Share avatars with friends
8. **Seasonal Content**: Limited-time outfits and customization options

---

## 🚀 Testing with Swagger

1. Navigate to `http://localhost:3000/api/docs`
2. Click the "Authorize" button
3. Enter your JWT token
4. Try all endpoints directly from the UI

---

## ⚠️ Error Handling

All endpoints return standard HTTP status codes:

- **200 OK**: Successful GET/PUT/DELETE
- **201 Created**: Successful POST (creation)
- **400 Bad Request**: Invalid input or validation error
- **401 Unauthorized**: Missing or invalid JWT token
- **404 Not Found**: Avatar or resource not found
- **500 Internal Server Error**: Server error

Example error response:
```json
{
  "statusCode": 404,
  "message": "Avatar with ID 507f1f77bcf86cd799439011 not found",
  "error": "Not Found"
}
```

---

## 📝 Summary

This avatar system provides:

✅ Complete avatar creation and customization  
✅ Multiple avatar management per user  
✅ Real-time gameplay state updates  
✅ Experience and leveling system  
✅ Outfit unlocking and equipping  
✅ Energy system for gameplay balance  
✅ Full Swagger documentation  
✅ JWT authentication  
✅ CORS support for mobile apps  

Happy coding! 🎵🎮
