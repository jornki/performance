(function () {
	"use strict";

	var App = {

		init : function () {

			this.useCrappyMode = true;

			this.imgAr = [];
			this.posAr = [];

			this.numImages = 0;
			this.imgWidth = 0;

			this.images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

			var sliderElem, sliderWidthElem, crappyCheck;

			// Add event listeners
			document.querySelector('#random').addEventListener('click', this.randomizePositions.bind(this));

			sliderElem = document.querySelector('#slider');
			sliderElem.addEventListener('change', this.numImagesChangedHandler.bind(this));
			sliderElem.addEventListener('mouseup', this.numImagesUpdatedHandler.bind(this));

			sliderWidthElem = document.querySelector('#sliderWidth');
			sliderWidthElem.addEventListener('change', this.widthImagesChangedHandler.bind(this));
			sliderWidthElem.addEventListener('mouseup', this.widthImagesUpdatedHandler.bind(this));

			crappyCheck = document.querySelector('#ch_crappy');
			crappyCheck.addEventListener('change', this.modeChangeHandler.bind(this));

			//INIT
			document.querySelector('#numImagesLabel').innerHTML = document.getElementById('slider').value + " images";
			document.querySelector('#widthImagesLabel').innerHTML = document.getElementById('sliderWidth').value + " px";

			//Startup
			this.imgWidth = sliderWidthElem.value;
			this.numImages = sliderElem.value;

			if (this.useCrappyMode) {
				this.createImageGridWithNumImagesOfWidthCrappyEdition();
			} else {
				this.createImageGridWithNumImagesOfWidth();
			}
		},

		modeChangeHandler : function (e) {
			this.useCrappyMode = e.target.checked;

			if (this.useCrappyMode) {
				this.createImageGridWithNumImagesOfWidthCrappyEdition();
			} else {
				this.createImageGridWithNumImagesOfWidth();
			}
		},

		numImagesChangedHandler : function (e) {
			document.getElementById('numImagesLabel').innerHTML = e.currentTarget.value + " images";
		},

		numImagesUpdatedHandler : function (e) {
			this.numImages = e.currentTarget.value;

			if (this.useCrappyMode) {
				this.createImageGridWithNumImagesOfWidthCrappyEdition();
			} else {
				this.createImageGridWithNumImagesOfWidth();
			}
		},

		widthImagesChangedHandler : function (e) {
			document.getElementById('widthImagesLabel').innerHTML = e.currentTarget.value + " px";
		},

		widthImagesUpdatedHandler : function (e) {

			this.imgWidth = e.currentTarget.value;

			if (this.useCrappyMode) {
				this.createImageGridWithNumImagesOfWidthCrappyEdition();
			} else {
				this.createImageGridWithNumImagesOfWidth();
			}
		},

		// Creates the image grid array from scratch every time it's called.
		// The correct way
		createImageGridWithNumImagesOfWidth : function () {

			var frag = document.createDocumentFragment();
			var maxImageCols = Math.floor(window.innerWidth / this.imgWidth);

			var currentCol = 0, x = 0, y = 0;

			this.imgAr = [];
			this.posAr = [];

			//Clear out any old images
			var holder = document.getElementById('image-holder');
			while (holder.hasChildNodes()) {
				holder.removeChild(holder.firstChild);
			}

			for (var i = 0; i < this.numImages; i++) {
				var img = document.createElement('img');
				img.width = this.imgWidth;
				img.height = this.imgWidth - (this.imgWidth * 0.34);

				x = currentCol * this.imgWidth;
				y = Math.floor(i / maxImageCols) * img.height;

				this.posAr.push({
					'x' : x,
					'y' : y
				});

				img.style.webkitTransform = "translate(" + x + "px," + y + "px)";

				this.imgAr.push(img);

				frag.appendChild(img);

				if ((currentCol + 1) < maxImageCols) {
					currentCol++;
				} else {
					currentCol = 0;
				}

				img.src = this.images[Math.floor(Math.random() * 3)];
			}
			document.getElementById('image-holder').appendChild(frag);
		},

		// Creates the image grid array from scratch every time it's called.
		// The crappy way (do not do this!!)
		createImageGridWithNumImagesOfWidthCrappyEdition : function () {

			var currentCol = 0, x = 0, y = 0;

			this.imgAr = [];
			this.posAr = [];

			//Clear out any old images
			var holder = document.getElementById('image-holder');
			while (holder.hasChildNodes()) {
				holder.removeChild(holder.firstChild);
			}

			for (var i = 0; i < this.numImages; i++) {
				var maxImageCols = Math.floor(window.innerWidth / this.imgWidth);
				var img = document.createElement('img');
				img.width = this.imgWidth;
				img.height = this.imgWidth - (this.imgWidth * 0.34);

				x = currentCol * this.imgWidth;
				y = Math.floor(i / maxImageCols) * img.height;

				this.posAr.push({
					'x' : x,
					'y' : y
				});

				img.style.webkitTransform = "translate3d(" + x + "px," + y + "px,0)";

				this.imgAr.push(img);

				document.getElementById('image-holder').appendChild(img);

				if ((currentCol + 1) < maxImageCols) {
					currentCol++;
				} else {
					currentCol = 0;
				}

				img.src = this.images[Math.floor(Math.random() * 3)];
			}
		},

		randomizePositions : function () {

			//Randomize the position array
			this.posAr = this.shuffleArray(this.posAr);

			//Move all images
			for (var i = 0; i < this.imgAr.length; i++) {
				if (this.useCrappyMode) {
					this.imgAr[i].style.webkitTransform = "translate3d(" + this.posAr[i].x + "px," + this.posAr[i].y + "px,0)";
				} else {
					this.imgAr[i].style.webkitTransform = "translate(" + this.posAr[i].x + "px," + this.posAr[i].y + "px)";
				}
			}
		},

		shuffleArray : function (array) {
			var counter = array.length, temp, index;

			// While there are elements in the array
			while (counter--) {
				// Pick a random index
				index = (Math.random() * counter) | 0;

				// And swap the last element with it
				temp = array[counter];
				array[counter] = array[index];
				array[index] = temp;
			}

			return array;
		}
	};
	App.init();
}());
