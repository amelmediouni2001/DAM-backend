# Avatar API - Quick Reference Card

## Base URL
```
http://localhost:3000
```

## Authentication
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## ⚡ Quick Endpoints

### Create Avatar
```
POST /api/avatars
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
    "accessories": ["glasses"]
  }
}
```

### Get Active Avatar
```
GET /api/avatars/active
```

### Get Avatar by ID
```
GET /api/avatars/{avatarId}
```

### Get All Avatars
```
GET /api/avatars
```

### Set Avatar as Active
```
POST /api/avatars/{avatarId}/activate
```

### Delete Avatar
```
DELETE /api/avatars/{avatarId}
```

---

## 🎮 Gameplay Endpoints

### Update Expression
```
PUT /api/avatars/{avatarId}/expression
{ "expression": "happy|sad|excited|thinking|neutral" }
```

### Update State
```
PUT /api/avatars/{avatarId}/state
{ "state": "idle|playing|celebrating|thinking" }
```

### Update Energy
```
PUT /api/avatars/{avatarId}/energy
{ "energyDelta": -10 }  // Can be positive or negative
```

### Add Experience
```
POST /api/avatars/{avatarId}/experience
{ "xpGain": 100 }
```

### Get Stats
```
GET /api/avatars/{avatarId}/stats
```

---

## 👕 Outfits

### Equip Outfit
```
POST /api/avatars/{avatarId}/outfits/{outfitId}/equip
```

### Unlock Outfit
```
POST /api/avatars/{avatarId}/outfits/{outfitId}/unlock
```

---

## 🎨 Valid Values

### Style
- `anime`
- `cartoon`
- `pixel`
- `realistic`

### Body Type
- `slim`
- `round`
- `athletic`

### Skin Tone
- `light`
- `medium`
- `dark`
- `brown`

### Expression
- `happy`
- `sad`
- `excited`
- `thinking`
- `neutral`

### State
- `idle`
- `playing`
- `celebrating`
- `thinking`

### Hairstyle
- `short`
- `long`
- `curly`
- `straight`

### Eye Style
- `round`
- `almond`
- `cat`
- `big`

### Clothing Type
- `casual`
- `formal`
- `sporty`

### Accessories (examples)
- `glasses`
- `hat`
- `earrings`
- `headphones`

---

## 📊 Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST - new resource) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## 🧪 Test Examples

### Create Avatar (cURL)
```bash
curl -X POST http://localhost:3000/api/avatars \
  -H "Authorization: Bearer eyJhbGc..." \
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

### Update Energy (cURL)
```bash
curl -X PUT http://localhost:3000/api/avatars/507f1f77bcf86cd799439011/energy \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"energyDelta": -10}'
```

### Add Experience (cURL)
```bash
curl -X POST http://localhost:3000/api/avatars/507f1f77bcf86cd799439011/experience \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"xpGain": 100}'
```

---

## 🔗 Useful Links

- **Swagger Docs**: `http://localhost:3000/api/docs`
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Postman Collection**: Import `DAM-Project.postman_collection.json`

---

## 💡 Tips

1. **Always include JWT token** in Authorization header
2. **Energy is clamped** between 0-100 automatically
3. **Level up = 100 XP** (XP / 100 = level)
4. **Must have at least 1 avatar** (can't delete last avatar)
5. **Only 1 active avatar per user** (activation auto-deactivates others)
6. **Outfit must be unlocked** before equipping
7. **Use Swagger UI** for easy testing and exploration

---

## 📱 Mobile Code Snippets

### Android (Kotlin)
```kotlin
// Add experience
apiService.addExperience(
    token = "Bearer $jwtToken",
    avatarId = "507f1f77bcf86cd799439011",
    xpGain = 100
)

// Update energy
apiService.updateEnergy(
    token = "Bearer $jwtToken",
    avatarId = "507f1f77bcf86cd799439011",
    energyDelta = -10
)
```

### iOS (Swift)
```swift
// Add experience
try await apiService.addExperience(
    avatarId: "507f1f77bcf86cd799439011",
    xpGain: 100
)

// Update expression
try await apiService.updateAvatarExpression(
    avatarId: "507f1f77bcf86cd799439011",
    expression: "excited"
)
```

---

**Last Updated**: November 2024
**Status**: ✅ Production Ready
