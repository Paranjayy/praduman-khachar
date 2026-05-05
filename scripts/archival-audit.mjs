import fs from 'fs';
import path from 'path';

const VIDEOS_PATH = path.join(process.cwd(), 'public', 'data', 'videos.json');

function audit() {
  if (!fs.existsSync(VIDEOS_PATH)) {
    console.error('Videos file not found');
    return;
  }

  const data = JSON.parse(fs.readFileSync(VIDEOS_PATH, 'utf-8'));
  const vids = data.videos || [];

  const unique = new Set();
  const dups = [];
  let missingDuration = 0;
  let missingDate = 0;
  let missingTranscript = 0;
  let shortTranscript = 0;

  vids.forEach(v => {
    if (unique.has(v.id)) {
      dups.push(v.id);
    }
    unique.add(v.id);

    if (!v.durationSeconds || v.durationSeconds === 0) missingDuration++;
    if (!v.publishedAt || v.publishedAt.includes('NA')) missingDate++;
    if (!v.transcript) {
      missingTranscript++;
    } else if (v.transcript.length < 100) {
      shortTranscript++;
    }
  });

  console.log('--- Archival Audit Results ---');
  console.log(`Total Records: ${vids.length}`);
  console.log(`Unique Videos: ${unique.size}`);
  console.log(`Duplicates:    ${dups.length}`);
  console.log(`Missing Duration: ${missingDuration}`);
  console.log(`Corrupted Date:   ${missingDate}`);
  console.log(`Missing Transcript: ${missingTranscript}`);
  console.log(`Short Transcript (<100 chars): ${shortTranscript}`);
  console.log('------------------------------');
  
  if (dups.length > 0) {
    console.log('Duplicate IDs:', [...new Set(dups)].join(', '));
  }
}

audit();
