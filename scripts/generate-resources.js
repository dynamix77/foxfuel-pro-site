#!/usr/bin/env node
/**
 * Resource Page Generator for Fox Fuel Pro Site
 *
 * Converts Markdown drafts with YAML front matter to HTML pages
 * using TEMPLATE-resource-single.html
 *
 * Front Matter Schema (required):
 * ---
 * slug: "post-url-slug"
 * title: "Full Title"
 * shortTitle: "Breadcrumb Title"
 * description: "Meta description"
 * category: "Fleet Operations"
 * tagType: "fleet"
 * publishDate: "2026-01-15"
 * readTimeMinutes: 8
 * hero:
 *   src: "images/slug-header.png"
 *   alt: "Hero image alt text"
 * inlineImage:
 *   src: "images/slug-inline.png"
 *   alt: "Inline image alt text"
 *   insertAfter: "## Section Heading"  # Optional: heading after which to insert image
 * ---
 *
 * Usage: node scripts/generate-resources.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const RESOURCES_DIR = path.join(ROOT_DIR, 'resources');
const DRAFTS_DIR = path.join(RESOURCES_DIR, 'drafts');
const TEMPLATE_PATH = path.join(RESOURCES_DIR, 'TEMPLATE-resource-single.html');
const MANIFEST_PATH = path.join(RESOURCES_DIR, 'resources.manifest.json');

// Load valid tagTypes from manifest (single source of truth)
function loadValidTagTypes() {
  try {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    return Object.keys(manifest.categoryTags || {});
  } catch (e) {
    console.error(`WARNING: Could not load manifest: ${e.message}`);
    // Fallback to known types if manifest is unavailable
    return ['fleet', 'construction', 'critical', 'decision', 'healthcare', 'manufacturing'];
  }
}

// Parse YAML front matter from Markdown
function parseFrontMatter(content) {
  // Normalize line endings to LF for consistent parsing
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return { frontMatter: null, body: content };
  }

  const yamlStr = match[1];
  const body = match[2];

  // Simple YAML parser for our specific schema
  const frontMatter = {};
  let currentKey = null;
  let currentObject = null;

  yamlStr.split('\n').forEach(line => {
    // Skip empty lines
    if (!line.trim()) return;

    // Check for nested object start (indented key)
    const nestedMatch = line.match(/^  (\w+):\s*"?([^"]*)"?$/);
    if (nestedMatch && currentObject) {
      let value = nestedMatch[2].trim();
      // Remove trailing quote if present
      if (value.endsWith('"')) value = value.slice(0, -1);
      currentObject[nestedMatch[1]] = value;
      return;
    }

    // Check for top-level key
    const topMatch = line.match(/^(\w+):\s*(.*)$/);
    if (topMatch) {
      const key = topMatch[1];
      let value = topMatch[2].trim();

      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      // Check if this starts a nested object (empty value or next line is indented)
      if (value === '' || value === 'null') {
        if (value === 'null') {
          frontMatter[key] = null;
          currentKey = null;
          currentObject = null;
        } else {
          frontMatter[key] = {};
          currentKey = key;
          currentObject = frontMatter[key];
        }
      } else {
        // Parse numbers
        if (/^\d+$/.test(value)) {
          value = parseInt(value, 10);
        }
        frontMatter[key] = value;
        currentKey = null;
        currentObject = null;
      }
    }
  });

  return { frontMatter, body };
}

// Read the template
function readTemplate() {
  return fs.readFileSync(TEMPLATE_PATH, 'utf-8');
}

// Convert Markdown to HTML
function markdownToHtml(markdown, inlineImage) {
  let html = markdown;

  // Remove front matter if still present
  html = html.replace(/^---[\s\S]*?---\n*/m, '');

  // Remove the first H1 (title) - it goes in the article header, not body
  html = html.replace(/^#\s+[^\n]+\n*/m, '');

  // Remove subtitle/meta lines (bold + italic lines at start)
  html = html.replace(/^\*\*[^\n]+\*\*\n*/m, '');
  html = html.replace(/^\*[^\n]+\*\n*/m, '');

  // Remove horizontal rules used as separators
  html = html.replace(/^---+\n*/gm, '');

  // Convert tables
  html = convertTables(html);

  // Convert blockquotes
  html = html.replace(/^>\s*(.+)$/gm, '<blockquote><p>$1</p></blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Convert headers (H2 and below)
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');

  // Insert inline image after specified heading if provided
  if (inlineImage && inlineImage.src && inlineImage.insertAfter) {
    const headingText = inlineImage.insertAfter.replace(/^#+\s*/, '');
    const headingPattern = new RegExp(`(<h[2-6]>${escapeRegex(headingText)}</h[2-6]>)`);
    const imageHtml = `
        <figure class="article-content-image">
          <img src="${inlineImage.src}" alt="${inlineImage.alt || ''}" loading="lazy" style="width: 100%; height: auto; display: block; border-radius: 8px; margin: 2rem 0;">
        </figure>
`;
    html = html.replace(headingPattern, `$1\n${imageHtml}`);
  }

  // Convert unordered lists
  html = convertLists(html, /^[-*]\s+/gm, 'ul');

  // Convert ordered lists
  html = convertLists(html, /^\d+\.\s+/gm, 'ol');

  // Convert checkbox lists (treat as regular lists)
  html = html.replace(/^- \[[ x]\]\s+/gm, '- ');

  // Convert bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Convert links (but not image links)
  html = html.replace(/(?<!\!)\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Convert paragraphs
  html = convertParagraphs(html);

  // Clean up extra whitespace
  html = html.replace(/\n{3,}/g, '\n\n');

  return html.trim();
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Convert Markdown tables to HTML
function convertTables(html) {
  const lines = html.split('\n');
  const result = [];
  let inTable = false;
  let tableLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableLine = line.trim().startsWith('|') && line.trim().endsWith('|');
    const isSeparatorLine = /^\|[-:\s|]+\|$/.test(line.trim());

    if (isTableLine && !isSeparatorLine) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(line);
    } else if (isSeparatorLine && inTable) {
      continue;
    } else {
      if (inTable) {
        result.push(convertTableLines(tableLines));
        inTable = false;
        tableLines = [];
      }
      result.push(line);
    }
  }

  if (inTable) {
    result.push(convertTableLines(tableLines));
  }

  return result.join('\n');
}

function convertTableLines(lines) {
  if (lines.length === 0) return '';

  let html = '<table class="comparison-table">\n';

  lines.forEach((line, index) => {
    const cells = line.split('|').filter(cell => cell.trim() !== '');
    const tag = index === 0 ? 'th' : 'td';

    if (index === 0) {
      html += '  <thead>\n';
    } else if (index === 1) {
      html += '  <tbody>\n';
    }

    html += '    <tr>\n';
    cells.forEach(cell => {
      html += `      <${tag}>${cell.trim()}</${tag}>\n`;
    });
    html += '    </tr>\n';

    if (index === 0) {
      html += '  </thead>\n';
    }
  });

  html += '  </tbody>\n</table>';
  return html;
}

// Convert list blocks
function convertLists(html, pattern, listType) {
  const lines = html.split('\n');
  const result = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = pattern.test(line);

    if (isListItem) {
      if (!inList) {
        result.push(`<${listType}>`);
        inList = true;
      }
      const content = line.replace(pattern, '').replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
      result.push(`  <li>${content}</li>`);
    } else {
      if (inList && line.trim() === '') {
        if (i + 1 < lines.length && pattern.test(lines[i + 1])) {
          continue;
        }
        result.push(`</${listType}>`);
        inList = false;
      } else if (inList && !isListItem) {
        result.push(`</${listType}>`);
        inList = false;
      }
      result.push(line);
    }
  }

  if (inList) {
    result.push(`</${listType}>`);
  }

  return result.join('\n');
}

// Wrap loose text in paragraph tags
function convertParagraphs(html) {
  const lines = html.split('\n');
  const result = [];
  let currentParagraph = [];

  const isHtmlTag = (line) => {
    const trimmed = line.trim();
    return trimmed.startsWith('<') && !trimmed.startsWith('<a ') && !trimmed.startsWith('<strong') && !trimmed.startsWith('<em') && !trimmed.startsWith('<code');
  };

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim();
      if (text) {
        result.push(`<p>${text}</p>`);
      }
      currentParagraph = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      flushParagraph();
      result.push('');
    } else if (isHtmlTag(trimmed)) {
      flushParagraph();
      result.push(line);
    } else {
      currentParagraph.push(trimmed);
    }
  }

  flushParagraph();

  return result.join('\n');
}

// Generate HTML page from front matter and markdown content
function generateResourcePage(frontMatter, markdownBody, template) {
  let html = template;

  // Convert markdown to HTML content
  const bodyContent = markdownToHtml(markdownBody, frontMatter.inlineImage);

  // Replace template placeholders
  html = html.replace(/\[TITLE\]/g, frontMatter.title);
  html = html.replace(/\[DESCRIPTION\]/g, frontMatter.description);
  html = html.replace(/\[PATH\]/g, `${frontMatter.slug}.html`);
  html = html.replace(/\[SHORT TITLE\]/g, frontMatter.shortTitle);
  html = html.replace(/\[TYPE\]/g, frontMatter.tagType);
  html = html.replace(/\[CATEGORY\]/g, frontMatter.category);
  html = html.replace(/\[FULL TITLE\]/g, frontMatter.title);
  html = html.replace(/\[X\] min read/g, `${frontMatter.readTimeMinutes} min read`);

  // Insert hero image after article-header section
  const heroImageHtml = `
    <!-- Hero Image -->
    <figure class="article-hero-image">
      <img src="${frontMatter.hero.src}" alt="${frontMatter.hero.alt}" loading="eager" style="width: 100%; height: auto; display: block;">
    </figure>
`;

  html = html.replace(
    /(<\/section>\s*)(<!-- Article Content -->)/,
    `$1\n${heroImageHtml}\n    $2`
  );

  // Replace article content placeholder
  const articleBodyRegex = /<article class="content-body">[\s\S]*?<div class="container container--narrow">([\s\S]*?)<\/div>\s*<\/article>/;

  html = html.replace(articleBodyRegex, `<article class="content-body">
      <div class="container container--narrow">

${bodyContent}

      </div>
    </article>`);

  return html;
}

// Validate front matter has required fields
function validateFrontMatter(frontMatter, filename) {
  const required = ['slug', 'title', 'shortTitle', 'description', 'category', 'tagType', 'publishDate', 'readTimeMinutes'];
  const missing = required.filter(field => !frontMatter[field]);

  if (missing.length > 0) {
    console.error(`ERROR: ${filename} missing required fields: ${missing.join(', ')}`);
    return false;
  }

  if (!frontMatter.hero || !frontMatter.hero.src || !frontMatter.hero.alt) {
    console.error(`ERROR: ${filename} missing hero image (hero.src and hero.alt required)`);
    return false;
  }

  const validTagTypes = loadValidTagTypes();
  if (!validTagTypes.includes(frontMatter.tagType)) {
    console.error(`ERROR: ${filename} has invalid tagType "${frontMatter.tagType}".`);
    console.error(`       Valid tagTypes (from resources.manifest.json): ${validTagTypes.join(', ')}`);
    console.error(`       To add a new tagType, update categoryTags in resources/resources.manifest.json`);
    return false;
  }

  return true;
}

// Main execution
function main() {
  console.log('Fox Fuel Resource Generator');
  console.log('===========================\n');

  // Read template
  const template = readTemplate();

  // Get list of markdown files
  let mdFiles = [];
  try {
    mdFiles = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md'));
  } catch (e) {
    console.log('No drafts directory found or empty.');
    return;
  }

  console.log(`Found ${mdFiles.length} Markdown files in drafts/\n`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const mdFile of mdFiles) {
    const mdPath = path.join(DRAFTS_DIR, mdFile);
    const content = fs.readFileSync(mdPath, 'utf-8');

    const { frontMatter, body } = parseFrontMatter(content);

    if (!frontMatter) {
      console.log(`⚠ Skipping ${mdFile}: No YAML front matter found`);
      skipped++;
      continue;
    }

    if (!validateFrontMatter(frontMatter, mdFile)) {
      errors++;
      continue;
    }

    // Generate HTML
    const htmlContent = generateResourcePage(frontMatter, body, template);

    // Write output file
    const outputPath = path.join(RESOURCES_DIR, `${frontMatter.slug}.html`);
    fs.writeFileSync(outputPath, htmlContent, 'utf-8');

    console.log(`✓ Generated: ${frontMatter.slug}.html (publishes ${frontMatter.publishDate})`);
    generated++;
  }

  console.log(`\nSummary: ${generated} generated, ${skipped} skipped, ${errors} errors`);
}

main();
