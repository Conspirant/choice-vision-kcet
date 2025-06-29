import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resourcesDir = path.join(__dirname, 'public', 'resources');

// Define the renaming structure
const renameMap = {
  // Cutoff files
  '2024_r1.pdf': 'kcet-2024-round1-cutoffs.pdf',
  '2024r2.pdf': 'kcet-2024-round2-cutoffs.pdf',
  '2024 extended rnd.pdf': 'kcet-2024-round3(extended)-cutoffs.pdf',
  '2024_mock_r1.pdf': 'kcet-2024-mock-round1-cutoffs.pdf',
  'kcet_2023_round1.pdf': 'kcet-2023-round1-cutoffs.pdf',
  'kcet_2023_round2.pdf': 'kcet-2023-round2-cutoffs.pdf',
  'kcet_2023_ext.pdf': 'kcet-2023-round3(extended)-cutoffs.pdf',
  'mock 2024 r2.pdf': 'kcet-2024-mock-round2-cutoffs.pdf',
  'kcet_2024_mock_r1.pdf': 'kcet-2024-mock-round1-cutoffs.pdf',
  
  // Option entry files
  'UGCET-2025-seat-allocation-workshop.pdf': 'UGCET-2025-seat-allocation-workshop.pdf', // Keep as is
  'FEE STRUCTURE 2025.pdf': 'FEE-STRUCTURE-2025.pdf',
  
  // General files (create placeholders)
  'kcet-2025-brochure.pdf': 'kcet-2025-brochure.pdf',
  'college-list-codes.pdf': 'college-list-codes.pdf'
};

console.log('Renaming PDF files...');

// Rename files
Object.entries(renameMap).forEach(([oldName, newName]) => {
  const oldPath = path.join(resourcesDir, oldName);
  const newPath = path.join(resourcesDir, newName);
  
  if (fs.existsSync(oldPath)) {
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`✅ Renamed: ${oldName} → ${newName}`);
    } catch (error) {
      console.log(`❌ Error renaming ${oldName}:`, error.message);
    }
  } else {
    console.log(`⚠️  File not found: ${oldName}`);
  }
});

console.log('File renaming completed!'); 