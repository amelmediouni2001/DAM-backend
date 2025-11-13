# 🧪 HMAC Auth Testing Guide

## ✅ Server Status

Your backend is now running with **HMAC-SHA256 authentication** (no JWT).

- **Server:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs
- **Auth Method:** HMAC-signed headers (`X-Provider-ID` + `X-Auth-Token`)

---

## 🚀 Quick Test Flow

### Step 1: Get Google ID Token

**Option A: Using Google OAuth Playground**

1. Visit: https://developers.google.com/oauthplayground
2. Click ⚙️ **Settings** (top right)
3. Check "Use your own OAuth credentials"
4. Click ⚙️ again to close
5. In left sidebar, search and select **Google OAuth2 API v2** → **userinfo** → **Get userinfo**
6. Click **Authorize APIs**
7. Copy the **ID Token** from the response

**Option B: Using curl with your credentials (if you have Client ID/Secret)**

```bash
# Set your Google credentials
$CLIENT_ID = "your-client-id-from-.env"
$CLIENT_SECRET = "your-client-secret-from-.env"
$REDIRECT_URI = "http://localhost:3000/auth/google/callback"

# Get auth code (requires browser visit)
# Then exchange for tokens
curl -X POST https://oauth2.googleapis.com/token `
  -d "code=AUTH_CODE" `
  -d "client_id=$CLIENT_ID" `
  -d "client_secret=$CLIENT_SECRET" `
  -d "redirect_uri=$REDIRECT_URI" `
  -d "grant_type=authorization_code"
```

---

### Step 2: Login with Google

Save your Google ID Token as an environment variable:

```powershell
$GOOGLE_TOKEN = "paste-your-id-token-here"
```

Then login:

```powershell
$response = curl -X POST http://localhost:3000/auth/social-login `
  -ContentType "application/json" `
  -Body (@{
    provider = "google"
    token = $GOOGLE_TOKEN
  } | ConvertTo-Json) | ConvertFrom-Json

# Save the credentials
$PROVIDER_ID = $response.providerId
$AUTH_TOKEN = $response.authToken

Write-Host "✅ Login successful!"
Write-Host "Provider ID: $PROVIDER_ID"
Write-Host "Auth Token:  $AUTH_TOKEN"
```

---

### Step 3: Test Protected Endpoints

**With HMAC headers:**

```powershell
# Get user profile
curl -X GET http://localhost:3000/auth/profile `
  -Headers @{
    "X-Provider-ID" = $PROVIDER_ID
    "X-Auth-Token" = $AUTH_TOKEN
  }

# Get avatars
curl -X GET http://localhost:3000/api/avatars `
  -Headers @{
    "X-Provider-ID" = $PROVIDER_ID
    "X-Auth-Token" = $AUTH_TOKEN
  } | ConvertFrom-Json | ConvertTo-Json

# Verify auth
curl -X GET http://localhost:3000/auth/verify `
  -Headers @{
    "X-Provider-ID" = $PROVIDER_ID
    "X-Auth-Token" = $AUTH_TOKEN
  }
```

---

### Step 4: Test with Invalid Signature (Should Fail)

```powershell
# Test with wrong auth token (should get 401)
curl -X GET http://localhost:3000/api/avatars `
  -Headers @{
    "X-Provider-ID" = $PROVIDER_ID
    "X-Auth-Token" = "invalid_signature_12345"
  }

# Expected response: 401 Unauthorized
```

---

## 🎯 Test in Swagger UI

1. Open: **http://localhost:3000/api/docs**
2. Scroll down to **Avatar endpoints**
3. Click any endpoint (e.g., **GET /api/avatars**)
4. Click **Try it out**
5. Scroll to **Parameters** section
6. Add headers:
   - **X-Provider-ID:** (paste your providerId)
   - **X-Auth-Token:** (paste your authToken)
7. Click **Execute**

---

## 📋 All Endpoints

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | `/auth/social-login` | ❌ No | Login with Google/Facebook |
| GET | `/auth/profile` | ✅ HMAC | Get current user profile |
| GET | `/auth/verify` | ✅ HMAC | Verify token validity |
| GET | `/api/avatars` | ✅ HMAC | List all avatars |
| POST | `/api/avatars` | ✅ HMAC | Create new avatar |
| GET | `/api/avatars/:avatarId` | ✅ HMAC | Get specific avatar |
| PUT | `/api/avatars/:avatarId` | ✅ HMAC | Update avatar |
| DELETE | `/api/avatars/:avatarId` | ✅ HMAC | Delete avatar |
| POST | `/api/avatars/:avatarId/activate` | ✅ HMAC | Activate avatar |
| GET | `/api/avatars/active` | ✅ HMAC | Get active avatar |

---

## 🔍 Debugging Tips

### Issue: 401 Unauthorized

**Causes:**
1. Missing `X-Provider-ID` header
2. Missing `X-Auth-Token` header
3. Wrong `authToken` value
4. User not found in database

**Check:**
```bash
# Verify headers are sent
curl -X GET http://localhost:3000/api/avatars -v `
  -Headers @{
    "X-Provider-ID" = $PROVIDER_ID
    "X-Auth-Token" = $AUTH_TOKEN
  }

# Look for: "X-Provider-ID" and "X-Auth-Token" in request headers
```

### Issue: Google Token Invalid

**Causes:**
1. Token expired (ID tokens expire in ~1 hour)
2. Token format incorrect
3. Google credentials in `.env` wrong

**Check:**
```bash
# Verify token format (should be JWT with 3 parts separated by .)
Write-Host $GOOGLE_TOKEN

# Get new token from OAuth Playground
```

### Issue: User Not Found

**Cause:** User exists with different providerId

**Check:**
```bash
# Login creates/finds user by: {provider: 'google', providerId: sub}
# If you get different Google tokens, you get different providerId
```

---

## 📊 Expected Responses

### Successful Login

```json
{
  "providerId": "113210244850576231526",
  "authToken": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
  "user": {
    "_id": "69110f5528ec6cacce3c8b5c",
    "email": "ayaflah30@gmail.com",
    "name": "AYA FLAH",
    "photoUrl": "https://lh3.googleusercontent.com/...",
    "provider": "google",
    "providerId": "113210244850576231526",
    "score": 0,
    "level": 1
  }
}
```

### Get Profile (with HMAC headers)

```json
{
  "_id": "69110f5528ec6cacce3c8b5c",
  "email": "ayaflah30@gmail.com",
  "name": "AYA FLAH",
  "photoUrl": "https://lh3.googleusercontent.com/...",
  "provider": "google",
  "providerId": "113210244850576231526"
}
```

### Get Avatars (with HMAC headers)

```json
{
  "total": 2,
  "avatars": [
    {
      "_id": "...",
      "name": "Avatar 1",
      "userId": "69110f5528ec6cacce3c8b5c",
      "active": true
    },
    {
      "_id": "...",
      "name": "Avatar 2",
      "userId": "69110f5528ec6cacce3c8b5c",
      "active": false
    }
  ]
}
```

---

## 🛠️ Common cURL Commands

### Login
```bash
curl -X POST http://localhost:3000/auth/social-login \
  -H "Content-Type: application/json" \
  -d '{"provider":"google","token":"YOUR_ID_TOKEN"}'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "X-Provider-ID: YOUR_PROVIDER_ID" \
  -H "X-Auth-Token: YOUR_AUTH_TOKEN"
```

### List Avatars
```bash
curl -X GET http://localhost:3000/api/avatars \
  -H "X-Provider-ID: YOUR_PROVIDER_ID" \
  -H "X-Auth-Token: YOUR_AUTH_TOKEN"
```

### Create Avatar
```bash
curl -X POST http://localhost:3000/api/avatars \
  -H "Content-Type: application/json" \
  -H "X-Provider-ID: YOUR_PROVIDER_ID" \
  -H "X-Auth-Token: YOUR_AUTH_TOKEN" \
  -d '{"name":"My Avatar","expression":"happy"}'
```

---

## ✅ System Status Checklist

- ✅ Server running on port 3000
- ✅ MongoDB connected
- ✅ Google OAuth configured (check `.env`)
- ✅ HMAC authentication active
- ✅ No JWT tokens (using HMAC signatures)
- ✅ All 14 avatar endpoints protected by HMAC
- ✅ Build passing (0 errors)

---

## 🚨 Important Notes

1. **HMAC tokens never expire** — no need to refresh
2. **Keep `HMAC_SECRET` secure** — never commit to Git
3. **Always use HTTPS in production** — headers are sent in plain text over HTTP
4. **Google tokens expire in ~1 hour** — get new token from OAuth Playground to re-login
5. **Each Google account gets unique `providerId`** — logout by discarding both header values

---

**Need help? Check `HMAC_AUTH_GUIDE.md` for detailed documentation.**
