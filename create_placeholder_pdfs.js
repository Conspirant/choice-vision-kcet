import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create placeholder PDF files for cutoff resources
const cutoffFiles = [
  'kcet-2024-round1-cutoffs.pdf',
  'kcet-2024-round2-cutoffs.pdf',
  'kcet-2024-round3-cutoffs.pdf',
  'kcet-2024-final-cutoffs.pdf',
  'kcet-2023-round1-cutoffs.pdf',
  'kcet-2023-round2-cutoffs.pdf',
  'kcet-2023-round3-cutoffs.pdf',
  'kcet-2023-final-cutoffs.pdf',
  'kcet-2025-brochure.pdf',
  'college-list-codes.pdf'
];

const resourcesDir = path.join(__dirname, 'public', 'resources');

// Ensure resources directory exists
if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir, { recursive: true });
}

// Create placeholder files
cutoffFiles.forEach(filename => {
  const filePath = path.join(resourcesDir, filename);
  if (!fs.existsSync(filePath)) {
    // Create a simple text file as placeholder
    const content = `Placeholder for ${filename}
    
This is a placeholder file for ${filename}.
In a real implementation, this would contain the actual PDF content.

Generated on: ${new Date().toISOString()}`;
    
    fs.writeFileSync(filePath, content);
    console.log(`Created placeholder: ${filename}`);
  } else {
    console.log(`File already exists: ${filename}`);
  }
});

console.log('Placeholder files created successfully!'); 