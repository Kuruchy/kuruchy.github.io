#!/usr/bin/env python3
"""
Generate Article Metadata - Automatically generates article metadata for JavaScript files
Scans the articles directory and updates article.js and script.js with article information
"""

import re
from pathlib import Path
from typing import Dict, List, Optional

# Configuration
ARTICLES_DIR = Path(__file__).parent.parent / "articles"
ARTICLE_JS = Path(__file__).parent.parent / "article.js"
SCRIPT_JS = Path(__file__).parent.parent / "script.js"

# Icon mapping based on keywords in title/filename
ICON_MAPPING = {
    'ai': 'fas fa-brain',
    'artificial': 'fas fa-brain',
    'intelligence': 'fas fa-brain',
    'machine learning': 'fas fa-brain',
    'poker': 'fas fa-dice',
    'game': 'fas fa-gamepad',
    'android': 'fas fa-mobile-alt',
    'ios': 'fas fa-mobile-alt',
    'mobile': 'fas fa-mobile-alt',
    'compose': 'fas fa-mobile-alt',
    'kotlin': 'fas fa-code',
    'programming': 'fas fa-code',
    'code': 'fas fa-code',
    'development': 'fas fa-code',
    'dev': 'fas fa-code',
    'trading': 'fas fa-chart-line',
    'investment': 'fas fa-chart-line',
    'finance': 'fas fa-chart-line',
    'climbing': 'fas fa-mountain',
    'bouldering': 'fas fa-mountain',
    'sport': 'fas fa-running',
    'default': 'fas fa-file-alt'
}


def extract_title_and_description(markdown_content: str) -> tuple[str, str]:
    """Extract title and description from markdown content"""
    lines = markdown_content.split('\n')
    title = ""
    description = ""
    
    # Find the first H1 heading
    for line in lines:
        line = line.strip()
        if line.startswith('# '):
            title = line[2:].strip()
            break
        elif line.startswith('#'):
            # Handle cases where there might be multiple #
            match = re.match(r'^#+\s+(.+)$', line)
            if match:
                title = match.group(1).strip()
                break
    
    # If no H1 found, use filename or first line
    if not title:
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#'):
                title = line[:100]  # Use first non-empty line as title
                break
    
    # Extract description (first meaningful paragraph, can be after headings)
    description_lines = []
    found_title = False
    skip_next_empty = False
    found_paragraph = False
    
    for line in lines:
        line = line.strip()
        
        # Skip the title line
        if line.startswith('#') and (title in line or line.startswith('# ')):
            found_title = True
            skip_next_empty = True
            continue
        
        # Skip empty lines right after title
        if skip_next_empty and not line:
            continue
        skip_next_empty = False
        
        # Once we've found the title, look for the first good paragraph
        if found_title and line:
            # Skip headings (but continue looking)
            if line.startswith('#'):
                continue
            
            # Skip code blocks, images, and other non-text content
            if line.startswith('```') or line.startswith('![') or line.startswith('>'):
                continue
            
            # Skip very short lines that are likely formatting or list items
            if len(line) < 15:
                # But include if it looks like a sentence
                if not (line.endswith('.') or line.endswith('!') or line.endswith('?')):
                    continue
            
            # Skip list markers at start
            if re.match(r'^[-*+]\s+', line):
                line = re.sub(r'^[-*+]\s+', '', line)
            
            # Skip numbered list markers
            if re.match(r'^\d+\.\s+', line):
                line = re.sub(r'^\d+\.\s+', '', line)
            
            # This looks like a good paragraph line
            if len(line) >= 20:  # Minimum length for a meaningful sentence
                description_lines.append(line)
                found_paragraph = True
                
                # Stop if we have enough content (around 150-200 chars)
                current_desc = ' '.join(description_lines)
                if len(current_desc) > 150:
                    # Try to end at sentence boundary
                    sentences = re.split(r'[.!?]\s+', current_desc)
                    if len(sentences) > 1:
                        description_lines = [sentences[0] + '.']
                        if len(sentences) > 1 and len(description_lines[0]) < 100:
                            description_lines.append(sentences[1] + '.')
                    break
            elif found_paragraph:
                # We already found a paragraph, stop at next empty line or heading
                break
    
    description = ' '.join(description_lines).strip()
    
    # Clean up description (remove markdown formatting, limit length)
    description = re.sub(r'\*\*(.+?)\*\*', r'\1', description)  # Remove bold
    description = re.sub(r'\*(.+?)\*', r'\1', description)  # Remove italic
    description = re.sub(r'`(.+?)`', r'\1', description)  # Remove code
    description = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', description)  # Remove links, keep text
    
    # Fix double periods
    description = re.sub(r'\.\.+', '...', description)
    
    # Limit description length
    if len(description) > 200:
        # Try to cut at sentence boundary
        sentences = re.split(r'[.!?]\s+', description)
        description = sentences[0]
        if len(sentences) > 1 and len(description) < 50:
            description += '. ' + sentences[1]
        description = description[:200].strip()
        if not description.endswith(('.', '!', '?')):
            description += '...'
    
    # Fallback if no description found
    if not description:
        description = f"Artículo sobre {title.lower()}"
    
    return title, description


def get_icon_for_article(title: str, filename: str) -> str:
    """Determine the appropriate icon for an article based on title and filename"""
    text_to_check = (title + ' ' + filename).lower()
    
    # Check for keywords in order of specificity
    for keyword, icon in ICON_MAPPING.items():
        if keyword != 'default' and keyword in text_to_check:
            return icon
    
    return ICON_MAPPING['default']


def scan_articles() -> List[Dict[str, str]]:
    """Scan articles directory and extract metadata"""
    articles = []
    
    if not ARTICLES_DIR.exists():
        print(f"⚠️  Articles directory not found: {ARTICLES_DIR}")
        return articles
    
    # Get all markdown files
    md_files = sorted(ARTICLES_DIR.glob("*.md"), key=lambda p: p.stat().st_mtime, reverse=True)
    
    for md_file in md_files:
        try:
            # Read markdown content
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract title and description
            title, description = extract_title_and_description(content)
            
            # Get relative filename
            filename = f"articles/{md_file.name}"
            
            # Determine icon
            icon = get_icon_for_article(title, md_file.name)
            
            articles.append({
                'filename': filename,
                'title': title,
                'description': description,
                'icon': icon
            })
            
            print(f"✓ Processed: {md_file.name} -> {title}")
            
        except Exception as e:
            print(f"⚠️  Error processing {md_file.name}: {e}")
            continue
    
    return articles


def escape_js_string(text: str) -> str:
    """Escape string for JavaScript single-quoted string"""
    # Escape backslashes first
    text = text.replace('\\', '\\\\')
    # Escape single quotes
    text = text.replace("'", "\\'")
    # Escape newlines
    text = text.replace('\n', '\\n')
    # Escape carriage returns
    text = text.replace('\r', '\\r')
    return text


def generate_js_array(articles: List[Dict[str, str]]) -> str:
    """Generate JavaScript array string from articles list"""
    if not articles:
        return "[]"
    
    lines = ["["]
    for i, article in enumerate(articles):
        comma = "," if i < len(articles) - 1 else ""
        lines.append(f"    {{ ")
        lines.append(f"        filename: '{escape_js_string(article['filename'])}', ")
        lines.append(f"        title: '{escape_js_string(article['title'])}', ")
        lines.append(f"        description: '{escape_js_string(article['description'])}', ")
        lines.append(f"        icon: '{escape_js_string(article['icon'])}'")
        lines.append(f"    }}{comma}")
    lines.append("]")
    
    return "\n".join(lines)


def update_js_file(file_path: Path, articles: List[Dict[str, str]], array_name: str = "articles") -> bool:
    """Update JavaScript file with new articles array"""
    try:
        # Read current file
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Generate new array (split into lines)
        new_array_lines = generate_js_array(articles).split('\n')
        
        # Find the array declaration line and boundaries
        array_start_idx = -1
        array_end_idx = -1
        bracket_count = 0
        in_array = False
        
        for i, line in enumerate(lines):
            # Check if this line starts the array declaration
            if f'const {array_name}' in line and '=' in line:
                array_start_idx = i
                bracket_count = line.count('[') - line.count(']')
                in_array = bracket_count > 0
                continue
            
            # If we're in the array, count brackets
            if in_array:
                bracket_count += line.count('[') - line.count(']')
                if bracket_count <= 0:
                    array_end_idx = i
                    in_array = False
                    break
        
        if array_start_idx == -1:
            print(f"⚠️  Could not find '{array_name}' array declaration in {file_path.name}")
            return False
        
        if array_end_idx == -1:
            print(f"⚠️  Could not find end of '{array_name}' array in {file_path.name}")
            return False
        
        # Build new content
        new_lines = []
        
        # Add lines before the array
        new_lines.extend(lines[:array_start_idx])
        
        # Add the new array
        # Check if the declaration line has anything after the '='
        declaration_line = lines[array_start_idx].rstrip()
        if '[' in declaration_line:
            # Array starts on the same line
            # Replace everything after '=' with the new array
            before_equals = declaration_line.split('=')[0] + '= '
            new_lines.append(before_equals + new_array_lines[0] + '\n')
            new_lines.extend([line + '\n' for line in new_array_lines[1:]])
        else:
            # Array starts on next line
            new_lines.append(declaration_line.rstrip() + '\n')
            new_lines.extend([line + '\n' for line in new_array_lines])
        
        # Add lines after the array
        new_lines.extend(lines[array_end_idx + 1:])
        
        # Write updated content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating {file_path}: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Main function"""
    print("📝 Generating article metadata...")
    
    # Scan articles
    articles = scan_articles()
    
    if not articles:
        print("⚠️  No articles found to process")
        return
    
    print(f"\n📋 Found {len(articles)} article(s)")
    
    # Update article.js
    print(f"\n📄 Updating {ARTICLE_JS.name}...")
    if update_js_file(ARTICLE_JS, articles):
        print(f"✅ Updated {ARTICLE_JS.name}")
    else:
        print(f"❌ Failed to update {ARTICLE_JS.name}")
        return
    
    # Update script.js
    print(f"\n📄 Updating {SCRIPT_JS.name}...")
    if update_js_file(SCRIPT_JS, articles):
        print(f"✅ Updated {SCRIPT_JS.name}")
    else:
        print(f"❌ Failed to update {SCRIPT_JS.name}")
        return
    
    print(f"\n✅ Successfully updated article metadata in both JavaScript files!")
    print(f"📊 Articles processed: {len(articles)}")


if __name__ == "__main__":
    main()

