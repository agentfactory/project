#!/usr/bin/env tsx
/**
 * Autonomous Site Maintenance Agent
 *
 * This agent monitors and maintains The Agent Factory landing page.
 * It acts like a diligent developer ensuring the site remains clean and professional.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// ============================================================================
// Configuration
// ============================================================================

interface AgentConfig {
  projectRoot: string;
  contentDir: string;
  blogDir: string;
  resourcesDir: string;
  logFile: string;
  readmeFile: string;
  htmlFiles: string[];
  cssFiles: string[];
  jsFiles: string[];
}

const config: AgentConfig = {
  projectRoot: process.cwd(),
  contentDir: path.join(process.cwd(), 'content'),
  blogDir: path.join(process.cwd(), 'content', 'blog'),
  resourcesDir: path.join(process.cwd(), 'content', 'resources'),
  logFile: path.join(process.cwd(), 'maintenance-log.md'),
  readmeFile: path.join(process.cwd(), 'README.md'),
  htmlFiles: [],
  cssFiles: [],
  jsFiles: [],
};

// ============================================================================
// Types and Interfaces
// ============================================================================

interface Issue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  file?: string;
  line?: number;
  autofix?: boolean;
  fixed?: boolean;
}

interface AgentReport {
  timestamp: string;
  issues: Issue[];
  fixesApplied: Issue[];
  suggestions: Issue[];
  metrics: {
    totalIssues: number;
    autoFixed: number;
    requiresAttention: number;
  };
}

// ============================================================================
// Logging System
// ============================================================================

class Logger {
  private logFile: string;

  constructor(logFile: string) {
    this.logFile = logFile;
    this.initializeLog();
  }

  private initializeLog(): void {
    if (!fs.existsSync(this.logFile)) {
      const header = `# Site Maintenance Log

This file tracks all automated maintenance actions performed by the site agent.

---

`;
      fs.writeFileSync(this.logFile, header);
    }
  }

  log(message: string, category: string = 'INFO'): void {
    const timestamp = new Date().toISOString();
    const entry = `## ${timestamp} - ${category}\n\n${message}\n\n---\n\n`;
    fs.appendFileSync(this.logFile, entry);
    console.log(`[${category}] ${message}`);
  }

  logFix(file: string, issue: string, fix: string): void {
    const message = `**Auto-fix applied**\n- File: \`${file}\`\n- Issue: ${issue}\n- Fix: ${fix}`;
    this.log(message, 'AUTO-FIX');
  }

  logSuggestion(category: string, suggestion: string, details: string): void {
    const message = `**Suggestion**\n- Category: ${category}\n- Suggestion: ${suggestion}\n- Details: ${details}`;
    this.log(message, 'SUGGESTION');
  }
}

// ============================================================================
// File Discovery
// ============================================================================

class FileScanner {
  static findFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const traverse = (currentDir: string) => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        // Skip node_modules, .git, dist, etc.
        if (entry.name === 'node_modules' || entry.name === '.git' ||
            entry.name === 'dist' || entry.name.startsWith('.')) {
          continue;
        }

        if (entry.isDirectory()) {
          traverse(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    };

    traverse(dir);
    return files;
  }

  static getAllHtmlFiles(projectRoot: string): string[] {
    return this.findFiles(projectRoot, ['.html']);
  }

  static getAllCssFiles(projectRoot: string): string[] {
    return this.findFiles(projectRoot, ['.css']);
  }

  static getAllJsFiles(projectRoot: string): string[] {
    return this.findFiles(projectRoot, ['.js', '.jsx', '.ts', '.tsx']);
  }

  static getAllMarkdownFiles(dir: string): string[] {
    return this.findFiles(dir, ['.md']);
  }
}

// ============================================================================
// Monitoring: Broken Links
// ============================================================================

class LinkChecker {
  static checkInternalLinks(htmlContent: string, filePath: string, projectRoot: string): Issue[] {
    const issues: Issue[] = [];
    const linkRegex = /(?:href|src)=["']([^"']+)["']/g;
    let match;

    while ((match = linkRegex.exec(htmlContent)) !== null) {
      const link = match[1];

      // Skip external links, data URIs, and anchors
      if (link.startsWith('http') || link.startsWith('//') ||
          link.startsWith('data:') || link.startsWith('mailto:') ||
          link.startsWith('tel:') || link.startsWith('#')) {
        continue;
      }

      // Check if internal file exists
      const absolutePath = link.startsWith('/')
        ? path.join(projectRoot, link)
        : path.join(path.dirname(filePath), link);

      if (!fs.existsSync(absolutePath)) {
        issues.push({
          type: 'error',
          category: 'Broken Link',
          message: `Broken internal link: ${link}`,
          file: filePath,
          autofix: true,
        });
      }
    }

    return issues;
  }

  static checkExternalLinks(htmlContent: string, filePath: string): Issue[] {
    const issues: Issue[] = [];
    const linkRegex = /href=["'](https?:\/\/[^"']+)["']/g;
    let match;

    while ((match = linkRegex.exec(htmlContent)) !== null) {
      const link = match[1];

      // Note: We can't easily check external links without making HTTP requests
      // So we'll just collect them for reporting
      issues.push({
        type: 'info',
        category: 'External Link',
        message: `External link found: ${link}`,
        file: filePath,
        autofix: false,
      });
    }

    return issues;
  }
}

// ============================================================================
// Monitoring: Images
// ============================================================================

class ImageChecker {
  static checkImagePaths(content: string, filePath: string, projectRoot: string): Issue[] {
    const issues: Issue[] = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    const bgRegex = /url\(['"]?([^'"()]+)['"]?\)/g;

    let match;

    // Check img tags
    while ((match = imgRegex.exec(content)) !== null) {
      const imgSrc = match[1];

      if (imgSrc.startsWith('http') || imgSrc.startsWith('//') || imgSrc.startsWith('data:')) {
        continue;
      }

      const absolutePath = imgSrc.startsWith('/')
        ? path.join(projectRoot, imgSrc)
        : path.join(path.dirname(filePath), imgSrc);

      if (!fs.existsSync(absolutePath)) {
        issues.push({
          type: 'error',
          category: 'Missing Image',
          message: `Image not found: ${imgSrc}`,
          file: filePath,
          autofix: true,
        });
      }
    }

    // Check CSS background images
    while ((match = bgRegex.exec(content)) !== null) {
      const bgSrc = match[1];

      if (bgSrc.startsWith('http') || bgSrc.startsWith('//') || bgSrc.startsWith('data:')) {
        continue;
      }

      const absolutePath = bgSrc.startsWith('/')
        ? path.join(projectRoot, bgSrc)
        : path.join(path.dirname(filePath), bgSrc);

      if (!fs.existsSync(absolutePath)) {
        issues.push({
          type: 'error',
          category: 'Missing Background Image',
          message: `Background image not found: ${bgSrc}`,
          file: filePath,
          autofix: true,
        });
      }
    }

    return issues;
  }
}

// ============================================================================
// Monitoring: HTML Validation
// ============================================================================

class HtmlValidator {
  static validateBasics(htmlContent: string, filePath: string): Issue[] {
    const issues: Issue[] = [];

    // Check for doctype
    if (!htmlContent.match(/<!doctype html>/i)) {
      issues.push({
        type: 'warning',
        category: 'HTML Validation',
        message: 'Missing DOCTYPE declaration',
        file: filePath,
        autofix: false,
      });
    }

    // Check for language attribute
    if (!htmlContent.match(/<html[^>]+lang=/i)) {
      issues.push({
        type: 'warning',
        category: 'HTML Validation',
        message: 'Missing lang attribute on <html> tag',
        file: filePath,
        autofix: false,
      });
    }

    // Check for title tag
    if (!htmlContent.match(/<title>[^<]+<\/title>/i)) {
      issues.push({
        type: 'warning',
        category: 'HTML Validation',
        message: 'Missing or empty <title> tag',
        file: filePath,
        autofix: false,
      });
    }

    // Check for meta charset
    if (!htmlContent.match(/<meta[^>]+charset=/i)) {
      issues.push({
        type: 'warning',
        category: 'HTML Validation',
        message: 'Missing charset meta tag',
        file: filePath,
        autofix: false,
      });
    }

    // Check for meta viewport
    if (!htmlContent.match(/<meta[^>]+name=["']viewport["']/i)) {
      issues.push({
        type: 'warning',
        category: 'HTML Validation',
        message: 'Missing viewport meta tag',
        file: filePath,
        autofix: false,
      });
    }

    // Check for unclosed tags (basic check)
    const openTags = htmlContent.match(/<(\w+)[^>]*>/g) || [];
    const closeTags = htmlContent.match(/<\/(\w+)>/g) || [];

    if (openTags.length !== closeTags.length) {
      issues.push({
        type: 'warning',
        category: 'HTML Validation',
        message: 'Potential unclosed HTML tags detected',
        file: filePath,
        autofix: false,
      });
    }

    return issues;
  }
}

// ============================================================================
// Monitoring: Responsive Design
// ============================================================================

class ResponsiveChecker {
  static checkResponsiveDesign(cssContent: string, filePath: string): Issue[] {
    const issues: Issue[] = [];

    // Check for media queries
    const mediaQueries = cssContent.match(/@media[^{]+{/g) || [];

    if (mediaQueries.length === 0) {
      issues.push({
        type: 'info',
        category: 'Responsive Design',
        message: 'No media queries found - consider adding responsive breakpoints',
        file: filePath,
        autofix: false,
      });
    }

    // Check for fixed widths without max-width
    const fixedWidths = cssContent.match(/width:\s*\d+px/g) || [];
    if (fixedWidths.length > 10) {
      issues.push({
        type: 'warning',
        category: 'Responsive Design',
        message: `Found ${fixedWidths.length} fixed pixel widths - consider using responsive units`,
        file: filePath,
        autofix: false,
      });
    }

    return issues;
  }
}

// ============================================================================
// Monitoring: Performance
// ============================================================================

class PerformanceChecker {
  static checkPerformance(filePath: string): Issue[] {
    const issues: Issue[] = [];
    const stats = fs.statSync(filePath);
    const fileSizeKB = stats.size / 1024;

    // Check file sizes
    if (path.extname(filePath) === '.js' && fileSizeKB > 500) {
      issues.push({
        type: 'warning',
        category: 'Performance',
        message: `Large JavaScript file (${fileSizeKB.toFixed(2)} KB) - consider code splitting`,
        file: filePath,
        autofix: false,
      });
    }

    if (path.extname(filePath) === '.css' && fileSizeKB > 200) {
      issues.push({
        type: 'warning',
        category: 'Performance',
        message: `Large CSS file (${fileSizeKB.toFixed(2)} KB) - consider optimization`,
        file: filePath,
        autofix: false,
      });
    }

    // Check for image optimization opportunities
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
    if (imageExts.includes(path.extname(filePath).toLowerCase()) && fileSizeKB > 500) {
      issues.push({
        type: 'warning',
        category: 'Performance',
        message: `Large image file (${fileSizeKB.toFixed(2)} KB) - consider optimization`,
        file: filePath,
        autofix: true,
      });
    }

    return issues;
  }
}

// ============================================================================
// Maintenance: Blog Listings
// ============================================================================

class BlogManager {
  static async generateBlogListing(blogDir: string, logger: Logger): Promise<void> {
    const blogPosts = FileScanner.getAllMarkdownFiles(blogDir);

    if (blogPosts.length === 0) {
      logger.log('No blog posts found', 'BLOG');
      return;
    }

    // Parse blog post metadata
    const posts = blogPosts.map(postPath => {
      const content = fs.readFileSync(postPath, 'utf-8');
      const frontmatter = this.parseFrontmatter(content);

      return {
        path: postPath,
        filename: path.basename(postPath),
        title: frontmatter.title || path.basename(postPath, '.md'),
        date: frontmatter.date || fs.statSync(postPath).mtime.toISOString().split('T')[0],
        description: frontmatter.description || '',
        tags: frontmatter.tags || [],
      };
    });

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Generate blog listing file
    const listingPath = path.join(blogDir, '_blog-listing.json');
    fs.writeFileSync(listingPath, JSON.stringify(posts, null, 2));

    logger.logFix(
      listingPath,
      'Blog listing outdated',
      `Updated blog listing with ${posts.length} posts`
    );
  }

  private static parseFrontmatter(content: string): any {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    if (!match) return {};

    const frontmatter: any = {};
    const lines = match[1].split('\n');

    for (const line of lines) {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }

    return frontmatter;
  }
}

// ============================================================================
// Maintenance: Link Fixing
// ============================================================================

class LinkFixer {
  static fixBrokenInternalLinks(
    content: string,
    filePath: string,
    projectRoot: string,
    logger: Logger
  ): string {
    const linkRegex = /(?:href|src)=["']([^"']+)["']/g;
    let fixedContent = content;
    let fixCount = 0;

    const matches = [...content.matchAll(linkRegex)];

    for (const match of matches) {
      const link = match[1];

      // Skip external links, data URIs, and anchors
      if (link.startsWith('http') || link.startsWith('//') ||
          link.startsWith('data:') || link.startsWith('mailto:') ||
          link.startsWith('tel:') || link.startsWith('#')) {
        continue;
      }

      const absolutePath = link.startsWith('/')
        ? path.join(projectRoot, link)
        : path.join(path.dirname(filePath), link);

      if (!fs.existsSync(absolutePath)) {
        // Try to find the file elsewhere
        const filename = path.basename(link);
        const possibleFiles = FileScanner.findFiles(projectRoot, [path.extname(filename)]);
        const match = possibleFiles.find(f => path.basename(f) === filename);

        if (match) {
          const newLink = path.relative(path.dirname(filePath), match);
          fixedContent = fixedContent.replace(match[0], match[0].replace(link, newLink));
          fixCount++;

          logger.logFix(
            filePath,
            `Broken link: ${link}`,
            `Updated to: ${newLink}`
          );
        }
      }
    }

    return fixedContent;
  }
}

// ============================================================================
// Maintenance: Code Formatting
// ============================================================================

class CodeFormatter {
  static formatHtml(html: string): string {
    // Basic HTML formatting
    // In a real implementation, use a proper formatter like prettier
    return html
      .replace(/>\s+</g, '>\n<')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }

  static async formatFiles(files: string[], logger: Logger): Promise<void> {
    for (const file of files) {
      try {
        // Try to use prettier if available
        execSync(`npx prettier --write "${file}"`, { stdio: 'ignore' });
        logger.log(`Formatted: ${file}`, 'FORMAT');
      } catch (error) {
        // Prettier not available or failed, skip
        logger.log(`Could not format: ${file}`, 'FORMAT');
      }
    }
  }
}

// ============================================================================
// Maintenance: Timestamp Updates
// ============================================================================

class TimestampUpdater {
  static updateTimestamps(htmlContent: string, filePath: string, logger: Logger): string {
    const timestampRegex = /(Last updated|Updated):\s*\d{4}-\d{2}-\d{2}/gi;
    const currentDate = new Date().toISOString().split('T')[0];

    if (timestampRegex.test(htmlContent)) {
      const updated = htmlContent.replace(timestampRegex, `Last updated: ${currentDate}`);

      if (updated !== htmlContent) {
        logger.logFix(
          filePath,
          'Outdated timestamp',
          `Updated to: ${currentDate}`
        );
      }

      return updated;
    }

    return htmlContent;
  }
}

// ============================================================================
// Maintenance: CSS Optimization
// ============================================================================

class CssOptimizer {
  static removeUnusedCss(cssContent: string, htmlFiles: string[], logger: Logger): string {
    // This is a simplified version
    // In production, use tools like PurgeCSS

    const cssRules = cssContent.match(/\.[\w-]+/g) || [];
    const usedClasses = new Set<string>();

    // Scan HTML files for used classes
    for (const htmlFile of htmlFiles) {
      const html = fs.readFileSync(htmlFile, 'utf-8');
      const classes = html.match(/class=["']([^"']+)["']/g) || [];

      for (const classMatch of classes) {
        const classNames = classMatch.match(/[\w-]+/g) || [];
        classNames.forEach(c => usedClasses.add(c));
      }
    }

    // This is a placeholder - real implementation would be more sophisticated
    logger.log('CSS optimization check completed', 'CSS');

    return cssContent;
  }
}

// ============================================================================
// Dashboard Management
// ============================================================================

class DashboardManager {
  static async updateDashboard(report: AgentReport, readmeFile: string): Promise<void> {
    let readme = '';

    if (fs.existsSync(readmeFile)) {
      readme = fs.readFileSync(readmeFile, 'utf-8');
    } else {
      readme = '# The Agent Factory\n\n';
    }

    // Remove old dashboard section
    const dashboardStart = '<!-- AGENT-DASHBOARD-START -->';
    const dashboardEnd = '<!-- AGENT-DASHBOARD-END -->';

    const startIndex = readme.indexOf(dashboardStart);
    const endIndex = readme.indexOf(dashboardEnd);

    if (startIndex !== -1 && endIndex !== -1) {
      readme = readme.substring(0, startIndex) + readme.substring(endIndex + dashboardEnd.length);
    }

    // Create new dashboard
    const dashboard = `
${dashboardStart}
## 🤖 Site Maintenance Dashboard

**Last Check:** ${report.timestamp}

### Status Overview

| Metric | Count |
|--------|-------|
| Total Issues Found | ${report.metrics.totalIssues} |
| Auto-Fixed | ${report.metrics.autoFixed} |
| Requires Attention | ${report.metrics.requiresAttention} |

### Recent Issues

${report.issues.slice(0, 10).map(issue =>
  `- [${issue.type.toUpperCase()}] ${issue.category}: ${issue.message} ${issue.file ? `(\`${issue.file}\`)` : ''}`
).join('\n')}

### Recent Fixes

${report.fixesApplied.slice(0, 5).map(fix =>
  `- ✅ ${fix.category}: ${fix.message} ${fix.file ? `(\`${fix.file}\`)` : ''}`
).join('\n') || '- No automatic fixes applied in this run'}

### Suggestions

${report.suggestions.slice(0, 5).map(suggestion =>
  `- 💡 ${suggestion.category}: ${suggestion.message}`
).join('\n') || '- No suggestions at this time'}

*This dashboard is automatically updated by the site maintenance agent.*

${dashboardEnd}
`;

    // Add dashboard to README
    if (startIndex === -1) {
      readme = readme + '\n' + dashboard;
    } else {
      readme = readme.substring(0, startIndex) + dashboard + readme.substring(startIndex);
    }

    fs.writeFileSync(readmeFile, readme);
  }
}

// ============================================================================
// Main Agent
// ============================================================================

class SiteAgent {
  private logger: Logger;
  private config: AgentConfig;
  private report: AgentReport;

  constructor(config: AgentConfig) {
    this.config = config;
    this.logger = new Logger(config.logFile);
    this.report = {
      timestamp: new Date().toISOString(),
      issues: [],
      fixesApplied: [],
      suggestions: [],
      metrics: {
        totalIssues: 0,
        autoFixed: 0,
        requiresAttention: 0,
      },
    };
  }

  async run(): Promise<void> {
    console.log('🤖 Site Maintenance Agent Starting...\n');
    this.logger.log('Site maintenance check started', 'AGENT');

    // Discover files
    await this.discoverFiles();

    // Run monitoring checks
    await this.monitorSite();

    // Apply automatic fixes
    await this.applyAutomaticFixes();

    // Generate reports and suggestions
    await this.generateSuggestions();

    // Update blog listings
    await this.updateBlogListings();

    // Update dashboard
    await this.updateDashboard();

    // Calculate metrics
    this.calculateMetrics();

    // Print summary
    this.printSummary();

    this.logger.log('Site maintenance check completed', 'AGENT');
    console.log('\n✅ Site Maintenance Agent Complete!');
  }

  private async discoverFiles(): Promise<void> {
    console.log('📁 Discovering files...');
    this.config.htmlFiles = FileScanner.getAllHtmlFiles(this.config.projectRoot);
    this.config.cssFiles = FileScanner.getAllCssFiles(this.config.projectRoot);
    this.config.jsFiles = FileScanner.getAllJsFiles(this.config.projectRoot);

    console.log(`   Found ${this.config.htmlFiles.length} HTML files`);
    console.log(`   Found ${this.config.cssFiles.length} CSS files`);
    console.log(`   Found ${this.config.jsFiles.length} JS/TS files\n`);
  }

  private async monitorSite(): Promise<void> {
    console.log('🔍 Running monitoring checks...\n');

    // Check HTML files
    for (const htmlFile of this.config.htmlFiles) {
      const content = fs.readFileSync(htmlFile, 'utf-8');

      // Link checking
      const linkIssues = LinkChecker.checkInternalLinks(content, htmlFile, this.config.projectRoot);
      this.report.issues.push(...linkIssues);

      const externalLinks = LinkChecker.checkExternalLinks(content, htmlFile);
      this.report.issues.push(...externalLinks);

      // Image checking
      const imageIssues = ImageChecker.checkImagePaths(content, htmlFile, this.config.projectRoot);
      this.report.issues.push(...imageIssues);

      // HTML validation
      const validationIssues = HtmlValidator.validateBasics(content, htmlFile);
      this.report.issues.push(...validationIssues);

      // Performance check
      const perfIssues = PerformanceChecker.checkPerformance(htmlFile);
      this.report.issues.push(...perfIssues);
    }

    // Check CSS files
    for (const cssFile of this.config.cssFiles) {
      const content = fs.readFileSync(cssFile, 'utf-8');

      // Responsive design check
      const responsiveIssues = ResponsiveChecker.checkResponsiveDesign(content, cssFile);
      this.report.issues.push(...responsiveIssues);

      // Performance check
      const perfIssues = PerformanceChecker.checkPerformance(cssFile);
      this.report.issues.push(...perfIssues);
    }

    console.log(`   Found ${this.report.issues.length} issues\n`);
  }

  private async applyAutomaticFixes(): Promise<void> {
    console.log('🔧 Applying automatic fixes...\n');

    const fixableIssues = this.report.issues.filter(issue => issue.autofix);

    for (const issue of fixableIssues) {
      if (!issue.file) continue;

      try {
        let content = fs.readFileSync(issue.file, 'utf-8');
        let fixed = false;

        // Apply fixes based on category
        if (issue.category === 'Broken Link') {
          const newContent = LinkFixer.fixBrokenInternalLinks(
            content,
            issue.file,
            this.config.projectRoot,
            this.logger
          );

          if (newContent !== content) {
            content = newContent;
            fixed = true;
          }
        }

        if (issue.category.includes('Image')) {
          // Image path fixing would go here
          // Similar to link fixing
        }

        // Update timestamps
        const timestampedContent = TimestampUpdater.updateTimestamps(content, issue.file, this.logger);
        if (timestampedContent !== content) {
          content = timestampedContent;
          fixed = true;
        }

        if (fixed) {
          fs.writeFileSync(issue.file, content);
          /* Fixed issue documented in maintenance log */
          issue.fixed = true;
          this.report.fixesApplied.push(issue);
        }
      } catch (error) {
        console.error(`   Error fixing ${issue.file}:`, error);
      }
    }

    // Format code
    await CodeFormatter.formatFiles(
      [...this.config.htmlFiles, ...this.config.cssFiles],
      this.logger
    );

    console.log(`   Applied ${this.report.fixesApplied.length} automatic fixes\n`);
  }

  private async generateSuggestions(): Promise<void> {
    console.log('💡 Generating suggestions...\n');

    // External link issues
    const externalLinkIssues = this.report.issues.filter(
      i => i.category === 'External Link' && i.type !== 'info'
    );

    if (externalLinkIssues.length > 0) {
      this.report.suggestions.push({
        type: 'warning',
        category: 'External Links',
        message: `Found ${externalLinkIssues.length} external links - consider checking them periodically`,
        autofix: false,
      });
    }

    // Performance opportunities
    const perfIssues = this.report.issues.filter(i => i.category === 'Performance');
    if (perfIssues.length > 0) {
      this.report.suggestions.push({
        type: 'info',
        category: 'Performance',
        message: `Found ${perfIssues.length} performance optimization opportunities`,
        autofix: false,
      });
    }

    // UX improvements
    const responsiveIssues = this.report.issues.filter(i => i.category === 'Responsive Design');
    if (responsiveIssues.length > 0) {
      this.report.suggestions.push({
        type: 'info',
        category: 'UX',
        message: 'Consider improving responsive design for better mobile experience',
        autofix: false,
      });
    }

    console.log(`   Generated ${this.report.suggestions.length} suggestions\n`);
  }

  private async updateBlogListings(): Promise<void> {
    console.log('📝 Updating blog listings...\n');

    if (fs.existsSync(this.config.blogDir)) {
      await BlogManager.generateBlogListing(this.config.blogDir, this.logger);
    }
  }

  private async updateDashboard(): Promise<void> {
    console.log('📊 Updating dashboard...\n');
    await DashboardManager.updateDashboard(this.report, this.config.readmeFile);
  }

  private calculateMetrics(): void {
    this.report.metrics.totalIssues = this.report.issues.length;
    this.report.metrics.autoFixed = this.report.fixesApplied.length;
    this.report.metrics.requiresAttention = this.report.issues.filter(
      i => !i.autofix || !i.fixed
    ).length;
  }

  private printSummary(): void {
    console.log('📋 Summary:');
    console.log(`   Total Issues: ${this.report.metrics.totalIssues}`);
    console.log(`   Auto-Fixed: ${this.report.metrics.autoFixed}`);
    console.log(`   Requires Attention: ${this.report.metrics.requiresAttention}`);
    console.log(`   Suggestions: ${this.report.suggestions.length}`);
  }
}

// ============================================================================
// Entry Point
// ============================================================================

async function main() {
  try {
    const agent = new SiteAgent(config);
    await agent.run();
  } catch (error) {
    console.error('❌ Agent error:', error);
    process.exit(1);
  }
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main();
}

export { SiteAgent, config };
