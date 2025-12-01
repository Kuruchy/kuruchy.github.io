#!/usr/bin/env python3
"""
Process comments from GitHub Issues and add them to JSON comment files.
This script extracts comment data from issues labeled with 'comment' and
adds them to the appropriate article's comment JSON file.
"""

import os
import json
import sys
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, Optional

# GitHub API setup
GITHUB_REPO = "kuruchy/kuruchy.github.io"
COMMENTS_DIR = Path(__file__).parent.parent.parent / "data" / "comments"
COMMENTS_DIR.mkdir(parents=True, exist_ok=True)


def get_github_issue(issue_number: str, token: str) -> Optional[Dict]:
    """Fetch issue data from GitHub API"""
    import urllib.request
    import urllib.error
    
    url = f"https://api.github.com/repos/{GITHUB_REPO}/issues/{issue_number}"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}",
        "User-Agent": "CommentProcessor"
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Error fetching issue: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None


def parse_issue_body(body: str) -> Dict:
    """Parse issue body to extract comment data"""
    data = {
        "article": None,
        "author": "Anonymous",
        "email": None,
        "text": ""
    }
    
    # Extract article ID
    article_match = re.search(r'\*\*Article:\*\*\s*([^\n]+)', body)
    if article_match:
        data["article"] = article_match.group(1).strip()
    
    # Extract author
    author_match = re.search(r'\*\*Author:\*\*\s*([^\n]+)', body)
    if author_match:
        data["author"] = author_match.group(1).strip()
    
    # Extract email
    email_match = re.search(r'\*\*Email:\*\*\s*([^\n]+)', body)
    if email_match:
        data["email"] = email_match.group(1).strip()
    
    # Extract comment text (everything after "**Comment:**")
    comment_match = re.search(r'\*\*Comment:\*\*\s*(.+?)(?:\n\n---|$)', body, re.DOTALL)
    if comment_match:
        data["text"] = comment_match.group(1).strip()
    
    return data


def get_article_id_from_filename(filename: str) -> str:
    """Convert article filename to article ID"""
    if not filename:
        return None
    
    # Remove 'articles/' prefix and '.md' suffix
    article_id = filename.replace('articles/', '').replace('.md', '')
    # Replace non-alphanumeric characters with hyphens
    article_id = re.sub(r'[^a-zA-Z0-9-]', '-', article_id).lower()
    # Remove multiple consecutive hyphens
    article_id = re.sub(r'-+', '-', article_id).strip('-')
    
    return article_id


def load_comments_file(article_id: str) -> Dict:
    """Load existing comments from JSON file"""
    comments_file = COMMENTS_DIR / f"{article_id}.json"
    
    if comments_file.exists():
        try:
            with open(comments_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading comments file: {e}")
    
    # Return default structure
    return {
        "article_id": article_id,
        "comments": []
    }


def save_comments_file(article_id: str, data: Dict):
    """Save comments to JSON file"""
    comments_file = COMMENTS_DIR / f"{article_id}.json"
    
    # Sort comments by date (newest first)
    data["comments"].sort(key=lambda x: x.get("date", ""), reverse=True)
    
    with open(comments_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def add_comment_to_file(article_id: str, comment_data: Dict, issue_number: int):
    """Add a new comment to the comments file"""
    comments_data = load_comments_file(article_id)
    
    # Check if comment already exists (by issue number)
    existing_comment = None
    for comment in comments_data["comments"]:
        if comment.get("issue_number") == issue_number:
            existing_comment = comment
            break
    
    new_comment = {
        "id": f"comment-{issue_number}",
        "issue_number": issue_number,
        "author": comment_data["author"],
        "email": comment_data.get("email"),
        "text": comment_data["text"],
        "date": datetime.utcnow().isoformat() + "Z",
        "approved": True  # Auto-approve for now, can be changed to require manual approval
    }
    
    if existing_comment:
        # Update existing comment
        index = comments_data["comments"].index(existing_comment)
        comments_data["comments"][index] = new_comment
        print(f"Updated comment in {article_id}.json")
    else:
        # Add new comment
        comments_data["comments"].append(new_comment)
        print(f"Added new comment to {article_id}.json")
    
    save_comments_file(article_id, comments_data)


def main():
    if len(sys.argv) < 2:
        print("Usage: process_comment.py <issue_number>")
        sys.exit(1)
    
    issue_number = sys.argv[1]
    token = os.environ.get("GITHUB_TOKEN")
    
    if not token:
        print("Error: GITHUB_TOKEN environment variable not set")
        sys.exit(1)
    
    print(f"Processing issue #{issue_number}...")
    
    # Fetch issue data
    issue = get_github_issue(issue_number, token)
    if not issue:
        print(f"Failed to fetch issue #{issue_number}")
        sys.exit(1)
    
    # Check if issue has 'comment' label
    labels = [label["name"] for label in issue.get("labels", [])]
    if "comment" not in labels:
        print(f"Issue #{issue_number} does not have 'comment' label. Skipping.")
        sys.exit(0)
    
    # Parse issue body
    comment_data = parse_issue_body(issue.get("body", ""))
    
    if not comment_data["article"]:
        print("Error: Could not determine article from issue body")
        sys.exit(1)
    
    if not comment_data["text"]:
        print("Error: No comment text found in issue body")
        sys.exit(1)
    
    # Get article ID
    article_id = get_article_id_from_filename(comment_data["article"])
    if not article_id:
        print(f"Error: Could not generate article ID from '{comment_data['article']}'")
        sys.exit(1)
    
    # Add comment to file
    add_comment_to_file(article_id, comment_data, int(issue_number))
    
    print(f"Successfully processed comment for article: {article_id}")


if __name__ == "__main__":
    main()

