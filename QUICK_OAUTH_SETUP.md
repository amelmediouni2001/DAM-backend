# 🚀 5-Minute Google OAuth Setup

## Step 1: Get Google OAuth Credentials (2 minutes)

### Option A: Test Quickly with OAuth Playground

1. Go to: https://developers.google.com/oauthplayground
2. Click ⚙️ (settings) on the right
3. Check: "Use your own OAuth credentials"
4. Enter from your `.env`:
   - Client ID: `GOOGLE_CLIENT_ID`
   - Client Secret: `GOOGLE_CLIENT_SECRET`
5. Select scope: `https://www.googleapis.com/auth/userinfo.profile`
6. Click "Authorize APIs"
7. Allow access
8. **Copy the ID Token** from the left panel (step 1)

### Option B: Proper Setup (create in console)

1. Go to: https://console.cloud.google.com
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `http://10.0.2.2:3000/auth/google/callback`
6. Copy Client ID & Secret
7. Update `.env` file

---

## Step 2: Test the Endpoint (2 minutes)

### Using cURL

```bash
curl -X POST http://localhost:3000/auth/social-login \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "google",
    "token": "PASTE_YOUR_GOOGLE_ID_TOKEN_HERE"
  }'
```

### Expected Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTgzNjQxMjc5MzIxOTU2MzEyMDAiLCJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwicHJvdmlkZXIiOiJnb29nbGUiLCJpYXQiOjE3NjMwMzgyNDksImV4cCI6MTc2MzEyNDY0OX0.gqLLaSCZcOqpoFuw0xlWlC6ojTiJCH9GVxIKb00WV1A",
  "user": {
    "id": "507f1f77bcf86cd799439010",
    "email": "user@gmail.com",
    "name": "John Doe",
    "photoUrl": "https://...",
    "provider": "google",
    "score": 0,
    "level": 1
  }
}
```

**Copy the `accessToken`!** ⬆️

---

## Step 3: Use in Swagger (1 minute)

1. Open: http://localhost:3000/api/docs
2. Click **Authorize** button 🔒 (top right)
3. Paste your token (from step 2):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Click **Authorize** button in modal
5. ✅ Done! All endpoints work now

---

## Test Endpoints

### Create Avatar

**POST** `/api/avatars`

```json
{
  "name": "Pianista",
  "customization": {
    "style": "kawaii",
    "bodyType": "round",
    "skinTone": "light",
    "hairstyle": "curly",
    "hairColor": "brown",
    "eyeStyle": "big",
    "eyeColor": "blue",
    "clothingType": "casual",
    "clothingColor": "pink",
    "accessories": ["glasses", "bow"]
  }
}
```

### Get All Avatars

**GET** `/api/avatars`

### Get Active Avatar

**GET** `/api/avatars/active`

---

## Common Issues

### "Invalid Google token"
- ❌ Using access token instead of ID token
- ✅ Use **ID Token** from OAuth Playground

### "Unauthorized"
- ❌ Not authorized in Swagger
- ✅ Click Authorize button first

### "User not found"
- ❌ Google account doesn't exist in database yet
- ✅ Make sure login endpoint was called first

### "CORS error"
- ❌ Using different domain
- ✅ Use `http://localhost:3000` or `http://10.0.2.2:3000`

---

## 🔄 Complete Workflow

```
1. Get Google ID Token
   ↓
2. POST /auth/social-login with token
   ↓
3. Get JWT accessToken back
   ↓
4. Authorize in Swagger with JWT
   ↓
5. Test Avatar endpoints
   ↓
6. Done! ✅
```

---

## For Mobile Developers

### Android
```kotlin
// Get token from Google Sign-In
val idToken = account?.idToken

// Send to backend
apiService.socialLogin(
  SocialLoginRequest(
    provider = "google",
    token = idToken!!
  )
)

// Get JWT and use in headers
val jwtToken = response.accessToken
```

### iOS
```swift
// Get token from Google Sign-In
let idToken = user.idToken?.tokenString

// Send to backend
apiClient.post("/auth/social-login", 
  body: ["provider": "google", "token": idToken])

// Get JWT and use in headers
let jwtToken = response.accessToken
```

---

## 📖 Full Guides

- 📚 `GOOGLE_OAUTH_GUIDE.md` - Complete setup & troubleshooting
- 📚 `AUTH_REFACTOR_SUMMARY.md` - What changed & why

---

**Ready?** Let's go! 🚀

**Next:** Get your Google ID Token from OAuth Playground, then test the endpoint above!
