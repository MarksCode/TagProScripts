// ==UserScript==
// @name          TagPro Achievements
// @author        Capernicus
// @version       2.0
// @include       http://*.koalabeast.com:*
// @include       http://tagpro-*.koalabeast.com*
// @grant         GM_setValue
// @grant         GM_getValue
// ==/UserScript==

var link = document.URL;
var re = /tagpro-\w+\.koalabeast.com\/(maps|boards|groups|\?[\w=]*|games\/find(\?r=\d*)?)?\#?$/;
if (re.exec(link)){												// User is on homePage
	homeButton(); 												// Insert button
	$('#AchieveButton').bind('click', showMenu);
}
var selected;

function homeButton(){											// Creates and inserts home button
	var button = document.createElement('li');
	$(button).html("<a href='#'>ACHIEVEMENTS</a>").attr('id', 'AchieveButton').insertAfter('#nav-maps');
	$("<style type='text/css'> .selec{ background-color:#4c667f;} </style>").appendTo("head");
}

function showMenu(){											// Show menu when user presses home button
	var menu = document.createElement('div');
	$(menu).css({
		'height':'500px',
		'width':'400px',
		'background-color':'#00ACE9',
		'position':'absolute',
		'top':'10em',
		'left':'50%',
		'border-radius':'5%',
		'border':'3px solid black',
		'transform':'translate(-50%, 0)',
        'zIndex':'30'
	}).attr('id', 'AchieveMenu');
	var footer = document.createElement('div');
	$(footer).css({
		'width':'100%',
		'height':'10%',
		'position':'relative',
		'margin-top':'-3%'
	});
	var footerText = document.createElement('p');
	$(footerText).text('Press on achievement to see current status').appendTo(footer).css({
		'text-align':'center',
		'color':'#893667'
	}).attr('id', 'footText');
	var heading = document.createElement('h1');
	$(heading).text('Achievements').css({
		'position':'relative',
		'color':'#893667',
		'padding-top':'5px',
		'padding-bottom':'5px',
		'left':'60px',
		'display':'inline'
	});
    var seperator = document.createElement('div');
    $(seperator).css({
        'width':'100%',
        'height':'10%',
        'position':'relative',
        'border-bottom':'2px solid black'
    });
	var exit = document.createElement('button');				// Hides menu button
	$(exit).html('X').click(hideMenu).css({
		'border':'solid 3px black',
		'float':'right',
		'border-radius':'100%',
		'background-color':'#c2c2d6'
	}).hover(function(){
		$(this).css({
			'background-color':'#33334d'
		})
	}, function(){
		$(this).css({
			'background-color':'#c2c2d6'
		})
	});
	var awardsDiv = document.createElement('div');				// Holds achievement table
	$(awardsDiv).css({
		'position':'relative',
		'width':'100%',
		'height':'80%',
		'overflow':'scroll',
		'margin-left':'auto',
		'margin-right':'auto',
        'border-bottom':'2px solid black'
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
		'font':'15pt monospace',
		'color':'black'
	})
	$(awards).find('tr').on('click', showStatus);
	$(awards).each(function(){$(this).find('tr:odd').css('background-color','#99ccff')});
	$(awards).each(function(){$(this).find('tr:even').css('background-color','#cce6ff')});
	$(awardsDiv).append(awards);
    $(seperator).append(heading, exit);
	$(menu).append(seperator, awardsDiv, footer);
	$('body').append(menu);
	
	giveRewards();
}

function showStatus(){
	var id = this.id;
	switch (id) {
		case 'awd1':
			$(selected).children().removeClass('selec');
			selected = this;
			$(this).children().addClass('selec');
			var stat = (GM_getValue('caps') || 0);
			$('#footText').text('Current Record: '+ stat +' captures');
			break;
		case 'awd2':
			$(selected).children().removeClass('selec');
			selected = this;
			$(this).children().addClass('selec');
			var stat = (GM_getValue('rets') || 0);
			$('#footText').text('Current Record: '+ stat +' returns');
			break;
		case 'awd3':
			$(selected).children().removeClass('selec');
			selected = this;
			$(this).children().addClass('selec');
			var stat = (GM_getValue('maxWins') || 0);
			var stat2 = (GM_getValue('wins') || 0);
			$('#footText').text('Record: '+ stat +' wins, Current streak: ' + stat2 + ' wins');
			break;
		case 'awd4':
			$(selected).children().removeClass('selec');
			selected = this;
			$(this).children().addClass('selec');
			var stat = (GM_getValue('pups') || 0);
			$('#footText').text('Current Record: '+ stat +' powerups');
			break;
		case 'awd5':
			$(selected).children().removeClass('selec');
			selected = this;
			$(this).children().addClass('selec');
			var stat = (GM_getValue('tags') || 0);
			$('#footText').text('Current Record: '+ stat +' tags');
			break;
		case 'awd6':
			$(selected).children().removeClass('selec');
			selected = this;
			$(this).children().addClass('selec');
			var mins = (GM_getValue('prevent') || 0);
			$('#footText').text('Current Record: '+Math.floor(mins/60)+' minutes ' +mins%60+ ' seconds');
			break;
		case 'awd7':
			$(selected).children().removeClass('selec');
			selected = this;
			$(this).children().addClass('selec');
			var stat = (GM_getValue('maxRank') || 0);
			var stat2 = (GM_getValue('rank') || 0);
			$('#footText').text('Record: '+ stat +' MVPs, Current streak: ' + stat2 + ' MVPs');
			break;
		case 'awd8':
			$(selected).children().removeClass('selec');
			selected = this;
			$(this).children().addClass('selec');
			var stat = (Math.round((GM_getValue('maxKD') || 0)*10))/10;
			$('#footText').text('Current Record: '+ stat +' K/D');
			break;
		case 'awd9':
			$(selected).children().removeClass('selec');
			selected = this;
			$(this).children().addClass('selec');
			var mins = (GM_getValue('hold') || 0);
			$('#footText').text('Current Record: '+Math.floor(mins/60)+' minutes ' +mins%60+ ' seconds');
			break;
		case 'awd10':
			$(selected).children().removeClass('selec');
			selected = this;
			$(this).children().addClass('selec');
			var stat = (GM_getValue('woDying') || 0);
			$('#footText').text('Current Record: '+ stat +' captures');
			break;
		default:
			break;
	}
}

function getAwards(){ 											// Create html for achievement table
	var c = parseInt(GM_getValue('caps') || 0);
	var r = parseInt(GM_getValue('rets') || 0);
	var p = parseInt(GM_getValue('pups') || 0);
	var t = parseInt(GM_getValue('tags') || 0);
	var w = parseInt(GM_getValue('maxWins') || 0);
	var pr = parseInt(GM_getValue('prevent') || 0);
	var f = parseInt(GM_getValue('maxRank') || 0);
	var k = parseInt(GM_getValue('maxKD') || 0);
	var h = parseInt(GM_getValue('hold') || 0);
    var wd = parseInt(GM_getValue('woDying') || 0);
	if (c == 3){													// Captures
		c = 'b';
	} else if (c == 4){
		c = 's';
	} else if (c == 5){
		c = 'g';
	} else {
		c = 'a';
	}
	if (r > 9 && r < 20){											// Returns
		r = 'b';
	} else if (r > 19 && r < 30){
		r = 's';
	} else if (r >= 30){
		r = 'g';
	} else {
		r = 'a';
	}
	if (p > 4 && p < 10){											// Prevent
		p = 'b';
	} else if (p > 9 && p < 20){
		p = 's';
	} else if (p >= 20){
		p = 'g';
	} else {
		p = 'a';
	}
	if (t > 9 && t < 20){											// Tags
		t = 'b';
	} else if (t > 19 && t < 30){
		t = 's';
	} else if (t >= 30){
		t = 'g';
	} else {
		t = 'a';
	}
	if (w > 2 && w < 5){											// Wins
		w = 'b';
	} else if (w > 4 && w < 10){
		w = 's';
	} else if (w >= 10){
		w = 'g';
	} else {
		w = 'a';
	}
	if (pr > 119 && pr < 300){										// Prevent
		pr = 'b';
	} else if (pr > 299 && pr < 480){
		pr = 's';
	} else if (pr >= 480){
		pr = 'g';
	} else {
		pr = 'a';
	}
	if (f > 2 && f < 5){											// Rank
		f = 'b';
	} else if (f > 4 && f < 8){
		f = 's';
	} else if (f >= 8){
		f = 'g';
	} else {
		f = 'a';
	}
	if (k >= 5 && k < 10){											// KD
		k = 'b';
	} else if (k >= 10 && k < 20){
		k = 's';
	} else if (k >= 20){
		k = 'g';
	} else {
		k = 'a';
	}
	if (h >= 120 && h < 240){											// Hold
		h = 'b';
	} else if (h >= 240 && h < 420){
		h = 's';
	} else if (h >= 420){
		h = 'g';
	} else {
		h = 'a';
	}
    if (wd == 1){													// Captures
		wd = 'b';
	} else if (wd == 2){
		wd = 's';
	} else if (wd == 3){
		wd = 'g';
	} else {
		wd = 'a';
	}
	var awardString = "<tr id='awd1'><td>3/4/5 caps in a game</td><td val='"+c+"' id='award1'></td></tr><tr id='awd2'><td>10/20/30 returns in game</td><td val='"+r+"' id='award2'></td></tr><tr id='awd3'><td>3/5/10 wins in-a-row</td><td val='"+w+"' id='award3'></td></tr><tr id='awd4'><td>5/10/20 pups in a game</td><td val='"+p+"' id='award4'></td></tr><tr id='awd5'><td>10/20/30 tags in a game</td><td val='"+t+"' id='award5'></td></tr><tr id='awd6'><td>2/5/8 prevent minutes</td><td val='"+pr+"' id='award6'></td></tr><tr id='awd7'><td>Get 1st 3/5/8 in-a-row</td><td val='"+f+"' id='award7'></td></tr><tr id='awd8'><td>Achieve K/D of 5/10/20</td><td val='"+k+"' id='award8'></td></tr><tr id='awd9'><td>2/4/7 minutes of hold</td><td val='"+h+"' id='award9'></td></tr><tr id='awd10'><td>3/4/5 caps without dying</td><td val='"+wd+"' id='award10'></td></tr>";
	return awardString;
}

function giveRewards(){												// Hands out trophies on menu
	for (var i=1; i<11; i++){
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
		if (!tagpro.spectator && tagpro.group.socket == null){					// Make sure user isn't spec or in group
			var stats = seeStats(e);
			setStats(stats);
		}
	});
	
	function seeStats(e){														// Get stats of player on game end
		var c = tagpro.players[tagpro.playerId]["s-captures"];
		var r = tagpro.players[tagpro.playerId]["s-returns"];
		var pu = tagpro.players[tagpro.playerId]["s-powerups"];
		var po = tagpro.players[tagpro.playerId]["s-pops"];
		var t = tagpro.players[tagpro.playerId]["s-tags"];
		var pr = tagpro.players[tagpro.playerId]["s-prevent"];
		var h = tagpro.players[tagpro.playerId]["s-hold"];
		var myScore = tagpro.players[tagpro.playerId]["score"];
		if (po == 0) var k = t;
        else var k = t/po;
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
        if (c == 1 && po == 0){
            var wd = 1;
        } else if(c == 2 && po == 0){
            var wd = 2;
        } else if(c >= 3 && po == 0){
            var wd = 3;
        } else {
            var wd = 0;
        };
		var stats = {
			caps: c, rets: r, pups: pu, pops: po, tag: t, won: w, pre: pr, ran: rank, kd: k, hold: h, woDying: wd
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
		var kd = parseInt(GM_getValue('maxKD') || 0);
		var h = parseInt(GM_getValue('hold') || 0);
        var wd = parseInt(GM_getValue('woDying') || 0);
		var flashed = false;
        if (stats.woDying > wd){
			GM_setValue('woDying', stats.woDying);
			if ((stats.woDying == 1 && wd < 1) || (stats.woDying == 2 && wd<2) || (stats.woDying >= 3 && wd < 3)){			// caps wo dying unlocked
				if (!flashed){
					flashAward();
					flash = true;
				}
			}
		};
		if (stats.caps > c){
			GM_setValue('caps', stats.caps);
			if ((stats.caps > 2 && c < 3) || (stats.caps > 3 && c<4) || (stats.caps > 4 && c < 5)){			// caps unlocked
				if (!flashed){
					flashAward();
					flash = true;
				}
			}
		};
		if (stats.rets > r){
		 	GM_setValue('rets', stats.rets);
			if ((stats.rets > 9 && r < 10) || (stats.rets > 19 && r<20) || (stats.rets > 29 && r < 30)){		// returns unlocked
				if (!flashed){
					flashAward();
					flash = true;
				}
			}
		};
		if (stats.pups > p){
			GM_setValue('pups', stats.pups);
			if ((stats.pups > 4 && p < 5) || (stats.pups > 9 && p<10) || (stats.pups > 19 && p < 20)){			// pups unlocked
				if (!flashed){
					flashAward();
					flash = true;
				}
			}
		};
		if (stats.kd > kd){
			GM_setValue('maxKD', stats.kd);
			if ((stats.kd >= 5 && kd < 10) || (stats.kd >= 10 && kd<20) || (stats.kd >= 20 && kd < 20)){         // KD unlocked
				if (!flashed){
					flashAward();
					flash = true;
				}
			}
		};
		if (stats.tag > t){
			GM_setValue('tags', stats.tag);
			if ((stats.tag > 9 && t < 10) || (stats.tag > 19 && t<20) || (stats.tag > 29 && t < 30)){			// tags unlocked
				if (!flashed){
					flashAward();
					flash = true;
				}
			}
		};
		if (stats.hold > h){
			GM_setValue('hold', stats.hold);
			if ((stats.hold > 119 && h < 240) || (stats.hold > 239 && h<420) || (stats.hold > 419 && h < 420)){			// hold unlocked
				if (!flashed){
					flashAward();
					flash = true;
				}
			}
		};
		if (stats.pre > pr) {
			GM_setValue('prevent', stats.pre);
			if ((stats.pre > 179 && pr < 180) || (stats.pre > 299 && pr<300) || (stats.pre > 479 && pr < 480)){ // prevent unlocked
				if (!flashed){
					flashAward();
					flash = true;
				}
			}
		};
		if (stats.ran == 1){
			GM_setValue('rank', ra+1);
			if (ra+1 > mr){
				GM_setValue('maxRank', ra+1);
				if (((ra+1)==3 || (ra+1)==5 || (ra+1) == 8) && !flashed){			// 1st in-a-row unlocked
					flashAward();
					flash = true;
				}
			}
		} else {
			GM_setValue('rank', 0);
		}
		if (stats.won == 1){
			GM_setValue('wins', w+1);
			if ((w+1) > mw){
				GM_setValue('maxWins', w+1);
				if (((w+1)==3 || (w+1)==5 || (w+1) == 10) && !flashed){				// wins in-a-row unlocked
					flashAward();
					flash = true;
				}
			}
		} else {
			GM_setValue('wins', 0);
		}
	}
	
	function flashAward(){															// Says player unlocked achievement
		var award = document.createElement('div');  // Holds text
		var text = document.createElement('h3');    // contains 'Achievement'
		var text2 = document.createElement('h3');   // contains 'Unlocked'
		$(text).text('Achievement').css({
			'color':'#893667',
			'text-align':'center',
			'vertical-align':'bottom',
			'display':'table-cell',
			'font-size':'130%',
			'padding-bottom':'10px'
		});
		$(text2).text('Unlocked!').css({
			'color':'#893667',
			'text-align':'center',
			'vertical-align':'middle',
			'display':'table-row',
			'font-size':'130%'
		});
		$(award).css({
			'height':'200px',
			'width':'200px',
			'background-color':'#cce6ff',
			'position':'fixed',
			'bottom':'20%',
			'left':'50%',
			'transform':'translate(-50%, 0%)',
			'border':'5px solid #004080',
			'border-radius':'100%',
			'display':'table'
		}).fadeIn(500);
		$(award).append(text, text2);
	    $('body').append(award);
	};
});
