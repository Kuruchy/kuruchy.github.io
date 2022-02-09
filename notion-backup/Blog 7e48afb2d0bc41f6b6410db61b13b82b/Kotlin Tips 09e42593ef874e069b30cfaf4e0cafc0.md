# Kotlin Tips

| title | categories | excerpt | date |
| --- | --- | --- | --- |
| Kotlin Tips | [Tips, Kotlin] | This the first post in a series, that will be called Kotlin Tips, which will try to summarize a bunch of useful tips. | 2021-8-27 |

### **Comparing Two Strings**

When we compare two strings, we could want to compare them `case-sensitive` or `ignoring case`. Let's see how we could improve the latter.

![comparing_two_strings.gif](Kotlin%20Tips%2009e42593ef874e069b30cfaf4e0cafc0/comparing_two_strings.gif)

Kotlin provides us with an easier way to do the comparison, ignoring the case. Instead of altering the strings into f.e. `lowercase`, we could use the parameter `ignoreCase` in the `.equals` method.