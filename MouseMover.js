// ==UserScript==
// @name          Mouse Mover
// @version       1.0
// @include       http://*.koalabeast.com:*
// @include       http://*.jukejuice.com:*
// @include       http://*.newcompte.*
// @author        Ron Marks
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

tagpro.ready(function() {
	
	//Get middle of screen
	var screenY = $(window).height()/2;
	var screenX = $(window).width()/2;
	var currentMouseY = 0;
	var currentMouseX = 0;
	var moveY = 0
	var moveX = 0
	
	//Gets Mouse Position
	function readMouseMove(e){
		currentMouseX = e.clientX;
		currentMouseY = e.clientY;
	};
	
	//Logic for X-axis Movement
	function xAxisMove(){
		if (currentMouseX -100 > screenX){
			return 1; //Right
		} else if (currentMouseX + 100 < screenX){
			return -1; //Left
		} else {
			return 0; //Still
		}
	}
	
	//Logic for Y-axis Movement
	function yAxisMove(){
		if (currentMouseY -80 > screenY){
			return 1; //Down
		} else if (currentMouseY +80 < screenY){
			return -1; //Up
		} else {
			return 0; //Still
		}
	}
	
	setInterval(function(){
		// Get Mouse Position
		document.onmousemove = readMouseMove;
		
		// Decide what direction to move
		moveY = yAxisMove();
		moveX = xAxisMove(); 
		
		// Move character
			//Y-axis
		if (moveY > 0){
			tagpro.sendKeyPress("down", false);
			tagpro.sendKeyPress("up", true);
		} else if (moveY < 0){
			tagpro.sendKeyPress("up", false);
			tagpro.sendKeyPress("down", true);
		} else {
			tagpro.sendKeyPress("up", true);
			tagpro.sendKeyPress("up", true);
		}
			//X-axis
		if (moveX > 0){
			tagpro.sendKeyPress("left", true);
			tagpro.sendKeyPress("right", false);
		} else if (moveX < 0){
			tagpro.sendKeyPress("left", false);
			tagpro.sendKeyPress("right", true);
		} else {
			tagpro.sendKeyPress("left", true);
			tagpro.sendKeyPress("right", true);
		}
		
	}, 100);
});
