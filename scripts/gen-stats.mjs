import fs from 'fs';
import path from 'path';

const VIDEOS_PATH = path.join(process.cwd(), 'public', 'data', 'videos.json');
const PLAYLISTS_PATH = path.join(process.cwd(), 'public', 'data', 'playlists.json');
const STATS_OUT_PATH = path.join(process.cwd(), 'public', 'data', 'stats.json');
const FEED_OUT_PATH = path.join(process.cwd(), 'public', 'data', 'feed.json');

async function getYoutubeStats(channelId) {
  try {
    const res = await fetch(`https://www.youtube.com/channel/${channelId}/about`, {
      headers: { 'user-agent': 'Mozilla/5.0' }
    });
    const text = await res.text();
    const subMatch = text.match(/\"subscriberCountText\":\{\"simpleText\":\"([\d.,KMB]+)\s+subscribers\"\}/);
    const viewMatch = text.match(/\"viewCountText\":\{\"simpleText\":\"([\d.,]+)\s+views\"\}/);
    
    let subs = 0;
    if (subMatch) {
      let count = subMatch[1].replace(/,/g, '');
      if (count.toLowerCase().endsWith('k')) count = parseFloat(count) * 1000;
      if (count.toLowerCase().endsWith('m')) count = parseFloat(count) * 1000000;
      subs = Math.floor(Number(count));
    }
    
    return { 
      subscribers: subs,
      views: viewMatch ? parseInt(viewMatch[1].replace(/,/g, '')) : 0 
    };
  } catch (e) {
    console.warn('⚠️ YT sync failed:', e.message);
    return { subscribers: 0, views: 0 };
  }
}

async function getFacebookStats(pageId) {
  try {
    const res = await fetch(`https://www.facebook.com/${pageId}`, {
      headers: { 'user-agent': 'Mozilla/5.0' }
    });
    const text = await res.text();
    const followMatch = text.match(/([\d.,KMB]+)\s+followers/i);
    if (followMatch) {
      let count = followMatch[1].replace(/,/g, '');
      if (count.toLowerCase().endsWith('k')) count = parseFloat(count) * 1000;
      if (count.toLowerCase().endsWith('m')) count = parseFloat(count) * 1000000;
      return { followers: Math.floor(Number(count)) };
    }
    return { followers: 0 };
  } catch (e) {
    console.warn('⚠️ FB sync failed:', e.message);
    return { followers: 0 };
  }
}

async function getInstagramData(username) {
  try {
    // Attempt lowercase fallback if original fails
    const usernames = [username, username.toLowerCase()];
    for (const u of usernames) {
      try {
        const res = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${u}`, {
          headers: {
            'x-ig-app-id': '936619743392459',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'referer': `https://www.instagram.com/${u}/`,
            'x-asbd-id': '129477',
            'x-requested-with': 'XMLHttpRequest'
          }
        });
        
        if (!res.ok) continue;
        const data = await res.json();
        const user = data.data.user;
        
        const recentMedia = user.edge_owner_to_timeline_media.edges.slice(0, 12).map(edge => ({
          id: edge.node.id,
          shortcode: edge.node.shortcode,
          type: edge.node.is_video ? 'video' : (edge.node.__typename === 'GraphSidecar' ? 'carousel' : 'image'),
          thumbnail: edge.node.display_url,
          url: `https://instagram.com/p/${edge.node.shortcode}`,
          caption: edge.node.edge_media_to_caption.edges[0]?.node.text || '',
          likes: edge.node.edge_media_preview_like.count,
          comments: edge.node.edge_media_to_comment.count,
          timestamp: edge.node.taken_at_timestamp
        }));

        return {
          followers: user.edge_followed_by.count,
          postsCount: user.edge_owner_to_timeline_media.count,
          recentMedia
        };
      } catch (e) {
        continue;
      }
    }
    throw new Error('All username attempts failed');
  } catch (e) {
    console.warn('⚠️ IG sync failed:', e.message);
    return { followers: 0, postsCount: 0, recentMedia: [] };
  }
}

async function main() {
  try {
    let videosCount = 0;
    let transcriptsOk = 0;
    let totalDurationSeconds = 0;
    
    if (fs.existsSync(VIDEOS_PATH)) {
      const vData = JSON.parse(fs.readFileSync(VIDEOS_PATH, 'utf-8'));
      const vids = Array.isArray(vData.videos) ? vData.videos : [];
      
      // Use unique IDs for count
      const uniqueIds = new Set(vids.map(v => v.id));
      videosCount = uniqueIds.size;
      
      // Count transcripts
      transcriptsOk = vids.filter(v => v.transcript && v.transcript.length > 50).length;
      
      // Calculate duration
      totalDurationSeconds = vids.reduce((acc, v) => acc + (v.durationSeconds || 0), 0);
      
      // Sync back to videos.json
      vData.total = videosCount;
      vData.transcript_ok = transcriptsOk;
      fs.writeFileSync(VIDEOS_PATH, JSON.stringify(vData, null, 2));
    }

    let playlistsCount = 0;
    if (fs.existsSync(PLAYLISTS_PATH)) {
      const pData = JSON.parse(fs.readFileSync(PLAYLISTS_PATH, 'utf-8'));
      playlistsCount = Array.isArray(pData.playlists) ? pData.playlists.length : (pData.total || 0);
      
      // Inject durations into playlists if we have video data
      if (fs.existsSync(VIDEOS_PATH) && Array.isArray(pData.playlists)) {
        const vData = JSON.parse(fs.readFileSync(VIDEOS_PATH, 'utf-8'));
        const vids = vData.videos || [];
        const videoDurationMap = new Map(vids.map(v => [v.id, v.durationSeconds || 0]));
        
        pData.playlists.forEach(pl => {
          // If the playlist doesn't have a duration, we might estimate it or use recentVideos
          // For now, let's sum up recentVideos durations if available, or just use a placeholder
          // Ideally we'd have all video IDs for the playlist
          let totalPlSec = 0;
          if (pl.recentVideos) {
            pl.recentVideos.forEach(rv => {
              totalPlSec += (videoDurationMap.get(rv.videoId) || 0);
            });
            // If recentVideos is only a subset, we could scale it, but that's risky.
            // Let's just store what we found.
            pl.totalDurationSeconds = totalPlSec;
          }
        });
        fs.writeFileSync(PLAYLISTS_PATH, JSON.stringify(pData, null, 2));
      }
    }

    const igData = await getInstagramData('PradumanKhachar');
    const fb = await getFacebookStats('pradumankhachar');
    const yt = await getYoutubeStats('UCcxFZ3XuZjB9eXyFZdrjDXQ');

    const stats = {
      videos: videosCount,
      playlists: playlistsCount,
      transcripts: transcriptsOk,
      totalDurationHours: Math.round(totalDurationSeconds / 3600),
      instagram: { followers: igData.followers, posts: igData.postsCount },
      facebook: fb,
      youtube: yt,
      lastUpdated: new Date().toISOString()
    };

    const feed = {
      instagram: igData.recentMedia,
      lastUpdated: new Date().toISOString()
    };

    fs.writeFileSync(STATS_OUT_PATH, JSON.stringify(stats, null, 2));
    fs.writeFileSync(FEED_OUT_PATH, JSON.stringify(feed, null, 2));
    
    console.log('✅ Generated stats.json and feed.json');
  } catch (e) {
    console.error('❌ Failed to generate stats:', e);
  }
}

main();
