import fs from 'fs';
import path from 'path';

const VIDEOS_PATH = path.join(process.cwd(), 'public', 'data', 'videos.json');

if (fs.existsSync(VIDEOS_PATH)) {
  let content = fs.readFileSync(VIDEOS_PATH, 'utf-8');
  
  // Very crude way to pick one side of the conflict. 
  // We'll try to pick the "HEAD" side if possible, or just the side that makes valid JSON.
  
  // First, let's try to remove nested markers by just picking the first occurrence of ======= to >>>>>>>
  // This is risky. 
  
  // Alternative: Use a regex to find <<<<<<< HEAD ... ======= ... >>>>>>> and keep the HEAD part.
  // We need to handle nested ones though.
  
  function resolveConflicts(str) {
    let result = str;
    // Keep HEAD (ours)
    result = result.replace(/<<<<<<< HEAD([\s\S]*?)=======([\s\S]*?)>>>>>>> (.*)/g, '$1');
    // Keep Updated upstream (theirs) if HEAD is not there
    result = result.replace(/<<<<<<< Updated upstream([\s\S]*?)=======([\s\S]*?)>>>>>>> Stashed changes/g, '$1');
    return result;
  }

  let fixed = resolveConflicts(content);
  
  // Repeat if nested
  for (let i = 0; i < 10; i++) {
    fixed = resolveConflicts(fixed);
  }

  try {
    JSON.parse(fixed);
    fs.writeFileSync(VIDEOS_PATH, fixed);
    console.log('✅ Successfully fixed videos.json');
  } catch (e) {
    console.error('❌ Failed to fix videos.json automatically. Error:', e.message);
    // Let's try to just find the FIRST { and LAST } and hope for the best
    const start = fixed.indexOf('{');
    const end = fixed.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      const trimmed = fixed.substring(start, end + 1);
      try {
        JSON.parse(trimmed);
        fs.writeFileSync(VIDEOS_PATH, trimmed);
        console.log('✅ Successfully fixed videos.json by trimming');
      } catch (e2) {
        console.error('❌ Even trimming failed:', e2.message);
      }
    }
  }
}
