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

    const hasDuration = v.durationSeconds && v.durationSeconds > 0;
    const hasValidDate = v.publishedAt && !v.publishedAt.includes('NA');
    const hasTranscript = v.transcript && v.transcript.length > 100;

    if (!hasDuration) missingDuration++;
    if (!hasValidDate) missingDate++;
    if (!v.transcript) {
      missingTranscript++;
    } else if (v.transcript.length < 100) {
      shortTranscript++;
    }
  });

  const totalVids = vids.length;
  const healthScore = ((totalVids - (missingDuration + missingDate + missingTranscript) / 3) / totalVids * 100).toFixed(1);

  console.log('--- Archival Audit Results ---');
  console.log(`Total Records:   ${totalVids}`);
  console.log(`Unique Videos:   ${unique.size}`);
  console.log(`Duplicates:      ${dups.length}`);
  console.log(`Health Score:    ${healthScore}%`);
  console.log('------------------------------');
  console.log(`Metadata Status:`);
  console.log(`  - Durations OK:  ${totalVids - missingDuration} (${((totalVids - missingDuration)/totalVids*100).toFixed(1)}%)`);
  console.log(`  - Dates OK:      ${totalVids - missingDate} (${((totalVids - missingDate)/totalVids*100).toFixed(1)}%)`);
  console.log(`  - Transcripts OK:${totalVids - missingTranscript} (${((totalVids - missingTranscript)/totalVids*100).toFixed(1)}%)`);
  console.log('------------------------------');
  console.log(`Critical Issues:`);
  console.log(`  - Missing Duration: ${missingDuration}`);
  console.log(`  - Corrupted Date:   ${missingDate}`);
  console.log(`  - Missing Trans:    ${missingTranscript}`);
  console.log(`  - Short Trans (<100): ${shortTranscript}`);
  console.log('------------------------------');
  
  if (dups.length > 0) {
    console.log('Duplicate IDs:', [...new Set(dups)].join(', '));
  }
}

audit();
