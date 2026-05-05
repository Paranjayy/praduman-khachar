import fs from 'fs';

const conflictedPath = '/Users/paranjay/Developer/Praduman Khachar/public/data/videos_conflicted.json';
const videosPath = '/Users/paranjay/Developer/Praduman Khachar/public/data/videos.json';

const content = fs.readFileSync(conflictedPath, 'utf8');

// Try to clean git markers
const cleaned = content
    .replace(/<<<<<<< HEAD\n/g, '')
    .replace(/<<<<<<< Updated upstream\n/g, '')
    .replace(/=======\n/g, '')
    .replace(/>>>>>>> Stashed changes\n/g, '')
    .replace(/>>>>>>> .*\n/g, '');

// This won't make it valid JSON, but we can try to find blocks
const videoBlocks = cleaned.split('},');
const recovered = new Map();

videoBlocks.forEach(block => {
    try {
        // Wrap in braces if missing
        let jsonStr = block.trim();
        if (!jsonStr.startsWith('{')) jsonStr = '{' + jsonStr;
        if (!jsonStr.endsWith('}')) jsonStr = jsonStr + '}';
        
        // Try to fix common JSON errors from merge conflicts
        jsonStr = jsonStr.replace(/"transcript":\s*"([\s\S]*?)"/g, (m, p1) => {
            return `"transcript": ${JSON.stringify(p1)}`;
        });

        const v = JSON.parse(jsonStr);
        if (v.id && v.transcript && v.transcript.length > 100) {
            recovered.set(v.id, v.transcript);
        }
    } catch (e) {
        // skip failed blocks
    }
});

console.log(`Deep recovery found ${recovered.size} transcripts.`);

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
}
