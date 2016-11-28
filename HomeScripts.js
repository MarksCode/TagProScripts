// ==UserScript==
// @name         HomeScripts
// @version      0.1
// @description  Show popular scripts on homepage
// @author       Capernicus
// @include      http://tagpro-*.koalabeast.com*
// ==/UserScript==

function showScripts() {
	$('#homeScripts').toggle();
}

window.onload = function(){
    if (document.getElementsByClassName('video-container')[0]){
        var targetDiv = document.getElementsByClassName('video-container')[0];
        var scriptDiv = document.createElement('div');
        var scriptButton = document.createElement('li');
        var scriptButtonText = document.createElement('a');
        $(scriptButtonText).attr('href', '#').html('Userscripts').appendTo(scriptButton);
        $('#nav-maps').after(scriptButton);
        scriptButtonText.onclick = showScripts;
        var $scriptDiv = $(scriptDiv);
        $scriptDiv.css({'position':'absolute','top':'0','left':'0','background-color':'#2b2b2b','height':'100%','width':'100%','display':'flex', 'flex-flow':'column'}).attr('id','homeScripts').addClass('server').hide().appendTo(targetDiv);
        var scriptCss = document.createElement('style');
        $("<style type='text/css'> .userscriptList{margin-top: 10px} </style>").appendTo("head");


        var scriptHeading = document.createElement('h2');
        scriptHeading.className = 'header-title';
        scriptHeading.innerHTML = 'Popular Add-Ons';
        scriptDiv.appendChild(scriptHeading);

        var scriptBody = document.createElement('div'); 
        $(scriptBody).css({'flex': '1 1 auto','overflow-y':'scroll','text-align':'left', 'padding-left':'20px'}).appendTo(scriptDiv)
        .html("<div>&middot; <a href='https://chrome.google.com/webstore/detail/tagproreplays/ejbnakhldlocljfcglmeibhhdnmmcodh?hl=en'>TagPro Replays</a></div>\
            <div class='userscriptList'>&middot; <a href='https://chrome.google.com/webstore/detail/tagprofriends/ndkecjpjikaianfigpldfelgpblgjhmj?hl=en'>TagPro Friends</a></div>\
            <div class='userscriptList'>&middot; <a href='https://chrome.google.com/webstore/detail/tagpro-chat-enhancer/bffcbhifhdeaaialpegkdakkfjalofom;'>Chat Enhancer</a></div>\
            <div class='userscriptList'>&middot; <a href='https://www.reddit.com/r/TagPro/comments/2rpbl2/userscripts_for_v3_check_inside_for_many_updates/'>Ball Spin</a></div>\
            <div class='userscriptList'>&middot; <a href='https://www.reddit.com/r/TagPro/comments/2tkr42/userscript_update_tagpro_scoreboard_enhancer/'>Scoreboard Enhancer</a></div>\
            <div class='userscriptList'>&middot; <a href='https://www.reddit.com/r/MLTP/comments/40tzor/try_out_the_live_player_position_script_for_a/'>Live Player Position</a></div>\
            <div style='font-size:12px; font-style:italic; margin-top:10px;'>(Use <a href='http://www.tampermonkey.net' target='_blank'>TamperMonkey</a> to install Userscripts)</div>");
    }
};
