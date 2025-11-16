#!/usr/bin/env python3
"""
Safe URL replacement script - replaces etfpruvodce.cz with www.etfpruvodce.cz
Only in strings, not in variable names or other code.
"""
import os
import re
from pathlib import Path

def fix_urls_in_file(filepath):
    """Fix URLs in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Replace URLs in strings (single and double quotes)
        # Pattern: "https://etfpruvodce.cz or 'https://etfpruvodce.cz
        content = re.sub(
            r'(["\'])https://etfpruvodce\.cz',
            r'\1https://www.etfpruvodce.cz',
            content
        )

        # Replace in template literals
        content = re.sub(
            r'`https://etfpruvodce\.cz',
            r'`https://www.etfpruvodce.cz',
            content
        )

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function"""
    root_dir = Path(__file__).parent
    src_dir = root_dir / 'src'

    fixed_count = 0
    checked_count = 0

    # Process all .ts and .tsx files in src directory
    for ext in ['**/*.ts', '**/*.tsx']:
        for filepath in src_dir.glob(ext):
            checked_count += 1
            if fix_urls_in_file(filepath):
                fixed_count += 1
                print(f"Fixed: {filepath.relative_to(root_dir)}")

    print(f"\nChecked {checked_count} files, fixed {fixed_count} files")

if __name__ == '__main__':
    main()
