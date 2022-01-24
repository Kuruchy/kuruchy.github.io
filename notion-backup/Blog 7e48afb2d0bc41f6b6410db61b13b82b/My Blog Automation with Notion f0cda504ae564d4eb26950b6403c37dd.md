# My Blog Automation with Notion

| title | categories | excerpt | date |
| --- | --- | --- | --- |
| My Blog Automation with Notion | [Automation] | If this post reaches my blog, this means the automatization with Github Actions and Notion works! | 2022-1-22 |

Lately I have been using [Notion](https://www.notion.so/) for almost any task that needs me to write something, and every new day I use it for something new. I started writing small Kanban Boards for ideas I had, but starting to see the potential of having a ***single source of true*** for all my data.

Now I use it to keep track of the following:

- Notes of books I am reading.
- Summaries and thoughts about new learnings.
- Climbing related things, such as one Page to track the different sizes of climbing shoes I use for different manufacturers.
- A short-time goals list and a long-term goals one.
- A big page where I write down parts of interesting and complex topics I want to learn by revisiting them often.

Then one day I realized that using Notion is much more flexible than any other Markdown editor I’ve used before, and because of that write more with it than in any of my past tries of writing my blog.

So why don't use Notion to help me writing my blog?

![https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb](https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)

## How my Blog works

The way [Pages in GitHub](https://pages.github.com/) works goes like this. You have to have a repo named after your user ending in `.github.io` then it automatically has its own Action to deploy the page each time a new pull request is merged into the deploy branch (lets pretend is main). This could be used to trigger the rebuild of a webpage, and that’s exactly what Jekyll does.

For building the blog I use [Jekyll](https://jekyllrb.com/) and the [Reverie](https://jekyllthemes.io/theme/reverie) theme. And that’s it, super easy. Now all the Markdown files under the `_post` folder will be shown after the deployment success in your blog.

## Automation

The first approach was to write everything in Notion and then manually copy it to my markdown editor or the IntelliJ and commit the changes to my GitHub repo where I store the blog. 

As a good engineer I spent some time thinking about how could I automate the 

### Links

[Add and Commit Action](https://github.com/EndBug/add-and-commit)

[Notion Exporter Action](https://github.com/igor-kupczynski/notion-exporter)

[NotionToGithubPage](https://github.com/RyoniCho/NotionToGithubPage)

[https://github.com/EndBug/add-and-commit](https://github.com/EndBug/add-and-commit)