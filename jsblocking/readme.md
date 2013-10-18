# JavaScript blocking
These demos demonstrates two blocking issues which should be avoided when writing web-applications.
## Download blocking
When the HTML parser finds a `<script>` reference all parsing stops. This is because a script can alter the actual content of the page, so the parser stops dead, fetches, parses and executes the script before parsing can continue. This means that if you have a script reference in the header of the page, this script will block the browser from drawing anything to the screen. 
## UI Thread blocking
The second type of blocking caused by JavaScript is called UI thread blocking. In short this means that a JavaScript operation can block the browser from painting to the screen and receiving user input. This happens because JavaScript executes all of it's operations on the UI thread, which is also the same thread which handles user events like taps and clicks.
> Both Nielsen and Xerox have separably conducted experiments to test how long a delay (blocking time) is acceptable before the user perceives it as an actual negative delay. The conclusion of both experiments was that 100 ms is the maximum time any interface should be blocked.

## Examples
Let's consider the following example (full markup [here](01bad.html)):
```html
<!DOCTYPE html>
<html>
	<head>
		<title>The wrong way!</title>
		<meta charset="UTF-8">
		<script type="text/javascript" src="slow.js"></script>
	</head>
	<body>
		<p>Awesome text</p>
		<img src="images/img1.jpg" width="250" height="166" alt="Image" />
		..... several images
	</body>
</html>
```
In this example we have a page containing a bunch of images, also we are linking to a `<script>` element called `slow.js` in the header section of the HTML page.  The [script itself](slow.js) performs an extremely intensive operation of calculating a bunch of prime numbers - in short a lot of work. 
> By adding this script to the header section of the page no images will be downloaded until the scripts completes! 

If we take a look at this in the Safari Web Inspector it shows up like in the image below. Since the script is placed in the header the parser stops, downloads it, parses it and executes it. The images doesn't even start to download before the script is complete. Bad all around! Now let's fix it!

![alt_text][jsblocking_bad]

### Fixing the download blocking problem
This is the easy part, we simply move the script tag element to the bottom of the `<body>` element. This way the images can start to download _before_ the parser event finds the script element.
> You should if possible always defer loading of scripts by adding them as the last element of the body tag.

Now that we have made that tiny little change, let's once again take a look in the web inspector. Hey, that's better, the images now start to download before the script is done. Also, the page is rendered sooner. We are still using the same JavaScript file, so this was an easy fix. However, the script is still blocking painting of the images for too long.

![alt_text][jsblocking_better]

### Fixing the paint (UI thread) blocking
Because the script takes a lot of time to complete, this will prevent the images from getting painted to the screen. You might think that this is weird since the images now are defined before the script in the markup. However, since the script is smaller in file size than the images it will get downloaded first and then executed before the images have a chance to be painted to the screen.

So, we can have the script wait for all the images to be painted and then execute it, but that is not a good idea since it will lead to the user having to wait additional time. Maybe the result of the script is important? What we actually need, is to have the browser download and paint the images and run the script at the same time without blocking the UI thread.

Since main time consuming part of our script is not DOM manipulation, we can alter the _calculate prime numbers_ part of the script to run in a separate thread, or **worker** as it's known as in the [specification](http://dev.w3.org/html5/workers/). This does require some changes to the script and it does require a browser which supports workers. _Also note that you cannot perform DOM operations from a worker since this is not thread safe._

Now that we have altered our script, let's once again test it in the web inspector. Now we see that the images are downloaded and presented without any blocking at all, also the script completes way way faster since it now can run in a separate thread.

![alt_text][jsblocking_best]

## Summary
* If at all possible, put your script definition at the bottom of the body element
* Don't block the UI thread for more than **max** 100ms
* Use WebWorkers for time consuming work like calculations and ajax requests

[jsblocking_bad]: ../_resources/jsblocking_bad.jpg "Bad"
[jsblocking_better]: ../_resources/jsblocking_better.jpg "Better"
[jsblocking_best]: ../_resources/jsblocking_best.jpg "Best"