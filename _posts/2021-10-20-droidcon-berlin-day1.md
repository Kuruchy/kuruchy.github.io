---
layout: post
title: Droidcon Berlin Day 1
categories: [Droidcon, Conference, Android]
excerpt: All the day one talks were fascinating, but these are the ones I most liked.
---

## Why Projects Succeed: Lessons Learned from the Android OS by Chet Haase

I really enjoy each talk given by [Chet](https://twitter.com/chethaase), the [podcast](http://androidbackstage.blogspot.com/) and his books, but is always nice to be able to see him in person. He emanates energy and good vibes.

The talk goes in the same direction of the book, (androids) but he summarizes it in less than 40 minutes. If you hadn't read it yet, do it. It is a fantastic book, and all the benefits go to charity!

Here my [review](https://kuruchy.github.io/androids-review/) on the book. 

{% include pullquote.html quote="Be at the right time in the right place." %}

I would say that my understanding of why android succeeded is because they had the right people working on it, all of them sharing the same idea and all of them working really hard on the same goal. Decisions being made and encapsulating the devs from the outside noise was also really important.

## KMP for Mobile Developers by Enrique López Mañas

An interesting talk about how KMP works for swift and how the iOS could profit from it. I am not an iOS developer, but I've developed an iOS App from scratch for my previous company, and since I love Kotlin and the idea of one day being able to have a multiplatform App built only in Kotlin, I decided to see how this looks for Swift.

## Building a Production-Ready Chat SDK Using Jetpack Compose by Filip Babić & Márton Braun

It was amazing to see a production ready SDK working with compose. My first encounter with compose was two years ago on the Kotlin Conf, in a workshop done by [Sean McQuillan](https://twitter.com/objcode). I was excited about it, but I must say it was too soon then. 

Now is different, compose is no longer alpha, or beta, is production ready, already version 1. And I had the opportunity to get my hands on it, and it's amazing.

The talk was about how easy is to customize composable components, what challenges they met along the way.

### Common pitfalls/issues in Compose
- **Thinking imperatively:** you can't "update" the UI or set listeners
- **Hardcoding customization:** using modifiers too much in the internal code
- **Migrating everything:** migration should be done slowly
- **Lack of examples:** there aren't too many examples out there

They provided some links for testing the code and play with the demos. 

Stay tuned for a post about it.

## A Hitchhiker's Guide to Compose Compiler: Composers, Compiler Plugins, and Snapshots by Jossi Wolf & Amanda Hinchman-Dominguez

Really cool, advance, talk about how compose works under the hood. 

It is fascinating to see a full-room for a talk that takes a new API (Jetpack Compose) that simplifies UI development in android, and tries to explain the viewers the complexity behind. We engineers really love to understand how things work.

The most interesting part for me was to find out about the State capture in Compose. **Snapshots!!**

# Becoming a mentor, why and how? by Florian Mierzejewski

Really cool talk about how to mentor a mentee, when this mentee is a junior developer. Really happy to see that what I am already doing as part of my job, is the same other companies, and other people more expert in mentoring, are doing.

### Why mentoring?
- Mentees have a fresh outlook on the project
- Helping the mentee by serving as a link to the rest of the team
- Industry-wide lack of developers, worse at the senior level
- Giving back to the community
- Building long-lasting professional relationships