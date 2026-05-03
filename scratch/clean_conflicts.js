import fs from 'fs';

function cleanConflictMarkers(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Remove <<<<<<<, =======, >>>>>>> blocks
  // This is a simple regex that keeps the "ours" side usually, or just cleans markers
  // Better yet, just remove all lines starting with these markers
  const lines = content.split('\n');
  const cleanedLines = lines.filter(line => 
    !line.startsWith('<<<<<<<') && 
    !line.startsWith('=======') && 
    !line.startsWith('>>>>>>>') &&
    !line.startsWith('|||||||')
  );
  fs.writeFileSync(filePath, cleanedLines.join('\n'));
}

cleanConflictMarkers('src/index.css');
cleanConflictMarkers('IDEAS.md');
