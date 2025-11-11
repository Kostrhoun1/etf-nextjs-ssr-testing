#!/usr/bin/env node

/**
 * Script to add dynamic dateModified to all category pages
 * Fetches lastModified from database based on ETF data updates
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

// Step 1: Add import for getLastModifiedDate
const addImport = (content) => {
  // Check if already imported
  if (content.includes('getLastModifiedDate')) {
    console.log('  ⏭ Import already exists');
    return { content, updated: false };
  }

  // Find import section and add after last import
  const importPattern = /(import.*from.*['"];?\n)(?!import)/;

  if (importPattern.test(content)) {
    content = content.replace(
      importPattern,
      `$1import { getLastModifiedDate } from '@/utils/getLastModifiedDate';\n`
    );
    console.log('  ✓ Added import');
    return { content, updated: true };
  }

  console.log('  ⚠ Could not find import section');
  return { content, updated: false };
};

// Step 2: Make Page component async
const makePageAsync = (content) => {
  // Find: export default function PageName()
  const syncPattern = /export default function (\w+)\(\)/;

  if (content.includes('export default async function')) {
    console.log('  ⏭ Already async function');
    return { content, updated: false };
  }

  if (syncPattern.test(content)) {
    content = content.replace(
      syncPattern,
      'export default async function $1()'
    );
    console.log('  ✓ Made function async');
    return { content, updated: true };
  }

  console.log('  ⚠ Could not find function declaration');
  return { content, updated: false };
};

// Step 3: Add lastModified fetch at start of function
const addLastModifiedFetch = (content) => {
  // Check if already has lastModified fetch
  if (content.includes('await getLastModifiedDate')) {
    console.log('  ⏭ Already fetching lastModified');
    return { content, updated: false };
  }

  // Find function body start (after function declaration and opening brace)
  // Look for: export default async function Name() {
  //           const currentYear = ...
  const functionStartPattern = /(export default async function \w+\(\) \{\s*\n)/;

  if (functionStartPattern.test(content)) {
    const fetchCode = `  // Get last modified date from database (all ETF updates)
  const lastModified = await getLastModifiedDate();

`;

    content = content.replace(functionStartPattern, `$1${fetchCode}`);
    console.log('  ✓ Added lastModified fetch');
    return { content, updated: true };
  }

  console.log('  ⚠ Could not find function start');
  return { content, updated: false };
};

// Step 4: Replace static dateModified with dynamic
const updateDateModified = (content) => {
  // Pattern 1: "dateModified": new Date().toISOString()
  const pattern1 = /"dateModified":\s*new Date\(\)\.toISOString\(\)/g;

  // Pattern 2: 'dateModified': new Date().toISOString()
  const pattern2 = /'dateModified':\s*new Date\(\)\.toISOString\(\)/g;

  // Pattern 3: dateModified: new Date().toISOString()
  const pattern3 = /dateModified:\s*new Date\(\)\.toISOString\(\)/g;

  let updated = false;

  if (pattern1.test(content)) {
    content = content.replace(pattern1, '"dateModified": lastModified');
    updated = true;
  }
  if (pattern2.test(content)) {
    content = content.replace(pattern2, "'dateModified': lastModified");
    updated = true;
  }
  if (pattern3.test(content)) {
    content = content.replace(pattern3, 'dateModified: lastModified');
    updated = true;
  }

  if (updated) {
    console.log('  ✓ Updated dateModified in schema');
  } else {
    console.log('  ⏭ dateModified already using lastModified or not found');
  }

  return { content, updated };
};

// Step 5: Update visible timestamp
const updateVisibleTimestamp = (content) => {
  // Pattern: Aktualizováno: {new Date().toLocaleDateString
  const timestampPattern = /(Aktualizováno:\s*\{)new Date\(\)(\.toLocaleDateString)/g;

  if (timestampPattern.test(content)) {
    content = content.replace(timestampPattern, '$1new Date(lastModified)$2');
    console.log('  ✓ Updated visible timestamp');
    return { content, updated: true };
  }

  console.log('  ⏭ Visible timestamp already using lastModified or not found');
  return { content, updated: false };
};

// Main execution
const main = () => {
  console.log('🕐 Adding dynamic dateModified to category pages...\n');

  const pages = findPageFiles(categoryPagesDir);
  console.log(`Found ${pages.length} category pages\n`);

  let updated = 0;
  let skipped = 0;
  let partialUpdates = 0;

  for (const pagePath of pages) {
    const fileName = path.basename(path.dirname(pagePath));
    console.log(`Processing: ${fileName}`);

    let content = fs.readFileSync(pagePath, 'utf8');
    const originalContent = content;
    let anyUpdate = false;

    // Apply all transformations
    let result;

    result = addImport(content);
    content = result.content;
    anyUpdate = anyUpdate || result.updated;

    result = makePageAsync(content);
    content = result.content;
    anyUpdate = anyUpdate || result.updated;

    result = addLastModifiedFetch(content);
    content = result.content;
    anyUpdate = anyUpdate || result.updated;

    result = updateDateModified(content);
    content = result.content;
    anyUpdate = anyUpdate || result.updated;

    result = updateVisibleTimestamp(content);
    content = result.content;
    anyUpdate = anyUpdate || result.updated;

    // Write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(pagePath, content, 'utf8');

      if (anyUpdate) {
        console.log('  ✅ Updated successfully\n');
        updated++;
      } else {
        console.log('  ⚠ Partial update (check manually)\n');
        partialUpdates++;
      }
    } else {
      console.log('  ⏭ No changes needed\n');
      skipped++;
    }
  }

  console.log('═'.repeat(50));
  console.log(`\n✨ Done!`);
  console.log(`   Updated:        ${updated} pages`);
  console.log(`   Partial:        ${partialUpdates} pages`);
  console.log(`   Skipped:        ${skipped} pages`);
  console.log(`   Total:          ${pages.length} pages\n`);

  if (partialUpdates > 0) {
    console.log('⚠️  Some pages had partial updates - manual review recommended\n');
  }
};

// Run the script
main();
