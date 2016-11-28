// ==UserScript==
// @name          AnyFlairs+
// @author        Capernicus
// @version       2.0
// @include       http://*.koalabeast.com:*
// @include       http://tagpro-*.koalabeast.com*
// @grant         GM_setValue
// @grant         GM_getValue
// ==/UserScript==
(function () {
var initApp = function(){
	var config = {
		    apiKey: "AIzaSyB2J4-6vWuYGgkoBgAf2i75hfLzcl3RiYI",
		    authDomain: "flairs-4ef9c.firebaseapp.com",
		    databaseURL: "https://flairs-4ef9c.firebaseio.com"
		};
		firebase.initializeApp(config);
		firebase.database().ref('flairs').once('value', function(snap){
			if (snap.val()){
				GM_setValue('allCustomFlairs', snap.val());
				allFlairs = snap.val();
				makeAllUsers();
			}
		});
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {                            
				$('#flairsLoginDiv').remove();
				$('#flairsInfoTextDiv').remove();
				makeContent();
				firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value', function(snap){
					if (snap.val()){
						GM_setValue('myTPName', snap.val());
					}
				});
				
			} else {					
				getLogin();                              
			}
		});
};

var selected;
var curFlairSheet;
var numSheets = 4;
var isMenuBuilt = false;
var isContentBuilt = false;
var allFlairs;

var showMenu = function(){
	$('#FlairMenu').show();
};

var homeButton = function(){											// Creates and inserts home button
	var button = document.createElement('li');
	$(button).html("<a style='color: #B10DC9' href='#'>FLAIRS</a>").attr('id', 'FlairButton').insertAfter('#nav-maps');
};

var getLogin = function(){
	$("<style type='text/css'> .login-submit,.login>h1{font-weight:700;text-align:center}#flairsInfoTextDiv,.login{position:absolute;left:50%}.login{top:50%;transform:translate(-50%,-50%);padding:10px 5px;width:90%;background:#1d2a4d;background-clip:padding-box;border:1px solid #172b4e;border-bottom-color:#142647;border-radius:20px;background-image:radial-gradient(cover,#437dd6,#3960a6);box-shadow:inset 0 5px rgba(255,255,255,.3),inset 0 0 5px 5px rgba(255,255,255,.1),0 5px 20px rgba(0,0,0,.5)}.login>h1{margin-bottom:30px;font-size:25px;color:#fff;text-shadow:0 -1px rgba(0,0,0,.4)}.login-input{margin:0 auto 20px;display:block;width:70%;height:37px;padding:0 9px;color:#fff;text-shadow:0 1px #000;background:#2b3e5d;border:1px solid #15243b;border-top-color:#0d1827;border-radius:4px;background-image:linear-gradient(to bottom,rgba(0,0,0,.35),rgba(0,0,0,.2) 20%,rgba(0,0,0,0));box-shadow:inset 0 1px 2px rgba(0,0,0,.3),0 1px rgba(255,255,255,.2)}.login-input:focus{outline:0;background-color:#32486d;box-shadow:inset 0 1px 2px rgba(0,0,0,.3),0 0 4px 1px rgba(255,255,255,.6)}.login-input:hover,.login-submit:hover{outline:0;background:#3cb0fd;background-image:linear-gradient(to bottom,#3cb0fd,#3498db)}.login-submit{margin:0 auto 15px;display:block;width:50%;height:37px;font-size:14px;color:#294779;text-shadow:0 1px rgba(255,255,255,.3);background:#adcbfa;background-clip:padding-box;border:1px solid #284473;border-bottom-color:#223b66;border-radius:4px;cursor:pointer;background-image:linear-gradient(to bottom,#d0e1fe,#96b8ed);box-shadow:inset 0 1px rgba(255,255,255,.5),inset 0 0 7px rgba(255,255,255,.4),0 1px 1px rgba(0,0,0,.15)}.login-submit:active{background:#a4c2f3;box-shadow:inset 0 1px 5px rgba(0,0,0,.4),0 1px rgba(255,255,255,.1)}#flairsInfoButt{border-radius:20%;position:absolute;top:10px;left:10px;color:black;}#flairsInfoTextDiv{top:50%;transform:translateX(-50%);width:90%;word-wrap:break-word;z-index:10000;background:#2b2b2b;padding:10px;border:2px solid #8BC34A;}#flairsInfoTextDiv>p{color:#8BC34A;} </style>").appendTo("head");
	
	var loginDiv = document.createElement('div');
	var emailText = document.createElement('input');
	var passText = document.createElement('input');
	var signUp = document.createElement('button');
	var signIn = document.createElement('button');
	var prompt = document.createElement('h1');

	var infoButt = document.createElement('button');
	var infoDiv = document.createElement('div');
	var infoText = document.createElement('p');
	infoDiv.id = 'infoDiv';

	$(infoText).attr('id', 'infoText').text("The email you enter doesn't have to be a real email, just formatted as one. \
		Your password is fully confidential, keep it to yourself. \
		If you forgot your email, message /u/StraightZlat.").appendTo(infoDiv);
	$(infoDiv).attr('id','flairsInfoTextDiv').appendTo(document.getElementById('FlairMenu')).hide();
	$(infoButt).attr('id', 'flairsInfoButt').html('?').hover(function(){
		$(infoDiv).fadeIn(300);
	}, function(){
		$(infoDiv).fadeOut(200);
	});

	emailText.id = 'flairsLoginEmail';
	loginDiv.id = 'flairsLoginDiv';
	passText.id = 'flairsLoginPass';
	emailText.placeholder = 'email';
	passText.placeholder = 'password';
	$(emailText).addClass('login-input');
	$(passText).addClass('login-input');
	$(prompt).text('AnyFlairs Login/Signup');
	$(signUp).bind('click', handleSignUp).html('Sign up').addClass('login-submit');
	$(signIn).bind('click', toggleSignIn).html('Log in').addClass('login-submit');
	$(loginDiv).addClass('login').css('z-index', 500).append(prompt, emailText, passText, signUp, signIn, infoButt).appendTo(document.getElementById('FlairMenu'));
};

/**
 *  handleSignUp
 */
var handleSignUp = function(){
	var re = /tagpro-(.*)\.koala/;
	if (document.getElementById('profile-btn')){                               // If user is logged in, get their name from profile page
		$.get('http://tagpro-'+re.exec(document.URL)[1]+'.koalabeast.com'+$('#profile-btn').attr('href'), function(err,response,data){ 
			myTpName = $(data.responseText).find('.profile-name').text().trim(); // Extract name from profile page html
			firebase.database().ref('flairs/'+myTpName).once('value', function(snap){
				if (snap.val()){
					alert('Account with that TagPro name already exists');
				} else {
					var email = document.getElementById('flairsLoginEmail').value;
					var pass = document.getElementById('flairsLoginPass').value;
					firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(){
						GM_setValue('myTPName', myTpName);
						var obj = {};
						obj[firebase.auth().currentUser.uid] = myTpName;
						firebase.database().ref('users').update(obj, function(){
							var obj2 = {};
							var flairObj = {};
							flairObj['x'] = -1;
							flairObj['y'] = -1;
							flairObj['z'] = 1;
							obj2[myTpName] = flairObj;
							firebase.database().ref('flairs').update(obj2);
						});
					}).catch(function(error) {
						var errorCode = error.code;
						var errorMessage = error.message;
						if (errorCode == 'auth/weak-password') {
							alert('The password is too weak.');
						} else {
							alert(errorMessage);
						}
					});
				}
			});
		});
	} else {
		alert('Please log in to TagPro account to start using AnyFlairs');
	}
};


/**
 *  toggleSignIn
 *  Tries to sign in user using inputted login credentials.
 */
var toggleSignIn = function(){
	if (firebase.auth().currentUser) {
	  firebase.auth().signOut();
	} else {
		var email = document.getElementById('flairsLoginEmail').value;
		var pass = document.getElementById('flairsLoginPass').value;

		firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong password.');
			} else {
				alert(errorMessage);
			}
	  });
	}
};

var buildMenu = function(){
	if (!isMenuBuilt){
		isMenuBuilt = true;
		var menu = document.createElement('div');
		var exit = document.createElement('button');				// Hides menu button
		$(exit).html('X').click(hideMenu).css({
			'border':'solid 1px black',
			'float':'right',
			'border-radius':'100%',
			'background-color':'#c2c2d6',
			'color':'black',
			'z-index':'99999'
		}).hover(function(){
			$(this).css({
				'background-color':'#33334d'
			})
		}, function(){
			$(this).css({
				'background-color':'#c2c2d6'
			})
		});
		$(menu).css({
			'height':'310px',
			'width':'400px',
			'position':'absolute',
			'border-radius':'5%',
			'border':'3px solid black',
			'left':'50%',
			'transform':'translate(-50%, 0)',
			'top':'10em',
			'zIndex':'30',
			'background': 'linear-gradient(#263150, #303B58)',
			'display':'none',
			'box-shadow':'0px 0px 1px 5000px rgba(0,0,0,0.8)'
		}).attr('id', 'FlairMenu').append(exit).appendTo(document.body);
		makePrefs();
	}
};	

var makeContent = function(){
	if (!isContentBuilt){
		isContentBuilt = true;
		$("<style type='text/css'> #flairTable td:hover {cursor: pointer; background: rgba(0,0,0,0.5)} #flairsAllUsersDiv p{margin-top:0; margin-bottom:0; padding-bottom:8px;padding-top:8px;} #flairsAllUsersDiv p:nth-child(even){background: rgba(0,0,0,0.2)}</style>").appendTo("head");
		var flairSheet = GM_getValue('sheet') || 1;
		var prefButton = document.createElement('button');
		$(prefButton).text(String.fromCharCode(9881)).css({
			'position':'absolute',
			'border':'0',
			'width':'40px',
			'height':'40px',
			'background-color':'transparent',
			'bottom':'3px',
			'left':'20px',
			'font-size':'150%',
			'text-align':'center',
		}).bind('click', showPrefs);
		var nextPage = document.createElement('button');
		$(nextPage).text('>').css({
			'position':'absolute',
			'bottom':'5px',
			'left':'180px',
			'background':'rgba(0,0,0,0.1)',
			'color':'#C0C0C0'
		}).attr('id', 'next').bind('click', nextSheet);
		var lastPage = document.createElement('button');
		$(lastPage).text('<').css({
			'position':'absolute',
			'bottom':'5px',
			'right':'220px',
			'background':'rgba(0,0,0,0.1)',
			'color':'#C0C0C0'
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
		});
		
		var flairTable = document.createElement('table');
		$(flairTable).attr('id', 'flairTable').html("<tr><td x='0' y='0'></td><td x='1' y='0'></td><td x='2' y='0'></td><td x='3' y='0'></td><td x='4' y='0'></td><td x='5' y='0'></td><td x='6' y='0'></td><td x='7' y='0'></td><td x='8' y='0'></td><td x='9' y='0'></td><td x='10' y='0'></td></tr><!-- --><tr><td x='0' y='1'></td><td x='1' y='1'></td><td x='2' y='1'></td><td x='3' y='1'></td><td x='4' y='1'></td><td x='5' y='1'></td><td x='6' y='1'></td><td x='7' y='1'></td><td x='8' y='1'></td><td x='9' y='1'></td><td x='10' y='1'></td></tr><!-- --><tr><td x='0' y='2'></td><td x='1' y='2'></td><td x='2' y='2'></td><td x='3' y='2'></td><td x='4' y='2'></td><td x='5' y='2'></td><td x='6' y='2'></td><td x='7' y='2'></td><td x='8' y='2'></td><td x='9' y='2'></td><td x='10' y='2'></td></tr><!-- --><tr><td x='0' y='3'></td><td x='1' y='3'></td><td x='2' y='3'></td><td x='3' y='3'></td><td x='4' y='3'></td><td x='5' y='3'></td><td x='6' y='3'></td><td x='7' y='3'></td><td x='8' y='3'></td><td x='9' y='3'></td><td x='10' y='3'></td></tr><!-- --><tr><td x='0' y='4'></td><td x='1' y='4'></td><td x='2' y='4'></td><td x='3' y='4'></td><td x='4' y='4'></td><td x='5' y='4'></td><td x='6' y='4'></td><td x='7' y='4'></td><td x='8' y='4'></td><td x='9' y='4'></td><td x='10' y='4'></td></tr><!-- --><tr><td x='0' y='5'></td><td x='1' y='5'></td><td x='2' y='5'></td><td x='3' y='5'></td><td x='4' y='5'></td><td x='5' y='5'></td><td x='6' y='5'></td><td x='7' y='5'></td><td x='8' y='5'></td><td x='9' y='5'></td><td x='10' y='5'></td></tr><!-- --><tr><td x='0' y='6'></td><td x='1' y='6'></td><td x='2' y='6'></td><td x='3' y='6'></td><td x='4' y='6'></td><td x='5' y='6'></td><td x='6' y='6'></td><td x='7' y='6'></td><td x='8' y='6'></td><td x='9' y='6'></td><td x='10' y='6'></td></tr><!-- --><tr><td x='0' y='7'></td><td x='1' y='7'></td><td x='2' y='7'></td><td x='3' y='7'></td><td x='4' y='7'></td><td x='5' y='7'></td><td x='6' y='7'></td><td x='7' y='7'></td><td x='8' y='7'></td><td x='9' y='7'></td><td x='10' y='7'></td></tr>").css({
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
			'bottom':'3px',
			'color':'black'
		}).html('Select None').hover(function(){
			$(this).css({
				'background-color':'#33334d'
			})
		}, function(){
			$(this).css({
				'background-color':'#c2c2d6'
			})
		}).bind('click', unSelectFlair);
		var allUsersButton = document.createElement('button');
		$(allUsersButton).attr('id', 'flairsAllUsers').html('☰').css({'position': 'absolute','bottom':'3px','left':'80px','padding': '2px 6px','border-radius': '5px','color': 'black','font-size': '20px','text-decoration': 'none', 'background-color':'#B8B5C8'});
		$('#FlairMenu').append(flairs, flairTable, noneButton, prefButton, nextPage, lastPage, allUsersButton);
		highlightFlair();
		if (flairSheet == 1){
			$('#last').prop('disabled', true);
		}
		if (flairSheet == numSheets){
			$('#next').prop('disabled', true);
		}
		$(allUsersButton).hover(function(){
			$('#flairsAllUsersDiv').show();
		});
		var flairsHelpDiv = document.createElement('div');
		var flairsHelpButton = document.createElement('button');
		var flairsHelpText = document.createElement('p');
		$(flairsHelpText).text('For you and others to see your custom flair you need to be using the name in your AnyFlairs setting page and have a flair selected in your TagPro profile.').css('color','#8BC34A');
		$(flairsHelpDiv).append(flairsHelpText).attr('id','flairsHelpDiv').css({'position':'absolute','left':'50%','top':'50%','transform':'translate(-50%,-50%)','width':'70%','word-wrap':'break-word','background':'#2b2b2b','padding':'10px','border':'2px solid #8BC34A'}).hide().appendTo('#FlairMenu');
		$(flairsHelpButton).html('?').hover(function(){
			$(flairsHelpDiv).show();
		}, function(){
			$(flairsHelpDiv).hide();
		}).css({'background-color': 'rgb(194, 194, 214)','border-radius':'100%', 'padding-left':'8px', 'padding-right':'8px', 'float':'left', 'color':'black'}).appendTo('#FlairMenu');
	}
};

var makeAllUsers = function(){
	var flairsAllUsersDiv = document.createElement('div');
	var flairsAllUsersHeading = document.createElement('div');
	var flairsAllUsersContent = document.createElement('div');
	var flairsAllUsersPrompt = document.createElement('h3');
	$(flairsAllUsersPrompt).text('All Users').appendTo(flairsAllUsersHeading).css({'position':'absolute','left':'50%','top':'50%','transform':'translate(-50%,-50%)'});
	$(flairsAllUsersHeading).css({'width':'100%','height':'15%','background':'rgba(0,0,0,0.3)','border-radius':'20px 20px 0 0','position':'relative'});
	$(flairsAllUsersContent).css({'width':'100%', 'height':'80%','overflow':'scroll','border-radius':'0 0 20px 20px'});
	for (user in allFlairs){
		$('<p/>', {
			'text': user
		}).appendTo(flairsAllUsersContent);
	}
	$(flairsAllUsersDiv).attr('id', 'flairsAllUsersDiv').append(flairsAllUsersHeading, flairsAllUsersContent).css({'position':'absolute','left':'50%','transform':'translate(-50%, 0)','top':'10em', 'width':'200px', 'height':'310px','text-align':'center','display':'none','background-color':'#2a69aa', 'z-index':'9999', 'border-radius':'20px'}).bind('mouseleave', function(){$(this).hide()}).appendTo(document.body);
	$('#flairsAllUsers').hover(function(){
		$(flairsAllUsersDiv).show();
	});
}

var getCurSheet = function(num){
	var sheetNum = num || parseInt(GM_getValue('sheet', 1));
	switch (sheetNum) {
		case 1:
			return 'http://i.imgur.com/VrM6iyQ.png';
		case 2:
			return 'http://i.imgur.com/oIRhzdp.png';
		case 3:
			return 'http://i.imgur.com/LizcLru.png';
		case 4:
			return 'http://i.imgur.com/lbYMWdF.png';
		default:
			return 'http://static.koalabeast.com/images/flair.png';
	} ;
};

var showPrefs = function(){
	$('#prefMenu').html("<div id='prefsContent'><div id='prefsAccountInfo'><h3 id='prefsAccountPrompt'>Account Info</h3><p id='prefsNamePrompt'>Name: </p><p id='prefsNameText'></p><br><p id='prefsEmailPrompt'>Email:</p><p id='prefsEmailText'></p><br><p id='spinFlairText'>Spin Flair?</p><input id='spinFlairButt' type='checkbox'></input><button id='prefsSignOut'>Sign out</button></div></div>").show();
	var exit = document.createElement('button');				// Hides menu button
	$(exit).html('X').click(hidePrefs).css({
		'border':'solid 2px black',
		'position':'absolute',
		'top':'1px',
		'right':'1px',
		'border-radius':'80%',
		'background-color':'#a2a2b6',
		'color':'black',
		'z-index':'10000'
	}).hover(function(){
		$(this).css({
			'background-color':'#33334d'
		})
	}, function(){
		$(this).css({
			'background-color':'#a2a2b6'
		})
	}).appendTo(document.getElementById('prefMenu'));
	firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value', function(snap){
		if (snap.val()){
			firebase.database().ref('flairs/'+snap.val()).once('value', function(snapshot){
				if (snapshot.val()){
					if (snapshot.val()['s']){
						$('#spinFlairButt').prop('checked', true);
					}
				}
			});
			$('#prefsNameText').text(snap.val());
			$('#spinFlairButt').change(function() {
		        if($(this).is(":checked")) {
		        	firebase.database().ref('flairs/'+snap.val()).once('value', function(snapshot){
		        		if (snapshot.val()){
		        			var obj = {};
		        			obj['x'] = snapshot.val()['x'];
		        			obj['y'] = snapshot.val()['y'];
		        			obj['z'] = snapshot.val()['z'];
		        			obj['s'] = 1;
		        			firebase.database().ref('flairs/'+snap.val()).update(obj);
		        		}
		        	});
		        } else {
		        	firebase.database().ref('flairs/'+snap.val()).once('value', function(snapshot){
		        		if (snapshot.val()){
		        			var obj = {};
		        			obj['x'] = snapshot.val()['x'];
		        			obj['y'] = snapshot.val()['y'];
		        			obj['z'] = snapshot.val()['z'];
		        			obj['s'] = 0;
		        			firebase.database().ref('flairs/'+snap.val()).update(obj);
		        		}
		        	});
		        }
		    });
		}
	});
	$('#prefsEmailText').text(firebase.auth().currentUser['email']);
	$('#prefsSignOut').bind('click', signOut);
};

var makePrefs = function(){
	$("<style type='text/css'> .flairSelec{ border:2px solid #FFD700;}#prefsContent{position:relative;height:100%;width:100%;background-color:#263150;border-radius:5%}#prefsAccountInfo{background:rgba(255,255,255,0.05);top:10%;left:5%;height:80%;width:90%;border:2px solid #202A31;border-radius:5%;text-align:center;position:relative}#prefsAccountPrompt{width:100%;left:20%;margin-top:15px;padding-bottom:10px;margin-bottom:0}#prefsNamePrompt,#prefsEmailPrompt,#spinFlairText{display:inline-block;position:absolute;left:15%;}#spinFlairButt, #spinFlairText{position: absolute;top: 60%; display:inline-block; left: 30%} #prefsNameText,#prefsEmailText{position:absolute;display:inline-block;color:#ff0;left:35%;}#spinFlairButt{left: 60%; top: 70%} #prefsEmailText, #prefsEmailPrompt{top:40%;}#prefsSignOut{font:menu;position:absolute;color:#000;border-radius:50px;bottom: 5%;transform:translateX(-50%)} </style>").appendTo("head");
	var menu = document.createElement('div');
	$(menu).css({
		'height':'310px',
		'width':'400px',
		'position':'absolute',
		'border-radius':'5%',
		'border':'2px solid black',
		'left':'50%',
		'top':'50%',
		'transform':'translate(-50%, -50%)',
		'zIndex':'30',
		'background': 'linear-gradient(to bottom, #304352 , #817e7a)',
		'display':'none'
	}).attr('id', 'prefMenu');
	$('#FlairMenu').append(menu);
};

var hidePrefs = function(){
	$('#prefMenu').hide();
};

var nextSheet = function(){
	var sheet = parseInt(GM_getValue('sheet', 1));
	sheet +=1;
	if (sheet == numSheets){
		$("#next").prop('disabled', true);
	}
	$("#last").prop('disabled', false);
	GM_setValue('sheet', sheet);
	$('#flairs').attr('src', getCurSheet());
	highlightFlair();
};

var prevSheet = function(){
	var sheet = parseInt(GM_getValue('sheet', 1));
	sheet -=1;
	if (sheet == 1){
		$("#last").prop('disabled', true);
	}
	$("#next").prop('disabled', false);
	GM_setValue('sheet', sheet);
	$('#flairs').attr('src', getCurSheet());
	highlightFlair();
};

var flairPressed = function(){
	var pressed = $(this);
	var x = pressed.attr('x');
	var y = pressed.attr('y');
	var myName = GM_getValue('myTPName') || '';
	var flairObj = {};
	flairObj['x'] = parseInt(x);
	flairObj['y'] = parseInt(y);
	flairObj['z'] = flairSheetNum();

	firebase.database().ref('flairs/'+myName).update(flairObj, function(){
		firebase.database().ref('flairs').once('value', function(snap){
			if (snap.val()){
				GM_setValue('allCustomFlairs', snap.val());
			}
		})
	});
    GM_setValue('flairX',x);
    GM_setValue('flairY',y);
	GM_setValue('flairZ', flairSheetNum());
	$(selected).removeClass('flairSelec');
	selected = this;
	pressed.addClass('flairSelec');
};

var highlightFlair = function(){
	if (flairSheetNum() == GM_getValue('flairZ', 0)){
		var fx = GM_getValue('flairX') || -1;
		var fy = GM_getValue('flairY') || -1;
		selected = $("#flairTable td[x='" + fx +"']").filter("td[y='" + fy +"']");
		selected.addClass('flairSelec');
	} else {
		$('#flairTable td').removeClass('flairSelec');
	}
};

var flairSheetNum = function(){
	switch (document.getElementById('flairs').src) {
		case 'http://i.imgur.com/VrM6iyQ.png':
			return 1;
		case 'http://i.imgur.com/oIRhzdp.png':
			return 2;
		case 'http://i.imgur.com/LizcLru.png':
			return 3;
		case 'http://i.imgur.com/lbYMWdF.png':
			return 4;
		default:
			return 1;
	}
}

var hideMenu = function(){
	firebase.database().ref('flairs').once('value', function(snap){
		if (snap.val()){
			GM_setValue('allCustomFlairs', snap.val());
		}
	});
	$('#FlairMenu').hide();
};

var unSelectFlair = function(){
	GM_setValue('flairX', -1);
	$(selected).removeClass('flairSelec');
	var myName = GM_getValue('myTPName') || '';
	var flairObj = {};
	flairObj['x'] = -1;
	flairObj['y'] = -1;
	flairObj['z'] = 1;
	firebase.database().ref('flairs/'+myName).update(flairObj);
};

var signOut = function(){
	firebase.auth().signOut();
	$('#FlairMenu').hide();
	$('#prefMenu').empty().hide();
};

var re = /tagpro-\w+\.koalabeast.com\/(maps|boards|groups|\?[\w=]*|games\/find(\?r=\d*)?)?\/?\w*\#?$/;
if (re.exec(document.URL)){										// User is on homePage
	var s1 = document.createElement('script');
	s1.src = 'http://yourjavascript.com/26148811117/fb.js';
	document.getElementsByTagName('head')[0].appendChild(s1);
	s1.onload = function(){
			initApp();	
	}
	homeButton(); 												// Insert button
	buildMenu();
	$('#FlairButton').bind('click', showMenu);
	$("<style type='text/css'> .flairSelec{ border:2px solid #FFD700;} </style>").appendTo("head");
} else {
	var flairs = GM_getValue('allCustomFlairs');
	tagpro.ready(function() { 
		var img1 = $($('#flair').get(0)).clone();
		var img2 = $($('#flair').get(0)).clone();
		var img3 = $($('#flair').get(0)).clone();
		var img4 = $($('#flair').get(0)).clone();
		var a1 = img1.get(0);
		var b1 = img2.get(0);
		var c1 = img3.get(0);
		var d1 = img4.get(0);
		a1.src = 'http://i.imgur.com/VrM6iyQ.png';
		b1.src = 'http://i.imgur.com/oIRhzdp.png';
		c1.src = 'http://i.imgur.com/LizcLru.png';
		d1.src = 'http://i.imgur.com/lbYMWdF.png';
		a1.crossOrigin = "Anonymous";
		b1.crossOrigin = "Anonymous";
		c1.crossOrigin = "Anonymous";
		d1.crossOrigin = "Anonymous";
	   	    
		tagpro.renderer.getFlairTexture = function(e, t, z) {
			switch (z) {
				case 1:
					var b = a1;
					break;
				case 2:
					var b = b1;
					break;
				case 3:
					var b = c1;
					break;
				case 4:
					var b = d1;
					break;
				default:
					var b = $('#flair').get(0);
					break;
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
				if (e.name in flairs && flairs[e.name]['x'] != -1){
					e.flair.x = flairs[e.name]['x'];
					e.flair.y = flairs[e.name]['y'];
					var n = "flair" + e.flair.x + "," + e.flair.y;
					var sheet = flairs[e.name]['z'];
					if (flairs[e.name]['s']) e.flair.description = "Level 4 Donor";
				} else {
					var n = "flair" + e.flair.x + "," + e.flair.y;
					var sheet = 0;
				}
					r = tagpro.renderer.getFlairTexture(n, e.flair, sheet);
				e.sprites.flair = new PIXI.Sprite(r), e.sprites.flair.pivot.x = 8, e.sprites.flair.pivot.y = 8, e.sprites.flair.x = 20, e.sprites.flair.y = -9, e.sprites.info.addChild(e.sprites.flair), e.sprites.flair.flairName = e.flair, e.sprites.rotation = 0, e.rotateFlairSpeed = 0
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
};

})();