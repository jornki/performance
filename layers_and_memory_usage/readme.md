# Paints, invalidation and memory usage
This demo demonstrates several things such as layer memory usage when using the `translate3d`or `translateZ` hacks. The demo also covers the usage of document fragments and where to do calculations.

## The demo
A grid of images is generated using transforms. These images can then be shuffled around in an animated fashion. There are two implementations of the  method which is responsible for the image layout:

* The `createImageGridWithNumImagesOfWidth` version is the "good" version, the one most effective with regards to performance.
* The other version `createImageGridWithNumImagesOfWidthCrappyEdition` is as the name suggests, the more "crappy" version which does not perform that well.

![alt_text][imagegrid_demo]

Toggling the «use crappy mode» checkbox will toggle between the two render modes as well as affect how the animation is performed when the images are shuffled.

As mentioned in the intro, this demo goes into several areas of performance optimizations. To detect problems in the "crappy" method we'll use the Safari timeline which is a part of the Safari developer tools. _Note that using the Chrome developer tools would accomplish pretty much the same if that is your preference._ The areas of performance we'll look at are:

* Reducing calculations
* Reducing the number of paints
* Reducing the number of layers and memory consumption

### Reducing calculations
Around line 115 in the `createImageGridWithNumImagesOfWidth` method you find a line of code which reads `var maxImageCols = Math.floor(window.innerWidth / this.imgWidth);`. This line will figure out how many columns of images which can be fitted to the current window size. Notice how this calculation is performed outside of the for loop, in contrast to `createImageGridWithNumImagesOfWidthCrappyEdition` where it is inside of the loop causing a recalculation for each image.

In this case this is not a disaster since the width of the browser window is cached. However, be extremely careful by asking for the `innerWidth` of elements since this will invalidate cached metrics and will in some cases cause a reflow.

### Reducing the number of paints
This is a biggie! Painting is perhaps the most demanding operation performed by a mobile device, so reducing the number of paints is essential to good performance. Let's assume that «number of images slider» is set to 50 images and see how the "good" and the "crappy" methods do. First up is the "crappy" version.

![alt_text][imagegrid_paints_bad]

Well, maybe not unexpectedly displaying 50 images yields at least 50 paint operations. There are a few more since the toolbar, checkbox and stuff have to be painted as well. So, that is a lot of paint operations, why?

On line ~200 inside the `createImageGridWithNumImagesOfWidthCrappyEdition` method we add the image element to the DOM using `document.getElementById('image-holder').appendChild(img)`. We do this once for each image, which of course forces the browser to paint an image each time we push one to the DOM. This is quite inefficient and luckily there is a way to do the exact same thing using way fewer paints. Enter the `documentFragment`.

> A Document Fragment is a lightweight container that can hold DOM nodes. It allows you to construct DOM object without adding them to the DOM.

Using a «document fragment» allows us to add all the images to the fragment and then add the fragment to the DOM later when all the images has been added. To do this you first need to create a fragment `var frag = document.createDocumentFragment()`, then you can append nodes to it like any other DOM element `frag.appendChild(img)`. When all the images has been added to the fragment we simply add the fragment to the DOM `document.getElementById('image-holder').appendChild(frag)`. The whole thing goes something like this (from line 127 in the good method):

```javascript
var frag = document.createDocumentFragment();
for (var i = 0; i < this.numImages; i++) {
	var img = document.createElement('img');
	// .. do image stuff
	frag.appendChild(img);
}
document.getElementById('image-holder').appendChild(frag);
```
So, lets see if this helps on the number of paints.

![alt_text][imagegrid_paints_better]

Woha! We are now down to just 5 paints total, including the toolbar and the checkbox. What is happing here is that Safari in this case tiles the document fragment into suitable pieces for drawing. In fact, if you select the paint events in the inspector from the bottom up you can see that Safari has created (in this case) 3 tiles of images and that the fourth and fifth paints are the checkbox. Id call that a success, moving on to layers.

### Reducing the number of layers
Have you ever used the `translateZ(0)` or `translate3d(0,0,0)` values of the CSS transform property to force hardware acceleration on an element? Whether you have or not, let's start with an explanation on what happens when you do this.

Using a 3d transform on an element is one way of telling the browser that it should go ahead and create a separate layer for the element in question. By doing this the element can be painted separately from the rest of the page and so follows if can be rendered on the GPU...in other words hardware accelerated.

Some times this is a smart thing to do, however there is a side effect to creating layers. Since you trough your CSS have told the browser to paint the layered elements individually the browser can no longer render the page in tiles and it has to allocate a separate space in memory for each layer. If not used with care this can lead to the dark side.

_In this example we are using 101 images with a size of 151 px wide._

Let's take a look at the "crappy" version first.

![alt_text][imagegrid_layers_bad]

Holy cow! 102 layers and 7.5 MB of memory. This is happening because at line 194 of the "crappy" method we state that `img.style.webkitTransform = "translate3d(" + x + "px," + y + "px,0)"`. Yep, we are telling the browser that each image should be rendered on it's own layer. And we need to do this to get good animation performance, right? Nope. The browser is smarter than that, in fact the browser can do way more optimization that you ever can, if you let it.

> Don't try to outsmart the browser, it will always be able to optimize better than you since it knows more than you.

This is quite easy to fix, like we have on line 140 in the "good" method where we use a regular transform instead of the 3d one. And the result?

![alt_text][imagegrid_layers_better]

Yep, one layer 250 kB of memory used. That is better! And the animation performance is actually the same since Safari in this case is smart enough to apply a 3d transform only when the images are animating. Told you the browser was smarter than you ;-)

[imagegrid_demo]: ../_resources/imagegrid_demo.jpg "Demo"
[imagegrid_paints_bad]: ../_resources/imagegrid_paints_bad.jpg "Paints"
[imagegrid_paints_better]: ../_resources/imagegrid_paints_good.jpg 
"Paints"
[imagegrid_layers_bad]: ../_resources/imagegrid_layers_bad.jpg
"Lots of layer = lots of memory usage"
[imagegrid_layers_better]: ../_resources/imagegrid_layers_better.jpg 
"Fewer layers = less memory usage"