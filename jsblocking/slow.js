(function(){
    "use strict";
    
	function getPrimes(max) {
	    var sieve = [], i, j, primes = [];
	    for (i = 2; i <= max; ++i) {
	        if (!sieve[i]) {
	            // i has not been marked -- it is prime
	            primes.push(i);
	            for (j = i << 1; j <= max; j += i) {
	                sieve[j] = true;
	            }
	        }
	    }
	    return primes;
	} 
	
	console.time('p');
	getPrimes(Math.pow(3000,2));
	console.timeEnd('p');
	
})();