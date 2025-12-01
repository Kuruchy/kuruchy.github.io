# Self-Hosted Commenting System

This repository uses a self-hosted commenting system that stores comments as JSON files and processes them through GitHub Issues. No third-party services are required!

## How It Works

1. **Comment Submission**: Users fill out a comment form on article pages, which opens a GitHub Issue pre-filled with their comment.

2. **Comment Processing**: A GitHub Action automatically processes issues labeled with `comment` and extracts the comment data.

3. **Comment Storage**: Comments are stored in JSON files in `data/comments/{article-id}.json`.

4. **Comment Display**: Comments are loaded and displayed directly from the JSON files on article pages.

## Setup Instructions

### 1. Enable GitHub Actions

The GitHub Action workflow is located at `.github/workflows/process-comments.yml`. It will automatically run when:
- A new issue is created or edited
- An issue is labeled with `comment`

### 2. Create a Comment Label

In your GitHub repository:
1. Go to **Issues** → **Labels**
2. Create a new label called `comment` (or modify the workflow to use a different label)

### 3. Test the System

1. Visit any article page
2. Fill out the comment form
3. Submit the comment (this will open a GitHub Issue)
4. Add the `comment` label to the issue
5. The GitHub Action will automatically process it and add it to the JSON file

## Comment File Format

Comments are stored in `data/comments/{article-id}.json` with the following structure:

```json
{
  "article_id": "article-slug",
  "comments": [
    {
      "id": "comment-123",
      "issue_number": 123,
      "author": "John Doe",
      "email": "john@example.com",
      "text": "Great article!",
      "date": "2025-01-15T10:30:00Z",
      "approved": true
    }
  ]
}
```

## Manual Comment Processing

If you need to manually process a comment:

1. Go to **Actions** → **Process Comments from Issues**
2. Click **Run workflow**
3. Enter the issue number
4. Click **Run workflow**

## Moderation

Currently, all comments are auto-approved. To add moderation:

1. Edit `.github/scripts/process_comment.py`
2. Change `"approved": True` to `"approved": False`
3. Manually approve comments by editing the JSON files and setting `approved: true`

## Article ID Format

Article IDs are generated from article filenames:
- `articles/my-article.md` → `my-article`
- Special characters are replaced with hyphens
- Everything is converted to lowercase

## Customization

### Change Comment Label

Edit `.github/workflows/process-comments.yml` and change:
```yaml
if "comment" not in labels:
```
to your desired label name.

### Modify Comment Form

Edit the `renderComments()` function in `article.js` to customize the form fields or styling.

### Change Comment Storage Location

Edit `COMMENTS_DIR` in `.github/scripts/process_comment.py` to change where comments are stored.

## Troubleshooting

### Comments Not Appearing

1. Check that the issue has the `comment` label
2. Verify the article ID matches the filename format
3. Check GitHub Actions logs for errors
4. Ensure the JSON file was created in `data/comments/`

### GitHub Action Not Running

1. Verify the workflow file is in `.github/workflows/`
2. Check that GitHub Actions are enabled in repository settings
3. Ensure the workflow has proper permissions

## Security Notes

- Comments are stored as plain JSON files (publicly accessible)
- Email addresses are stored but not displayed publicly
- Consider adding spam filtering or moderation for production use
- The GitHub Action uses `GITHUB_TOKEN` which has write access to the repository

