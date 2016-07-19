/**
 * [getName is a promise function that will try to read the google's local storage in search of the key 'data']
 * @return {promise obj} [return a promise to be verified later on when the data is executed]
 */
var getName = function(){
	/**
	 * [p is the deferred promise object that will tell to $.when when the code is resolved, an error(reject), or a success]
	 * @type {[type]}
	 */
	var p = $.Deferred();

	/**
	 * try catch statement, we need to capture an error if the script fails to execute
	 */
	try{
		chrome.storage.local.get('name', function(data){
			/**
			 * if succesfully retrieves the 'name' key from the local storage
			 * then we resolve with the data
			 */
			p.resolve(data);
		});
	} catch (e) {
		/**
		 * if there is any error, this catch will return to us the exception error.
		 */
		p.reject(['error in getName',e]);
	}
	/**
	 * We return a promise
	 */
	return p.promise();
}

/**
 * [here we read the promises functions that will be loaded in the $.when statement]
 * @param  {promises functions} [as many functions as needed before executing the code inside of the when statement]
 */
$.when(getName())
.then(function(arguments){
	/** it will throw to the console all the possible promises objects 
	(each promise function belongs to an element of the argument arrays) */
	console.log(arguments);
})
.fail(function(arguments){
	console.log('errors',arguments);
});