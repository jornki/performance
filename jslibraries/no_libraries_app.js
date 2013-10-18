(function() {
	"use strict";
	var App;

	App = {

		list: null,

		init: function() {
			var actionButton = document.querySelector('.action-button');

			this.list = document.querySelector('.wrapper > ul');
			this.list.addEventListener('click', this.updateColor, false);
			actionButton.addEventListener('click', this, false);
		},

		updateColor: function(e) {
			if (e.target.webkitMatchesSelector('li')) {
				e.target.classList.add('colorize');
			}
		},

		handleEvent: function(e) {
			if (e.type === 'click') {
				console.time('Reset');
				var i, len = this.list.children.length;
				for (i = 0; i < len; i++) {
					this.list.children[i].classList.remove('colorize');
				}
				console.timeEnd('Reset');
			}
		}
	};

	App.init();

}());
