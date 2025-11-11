#!/usr/bin/env node

/**
 * Script to add author bylines to all category pages
 * Adds E-E-A-T signals for SEO optimization
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

// Update author in Article schema
const updateArticleSchema = (content) => {
  // Replace Organization author with Person
  const organizationAuthorPattern = /"author":\s*\{\s*"@type":\s*"Organization",\s*"name":\s*"ETF průvodce\.cz",\s*"url":\s*"https:\/\/etfpruvodce\.cz"\s*\}/;

  if (organizationAuthorPattern.test(content)) {
    content = content.replace(
      organizationAuthorPattern,
      `"author": {
      "@type": "Person",
      "name": "Tomáš Kostrhoun",
      "url": "https://etfpruvodce.cz/o-nas#tomas-kostrhoun"
    }`
    );
    console.log('  ✓ Updated Article schema author');
  }

  // Fix dateModified to use current date
  const dateModifiedPattern = /"dateModified":\s*new Date\(new Date\(\)\.getMonth\(\),\s*1\)\.toISOString\(\)/;
  if (dateModifiedPattern.test(content)) {
    content = content.replace(
      dateModifiedPattern,
      `"dateModified": new Date().toISOString()`
    );
    console.log('  ✓ Fixed dateModified');
  }

  return content;
};

// Add author byline after H1
const addAuthorByline = (content) => {
  // Pattern: Find H1 closing tag followed by whitespace and paragraph
  const h1Pattern = /(<h1[^>]*>[\s\S]*?<\/h1>)\s+(<p className="text-xl)/;

  const authorByline = `
              {/* Author byline - E-E-A-T signal */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Autor: </span>
                <a
                  href="/o-nas"
                  className="text-violet-600 hover:text-violet-700 font-medium hover:underline"
                >
                  Tomáš Kostrhoun
                </a>
                <span className="text-gray-400">•</span>
                <span>
                  Aktualizováno: {new Date().toLocaleDateString('cs-CZ', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              `;

  if (h1Pattern.test(content)) {
    content = content.replace(h1Pattern, `$1\n${authorByline}$2`);
    console.log('  ✓ Added author byline after H1');
  } else {
    console.log('  ⚠ Could not find H1 pattern - manual check needed');
  }

  return content;
};

// Main execution
const main = () => {
  console.log('🚀 Adding author bylines to category pages...\n');

  const pages = findPageFiles(categoryPagesDir);
  console.log(`Found ${pages.length} category pages\n`);

  let updated = 0;
  let skipped = 0;

  for (const pagePath of pages) {
    const fileName = path.basename(path.dirname(pagePath));
    console.log(`Processing: ${fileName}`);

    // Skip S&P 500 page (already done manually)
    if (fileName === 'nejlepsi-sp500-etf') {
      console.log('  ⏭ Skipping (already updated manually)\n');
      skipped++;
      continue;
    }

    let content = fs.readFileSync(pagePath, 'utf8');
    const originalContent = content;

    // Check if already has author byline
    if (content.includes('Author byline - E-E-A-T signal') || content.includes('Autor: Tomáš Kostrhoun')) {
      console.log('  ⏭ Skipping (already has author byline)\n');
      skipped++;
      continue;
    }

    // Apply updates
    content = updateArticleSchema(content);
    content = addAuthorByline(content);

    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(pagePath, content, 'utf8');
      console.log('  ✅ Updated successfully\n');
      updated++;
    } else {
      console.log('  ⚠ No changes made\n');
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
