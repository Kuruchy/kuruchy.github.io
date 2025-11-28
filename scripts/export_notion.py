#!/usr/bin/env python3
"""
Notion Exporter - Exports Notion child pages to Markdown using the official Notion API
Exports each child page of a parent page as individual Markdown files to the articles directory
"""

import os
import re
import json
import hashlib
import requests
from pathlib import Path
from urllib.parse import urlparse, unquote
from notion_client import Client
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

# Configuration
OUTPUT_DIR = Path(__file__).parent.parent / "articles"
OUTPUT_DIR.mkdir(exist_ok=True)
IMAGES_DIR = Path(__file__).parent.parent / "images"
IMAGES_DIR.mkdir(exist_ok=True)
METADATA_FILE = Path(__file__).parent.parent / "data" / "articles_metadata.json"
METADATA_FILE.parent.mkdir(exist_ok=True)


def get_notion_client() -> Client:
    """Initialize and return Notion client"""
    notion_token = os.getenv("NOTION_TOKEN")
    if not notion_token:
        raise ValueError("NOTION_TOKEN environment variable is required")
    return Client(auth=notion_token)


def download_image(image_url: str, notion_token: str) -> Optional[str]:
    """Download an image from Notion and save it locally. Returns the local path relative to repo root."""
    try:
        # Generate a unique filename based on URL hash
        url_hash = hashlib.md5(image_url.encode()).hexdigest()[:12]
        
        # Try to get file extension from URL
        parsed_url = urlparse(image_url)
        path = unquote(parsed_url.path)
        ext = os.path.splitext(path)[1] or '.png'
        
        # Clean extension (remove query params if any)
        ext = ext.split('?')[0]
        if ext not in ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']:
            ext = '.png'
        
        filename = f"{url_hash}{ext}"
        local_path = IMAGES_DIR / filename
        
        # Skip if already downloaded
        if local_path.exists():
            return f"images/{filename}"
        
        # Download the image
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        # For Notion-hosted images, we need to use the internal API
        if 'notion.so' in image_url or 'notion-static.com' in image_url:
            # Notion images may require authentication via the API
            # Try with the token in Authorization header first
            if notion_token:
                headers['Authorization'] = f'Bearer {notion_token}'
            # Also try cookie-based auth as fallback
            if notion_token:
                headers['Cookie'] = f'token_v2={notion_token}'
        
        response = requests.get(image_url, headers=headers, timeout=30, stream=True, allow_redirects=True)
        response.raise_for_status()
        
        # Check if we got an image
        content_type = response.headers.get('content-type', '')
        if not content_type.startswith('image/'):
            # If not an image, might be a redirect or error page
            print(f"  ⚠️  Warning: URL did not return an image (content-type: {content_type})")
            return image_url
        
        # Save the image
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"  📷 Downloaded image: {filename}")
        return f"images/{filename}"
        
    except Exception as e:
        print(f"  ⚠️  Warning: Could not download image {image_url}: {e}")
        # Return original URL as fallback
        return image_url


def convert_rich_text_to_markdown(rich_text: List[Dict[str, Any]]) -> str:
    """Convert Notion rich text to Markdown"""
    result = ""
    for text_block in rich_text:
        text = text_block.get("plain_text", "")
        annotations = text_block.get("annotations", {})
        
        # Apply formatting
        if annotations.get("bold"):
            text = f"**{text}**"
        if annotations.get("italic"):
            text = f"*{text}*"
        if annotations.get("code"):
            text = f"`{text}`"
        if annotations.get("strikethrough"):
            text = f"~~{text}~~"
        if annotations.get("underline"):
            text = f"<u>{text}</u>"
        
        # Handle links
        if text_block.get("href"):
            text = f"[{text}]({text_block['href']})"
        
        result += text
    return result


def convert_block_to_markdown(block: Dict[str, Any], client: Client, indent: int = 0, notion_token: str = "") -> str:
    """Convert a Notion block to Markdown"""
    block_type = block.get("type")
    if not block_type:
        return ""
    
    prefix = "  " * indent
    content = ""
    
    try:
        block_data = block.get(block_type, {})
        rich_text = block_data.get("rich_text", [])
        text = convert_rich_text_to_markdown(rich_text)
        
        if block_type == "paragraph":
            content = f"{prefix}{text}\n\n" if text else f"{prefix}\n\n"
        
        elif block_type == "heading_1":
            content = f"{prefix}# {text}\n\n"
        
        elif block_type == "heading_2":
            content = f"{prefix}## {text}\n\n"
        
        elif block_type == "heading_3":
            content = f"{prefix}### {text}\n\n"
        
        elif block_type == "bulleted_list_item":
            content = f"{prefix}- {text}\n"
        
        elif block_type == "numbered_list_item":
            # Note: Numbering is simplified, actual numbering would need context
            content = f"{prefix}1. {text}\n"
        
        elif block_type == "to_do":
            checked = block_data.get("checked", False)
            checkbox = "[x]" if checked else "[ ]"
            content = f"{prefix}- {checkbox} {text}\n"
        
        elif block_type == "toggle":
            content = f"{prefix}<details>\n{prefix}<summary>{text}</summary>\n"
        
        elif block_type == "code":
            language = block_data.get("language", "")
            code_text = "".join([rt.get("plain_text", "") for rt in rich_text])
            content = f"{prefix}```{language}\n{code_text}\n{prefix}```\n\n"
        
        elif block_type == "quote":
            content = f"{prefix}> {text}\n\n"
        
        elif block_type == "callout":
            emoji = block_data.get("icon", {}).get("emoji", "💡")
            content = f"{prefix}> {emoji} {text}\n\n"
        
        elif block_type == "divider":
            content = f"{prefix}---\n\n"
        
        elif block_type == "image":
            image_url = ""
            if block_data.get("file"):
                image_url = block_data["file"].get("url", "")
            elif block_data.get("external"):
                image_url = block_data["external"].get("url", "")
            if image_url:
                caption = convert_rich_text_to_markdown(block_data.get("caption", []))
                # Download image and use local path
                if notion_token:
                    local_image_path = download_image(image_url, notion_token)
                    content = f"{prefix}![{caption}]({local_image_path})\n\n"
                else:
                    # Fallback to original URL if no token
                    content = f"{prefix}![{caption}]({image_url})\n\n"
        
        elif block_type == "bookmark":
            url = block_data.get("url", "")
            caption = convert_rich_text_to_markdown(block_data.get("caption", []))
            content = f"{prefix}[{caption or url}]({url})\n\n"
        
        else:
            # Fallback for unsupported block types
            if text:
                content = f"{prefix}{text}\n\n"
        
        # Handle children blocks (nested content)
        has_children = block.get("has_children", False)
        if has_children:
            block_id = block.get("id")
            if block_id:
                children = client.blocks.children.list(block_id=block_id)
                for child in children.get("results", []):
                    child_content = convert_block_to_markdown(child, client, indent + 1 if block_type in ["toggle", "callout"] else indent, notion_token)
                    content += child_content
                
                if block_type == "toggle":
                    content += f"{prefix}</details>\n\n"
        
    except Exception as e:
        print(f"⚠️  Warning: Error processing block {block_type}: {e}")
        content = ""
    
    return content


def get_page_title(page: Dict[str, Any]) -> str:
    """Extract title from a Notion page"""
    # Try to get title from properties (for database pages)
    properties = page.get("properties", {})
    for prop_name, prop_data in properties.items():
        if prop_data.get("type") == "title":
            title_rich_text = prop_data.get("title", [])
            title = convert_rich_text_to_markdown(title_rich_text).strip()
            if title:
                return title
    
    # Try to get title from page object (for regular pages)
    # The title might be in the first heading block or in page properties
    # For now, we'll use a fallback
    return "Untitled"


def extract_property_value(prop_data: Dict[str, Any]) -> Any:
    """Extract value from a Notion property"""
    prop_type = prop_data.get("type")
    
    if prop_type == "title":
        rich_text = prop_data.get("title", [])
        return convert_rich_text_to_markdown(rich_text).strip()
    elif prop_type == "rich_text":
        rich_text = prop_data.get("rich_text", [])
        return convert_rich_text_to_markdown(rich_text).strip()
    elif prop_type == "select":
        select = prop_data.get("select")
        return select.get("name") if select else None
    elif prop_type == "multi_select":
        multi_select = prop_data.get("multi_select", [])
        return [item.get("name") for item in multi_select]
    elif prop_type == "date":
        date_obj = prop_data.get("date")
        if date_obj:
            return date_obj.get("start")
        return None
    elif prop_type == "checkbox":
        return prop_data.get("checkbox", False)
    elif prop_type == "number":
        return prop_data.get("number")
    elif prop_type == "url":
        return prop_data.get("url")
    elif prop_type == "email":
        return prop_data.get("email")
    elif prop_type == "phone_number":
        return prop_data.get("phone_number")
    elif prop_type == "created_time":
        return prop_data.get("created_time")
    elif prop_type == "last_edited_time":
        return prop_data.get("last_edited_time")
    else:
        return None


def extract_page_metadata(page: Dict[str, Any]) -> Dict[str, Any]:
    """Extract metadata from a Notion database page - specifically Title, Category, Published, Excerpt"""
    metadata = {
        "id": page.get("id"),
        "created_time": page.get("created_time"),
        "last_edited_time": page.get("last_edited_time"),
    }
    
    # Extract all properties
    properties = page.get("properties", {})
    
    # Extract Title (from title property)
    for prop_name, prop_data in properties.items():
        if prop_data.get("type") == "title":
            title = extract_property_value(prop_data)
            if title:
                metadata["title"] = title
            break
    
    # Extract specific fields: Category, Published, Excerpt
    for prop_name, prop_data in properties.items():
        prop_type = prop_data.get("type")
        prop_lower = prop_name.lower()
        
        # Extract Category (can be select or multi_select)
        if "category" in prop_lower and prop_type in ["select", "multi_select"]:
            value = extract_property_value(prop_data)
            if value:
                metadata["category"] = value
        
        # Extract Published (date property)
        elif "published" in prop_lower and prop_type == "date":
            date_value = extract_property_value(prop_data)
            if date_value:
                metadata["published_date"] = date_value
                metadata["published"] = True  # Mark as published if date exists
            else:
                metadata["published"] = False
        
        # Extract Ready (checkbox property) - this controls whether to export
        elif "ready" in prop_lower and prop_type == "checkbox":
            checkbox_value = extract_property_value(prop_data)
            metadata["ready"] = checkbox_value
        
        # Extract Excerpt (rich_text or text)
        elif "excerpt" in prop_lower and prop_type in ["rich_text", "text"]:
            value = extract_property_value(prop_data)
            if value:
                metadata["excerpt"] = value
    
    # Fallback: if no title found, use get_page_title
    if "title" not in metadata or not metadata["title"]:
        metadata["title"] = get_page_title(page)
    
    return metadata


def export_page_to_markdown(page_id: str, client: Client, output_path: Path, notion_token: str = "", extract_metadata: bool = False) -> Tuple[Optional[str], Optional[Dict[str, Any]]]:
    """Export a Notion page to Markdown file. Returns (filename, metadata) if successful, (None, None) otherwise."""
    try:
        # Get page metadata
        page = client.pages.retrieve(page_id=page_id)
        page_title = get_page_title(page)
        
        print(f"📄 Exporting: {page_title}")
        
        # Extract metadata if requested
        metadata = None
        if extract_metadata:
            metadata = extract_page_metadata(page)
        
        # Get all blocks
        all_blocks = []
        cursor = None
        
        while True:
            if cursor:
                response = client.blocks.children.list(block_id=page_id, start_cursor=cursor)
            else:
                response = client.blocks.children.list(block_id=page_id)
            
            blocks = response.get("results", [])
            all_blocks.extend(blocks)
            
            if not response.get("has_more"):
                break
            cursor = response.get("next_cursor")
        
        # Convert blocks to markdown
        # Don't add the title as H1 if the first block is already a heading
        markdown_content = ""
        if all_blocks and all_blocks[0].get("type") not in ["heading_1", "heading_2", "heading_3"]:
            markdown_content = f"# {page_title}\n\n"
        
        for block in all_blocks:
            markdown_content += convert_block_to_markdown(block, client, notion_token=notion_token)
        
        # If we didn't add a title and there's no content, add it
        if not markdown_content.strip():
            markdown_content = f"# {page_title}\n\n"
        
        # Sanitize filename
        safe_filename = re.sub(r'[^\w\s-]', '', page_title).strip()
        safe_filename = re.sub(r'[-\s]+', '-', safe_filename).lower()
        if not safe_filename:
            safe_filename = f"page-{page_id[:8]}"
        
        output_file = output_path / f"{safe_filename}.md"
        
        # Write to file
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(markdown_content)
        
        print(f"✅ Exported to: {output_file}")
        
        # Add filename to metadata if available
        if metadata:
            metadata["filename"] = f"articles/{safe_filename}.md"
        
        return f"{safe_filename}.md", metadata
        
    except Exception as e:
        print(f"❌ Error exporting page {page_id}: {e}")
        import traceback
        traceback.print_exc()
        return None, None



def find_child_pages(parent_page_id: str, client: Client) -> List[str]:
    """Find all child pages of a parent page"""
    child_page_ids = []
    
    try:
        # Method 1: Look for child_page blocks in the parent page
        print("🔍 Searching for child_page blocks...")
        all_blocks = []
        cursor = None
        
        while True:
            if cursor:
                response = client.blocks.children.list(block_id=parent_page_id, start_cursor=cursor)
            else:
                response = client.blocks.children.list(block_id=parent_page_id)
            
            blocks = response.get("results", [])
            all_blocks.extend(blocks)
            
            if not response.get("has_more"):
                break
            cursor = response.get("next_cursor")
        
        # Look for child_page blocks
        for block in all_blocks:
            if block.get("type") == "child_page":
                child_page_id = block.get("id")
                if child_page_id:
                    child_page_ids.append(child_page_id)
                    # Get the page title for logging
                    try:
                        child_page = client.pages.retrieve(page_id=child_page_id)
                        child_title = get_page_title(child_page)
                        print(f"  ✓ Found child page: {child_title}")
                    except:
                        print(f"  ✓ Found child page: {child_page_id}")
        
        # Method 2: Search for all pages and check their parent
        # This is useful if child pages aren't linked as blocks
        if not child_page_ids:
            print("🔍 Searching all pages for children...")
            search_cursor = None
            all_pages = []
            
            while True:
                if search_cursor:
                    search_response = client.search(
                        filter={"property": "object", "value": "page"},
                        page_size=100,
                        start_cursor=search_cursor
                    )
                else:
                    search_response = client.search(
                        filter={"property": "object", "value": "page"},
                        page_size=100
                    )
                
                pages = search_response.get("results", [])
                all_pages.extend(pages)
                
                if not search_response.get("has_more"):
                    break
                search_cursor = search_response.get("next_cursor")
            
            # Check each page to see if it's a child of the parent
            for page in all_pages:
                parent = page.get("parent")
                if parent:
                    # Check if parent is a page and matches our parent_page_id
                    if parent.get("type") == "page_id" and parent.get("page_id") == parent_page_id:
                        child_page_id = page.get("id")
                        if child_page_id and child_page_id not in child_page_ids:
                            child_page_ids.append(child_page_id)
                            child_title = get_page_title(page)
                            print(f"  ✓ Found child page: {child_title}")
                    # Also check if parent is a database (in case pages are in a database)
                    elif parent.get("type") == "database_id":
                        # If the parent page is a database, we might need to query it
                        # For now, we'll skip this case
                        pass
        
    except Exception as e:
        print(f"⚠️  Warning: Error finding child pages: {e}")
        import traceback
        traceback.print_exc()
    
    return child_page_ids


def find_database_in_page(page_id: str, client: Client) -> Optional[str]:
    """Find a database block inside a page. Returns the database ID if found."""
    try:
        print(f"🔍 Searching for database in page: {page_id}")
        all_blocks = []
        cursor = None
        
        while True:
            if cursor:
                response = client.blocks.children.list(block_id=page_id, start_cursor=cursor)
            else:
                response = client.blocks.children.list(block_id=page_id)
            
            blocks = response.get("results", [])
            all_blocks.extend(blocks)
            
            if not response.get("has_more"):
                break
            cursor = response.get("next_cursor")
        
        # Look for child_database blocks
        for block in all_blocks:
            if block.get("type") == "child_database":
                database_id = block.get("id")
                database_title = block.get("child_database", {}).get("title", "Untitled")
                print(f"  ✓ Found database: {database_title} ({database_id})")
                return database_id
        
        print("  ⚠️  No database found in page")
        return None
        
    except Exception as e:
        print(f"⚠️  Error searching for database in page: {e}")
        return None


def query_database(database_id: str, client: Client) -> List[Dict[str, Any]]:
    """Query a Notion database and return all pages"""
    pages = []
    cursor = None
    
    print(f"🔍 Querying database: {database_id}")
    
    # Try to use the query method - make direct HTTP request to Notion API
    try:
        print(f"  🔍 Attempting to query database using direct API call...")
        notion_token = os.getenv("NOTION_TOKEN", "")
        if not notion_token:
            raise ValueError("NOTION_TOKEN not available for direct API call")
        
        cursor = None
        while True:
            try:
                # Make direct POST request to Notion API
                # Endpoint: POST https://api.notion.com/v1/databases/{database_id}/query
                url = f"https://api.notion.com/v1/databases/{database_id}/query"
                headers = {
                    "Authorization": f"Bearer {notion_token}",
                    "Notion-Version": "2022-06-28",  # Use a stable API version
                    "Content-Type": "application/json"
                }
                
                payload = {}
                if cursor:
                    payload["start_cursor"] = cursor
                
                response = requests.post(url, headers=headers, json=payload, timeout=30)
                response.raise_for_status()
                
                data = response.json()
                results = data.get("results", [])
                pages.extend(results)
                
                if not data.get("has_more"):
                    break
                cursor = data.get("next_cursor")
                
            except requests.exceptions.RequestException as e:
                print(f"  ⚠️  Error making API request: {e}")
                if hasattr(e, 'response') and e.response is not None:
                    try:
                        error_data = e.response.json()
                        print(f"  ⚠️  API Error: {error_data}")
                    except:
                        print(f"  ⚠️  HTTP Status: {e.response.status_code}")
                break
            except Exception as e:
                print(f"  ⚠️  Error calling database query: {e}")
                import traceback
                traceback.print_exc()
                break
        
        # If we successfully got pages using query, return them
        if pages:
            print(f"  ✓ Successfully queried database using direct API call")
            print(f"✓ Found {len(pages)} page(s) in database")
            return pages
            
    except Exception as e:
        print(f"  ⚠️  Error with direct API call: {e}")
    
    # Fallback: Use search API to find pages in the database
    print(f"💡 Using search API as fallback to find pages in database...")
    search_cursor = None
    total_searched = 0
    while True:
        try:
            if search_cursor:
                search_response = client.search(
                    filter={"property": "object", "value": "page"},
                    page_size=100,
                    start_cursor=search_cursor
                )
            else:
                search_response = client.search(
                    filter={"property": "object", "value": "page"},
                    page_size=100
                )
            
            search_results = search_response.get("results", [])
            total_searched += len(search_results)
            
            # Filter pages that belong to this database
            for page in search_results:
                parent = page.get("parent", {})
                parent_type = parent.get("type")
                if parent_type == "database_id":
                    parent_db_id = parent.get("database_id")
                    # Debug: print first few database IDs found
                    if total_searched <= 5:
                        print(f"  🔍 Checking page '{get_page_title(page)}' - parent DB: {parent_db_id[:8]}...")
                    if parent_db_id == database_id:
                        pages.append(page)
                        print(f"  ✓ Found page in database: {get_page_title(page)}")
            
            if not search_response.get("has_more"):
                break
            search_cursor = search_response.get("next_cursor")
        except Exception as e:
            print(f"⚠️  Error using search API: {e}")
            import traceback
            traceback.print_exc()
            break
    
    print(f"  🔍 Searched {total_searched} pages, found {len(pages)} in database")
    print(f"✓ Found {len(pages)} page(s) in database")
    return pages


def clear_existing_articles(output_dir: Path):
    """Remove all existing markdown files from the articles directory"""
    if not output_dir.exists():
        return
    
    md_files = list(output_dir.glob("*.md"))
    if md_files:
        print(f"🗑️  Removing {len(md_files)} existing article(s)...")
        for md_file in md_files:
            try:
                md_file.unlink()
                print(f"  ✓ Removed: {md_file.name}")
            except Exception as e:
                print(f"  ⚠️  Warning: Could not remove {md_file.name}: {e}")
    else:
        print("📁 No existing articles to remove")


def main():
    """Main function"""
    print("📚 Notion Blog Exporter starting...")
    
    # Get database ID or page ID(s) from environment variable
    database_id = os.getenv("DATABASE_ID", "").strip()
    page_ids_str = os.getenv("PAGE_ID", "").strip()
    
    # Initialize Notion client
    client = get_notion_client()
    notion_token = os.getenv("NOTION_TOKEN", "")
    
    page_ids_to_export = []
    is_database = False
    all_metadata = []
    
    # Check if we're using a database
    if database_id:
        is_database = True
        print(f"📊 Using Notion Database: {database_id}")
        
        # Clear existing articles first (to remove unpublished ones)
        clear_existing_articles(OUTPUT_DIR)
        
        pages = query_database(database_id, client)
        
        # Always filter by Ready checkbox property - only export if Ready checkbox is checked
        print(f"🔍 Filtering for ready articles only (Ready checkbox = true)...")
        for page in pages:
            metadata = extract_page_metadata(page)
            # Check Ready checkbox - this is what controls export
            is_ready = metadata.get("ready", False)
            published_date = metadata.get("published_date", None)
            
            # Only export if Ready checkbox is checked (true)
            if is_ready:
                page_ids_to_export.append(metadata.get("id"))
                all_metadata.append(metadata)
                print(f"  ✓ Including: {metadata.get('title', 'Untitled')} (ready={is_ready}, published_date={published_date})")
            else:
                print(f"  ⏭️  Skipping unready article: {metadata.get('title', 'Untitled')} (ready={is_ready})")
        
        print(f"✓ Found {len(page_ids_to_export)} ready article(s) to export")
    elif page_ids_str:
        # If PAGE_ID is provided but no DATABASE_ID, try to find database in the page
        parent_page_id = page_ids_str.split(",")[0].strip()
        print(f"🔍 DATABASE_ID not provided, searching for database in page: {parent_page_id}")
        found_database_id = find_database_in_page(parent_page_id, client)
        
        if found_database_id:
            is_database = True
            database_id = found_database_id
            print(f"📊 Found and using database: {database_id}")
            
            # Clear existing articles first (to remove unpublished ones)
            clear_existing_articles(OUTPUT_DIR)
            
            pages = query_database(database_id, client)
            
            # Always filter by Ready checkbox property - only export if Ready checkbox is checked
            print(f"🔍 Filtering for ready articles only (Ready checkbox = true)...")
            for page in pages:
                metadata = extract_page_metadata(page)
                # Check Ready checkbox - this is what controls export
                is_ready = metadata.get("ready", False)
                published_date = metadata.get("published_date", None)
                
                # Only export if Ready checkbox is checked (true)
                if is_ready:
                    page_ids_to_export.append(metadata.get("id"))
                    all_metadata.append(metadata)
                    print(f"  ✓ Including: {metadata.get('title', 'Untitled')} (ready={is_ready}, published_date={published_date})")
                else:
                    print(f"  ⏭️  Skipping unready article: {metadata.get('title', 'Untitled')} (ready={is_ready})")
            
            print(f"✓ Found {len(page_ids_to_export)} ready article(s) to export")
        else:
            # Fall back to old behavior (child pages)
            print("⚠️  No database found, falling back to child pages method")
            page_ids_list = [pid.strip() for pid in page_ids_str.split(",") if pid.strip()]
            
            if len(page_ids_list) > 1:
                # Multiple page IDs provided - export them directly
                print(f"📋 Found {len(page_ids_list)} page ID(s) to export directly")
                page_ids_to_export = page_ids_list
            else:
                # Single page ID - treat as parent and find children
                parent_page_id = page_ids_list[0]
                print(f"🔍 Finding child pages of parent page: {parent_page_id}")
                
                # Find all child pages
                page_ids_to_export = find_child_pages(parent_page_id, client)
                
                if not page_ids_to_export:
                    print("⚠️  No child pages found.")
                    print("💡 Tip: If you want to export specific pages, provide comma-separated page IDs in PAGE_ID")
                    return
    else:
        raise ValueError("Either DATABASE_ID or PAGE_ID environment variable is required")
    
    if not page_ids_to_export:
        print("❌ No pages found to export")
        return
    
    print(f"\n📋 Exporting {len(page_ids_to_export)} page(s)...")
    
    # Export each page
    exported_files = []
    
    # If we already have metadata (from database query), use it
    # Otherwise, extract it during export
    metadata_map = {meta.get("id"): meta for meta in all_metadata} if all_metadata else {}
    
    for page_id in page_ids_to_export:
        try:
            filename, export_metadata = export_page_to_markdown(
                page_id, 
                client, 
                OUTPUT_DIR, 
                notion_token, 
                extract_metadata=is_database and not metadata_map
            )
            if filename:
                exported_files.append(filename)
                # Use pre-extracted metadata if available, otherwise use export metadata
                if page_id in metadata_map:
                    metadata_map[page_id]["filename"] = filename
                elif export_metadata:
                    export_metadata["filename"] = filename
                    metadata_map[page_id] = export_metadata
        except Exception as e:
            print(f"❌ Failed to export page {page_id}: {e}")
            continue
    
    # Convert metadata map back to list
    all_metadata = list(metadata_map.values())
    
    # Save metadata to JSON file (only published articles)
    # Clear existing metadata file and write only published articles
    try:
        with open(METADATA_FILE, "w", encoding="utf-8") as f:
            if all_metadata:
                json.dump(all_metadata, f, indent=2, ensure_ascii=False)
                print(f"✅ Saved metadata for {len(all_metadata)} published article(s) to: {METADATA_FILE}")
            else:
                # Write empty array if no published articles
                json.dump([], f, indent=2)
                print(f"✅ Cleared metadata file (no published articles)")
    except Exception as e:
        print(f"⚠️  Warning: Could not save metadata: {e}")
    
    print(f"\n✅ Export complete! {len(exported_files)} file(s) saved to: {OUTPUT_DIR}")
    if exported_files:
        print(f"📝 Exported files:")
        for filename in exported_files:
            print(f"   - {filename}")


if __name__ == "__main__":
    main()

