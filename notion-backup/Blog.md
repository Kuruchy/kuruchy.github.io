# Blog

I always had this idea in mind writing down my experiences, tips, ideas and so on in a personal Blog. I have tried once in the past, unsuccessfully, to create a blog where I wrote about tech in general. But I think I did not succeed because the topic was too broad. Or in other words, not so specific, which in the end made me try to create a post about things I did not like.

Now I start this again, but writing about Android development, Kotlin, Game dev, and also about climbing and bouldering. So I will annotate this Blog as `@Experimental` for now 😉

Strange mixture of themes, but is exactly what makes my day.

Apart from my family, programming and climbing are the two things I do get the most from.



One cool feature, I’ve recently found, is the possibility to add custom action buttons to almost anywhere in the Android Studio toolbars.

In my case, and I know most Android Developers could relate, I am hitting the infamous **Invalidate Caches & Restart** a couple of times a day. So as a way to make it happen faster (saving one mouse click, yeah!) I added a button to my Navigation Bar Toolbar.

To see what can be edited / added, you need to go to `Preferences → Appearance & Behavior → Menus and Toolbars`.

![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/Android_Studio_Actions_01.png)

We can add actions to a lot of places, making our life easier.

To create a button and add an action, we click on the `+` icon, and we will get the possibility to `Add Action` or `Add Separation`.

If we choose the `Add Action`, we would get the following popup to choose the action we want.

![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/Android_Studio_Actions_02.png)

You could also select a custom Icon for that action. I've chosen a “Fingers Crossed”.

![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/Android_Studio_Actions_03.png)

And that’s it! You now have an Action that **Invalidate Caches & Restart**

![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/Android_Studio_Actions_04.png)

We can add new colors to the Logcat messages by going to:
`Preferences → Editor → Color Scheme → Andoid Logcat`


![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/Android_Studio_Logcat_01.png)


And adjusting the Scheme to your needs. In the image I used the following colors:

`Assert: 9C27B0
Debug: 2196F3
Error: F44336
Info: 4CAF50
Verbose: default
Warning: FFC107`

In 2004, there were two people who wanted to build software for cameras. But they couldn't get investors interested. But Google was interested on building something like that, but for phones. Today, there's a large team at Google that builds software for cameras. Sort of XD.

![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/androids.jpg)

In this book you will find all the reasons, according to the participants of the first years of Android Development, that led Android to succeed.

I would say that my understanding of why android succeeded is because they had the right people working on it, all of them sharing the same idea and all of them working really hard on the same goal. Decisions being made and encapsulating the devs from the outside noise was also really important.

### **Interesting Facts**

Interesting fact, while developing the kernel (that will ship with G1) they did it in a way it actually seems to have 32Mb less memory, forcing the developers to work harder to fit all into a tighter budget.

Wake locks were added to the Android Linux Kernel by Arve to ensure the screen-off didn't mean completely-off

### **Favorite Quote**

You're telling me we have to have just as good battery life as the iPhone. We have this capability to run all these apps in the background, the hardware that we have has a bigger screen, we run background tasks, we were the first to do 3G, and we also have a physically smaller battery.

### **Final note**

If you hate footnotes, avoid this book!

### **Info**

Here you could find the profile of the book on [Goodreads](https://github.com/Kuruchy/kuruchy.github.io/blob/master/_posts/goodreads.com/book/show/58753360-androids?from_search=true&from_srp=true&qid=Kxh39KVMqE&rank=6).



I made it, I am back to conferences after the global pandemic. Last time I was in a Conference was in Copenhagen, December 2019, for the Kotlin Conf. Almost two years have past and a lot has changed since then. But I am happy to be back on track!

![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/droidcon.png)

The next three days will be packed with tons of amazing talks by top speakers. You could see more info in the [droidcon page.](https://www.berlin.droidcon.com/)

I will add an entry for each Day, where a will talk about all the talks I like the most.

### **Reviews**

- Day One [Post](https://kuruchy.github.io/droidcon-berlin-day-one/)
- Day Two & Three [Post](https://kuruchy.github.io/droidcon-berlin-day-two-and-three/)


Finally, the day arrived. One week before I had no plans to be in Berlin, nor to attend the event. But there I was, happy to be there on the first DroidCon after the pandemic.

![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/DroidConDay1.jpg)

# **Why Projects Succeed**

## **Lessons Learned from the Android OS**

### **by Chet Haase**

I really enjoy each talk given by [Chet](https://twitter.com/chethaase), the [podcast](http://androidbackstage.blogspot.com/) and his books, but is always nice to be able to see him in person. He emanates energy and good vibes.

The talk goes in the same direction of the book, (androids) but he summarizes it in less than 40 minutes. If you hadn't read it yet, do it. It is a fantastic book, and all the benefits go to charity!

I would say that my understanding of why android succeeded is because they had the right people working on it, all of them sharing the same idea and all of them working really hard on the same goal. Decisions being made and encapsulating the devs from the outside noise was also really important. But it is also important, like all the developers involved in the project said, ***"Be at the right time in the right place."***

Here my [review](https://kuruchy.github.io/androids-review/) on the book.

# **KMP for Mobile Developers**

### **by Enrique López Mañas**

An interesting talk about how KMP works for swift and how the iOS could profit from it. I am not an iOS developer, but I've developed an iOS App from scratch for my previous company, and since I love Kotlin and the idea of one day being able to have a multiplatform App built only in Kotlin, I decided to see how this looks for Swift.

# **Building a Production-Ready Chat SDK Using Jetpack Compose**

### **by Filip Babić & Márton Braun**

It was amazing to see a production ready SDK working with compose. My first encounter with compose was two years ago on the Kotlin Conf, in a workshop done by [Sean McQuillan](https://twitter.com/objcode). I was excited about it, but I must say it was too soon then.

Now is different, compose is no longer alpha, or beta, is production ready, already version 1. And I had the opportunity to get my hands on it, and it's amazing.

The talk was about how easy is to customize composable components, what challenges they met along the way.

### **Common pitfalls/issues in Compose**

- **Thinking imperatively:** you can't "update" the UI or set listeners
- **Hardcoding customization:** using modifiers too much in the internal code
- **Migrating everything:** migration should be done slowly
- **Lack of examples:** there aren't too many examples out there
They provided some links for testing the code and play with the demos.

Stay tuned for a post about it.

# **A Hitchhiker's Guide to Compose Compiler:**

## **Composers, Compiler Plugins, and Snapshots**

### **by Jossi Wolf & Amanda Hinchman-Dominguez**

Really cool, advance, talk about how compose works under the hood.

It is fascinating to see a full-room for a talk that takes a new API (Jetpack Compose) that simplifies UI development in android, and tries to explain the attendees the complexity behind. We engineer really love to understand how things work. I would have given these two the opportunity to talk for 40 more minutes. They know a lot, and they explain everything so clear that you don't need to process it. Good job! The most interesting part for me was to find out about the State capture in Compose. **Snapshots!!**

# **Becoming a mentor, why and how?**

### **by Florian Mierzejewski**

Really cool talk about how to mentor a mentee, when this mentee is a junior developer. Really happy to see that what I am already doing as part of my job, is the same other companies, and other people more expert in mentoring, are doing.

### **Why mentoring?**

- Mentees have a fresh outlook on the project
- Helping the mentee by serving as a link to the rest of the team
- Industry-wide lack of developers, worse at the senior level
- Giving back to the community
- Building long-lasting professional relationships
# **End of Day One**

The first day ended, like always, with a Party and some Beers. Nice ending for a great day!

## **Continue to Day Two & Three**

Here you can continue reading my review of [Day Two & Three](https://kuruchy.github.io/droidcon-berlin-day-two-and-three/)

We were warned that, due to the speakers not being able to travel, some talks would be remote. I attended some of them on the second and the third day. I must say the experience was far from ideal. Laggy, with audio problems, and so on; which prevented us from enjoy the talks.

![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/DroidConDay2.jpg)

## **Did you miss Day One review?**

Here you can read my review of [Day One](https://kuruchy.github.io/droidcon-berlin-day-one/)

# **Using Kotlin flow in MVVM**

### **by Fatih Girish**

Was early morning, and we were tired from the day 1 marathon, but the first talk of the day that I choose was about one of the two big topics of the conference.

### **Kotlin Flow**

A suspending function asynchronously returns a single value, but how can we return multiple asynchronously computed values? This is where Kotlin Flows come in.

Check the Flow [Documentation](https://kotlinlang.org/docs/flow.html) to know how is working. But here some Pros:

- Structured concurrency
- Cold stream
- Efficient data transformation
- Easy testing
![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/DroidConMVVM.png)

# **"Offline" is not an error**

### **by Yoni Levin**

`Once upon a time in a conference far far away...`

Cool and dynamic talk about how [monday.com](https://monday.com/) implemented an architecture using room, flow and Workmanager to make the app work seamlessly in offline mode.

Yoni gave us a huge boost of energy, making everyone pay attention to the talk. He exudes energy.

# **Keeping your Pixels Perfect**

## **Paparazzi 1.0**

### **by Joh Rodriguez**

I think every Android Developer knows the open-source projects that Square and CashApp team have, at least the most important and common ones. In this talk John presented us, or should I say reintroduced us, to how the [Paparazzi](https://github.com/cashapp/paparazzi) works.

It is an Android library to render your application screens without a physical device or emulator.

Stable version 1.0 is almost there, he wanted to give it to us as a surprise in the conference, but there were some tests failing ;) It was fascinating to see how they use this tool to test screens really fast without using emulators or devices.

One thing that stood out to me was the possibility to add the images generated to git and then be able to see differences. Never thought about this, great idea!

What I would love is to work in a company who is really involved in Open Sourcing tools.

# **Scaling App development at Zalando**

### **by Volker Leck & Alexey Agapitov**

In this talk, they presented their approach to migrate their Monolith App into an easy to maintain and easy to scale Architecture. Really nice to also see failures and timelines on the still ongoing migration. If you are into Apps Architecture or you want to know more about how Zalando did it, check the Talk!

![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/DroidConArch.jpg)

# **Jetpack Compose for Games & Animations**

### **by Wajahat Karim**

This talk was one of those I mention, which should be done remotely. I think the talk suffered a lot from that, and the fact that what I expected from it was not there, was a bit disappointing. Nevertheless, I learn about how some animations could be implemented with Jetpack Compose.

Games / projects done with compose & animations:

- [Bees & Bombs](https://github.com/alexjlockwood/bees-and-bombs-compose)
- [2048](https://github.com/alexjlockwood/android-2048-compose)
# **Automating Android Workflows**

## **with Github Actions**

### **by Ubiratan Soares**

I use [Github Actions](https://docs.github.com/es/actions) to automate the building, the testing and the deployment of my apps in GitHub, both for my private and for my public Repos. And both for my Android Apps and for my Unity 3d games.

![](https://github.com/Kuruchy/kuruchy.github.io/raw/master/images/DroidConGitHubActions.png)

So I was happy to see that there was a talk covering not only the basics of it. It was a great talk, from where I learn a couple of tips for my projects. How to scale the Pipelines and how to use build matrix to

# **End of Day Two**

Day two ended with popcorn, yes, kilos of popcorn. Ah! and also with a bad Movie = [Hackers](https://www.imdb.com/title/tt0113243/)

# **Day Three**

## **Community Day!**

I arrived in the fair room late, 8:50, or so I thought. I could tell the second day had already taken its toll on the people. So few were already there and the Kickoff was about to start.

This day was full of surprises and for me, bad choices with talks, choosing two workshops I really wanted to attend, which were remote and on rooms without the possibility of charging the laptops...

After the Kickoff, any developer who wanted could pitch a talk to be presented that day. Amazing idea!

# **A Comedy Talk**

### **by Chet Haase**

This was the big surprise of the day, not the only one though ;). Chet did use his stand-up comedy skills to give a hilarious talk about... Scala XD

# **Migrating your app to compose**

## **Step 1 - Live coding**

### **by Richard Schattauer**

This talk was one of the community talks that were selected by us, the attendees. It was cool to see a live coding on Compose. We had been seeing a lot of talks about it, but not a single one with so in depth Live Coding.

This one made me start migrating some of my projects to Compose. So thanks Richard!



Lately I have been using [Notion](https://www.notion.so/) for almost any task that needs me to write something, and every new day I use it for something new. I started writing small Kanban Boards for ideas I had, but starting to see the potential of having a ***single source of true ***for all my data.



Now I use it to keep track of the following:

- Notes of books I am reading.
- Summaries and thoughts about new learnings.
- Climbing related things, such as one Page to track the different sizes of climbing shoes I use for different manufacturers.
- A short-time goals list and a long-term goals one.
- A big page where I write down parts of interesting and complex topics I want to learn by revisiting them often.

Then, one day I realized that using Notion was much more flexible than any other Markdown editor I've used before (because it is more than a Markdown editor!), and that wrote more with it than in any of my past tries of writing my blog.



So why don't use Notion to help me to write my blog?



![](https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)



## How my Blog works

The way [Pages in GitHub](https://pages.github.com/) works goes like this. You have to have a repo named after your user ending in `.github.io` then it automatically has its own Action to deploy the page each time a new pull request is merged into the deploy branch (let’s pretend is main). This could be used to trigger the rebuild of a webpage, and that’s exactly what Jekyll does.


For building the blog, I use [Jekyll](https://jekyllrb.com/) and the [Reverie](https://jekyllthemes.io/theme/reverie) theme. And that’s it, super easy. Now all the Markdown files under the `_post` folder will be shown after the deployment success in your blog.



## Automation

The first approach was to write everything in Notion and then manually copy it into my markdown editor or the IntelliJ and commit the changes to my GitHub repo where I store the blog. 

And that’s a valid solution, but is not automated, so I wanted to build a tool that could automatically take the posts in my Notion, do the necessary changes, and commit them to the Repo.



So the things I needed to figure out were:

1. How to export Notion Pages to Markdown
1. Process the Markdown files to what Jekyll expects. (A Markdown file with some headers and local images links)
1. Commit them to the `_post`  folder
1. Trigger the export automatically


![](https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)

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
In climbing, the skills needed could be split into three well-defined pillars.** Mental, Physical & Attitude.** One may argue that these three are not equally important, that the physicality is way more important than the other two. That’s far from the truth. You don’t need to blind trust me on this one, I am not a climbing expert, neither a doctor nor coach. But I have read a lot of resources about this topic, written by eminences in the field. And all of them talk about these different pillars that build you as a climber, and all of them refer to them as equally important.

Each of these three pillars could also be split into different components that can be tackled individually, and be trained separately, improving therefore our overall climbing performance. 

Some of them can be tackled easily than others. For example, for some, being able to climb every day could be easy, they could be surrounded by a community of climbers, or even they could have a climbing gym right on the corner! But for others, having the time to train three days a week could be a big challenge.

I will try to talk about all the pillars in coming posts, but today I want to focus on a component inside the **Physic pillar. **Finger Strength.

![](https://images.unsplash.com/photo-1589458928476-47a493a030b5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)

Finger strength is a complex topic in climbing. It is also the hardest component to improve of the four in the **Physic pillar,** (Endurance, Movement, Finger Strength and Body). 

As a side note, there are elements in the Body component that we can not even change! Like our height, or our wingspan.

## **Goal**

I wanted to create some training plan for me, one that could improve my finger strength but also help to recover the ligaments and tendons in my fingers along the way. Could this be done at the same time?

I have read about the **active rest** for recovery and for training in different books and resources, and decided to apply it to my finger training. 

Tendons and ligaments tend to recover really slow, basically the ability to heal comes from the synovial fluid; in opposition, muscles have the blood helping them to recover, that’s why they heal faster. So why not trying to help the former recover by helping to pump the synovial fluid, while at the same time preventing the potential injuries, and ultimately training my finger strength?

I have a job that makes me sit from six to eight hours daily, so compared with someone that has a more physical job, I have some advantages and some disadvantages. I am not physically tired when I go training, which is optimal, but I am damaging my flexibility and my posture by sitting so many hours. 

Due to my job, I normally train in the evenings. I have been climbing for 4 years now, and I have improved a lot, but I’ve reached the 7a/7a+ (V7) plateau. That is why I need this finger strength improvement.

## **My Current Training**

I currently go to the gym three days a week. I only do boulder, but I try that one of the days is focused on endurance, trying to do longer routes, or do problems up, down, up and down. Not only that, but I also do twice a week flexibility and antagonist trainings at home. And then once a week, finger training on the BeastMaker 2000.



![](http://cdn.shopify.com/s/files/1/0107/6442/products/2000-Series-Feb2015-Small_1200x1200.jpg?v=1614607648)

## **Passive-active Training Plan**

I have decided to add, once a day, a ten minutes finger routine. I call it passive-active, because it is more a warm up than a training. I start by doing finger extensions, for one minute, then I do hangs on the BeastMaker, with my feet on the ground to control the weight. I warm each joint and finger, and I do different grips and pockets.

## **⚠️ **Hic Sunt Dracones

Beware that this training may be dangerous if you have some sort of pulley injury, it doesn't matter if it is only a strain. I don’t see someone doing fingerboard training with a partial tear or a full rupture...

## **Results**

I have being doing this for three weeks now, and I can tell I have improved on my finger strength, so I will keep doing this training. But what has surprised me a lot, is that the light pain I had on my middle finger’s middle joint (PIP) is gone.

I will add updates each month.



![](https://images.unsplash.com/photo-1534350752840-1b1b71b4b4fe?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)

## What is View Binding?

View Binding is the recommended way to access your views —in case you are still not using compose 😉— without using **Kotlin synthetics**, which you should have already stop using.



In case you are still using **Kotlin synthetics**, here you could follow the oficial documentation on how to migrate to Jetpack View Binding.

[https://developer.android.com/topic/libraries/view-binding/migration](https://developer.android.com/topic/libraries/view-binding/migration)



Once we start using View Binding, another inconvenient appears, we should remove the binding reference in the `onDestroy()` method of the Fragment’s lifecycle,  which means adding nullable variables and nullifying it in `onDestroy()`.



## The before the change

```kotlin
private var _binding: FragmentBinding? = null
private val binding get() = _binding!!


override fun onDestroyView() {
    super.onDestroyView()
    _binding = null
}
```



🤔 But we don’t want boilerplate, and code repetition in our codebase, **right?**



## Delegate properties to the rescue

In order to remove the null in the `onDestroy()` we would add it to the lifecycle of the fragment by using a wrapper class called `AutoCleanedValue`.



```kotlin
class AutoCleanedValue<T : Any>(
    fragment: Fragment,
    private val initializer: (() -> T)?,
) : ReadWriteProperty<Fragment, T> {

    private var _value: T? = null

    private val autoCleaningViewLifecycleOwnerObserver = object : DefaultLifecycleObserver {
        override fun onDestroy(owner: LifecycleOwner) {
            _value = null
        }
    }

    private val baseViewLifecycleObserver = object : DefaultLifecycleObserver {
        val viewLifecycleOwnerObserver = Observer<LifecycleOwner?> { viewLifecycleOwner ->
            viewLifecycleOwner?.lifecycle?.addObserver(autoCleaningViewLifecycleOwnerObserver)
        }

        override fun onCreate(owner: LifecycleOwner) =
            fragment.viewLifecycleOwnerLiveData.observeForever(viewLifecycleOwnerObserver)

        override fun onDestroy(owner: LifecycleOwner) =
            fragment.viewLifecycleOwnerLiveData.removeObserver(viewLifecycleOwnerObserver)
    }

    init {
        fragment.lifecycle.addObserver(baseViewLifecycleObserver)
    }

    override fun getValue(thisRef: Fragment, property: KProperty<*>): T {
        val value = _value

        if (value != null) return value

        if (thisRef.viewLifecycleOwner.lifecycle.currentState.isAtLeast(INITIALIZED)) {
            return initializer?.invoke().also { _value = it }
                ?: throw IllegalStateException(INITIALIZATION_ERROR)
        } else {
            throw IllegalStateException(FRAGMENT_ERROR)
        }
    }

    override fun setValue(thisRef: Fragment, property: KProperty<*>, value: T) {
        _value = value
    }
}
```



Then we create an extension function for the **Fragment **to wrap the binding with the `AutoCleanedValue `class, that provides us the lifecycle behavior we need, which allows us to use it with Kotlin delegates.



```kotlin
/**
* Returns a property delegate to the AutoCleanedValue attached to the Fragment Lifecycle
*/
fun <T : Any> Fragment.autoCleaned(initializer: (() -> T)? = null): AutoCleanedValue<T> {
    return AutoCleanedValue(this, initializer)
}
```



## The code after the change

So the binding now looks like:

```kotlin
private var binding: FragmentBinding by autoCleaned()
```



## 👨‍💻 Full code in this gist

[https://gist.github.com/Kuruchy/270fe8f0ba6e1937ec9c291912eb8d7e](https://gist.github.com/Kuruchy/270fe8f0ba6e1937ec9c291912eb8d7e)



One of the things I keep telling me over and over again, is how lucky I am. But then I remember all the long conversations I had with my friends —my wife included— about how one should define `Luck` and what role it plays in our lives.



Yes, **we were lucky **that we had the opportunity to grow, professionally, really fast by moving to Germany, but it was also a really challenging experience; sometimes it was tough and even frustrating. But the real key part of any self-improvement process is, in my opinion, to correctly identify and differentiate when you actually did get lucky or when you did not.



![](https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)


It is not easy to take an unknown step by going to a different country to —*maybe*— progress into your professional career. And it is even harder if you find problems of difficulties along the way, which you would most likely find. Those bumps on the road, would eventually make you consider stop perusing that goal of professionally growing abroad. I have seen it happening to some of my friends.



If I only had to take one lesson learned on my experience abroad, it would be exactly that, `don’t give up`. If you have a clear goal in mind, then with the right mindset, wiliness, and of course, support from friends and family, you would eventually reach it.



So what is the role Luck pays in all of this? I think the best way to put it is:

> Everybody needs luck 🍀, but the role it plays in the long run is so small that we might as well ignore it in our quest for self-improvement, because, regardless of how unlucky you were, there’s always something you could have done to put yourself in a different position to begin with.



## The Spanish NPP

Before moving to Germany I was a well established simulation engineer working at Tecnatom *–a company that, among other things, creates and maintains simulators for NPP (nuclear power plants)–* developing and maintaining the software for the Spanish's nuclear power plant’s replicas. 

 

It was a challenging job, where maths, physics and electronics needed to be translated into code. I had to learn how NPP worked, and how the different plant’s types meant different thermohydraulic behavior, different valves and drives parameters, different electric and electronics, and so on. It was demanding, but it was also an old codebase, with old tools, and not much time to upgrade all of that.



> All the process that happens in a power plant need to be translated into code in order to build the most accurate replica possible.



Also during that time I did some freelancing work with Java, simple tools for the **IBM Sterling. **But they allowed me to use Java away from my side projects, and into real-world projects. By developing these projects I found out that I wanted to do Java.


Before realizing it, I was into this company longer than I would have expected, five and a half years... And I needed a change in my career if I wanted to progress. I needed to change Stacks, I needed to stop using Fortran and start using some other language I enjoyed more, like C#, Python or Java. I needed to find a job newer and fresher.

## Jumping with my eyes closed

Back in summer of 2015, while was at a surf trip with a couple of friends, I came across a job opportunity to work for a software development company —HOB— based in Germany that developed secure network infrastructures. 



I didn’t think it twice and applied while I was starting my holidays. And did not look at the mails until I was back from the trip, just to find out I had an interview appointment. 



![](https://images.unsplash.com/photo-1497470888337-ded683b67494?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)



Maybe it was my willingness to go working abroad, or the feeling that I needed to change my job to progress, but the truth was, I made a tiny mistake. I did not do the thorough research I always do before joining a company. Which made some things harder down the line...



> My advise is to always, always do a thorough research of the potential companies you are thinking on joining.



Moving to Germany was hard, leaving all the family and friends behind wasn't an easy decision. If you have done it, going to another country to work, and lived there for a couple of years, you know what I mean.

## Changing Stacks

When I came to Germany, I had professional experience with Fortran, C# and Java. But the bast majority was Fortran. I also had some Android knowledge that I got from my side projects. 



![](https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)



Here I worked at two previous companies —HOB and Bintec— before landing on ING. Both were great opportunities, that allow me to see what works and what doesn’t within companies that sell software and hardware.

I learned a lot, I changed stacks a couple of times, which gave me the opportunity to have experience in all the major stacks, and improved my overall sight of how all those parts work together.  

During my time at Bintec I developed from scratch a portfolio app. It was developed natively both for iOS and Android. I also developed the backend of the App with Firebase.



Some of the stacks I’ve worked during my stay in Germany are:

- Embedded software development
- Backend development
- Web development
- iOS development
- Android development


So after a year and a half of realizing that I wanted to work with Java, and more specifically with Android, I was able to change my professional career completely, and start working on what I loved.



> Pursue your dream job, even if you need to change stacks, industries or countries. The reward is enormous once you start working on what you love.

## Finding that Job you love

That is what we ultimately all want, right? To have a job that makes us want to work on, that compels us to continually grow and learn, where you have an impact on the product and on your colleagues, where you have supportive teams around you. Teams with people that teach and help you, that are helpful, honest, nice and friendly.



Well, I found all of that —and more— here in Germany, working at ING. Of all these years I’ve spent in Germany, almost 4 I worked there, on a project I love —the ING Banking to go App— and within a team, I honestly think is the best I had worked on in my entire career.



At ING I progressed quite fast, learned and studied a lot, also worked a lot. I will write another post about all the resources that allowed me to become the developer I am now.


[https://play.google.com/store/apps/details?id=de.ingdiba.bankingapp](https://play.google.com/store/apps/details?id=de.ingdiba.bankingapp)



The end of June will mark the end of our —me, my wife and our daughter— `living abroad` experience, hence the end of my time working at ING Germany 🦁. And it's certainly something that makes me sad.



But really amazing experiences are waiting for me in my next adventure! I am really looking forward to them! 

Stay tuned for more!





I am revamping my blog to include some of the new tools I’ve recently learned and new/forgotten hobbies.

I will add useful tools to this blog, and update of my upcoming projects!







