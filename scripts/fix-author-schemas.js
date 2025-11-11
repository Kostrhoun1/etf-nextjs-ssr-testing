#!/usr/bin/env node

/**
 * Script to fix remaining Organization author schemas
 * Converts them to Person schema for E-E-A-T
 */

const fs = require('fs');
const path = require('path');

const categoryPagesDir = path.join(__dirname, '../src/app/nejlepsi-etf');

// Find all page.tsx files
const findPageFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pagePath = path.join(dir, entry.name, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        pages.push(pagePath);
      }
    }
  }

  return pages;
};

// Update author in Article schema - handle both short and extended Organization patterns
const updateArticleSchema = (content) => {
  // Pattern 1: Extended Organization with logo (more common)
  const extendedPattern = /"author":\s*\{\s*"@type":\s*"Organization",\s*\n\s*"name":\s*"ETF průvodce\.cz",\s*\n\s*"url":\s*"https:\/\/etfpruvodce\.cz",\s*\n\s*"logo":\s*\{\s*\n\s*"@type":\s*"ImageObject",\s*\n\s*"url":\s*"https:\/\/etfpruvodce\.cz\/logo\.png"\s*\n\s*\}\s*\n\s*\}/;

  // Pattern 2: Short Organization without logo
  const shortPattern = /"author":\s*\{\s*"@type":\s*"Organization",\s*"name":\s*"ETF průvodce\.cz",\s*"url":\s*"https:\/\/etfpruvodce\.cz"\s*\}/;

  const personAuthor = `"author": {
      "@type": "Person",
      "name": "Tomáš Kostrhoun",
      "url": "https://etfpruvodce.cz/o-nas#tomas-kostrhoun"
    }`;

  let updated = false;

  if (extendedPattern.test(content)) {
    content = content.replace(extendedPattern, personAuthor);
    console.log('  ✓ Updated extended Organization author to Person');
    updated = true;
  } else if (shortPattern.test(content)) {
    content = content.replace(shortPattern, personAuthor);
    console.log('  ✓ Updated short Organization author to Person');
    updated = true;
  }

  return { content, updated };
};

// Main execution
const main = () => {
  console.log('🔧 Fixing author schemas in category pages...\n');

  const pages = findPageFiles(categoryPagesDir);
  console.log(`Found ${pages.length} category pages\n`);

  let updated = 0;
  let skipped = 0;

  for (const pagePath of pages) {
    const fileName = path.basename(path.dirname(pagePath));
    console.log(`Processing: ${fileName}`);

    let content = fs.readFileSync(pagePath, 'utf8');
    const originalContent = content;

    // Check if already has Person author
    if (content.includes('"@type": "Person"') && content.includes('Tomáš Kostrhoun')) {
      console.log('  ⏭ Skipping (already has Person author)\n');
      skipped++;
      continue;
    }

    // Apply updates
    const result = updateArticleSchema(content);
    content = result.content;

    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(pagePath, content, 'utf8');
      console.log('  ✅ Updated successfully\n');
      updated++;
    } else {
      console.log('  ⚠ No Organization author found - might be manual variant\n');
      skipped++;
    }
  }

  console.log('═'.repeat(50));
  console.log(`\n✨ Done!`);
  console.log(`   Updated: ${updated} pages`);
  console.log(`   Skipped: ${skipped} pages`);
  console.log(`   Total:   ${pages.length} pages\n`);
};

// Run the script
main();
