# DAM (Digital Asset Management) Backend

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  <h2 align="center">Built with NestJS and MongoDB</h2>
</p>

## Overview

This repository provides a backend API built with NestJS and MongoDB focused on secure user authentication and management. Recent additions include social authentication strategies (Google & Facebook), a social-login DTO, and refined JWT guard usage.

### Key Technologies
- NestJS
- MongoDB (Mongoose)
- JWT (passport-jwt)
- Bcrypt (password hashing)
- TypeScript

## What's new / This work
- Added social login support via Google and Facebook strategies. Endpoints are available to accept social auth tokens and create or retrieve user accounts.
- Introduced `social-login.dto.ts` (DTO for social login payloads).
- Included `jwt-auth.guard.ts` and `jwt.strategy.ts` for protecting routes using JWTs.
- Updated `auth.service.ts` and `auth.controller.ts` to handle social login flows alongside email/password flows.

## Features

- User Registration (email/password)
- Email/password Login (returns JWT)
- Social Login (Google, Facebook) — exchange provider token or code for an app JWT
- Forgot / Reset Password flow (token-based)
- Protected routes with JWT Guards
- Profile viewing and update
- **Avatar Management with AI Generation** — Create avatars using Ready Player Me or Gemini AI
- **Gemini AI Integration** — Generate kid-friendly avatars from text prompts (e.g., "Naruto from anime", "Mickey Mouse")

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or remote)
- npm or yarn

## Installation

1. Clone the repository and install dependencies:

```powershell
git clone <repository-url>
cd DAM-backend
npm install
```

2. Copy and configure environment variables:

```powershell
copy .env.example .env
# then edit .env and add values for:
# - MONGODB_URI (MongoDB connection string)
# - JWT_SECRET (secret key for JWT tokens)
# - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (for Google OAuth)
# - FACEBOOK_APP_ID, FACEBOOK_APP_SECRET (for Facebook OAuth)
# - GEMINI_API_KEY (for AI avatar generation - get from https://makersuite.google.com/app/apikey)
```

Note: Ensure MongoDB is reachable by the `MONGODB_URI` value.

### Getting Gemini API Key

To use the AI avatar generation feature:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Add it to your `.env` file as `GEMINI_API_KEY=your-key-here`

## Running

```powershell
# development
npm run start:dev

# production
npm run build; npm run start:prod
```

## API Endpoints (high level)

### Authentication (`/auth`)

- POST `/auth/register` — register with email/password
- POST `/auth/login` — login with email/password
- POST `/auth/social` — social login (Google/Facebook) — accepts provider and token/code (see `social-login.dto.ts`)
- GET `/auth/profile` — protected, returns current user (JWT required)
- POST `/auth/forgot-password` — request password reset
- POST `/auth/reset-password` — reset using token

Example social login body:

```json
{
  "provider": "google",
  "accessToken": "ya29.a0..."
}
```

### Avatar Management (`/api/avatars`)

- POST `/api/avatars` — Create a new avatar with customization
- POST `/api/avatars/generate-from-prompt` — **NEW!** Generate avatar using Gemini AI from text prompt
- GET `/api/avatars` — Get all avatars for the user
- GET `/api/avatars/active` — Get the currently active avatar
- GET `/api/avatars/:avatarId` — Get specific avatar by ID
- PUT `/api/avatars/:avatarId` — Update avatar details
- PUT `/api/avatars/:avatarId/active` — Set avatar as active
- DELETE `/api/avatars/:avatarId` — Delete an avatar
- PUT `/api/avatars/:avatarId/energy` — Update avatar energy
- POST `/api/avatars/:avatarId/experience` — Add experience points
- POST `/api/avatars/:avatarId/outfits/:outfitId/equip` — Equip outfit
- POST `/api/avatars/:avatarId/outfits/:outfitId/unlock` — Unlock outfit

Example AI avatar generation request:

```json
{
  "prompt": "Naruto from anime with orange clothes",
  "name": "My Naruto Avatar",
  "style": "anime"
}
```

Response includes AI-generated description and suggested attributes:

```json
{
  "avatarId": "123abc...",
  "name": "My Naruto Avatar",
  "description": "A kid-friendly avatar inspired by ninja characters...",
  "suggestedAttributes": {
    "bodyType": "athletic",
    "skinTone": "light",
    "hairstyle": "spiky",
    "hairColor": "blonde",
    "eyeStyle": "big",
    "eyeColor": "blue",
    "clothingType": "sporty",
    "clothingColor": "orange",
    "accessories": ["headband", "cape"]
  },
  "generationSource": "gemini-ai"
}
```

## Project structure (relevant files)

```
src/
├── auth/
│   ├── dto/
│   │   └── social-login.dto.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── google.strategy.ts
│   ├── facebook.strategy.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── avatar/
│   ├── dto/
│   │   ├── create-avatar.dto.ts
│   │   ├── generate-avatar-prompt.dto.ts  ← NEW!
│   │   └── ...
│   ├── avatar.controller.ts
│   ├── avatar.module.ts
│   └── avatar.service.ts
├── schemas/
│   ├── user.schema.ts
│   └── avatar.schema.ts
├── utils/
│   ├── gemini.util.ts  ← NEW! (Gemini AI integration)
│   └── acrcloud.util.ts
├── app.module.ts
└── main.ts
```

## Testing

There are unit and e2e tests configured (Jest). Use the project npm scripts:

```powershell
# run unit tests
npm run test

# run e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

## Postman

Import `DAM-Project.postman_collection.json` for a ready set of requests. Configure environment variables (baseUrl, jwt_token) as needed.

## Notes & Next steps

- Ensure you add OAuth credentials to your `.env` before attempting social login.
- Consider adding integration tests for social login flows (using test tokens or mocked provider responses).

## License

MIT
