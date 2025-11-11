# 🤖 Site Maintenance Agent

An autonomous agent that monitors and maintains The Agent Factory landing page, acting like a diligent developer to ensure the site remains clean, professional, and up-to-date.

## Features

### Monitoring Capabilities

The agent automatically monitors:

- ✅ **Broken Links** - Checks both internal and external links across all pages
- ✅ **Image Loading** - Validates image paths and file existence
- ✅ **Console Errors** - Detects JavaScript errors and warnings
- ✅ **HTML Validation** - Checks for proper HTML structure and meta tags
- ✅ **Responsive Design** - Analyzes CSS for responsive design patterns
- ✅ **Performance** - Monitors file sizes and optimization opportunities

### Automatic Maintenance Tasks

The agent automatically performs:

- 🔧 **Fix Broken Internal Links** - Automatically repairs broken internal links
- 📝 **Update Blog Listings** - Generates blog post listings from markdown files in `/content/blog/`
- 💅 **Format Code** - Maintains consistent code formatting using Prettier
- ⏰ **Update Timestamps** - Keeps "last updated" timestamps current
- 📂 **Organize Content** - Categorizes and organizes resources page content
- 🎨 **Remove Unused CSS** - Identifies and suggests removal of unused styles
- 🖼️ **Optimize Images** - Detects oversized images and suggests optimization

### Notifications & Logging

The agent provides:

- 📋 **Maintenance Log** - All changes logged to `maintenance-log.md`
- 💬 **Code Comments** - Adds explanatory comments for fixes
- 📊 **Dashboard** - Live status dashboard in README
- 💡 **Suggestions** - Smart recommendations for improvements

## Usage

### On-Demand Check

Run a full site maintenance check:

```bash
npm run agent:check
```

This will:
1. Scan all HTML, CSS, and JavaScript files
2. Check for issues
3. Apply automatic fixes
4. Update blog listings
5. Generate a report
6. Update the dashboard

### Proactive Monitoring

Start the file watcher for continuous monitoring:

```bash
npm run agent:watch
```

The agent will:
- Watch for file changes in `src/`, `content/`, and root directory
- Automatically run checks when files are modified
- Debounce rapid changes to avoid excessive runs
- Run maintenance tasks as needed

### CLI Interface

Use the interactive CLI:

```bash
npm run agent help
```

## What Gets Fixed Automatically vs. Suggested

### Automatic Actions ⚡

These issues are automatically fixed without human intervention:

- ✅ Broken internal links (if target file can be found)
- ✅ Blog post listings generation
- ✅ Code formatting
- ✅ Timestamp updates
- ✅ Content organization

### Suggestions Only 💡

These issues are logged as suggestions for human review:

- 📢 External link issues (can't auto-fix)
- 📢 Major structural changes needed
- 📢 Performance optimization opportunities
- 📢 UX improvements
- 📢 Responsive design enhancements

## Output Files

The agent creates and maintains:

### `maintenance-log.md`

A comprehensive log of all maintenance actions:

```markdown
# Site Maintenance Log

## 2025-11-11T10:30:00.000Z - AUTO-FIX

**Auto-fix applied**
- File: `index.html`
- Issue: Broken internal link
- Fix: Updated link path

---
```

### README Dashboard

A live dashboard section in your README:

```markdown
## 🤖 Site Maintenance Dashboard

**Last Check:** 2025-11-11T10:30:00.000Z

### Status Overview

| Metric | Count |
|--------|-------|
| Total Issues Found | 5 |
| Auto-Fixed | 3 |
| Requires Attention | 2 |

### Recent Issues
...
```

### `content/blog/_blog-listing.json`

Auto-generated blog post index:

```json
[
  {
    "path": "/content/blog/welcome-post.md",
    "filename": "welcome-post.md",
    "title": "Welcome to The Agent Factory",
    "date": "2025-11-11",
    "description": "Our first blog post",
    "tags": ["announcement", "welcome"]
  }
]
```

## Configuration

The agent is configured in `agent/site-agent.ts`:

```typescript
const config: AgentConfig = {
  projectRoot: process.cwd(),
  contentDir: path.join(process.cwd(), 'content'),
  blogDir: path.join(process.cwd(), 'content', 'blog'),
  resourcesDir: path.join(process.cwd(), 'content', 'resources'),
  logFile: path.join(process.cwd(), 'maintenance-log.md'),
  readmeFile: path.join(process.cwd(), 'README.md'),
  // ...
};
```

## Blog Post Format

Create blog posts in `/content/blog/` with frontmatter:

```markdown
---
title: My Blog Post Title
date: 2025-11-11
description: A short description
tags: tag1, tag2, tag3
---

# Blog Post Content

Your markdown content here...
```

The agent will automatically:
- Parse the frontmatter
- Generate the blog listing
- Sort posts by date
- Update the listing file

## Architecture

```
agent/
├── site-agent.ts    # Main agent implementation
├── cli.ts           # CLI interface
├── watch.ts         # File watcher
└── README.md        # This file

Key Classes:
- SiteAgent          # Orchestrates all operations
- Logger             # Handles logging to maintenance-log.md
- FileScanner        # Discovers files to check
- LinkChecker        # Validates links
- ImageChecker       # Validates images
- HtmlValidator      # Validates HTML structure
- ResponsiveChecker  # Checks responsive design
- PerformanceChecker # Analyzes performance
- BlogManager        # Manages blog listings
- LinkFixer          # Fixes broken links
- CodeFormatter      # Formats code
- TimestampUpdater   # Updates timestamps
- DashboardManager   # Updates README dashboard
```

## Best Practices

### When to Run

- **On-Demand**: Before deploying, after major changes
- **Watch Mode**: During active development
- **CI/CD**: As part of build pipeline

### Interpreting Results

- **Errors** (🔴): Must be addressed
- **Warnings** (⚠️): Should be addressed
- **Info** (ℹ️): Optional improvements

### Customization

To customize behavior, edit `agent/site-agent.ts`:

1. **Add new checks**: Create a new checker class
2. **Modify auto-fixes**: Update the maintenance classes
3. **Change thresholds**: Adjust size limits, etc.
4. **Add file types**: Update file scanner patterns

## Troubleshooting

### Agent won't run

```bash
# Check tsx is installed
npm list tsx

# Reinstall dependencies
npm install
```

### Files not being watched

```bash
# Check directory exists
ls -la content/

# Verify watch script
npm run agent:watch
```

### Fixes not being applied

- Check file permissions
- Review `maintenance-log.md` for errors
- Run with `npm run agent:check` for detailed output

## Examples

### Example 1: Adding a Blog Post

```bash
# Create a new blog post
echo "---
title: Hello World
date: 2025-11-11
description: My first post
---

# Hello World

This is my first blog post!" > content/blog/hello-world.md

# Run the agent
npm run agent:check

# Check the generated listing
cat content/blog/_blog-listing.json
```

### Example 2: Fixing Broken Links

```html
<!-- Before -->
<a href="/old-path/page.html">Link</a>

<!-- Agent automatically updates to -->
<a href="/new-path/page.html">Link</a>
```

### Example 3: Monitoring During Development

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start agent watcher
npm run agent:watch

# Now edit files - agent runs automatically!
```

## Integration with CI/CD

Add to your GitHub Actions workflow:

```yaml
name: Site Maintenance

on: [push, pull_request]

jobs:
  maintenance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run agent:check
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "🤖 Automated site maintenance"
```

## Contributing

The agent is designed to be extensible. To add new features:

1. Create a new checker/fixer class
2. Register it in the `SiteAgent.run()` method
3. Add corresponding tests
4. Update this documentation

## License

Part of The Agent Factory project.
