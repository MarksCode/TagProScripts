var addHomeButton = function (){
   var button = document.createElement('li');
   $(button).html("<a style='color:#33cc33' href='#'>FRIENDS</a>").attr('id', 'FriendsButton').bind('click', showMenu).insertAfter('#nav-maps');
};

var showMenu = function(){
   var menu = document.createElement('div');
   menu.id = 'FriendMenu';
   var exit = document.createElement('button');
   $(exit).attr('id', 'exitButton').html('X').bind('click', hideMenu).addClass('butt');
   var headingDiv = document.createElement('div');
   $('<h4/>', {
      text: 'TagPro Friends',
      id: 'friendsHeading',
      }).appendTo(headingDiv);
   $(headingDiv).attr('id', 'headingDiv').append(exit);
   $(menu).append(headingDiv);
   $('body').append(menu);
   initDB();
   getInfo();
};

var getInfo = function(){
   $.when(getName()).then(function(args){
      if ($.isEmptyObject(args)){
         enterName();
      } else {
         getFriends(args);
      }
   });
};

var getFriends = function(args){
   var name = args['name'];
   firebase.database().ref('/users/' + name).once('value').then(function(snapshot) {
      makeFriends(snapshot.val());
   });
};

var makeFriends = function(data){
   var friendsDiv = document.createElement('div');
   friendsDiv.id = 'friendsDiv';
   var friendsList = document.createElement('div');
   var friendsHeadDiv = document.createElement('div');
   friendsHeadDiv.id = 'friendsHeadingDiv';
   var friendsText = document.createElement('h2');
   $(friendsText).text('FRIENDS').attr('id', 'friendsText');
   $(friendsHeadDiv).append(friendsText);
   friendsList.id = 'friendsList';
   var friends = data['friends'];
   $(friendsDiv).append(friendsHeadDiv, friendsList); // Friends Div
   var addFriendDiv = document.createElement('div');
   addFriendDiv.id = 'addFriendDiv';
   var friendPrompt = document.createElement('h3');
   $(friendPrompt).text('add friend').css('transform', 'translateY(40%)');
   var addFriendHeader = document.createElement('div');
   $(addFriendHeader).attr('id', 'addFriendHeaderDiv').append(friendPrompt);
   var friendText = document.createElement('input');
   friendText.id = 'addFriendText';
   var friendButt = document.createElement('button');
   $(friendButt).html('+').addClass('butt').attr('id', 'addFriendButton').bind('click', requestFriend);
   var addFriendContent = document.createElement('div');
   $(addFriendContent).attr('id', 'addFriendContentDiv').append(friendButt, friendText);
   var spacerDiv = document.createElement('div');
   spacerDiv.id = 'clearDiv';
   $(addFriendDiv).append(addFriendHeader, addFriendContent);
   if (friends === 'none'){
      $('<p/>', {
         addClass: 'friendItem',
         text: 'Add some friends!'
      }).appendTo(friendsList);
   } else {
      for (friend in friends){
         $('<p/>', {
            addClass: 'friendItem',
            text: friend
         }).appendTo(friendsList);
      }
   }
   $('#FriendMenu').append(friendsDiv, spacerDiv, addFriendDiv);
   getChat();
   makeRequests(data['requests']);
};

var getChat = function(){
   makeChat();
};

var makeChat = function(){
   var chatDiv = document.createElement('div');
   var chatHead = document.createElement('div');
   chatHead.id = 'chatHeadDiv';
   var chatHeadText = document.createElement('h2');
   $(chatHeadText).text('CHAT').attr('id', 'chatHeadText').appendTo(chatHead);
   var chatContent = document.createElement('div');
   chatContent.id = 'chatContentDiv';
   var chatFooter = document.createElement('div');
   chatFooter.id = 'chatFooter';
   $(chatDiv).attr('id', 'chatDiv').append(chatHead, chatContent, chatFooter).insertAfter('#friendsDiv');
};

var makeRequests = function(requests){
   var requestsList = document.createElement('div');
   var requestHead = document.createElement('div');
   requestHead.id = 'requestHeadDiv';
   requestsList.id = 'requestsList';
   var requestDiv = document.createElement('div');
   var requestPrompt = document.createElement('h3');
   $(requestPrompt).text('friend requests').css('transform', 'translateY(40%)').appendTo(requestHead);
   
   if (requests === 'none'){
      
   } else {
      for (request in requests){
         var reqDiv = document.createElement('div');
         $('<h4/>', {
            text: request
         }).addClass('inlineItem').appendTo(reqDiv);
         var acceptButt = document.createElement('button');
         $(acceptButt).html('✓').addClass('butt inlineItem').attr('id', request).bind('click', acceptFriend).css('float', 'right');
         var declineButt = document.createElement('button');
         $(declineButt).html('X').addClass('butt inlineItem').attr('id', request).bind('click', denyFriend).css('float', 'right');
         $(reqDiv).append(acceptButt, declineButt);
         $(requestsList).append(reqDiv);
      }
   }
   $(requestDiv).attr('id', 'requestDiv').append(requestHead, requestsList).insertAfter('#addFriendDiv');
};

var acceptFriend = function(){
   
};

var denyFriend = function(){
   
};

var enterName = function(){
   var nameDiv = document.createElement('div');
   nameDiv.id = 'nameDiv';
   var prompt = document.createElement('h1');
   $(prompt).text('Enter your TagPro name').attr('id','namePrompt');
   var nameField = document.createElement('input');
   $(nameField).attr({'id':'nameField', 'type':'text'});
   var nameButton = document.createElement('button');
   $(nameButton).attr('id', 'nameButton').html('Start').bind('click', setName).addClass('butt');
   $(nameDiv).append(prompt, nameField, nameButton);
   $('#FriendMenu').append(nameDiv);
};

var getName = function(){
   var p = $.Deferred();
   chrome.storage.local.get('name', function(data){
      p.resolve(data);
   });
   return p.promise();
};

var requestFriend = function(){
   var reqName = $('#addFriendText').val();
   if (reqName.length > 0 && reqName.length < 13){
      $.when(getName()).then(function(args){
         var name = args['name'];
         var obj = {};
         obj[name] = true;
         firebase.database().ref('/users/' + reqName + '/requests').update(obj).then(function(){
            console.log('db updated');
         });
      });
   }
};

var setName = function(){
   var name = $('#nameField').val();
   if (name.length > 0 && name.length < 13){
      chrome.storage.local.set({'name':name}, function(){
         chrome.storage.local.set({'nameSet':1}, function(){
            console.log('name set.');
            var dbRef = firebase.database().ref('users');
            var obj = {};
            obj[name] = {'friends':'none', 'requests':'none'};
            dbRef.update(obj).then(function(){
               console.log('db updated');
               $('#nameDiv').remove();
               getInfo();
            });
         });
      });
   }
};

var hideMenu = function(){
   chrome.storage.local.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) {
         console.error(error);
      }
   });
};

var initDB = function(){
   var config = {
      apiKey: "AIzaSyAmQEhN7xnI49dZzup3jwvUc0B6SB-OH3w",
      databaseURL: "https://tagprofriends.firebaseio.com"
   };
   firebase.initializeApp(config);
};


addHomeButton();
