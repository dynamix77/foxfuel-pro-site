#!/usr/bin/env node
/**
 * Resource Index Regenerator for Fox Fuel Pro Site
 *
 * This script:
 * 1. Reads all Markdown drafts with YAML front matter
 * 2. Combines with existing published resources from manifest
 * 3. Filters resources by publishDate <= today (America/New_York timezone)
 * 4. Regenerates the Guides & White Papers section of /resources/index.html
 *
 * Usage: node scripts/regenerate-index.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const RESOURCES_DIR = path.join(ROOT_DIR, 'resources');
const DRAFTS_DIR = path.join(RESOURCES_DIR, 'drafts');
const INDEX_PATH = path.join(RESOURCES_DIR, 'index.html');
const MANIFEST_PATH = path.join(RESOURCES_DIR, 'resources.manifest.json');

// Get today's date in America/New_York timezone
function getTodayET() {
  const now = new Date();
  const options = { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-CA', options);
  return formatter.format(now);
}

// Parse YAML front matter from Markdown
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return null;
  }

  const yamlStr = match[1];
  const frontMatter = {};
  let currentKey = null;
  let currentObject = null;

  yamlStr.split('\n').forEach(line => {
    if (!line.trim()) return;

    const nestedMatch = line.match(/^  (\w+):\s*"?([^"]*)"?$/);
    if (nestedMatch && currentObject) {
      let value = nestedMatch[2].trim();
      if (value.endsWith('"')) value = value.slice(0, -1);
      currentObject[nestedMatch[1]] = value;
      return;
    }

    const topMatch = line.match(/^(\w+):\s*(.*)$/);
    if (topMatch) {
      const key = topMatch[1];
      let value = topMatch[2].trim();

      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

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
        if (/^\d+$/.test(value)) {
          value = parseInt(value, 10);
        }
        frontMatter[key] = value;
        currentKey = null;
        currentObject = null;
      }
    }
  });

  return frontMatter;
}

// Read all resources from drafts (with front matter) and manifest (for legacy published)
function getAllResources() {
  const resources = [];

  // Read manifest for existing published resources
  if (fs.existsSync(MANIFEST_PATH)) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    if (manifest.resources) {
      manifest.resources.forEach(r => {
        // Only include manifest entries that don't have a corresponding draft
        resources.push({
          slug: r.slug,
          title: r.title,
          shortTitle: r.shortTitle,
          description: r.description,
          category: r.category,
          tagType: r.tagType,
          publishDate: r.publishDate,
          source: 'manifest'
        });
      });
    }
  }

  // Read drafts with front matter
  if (fs.existsSync(DRAFTS_DIR)) {
    const mdFiles = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md'));

    for (const mdFile of mdFiles) {
      const content = fs.readFileSync(path.join(DRAFTS_DIR, mdFile), 'utf-8');
      const frontMatter = parseFrontMatter(content);

      if (frontMatter && frontMatter.slug && frontMatter.publishDate) {
        // Check if this slug already exists from manifest
        const existingIndex = resources.findIndex(r => r.slug === frontMatter.slug);
        if (existingIndex >= 0) {
          // Replace manifest entry with draft entry (draft is authoritative)
          resources[existingIndex] = {
            slug: frontMatter.slug,
            title: frontMatter.title,
            shortTitle: frontMatter.shortTitle,
            description: frontMatter.description,
            category: frontMatter.category,
            tagType: frontMatter.tagType,
            publishDate: frontMatter.publishDate,
            source: 'draft'
          };
        } else {
          resources.push({
            slug: frontMatter.slug,
            title: frontMatter.title,
            shortTitle: frontMatter.shortTitle,
            description: frontMatter.description,
            category: frontMatter.category,
            tagType: frontMatter.tagType,
            publishDate: frontMatter.publishDate,
            source: 'draft'
          });
        }
      }
    }
  }

  return resources;
}

// Read current index.html
function readIndex() {
  return fs.readFileSync(INDEX_PATH, 'utf-8');
}

// Filter published resources
function getPublishedResources(resources, today) {
  return resources.filter(r => r.publishDate <= today);
}

// Generate resource card HTML
function generateResourceCard(resource) {
  return `          <!-- Card: ${resource.shortTitle} -->
          <article class="resource-card">
            <span class="resource-card__tag resource-card__tag--${resource.tagType}">${resource.category}</span>
            <h3 class="resource-card__title">
              <a href="/resources/${resource.slug}.html">${resource.title}</a>
            </h3>
            <p class="resource-card__description">${resource.description}</p>
            <a href="/resources/${resource.slug}.html" class="resource-card__link">Read Guide &rarr;</a>
          </article>`;
}

// Generate the resource grid section
function generateResourceGrid(publishedResources) {
  // Sort by publishDate (newest first)
  const sorted = [...publishedResources].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  const cards = sorted.map(r => generateResourceCard(r)).join('\n\n');

  return `        <div class="resource-grid resource-grid--2col">
${cards}
        </div>`;
}

// Regenerate index.html with updated resource grid
function regenerateIndex(indexHtml, publishedResources) {
  const gridPattern = /<div class="resource-grid resource-grid--2col">[\s\S]*?<\/div>\s*\n\s*<div class="section__footer">/;

  const newGrid = generateResourceGrid(publishedResources);
  const newGridWithFooter = `${newGrid}

        <div class="section__footer">`;

  return indexHtml.replace(gridPattern, newGridWithFooter);
}

// Main execution
function main() {
  console.log('Fox Fuel Index Regenerator');
  console.log('==========================\n');

  const today = getTodayET();
  console.log(`Today (America/New_York): ${today}\n`);

  // Get all resources
  const allResources = getAllResources();
  const indexHtml = readIndex();

  // Filter to published resources
  const publishedResources = getPublishedResources(allResources, today);

  console.log(`Total resources found: ${allResources.length}`);
  console.log(`Published (publishDate <= ${today}): ${publishedResources.length}\n`);

  publishedResources.forEach(r => {
    console.log(`  ✓ ${r.shortTitle} (${r.publishDate}) [${r.source}]`);
  });

  const futureResources = allResources.filter(r => r.publishDate > today);
  if (futureResources.length > 0) {
    console.log('\nScheduled for future:');
    futureResources.forEach(r => {
      console.log(`  ○ ${r.shortTitle} (${r.publishDate}) [${r.source}]`);
    });
  }

  // Regenerate index
  const newIndexHtml = regenerateIndex(indexHtml, publishedResources);

  // Write updated index
  fs.writeFileSync(INDEX_PATH, newIndexHtml, 'utf-8');

  console.log('\n✓ Updated /resources/index.html');
  console.log('Done.');

  // Return info for CI/automation
  return {
    today,
    published: publishedResources.length,
    future: futureResources.length,
    newlyPublished: publishedResources.filter(r => r.publishDate === today).map(r => r.slug)
  };
}

// Export for use in other scripts
module.exports = { main, getTodayET, getAllResources };

// Run if called directly
if (require.main === module) {
  main();
}
