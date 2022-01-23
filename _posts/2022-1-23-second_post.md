
---
layout: post
title: Second Post
categories: [Automation]
excerpt: This is the second try of an automation series.
---

This is the second try.

The order of modifiers matters

```kotlin
@Composable
fun MyComposable() {
    Text("Hi there!",
        Modifier
            .border(2.dp, Color.Green)
            .padding(50.dp)
            .border(2.dp, Color.Red)
            .padding(50.dp)
    )
}
```

![2.png](images/2.png)