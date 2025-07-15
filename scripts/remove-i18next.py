#!/usr/bin/env python3

import os
import re
import glob

def remove_serverside_translations():
    """Remove all serverSideTranslations imports and usages from the codebase"""
    
    # Find all TypeScript and JavaScript files
    file_patterns = [
        'src/pages/**/*.tsx',
        'src/pages/**/*.ts',
        'src/pages/*.tsx',
        'src/pages/*.ts'
    ]
    
    files_to_process = []
    for pattern in file_patterns:
        files_to_process.extend(glob.glob(pattern, recursive=True))
    
    print(f"Processing {len(files_to_process)} files...")
    
    for file_path in files_to_process:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Remove import statement for serverSideTranslations
            import_patterns = [
                r"import\s*{\s*serverSideTranslations\s*}\s*from\s*['\"]next-i18next/serverSideTranslations['\"];\s*\n?",
                r"import\s*{\s*[^}]*,\s*serverSideTranslations\s*[^}]*}\s*from\s*['\"]next-i18next/serverSideTranslations['\"];\s*\n?",
                r"import\s*{\s*serverSideTranslations\s*,\s*[^}]*}\s*from\s*['\"]next-i18next/serverSideTranslations['\"];\s*\n?"
            ]
            
            for pattern in import_patterns:
                content = re.sub(pattern, '', content, flags=re.MULTILINE)
            
            # Remove serverSideTranslations function calls
            # Pattern to match: ...(await serverSideTranslations(locale || 'en', ['common'])),
            serverside_call_pattern = r"\s*\.\.\.\(await\s+serverSideTranslations\([^)]*\)\),?\s*\n?"
            content = re.sub(serverside_call_pattern, '', content, flags=re.MULTILINE)
            
            # Clean up any empty lines that might be left
            content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
            
            # Only write if content changed
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated: {file_path}")
        
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    print("Removing serverSideTranslations from codebase...")
    remove_serverside_translations()
    print("Done!") 