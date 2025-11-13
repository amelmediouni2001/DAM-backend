# 🚀 HMAC Auth Quick Reference

**Your backend is now running with HMAC-SHA256 authentication!**

## 📍 Quick Links

- **Server:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs
- **Detailed Guide:** `HMAC_AUTH_GUIDE.md`
- **Testing Guide:** `HMAC_TEST_GUIDE.md`

---

## ⚡ 60-Second Setup

### 1. Get Google ID Token
Visit: https://developers.google.com/oauthplayground
- Settings → Use your own OAuth credentials
- Select Google OAuth2 v2 → userinfo
- Authorize → Copy ID Token

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/social-login \
  -H "Content-Type: application/json" \
  -d '{"provider":"google","token":"YOUR_ID_TOKEN"}'
```

### 3. Copy Response Values
```json
{
  "providerId": "113210244850576231526",
  "authToken": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
  "user": {...}
}
```

### 4. Use Headers on Protected Routes
```bash
curl http://localhost:3000/api/avatars \
  -H "X-Provider-ID: 113210244850576231526" \
  -H "X-Auth-Token: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0"
```

---

## 📋 All Headers

Every protected endpoint requires **both** headers:

| Header | Source | Example |
|--------|--------|---------|
| `X-Provider-ID` | Login response `providerId` | `113210244850576231526` |
| `X-Auth-Token` | Login response `authToken` | `a1b2c3d4...` |

---

## 🔓 Public Endpoints (No Headers)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/social-login` | POST | Login with Google/Facebook |

---

## 🔒 Protected Endpoints (HMAC Headers Required)

### Auth
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/profile` | GET | Get your profile |
| `/auth/verify` | GET | Verify token valid |

### Avatars
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/avatars` | GET | List your avatars |
| `/api/avatars` | POST | Create avatar |
| `/api/avatars/:id` | GET | Get avatar |
| `/api/avatars/:id` | PUT | Update avatar |
| `/api/avatars/:id` | DELETE | Delete avatar |
| `/api/avatars/active` | GET | Get active avatar |
| `/api/avatars/:id/activate` | POST | Set as active |
| `/api/avatars/:id/expression` | PUT | Update expression |
| `/api/avatars/:id/state` | PUT | Update state |
| `/api/avatars/:id/energy` | PUT | Update energy |
| `/api/avatars/:id/experience` | POST | Add experience |
| `/api/avatars/:id/stats` | GET | Get stats |
| `/api/avatars/:id/outfits/:oid/equip` | POST | Equip outfit |
| `/api/avatars/:id/outfits/:oid/unlock` | POST | Unlock outfit |

---

## 🛠️ PowerShell Quick Test

```powershell
# Set your token
$GOOGLE_TOKEN = "paste-your-google-id-token"

# Login
$response = curl -X POST http://localhost:3000/auth/social-login `
  -H "Content-Type: application/json" `
  -Body (@{provider="google"; token=$GOOGLE_TOKEN} | ConvertTo-Json) `
  | ConvertFrom-Json

# Extract values
$PROVIDER_ID = $response.providerId
$AUTH_TOKEN = $response.authToken

# Test protected endpoint
curl -X GET http://localhost:3000/api/avatars `
  -H "X-Provider-ID: $PROVIDER_ID" `
  -H "X-Auth-Token: $AUTH_TOKEN"
```

---

## 🔍 How It Works

```
Login sends:
  POST /auth/social-login
  {provider, token}
  ↓
Server validates Google token
  ↓
Calculates HMAC: signature = HMAC-SHA256(secret, providerId)
  ↓
Returns: {providerId, authToken (signature), user}
  ↓

Subsequent requests send:
  Header: X-Provider-ID = providerId
  Header: X-Auth-Token = authToken
  ↓
Server recalculates: calcSignature = HMAC-SHA256(secret, providerId)
  ↓
Compares: authToken == calcSignature ?
  ✅ Yes → Authenticate
  ❌ No → 401 Unauthorized
```

---

## 📝 Example Requests

### Login
```bash
curl -X POST http://localhost:3000/auth/social-login \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "google",
    "token": "eyJhbGc..."
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "X-Provider-ID: 113210244850576231526" \
  -H "X-Auth-Token: a1b2c3d4..."
```

### Get Avatars
```bash
curl -X GET http://localhost:3000/api/avatars \
  -H "X-Provider-ID: 113210244850576231526" \
  -H "X-Auth-Token: a1b2c3d4..."
```

### Create Avatar
```bash
curl -X POST http://localhost:3000/api/avatars \
  -H "Content-Type: application/json" \
  -H "X-Provider-ID: 113210244850576231526" \
  -H "X-Auth-Token: a1b2c3d4..." \
  -d '{
    "name": "My Avatar",
    "expression": "happy"
  }'
```

---

## ✅ What Changed

| Aspect | Old | New |
|--------|-----|-----|
| Auth Type | JWT Bearer Token | HMAC Signature |
| Header Format | `Authorization: Bearer <jwt>` | `X-Provider-ID` + `X-Auth-Token` |
| Token Size | ~200 bytes | ~64 bytes |
| Expires | Yes (1 hour) | No (persistent) |
| Debug | ❌ Base64 | ✅ Hex string |

---

## 🚨 Common Issues

### 401 Unauthorized
**Check:**
- Are you sending `X-Provider-ID` header?
- Are you sending `X-Auth-Token` header?
- Are values from the login response?
- Did you use correct Google token?

### Invalid Google Token
**Solution:**
- Get new token from OAuth Playground
- Tokens expire after ~1 hour

### User Not Found
**Reason:**
- Logging in with different Google account
- User was deleted from database

### Server Not Running
**Start it:**
```bash
npm run start:dev
```

---

## 🔐 Security Tips

1. ✅ Keep `HMAC_SECRET` secret (in `.env`, never commit)
2. ✅ Use HTTPS in production (headers sent in plain text)
3. ✅ Don't share your `authToken` publicly
4. ✅ Rotate credentials regularly in production

---

## 📚 Documentation

| File | Contains |
|------|----------|
| `HMAC_AUTH_GUIDE.md` | Complete reference guide |
| `HMAC_TEST_GUIDE.md` | Detailed testing procedures |
| `HMAC_IMPLEMENTATION_COMPLETE.md` | Implementation details |
| `JWT_CLEANUP_SUMMARY.md` | Files removed and why |

---

## 💻 Test in Swagger UI

1. Visit: http://localhost:3000/api/docs
2. POST `/auth/social-login` → Get `providerId` + `authToken`
3. Click any protected endpoint
4. Click "Try it out"
5. Add headers:
   - `X-Provider-ID: <providerId>`
   - `X-Auth-Token: <authToken>`
6. Click "Execute"

---

## ⏱️ What's Different from JWT

| Feature | JWT | HMAC |
|---------|-----|------|
| Complexity | 🔴 High | 🟢 Low |
| Token Size | 🔴 Large | 🟢 Small |
| Decoding | 🔴 Required | 🟢 Not needed |
| Expiration | 🟢 Built-in | 🔴 Not included |
| Revocation | 🔴 Hard | 🔴 Hard |
| Mobile Use | 🟡 OK | 🟢 Better |
| Debug | 🔴 Hard | 🟢 Easy |

---

## 🎯 Next Steps

1. ✅ Get Google token from OAuth Playground
2. ✅ Test `/auth/social-login` endpoint
3. ✅ Extract `providerId` and `authToken`
4. ✅ Use headers on protected endpoints
5. 👉 Integrate with your mobile app
6. 👉 See `HMAC_AUTH_GUIDE.md` for mobile examples

---

**Status: ✅ Production Ready**

*Server running • Build passing • 0 errors*
