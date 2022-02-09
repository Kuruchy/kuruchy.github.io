---
layout: post
title: My Blog Automation with Notion
categories: [Automation, GitHub, Notion]
excerpt: If this post reaches my blog, this means the automation with GitHub Actions and Notion works!
---

Lately I have been using [Notion](https://www.notion.so/) for almost any task that needs me to write something, and every new day I use it for something new. I started writing small Kanban Boards for ideas I had, but starting to see the potential of having a ***single source of true*** for all my data.

Now I use it to keep track of the following:

- Notes of books I am reading.
- Summaries and thoughts about new learnings.
- Climbing related things, such as one Page to track the different sizes of climbing shoes I use for different manufacturers.
- A short-time goals list and a long-term goals one.
- A big page where I write down parts of interesting and complex topics I want to learn by revisiting them often.

Then, one day I realized that using Notion was much more flexible than any other Markdown editor I've used before (because it is more than a Markdown editor!), and that wrote more with it than in any of my past tries of writing my blog.

So why don't use Notion to help me to write my blog?

![https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb](https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)

## How my Blog works

The way [Pages in GitHub](https://pages.github.com/) works goes like this. You have to have a repo named after your user ending in `.github.io` then it automatically has its own Action to deploy the page each time a new pull request is merged into the deploy branch (let’s pretend is main). This could be used to trigger the rebuild of a webpage, and that’s exactly what Jekyll does.

For building the blog, I use [Jekyll](https://jekyllrb.com/) and the [Reverie](https://jekyllthemes.io/theme/reverie) theme. And that’s it, super easy. Now all the Markdown files under the `_post` folder will be shown after the deployment success in your blog.

## Automation

The first approach was to write everything in Notion and then manually copy it into my markdown editor or the IntelliJ and commit the changes to my GitHub repo where I store the blog. 

And that’s a valid solution, but is not automated, so I wanted to build a tool that could automatically take the posts in my Notion, do the necessary changes, and commit them to the Repo.

So the things I needed to figure out were:

1. How to export Notion Pages to Markdown
2. Process the Markdown files to what Jekyll expects. (A Markdown file with some headers and local images links)
3. Commit them to the `_post`  folder
4. Trigger the export automatically

![https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb](https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)

## Steps

Basically I needed to perform these 3 steps in order, so I tried first to find some solutions out there, before implementing one of my own.

### 1 - Export Notion to Markdown

Notion has a tool to export a page, but one must do that for each page changed, and that escalates too quickly. And I wanted to have that done for me, if possible, from within GitHub. 

So I looked for a GitHub Action that could do that. Then I found the [Notion Exporter Action](https://github.com/igor-kupczynski/notion-exporter).

There you could find the steps to perform this, but basically sharing the Notion Page is **not necessary,** you would need to create a Notion Integration Token and store it in your Repo secrets as

`NOTION_TOKEN`. You also need the ID of the first page of your Blog in Notion, where all the post will live as subpages.

### 2 - Process .md to let Jekyll properly read them

Basically Jekyll uses markdown files as the source for building the posts, so since the export from already gave me, `.md` the only thing missing is to align how the images you uploaded to Notion are referenced in those `.md` and adding the header Jekyll requires.

For the conversion and the addition of the header, I built myself a small script in python. It can be found in my [Repo](https://github.com/Kuruchy/kuruchy.github.io/blob/master/bin/convertBackup.py).

But it looks like this:

```python
def ModifiedMarkDownFile():
    #Loop each file
    os.chdir('notion-backup/{}'.format(blogFile.replace('.md','')))
    for file in os.listdir():
        if not(file.endswith('.md')): continue
        imagesOrigen = file.replace('.md','')
        notionMarkDownFile = file
        newMarkdownFileName = ProcessPostHeader(notionMarkDownFile, imagesOrigen)
        DeleteFirstLineOfFile(notionMarkDownFile)
        RenameFile(notionMarkDownFile, newMarkdownFileName)
        MoveResources(newMarkdownFileName, imagesOrigen)

    RemoveBackUpFiles()
```

If you have suggestion on how to improve the script, fire an Issue!

For the header, we need to add this at the beginning of each Notion Page, to extract the data we need. and done!

| title | categories | excerpt | date |
| --- | --- | --- | --- |
| My Blog Automation with Notion | [Automation, GitHub, Notion] | If this post reaches my blog, this means the automatization with GitHub Actions and Notion works! | 2022-1-22 |

All these happen in the checkout Repo in the Linux instance run by GitHub Actions.

### 3 - Commit the changes automatically

I wanted another action to handle the commit and push of the changes to the repo from the Action itself. Here we use [Add and Commit Action](https://github.com/EndBug/add-and-commit).

The final workflow looks like this:

```yaml
jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: igor-kupczynski/notion-exporter@v1.0.2
        with:
          pages: ${{ secrets.PAGE_ID }}
          output-dir: notion-backup
          notion-token: ${{ secrets.NOTION_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: checkout repo content
        uses: actions/checkout@v2
      - name: setup python
        uses: actions/setup-python@v2
        with:
          python-version: 3.8
      - name: run Convert Backup
        run: |
          python bin/convertBackup.py
      - name: Commit changes
        uses: EndBug/add-and-commit@v8
        with:
          author_name: Bruno Retolaza
          author_email: bruno.retolaza@gmail.com
          message: 'Update Posts'
          add: "['_posts', 'notion-backup']"
          pull: '--autostash'
```

### 4 - Trigger the export automatically

For triggering the export automatically, I was thinking of doing this each night at midnight.

```yaml
on:
  schedule:
    - cron: "0 0 * * *"  # Call the export every day at midnight
```

But it may change in the future.

## Final thoughts

I spent I couple of days figuring this out, so I really hope this speeds up my writing process and lets me write more thoughts and ideas, and therefore made them to be out there for anyone to profit and learn. 

## Thanks

Big thanks to the following developers/engineers that inspired me!

- [Ryoni Cho](https://github.com/RyoniCho)
- [Eunchan Cho](https://github.com/echo724/notion2md)
- [Guillaume Gelin](https://github.com/ramnes/notion-sdk-py)
- [Jaime Alexander](https://github.com/jamalex/notion-py)