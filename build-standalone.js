import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building standalone racing game application...');

try {
  console.log('1. Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('2. Building client application...');
  execSync('cd client && npm run build', { stdio: 'inherit' });
  
  console.log('3. Building server application...');
  execSync('cd server && npm run build', { stdio: 'inherit' });
  
  console.log('4. Creating Electron package...');
  execSync('npm run electron:build', { stdio: 'inherit' });
  
  console.log('5. Creating distribution package...');
  execSync('npm run dist', { stdio: 'inherit' });
  
  console.log('✅ Standalone application built successfully!');
  console.log('📦 Check the dist/ folder for downloadable files');
  
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log('Available downloads:');
    files.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
