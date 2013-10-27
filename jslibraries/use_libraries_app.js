(function () {
	"use strict";
	var App;

	App = {

		list : null,

		init : function () {
			this.list = $('.wrapper > ul');
			this.list.on('click', 'li', this.updateColor);
			$('.action-button').on('click', this.resetColors.bind(this));
		},

		updateColor : function (e) {
			$(e.currentTarget).addClass('colorize');
		},

		resetColors : function (e) {
			console.time('Reset');
			$.each(this.list.children(), function (index, element) {
				$(this).removeClass('colorize');
			});
			console.timeEnd('Reset');
		}
	};

	App.init();

}());
