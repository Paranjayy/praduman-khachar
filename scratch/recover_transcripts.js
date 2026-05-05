import fs from 'fs';

const conflictedPath = '/Users/paranjay/Developer/Praduman Khachar/public/data/videos_conflicted.json';
const videosPath = '/Users/paranjay/Developer/Praduman Khachar/public/data/videos.json';

const content = fs.readFileSync(conflictedPath, 'utf8');

// Simple regex to find objects that look like video entries with transcripts
// We want to catch the video object even with git markers
const videoRegex = /{\s*"id":\s*"([^"]+)"[\s\S]*?"transcript":\s*"([^"]+)"[\s\S]*?}/g;

const recovered = new Map();
let match;

while ((match = videoRegex.exec(content)) !== null) {
    const id = match[1];
    const transcript = match[2];
    if (transcript && transcript.length > 100) {
        recovered.set(id, transcript);
    }
}

console.log(`Recovered ${recovered.size} potential transcripts from conflicted file.`);

const data = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
let mergedCount = 0;

data.videos.forEach(v => {
    if ((!v.transcript || v.transcript.length < 50) && recovered.has(v.id)) {
        v.transcript = recovered.get(v.id);
        v.transcriptWordCount = v.transcript.split(/\s+/).length;
        mergedCount++;
    }
});

console.log(`Merged ${mergedCount} transcripts into videos.json`);

if (mergedCount > 0) {
    fs.writeFileSync(videosPath, JSON.stringify(data, null, 2));
    console.log("✅ Main videos.json updated with recovered transcripts.");
} else {
    console.log("No new transcripts to merge.");
}
