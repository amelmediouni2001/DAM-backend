# 🔐 Google OAuth Authentication Guide

> **Updated Setup**: JWT tokens now use Google OAuth's `sub` (providerId) for authentication. No more manual token generation needed!

## 🚀 How It Works Now

1. **User logs in via Google OAuth**
2. **Google returns a token with `sub` (unique user ID)**
3. **Backend creates/finds user and returns JWT token using Google's `sub`**
4. **All subsequent requests use this JWT token for authentication**
5. **Backend validates token against user's `providerId` in MongoDB**

---

## 📋 Step-by-Step Setup

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
   - Select **Web application**
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback`
     - `http://10.0.2.2:3000/auth/google/callback` (Android emulator)
   - Save your **Client ID** and **Client Secret**

### Step 2: Update `.env` File

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_from_console
GOOGLE_CLIENT_SECRET=your_client_secret_from_console
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRATION=7d
```

### Step 3: Get Google OAuth Token

#### Option A: Using OAuth Playground (Easiest for Testing)

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Click the settings icon (⚙️) on the right
3. Check "Use your own OAuth credentials"
4. Enter your Google Client ID and Client Secret
5. Select Google+ API scope: `https://www.googleapis.com/auth/userinfo.profile`
6. Click "Authorize APIs"
7. Allow access
8. Copy the **ID Token** from step 1 (not the access token)

#### Option B: Using Your Frontend/Mobile App

Request OAuth token from your frontend and send to backend:

```javascript
// Frontend (React/Vue/etc)
const googleToken = await getGoogleToken(); // From google-signin library
```

#### Option C: Using curl

```bash
# After getting authorization code from OAuth flow
curl -X POST https://oauth2.googleapis.com/token \
  -d "code=AUTH_CODE&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&redirect_uri=http://localhost:3000/auth/google/callback&grant_type=authorization_code"
```

---

## 🔑 Login with Google OAuth

### Request

```bash
POST /auth/social-login

{
  "provider": "google",
  "token": "YOUR_GOOGLE_ID_TOKEN_HERE"
}
```

### Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439010",
    "email": "user@example.com",
    "name": "John Doe",
    "photoUrl": "https://...",
    "provider": "google",
    "score": 0,
    "level": 1
  }
}
```

### JWT Token Payload

```json
{
  "sub": "118364127932195631200",  // Google's user ID
  "email": "user@example.com",
  "provider": "google",
  "iat": 1763038249,
  "exp": 1763124649
}
```

---

## 🧪 Testing in Swagger

### Step 1: Get Google OAuth Token

Follow "Option A: OAuth Playground" above to get your token

### Step 2: Login and Get JWT

In Swagger at `http://localhost:3000/api/docs`:

1. Find endpoint: **POST /auth/social-login**
2. Click "Try it out"
3. Enter request body:
   ```json
   {
     "provider": "google",
     "token": "YOUR_GOOGLE_ID_TOKEN"
   }
   ```
4. Click "Execute"
5. Copy the `accessToken` from response

### Step 3: Authorize Swagger

1. Click **"Authorize"** button (🔒 icon, top right)
2. Paste your JWT token (WITHOUT "Bearer" prefix):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Click **"Authorize"** in the modal
4. All protected endpoints now work! ✅

### Step 4: Test Avatar Endpoints

- **POST** `/api/avatars` - Create new avatar
- **GET** `/api/avatars` - Get all avatars
- **PUT** `/api/avatars/{id}` - Update avatar
- **DELETE** `/api/avatars/{id}` - Delete avatar

---

## 📱 Android Integration (Kotlin)

### 1. Add Google Play Services Dependency

```gradle
dependencies {
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
}
```

### 2. Get Google OAuth Token

```kotlin
val googleSignInClient = GoogleSignIn.getClient(context, GoogleSignInOptions.Builder().requestIdToken(WEB_CLIENT_ID).build())
val task = googleSignInClient.signInIntent
startActivityForResult(task, RC_SIGN_IN)

override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    
    if (requestCode == RC_SIGN_IN) {
        val task = GoogleSignIn.getSignedInAccountFromIntent(data)
        val account = task.result
        val idToken = account?.idToken
        
        // Send to backend
        loginWithGoogle(idToken!!)
    }
}
```

### 3. Login with Backend

```kotlin
suspend fun loginWithGoogle(idToken: String) {
    val response = apiService.socialLogin(SocialLoginRequest(provider = "google", token = idToken))
    val jwtToken = response.accessToken
    
    // Save JWT for future requests
    PreferencesManager.saveJwtToken(jwtToken)
}
```

### 4. Use JWT in API Calls

```kotlin
// In Retrofit interceptor
chain.request().newBuilder()
    .header("Authorization", "Bearer $jwtToken")
    .build()
```

---

## 🍎 iOS Integration (Swift)

### 1. Add Google Sign-In

```swift
pod 'GoogleSignIn'
```

### 2. Get Google OAuth Token

```swift
import GoogleSignIn

GIDSignIn.sharedInstance.signIn(withPresenting: self) { signInResult, error in
    guard let signInResult = signInResult else {
        print("Error signing in: \(error?.localizedDescription ?? "Unknown")")
        return
    }
    
    let user = signInResult.user
    let idToken = user.idToken?.tokenString
    
    // Send to backend
    loginWithGoogle(idToken: idToken ?? "")
}
```

### 3. Login with Backend

```swift
func loginWithGoogle(idToken: String) {
    let request = SocialLoginRequest(provider: "google", token: idToken)
    
    // POST to /auth/social-login
    apiClient.post("/auth/social-login", body: request) { response in
        let jwtToken = response.accessToken
        KeychainManager.saveJwtToken(jwtToken)
    }
}
```

### 4. Use JWT in API Calls

```swift
// In URLSession delegate
var request = URLRequest(url: url)
if let jwtToken = KeychainManager.getJwtToken() {
    request.setValue("Bearer \(jwtToken)", forHTTPHeaderField: "Authorization")
}
```

---

## 🔄 Token Refresh Strategy

### Current Setup
- Tokens expire after **7 days** (configurable via `JWT_EXPIRATION`)
- When expired, user must re-login with Google OAuth

### Future Enhancement
Add refresh tokens to avoid re-login:

```typescript
// In generateAuthResponse, also return refreshToken
const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

return {
  accessToken,
  refreshToken,
  user: safeUser,
};
```

Then create refresh endpoint:
```typescript
@Post('refresh')
async refresh(@Body() dto: { refreshToken: string }) {
  // Validate refresh token and generate new access token
}
```

---

## 🛡️ Security Best Practices

### 1. Store JWT Securely

**❌ Don't:**
```javascript
localStorage.setItem('token', jwtToken); // Vulnerable to XSS
```

**✅ Do:**
```javascript
// HTTP-Only Cookie (secure, sameSite)
// Or secure storage in mobile apps
```

### 2. Always Use HTTPS in Production

```bash
# In .env production
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
```

### 3. Validate Provider ID

Backend validates:
- Token signature (using JWT_SECRET)
- Token expiration (7 days)
- User exists in database
- User is active (isActive: true)

### 4. CORS Configuration

Currently allows:
- `http://localhost:3000`
- `http://10.0.2.2:3000` (Android emulator)
- `http://localhost:3001`

Update for production domains in `main.ts`

---

## 🐛 Troubleshooting

### "Unauthorized - User not found"
- **Cause**: User exists but with wrong `providerId`
- **Fix**: Check MongoDB that `user.provider = 'google'` and `user.providerId` matches Google `sub`

### "Invalid Google token"
- **Cause**: Token expired or invalid
- **Fix**: Get fresh token from Google OAuth Playground

### "JWT token malformed"
- **Cause**: Token corrupted in transit
- **Fix**: Ensure Authorization header uses format: `Bearer <token>`

### "CORS error"
- **Cause**: Origin not in CORS whitelist
- **Fix**: Add your domain to `app.enableCors()` in `main.ts`

### "User account is inactive"
- **Cause**: `user.isActive = false` in database
- **Fix**: Update user document: `db.users.updateOne({_id: ObjectId(...)}, {$set: {isActive: true}})`

---

## 📊 Database User Structure

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439010"),
  email: "user@gmail.com",
  name: "John Doe",
  provider: "google",                        // 'google', 'facebook', or 'local'
  providerId: "118364127932195631200",      // Google's sub (unique user ID)
  photoUrl: "https://...",
  isActive: true,
  score: 0,
  level: 1,
  createdAt: ISODate("2025-11-13T..."),
  updatedAt: ISODate("2025-11-13T..."),
  __v: 0
}
```

---

## 🎯 Complete Flow Diagram

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
       │ 1. User clicks "Sign in with Google"
       │
       ▼
┌─────────────────┐
│  Google OAuth   │
└──────┬──────────┘
       │
       │ 2. Returns ID Token (with sub)
       │
       ▼
┌──────────────────────────────────────┐
│  POST /auth/social-login             │
│  Body: {provider: "google", token}   │
└──────────┬───────────────────────────┘
           │
           │ 3. Validate Google token
           │    Extract: sub, email, name
           │
           ▼
    ┌─────────────────┐
    │  MongoDB User   │
    │ Find/Create     │
    │ with providerId │
    └─────────────────┘
           │
           │ 4. Generate JWT using providerId as sub
           │
           ▼
┌──────────────────────────────┐
│  Return JWT Token            │
│  {accessToken, user}         │
└──────────┬───────────────────┘
           │
           │ 5. Store JWT in client
           │
           ▼
┌──────────────────────────┐
│  Protected Endpoints     │
│ Header: Authorization    │
│ Value: Bearer <JWT>      │
└──────────────────────────┘
           │
           │ 6. Validate JWT
           │    Extract sub (providerId)
           │    Find user by providerId
           │
           ▼
    ┌──────────────┐
    │  Request OK  │
    └──────────────┘
```

---

## 📚 References

- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/web)
- [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
- [NestJS Passport Documentation](https://docs.nestjs.com/recipes/passport)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)

---

**Last Updated**: November 13, 2025
**Status**: Production Ready ✅
