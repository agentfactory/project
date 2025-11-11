#!/usr/bin/env tsx
/**
 * File Watcher for Proactive Site Maintenance
 *
 * Watches for file changes and automatically triggers the site agent
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const WATCH_DIRS = ['src', 'content', '.'];
const WATCH_EXTENSIONS = ['.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.md'];
const DEBOUNCE_MS = 2000;

let debounceTimer: NodeJS.Timeout | null = null;
let isRunning = false;

console.log('👀 File Watcher Started');
console.log('   Watching directories:', WATCH_DIRS.join(', '));
console.log('   File extensions:', WATCH_EXTENSIONS.join(', '));
console.log('   Debounce delay:', DEBOUNCE_MS, 'ms\n');

function runAgent() {
  if (isRunning) {
    console.log('⏳ Agent already running, skipping...\n');
    return;
  }

  isRunning = true;
  console.log('🤖 File change detected, running site agent...\n');

  try {
    execSync('npm run agent:check', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Agent execution failed:', error);
  } finally {
    isRunning = false;
    console.log('\n👀 Watching for changes...\n');
  }
}

function handleFileChange(eventType: string, filename: string) {
  if (!filename) return;

  const ext = path.extname(filename);
  if (!WATCH_EXTENSIONS.includes(ext)) return;

  console.log(`📝 ${eventType}: ${filename}`);

  // Debounce multiple rapid changes
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    runAgent();
  }, DEBOUNCE_MS);
}

// Watch directories
for (const dir of WATCH_DIRS) {
  const watchPath = path.join(process.cwd(), dir);

  if (fs.existsSync(watchPath)) {
    fs.watch(watchPath, { recursive: true }, handleFileChange);
    console.log(`✅ Watching: ${watchPath}`);
  } else {
    console.log(`⚠️  Directory not found: ${watchPath}`);
  }
}

console.log('\n👀 Watching for changes... (Press Ctrl+C to stop)\n');

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n\n👋 File watcher stopped');
  process.exit(0);
});
