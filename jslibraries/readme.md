# Vanilla.js vs jQuery
This example looks at memory usage and efficiency in regards to using JavaScript libraries, in this case the popular [jQuery](http://jquery.com/) library. We'll compare using jQuery to a pure vanilla JS implementation.

> Note that Vanilla .js is not an actual library, it's a nerdy joke, it simply refers to using plain old JavaScript, or vanilla JavaScript. You can read more about it [here](http://vanilla-js.com/)

## The demo
This demo is a simple one, entailing a bunch of list elements which animates its background color by way of adding a class. The script part will simply add or remove a CSS class to the element which is clicked. There is also a button which will reset all of the elements.

## What are we testing
There are two things we aim to test with this demo, memory usage and execution time.

### Memory usage
The amount of memory consumed by a process is of great importance when developing for mobile devices which often have a set amount of memory available and usually no disk swapping. This means that we need to optimize for using as little memory as possible.

An easy way for testing memory usage is to use the Chrome developer tools and the timeline. This tool will show you how much memory your app is using at any given time graphed out over time. Let's firs have a look at the version using jQuery - let's test how much time the app uses to set itself up and add any event listeners. In the code, this is the `init()` method.

![alt_text][libraries_jquery]

As we can see, the jQuery version is using about 6 MB of memory to initialize the app, which isn't that bad. Okay, now lets test the the same app using pure JavaScript.

![alt_text][libraries_no_library]

This version uses 2.2 MB or under half the amount of memory used by the jQuery version. For a desktop browser this would probably not matter at all, but since we always need to consider "mobile" platforms this is actually a big deal. Continuing to run memory test we see that the doubling of memory usage continues for most operations when using jQuery. This is not because jQuery is poorly written, it's simply a consequence of the extra amount of work jQuery needs to do to ensure that the code can run in any browser.

> If you are building a webpage for older browsers jQuery is a must, however when building for modern browsers your should consider not using it.

### Execution time
When clicking the reset button the execution time for removing the `colorize` class is timed (you can view this in the console of the developer tools). Again we see that the jQuery version uses over double the time, however in this case the difference in minuscule because the amount of work being performed in almost nothing. There are however a lot of test available for testing the different parts of the «reset» method.

#### jQuery.each vs for
In the jQuery example we are using `jQuery.each()` to traverse all the `li` elements, while in the vanilla version we are using a plain for loop. Using the [jsPerf browser diet loop test](http://jsperf.com/browser-diet-jquery-each-vs-for-loop) (that's a mouthful), we see that the `jQuery.each()` method is actually up to **89% slower** that the vanilla for loop. Yikes! This matters a lot when dealing with many elements!

![alt_text][libraries_loops]

#### jQuery.addClass vs Element.classList
In the vanilla version we are using the `Element.classList` method to add and remove classes, as opposed to in the jQuery example where we are using the good old `jQueryElem.addClass` method. Testing this using a [jsPerf test](http://jsperf.com/jquery-addclass-vs-dom-classlist/10) we see again that the jQuery version is **84 % slower** compared to the vanilla one.

![alt_text][libraries_addClass]

## Conclusion
jQuery is awesome! If you are building web-pages for cross platform deployment which should run older browsers you should use jQuery to avoid going insane. However, be aware that **any** JavaScript library comes at a price, so please do test how the library performs and know exactly what it does before you commit to using it.

> Remember that the end-user experience is more important that the developer experience.

[libraries_jquery]: ../_resources/libraries_jquery.jpg "Using jQuery"
[libraries_no_library]: ../_resources/libraries_no_library.jpg "No library used"
[libraries_loops]: ../_resources/libraries_loops.jpg "Iteration"
[libraries_addClass]: ../_resources/libraries_addClass.jpg "Adding classes"



