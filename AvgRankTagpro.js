// ==UserScript==
// @name          Average Rank in Load Screen
// @author        Ron Marks
// @version       1.0
// @include       http://*.koalabeast.com:*
// @include       http://tagpro-*.koalabeast.com*
// @grant         GM_setValue
// @grant         GM_getValue
// ==/UserScript==


// Gets average rank of recorded games
function getAvg(){
	var sum = 0;
	var totalNums = 0;
	for (var i = 1; i<11; i++){
		var dataN = "data" + String(i);
		if ((GM_getValue(dataN) != 'undefined') && (typeof GM_getValue(dataN) != 'undefined')){
			sum += GM_getValue(dataN);
			totalNums++;
		}
	}
	return ((Math.round((sum/totalNums)*10))/10);
}

// Finds where to place average rank table
function findInputSpot() {
	SS = $('div.smaller.section');
	for (var i = 0; i < SS.length; i ++) {
		textcontent = SS[i].innerText || SS[i].textContent
		if (textcontent.search('On Server') >= 0) {
			return SS[i];
		}
	}
	return false;
}
	
// Places average rank table of loading screen
if(document.URL.search('games/find')>=0) {
	inputSpot = $(findInputSpot());
	inputSpot.before( "<center><p id='headText'></p><table id='avgRank'><tr><td id = DATA1></td><td id = DATA2></td><td id = DATA3></td><td id = DATA4></td><td id = DATA5></td><td id = DATA6></td><td id = DATA7></td><td id = DATA8></td><td id = DATA9></td><td id = DATA10></td></tr></table><p id='avgText'></p></center>" );
	$("#headText").text("Rank over last 10 games:");
	$("#headText").css({"color": "green", "font-size": "200%"});
	var avgRank = getAvg();
	$("#avgText").text("Average Rank: " + avgRank);
	$("#avgText").css({"color":"green", "font-size": "225%"});
    for (var i = 1; i<11; i++){
		var dataName = "DATA" + String(i);
		var dataVal = "data" + String(i);
		var gotData = GM_getValue(dataVal);
		if (gotData != 'undefined'){
			$("#"+dataName).text(gotData);
        }
    }
	$("td").css({"height":"40px","width":"40px","border":"2px solid green","text-align":"center","font-size":"150%"});
    $("#avgRank").css({"border-collapse":"collapse"});
   
}

tagpro.ready(function(){
	
	// Saves stats at end of game
	tagpro.socket.on("end", function (e){
		myRank = seeStats();
		setStats(myRank);
	});
	
	// Checks for players rank on scoreboard
	function seeStats(){
        var myScore = tagpro.players[tagpro.playerId]["score"];
		var rank = 1;
		for (x in tagpro.players) {
			tpP = tagpro.players[x];
			if (myScore < tpP["score"]) rank ++;
		}
		return rank;
	}
	
	// Saves rank data
	function setStats(rank){
		for (var i = 10; i > 1; i--){
			var firstData = "data" + String(i);
			var secondData = "data" + String(i-1);
			GM_setValue(firstData, GM_getValue(secondData));
		}
		GM_setValue ('data1', rank);		
	}
});
