import fs from 'fs';
import path from 'path';

const VIDEOS_PATH = path.join(process.cwd(), 'public', 'data', 'videos.json');
const PLAYLISTS_PATH = path.join(process.cwd(), 'public', 'data', 'playlists.json');
const OUT_PATH = path.join(process.cwd(), 'public', 'data', 'stats.json');

try {
  let videosCount = 0;
  let transcriptsOk = 0;
  if (fs.existsSync(VIDEOS_PATH)) {
    const vData = JSON.parse(fs.readFileSync(VIDEOS_PATH, 'utf-8'));
    videosCount = vData.total || 0;
    transcriptsOk = vData.transcript_ok || 0;
  }

  let playlistsCount = 0;
  if (fs.existsSync(PLAYLISTS_PATH)) {
    const pData = JSON.parse(fs.readFileSync(PLAYLISTS_PATH, 'utf-8'));
    playlistsCount = pData.total || 0;
  }

  const stats = {
    videos: videosCount,
    playlists: playlistsCount,
    transcripts: transcriptsOk,
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(stats, null, 2));
  console.log('✅ Generated stats.json:', stats);
} catch (e) {
  console.error('❌ Failed to generate stats:', e);
}
