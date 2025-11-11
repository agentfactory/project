#!/usr/bin/env tsx
/**
 * CLI Interface for Site Maintenance Agent
 *
 * Provides easy command-line access to agent features
 */

import { SiteAgent, config } from './site-agent';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  console.log('🤖 Site Maintenance Agent CLI\n');

  switch (command) {
    case 'check':
      console.log('Running full site check...\n');
      await runFullCheck();
      break;

    case 'watch':
      console.log('Starting file watcher...\n');
      require('./watch');
      break;

    case 'help':
    case '--help':
    case '-h':
    default:
      printHelp();
      break;
  }
}

async function runFullCheck() {
  const agent = new SiteAgent(config);
  await agent.run();
}

function printHelp() {
  console.log(`
Usage: npm run agent [command]

Commands:
  check       Run a full site maintenance check (on-demand)
  watch       Start file watcher for proactive monitoring
  help        Show this help message

Examples:
  npm run agent:check    # Run on-demand check
  npm run agent:watch    # Start watching for file changes

The agent will:
  ✓ Monitor broken links (internal and external)
  ✓ Check image loading and file paths
  ✓ Validate HTML structure
  ✓ Check responsive design
  ✓ Analyze performance
  ✓ Automatically fix broken internal links
  ✓ Update blog listings from markdown files
  ✓ Format code consistently
  ✓ Update timestamps
  ✓ Organize content
  ✓ Log all changes to maintenance-log.md
  ✓ Update dashboard in README

For more information, see agent/README.md
  `);
}

main().catch(error => {
  console.error('❌ CLI error:', error);
  process.exit(1);
});
