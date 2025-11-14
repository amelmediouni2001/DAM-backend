# Ready Player Me Backend Integration

## Overview
This document describes the backend changes made to support Ready Player Me avatars.

## Changes Made

### 1. Avatar Schema (`src/schemas/avatar.schema.ts`)

Added new fields to support Ready Player Me avatars:
- `readyPlayerMeId`: Ready Player Me avatar ID
- `readyPlayerMeAvatarUrl`: Full Ready Player Me avatar URL
- `readyPlayerMeGlbUrl`: Ready Player Me 3D model GLB URL
- `readyPlayerMeThumbnailUrl`: Ready Player Me thumbnail/render URL
- `isReadyPlayerMe`: Boolean flag to indicate if this is a Ready Player Me avatar

Made `customization` optional since Ready Player Me avatars don't require it.

### 2. Create Avatar DTO (`src/avatar/dto/create-avatar.dto.ts`)

Added optional Ready Player Me fields:
- `readyPlayerMeId`
- `readyPlayerMeAvatarUrl`
- `readyPlayerMeGlbUrl`
- `readyPlayerMeThumbnailUrl`

Made `customization` optional to support Ready Player Me avatars.

### 3. Update Avatar DTO (`src/avatar/dto/update-avatar.dto.ts`)

Added optional Ready Player Me fields for updates:
- `readyPlayerMeId`
- `readyPlayerMeAvatarUrl`
- `readyPlayerMeGlbUrl`
- `readyPlayerMeThumbnailUrl`

### 4. Avatar Response DTO (`src/avatar/dto/avatar-response.dto.ts`)

Added Ready Player Me fields to the response:
- `readyPlayerMeId`
- `readyPlayerMeAvatarUrl`
- `readyPlayerMeGlbUrl`
- `readyPlayerMeThumbnailUrl`
- `isReadyPlayerMe`

Made `customization` optional in the response.

### 5. Avatar Service (`src/avatar/avatar.service.ts`)

Updated `create()` method to:
- Detect Ready Player Me avatars based on presence of Ready Player Me fields
- Set `isReadyPlayerMe` flag automatically
- Use thumbnail URL as `avatarImageUrl` if not provided
- Provide default customization for Ready Player Me avatars (if needed)

## API Usage

### Creating a Ready Player Me Avatar

```json
POST /api/avatars
{
  "name": "My Avatar",
  "readyPlayerMeId": "64bfa15f0e72c63d7c3f5a5e",
  "readyPlayerMeAvatarUrl": "https://models.readyplayer.me/64bfa15f0e72c63d7c3f5a5e.glb",
  "readyPlayerMeGlbUrl": "https://models.readyplayer.me/64bfa15f0e72c63d7c3f5a5e.glb",
  "readyPlayerMeThumbnailUrl": "https://models.readyplayer.me/64bfa15f0e72c63d7c3f5a5e.png?scene=fullbody-portrait-v1",
  "avatarImageUrl": "https://models.readyplayer.me/64bfa15f0e72c63d7c3f5a5e.png?scene=fullbody-portrait-v1"
}
```

Note: `customization` is optional for Ready Player Me avatars.

### Response Example

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "name": "My Avatar",
  "customization": {
    "style": "realistic",
    "bodyType": "fullbody",
    ...
  },
  "isActive": true,
  "expression": "happy",
  "avatarImageUrl": "https://models.readyplayer.me/64bfa15f0e72c63d7c3f5a5e.png?scene=fullbody-portrait-v1",
  "readyPlayerMeId": "64bfa15f0e72c63d7c3f5a5e",
  "readyPlayerMeAvatarUrl": "https://models.readyplayer.me/64bfa15f0e72c63d7c3f5a5e.glb",
  "readyPlayerMeGlbUrl": "https://models.readyplayer.me/64bfa15f0e72c63d7c3f5a5e.glb",
  "readyPlayerMeThumbnailUrl": "https://models.readyplayer.me/64bfa15f0e72c63d7c3f5a5e.png?scene=fullbody-portrait-v1",
  "isReadyPlayerMe": true,
  "energy": 100,
  "experience": 0,
  "level": 1,
  "state": "idle",
  "outfits": {
    "unlocked": ["outfit_default"],
    "equipped": "outfit_default"
  },
  "createdAt": "2025-11-15T10:00:00.000Z",
  "updatedAt": "2025-11-15T10:00:00.000Z"
}
```

## Migration Notes

### Existing Avatars
- Existing avatars will continue to work as before
- They will have `isReadyPlayerMe: false` (default)
- `customization` is still required for legacy avatars

### New Ready Player Me Avatars
- Can be created without `customization`
- Will have `isReadyPlayerMe: true`
- Will have all Ready Player Me URLs stored

## Database Migration

No migration script is needed. The new fields are optional and will be `undefined` for existing avatars. The schema will automatically handle the new fields.

## Testing

1. Create a Ready Player Me avatar without customization
2. Verify `isReadyPlayerMe` is set to `true`
3. Verify all Ready Player Me URLs are stored correctly
4. Verify `avatarImageUrl` is set to thumbnail if not provided
5. Test updating Ready Player Me avatar fields
6. Test retrieving Ready Player Me avatars

