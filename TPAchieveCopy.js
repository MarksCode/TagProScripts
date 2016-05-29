// ==UserScript==
// @name          TagPro Achievements
// @author        Capernicus
// @version       1.0
// @include       http://*.koalabeast.com:*
// @include       http://tagpro-*.koalabeast.com*
// @grant         GM_setValue
// @grant         GM_getValue
// ==/UserScript==

var link = document.URL;
var re = /tagpro-\w+\.koalabeast.com\/$/;
if (re.exec(link)){
	homeButton(); 												// Insert button
	$('#AchieveButton').bind('click', showMenu);
}

function homeButton(){											// Creates and inserts home button
	var spot = $(".buttons");
	var button = document.createElement('a');
	$(button).html('Awards<span>achievements</span>');
	$(button).addClass('button').attr('id', 'AchieveButton');
	spot.append(button);	
}

function showMenu(){											// Show menu when user presses home button
	var menu = document.createElement('div');
	$(menu).css({
		'height':'500px',
		'width':'400px',
		'background-color':'#99ccff',
		'position':'absolute',
		'top':'50%',
		'left':'50%',
		'border-radius':'5%',
		'border':'3px solid black',
		'transform':'translate(-50%, -50%)'
	}).attr('id', 'AchieveMenu');
	var heading = document.createElement('h3');
	$(heading).text('Achievements').css({
		'position':'relative',
		'color':'black',
		'padding-top':'3px',
		'padding-bottom':'3px',
		'padding-left':'20px',
		'display':'inline'
	});
	var exit = document.createElement('button');				// Hide menu button
	$(exit).html('X').click(hideMenu).css({
		'border':'solid 3px black',
		'float':'right',
		'border-radius':'100%'
	});
	var awardsDiv = document.createElement('div');
	$(awardsDiv).css({
		'position':'relative',
		'width':'100%',
		'height':'80%',
		
		'overflow':'scroll',
		'margin-left':'auto',
		'margin-right':'auto'
	});
	var awards = document.createElement('table');				// Table for achievements
	var awardString = getAwards();								// Get html for achievements table
	$(awards).css({
		'position':'relative',
		'width':'100%',
		'height':'100%',
		'border-spacing':'collapse'
	}).html(awardString);
	$(awards).find('td').css({
		'padding-top':'5px',
		'padding-left':'10px',
		'font':'15pt verdana',
		'color':'black'
	});
	
	$(awards).each(function(){$(this).find('tr:even').css('background-color','#cce6ff')});
	$(awardsDiv).append(awards);
	$(menu).append(heading, exit, awardsDiv);
	$('body').append(menu);
	
	giveRewards();
}

function getAwards(){ 											// Create html for achievement table
	var c = parseInt(GM_getValue('caps') || 0);
	var r = parseInt(GM_getValue('rets') || 0);
	var p = parseInt(GM_getValue('pups') || 0);
	var t = parseInt(GM_getValue('tags') || 0);
	var w = parseInt(GM_getValue('maxWins') || 0);
	var pr = parseInt(GM_getValue('prevent') || 0);
	var f = parseInt(GM_getValue('maxRank') || 0);
	if (c == 3){
		c = 'b';
	} else if (c == 4){
		c = 's';
	} else if (c == 5){
		c = 'g';
	} else {
		c = 'a';
	}
	if (r > 9 && r < 20){
		r = 'b';
	} else if (r > 19 && r < 30){
		r = 's';
	} else if (r >= 30){
		r = 'g';
	} else {
		r = 'a';
	}
	if (p > 4 && p < 10){
		p = 'b';
	} else if (p > 9 && p < 20){
		p = 's';
	} else if (p >= 20){
		p = 'g';
	} else {
		p = 'a';
	}
	if (t > 9 && t < 20){
		t = 'b';
	} else if (t > 19 && t < 30){
		t = 's';
	} else if (t >= 30){
		t = 'g';
	} else {
		t = 'a';
	}
	if (w > 2 && w < 5){
		w = 'b';
	} else if (w > 4 && w < 10){
		w = 's';
	} else if (w >= 10){
		w = 'g';
	} else {
		w = 'a';
	}
	if (pr > 119 && pr < 300){
		pr = 'b';
	} else if (pr > 299 && pr < 480){
		pr = 's';
	} else if (pr >= 480){
		pr = 'g';
	} else {
		pr = 'a';
	}
	if (f > 2 && f < 5){
		f = 'b';
	} else if (f > 4 && f < 8){
		f = 's';
	} else if (f >= 8){
		f = 'g';
	} else {
		f = 'a';
	}
	var awardString = "<tr><td>3/4/5 caps in a game</td><td val='"+c+"' id='award1'></td></tr><tr><td>10/20/30 returns in game</td><td val='"+r+"' id='award2'></td></tr><tr><td>3/5/10 wins in-a-row</td><td val='"+w+"' id='award3'></td></tr><tr><td>5/10/20 pups in a game</td><td val='"+p+"' id='award4'></td></tr><tr><td>10/20/30 tags in a game</td><td val='"+t+"' id='award5'></td></tr><tr><td>2/5/8 prevent minutes</td><td val='"+pr+"' id='award6'></td></tr><tr><td>Get 1st 3/5/8 in-a-row</td><td val='"+f+"' id='award7'></td></tr>";
	return awardString;
}

function giveRewards(){												// Hands out trophies on menu
	for (var i=1; i<8; i++){
		var id = 'award' + i;
		var achieve = $('#' + id);
		var category = achieve.attr('val');
		switch(category){
			case 'b':
				var img = document.createElement('img');
				img.src = "http://i.imgur.com/71JO8r7.png";
				$(img).css({
					'height': '60px',
					'width': '80px'
				});
				achieve.append(img);
				break;
			case 's':
				var img = document.createElement('img');
				img.src = "http://i.imgur.com/jtgHaob.png";
				$(img).css({
					'height': '60px',
					'width': '80px'
				});
				achieve.append(img);
				break;
			case 'g':
				var img = document.createElement('img');
				img.src = "http://i.imgur.com/vluCTQP.png";
				$(img).css({
					'height': '60px',
					'width': '80px'
				});
				achieve.append(img);
				break;
			default:
				var img = document.createElement('img');
				img.src = "http://i.imgur.com/yCKPcte.png";
				$(img).css({
					'height': '50px',
					'width': '80px'
				});
				achieve.append(img);
		}
	}
}

function hideMenu(){
	$('#AchieveMenu').remove();
}

tagpro.ready(function(){
	tagpro.socket.on('end', function(e){
		var stats = seeStats(e);
		setStats(stats);
	});
	
	function seeStats(e){														// Get stats of player on game end
		var c = tagpro.players[tagpro.playerId]["s-captures"];
		var r = tagpro.players[tagpro.playerId]["s-returns"];
		var pu = tagpro.players[tagpro.playerId]["s-powerups"];
		var po = tagpro.players[tagpro.playerId]["s-pops"];
		var t = tagpro.players[tagpro.playerId]["s-tags"];
		var pr = tagpro.players[tagpro.playerId]["s-prevent"];
		var myScore = tagpro.players[tagpro.playerId]["score"];
		var rank = 1;
		for (x in tagpro.players) {
			tpP = tagpro.players[x];
			if (myScore < tpP["score"]) rank ++;
		}
		if ((e.winner=='red' && tagpro.players[tagpro.playerId].team ==1) || e.winner=='blue' && tagpro.players[tagpro.playerId].team ==2){
			var w = 1;
		} else {
			var w = 0;
		}
		var stats = {
			caps: c, rets: r, pups: pu, pops: po, tag: t, won: w, pre: pr, ran: rank
		};
		return stats;
	}
	
	function setStats(stats){													// Set stats of player
		var c = parseInt(GM_getValue('caps') || 0);
		var r = parseInt(GM_getValue('rets') || 0);
		var p = parseInt(GM_getValue('pups') || 0);
		var t = parseInt(GM_getValue('tags') || 0);
		var w = parseInt(GM_getValue('wins') || 0);
		var mw = parseInt(GM_getValue('maxWins') || 0);
		var pr = parseInt(GM_getValue('prevent') || 0);
		var ra = parseInt(GM_getValue('rank') || 0);
		var mr = parseInt(GM_getValue('maxRank') || 0);

		if (stats.caps > c) GM_setValue('caps', stats.caps);
		if (stats.rets > r) GM_setValue('rets', stats.rets);
		if (stats.pups > p) GM_setValue('pups', stats.pups);
		if (stats.tag > t) GM_setValue('tags', stats.tag);
		if (stats.pre > pr) GM_setValue('prevent', stats.pre);
		if (stats.ran == 1){
			GM_setValue('rank', ra+1);
			if (ra+1 > mr){
				GM_setValue('maxRank', ra+1);
			}
		} else {
			GM_setValue('rank', 0);
		}
		if (stats.won == 1){
			GM_setValue('wins', w+1);
			if ((w+1) > mw){
				GM_setValue('maxWins', w+1);
			}
		} else {
			GM_setValue('wins', 0);
		}
	}
});


