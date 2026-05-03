import fs from 'fs';
import path from 'path';

function cleanConflictMarkers(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const cleanedLines = lines.filter(line => 
    !line.startsWith('<<<<<<<') && 
    !line.startsWith('=======') && 
    !line.startsWith('>>>>>>>') &&
    !line.startsWith('|||||||')
  );
  fs.writeFileSync(filePath, cleanedLines.join('\n'));
}

function walk(dir, callback) {
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

walk('src', (f) => {
  if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css')) {
    cleanConflictMarkers(f);
  }
});

cleanConflictMarkers('IDEAS.md');
cleanConflictMarkers('index.html');
