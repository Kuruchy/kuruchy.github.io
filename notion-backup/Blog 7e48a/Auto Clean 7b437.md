# Auto Clean View Binding

| title | categories | excerpt | date |
| --- | --- | --- | --- |
| Auto Clean View Binding | [Adnroid, Kotlin] | I bring to you a solution to automatically clean  the binding reference without using boilerplate. | 2022-4-14 |

![https://images.unsplash.com/photo-1534350752840-1b1b71b4b4fe?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb](https://images.unsplash.com/photo-1534350752840-1b1b71b4b4fe?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)

## What is View Binding?

View Binding is the recommended way to access your views —in case you are still not using compose 😉— without using **Kotlin synthetics**, which you should have already stop using.

In case you are still using **Kotlin synthetics**, here you could follow the oficial documentation on how to migrate to Jetpack View Binding.

[](https://developer.android.com/topic/libraries/view-binding/migration)

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

Then we create an extension function for the **Fragment** to wrap the binding with the `AutoCleanedValue` class, that provides us the lifecycle behavior we need, which allows us to use it with Kotlin delegates.

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

<aside>
👨‍💻 Full code in this gist →

[Auto Cleaned Value delegate](https://gist.github.com/Kuruchy/270fe8f0ba6e1937ec9c291912eb8d7e)

</aside>