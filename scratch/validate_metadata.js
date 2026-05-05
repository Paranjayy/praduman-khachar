import fs from 'fs';

const videosPath = '/Users/paranjay/Developer/Praduman Khachar/public/data/videos.json';
const data = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
const videos = data.videos || [];

console.log(`📊 Archival Health Report`);
console.log(`═`.repeat(30));
console.log(`Total Videos: ${data.total || videos.length}`);
console.log(`Transcript OK: ${data.transcript_ok || '?'}`);
console.log(`Transcript Fail: ${data.transcript_fail || '?'}`);

let missingDuration = 0;
let missingPublished = 0;
let missingTranscript = 0;
let transcriptEmpty = 0;

videos.forEach((v) => {
  if (!v.durationSeconds) missingDuration++;
  if (!v.publishedAt) missingPublished++;
  if (!v.transcript) missingTranscript++;
  if (v.transcript && v.transcript.length < 50) transcriptEmpty++;
});

console.log(`Missing DurationSeconds: ${missingDuration}`);
console.log(`Missing PublishedAt: ${missingPublished}`);
console.log(`Missing Transcript: ${missingTranscript}`);
console.log(`Thin/Empty Transcript: ${transcriptEmpty}`);

const healthyCount = videos.length - (missingDuration + missingPublished + missingTranscript);
console.log(`\nFully Healthy Records: ${Math.max(0, healthyCount)}`);

if (missingDuration > 0 || missingTranscript > 0) {
  console.log("\n🩹 Status: Healing in progress. Many legacy records require re-processing.");
} else {
  console.log("\n✅ Status: All records fully saturated.");
}
