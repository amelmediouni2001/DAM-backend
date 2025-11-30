# Image URLs to Replace - New Map Design

This document lists all the imgbb URLs that need to be replaced in `src/levels/levels.service.ts`.

## Level 1 - Batman (Upper-Left with Sailboat)
- **backgroundUrl**: `https://i.ibb.co/XXXXX/batman-bg.jpg`
- **bossUrl**: `https://i.ibb.co/XXXXX/batman-boss.jpg`
- **musicUrl**: `https://i.ibb.co/XXXXX/batman.mp3`
- **islandImageUrl**: `https://i.ibb.co/XXXXX/level-1-batman-island.png` ⭐ (Island with Batman + sailboat)

## Level 2 - Superman (Middle-Left)
- **backgroundUrl**: `https://i.ibb.co/XXXXX/superman-bg.jpg`
- **bossUrl**: `https://i.ibb.co/XXXXX/superman-boss.jpg`
- **musicUrl**: `https://i.ibb.co/XXXXX/superman.mp3`
- **islandImageUrl**: `https://i.ibb.co/XXXXX/level-2-superman-island.png` ⭐ (Island with Superman)

## Level 3 - Spider-Man (Bottom-Left with Treasure Chest)
- **backgroundUrl**: `https://i.ibb.co/XXXXX/spiderman-bg.jpg`
- **bossUrl**: `https://i.ibb.co/XXXXX/spiderman-boss.jpg`
- **musicUrl**: `https://i.ibb.co/XXXXX/spiderman.mp3`
- **islandImageUrl**: `https://i.ibb.co/XXXXX/level-3-spiderman-island.png` ⭐ (Island with Spider-Man + treasure chest)

## Level 4 - Captain America (Upper-Right with Palm Trees)
- **backgroundUrl**: `https://i.ibb.co/XXXXX/captain-america-bg.jpg`
- **bossUrl**: `https://i.ibb.co/XXXXX/captain-america-boss.jpg`
- **musicUrl**: `https://i.ibb.co/XXXXX/captain-america.mp3`
- **islandImageUrl**: `https://i.ibb.co/XXXXX/level-4-captain-america-island.png` ⭐ (Island with Captain America + palm trees)

## Level 5 - Magical Girl (Sailor Moon-like, Middle-Right)
- **backgroundUrl**: `https://i.ibb.co/XXXXX/magical-girl-bg.jpg`
- **bossUrl**: `https://i.ibb.co/XXXXX/magical-girl-boss.jpg`
- **musicUrl**: `https://i.ibb.co/XXXXX/magical-girl.mp3`
- **islandImageUrl**: `https://i.ibb.co/XXXXX/level-5-magical-girl-island.png` ⭐ (Island with magical girl character)

## Level 6 - Pirate Ship / Rocky Island (Bottom-Right)
- **backgroundUrl**: `https://i.ibb.co/XXXXX/pirate-bg.jpg`
- **bossUrl**: `https://i.ibb.co/XXXXX/sea-monster-boss.jpg` ⭐ (The purple sea monster from the map)
- **musicUrl**: `https://i.ibb.co/XXXXX/pirate.mp3`
- **islandImageUrl**: `https://i.ibb.co/XXXXX/level-6-pirate-island.png` ⭐ (Pirate ship + rocky island)

---

## Map Position Summary

The new map positions are:
- **Level 1**: `{ x: 0.12, y: 0.15 }` - Upper-left
- **Level 2**: `{ x: 0.20, y: 0.40 }` - Middle-left
- **Level 3**: `{ x: 0.15, y: 0.70 }` - Bottom-left
- **Level 4**: `{ x: 0.75, y: 0.20 }` - Upper-right
- **Level 5**: `{ x: 0.80, y: 0.50 }` - Middle-right
- **Level 6**: `{ x: 0.85, y: 0.75 }` - Bottom-right

---

## Instructions

1. Upload all images to imgbb.com
2. Copy the direct image URLs (ending in .jpg, .png, .mp3)
3. Replace all `https://i.ibb.co/XXXXX/...` placeholders in `src/levels/levels.service.ts`
4. Make sure `islandImageUrl` matches the island images from your new map design
5. The `bossUrl` for Level 6 should be the purple sea monster image

---

## Notes

- ⭐ indicates critical images that must match the new map design
- All URLs should use the imgbb direct link format: `https://i.ibb.co/[code]/[filename]`
- After updating URLs, restart the backend to re-seed the database (or manually clear the levels collection)



