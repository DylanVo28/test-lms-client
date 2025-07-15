#!/usr/bin/env python3

import os
import re
import sys

def process_file(file_path):
    """Process a single file to remove i18next imports and replace t() calls"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        original_content = content
        
        # Remove import statements for useTranslation
        content = re.sub(r'import\s*{[^}]*useTranslation[^}]*}\s*from\s*[\'"]next-i18next[\'"];\s*\n?', '', content)
        
        # Remove const { t } = useTranslation('common'); lines
        content = re.sub(r'const\s*{\s*t\s*}\s*=\s*useTranslation\([\'"][^\'\"]*[\'\"]\);\s*\n?', '', content)
        
        # Replace t('...') with just the string content
        # Helper function to count balanced parentheses
        def replace_t_calls(match):
            string_content = match.group(1)
            return f"'{string_content}'"
        
        # Handle complex t() calls with parameters using a more sophisticated approach
        # Pattern for t( 'string', { params } ) with any amount of whitespace and line breaks
        def find_and_replace_t_calls(content):
            # Find all t( patterns
            result = []
            i = 0
            while i < len(content):
                if content[i:i+2] == 't(':
                    # Found a t( - now need to find the matching closing parenthesis
                    paren_count = 1
                    j = i + 2
                    string_content = None
                    in_string = False
                    string_char = None
                    escape_next = False
                    
                    # Find the first string in the t() call
                    while j < len(content) and paren_count > 0:
                        char = content[j]
                        
                        if escape_next:
                            escape_next = False
                        elif char == '\\':
                            escape_next = True
                        elif not in_string and char in ['"', "'"]:
                            # Start of string
                            in_string = True
                            string_char = char
                            string_start = j + 1
                        elif in_string and char == string_char:
                            # End of string
                            in_string = False
                            if string_content is None:  # First string found
                                string_content = content[string_start:j]
                        elif not in_string:
                            if char == '(':
                                paren_count += 1
                            elif char == ')':
                                paren_count -= 1
                        
                        j += 1
                    
                    if string_content is not None:
                        # Replace the entire t(...) with just the string content
                        result.append(f"'{string_content}'")
                        i = j
                    else:
                        result.append(content[i])
                        i += 1
                else:
                    result.append(content[i])
                    i += 1
            
            return ''.join(result)
        
        content = find_and_replace_t_calls(content)
        
        # Clean up any extra empty lines that might have been created
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"✅ Processed: {file_path}")
            return True
        else:
            print(f"⚪ No changes: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Error processing {file_path}: {str(e)}")
        return False

def find_typescript_files(directory):
    """Find all TypeScript/JavaScript files in the directory"""
    typescript_files = []
    
    for root, dirs, files in os.walk(directory):
        # Skip node_modules and .git directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist', 'build']]
        
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                typescript_files.append(os.path.join(root, file))
    
    return typescript_files

def main():
    # Get the project root directory
    if len(sys.argv) > 1:
        project_root = sys.argv[1]
    else:
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    print(f"🔍 Searching for TypeScript/JavaScript files in: {project_root}")
    
    # Find all TypeScript/JavaScript files
    files = find_typescript_files(project_root)
    
    if not files:
        print("❌ No TypeScript/JavaScript files found!")
        return
    
    print(f"📁 Found {len(files)} TypeScript/JavaScript files")
    
    # Process each file
    processed_count = 0
    for file_path in files:
        if process_file(file_path):
            processed_count += 1
    
    print(f"\n🎉 Done! Processed {processed_count} files out of {len(files)} total files.")
    print("✨ All useTranslation imports have been removed and t() calls have been replaced with their string content.")

if __name__ == "__main__":
    main() 