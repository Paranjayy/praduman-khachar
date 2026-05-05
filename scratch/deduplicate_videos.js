import fs from 'fs';

const videosPath = '/Users/paranjay/Developer/Praduman Khachar/public/data/videos.json';
const data = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
const videos = data.videos || [];

console.log(`Original count: ${videos.length}`);

const seen = new Set();
const uniqueVideos = [];

for (const v of videos) {
  if (!seen.has(v.id)) {
    seen.add(v.id);
    uniqueVideos.push(v);
  }
}

console.log(`Unique count: ${uniqueVideos.length}`);

data.videos = uniqueVideos;
data.total = uniqueVideos.length;

fs.writeFileSync(videosPath, JSON.stringify(data, null, 2));
console.log("✅ Duplicates removed and saved.");
