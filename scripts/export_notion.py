#!/usr/bin/env python3
"""
Notion Exporter - Exports Notion pages to Markdown using the official Notion API
"""

import os
import re
from pathlib import Path
from notion_client import Client
from typing import Dict, List, Any

# Configuration
OUTPUT_DIR = Path(__file__).parent.parent / "notion-backup"
OUTPUT_DIR.mkdir(exist_ok=True)


def get_notion_client() -> Client:
    """Initialize and return Notion client"""
    notion_token = os.getenv("NOTION_TOKEN")
    if not notion_token:
        raise ValueError("NOTION_TOKEN environment variable is required")
    return Client(auth=notion_token)


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


def convert_block_to_markdown(block: Dict[str, Any], client: Client, indent: int = 0) -> str:
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
                    child_content = convert_block_to_markdown(child, client, indent + 1 if block_type in ["toggle", "callout"] else indent)
                    content += child_content
                
                if block_type == "toggle":
                    content += f"{prefix}</details>\n\n"
        
    except Exception as e:
        print(f"⚠️  Warning: Error processing block {block_type}: {e}")
        content = ""
    
    return content


def export_page_to_markdown(page_id: str, client: Client, output_path: Path) -> None:
    """Export a Notion page to Markdown file"""
    try:
        # Get page metadata
        page = client.pages.retrieve(page_id=page_id)
        page_title = ""
        
        # Extract title from page properties
        properties = page.get("properties", {})
        for prop_name, prop_data in properties.items():
            if prop_data.get("type") == "title":
                title_rich_text = prop_data.get("title", [])
                page_title = convert_rich_text_to_markdown(title_rich_text).strip()
                break
        
        if not page_title:
            page_title = "Untitled"
        
        print(f"📄 Exporting: {page_title}")
        
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
        markdown_content = f"# {page_title}\n\n"
        for block in all_blocks:
            markdown_content += convert_block_to_markdown(block, client)
        
        # Sanitize filename
        safe_filename = re.sub(r'[^\w\s-]', '', page_title).strip()
        safe_filename = re.sub(r'[-\s]+', '-', safe_filename)
        if not safe_filename:
            safe_filename = f"page-{page_id[:8]}"
        
        output_file = output_path / f"{safe_filename}.md"
        
        # Write to file
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(markdown_content)
        
        print(f"✅ Exported to: {output_file}")
        
    except Exception as e:
        print(f"❌ Error exporting page {page_id}: {e}")
        raise


def main():
    """Main function"""
    print("📚 Notion Exporter starting...")
    
    # Get page IDs from environment variable (comma-separated)
    page_ids_str = os.getenv("PAGE_ID", "")
    if not page_ids_str:
        raise ValueError("PAGE_ID environment variable is required (comma-separated page IDs)")
    
    page_ids = [pid.strip() for pid in page_ids_str.split(",") if pid.strip()]
    
    if not page_ids:
        raise ValueError("No valid page IDs found in PAGE_ID")
    
    print(f"📋 Found {len(page_ids)} page(s) to export")
    
    # Initialize Notion client
    client = get_notion_client()
    
    # Export each page
    for page_id in page_ids:
        try:
            export_page_to_markdown(page_id, client, OUTPUT_DIR)
        except Exception as e:
            print(f"❌ Failed to export page {page_id}: {e}")
            continue
    
    print(f"✅ Export complete! Files saved to: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

