import { MongoClient } from 'mongodb';

/**
 * Script to update Batman level with audio preview URL
 * Run this after adding batman-preview.mp3 to public/audio/levels/
 * 
 * Usage: npx ts-node scripts/update-batman-preview.ts
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/piano-game';
const SERVER_IP = '192.168.153.159'; // Update with your IP
const SERVER_PORT = '3000';

async function updateBatmanLevel() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const levelsCollection = db.collection('levels');
    
    // Find Batman level (first level, order: 1)
    const batmanLevel = await levelsCollection.findOne({ theme: 'Batman', order: 1 });
    
    if (!batmanLevel) {
      console.log('❌ Batman level not found! Make sure to seed the database first.');
      return;
    }
    
    console.log(`📝 Found Batman level: ${batmanLevel.title}`);
    
    // Update with preview audio
    const result = await levelsCollection.updateOne(
      { _id: batmanLevel._id },
      {
        $set: {
          previewAudioUrl: `http://${SERVER_IP}:${SERVER_PORT}/audio/levels/batman-preview.mp3`,
          previewDuration: 12,  // 12 seconds
          autoPlayPreview: true
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Batman level updated successfully!');
      console.log(`🎵 Preview URL: http://${SERVER_IP}:${SERVER_PORT}/audio/levels/batman-preview.mp3`);
      console.log('⏱️  Duration: 12 seconds');
      console.log('▶️  Auto-play: enabled');
    } else {
      console.log('⚠️  No changes made (maybe already updated?)');
    }
    
  } catch (error) {
    console.error('❌ Error updating level:', error);
  } finally {
    await client.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the update
updateBatmanLevel().catch(console.error);
