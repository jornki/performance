(function(){
    "use strict";
    
	var w = new Worker('worker.js');
	w.onmessage = function(e) {
		console.timeEnd('fast');
	}
	console.time('fast');
	w.postMessage((Math.pow(3000,2)).toString());
	
})();