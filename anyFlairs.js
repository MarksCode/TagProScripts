// ==UserScript==
// @name          AnyFlairs
// @author        Capernicus
// @version       2.1
// @include       http://*.koalabeast.com:*
// @include       http://tagpro-*.koalabeast.com*
// @grant         GM_setValue
// @grant         GM_getValue
// ==/UserScript==

var link = document.URL;
var re = /tagpro-\w+\.koalabeast.com\/(maps|boards|groups|\?[\w=]*|games\/find(\?r=\d*)?)?\/?\w*\#?$/;
if (re.exec(link)){												// User is on homePage
	homeButton(); 												// Insert button
	$('#FlairButton').bind('click', showMenu);
	$("<style type='text/css'> .flairSelec{ border:2px solid #FFD700;} </style>").appendTo("head");
}

var selected;
var curFlairSheet;
var numSheets = 3;

function homeButton(){											// Creates and inserts home button
	var button = document.createElement('li');
	$(button).html("<a href='#'>FLAIRS</a>").attr('id', 'FlairButton').insertAfter('#nav-maps');
}

function showMenu(){
	var flairSheet = GM_getValue('sheet') || 1;
	var menu = document.createElement('div');
	$(menu).css({
		'height':'335px',
		'width':'400px',
		'position':'absolute',
		'border-radius':'5%',
		'border':'3px solid black',
		'left':'50%',
		'transform':'translate(-50%, 0)',
		'top':'10em',
		'zIndex':'30',
		'background': 'linear-gradient(to bottom, #3D445A , #859398)'
	}).attr('id', 'FlairMenu');
	
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
	var nextPage = document.createElement('button');
	$(nextPage).text('>').css({
		'position':'absolute',
		'bottom':'33px',
		'left':'205px',
		'background-color':'transparent',
		'color':'black',
	}).attr('id', 'next').bind('click', nextSheet);
	var lastPage = document.createElement('button');
	$(lastPage).text('<').css({
		'position':'absolute',
		'bottom':'33px',
		'right':'195px',
		'background-color':'transparent',
		'color':'black',
	}).attr('id', 'last').bind('click', prevSheet);
	var flairs = document.createElement('img');
	$(flairs).attr({
		'src':getCurSheet(),
		'id':'flairs'
	}).css({
		'width':'330px',
		'top':'15px',
		'left':'30px',
		'position':'absolute'
	}).bind('click', function(e){
		var offset = $(this).offset();
		flairPressed(e.pageX-offset.left, e.pageY-offset.top);
	});
	
	var flairTable = document.createElement('table');
	$(flairTable).attr('id', 'flairTable').html("<!-- --><tr><td x='0' y='0'></td><td x='1' y='0'></td><td x='2' y='0'></td><td x='3' y='0'></td><td x='4' y='0'></td><td x='5' y='0'></td><td x='6' y='0'></td><td x='7' y='0'></td><td x='8' y='0'></td><td x='9' y='0'></td><td x='10' y='0'></td></tr><!-- --><!-- --><tr><td x='0' y='1'></td><td x='1' y='1'></td><td x='2' y='1'></td><td x='3' y='1'></td><td x='4' y='1'></td><td x='5' y='1'></td><td x='6' y='1'></td><td x='7' y='1'></td><td x='8' y='1'></td><td x='9' y='1'></td><td x='10' y='1'></td></tr><!-- --><!-- --><tr><td x='0' y='2'></td><td x='1' y='2'></td><td x='2' y='2'></td><td x='3' y='2'></td><td x='4' y='2'></td><td x='5' y='2'></td><td x='6' y='2'></td><td x='7' y='2'></td><td x='8' y='2'></td><td x='9' y='2'></td><td x='10' y='2'></td></tr><!-- --><!-- --><tr><td x='0' y='3'></td><td x='1' y='3'></td><td x='2' y='3'></td><td x='3' y='3'></td><td x='4' y='3'></td><td x='5' y='3'></td><td x='6' y='3'></td><td x='7' y='3'></td><td x='8' y='3'></td><td x='9' y='3'></td><td x='10' y='3'></td></tr><!-- --><!-- --><tr><td x='0' y='4'></td><td x='1' y='4'></td><td x='2' y='4'></td><td x='3' y='4'></td><td x='4' y='4'></td><td x='5' y='4'></td><td x='6' y='4'></td><td x='7' y='4'></td><td x='8' y='4'></td><td x='9' y='4'></td><td x='10' y='4'></td></tr><!-- --><!-- --><tr><td x='0' y='5'></td><td x='1' y='5'></td><td x='2' y='5'></td><td x='3' y='5'></td><td x='4' y='5'></td><td x='5' y='5'></td><td x='6' y='5'></td><td x='7' y='5'></td><td x='8' y='5'></td><td x='9' y='5'></td><td x='10' y='5'></td></tr><!-- --><!-- --><tr><td x='0' y='6'></td><td x='1' y='6'></td><td x='2' y='6'></td><td x='3' y='6'></td><td x='4' y='6'></td><td x='5' y='6'></td><td x='6' y='6'></td><td x='7' y='6'></td><td x='8' y='6'></td><td x='9' y='6'></td><td x='10' y='6'></td></tr><!-- --><!-- --><tr><td x='0' y='7'></td><td x='1' y='7'></td><td x='2' y='7'></td><td x='3' y='7'></td><td x='4' y='7'></td><td x='5' y='7'></td><td x='6' y='7'></td><td x='7' y='7'></td><td x='8' y='7'></td><td x='9' y='7'></td><td x='10' y='7'></td></tr><!-- -->").css({
		'border-collapse':'collapse',
		'width':'330px',
		'top':'15px',
		'left':'30px',
		'position':'absolute'
	});
	$(flairTable).find('td').css({
		'height':'30px',
		'width':'30px'
	}).bind('click', flairPressed);
	
	var noneButton = document.createElement('button');
	$(noneButton).css({
		'border':'solid 2px black',
		'border-radius':'5%',
		'background-color':'#c2c2d6',
		'position':'absolute',
		'right':'5px',
		'bottom':'3px'
	}).html('Select None').hover(function(){
		$(this).css({
			'background-color':'#33334d'
		})
	}, function(){
		$(this).css({
			'background-color':'#c2c2d6'
		})
	}).bind('click', unSelectFlair);

	var spinCheck = GM_getValue('spinChecked') || 0;
	var randCheck = GM_getValue('random') || 0;

	var randButton = document.createElement('input');
	$(randButton).css({
		'position':'absolute',
		'right':'270px',
		'bottom':'12px'
	}).attr({
		'type':'checkbox',
		'id':'randBox'
	}).bind('click', randChecked);
	if (randCheck == 1){
		$(randButton).prop( "checked", true );
	}
	var randText = document.createElement('p');
	$(randText).text("Random?").css({
		'position':'absolute',
		'right':'290px',
		'margin-bottom':'0',
		'margin-top':'0',
		'bottom':'8px'
	});
	
	var spinButton = document.createElement('input');
	$(spinButton).css({
		'position':'absolute',
		'right':'150px',
		'bottom':'12px'
	}).attr({
		'type':'checkbox',
		'id':'spinBox'
	}).bind('click', spinChecked);
	if (spinCheck == 1){
		$(spinButton).prop( "checked", true );
	}
	var spinText = document.createElement('p');
	$(spinText).text("Spin flair?").css({
		'position':'absolute',
		'right':'170px',
		'margin-bottom':'0',
		'margin-top':'0',
		'bottom':'8px'
	});
	
	$(menu).append(exit, flairs, flairTable, noneButton, spinButton, spinText, randButton, randText, nextPage, lastPage);
	$('body').append(menu);
	
	var fx = GM_getValue('flairX') || -1;
	var fy = GM_getValue('flairY') || -1;
	selected = $("td[x='" + fx +"']").filter("td[y='" + fy +"']");
	$(selected).addClass('flairSelec');
	if (flairSheet == 1){
		$('#last').prop('disabled', true);
	}
	if (flairSheet == numSheets){
		$('#next').prop('disabled', true);
	}
}

function spinChecked(){
	var checked = GM_getValue('spinChecked') || 0;
	if (checked == 0){
		GM_setValue('spinChecked',1);
	}
	if (checked == 1){
		GM_setValue('spinChecked',0);
	}
}

function randChecked(){
	var checked = GM_getValue('random') || 0;
	if (checked == 0){
		GM_setValue('random',1);
	}
	if (checked == 1){
		GM_setValue('random',0);
	}
}

function getCurSheet(isGame = false){
	var random = GM_getValue('random') || 0;
	var sheetNum = parseInt(GM_getValue('sheet') || 1);
	if (random && isGame){
		sheetNum = getRandomInt(1, 3);
	}
	switch (sheetNum) {
		case 1:
			return 'http://i.imgur.com/QlTafAU.png';
			break;
		case 2:
			return 'http://i.imgur.com/jLGpcKz.png';
			break;
		case 3:
			return 'http://i.imgur.com/2uAyumP.png';
			break;
		default:
			return 'http://static.koalabeast.com/images/flair.png'
			break;
	}
}

function nextSheet(){
	var sheet = GM_getValue('sheet') || 1;
	sheet +=1;
	if (sheet == numSheets){
		$("#next").prop('disabled', true);
	}
	$("#last").prop('disabled', false);
	GM_setValue('sheet', sheet);
	$('#flairs').attr('src', getCurSheet());
}

function prevSheet(){
	var sheet = GM_getValue('sheet') || 1;
	sheet -=1;
	if (sheet == 1){
		$("#last").prop('disabled', true);
	}
	$("#next").prop('disabled', false);
	GM_setValue('sheet', sheet);
	$('#flairs').attr('src', getCurSheet());
}

function flairPressed(){
	var x = $(this).attr('x');
	var y = $(this).attr('y');
    GM_setValue('flairX',x);
    GM_setValue('flairY',y);
	$(selected).removeClass('flairSelec');
	selected = this;
	$(this).addClass('flairSelec');
}

function hideMenu(){
	$('#FlairMenu').remove();
}

function unSelectFlair(){
	GM_setValue('flairX', -1);
	$(selected).removeClass('flairSelec');
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

tagpro.ready(function() { 
	var img = $($('#flair').get(0)).clone();
	var a = img.get(0);
	a.src = getCurSheet(true);
	a.crossOrigin = "Anonymous";
	tagpro.renderer.getFlairTexture = function(e, t, isMe) {
		if (isMe){
			var b = a;
		} else {
			var b = $('#flair').get(0);
		}
		var n = PIXI.TextureCache[e];
		if (!n) {
			var r = document.createElement("canvas");
			r.width = 16, r.height = 16;
			var i = r.getContext("2d");
			i.drawImage(b, t.x * 16, t.y * 16, 16, 16, 0, 0, 16, 16), n = PIXI.Texture.fromCanvas(r), PIXI.TextureCache[e] = n
		}
		return n
	}
	
	tagpro.renderer.drawFlair = function(e) {
		e.sprites.flair && e.sprites.flair.flairName !== e.flair && (e.sprites.info.removeChild(e.sprites.flair), e.sprites.flair = null);
		if (e.flair && !e.sprites.flair) {
			if (e == tagpro.players[tagpro.playerId] && GM_getValue('flairX') && parseInt(GM_getValue('flairX'))!=-1){
				var isMe = true;
				var checked = GM_getValue('spinChecked') || 0;
				if (checked == 1){
					e.flair.description = "Level 4 Donor";
				}
				var rand = GM_getValue('random') || 0;
				e.flair.x = parseInt(GM_getValue('flairX'));
				e.flair.y = parseInt(GM_getValue('flairY'));
				if (rand){
					e.flair.x = getRandomInt(0, 10);
					e.flair.y = getRandomInt(0, 7);
				}
			} else {
				var isMe = false;
			} 
			var n = "flair" + e.flair.x + "," + e.flair.y,
				 q, e.sprites.flair.pivot.x = 8, e.sprites.flair.pivot.y = 8, e.sprites.flair.x = 20, e.sprites.flair.y = -9, e.sprites.info.addChild(e.sprites.flair), e.sprites.flair.flairName = e.flair, e.sprites.rotation = 0, e.rotateFlairSpeed = 0
		}
		if (e.sprites.flair && e.flair.description === "Level 4 Donor") {
			e.lastFrame || (e.lastFrame = {
				"s-captures": 0,
				"s-tags": 0
			});
			if (e.lastFrame["s-captures"] !== e["s-captures"] || e.lastFrame["s-tags"] !== e["s-tags"]) e.tween = new Tween(.4, -0.38, 4e3, "quadOut"), e.rotateFlairSpeed = e.tween.getValue();
			e.rotateFlairSpeed > .02 && (e.rotateFlairSpeed = e.tween.getValue()), e.rotateFlairSpeed = Math.max(.02, e.rotateFlairSpeed), e.sprites.flair.rotation += e.rotateFlairSpeed, e.lastFrame["s-captures"] = e["s-captures"], e.lastFrame["s-tags"] = e["s-tags"]
		}!e.flair && e.sprites.flair && e.sprites.info.removeChild(e.sprites.flair)
	}
});