// Simple script to copy HTML files to dist directory
import { copyFileSync } from 'fs';
import { join } from 'path';

const htmlFiles = [
  'privacy-policy.html',
  'terms-of-service.html',
  'data-deletion.html'
];

console.log('Copying HTML files to dist directory...');

htmlFiles.forEach(file => {
  try {
    copyFileSync(join(process.cwd(), file), join(process.cwd(), 'dist', file));
    console.log(`✓ Copied ${file} to dist directory`);
  } catch (error) {
    console.error(`✗ Error copying ${file}: ${error.message}`);
  }
});

console.log('HTML files copy process completed.');
