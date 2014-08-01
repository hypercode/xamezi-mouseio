
/*
 * JQUERY MULTITRANSITION GALLERY SLIDERS COLLECTION v2.01
 * http://codecanyon.net/item/jquery-ken-burns-fullscreen-gallery-slideshow/1356059
 */

(function($) {

	$.fn.multiGallery = function(settings, ap_settings) {
	
	var componentInited= false;
	var _self = this;
	
	var _body = $('body');
	var _window = $(window);
	var _doc = $(document);
	
	var _downEvent = "";
	var _moveEvent = "";
	var _upEvent = "";
	var hasTouch;
	var thumbTouchOn=true, menuTouchOn=true;
	if("ontouchstart" in window) {
		hasTouch = true;
		_downEvent = "touchstart.ap";
		_moveEvent = "touchmove.ap";
		_upEvent = "touchend.ap";
	}else{
		hasTouch = false;
		_downEvent = "mousedown.ap";
		_moveEvent = "mousemove.ap";
		_upEvent = "mouseup.ap";
	}
	
	var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));//recheck
	//isMobile=true;
	
	var ipadOrientation=Math.abs(window.orientation) == 90 ? 'landscape' : 'portrait';
	//console.log(ipadOrientation);
	window.onorientationchange = detectOrientation;
	function detectOrientation(){
		if(typeof window.onorientationchange != 'undefined'){
			if ( orientation == 0 ) {
				ipadOrientation='portrait';
				//Do Something In Portrait Mode
			}
			else if ( orientation == 90 ) {
				ipadOrientation='landscape';
				 //Do Something In Landscape Mode
				 //alert('Landscape 90 The screen is turned to the left.');
			}
			else if ( orientation == -90 ) {
				ipadOrientation='landscape';
				 //Do Something In Landscape Mode
				 //alert('Landscape -90 The screen is turned to the right.');
			}
			else if ( orientation == 180 ) {
				ipadOrientation='portrait';
				 //Do Something In Portrait Mode
				 //alert('Portrait 180 Upside down portrait.');
			}
			//alert(window.orientation);
		}
	}
	
	var html5Support=(!!document.createElement('video').canPlayType);
	
	//icons
	var ic_pause = 'media/data/gallery_icons/pause.png';
	var ic_pause_on = 'media/data/gallery_icons/pause_on.png';
	
	var ic_plus = 'media/data/gallery_icons/plus.png';
	var ic_plus_on = 'media/data/gallery_icons/plus_on.png';
	
	var ic_minus = 'media/data/gallery_icons/minus.png';
	var ic_minus_on = 'media/data/gallery_icons/minus_on.png';
	
	var ic_prev = 'media/data/gallery_icons/prev.png';
	var ic_prev_on = 'media/data/gallery_icons/prev_on.png';
	
	var ic_play = 'media/data/gallery_icons/play.png';
	var ic_play_on = 'media/data/gallery_icons/play_on.png';
	
	var ic_next = 'media/data/gallery_icons/next.png';
	var ic_next_on = 'media/data/gallery_icons/next_on.png';
	
	var ic_info = 'media/data/gallery_icons/info.png';
	var ic_info_on = 'media/data/gallery_icons/info_on.png';
	
	var ic_link = 'media/data/gallery_icons/link.png';
	var ic_link_on = 'media/data/gallery_icons/link_on.png';
	
	var ic_music = 'media/data/audio_icons/music.png';
	var ic_music_on = 'media/data/audio_icons/music_on.png';
	
	var ic_fullscreen_enter = 'media/data/gallery_icons/fullscreen_enter.png';
	var ic_fullscreen_enter_on = 'media/data/gallery_icons/fullscreen_enter_on.png';
	var ic_fullscreen_exit = 'media/data/gallery_icons/fullscreen_exit.png';
	var ic_fullscreen_exit_on = 'media/data/gallery_icons/fullscreen_exit_on.png';
	
	
	//settings
	var playlistIndex=settings.playlistIndex;
	var fixMenu=settings.fixMenu;
	if(fixMenu){
		var fixMenuSide = settings.fixMenuSettings.side;
		var fixMenuValue = settings.fixMenuSettings.value;
	} 
	var fixThumbs=settings.fixThumbs;
	if(fixThumbs){
		var fixThumbsSide = settings.fixThumbsSettings.side;
		var fixThumbsValue = settings.fixThumbsSettings.value;
	} 
	var disableRightClick = settings.disableRightClick;
	var componentFixedSize=settings.componentFixedSize;
	var playlistPosition = settings.playlistPosition;
	var thumbOrientation=settings.thumbOrientation;
	var menuOrientation=settings.menuOrientation;
	var maxDescriptionWidth=settings.maxDescriptionWidth;
	var autoOpenPlaylist = settings.autoOpenPlaylist;
	var slideshowOn = settings.slideshowOn;
	var origSlideshowDelay = settings.slideshowDelay, slideshowDelay;
	var useGlobalDelay = settings.useGlobalDelay;
	var menuItemOffOpacity=settings.menuItemOffOpacity;
	var thumbOffOpacity = settings.thumbOffOpacity;
	var playlistHidden=settings.playlistHidden;
	var _randomPlay = settings.randomPlay;
	var slideshowAdvancesToNextCategory = settings.slideshowAdvancesToNextCategory;	
	var forceImageFitMode=settings.forceImageFitMode;//force fit even if image smaller
	var visibleThumbs = settings.visibleThumbs;
	var thumbBtnSpace =settings.thumbBtnSpace;
	var visibleMenuItems = settings.visibleMenuItems;
	var menuBtnSpace =settings.menuBtnSpace;
	var autoOpenDescription=settings.autoOpenDescription;
	var useVideo = settings.useVideo;
	var useAudio = settings.useAudio;
	var pauseSlideshowOnHover = settings.pauseSlideshowOnHover;
	var autoAdjustPlaylist = settings.autoAdjustPlaylist;
	
	
	
	
	
	//elements
	var componentWrapper = $(settings.componentHolder);
	
	//show preloader
	var componentPreloader=componentWrapper.find('.componentPreloader');
	showPreloader();
	
	var slide_timer = componentWrapper.find('.slide_timer');
	
	var thumbWrapper = componentWrapper.find('.thumbWrapper');
	var componentHolder = componentWrapper.find('.componentHolder');
	var componentPlaylist = componentWrapper.find('.componentPlaylist');
	var thumbHolder = componentWrapper.find('.thumbHolder');
	var menuHolder = componentWrapper.find('.menuHolder');
	var menuWrapper = componentWrapper.find('.menuWrapper');
	//holders for transitions		
	var _holder1 = componentWrapper.find('.mediaHolder1').attr('data-title', '_holder1').css('zIndex', 0).bind("dragstart", function(e) { e.preventDefault(); return false; }).bind("selectstart", function(e) { e.preventDefault(); return false; }).touchSwipe(swipeHandler, true); 
	var _holder2 = componentWrapper.find('.mediaHolder2').attr('data-title', '_holder2').css('zIndex', 1).bind("dragstart", function(e) { e.preventDefault(); return false; }).bind("selectstart", function(e) { e.preventDefault(); return false; }).touchSwipe(swipeHandler, true); 
	//playlist controls
	var prevThumbBtn = componentWrapper.find('.prevThumbBtn').css({display: 'none', cursor: 'pointer'}).attr('data-id', 'prevThumbBtn').bind(_downEvent, togglePlaylistControls);
	var nextThumbBtn = componentWrapper.find('.nextThumbBtn').css({display: 'none', cursor: 'pointer'}).attr('data-id', 'nextThumbBtn').bind(_downEvent, togglePlaylistControls);
	
	var caption_holder = componentWrapper.find('.caption_holder');
	
	//************video player
	
	if(useVideo){
	
		var videoPlayerHolder = $(settings.playerHolder);
		var videoTransitionOn=false;//prevent multiple clicking on video toggle btn to open video player and the lightbox close
		var _videoPlayer, videoPlayerOpened=false;
		var slideshowForcePause=false;//stop slideshow (if running) while video player is opened
		var playerBgOpacity = settings.playerBgOpacity;
		var player_bg = componentWrapper.find('.player_bg').css('display', 'none').bind(_downEvent, function(){
			if(!componentInited) return false;
			if(categoryTransitionOn)return false;
			if(videoTransitionOn) return false;
			videoTransitionOn=true;
			toggleVideoPlayer('off');
			return false;	
		});
		var player_bigPlay = componentWrapper.find('.player_bigPlay').css({display: 'none', cursor: 'pointer'}).bind('click', function(){
			if(!componentInited) return false;
			if(categoryTransitionOn)return false;
			if(videoTransitionOn) return false;
			if(!navigationActive) return false;
			videoTransitionOn=true;
			if(slideshowOn){
				slideshowForcePause=true;
				kb_videoRequestPause=true;
				toggleSlideshow2(false);
			}
			toggleVideoPlayer('on');
			return false;	
		});
		
		function toggleVideoBtn(dir){
			if(dir=='on'){
				player_bigPlay.css({opacity: 0,display: 'block'}).stop().animate({ 'opacity': 1},  {duration: 1000, easing: 'easeOutSine'});
			}else{//off
				player_bigPlay.stop().animate({ 'opacity':0},  {duration: 500, easing: 'easeOutSine', complete:function(){
					player_bigPlay.css('display','none');
				}});
			}
		}
		
		function toggleVideoPlayer(dir, instant){
			var toggle_time=500;
			if(typeof instant !== 'undefined')toggle_time=0;
			//console.log('toggleVideoPlayer: ', dir);
			if(dir=='on'){
				player_bg.stop().css({opacity: 0,display: 'block'}).animate({ 'opacity':playerBgOpacity},  {duration: toggle_time, easing: 'easeOutSine'});
				if(html5Support){
					videoPlayerHolder.stop().css({opacity: 0,display: 'block'}).animate({ 'opacity':1},  {duration: toggle_time, easing: 'easeOutSine', complete:function(){
						videoTransitionOn=false;
					}});
				}else{
					//ie8 and below causing problems if we hide the player with display none!
					videoPlayerHolder.stop().css({opacity: 0,display: 'block', left:50+'%'}).animate({ 'opacity':1},  {duration: toggle_time, easing: 'easeOutSine', complete:function(){
						videoTransitionOn=false;
					}});
				} 
				
				if(_videoPlayer)_videoPlayer._findMedia(videoType, videoLink);//init video immediatelly
				videoPlayerOpened=true;
				
				//check audio 
				if(useAudio && audioPlayerHolder.getMediaPlaying()){
					audioPlayerHolder.pauseAudio();
					audioForcePause=true;
				}
				
			}else{//off
				if(_videoPlayer)_videoPlayer._cleanMedia();
				player_bg.stop().animate({ 'opacity':0},  {duration: toggle_time, easing: 'easeOutSine', complete:function(){
					player_bg.css('display','none');
				}});
				videoPlayerHolder.stop().animate({ 'opacity':0},  {duration: toggle_time, easing: 'easeOutSine', complete:function(){
					if(html5Support){
						videoPlayerHolder.css('display','none');
					}else{
						videoPlayerHolder.css('left',-10000+'px');//ie8 and below causing problems if we hide the player with display none!
					}
					videoTransitionOn=false;
					videoPlayerOpened=false;
					
					if(slideshowForcePause){
						slideshowForcePause=false;
						toggleSlideshow2(true);
					}
					
					//check audio 
					if(useAudio && audioForcePause){
						audioForcePause=false;
						audioPlayerHolder.playAudio();
					}
					
				}});
			}
		}
	
	}else{
		$(settings.playerHolder).remove();
		componentWrapper.find('.player_bg').remove();
	}
	
	//****************
	
	if(useAudio){
		var music_toggle = componentWrapper.find('.music_toggle').css('cursor', 'pointer').bind(_downEvent, clickControls);
		if(!isMobile)music_toggle.bind('mouseover', overControls).bind('mouseout', outControls);
		var audioOpened=false, audioIntroHappened=false;
		var audioForcePause=false;
		var audioPlayerHolder = $(ap_settings.playerHolder).html5audio(ap_settings);
		music_toggle.css({opacity: 0, display: 'block'}).stop().animate({ 'opacity': 1},  {duration: 1000, easing: 'easeOutSine'});
	}else{
		if(ap_settings){
			$(ap_settings.playerHolder).remove();
			$(ap_settings.playlistHolder).remove();
		}
		componentWrapper.find('.music_toggle').remove();
	}
	
	//****************** fullscreen
	
	var fullscreenPossible = false;
	if(checkFullScreenSupport() && componentWrapper.find('.gallery_fullscreen').length){
		fullscreenPossible = true;
		var componentSize='normal';
		var gallery_fullscreen = componentWrapper.find('.gallery_fullscreen').css('cursor', 'pointer').bind('click', clickControls);
		if(!isMobile) gallery_fullscreen.bind('mouseover', overControls).bind('mouseout', outControls);
	}else{
		componentWrapper.find('.gallery_fullscreen').remove();
	}
	
	function setFullscreenIcon(){
		 if ((document.fullScreenElement && document.fullScreenElement !== null) ||   
			  (!document.mozFullScreen && !document.webkitIsFullScreen)) { 
			  componentSize="normal";
			    gallery_fullscreen.find('img').attr('src', ic_fullscreen_enter); 
		  }else{
			  componentSize= "fullscreen";
			   gallery_fullscreen.find('img').attr('src', ic_fullscreen_exit);
		  }
	}
	
	function fullScreenStatus(){
		return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen;
	}
	
	if(fullscreenPossible){
		_doc.on("fullscreenchange mozfullscreenchange webkitfullscreenchange", function(){
			setFullscreenIcon();
		});
	}
	
	function toggleFullscreen(){
			
		//http://stackoverflow.com/questions/8427413/webkitrequestfullscreen-fails-when-passing-element-allow-keyboard-input-in-safar
		//https://github.com/martinaglv/jQuery-FullScreen/blob/master/fullscreen/jquery.fullscreen.js#L82
					
		if(fullscreenPossible || html5Support){
	   
		  if ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method
			  (!document.mozFullScreen && !document.webkitIsFullScreen)) {               // current working methods
			if (document.documentElement.requestFullScreen) {
			  document.documentElement.requestFullScreen();
			} else if (document.documentElement.mozRequestFullScreen) {
			  document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullScreen) {
			  //document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			  document.documentElement.webkitRequestFullScreen();
			}else{
				//console.log('no fullscreen');
			}
		  } else {
			if (document.cancelFullScreen) {
			  document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {
			  document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
			  document.webkitCancelFullScreen();
			}
		  }
		}
	}
	
	function checkFullScreenSupport() {
	   var support=false;
		if (document.documentElement.requestFullScreen) {
		  support=true;
		} else if (document.documentElement.mozRequestFullScreen) {
		   support=true;
		} else if (document.documentElement.webkitRequestFullScreen) {
		   support=true;
		}
		return support;
	}
	
	//*****************
	
	//vars
	var maxVisibleThumbs = false;
	if(visibleThumbs == 'max') {
		maxVisibleThumbs = true;
		fixThumbs=false;
	}
	
	var _thumbClick=false;//if random play, on thumb click set counter to cliked thumb
	
	var dataArr = thumbWrapper.children('div[class=playlist]');//category data
	var categoryLength = dataArr.size();
	var singleCategory = false;
	if(categoryLength==1) singleCategory = true;
	
	var slideContentDataArr=[],activeSlideContent;//captions
	var categoryDataArr=[];//data per category
	var currentData;//data per category
	
	var _playlistLength;
	var playlistOpened=false;
	
	var kb_currentHolder, kb_prop, kb_startTime, kb_passedTime, kb_crossFadeTime = 500, kb_introHappened=false, kb_introHappened2=false, kb_videoRequestPause=false;//properies for pause/resume tween
	var _kenBurnsPositions = ['tl','tc','tr','ml','mc','mr','bl','bc','br'];
	var kbEndPosition;//var for resize math in ken burns window resize if transition off
	var kenBurnsTransitionOn=false;//allow media change while ken burns executes
	
	var _slideCaseArr = [ "top", "left", "bottom", "right" ];
	var _slideCase;
	
	var _revealCaseArr = [ "top", "left", "bottom", "right" ];
	var _revealCase;
	
	var _splitCaseArr = ['horizontalUpLeft' , 'horizontalUpRight', 'horizontalSplit', "verticalUpLeft", "verticalDownLeft", "verticalSplit"];
	var _splitCase;
	
	var _firstImageTime = 500;
	var _firstImageEase = 'easeOutSine';
	
	var _counter=-1;
	var categoryTransitionOn=false;
	
	var slideshowTimeoutID; 
	
	var windowResizeTimeout = 100;//execute resize delay
	var windowResizeTimeoutID;
	
	var loadRequestInterval = 100;//request new load while one is performing
	var loadRequestIntervalID; 
	var _mediaLoadOn=false;
	var loadRequestPause=false;//prevent queue load for request load
	
	var transitionEase;//image transition settings
	var transitionTime;
	var transitionOn=false;//image transition on
	var lastActivePlaylistItem = null;//thumb disabling 
	var playlistItemArr=[];//holds playlist items
	
	var linkExist=false;
	var _link;
	var _target;
	
	//create holders for loaded media
	var mediaObj = {};
	var obj;
	var mainArr;
	var categoryTitleArr=[];
	var i = 0;
	for(i; i < categoryLength; i++){
		obj = {};
		mainArr = [];
		obj.mainLoaded=false;
		obj.main=mainArr;
		mediaObj[i] = obj;
		categoryTitleArr[i] = $(dataArr[i]).attr('data-title');
	}
	//console.log(categoryTitleArr);
	
	var _allMediaLoaded=false;
	var _randomArr = [];
	var navigationActive=false;
	var transitionIntroHappened = false;//first image loaded in category
	var makeImageClickableForUrl=false;
	var _transitionType;	
	var imageFitMode=false;
	var componentBgColor;
	
	
	var thumbSpacing;
	var thumbWidth;
	var thumbHeight;
	var currentlyVisiblePlaylistItems;
	var thumbBtnBuffer = 50 + 2 * thumbBtnSpace;
	var thumbHolderSize;
	var minVisibleThumbs=1;
	var playlistCounter=0;
	
	var stuffInited=false;
	
	//menu vars
	var menuSize=0;//defined only once
	var minVisibleMenuItems = 1;//we will hardcode this and start from there up. Displaying menu without that wouldnt be possible anyway.
	var currentlyVisibleMenuItems=0;
	var menuSpacing;
	var maxVisibleMenuItems = false;
	if(visibleMenuItems == 'max') {
		maxVisibleMenuItems = true;
		fixMenu=false;
	}
	var menuCounter = 0;
	var menuTransitionOn=false;
	var menuItemArr=[];
	var menuItemSizeArr = [];//save sizes
	var menuItemPositionArr = [];//save positions
	var menuBtnBuffer = 50 + 2 * menuBtnSpace;
	var prevMenuBtn;
	var nextMenuBtn;
	var menuHolderSize=0;
	var maxMenuItemWidth = 0;
	var maxMenuItemHeight = 0;
	var startItem;//menu counter for left dir addition
	var lastActiveMenuItem = null;//menu disabling 
	
	//************************* SLIDESHOW CONTROLS, INFO, DESCRIPTION ***********************//
	
	if(componentWrapper.find('.slideshow_controls').length){
		var slideshow_controls = componentWrapper.find('.slideshow_controls');
		var controls_prev = slideshow_controls.find('.controls_prev').css('cursor', 'pointer').bind(_downEvent, clickControls);
		var controls_toggle = slideshow_controls.find('.controls_toggle').css('cursor', 'pointer').bind(_downEvent, clickControls);
		var controls_next = slideshow_controls.find('.controls_next').css('cursor', 'pointer').bind(_downEvent, clickControls);
		if(!isMobile){
			controls_prev.bind('mouseover', overControls).bind('mouseout', outControls);
			controls_toggle.bind('mouseover', overControls).bind('mouseout', outControls);
			controls_next.bind('mouseover', overControls).bind('mouseout', outControls);
		}
		if(slideshowOn) controls_toggle.children('img').attr('src', ic_pause);
		//fade in controls
		slideshow_controls.css({opacity: 0, display: 'block'}).stop().animate({ 'opacity': 1},  {duration: 1000, easing: 'easeOutSine'});
	}
	
	
	//INFO
	var useDescription = false;
	if(componentWrapper.find('.info_holder').length>0){
		useDescription = true;
		var data_controls = componentWrapper.find('.data_controls');
		var infoOpened=false;
		var infoExist=false;
		var infoData;
		var info_toggle = componentWrapper.find('.info_toggle').css('cursor', 'pointer').bind(_downEvent, clickControls);
		if(!isMobile)info_toggle.bind('mouseover', overControls).bind('mouseout', outControls);
		var infoHolder = componentWrapper.find('.info_holder');
	}else{
		componentWrapper.find('.info_toggle').remove();
		componentWrapper.find('.info_holder').remove();
	}
	
	//LINK
	var link_toggle = componentWrapper.find('.link_toggle').css('cursor', 'pointer').bind(_downEvent, clickControls);
	if(!isMobile)link_toggle.bind('mouseover', overControls).bind('mouseout', outControls);
	
	//PLAYLIST TOGGLE
	if(playlistIndex == 'inside'){
		var playlist_toggle = componentWrapper.find('.playlist_toggle').css('cursor', 'pointer').bind(_downEvent, clickControls).css({opacity:0, display: 'block'}).stop().animate({ 'opacity': 1},  {duration: 1000, easing: 'easeOutSine'});
		if(!isMobile)playlist_toggle.bind('mouseover', overControls).bind('mouseout', outControls);
	}else{
		componentWrapper.find('.playlist_toggle').remove();
	}
	
	//media holders need to be below these elements
	if(componentPlaylist)componentPlaylist.css('zIndex',10);
	if(data_controls)data_controls.css('zIndex',11);
	if(slideshow_controls)slideshow_controls.css('zIndex',12);
	if(infoHolder)infoHolder.css('zIndex',13);
	if(componentPreloader)componentPreloader.css('zIndex',14);
	if(useAudio){
		music_toggle.css('zIndex',15);
		audioPlayerHolder.css('zIndex',16);
	}
	if(slide_timer.length){
		slide_timer.css({opacity: 0.5, 'zIndex':17});
	}
	if(gallery_fullscreen)gallery_fullscreen.css('zIndex',18);
	if(useVideo){
		player_bigPlay.css('zIndex',28);
		player_bg.css('zIndex',29);
		videoPlayerHolder.css('zIndex',30);
	}
	
	
	//*************
	
	if(pauseSlideshowOnHover){
		componentWrapper.mouseenter(function(){       
			//console.log("enter");
			if(slideshowOn){
				slideshowForcePause=true;	
				toggleSlideshow2(false);
			} 
			return false;
		 }).mouseleave(function(){
			if(slideshowForcePause && !videoPlayerOpened){
				slideshowForcePause=false;
				toggleSlideshow2(true);
			}
			return false;
		 });
	}
	
	
	//**********************
	
	function initThumbTouch(){
		var startX,
			startY,
			touchStartX,
			touchStartY,
			moved,
			moving = false;

		thumbWrapper.unbind('touchstart.ap touchmove.ap touchend.ap click.ap-touchclick').bind(
			'touchstart.ap',
			function(e){
				if(!componentInited || categoryTransitionOn) return false;
				if(categoryTransitionOn) return false;
				if(!thumbTouchOn){//if touch disabled we want click executed
					return true;
				}
				var touch = e.originalEvent.touches[0];
				startX = thumbWrapper.position().left;
				startY = thumbWrapper.position().top;
				touchStartX = touch.pageX;
				touchStartY = touch.pageY;
				moved = false;
				moving = true;
			}
		).bind(
			'touchmove.ap',
			function(ev){
				if(!moving){
					return;
				}
				var touchPos = ev.originalEvent.touches[0];
				if(thumbOrientation =='horizontal'){
					var value = startX - touchStartX + touchPos.pageX, w = thumbHolderSize, thumbWrapperSize = thumbWrapper.width();
					//toggle advance buttons
					if(value > 0){
						value=0;	
						togglePrevThumbBtn('off');
						//adjust playlist counter
						playlistCounter=0;//start
					}else{
						togglePrevThumbBtn('on');
						playlistCounter = Math.abs(Math.floor(value / (thumbWidth+thumbSpacing)));///middle
					}
					if(value < w- thumbWrapperSize){
						value=w- thumbWrapperSize;	
						toggleNextThumbBtn('off');
						playlistCounter = _playlistLength - currentlyVisiblePlaylistItems;//end
					}else{
						toggleNextThumbBtn('on');
						playlistCounter = Math.abs(Math.floor(value / (thumbWidth+thumbSpacing)));///middle
					}
					thumbWrapper.css('left',value+'px');
				}else{
					var value=startY - touchStartY + touchPos.pageY, h = thumbHolderSize, thumbWrapperSize = thumbWrapper.height();
					
					//toggle advance buttons
					if(value > 0){
						value=0;	
						togglePrevThumbBtn('off');
						//adjust playlist counter
						playlistCounter=0;//start
					}else{
						togglePrevThumbBtn('on');
						playlistCounter = Math.abs(Math.floor(value / (thumbWidth+thumbSpacing)));///middle
					}
					if(value < h- thumbWrapperSize){
						value=h- thumbWrapperSize;	
						toggleNextThumbBtn('off');
						playlistCounter = _playlistLength - currentlyVisiblePlaylistItems;//end
					}else{
						toggleNextThumbBtn('on');
						playlistCounter = Math.abs(Math.floor(value / (thumbWidth+thumbSpacing)));///middle
					}
					thumbWrapper.css('top',value+'px');
				}
				moved = moved || Math.abs(touchStartX - touchPos.pageX) > 5 || Math.abs(touchStartY - touchPos.pageY) > 5;
				
				return false;
			}
		).bind(
			'touchend.ap',
			function(e){
				moving = false;
			}
		).bind(
			'click.ap-touchclick',
			function(e){
				if(moved) {
					moved = false;
					return false;
				}
			}
		);
	}
	
	function findMenuCounter(value){//find menu counter for touch menu 
		var i = 0, v, v2;
		for(i;i<categoryLength;i++){
			if(i < categoryLength-2){
				v = menuItemPositionArr[i];
				v2 = menuItemPositionArr[i+1];
				if(value>=v && value<=v2){
					menuCounter=i;
					break;
				}
			}else if(i == categoryLength-1){//last item
				v = menuItemPositionArr[i];
				if(value>=v){
					menuCounter=i;
					break;
				}
			}
		}
	}
	
	function initMenuTouch(){
		var startX,
			startY,
			touchStartX,
			touchStartY,
			moved,
			moving = false;

		menuWrapper.unbind('touchstart.ap touchmove.ap touchend.ap click.ap-touchclick').bind(
			'touchstart.ap',
			function(e){
				if(!componentInited || categoryTransitionOn) return false;
				if(menuTransitionOn) return false;
				if(!menuTouchOn){//if touch disabled we want click executed
					return true;
				}
				var touch = e.originalEvent.touches[0];
				startX = menuWrapper.position().left;
				startY = menuWrapper.position().top;
				touchStartX = touch.pageX;
				touchStartY = touch.pageY;
				moved = false;
				moving = true;
			}
		).bind(
			'touchmove.ap',
			function(ev){
				if(!moving){
					return;
				}
				var touchPos = ev.originalEvent.touches[0];
				if(thumbOrientation =='horizontal'){
					var value = startX - touchStartX + touchPos.pageX, w = menuHolderSize, menuWrapperSize = menuWrapper.width();
					//toggle advance buttons
					if(value > 0){
						value=0;	
						togglePrevMenuBtn('off');
					}else{
						togglePrevMenuBtn('on');
					}
					if(value < w- menuWrapperSize){
						value=w- menuWrapperSize;	
						toggleNextMenuBtn('off');
					}else{
						toggleNextMenuBtn('on');
					}
					findMenuCounter(Math.abs(value));//adjust playlist counter
					menuWrapper.css('left',value+'px');
				}else{
					var value=startY - touchStartY + touchPos.pageY, h = menuHolderSize, menuWrapperSize = menuWrapper.height();
					
					//toggle advance buttons
					if(value > 0){
						value=0;	
						togglePrevMenuBtn('off');
					}else{
						togglePrevMenuBtn('on');
					}
					if(value < h- menuWrapperSize){
						value=h- menuWrapperSize;	
						toggleNextMenuBtn('off');
					}else{
						toggleNextMenuBtn('on');
					}
					findMenuCounter(Math.abs(value));//adjust playlist counter
					menuWrapper.css('top',value+'px');
				}
				moved = moved || Math.abs(touchStartX - touchPos.pageX) > 5 || Math.abs(touchStartY - touchPos.pageY) > 5;
				
				return false;
			}
		).bind(
			'touchend.ap',
			function(e){
				moving = false;
			}
		).bind(
			'click.ap-touchclick',
			function(e){
				if(moved) {
					moved = false;
					return false;
				}
			}
		);
	}
	
	if(hasTouch){
		if(menuHolder.length)initMenuTouch();
		if(componentPlaylist.length && !playlistHidden)initThumbTouch();
	}
	
	
	
	
	
	
	//************* swf address
	
	var categoryArr=[];
	var deepLink;
	var _addressSet=false;
	var _swfAddressInited=false;
	var swfAddressTimeout=500;
	var swfAddressTimeoutID;
	var _externalChangeEvent;
	var useDeeplink=settings.useDeeplink;
	var startUrl=settings.startUrl;
	var activeCategory;
	var currentCategory;
	var activeItem;
	var transitionFinishInterval=100;
	var transitionFinishIntervalID;
	
	//get data for deeplink
	var i = 0, j, tempArr, category, len, obj, imgs, img, src, n, n2, str_to_filter;
	for(i; i < categoryLength;i++){
		category = $(dataArr[i]);
		j = 0;
		tempArr=[];
		obj = {};
		
		str_to_filter = filterAllowedChars( category.attr('data-address'));
		obj.categoryName = str_to_filter;//get category names
		//console.log(str_to_filter);
		obj.mediaName=tempArr;
		categoryArr.push(obj);
		
		imgs = category.find('ul li');
		len = imgs.length;
		for(j; j < len;j++){//get media names
			img = $(imgs[j]);
			src = img.attr('data-address');
			str_to_filter = filterAllowedChars(src);
			tempArr.push(str_to_filter);
		}
	}
	
	//*********** swfaddress handling
	
	/*
	http://www.asual.com/jquery/address/docs/
				
	internalChange is called when we set value ourselves; 
	externalChange is called when the URL is changed or the browser backward or forward button is pressed. 
	
	I don't want to an AJAX request if there are no query parameters in the URL, which is why I test for an empty object.
	if($.isEmptyObject(event.parameters))
	return;
	  
	jQuery.address.strict(false);//Note that you need to disable plugin's strict option, otherwise it would add slash symbol immediately after hash symbol, like this: #/11.
	*/
	
	function filterAllowedChars(str) {
		var allowedChars = "_-";
		var n = str.length;
		var returnStr = "";
		var i = 0;
		var _char;
		var z;
		for (i; i < n; i++) {
			_char = str.charAt(i).toLowerCase(); //convert to lowercase
			if (_char == "\\") _char = "/";
			z = getCharCode(_char);			
			if ((z >= getCharCode("a") && z <= getCharCode("z")) || (z >= getCharCode("0") && z <= getCharCode("9")) || allowedChars.indexOf(_char) >= 0) {
				//only accepted characters (this will remove the spaces as well)
				returnStr += _char;
			}
		}
		return returnStr;
	}
	
	function getCharCode(s) {
		return s.charCodeAt(0);
	}
	
	//************** video player

	if(useVideo){

		videoPlayerHolder.videoGallery({	
			mg_gallery: _self,
			mg_settings: settings,
			wrapper: componentWrapper,
			videoGallerySetupDone:function() {
				//console.log('videoGallerySetupDone');
				_videoPlayer = this;
				
				if(useDeeplink){
					//console.log($.address.strict());
					//$.address.strict(false);
					//$.address.init(initAddress);
					$.address.internalChange(internalChange);
					$.address.externalChange(externalChange);
				}else{
					activeCategory = settings.activeCategory;
					cleanCategory();	
				}
			}
		});	
	
	}else{
		if(useDeeplink){
			//console.log($.address.strict());
			//$.address.strict(false);
			//$.address.init(initAddress);
			$.address.internalChange(internalChange);
			$.address.externalChange(externalChange);
		}else{
			activeCategory = settings.activeCategory;
			cleanCategory();	
		}
	}
	
	function initAddress(e) {
		e.stopPropagation();
		//console.log("init: ", e.value);
	}
	
	function transitionFinishHandler() {
		if(!transitionOn){//when module transition finishes
			if(transitionFinishIntervalID) clearInterval(transitionFinishIntervalID);
			if(swfAddressTimeoutID) clearTimeout(swfAddressTimeoutID);
			onChange(_externalChangeEvent);
		}
	}
	
	function swfAddressTimeoutHandler() {
		//timeout if user repeatedly pressing back/forward browser buttons to stop default action executing immediatelly
		if(swfAddressTimeoutID) clearTimeout(swfAddressTimeoutID);
		onChange(_externalChangeEvent);
	}
	
	function internalChange(e) {
		e.stopPropagation();
		//console.log("internalChange: ", e.value);
		onChange(e);
	}
	
	function externalChange(e) {
		e.stopPropagation();
		//console.log("externalChange: ", e.value);
		_externalChangeEvent = e;
		
		if(!transitionOn){
			if(!_swfAddressInited){
				//on the beginning onExternalChange fires first, then onInternalChange immediatelly, so skip onExternalChange call

				if(e.value == "/"){
					//console.log('strict mode off, skip /');
					
					_addressSet=true;
					$.address.history(false);//skip the "/"
					
					$.address.value(startUrl);
					if(!$.address.history()) $.address.history(true);//restore history
					
				}else if(isEmpty(e.value)){
					//console.log('strict mode on');
					
					_addressSet=true;
					$.address.history(false);//skip the ""
					
					$.address.value(startUrl);
					if(!$.address.history()) $.address.history(true);//restore history

				}else{
					//other deeplink start
					//console.log('other deeplink start');
					
					onChange(e);
				}
				
				return;
			}
			if(swfAddressTimeoutID) clearTimeout(swfAddressTimeoutID);
			swfAddressTimeoutID = setTimeout(swfAddressTimeoutHandler, swfAddressTimeout);
		}else{
			if(swfAddressTimeoutID) clearTimeout(swfAddressTimeoutID);
			//wait for transition finish
			if(transitionFinishIntervalID) clearInterval(transitionFinishIntervalID);
			if(_transitionType != 'KEN_BURNS'){
				transitionFinishIntervalID = setInterval(transitionFinishHandler, transitionFinishInterval);
			}else{
				onChange(_externalChangeEvent);
			}
		}
	}
	
	function onChange(e) {
		e.stopPropagation();
		//console.log("onChange: ", e.value);
		
		stopSlideshowTimer();
		if(loadRequestIntervalID) clearInterval(loadRequestIntervalID);
		
		if(!_swfAddressInited){
			_swfAddressInited = true;
		}
		
		deepLink = e.value;
		if(deepLink.charAt(0) == "/") deepLink = deepLink.substring(1)//check if first character is slash
		if(deepLink.charAt(deepLink.length - 1) == "/") deepLink = deepLink.substring(0, deepLink.length - 1)//check if last character is slash
		//console.log("onChange after trim: ", deepLink);

		if(!findAddress(deepLink)){
			//console.log('404');
			$.address.history(false);//skip invalid url
			return false;
		}

		//check for category change
		if(currentCategory == undefined || currentCategory != activeCategory){
			cleanCategory();
		}
		
		//console.log('console.log(_getCounter(), activeItem); = ', getCounter(), activeItem);
		if(getCounter() != activeItem){
			_counter=activeItem;
			//console.log('1a.......');
			checkMedia(getCounter());
		}else{
			//console.log('2a.......');
			disableActivePlaylistItem();
			callTransition();
		}
	}
	
	function findAddress(value){
		//console.log('findAddress');
		
		//var currentURL = window.location.href;
		//console.log(currentURL);
		
		var arr = value.split('/');
		//console.log(arr);
		var category_name=arr[0],media_name=arr[1],categoryFound=false,nameFound=false,i = 0;
		if(arr.length==1){
			activeItem = 0;
			nameFound=true;
		} 
		
		for(i; i < categoryLength;i++){
			if(categoryArr[i].categoryName == category_name){
				//console.log('activeCategory = ', i, ' , category_name = ', category_name);
				activeCategory = i;
				categoryFound=true;
				break;	
			}
		}
		if(!categoryFound) return false;
	
		if(!nameFound){
			i = 0, arr = categoryArr[activeCategory].mediaName;
			var len = arr.length;
			for(i; i < len;i++){
				if(arr[i] == media_name){
					//console.log('activeItem = ', i, ' , media_name = ', media_name);
					activeItem = i;
					nameFound=true;
					break;	
				}
			}
		}
		
		if(!categoryFound || !nameFound){
			return false;
		}else{
			return true;	
		}
	}
	
	function findCounterByName(value){
		var found=false, i = 0, arr = categoryArr[activeCategory].mediaName, len = arr.length;
		for(i; i < len;i++){
			if(arr[i] == value){
				//console.log(i, value);
				activeItem = i;
				found=true;
				break;	
			}
		}
		if(!found){
			return false;
		}else{
			return true;	
		}
	}
	
	function findCategoryByName(value){
		var found=false, i = 0;
		for(i; i < categoryLength;i++){
			if(categoryArr[i].categoryName == value){
				//console.log(i, value);
				activeCategory = i;
				found=true;
				break;	
			}
		}
		if(!found){
			return false;
		}else{
			return true;	
		}
	}
	
	function findAddress2(i){//return media name with requested counter
		//console.log('findAddress2');
		var arr = categoryArr[activeCategory].mediaName;
		return categoryArr[activeCategory].categoryName+'/'+arr[i];
	}
	
	//************************* PLAYLIST *************************//
	
	function getThumbHolderSize(){
		//console.log('getThumbHolderSize');
		var compare_size, maxLeft;
		//console.log(compare_size);
		if(thumbOrientation=='horizontal'){
			compare_size = autoAdjustPlaylist ? getComponentSize('w') : thumbHolder.width();
			compare_size+=thumbSpacing;
			if(autoAdjustPlaylist){
				currentlyVisiblePlaylistItems = Math.floor((compare_size - thumbBtnBuffer) / (thumbWidth + thumbSpacing));
			}else{
				currentlyVisiblePlaylistItems = Math.floor((compare_size) / (thumbWidth + thumbSpacing));
			}
			if(!maxVisibleThumbs && currentlyVisiblePlaylistItems > visibleThumbs) currentlyVisiblePlaylistItems = visibleThumbs;
			else if(currentlyVisiblePlaylistItems > _playlistLength) currentlyVisiblePlaylistItems = _playlistLength;
			else if(currentlyVisiblePlaylistItems < minVisibleThumbs) currentlyVisiblePlaylistItems = minVisibleThumbs;
			//console.log('currentlyVisiblePlaylistItems=', currentlyVisiblePlaylistItems);
			thumbHolderSize = currentlyVisiblePlaylistItems*thumbWidth + (currentlyVisiblePlaylistItems-1)*thumbSpacing;
			//console.log('thumbHolderSize=', thumbHolderSize);
			if(autoAdjustPlaylist)thumbHolder.css('width', thumbHolderSize+ 'px');//set new size
			
			//restrain thumbWrapper position (triggered on drag window right)
			maxLeft= -(_playlistLength*thumbWidth + (_playlistLength-1)*thumbSpacing) + thumbHolderSize;
			if(parseInt(thumbWrapper.css('left'), 10) < maxLeft){
				//console.log('maxLeft=', maxLeft);
				//thumbWrapper.css('left', maxLeft+'px');
			}
			
		}else{//vertical
			compare_size = autoAdjustPlaylist ? getComponentSize('h') : thumbHolder.height();
			compare_size+=thumbSpacing;
			if(autoAdjustPlaylist){
				currentlyVisiblePlaylistItems = Math.floor((compare_size - thumbBtnBuffer) / (thumbHeight + thumbSpacing));
			}else{
				currentlyVisiblePlaylistItems = Math.floor((compare_size) / (thumbHeight + thumbSpacing));
			}
		
			if(!maxVisibleThumbs && currentlyVisiblePlaylistItems > visibleThumbs) currentlyVisiblePlaylistItems = visibleThumbs;
			else if(currentlyVisiblePlaylistItems > _playlistLength) currentlyVisiblePlaylistItems = _playlistLength;
			else if(currentlyVisiblePlaylistItems < minVisibleThumbs) currentlyVisiblePlaylistItems = minVisibleThumbs;
			//console.log('currentlyVisiblePlaylistItems=', currentlyVisiblePlaylistItems);
			thumbHolderSize = currentlyVisiblePlaylistItems*thumbHeight + (currentlyVisiblePlaylistItems-1)*thumbSpacing;
			if(autoAdjustPlaylist)thumbHolder.css('height', thumbHolderSize + 'px');//set new size
			
			//restrain thumbWrapper position 
			maxLeft= -(_playlistLength*thumbHeight + (_playlistLength-1)*thumbSpacing) + thumbHolderSize;
			if(parseInt(thumbWrapper.css('top'), 10) < maxLeft){
				thumbWrapper.css('top', maxLeft+'px');
			}
		}
		
		//change playlistCounter
		if(playlistCounter + currentlyVisiblePlaylistItems>_playlistLength-1){
			playlistCounter = _playlistLength - currentlyVisiblePlaylistItems;
		}
		//console.log('playlistCounter=', playlistCounter);
		checkPlaylistControls();
		
		//position thumb holder
		if(autoAdjustPlaylist){
		if(thumbOrientation=='horizontal'){
				if(!fixThumbs){
					var cpw = componentPlaylist.width()/2;
					thumbHolder.css('left', cpw - thumbHolderSize/2 + 'px');
					prevThumbBtn.css('left', cpw - thumbHolderSize/2 - prevThumbBtn.width()-thumbBtnSpace + 'px');
					nextThumbBtn.css('left', cpw + thumbHolderSize/2 +thumbBtnSpace + 'px');
				}else{
					var thl = parseInt(thumbHolder.css('left'),10);
					if(fixThumbsSide == 'left'){
						thumbHolder.css('left', fixThumbsValue + 'px');
						prevThumbBtn.css(fixThumbsSide, thl - prevThumbBtn.width()-thumbBtnSpace + 'px');
						nextThumbBtn.css(fixThumbsSide, thl + thumbHolderSize +thumbBtnSpace + 'px');
					}else{//right
						thumbHolder.css('right', fixThumbsValue + 'px');
						//reverse buttons
						nextThumbBtn.css(fixThumbsSide, thl - prevThumbBtn.width()-thumbBtnSpace + 'px');
						prevThumbBtn.css(fixThumbsSide, thl + thumbHolderSize + thumbBtnSpace + 'px');
					}
				}
				var tht = parseInt(thumbHolder.css('top'),10);
				prevThumbBtn.css('top', tht+thumbHeight/2-prevThumbBtn.height()/2 +'px');
				nextThumbBtn.css('top', tht+thumbHeight/2-nextThumbBtn.height()/2 +'px');
				
			}else{//vertical
				if(!fixThumbs){
					var cph = componentPlaylist.height()/2;
					thumbHolder.css('top', cph - thumbHolderSize/2 + 'px');
					prevThumbBtn.css('top', cph - thumbHolderSize/2 - prevThumbBtn.height()-thumbBtnSpace + 'px');
					nextThumbBtn.css('top', cph + thumbHolderSize/2 +thumbBtnSpace + 'px');
				}else{
					if(fixThumbsSide == 'top'){
						thumbHolder.css('top', fixThumbsValue + 'px');
						var tht = parseInt(thumbHolder.css('top'),10);
						prevThumbBtn.css('top', tht - prevThumbBtn.height()-thumbBtnSpace + 'px');
						nextThumbBtn.css('top', tht + thumbHolderSize +thumbBtnSpace + 'px');
					}else{//bottom
						thumbHolder.css('bottom', fixThumbsValue + 'px');
						//reverse buttons
						var thb = parseInt(thumbHolder.css('bottom'),10);
						nextThumbBtn.css('bottom', thb - prevThumbBtn.height()-thumbBtnSpace + 'px');
						prevThumbBtn.css('bottom', thb + thumbHolderSize +thumbBtnSpace + 'px');
					}
				}
				var thl = parseInt(thumbHolder.css('left'),10);
				prevThumbBtn.css('left', thl+thumbWidth/2-prevThumbBtn.width()/2 +'px');
				nextThumbBtn.css('left', thl+thumbWidth/2-prevThumbBtn.width()/2 +'px');
			}
		}
	}
	
	function togglePlaylist(){
		//console.log('togglePlaylist');
		if(!autoAdjustPlaylist)return;
		if(playlistHidden) return;
		var ease='easeOutQuint',time=500, value;
		if(playlistPosition == 'top'){
			if(playlistOpened){
				value = - componentPlaylist.height() + 'px';
			}else{
				value = 0+'px';
			}
			componentPlaylist.stop().animate({'top': value},{duration: time, easing: ease});
		}else if(playlistPosition == 'bottom'){
			if(playlistOpened){
				value = getComponentSize('h') + 'px';
			}else{
				value = getComponentSize('h') - componentPlaylist.height() + 'px';
			}
			componentPlaylist.stop().animate({'top': value},{duration: time, easing: ease});
		}else if(playlistPosition == 'left'){
			if(playlistOpened){
				value = - componentPlaylist.width() + 'px';
			}else{
				value = 0+'px';
			}
			componentPlaylist.stop().animate({'left': value},{duration: time, easing: ease});
		}else if(playlistPosition == 'right'){
			side='left';
			if(playlistOpened){
				value = getComponentSize('w') + 'px';
			}else{
				value = getComponentSize('w') - componentPlaylist.width() + 'px';
			}
			componentPlaylist.stop().animate({'left': value},{duration: time, easing: ease});
		}
		//playlist toggle btn
		if(!playlistOpened){
			playlist_toggle.children('img').attr('src', ic_minus);
			playlistOpened=true;
		}else{
			playlist_toggle.children('img').attr('src', ic_plus);
			playlistOpened=false;
		}
	}
	
	function positionPlaylistHolder(){
		//console.log('positionPlaylistHolder');
		if(!autoAdjustPlaylist)return;
		if(playlistPosition == 'top'){
			
			if(playlistIndex=='inside'){
				if(playlistOpened){
					componentPlaylist.css('top',0+'px');
				}else{
					componentPlaylist.css('top', - componentPlaylist.height() + 'px');
				}
			}else{
				componentPlaylist.css('top',0+'px');
				componentHolder.css('top', componentPlaylist.height() + 'px');
			}
			
		}else if(playlistPosition == 'bottom'){
			
			if(playlistIndex=='inside'){
				if(playlistOpened){
					componentPlaylist.css('top', getComponentSize('h') - componentPlaylist.height() + 'px');
				}else{
					componentPlaylist.css('top', getComponentSize('h') + 'px');
				}
			}else{
				//componentPlaylist.css('top', getComponentSize('h') + 'px');
			}
			
		}else if(playlistPosition == 'left'){
			
			if(playlistIndex=='inside'){
				if(playlistOpened){
					componentPlaylist.css('left',0+'px');
				}else{
					componentPlaylist.css('left', -componentPlaylist.width() + 'px');
				}
			}else{
				componentPlaylist.css('left',0+'px');
				componentHolder.css('left', componentPlaylist.width() + 'px');
			}
			
		}else if(playlistPosition == 'right'){
			
			if(playlistIndex=='inside'){
				if(playlistOpened){
					componentPlaylist.css('left', getComponentSize('w')-componentPlaylist.width() + 'px');
				}else{
					componentPlaylist.css('left', getComponentSize('w') + 'px');
				}
			}else{
				componentPlaylist.css('left', getComponentSize('w') + 'px');//width of the playlist is already deducted in getComponentSize
			}
			
		}
	}
	
	function togglePlaylistControls(e){
		//console.log('togglePlaylistControls');
		if(!componentInited || categoryTransitionOn) return;
		
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = e.currentTarget;
		var id = $(currentTarget).attr('data-id');
		
		if(id == 'prevThumbBtn'){
			if(playlistCounter == 0) return;
			categoryTransitionOn=true;
			playlistCounter -= currentlyVisiblePlaylistItems;
		}else if(id == 'nextThumbBtn'){
			if(playlistCounter == _playlistLength - currentlyVisiblePlaylistItems) return;
			categoryTransitionOn=true;
			playlistCounter += currentlyVisiblePlaylistItems;
		}
		positionPlaylistThumb();
		
		return false;
	}
	
	function positionPlaylistThumb(){
		//if(_playlistLength <= currentlyVisiblePlaylistItems)return;
		//console.log('positionPlaylistThumb');
		if(playlistCounter < 0) playlistCounter = 0;//restrain
		else if(playlistCounter > _playlistLength - currentlyVisiblePlaylistItems) playlistCounter = _playlistLength - currentlyVisiblePlaylistItems;
		//console.log('playlistCounter = ', playlistCounter);
		
		var newPos;
		if(thumbOrientation=='horizontal'){
			newPos = playlistCounter * thumbWidth + (playlistCounter*thumbSpacing);
			//console.log(newPos);
			thumbWrapper.stop().animate({ 'left': -newPos + 'px'},  {duration: 500, easing: 'easeOutQuint', complete: function(){
				checkPlaylistControls();
			}});
		}else{
			newPos = playlistCounter * thumbHeight + (playlistCounter*thumbSpacing);
			//console.log(newPos);
			thumbWrapper.stop().animate({ 'top': -newPos + 'px'},  {duration: 500, easing: 'easeOutQuint', complete: function(){
				checkPlaylistControls();
			}});
		}
	}
	
	function togglePrevThumbBtn(dir){
		if(!prevThumbBtn)return;
		if(dir == 'off'){
			prevThumbBtn.css('display', 'none');
		}else{
			prevThumbBtn.css('display', 'block');
		}
	}
	
	function toggleNextThumbBtn(dir){
		if(!nextThumbBtn)return;
		if(dir == 'off'){
			nextThumbBtn.css('display', 'none');
		}else{
			nextThumbBtn.css('display', 'block');
		}
	}
	
	function checkPlaylistControls(){
		//console.log('checkPlaylistControls', currentlyVisiblePlaylistItems);
		if(_playlistLength <= currentlyVisiblePlaylistItems){
			togglePrevThumbBtn('off');
			toggleNextThumbBtn('off');
			thumbTouchOn=false;
			return;
		}else{
			togglePrevThumbBtn('on');
			toggleNextThumbBtn('on');
			thumbTouchOn=true;
		}
		
		if(playlistCounter == 0){
			togglePrevThumbBtn('off');
		}else{
			togglePrevThumbBtn('on');
		}
		
		if(playlistCounter + currentlyVisiblePlaylistItems == _playlistLength){
			toggleNextThumbBtn('off');
		}else{
			toggleNextThumbBtn('on');
		}
		
		categoryTransitionOn=false;
	}
	
	
	//******************************* MENU ****************************//
	
	function makeMenu(){
		
		//MENU CONTROLS
		prevMenuBtn = componentWrapper.find('.prevMenuBtn').css({display:'none', cursor: 'pointer'}).attr('data-id', 'prevMenuBtn').bind(_downEvent, toggleMenuControls);
		nextMenuBtn = componentWrapper.find('.nextMenuBtn').css({display:'none', cursor: 'pointer'}).attr('data-id', 'nextMenuBtn').bind(_downEvent, toggleMenuControls);
		
		//get menu spacing
		var d = $('<div/>').addClass('menu_item').appendTo(menuWrapper);
		if(menuOrientation=='horizontal'){
			menuSpacing = parseInt(d.css('marginRight'),10);
		}else{
			menuSpacing = parseInt(d.css('marginBottom'),10);
		}
		//console.log(menuSpacing);
		
		//build menu
		var m=0,menuItem,menuPosition=0,fontMeasure = $('<div/>').addClass('fontMeasure').appendTo(componentWrapper);
		
		//find max menu item width and height during creation
		for(m;m<categoryLength;m++){
			menuItem = $('<div/>').html(categoryTitleArr[m]).addClass('menu_item').appendTo(fontMeasure);
			if(menuOrientation=='horizontal'){
				menuItem.css({left: menuPosition + (m*menuSpacing) + 'px', top: 0+'px'});
				menuPosition += menuItem.width();
				menuItemSizeArr.push(menuItem.outerWidth());
				menuItemPositionArr.push(parseInt(menuItem.css('left'),10));
			}else{
				menuItem.css({top: menuPosition + (m*menuSpacing) + 'px', left: 0});
				menuPosition += menuItem.height();
				menuItemSizeArr.push(menuItem.outerHeight());
				menuItemPositionArr.push(parseInt(menuItem.css('top'),10));
			}
			menuItem.css('width', menuItem.width()+1 + 'px');
			if(maxMenuItemHeight<menuItem.height()) maxMenuItemHeight=menuItem.height();//find max height
			if(maxMenuItemWidth<menuItem.width()) maxMenuItemWidth=menuItem.width();//find max width
			menuItem.appendTo(menuWrapper).attr('data-id', m).bind('click', clickMenuItem).css({cursor: 'pointer', opacity: menuItemOffOpacity});
			if(!isMobile)menuItem.bind('mouseover', overMenuItem).bind('mouseout', outMenuItem);
			menuItemArr.push(menuItem);
		}
		
		m=0, ms=0; 
		for(m;m<categoryLength;m++){
			//menuItem = menuItemArr[m];
			ms+=menuItemSizeArr[m]+menuSpacing;
		}
		ms-=menuSpacing;//remove last spacing
		
		preventSelect(menuItemArr);
		
		//only once alignment
		if(menuOrientation=='horizontal'){
			menuHolder.css('height', maxMenuItemHeight+'px');
			menuWrapper.css({width: ms+'px', height: maxMenuItemHeight+'px'});//needed for touch drag!
			menuSize=parseInt(menuHolder.css('height'),10);
		}else{//vertical
			menuHolder.css('width', maxMenuItemWidth+'px');
			menuWrapper.css({height: ms+'px', width: maxMenuItemHeight+'px'});//needed for touch drag!
			menuSize=parseInt(menuHolder.css('width'),10);
		}
		fontMeasure.remove();//clean
		fontMeasure=null;
	}
	
	function clickMenuItem(e){
		if(!componentInited) return false;
		if(categoryTransitionOn) return false;
		if(_transitionType != 'KEN_BURNS' && transitionOn) return false;
		
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = $(e.currentTarget);
		var id = currentTarget.attr('data-id');
	
		if(id == activeCategory) return;//active item
		categoryTransitionOn=true;
		enableActiveMenuItem();
		activeCategory = id;
		
		if(useDeeplink){
			$.address.value(findAddress2(0));
			if(!$.address.history()) $.address.history(true);//restore history
		}else{
			cleanCategory();
		}

		return false;
	}
	
	function overMenuItem(e){
		if(!componentInited) return;
		
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = $(e.currentTarget);
		var id = currentTarget.attr('data-id');
		
		currentTarget.stop().animate({ 'opacity': 1},  {duration: 500, easing: 'easeOutSine'});

		return false;
	}
	
	function outMenuItem(e){
		if(!componentInited) return;
		
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = $(e.currentTarget);
		var id = currentTarget.attr('data-id');
		if(id == activeCategory) return;//active item
		
		currentTarget.stop().animate({ 'opacity': menuItemOffOpacity},  {duration: 500, easing: 'easeOutSine'});

		return false;
	}
	
	function enableActiveMenuItem(){
		//console.log('enableActiveMenuItem');
		if(lastActiveMenuItem){ 
			lastActiveMenuItem.stop().animate({ 'opacity': menuItemOffOpacity},  {duration: 500, easing: 'easeOutSine'}).css('cursor', 'pointer');
		}
	}
	
	function disableActiveMenuItem(){
		//console.log('disableActiveMenuItem', activeCategory);
		var menuItem=menuItemArr[activeCategory];
		if(menuItem){
			menuItem.stop().animate({ 'opacity': 1},  {duration: 500, easing: 'easeOutSine'}).css('cursor', 'default');
			lastActiveMenuItem = menuItem;
		}
	}
	
	function getCurrentMenuSize(startItem, endItem){
		var temp=0;
		for(startItem; startItem< endItem;startItem++){
			temp+=menuItemSizeArr[startItem]+menuSpacing;	
		}
		temp-=menuSpacing;//remove last menu spacing
		return temp;
	}
	
	function calculateMenuLeft(){
		//console.log('calculateMenuLeft');
		var measureSize;
		if(menuOrientation=='horizontal'){
			measureSize=getComponentSize('w') - menuBtnBuffer;
		}else{
			measureSize=getComponentSize('h') - menuBtnBuffer;
		}
		//console.log('measureSize=', measureSize);
		//console.log('menuCounter=', menuCounter);
	
		var currentSize=0;
		var endItem=menuCounter;
		startItem=menuCounter;//count backwards
		var doLast=true;
		
		outer: while(currentSize < measureSize) {
			startItem--;
			if(!maxVisibleMenuItems && endItem-startItem > visibleMenuItems){
				 startItem = endItem-visibleMenuItems;
				 doLast = false;//no need to remove last item that broke while condition because we cut it here
				 currentSize = getCurrentMenuSize(startItem, endItem);
				 break outer;
			}
			if(startItem < 0){
				 startItem = 0;
				 doLast = false;
				 currentSize = getCurrentMenuSize(startItem, endItem);
				 //check if fit more than we have since we hit boundary (go upwards in the case)
				 
				 var doLast2=true;
				 while(currentSize < measureSize) {
					 endItem++;
					 if(!maxVisibleMenuItems && endItem > visibleMenuItems){//start item is now 0 (zero)
						 endItem = visibleMenuItems;
						 doLast2 = false;//no need to remove last item that broke while condition because we cut it here
						 currentSize = getCurrentMenuSize(0, endItem);
						 break outer;
					 }
					 if(endItem > categoryLength){
						 endItem = categoryLength;
						 doLast2 = false;
						 currentSize = getCurrentMenuSize(0, endItem);
						 break outer;
					 }
					 currentSize = getCurrentMenuSize(0, endItem);
				 }
				 if(doLast2){
					endItem--;//remove last item that broke while condition
					currentSize = getCurrentMenuSize(startItem, endItem);//recalculate
				 }
				 break outer;
			}
			currentSize = getCurrentMenuSize(startItem, endItem);
		
		}
		if(doLast){
			startItem++;//remove last item that broke while condition
			currentSize = getCurrentMenuSize(startItem, endItem);//recalculate
		}
		
		var newPos= menuItemPositionArr[startItem];
		if(menuOrientation=='horizontal'){
			menuHolderSize = currentSize;
			menuHolder.css('width', menuHolderSize + 'px');//set new size
			if(!fixMenu){
				menuHolder.css('left', componentPlaylist.width()/2 - menuHolderSize/2 + 'px');
			}else{
				menuHolder.css(fixMenuSide, fixMenuValue + 'px');
			}
			menuWrapper.stop().animate({ 'left': -newPos + 'px'},  {duration: 500, easing: 'easeOutQuint', complete: function(){
				checkMenuControls();
			}});
		}else{
			menuHolderSize = currentSize;
			menuHolder.css('height', menuHolderSize + 'px');//set new size
			if(!fixMenu){
				menuHolder.css('top', componentPlaylist.height()/2 - menuHolderSize/2 + 'px');
			}else{
				menuHolder.css(fixMenuSide, fixMenuValue + 'px');
			}
			menuWrapper.stop().animate({ 'top': -newPos + 'px'},  {duration: 500, easing: 'easeOutQuint', complete: function(){
				checkMenuControls();
			}});
		}
		
		currentlyVisibleMenuItems = endItem-startItem;
		//console.log('currentlyVisibleMenuItems=', currentlyVisibleMenuItems);
		positionMenuBtns();
		
	}	
		
	function getMenuHolderSize(){
		//console.log('getMenuHolderSize');
		var measureSize;
		if(menuOrientation=='horizontal'){
			measureSize=getComponentSize('w') - menuBtnBuffer;
		}else{
			measureSize=getComponentSize('h') - menuBtnBuffer;
		}
		//console.log('measureSize=', measureSize);
		//console.log('menuCounter=', menuCounter);
		//console.log('visibleMenuItems=', visibleMenuItems);
	
		var currentSize=0;
		var endItem=menuCounter;
		var doLast=true;
		
		outer: while(currentSize < measureSize) {
			endItem++;
			if(!maxVisibleMenuItems && endItem-menuCounter > visibleMenuItems){
				 endItem = menuCounter+visibleMenuItems;
				 doLast = false;//no need to remove last item that broke while condition because we cut it here
				 currentSize = getCurrentMenuSize(menuCounter, endItem);
				 break outer;
			}
			if(endItem > categoryLength){
				 endItem = categoryLength;
				 doLast = false;
				 currentSize = getCurrentMenuSize(menuCounter, endItem);
				 //console.log('currentSize=', currentSize);
				 //check if fit more than we have since we hit boundary (go downwards in the case)
				 
				 var doLast2=true;
				 while(currentSize < measureSize) {
					 menuCounter--;
					 if(!maxVisibleMenuItems && endItem-menuCounter > visibleMenuItems){
						 menuCounter = endItem-visibleMenuItems;
						 doLast2 = false;//no need to remove last item that broke while condition because we cut it here
						 currentSize = getCurrentMenuSize(menuCounter, categoryLength);
						 break outer;
					 }
					 if(menuCounter < 0){
						 menuCounter = 0;
						 doLast2 = false;
						 currentSize = getCurrentMenuSize(0, categoryLength);
						 break outer;
					 }
					 currentSize = getCurrentMenuSize(menuCounter, categoryLength);
				 }
				 if(doLast2){
					menuCounter++;//remove last item that broke while condition
					currentSize = getCurrentMenuSize(menuCounter, endItem);//recalculate
				 }
				 break outer;
			}
			currentSize = getCurrentMenuSize(menuCounter, endItem);
			//console.log('currentSize=', currentSize);
			
		}
		if(doLast){
			endItem--;//remove last item that broke while condition
			currentSize = getCurrentMenuSize(menuCounter, endItem);//recalculate
		}
		
		var newPos= menuItemPositionArr[menuCounter];
		
		currentlyVisibleMenuItems = endItem-menuCounter;
		//console.log('currentlyVisibleMenuItems=', currentlyVisibleMenuItems);	
		
		if(menuOrientation=='horizontal'){
			menuHolderSize = currentSize;
			menuHolder.css('width', menuHolderSize + 'px');//set new size
			if(!fixMenu){
				menuHolder.css('left', componentPlaylist.width()/2 - menuHolderSize/2 + 'px');
			}else{
				menuHolder.css(fixMenuSide, fixMenuValue + 'px');
			}
			menuWrapper.stop().animate({ 'left': -newPos + 'px'},  {duration: 500, easing: 'easeOutQuint', complete: function(){
				checkMenuControls();
			}});
		}else{
			menuHolderSize = currentSize;
			menuHolder.css('height', menuHolderSize + 'px');//set new size
			if(!fixMenu){
				menuHolder.css('top', componentPlaylist.height()/2 - menuHolderSize/2 + 'px');
			}else{
				menuHolder.css(fixMenuSide, fixMenuValue + 'px');
			}
			menuWrapper.stop().animate({ 'top': -newPos + 'px'},  {duration: 500, easing: 'easeOutQuint', complete: function(){
				checkMenuControls();
			}});
		}
		positionMenuBtns();
	}	
	
	function positionMenuBtns(){
		//console.log('positionMenuBtns');
		if(menuOrientation=='horizontal'){
			var mht = parseInt(menuHolder.css('top'),10);
			prevMenuBtn.css('top',  mht +maxMenuItemHeight/2-prevMenuBtn.height()/2 +'px');
			nextMenuBtn.css('top',  mht +maxMenuItemHeight/2-prevMenuBtn.height()/2 +'px');
			if(!fixMenu){
				var cpw =  componentPlaylist.width()/2;
				prevMenuBtn.css('left',cpw - menuHolderSize/2 - prevMenuBtn.width()-menuBtnSpace + 'px');
				nextMenuBtn.css('left', cpw + menuHolderSize/2 + menuBtnSpace + 'px');
			}else{
				if(fixMenuSide=='left'){
					prevMenuBtn.css(fixMenuSide, fixMenuValue - prevMenuBtn.width()-menuBtnSpace + 'px');
					nextMenuBtn.css(fixMenuSide, fixMenuValue + parseInt(menuHolder.css('width'),10) + menuBtnSpace + 'px');
				}else{
					//reverse assignment for right
					nextMenuBtn.css(fixMenuSide, fixMenuValue - prevMenuBtn.width()-menuBtnSpace + 'px');
					prevMenuBtn.css(fixMenuSide, fixMenuValue + parseInt(menuHolder.css('width'),10) + menuBtnSpace + 'px');
				}
			}
		}else{
			var mhl = parseInt(menuHolder.css('top'),10);
			prevMenuBtn.css('left',  mhl +maxMenuItemWidth/2-prevMenuBtn.width()/2 +'px');
			nextMenuBtn.css('left',  mhl +maxMenuItemWidth/2-prevMenuBtn.width()/2 +'px');
			if(!fixMenu){
				var cph = componentPlaylist.height()/2;
				prevMenuBtn.css('top', cph - menuHolderSize/2 - prevMenuBtn.height()-menuBtnSpace + 'px');
				nextMenuBtn.css('top', cph + menuHolderSize/2 + menuBtnSpace + 'px');
			}else{
				if(fixMenuSide=='top'){
					prevMenuBtn.css(fixMenuSide, fixMenuValue - prevMenuBtn.height()-menuBtnSpace + 'px');
					nextMenuBtn.css(fixMenuSide, fixMenuValue + parseInt(menuHolder.css('height'),10) + menuBtnSpace + 'px');
				}else{
					//reverse assignment for bottom
					nextMenuBtn.css(fixMenuSide, fixMenuValue - prevMenuBtn.height()-menuBtnSpace + 'px');
					prevMenuBtn.css(fixMenuSide, fixMenuValue + parseInt(menuHolder.css('height'),10) + menuBtnSpace + 'px');
				}
			}
		}
	}
	
	function toggleMenuControls(e){
		//console.log('toggleMenuControls ', menuCounter);
		if(!componentInited || menuTransitionOn) return;
		
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = e.currentTarget;
		var id = $(currentTarget).attr('data-id');
		
		if(id == 'prevMenuBtn'){
			if(menuCounter == 0) return;
			//console.log('prev click');
			menuTransitionOn=true;
			calculateMenuLeft();
			menuCounter=startItem;
			if(menuCounter<0) menuCounter = 0;
		}else if(id == 'nextMenuBtn'){
			if(menuCounter == categoryLength - currentlyVisibleMenuItems) return;
			//console.log('next click');
			menuTransitionOn=true;
			menuCounter += currentlyVisibleMenuItems;
			if(menuCounter>categoryLength-1) menuCounter = categoryLength-1;
			getMenuHolderSize();
		}
		return false;
	}
	
	function positionMenuItem(){
		
		if(menuCounter<0) menuCounter = 0;
		else if(menuCounter > categoryLength - currentlyVisibleMenuItems) menuCounter = categoryLength - currentlyVisibleMenuItems;
		
		var newPos= menuItemPositionArr[menuCounter];
		if(!newPos) return;
		//console.log(newPos);
		if(menuOrientation=='horizontal'){
			menuWrapper.stop().animate({ left: -newPos + 'px'},  {duration: 500, easing: 'easeOutQuint', complete: function(){
				checkMenuControls();
			}});
		}else{
			menuWrapper.stop().animate({ top: -newPos + 'px'},  {duration: 500, easing: 'easeOutQuint', complete: function(){
				checkMenuControls();
			}});
		}
	}
	
	function togglePrevMenuBtn(dir){
		if(dir == 'off'){
			prevMenuBtn.css('display', 'none');
		}else{
			prevMenuBtn.css('display', 'block');
		}
	}
	
	function toggleNextMenuBtn(dir){
		if(dir == 'off'){
			nextMenuBtn.css('display', 'none');
		}else{
			nextMenuBtn.css('display', 'block');
		}
	}
	
	function checkMenuControls(){
		//console.log('checkMenuControls ', menuCounter, currentlyVisibleMenuItems);
		if(categoryLength <= currentlyVisibleMenuItems){
			togglePrevMenuBtn('off');
			toggleNextMenuBtn('off');
			menuTouchOn=false;
			return;
		}else{
			togglePrevMenuBtn('on');
			toggleNextMenuBtn('on');
			menuTouchOn=true;
		}
		
		if(menuCounter == 0){
			togglePrevMenuBtn('off');
		}else{
			togglePrevMenuBtn('on');
		}
		
		if(menuCounter + currentlyVisibleMenuItems == categoryLength){
			toggleNextMenuBtn('off');
		}else{
			toggleNextMenuBtn('on');
		}
		menuTransitionOn=false;
	}
	
	//******************** CHATEGORY CHANGE ************************ //
	
	function cleanCategory(){
		//console.log('cleanCategory');
		
		//if(currentCategory){
			
			if(transitionFinishIntervalID) clearInterval(transitionFinishIntervalID);
			if(swfAddressTimeoutID) clearTimeout(swfAddressTimeoutID);
			stopSlideshowTimer();
			if(loadRequestIntervalID) clearInterval(loadRequestIntervalID);
			mediaUnloadedAction();
			
			slideshowForcePause=false;
			
			if(activeSlideContent){
				activeSlideContent.remove();
				activeSlideContent=null;	
			}
			
			thumbTouchOn=false;
			menuTouchOn=false;
			
			if(lastActivePlaylistItem){
				lastActivePlaylistItem.css('opacity', thumbOffOpacity).find('a').css('cursor', 'pointer');
				lastActivePlaylistItem=null;
			} 
			enableActiveMenuItem();
			
			var i = 0, thumb;
			for(i;i<_playlistLength;i++){
				thumb = $(playlistItemArr[i]);
				if(thumb){
					thumb.unbind('click', clickPlaylistItem);
					if(!isMobile)thumb.unbind('mouseover', overPlaylistItem).unbind('mouseout', outPlaylistItem);
				}
			}
			playlistItemArr=[];
			
			if(thumbOrientation=='horizontal'){
				thumbWrapper.css('left', 0+'px');
			}else{//vertical
				thumbWrapper.css('top', 0+'px');
			}
			
			if(currentData)currentData.css('display','none');
			
			_holder1.stop().empty();
			_holder2.stop().empty();
			_holder1.css({
				zIndex:0,
				opacity:1,
				background:'none',
				overflow:'visible',
				display:'none'
			});
			_holder2.css({
				zIndex:1,
				opacity:1,
				background:'none',
				overflow:'visible',
				display:'none'
			});
			componentHolder.css('background', 'none');
			
			categoryTransitionOn=false;
			
		//}	
			
		getCategoryData();
		
		if(!stuffInited){
			positionPlaylistHolder();
			getThumbHolderSize();
			
			if(!singleCategory){
				makeMenu();
				getMenuHolderSize();
				disableActiveMenuItem();
			}
			
			if(!playlistHidden){
				componentPlaylist.css('display','block');
			}
			
			stuffInited=true;
		}else{
			
			positionPlaylistHolder();
			getThumbHolderSize();
		}
		
		if(!singleCategory) getMenuHolderSize();
		
		if(!useDeeplink){
			_counter=0;
			checkMedia(getCounter());
		}
	}
	
	function getCategoryData(){
		//reset
		currentCategory = activeCategory; 
		
		playlistCounter=0;
		transitionIntroHappened=false;
		loadRequestPause = false;
		kenBurnsTransitionOn=false;
		categoryDataArr=[];
		lastActivePlaylistItem=null;
		
		currentData=$(dataArr[activeCategory]).css('display','block');
		categoryDataArr=currentData.find('ul').children('li');
		
		thumbWidth = categoryDataArr.outerWidth();
		thumbHeight = categoryDataArr.outerHeight();
		//console.log(thumbWidth, thumbHeight);
		
		//set playlist size
		var playlistSize = parseInt(currentData.attr('data-playlistSize'),10);
		//console.log(playlistSize);
		if(playlistPosition=='left' || playlistPosition=='right'){
			componentPlaylist.css('width',playlistSize+'px');
			if(playlistIndex == 'outside')componentHolder.css('width', getComponentSize('w') + 'px');//componentHolder size -= size of the componentPlaylist
		}else{
			componentPlaylist.css('height',playlistSize+'px');
			if(playlistIndex == 'outside')componentHolder.css('height', getComponentSize('h') + 'px');
		}
		
		//console.log(categoryDataArr);
		_playlistLength=categoryDataArr.length;
		if(visibleThumbs>_playlistLength) visibleThumbs=_playlistLength;
		if(_randomPlay) makeRandomList();
		//console.log(_playlistLength);
		
		//set thumbholder size based on thumb size
		if(thumbOrientation=='horizontal'){
			if(autoAdjustPlaylist)thumbHolder.css('height',thumbHeight+'px');
			thumbSpacing = parseInt($(categoryDataArr[0]).css('marginRight'),10);
			$(categoryDataArr[_playlistLength-1]).css('marginRight',0+'px');//remove margin on last item horizontally so it doesnt fall into new line
		}else{
			if(autoAdjustPlaylist)thumbHolder.css('width',thumbWidth+'px');
			thumbSpacing = parseInt($(categoryDataArr[0]).css('marginBottom'),10);	
		}
		
		_transitionType = (currentData.attr('data-transitionType')).toUpperCase();
		if(_transitionType != 'SLIDE' && _transitionType != 'SPLIT' && _transitionType != 'REVEAL' && _transitionType != 'KEN_BURNS' && _transitionType != 'ALPHA' && _transitionType != 'ZOOM'){
			alert('Invalid transitionType on category number: ' + activeCategory);
			_transitionType == 'ALPHA';//reserve
		}
		
		if(_transitionType != 'KEN_BURNS'){
		
			var fitMode = currentData.attr('data-imageFitMode');
			if(fitMode != 'fit-inside' && fitMode != 'fit-outside'){
				alert("Invalid imageFitMode on category number: " + activeCategory);
				fitMode == 'fit-outside';//reserve
			}else{
				fitMode == 'fit-inside' ? imageFitMode = true : imageFitMode = false;
			}
			transitionEase = currentData.attr('data-transitionEase');
			transitionTime = parseInt(currentData.attr('data-transitionTime'), 10);
		
		}
		
		//fix, otherwise last visible thumb falls into new line because of border right
		if(thumbOrientation=='horizontal'){
			var s = _playlistLength*thumbWidth + (_playlistLength-1)*thumbSpacing;
			thumbWrapper.css('width', s+'px');
		}
		
		if(currentData.attr('data-bgColor') != undefined){
			componentBgColor = currentData.attr('data-bgColor');
		}
		//console.log(_playlistLength, _transitionType, imageFitMode);
		
		getThumbPlaylist();
		
		if(activeCategory >= menuCounter && activeCategory <= menuCounter + currentlyVisibleMenuItems - 1){
			//console.log(i, activeCategory);//dont change thumb position thumb click
		}else{
			menuCounter = activeCategory;
			positionMenuItem();
		}
		disableActiveMenuItem();
		
		//check audio 
		if(useAudio && audioForcePause){
			audioForcePause=false;
			audioPlayerHolder.playAudio();
		}
	}
	
	function getThumbPlaylist(){
		//console.log('getThumbPlaylist');
		var i = 0,thumb;
		for(i; i<_playlistLength;i++){
			thumb = $(categoryDataArr[i]).attr('data-id', i).css('opacity', thumbOffOpacity).bind('click', clickPlaylistItem);
			if(!isMobile)thumb.bind('mouseover', overPlaylistItem).bind('mouseout', outPlaylistItem);
			playlistItemArr.push(thumb);
			//console.log(i, thumb.css('marginRight'));
		}
	}
	
	function clickPlaylistItem(e){
		if(!componentInited || loadRequestPause) return false;
		if(_transitionType != 'KEN_BURNS' && transitionOn) return false;
		//console.log('clickPlaylistItem');
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = $(e.currentTarget);
		var id = currentTarget.attr('data-id');
		
		if(id == getCounter())return false;//active item
		_thumbClick=true;
		
		mediaUnloadedAction();
		
		if(useDeeplink){
			enableActivePlaylistItem();
			_counter=id;
			$.address.value(findAddress2(getCounter()));
			if(!$.address.history()) $.address.history(true);//restore history
		}else{
			checkMedia(id);	
		} 
		
		return false;
	}
	
	function overPlaylistItem(e){
		if(!componentInited) return false;
		
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = $(e.currentTarget);
		var id = currentTarget.attr('data-id');

		currentTarget.stop().animate({ 'opacity': 1}, {duration: 500, easing: 'easeOutSine'});
		
		return false;
	}
	
	function outPlaylistItem(e){
		if(!componentInited) return false;
		
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = $(e.currentTarget);
		var id = currentTarget.attr('data-id');
		if(id == getCounter())return false;//active item

		currentTarget.stop().animate({ 'opacity': thumbOffOpacity}, {duration: 500, easing: 'easeOutSine'}).find('a').css('cursor', 'pointer');
		
		return false;
	}
	
	function enableActivePlaylistItem(){
		//console.log('enableActivePlaylistItem');
		if(lastActivePlaylistItem){
			lastActivePlaylistItem.stop().animate({ 'opacity': thumbOffOpacity}, {duration: 500, easing: 'easeOutSine'}).find('a').css('cursor', 'pointer');
		} 
	}
	
	function disableActivePlaylistItem(){
		//console.log('disableActivePlaylistItem');
		var playlist_item=playlistItemArr[getCounter()];
		if(playlist_item){
			playlist_item.stop().animate({ 'opacity': 1},{duration: 500, easing: 'easeOutSine'}).find('a').css('cursor', 'default');
			lastActivePlaylistItem = playlist_item;
		}
		//position thumb playlist on active thumb
		var i = getCounter();
		if(i >= playlistCounter && i <= playlistCounter + currentlyVisiblePlaylistItems - 1){
			//console.log(i, playlistCounter);//dont change thumb position thumb click
		}else{
			playlistCounter = i;
			positionPlaylistThumb();
		}
	}
	
	//**************** IMAGE LOADING PROCESS *************/	
	
	function loadImage(i){
		//console.log('loadImage ', i);
		if(categoryTransitionOn) return;
		_mediaLoadOn=true;
		var img,imageUrl,data = $(categoryDataArr[i]),imgLoaded,id,mainArr = mediaObj[activeCategory].main;
		
		img =$(new Image()).attr('id', i).css({
			top: 0,
			left: 0,
			display: 'block'
		});
		
		if( _transitionType=='SLIDE' || _transitionType=='SPLIT' || _transitionType=='REVEAL' ){
			img.css('position', 'absolute');
		}else if( _transitionType=='KEN_BURNS' || _transitionType=='ALPHA'  || _transitionType=='ZOOM' ){
			img.css({
				position: 'relative',
				width: 100 + '%',
				height: 100 + '%'
			});
		}
	
		//imageUrl = data.attr('data-imagePath')+"?rand=" + (Math.random() * 99999999);
		imageUrl = data.attr('data-imagePath');
		//console.log(imageUrl);
			
		img.load(function() {
			
			imgLoaded = $(this);
			id = parseInt(imgLoaded.attr('id'),10);

			this.origWidth = this.width;
			this.origHeight = this.height;
			
			//imgLoaded.bind("dragstart", function(e) { e.preventDefault(); return false; }).bind("selectstart", function(e) { e.preventDefault(); return false; }).touchSwipe(swipeHandler, true);
			
			mainArr[id] = imgLoaded;//store loaded image
			//console.log('img loaded ', i);
			_mediaLoadOn=false;
			
			if(loadRequestPause){
				loadRequestPause = false;	
				if(componentInited){
					callTransition();
				}else{
					setTimeout(function(){callTransition()},800);//delay first image on start
				}
			}else{
				checkMedia(getCounter());
			}
			
			if(!componentInited){
				componentInited=true;
				if(typeof multiGallerySetupDone !== 'undefined')multiGallerySetupDone();//callback
				if(playlistIndex == 'inside' && autoOpenPlaylist){
					setTimeout(function(){
						positionPlaylistHolder();
						getThumbHolderSize();
						if(!singleCategory) getMenuHolderSize();
						togglePlaylist();
					},500);
				}
				if(useAudio && ap_settings.autoOpenAudioPlayer){
					toggleAudio();
				}
			}
			
		}).attr('src', imageUrl);
			
		img.error(function(e) {
			//console.log('image load error: ' + e, i);
			//alert(e);
		});
	}
	
	//find next unloaded image, return url
	function getMainUrl(){
		//console.log('getMainUrl');
		var i=0;
		var found=false;
		var mainArr = mediaObj[activeCategory].main;
		
		if(_randomPlay){
			for(i; i<_playlistLength;i++){
				if(mainArr[_randomArr[i]] == undefined){
					found = true;
					loadImage(_randomArr[i]);
					break;	
				}
			}
		}else{
			for(i; i<_playlistLength;i++){
				if(mainArr[i] == undefined){
					found = true;
					loadImage(i);
					break;	
				}
			}
		}
	}
	
	function loadRequest(){
		//console.log('loadRequest');
		loadRequestPause = true;
		//check if loading is in process
		if(_mediaLoadOn){
			if(loadRequestIntervalID) clearInterval(loadRequestIntervalID);
			loadRequestIntervalID = setInterval(waitCurrentLoad, loadRequestInterval);
		}else{
			loadImage(getCounter());
		}
	}
	
	function waitCurrentLoad(){
		//console.log('waitCurrentLoad');
		if(!_mediaLoadOn){//wait for current load to finish
			if(loadRequestIntervalID) clearInterval(loadRequestIntervalID);
			if(mainArr[getCounter()]){//wanted media was loading, we have it now
				loadRequestPause = false;
				callTransition();
			}else{//load requested
				loadImage(getCounter());
			}
		}
	}
	
	
	//**************** TRANSITIONS *************/
	
	function callTransition(skip){
		//console.log('callTransition');
		switch( _transitionType){
			case 'SLIDE':
				transitionSlide();
			break;	
			case 'SPLIT':
				transitionSplit();
			break;
			case 'REVEAL':
				transitionReveal();
			break;
			case 'KEN_BURNS':
				if(!skip){
					kb_introHappened=false;//reset
					kb_introHappened2=false;	
				}
				transitionKenBurns();	
			break;
			case 'ALPHA':
				transitionAlpha();
			break;
			case 'ZOOM':
				transitionZoom();
			break;
		}
	}
	
	//**************** SLIDE *************/
	
	function transitionSlide(){
		//console.log('transitionSlide');
		 transitionOn= true;
		 
		 var mainArr = mediaObj[activeCategory].main;
		 if(mainArr[getCounter()]){
			 var content = mainArr[getCounter()];
		 }else{
			//console.log('wait to load');
			showPreloader();
			loadRequest();
			return;
		 }
		 
		 var w = content[0].origWidth,
			 h = content[0].origHeight,
			 w1 = getComponentSize('w'),
			 h1 = getComponentSize('h');
			 currentHolder = getEmptyHolder(true).css('display', 'block');
		 
		 if(forceImageFitMode || w > w1 || h > h1){
			 var obj = retrieveObjectRatio(componentHolder, w, h, imageFitMode);
			 w = obj.width;			
			 h = obj.height;	
		}
		
		if(componentBgColor != undefined){
			_holder1.css('background', componentBgColor);
			_holder2.css('background', componentBgColor);
		}
		checkLink([content]);	
		
		content.css({
			width: w + 'px',
			height: h + 'px',
			left: w1/2-w/2 + 'px',
			top: h1/2-h/2 + 'px'
		});
			 
		currentHolder.css({
			width: w1 + 'px',
			height: h1 + 'px',
			overflow: 'hidden'
		});
		
		hidePreloader();
		
		if(transitionIntroHappened){
			
			_slideCase = getRandomNotLast( _slideCaseArr );
			//console.log(_slideCase);
			
			positionForSlideIn(currentHolder);
			currentHolder.append(content);
			var otherHolder = getOtherHolder(currentHolder);
			executeSlide( currentHolder, otherHolder );//inTarget, outTarget
		}else{
			currentHolder.css({
				left: 0 + 'px',
				top: 0 + 'px',
				opacity: 0
			}).append(content).stop().animate({ 'opacity': 1},  {duration: _firstImageTime, easing: _firstImageEase, complete: function(){
				transitionEnd();
			}});
		}
		transitionIntroHappened = true;
		 
	 }
	 
	 function positionForSlideIn( target ) {
		switch(_slideCase){
			case "top":
				target.css({
					left: 0,
					top: - getComponentSize('h') + 'px'
				});
			break;
			case "left":
				target.css({
					left: - getComponentSize('w') + 'px',
					top: 0
				});
			break;
			case "bottom":
				target.css({
					left: 0,
					top: getComponentSize('h') + 'px'
				});
			break;
			case "right":
				target.css({
					left: getComponentSize('w') + 'px',
					top: 0
				});
			break;
		}
	}
	
	function executeSlide( inTarget, outTarget ) {
			
		switch(_slideCase){
			case "top":
				inTarget.stop().animate({ 'top': 0},  {duration: transitionTime, easing: transitionEase});
				outTarget.stop().animate({ 'top': getComponentSize('h')},  {duration: transitionTime, easing: transitionEase, complete: function(){
					transitionEnd(outTarget);
				}});
			break;
			
			case "bottom":
				inTarget.stop().animate({ 'top': 0},  {duration: transitionTime, easing: transitionEase});
				outTarget.stop().animate({ 'top': - getComponentSize('h')},  {duration: transitionTime, easing: transitionEase, complete: function(){
					transitionEnd(outTarget);
				}});
			break;
		
			case "left":
				inTarget.stop().animate({ 'left': 0},  {duration: transitionTime, easing: transitionEase});
				outTarget.stop().animate({ 'left': getComponentSize('w')},  {duration: transitionTime, easing: transitionEase, complete: function(){
					transitionEnd(outTarget);
				}});
			break;
			
			case "right":
				inTarget.stop().animate({ 'left': 0},  {duration: transitionTime, easing: transitionEase});
				outTarget.stop().animate({ 'left': -getComponentSize('w')},  {duration: transitionTime, easing: transitionEase, complete: function(){
					transitionEnd(outTarget);
				}});
			break;
		}
	
	}
	
	//**************** SPLIT *************/
	
	function transitionSplit(){
		 transitionOn= true;
		 
		 var mainArr = mediaObj[activeCategory].main;
		 if(mainArr[getCounter()]){
			 var content = mainArr[getCounter()];
		 }else{
			//console.log('wait to load');
			showPreloader();
			loadRequest();
			return;
		 }
		 	
		 var w1 = getComponentSize('w'),
			 h1 = getComponentSize('h'),
			 content2 = content.clone(),
			 w = content[0].origWidth,
			 h = content[0].origHeight,
			 currentHolder = getEmptyHolder(true).css('display', 'block');

		 if(forceImageFitMode || w > w1 || h > h1){
			 var obj = retrieveObjectRatio(componentHolder, w, h, imageFitMode);
			 w = obj.width;			
			 h = obj.height;	
		}
		
		checkLink([content, content2]);	

		content.css({
			width: w + 'px',
			height: h + 'px',
			left: w1/2-w/2 + 'px',
			top: h1/2-h/2 + 'px'
		});
		
		content2.css({
			width: w + 'px',
			height: h + 'px'
		});
			 
		currentHolder.css({
			width: w1 + 'px',
			height: h1 + 'px',
			left: 0 + 'px',
			top: 0 + 'px',
			overflow: 'hidden'
		});
		
		_splitCase = getRandomNotLast( _splitCaseArr );
		//console.log(_splitCase);
		currentHolder.splitCase=_splitCase;//remember split case since we split previous image below current one
		makeSplit(content, content2, currentHolder, w, h);
		
		hidePreloader();
		
		if(transitionIntroHappened){
			var otherHolder = getOtherHolder(currentHolder).css('display', 'block');
			swapChildren(otherHolder, currentHolder);
			executeSplit( otherHolder );
		}else{
			currentHolder.css('opacity', 0).stop().animate({ 'opacity': 1},  {duration: _firstImageTime, easing: _firstImageEase, complete: function(){
				transitionEnd();
			}});
		}
		transitionIntroHappened = true;
		 
	 }
	 
	 function makeSplit(content, content2, currentHolder, w, h) {
		 
		 var split1,split2,cut,w1 = getComponentSize('w'),h1 = getComponentSize('h');
		 
		 if(_splitCase == 'horizontalUpLeft' || _splitCase == 'horizontalUpRight' || _splitCase == 'horizontalSplit'){
			 
			split1 = $("<div/>").attr('data-title', 'split1').css({
				background: componentBgColor,
				position: 'absolute',
				top: 0,
				left: 0,
				width: w1 + 'px',
				height: h1/2 + 'px',
				overflow: 'hidden'
			}).append(content).appendTo(currentHolder);
			
			split2 = $("<div/>").attr('data-title', 'split2').css({
				background: componentBgColor,
				position: 'absolute',
				top: h1/2 + 'px',
				left: 0,
				width: w1 + 'px',
				height: h1/2 + 'px',
				overflow: 'hidden'
			}).append(content2).appendTo(currentHolder);
			
			cut = (h1 - h) / 2;
			
			//move second image inside
			content2.css({
				left: w1/2-w/2 + 'px',
				top: -h1/2+ cut + 'px'
			});
			 
		}else  if(_splitCase == 'verticalUpLeft' || _splitCase == 'verticalDownLeft' || _splitCase == 'verticalSplit'){
			 
			split1 = $("<div/>").attr('data-title', 'split1').css({
				background:componentBgColor,
				position: 'absolute',
				top: 0,
				left: 0,
				width: w1 /2 + 'px',
				height: h1 + 'px',
				overflow: 'hidden'
			}).append(content).appendTo(currentHolder);
			
			split2 = $("<div/>").attr('data-title', 'split2').css({
				background: componentBgColor,
				position: 'absolute',
				top: 0,
				left: w1 / 2 + 'px',
				width: w1 / 2 + 'px',
				height: h1 + 'px',
				overflow: 'hidden'
			}).append(content2).appendTo(currentHolder);
			
			//move second image inside
			content2.css({
				left: - w/2 + 'px',
				top: h1/2- h/2 + 'px'
			});
		}
	 }
		
	 function executeSplit(target) {
		 
		 _splitCase = target.splitCase;//get previous split case
		 
		var split1=$(target.children('div[data-title=split1]')),
			split2=$(target.children('div[data-title=split2]')),
			w1 = getComponentSize('w'),
			h1 = getComponentSize('h');
		
		if(_splitCase == 'horizontalUpLeft'){
			split1.stop().animate({ 'left': - w1 + 'px'},  {duration: transitionTime, easing: transitionEase});
			split2.stop().animate({ 'left': w1 + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd(target);
			}});
		}
		else if(_splitCase == 'horizontalUpRight'){
			split1.stop().animate({ 'left': w1 + 'px'},  {duration: transitionTime, easing: transitionEase});
			split2.stop().animate({ 'left': - w1 + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd(target);
			}});
		}
		else if(_splitCase == "horizontalSplit"){
			split1.stop().animate({ 'top': -h1/2 + 'px'},  {duration: transitionTime, easing: transitionEase});
			split2.stop().animate({ 'top': h1 + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd(target);
			}});
		}
		else if(_splitCase == "verticalUpLeft"){
			split1.stop().animate({ 'top': - h1 + 'px'},  {duration: transitionTime, easing: transitionEase});
			split2.stop().animate({ 'top': h1 + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd(target);
			}});
		}	
		else if(_splitCase == "verticalDownLeft"){
			split1.stop().animate({ 'top': h1 + 'px'},  {duration: transitionTime, easing: transitionEase});
			split2.stop().animate({ 'top': -h1 + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd(target);
			}});
		}	
		else if(_splitCase == "verticalSplit"){
			split1.stop().animate({ 'left': - w1/2 + 'px'},  {duration: transitionTime, easing: transitionEase});
			split2.stop().animate({ 'left': w1 + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd(target);
			}});
		}	
	}
	
	//**************** REVEAL *************/
	
	function transitionReveal(){
		 transitionOn= true;
		 
		 var mainArr = mediaObj[activeCategory].main;
		 if(mainArr[getCounter()]){
			 var content = mainArr[getCounter()];
		 }else{
			//console.log('wait to load');
			showPreloader();
			loadRequest();
			return;
		 }
		 
		 var w = content[0].origWidth,
			 h = content[0].origHeight,
			 currentHolder = getEmptyHolder(true).css('display', 'block'),
			 w1 = getComponentSize('w'),
			 h1 = getComponentSize('h');
		 
		 if(forceImageFitMode || w > h1 || h > h1){
			 var obj = retrieveObjectRatio(componentHolder, w, h, imageFitMode);
			 w = obj.width;			
			 h = obj.height;	
		 }
		
		if(componentBgColor != undefined){
			_holder1.css('background', componentBgColor);
			_holder2.css('background', componentBgColor);
		}
		checkLink([content]);
		
		content.css({
			width: w + 'px',
			height: h + 'px',
			left: w1/2-w/2 + 'px',
			top: h1/2-h/2 + 'px'
		});
			 
		currentHolder.css({
			overflow: 'hidden',
			width: w1 + 'px',
			height: h1 + 'px',
			left: 0 + 'px',
			top: 0 + 'px'
		});
		
		hidePreloader();
		
		if(transitionIntroHappened){
			_revealCase = getRandomNotLast( _revealCaseArr );
			var otherHolder = getOtherHolder(currentHolder);
			swapChildren(otherHolder, currentHolder);
			currentHolder.append(content);
			executeReveal( otherHolder );//inTarget, outTarget
		}else{
			currentHolder.css('opacity', 0).append(content).stop().animate({ 'opacity': 1},  {duration: _firstImageTime, easing: _firstImageEase, complete: function(){
				transitionEnd();
			}});
		}
		transitionIntroHappened = true;
		 
	 }
		
	 function executeReveal(target) {
		if(_revealCase == "top"){
			target.stop().animate({ 'top': - getComponentSize('h') + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd(target);
			}});
		}
		else if(_revealCase == "bottom"){
			target.stop().animate({ 'top':getComponentSize('h') + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd(target);
			}});
		}
		else if(_revealCase == "right"){
			target.stop().animate({ 'left': getComponentSize('w') + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd(target);
			}});
		}
		else if(_revealCase == "left"){
			target.stop().animate({ 'left':- getComponentSize('w') + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd(target);
			}});
		}	
	}
	
	//**************** ALPHA *************/
	
	function transitionAlpha(){
		 //console.log('transitionAlpha');
		 transitionOn= true;
		 
		 var mainArr = mediaObj[activeCategory].main;
		 if(mainArr[getCounter()]){
			 var content = mainArr[getCounter()];
		 }else{
			//console.log('wait to load');
			showPreloader();
			loadRequest();
			return;
		 }
		 
		 var w = content[0].origWidth,
			 h = content[0].origHeight,
			 currentHolder = getEmptyHolder(true).css({display: 'block', opacity: 0}),
			 w1 = getComponentSize('w'),
			 h1 = getComponentSize('h');
		 
		 if(forceImageFitMode || w > w1 || h > h1){
			 var obj = retrieveObjectRatio(componentHolder, w, h, imageFitMode);
			 w = obj.width;			
			 h = obj.height;	
		}
		if(componentBgColor != undefined) componentHolder.css('background', componentBgColor);
		checkLink([content]);	
			
		content.css({
			width: w + 'px',
			height: h + 'px',
			left: w1/2-w/2 + 'px',
			top: h1/2-h/2 + 'px'
		});
			 
		currentHolder.css({
			overflow: 'hidden',
			width: w1 + 'px',
			height: h1 + 'px',
			left: 0 + 'px',
			top: 0 + 'px'
		}).append(content);	
		
		hidePreloader();
		
		if(transitionIntroHappened){//animate old out
			var otherHolder = getOtherHolder(currentHolder).stop().animate({ 'opacity':0},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd(otherHolder);
			}});
			//animate new in	
			currentHolder.stop().animate({ 'opacity': 1},  {duration: transitionTime, easing: transitionEase});
		}else{
			//animate new in	
			currentHolder.stop().animate({ 'opacity': 1},  {duration: transitionTime, easing: transitionEase, complete: function(){
				transitionEnd();
			}});
		}
		
		transitionIntroHappened = true;
	 }
	
	 //**************** ZOOM *************/
	 
	 function transitionZoom(){//zoom in
		 transitionOn= true;
		 
		 var mainArr = mediaObj[activeCategory].main;
		 if(mainArr[getCounter()]){
			 var content = mainArr[getCounter()];
		 }else{
			//console.log('wait to load');
			showPreloader();
			loadRequest();
			return;
		 }
		 
		 var w = content[0].origWidth,
			 h = content[0].origHeight,
			 w1 = getComponentSize('w'),
			 h1 = getComponentSize('h');
		 
		 if(forceImageFitMode || w > w1 || h > h1){
			 var obj = retrieveObjectRatio(componentHolder, w, h, imageFitMode);
			 w = obj.width;			
			 h = obj.height;	
		}
		if(componentBgColor != undefined) componentHolder.css('background', componentBgColor);
		checkLink([content]);
		
		var currentHolder = getEmptyHolder(true).css('display', 'block');
		var otherHolder = getOtherHolder(currentHolder);
		swapChildren(currentHolder, otherHolder);
		
		currentHolder.css({
			width: w1 + 'px',
			height: h1 + 'px',
			left: 0,
			top: 0,
			overflow: 'hidden'
		}).append(content);
		 
		//position randomly
		content.css({
			left: Math.random() * w1 + 'px',
			top: Math.random() * h1 + 'px',
			width: 0 + 'px',
			height: 0+ 'px'
		});	
		
		hidePreloader();
		
		if(transitionIntroHappened){	
			 content.animate({ 'width': w+ 'px', 'height': h+ 'px', 'left': getComponentSize('w')/2-w/2 + 'px', 'top':getComponentSize('h')/2-h/2 + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				 transitionEnd(otherHolder);
			}});
		}else{
			 content.animate({ 'width': w+ 'px', 'height': h+ 'px', 'left': getComponentSize('w')/2-w/2 + 'px', 'top':getComponentSize('h')/2-h/2 + 'px'},  {duration: transitionTime, easing: transitionEase, complete: function(){
				 transitionEnd();
			}});
		}
		
		transitionIntroHappened=true;
	 }
	 
	 function transitionEnd(otherHolder){
		 if(categoryTransitionOn) return;
		 if(otherHolder){
			 otherHolder.empty().css('display', 'none'); 
		 }
		 transitionOn=false;
		
		 mediaLoadedAction();
		 _thumbClick=false;//reset
		 
		 if(slideshowOn && !slideshowForcePause){
			if(controls_toggle.children('img'))controls_toggle.children('img').attr('src', ic_pause);
			getSlideshowDelay();
			startSlideshowTimer();
		}
	 }
		
	//*************** KEN BURNS **********/
	
	 function transitionKenBurns(){
		//console.log("transitionKenBurns");
		transitionOn=true;
		kenBurnsTransitionOn=true;
		
		var mainArr = mediaObj[activeCategory].main;
		if(mainArr[getCounter()]){
			 var content = mainArr[getCounter()];
		 }else{
			//console.log('wait to load');
			showPreloader();
			loadRequest();
			return;
		 }
		
		var w1 = getComponentSize('w'),
			h1 = getComponentSize('h'),
			originalWidth = content[0].origWidth,
			originalHeight = content[0].origHeight,data = $(categoryDataArr[getCounter()]),
			scaleRises = false;
		
		//get data
		var startScale=parseFloat(data.attr('data-startScale')); 
		if(isNaN(startScale) || startScale==0){
			startScale=1;
			//startScale=randomMinMax(0.8,1.8);
		}
		
		var endScale=parseFloat(data.attr('data-endScale')); 
		if(isNaN(endScale) || endScale==0){
			endScale=1.5;
			//endScale=randomMinMax(0.8,1.8);
		}
		
		/*
		//prevent same scale (not needed really, maybe user wants to slide picture from point to point without scale change)
		if(startScale == endScale){
			while (startScale == endScale){
				endScale = endScale=randomMinMax(0.8,1.8);
			}	
		}
		*/
		
		if(startScale < endScale) scaleRises = true;
		
		var startPosition=(data.attr('data-startPosition')).toLowerCase(); 
		if(isBlank(startPosition) || !matchInArray(startPosition, _kenBurnsPositions)){
			startPosition = getRandomArrayValue(_kenBurnsPositions);
		}
		
		var endPosition=(data.attr('data-endPosition')).toLowerCase(); 
		if(isBlank(endPosition) || !matchInArray(endPosition, _kenBurnsPositions)){
			endPosition = getRandomArrayValue(_kenBurnsPositions);
			while (endPosition == startPosition){//prevent same position, but only on random select in case user wants it
				//console.log(endPosition,startPosition);
				endPosition = getRandomArrayValue(_kenBurnsPositions);
				//console.log(endPosition,startPosition);
			}
		}
		
		//console.log('startScale, endScale, startPosition, endPosition = ', startScale, endScale, startPosition, endPosition);
		
		if(!kb_currentHolder){
			var currentHolder = getEmptyHolder(true);
		}else{
			var currentHolder = getOtherHolder(kb_currentHolder);
			kb_currentHolder.css('zIndex', 0);
			currentHolder.css('zIndex', 1);
		}
		
		currentHolder.css({opacity: !kb_introHappened ? 0 : 1,display: 'block'}).append(content);
		
		if(componentBgColor != undefined) componentHolder.css('background', componentBgColor);
		checkLink([content]);
		
		if(scaleRises){//start scale < end scale
		
			//get start size
			var startW = w1 * startScale;
			if(startW < w1) startW = w1;//minimum component width
			
			var startH = startW  * (originalHeight / originalWidth);
			if(startH < h1){//minimum component height; if height still not large enough, readjust height
				startH = h1;
				//reapply width after height resize
				startW = startH * (originalWidth / originalHeight);
			}
			
			//get end size
			var end_w = w1 * endScale;
			if(end_w < w1) end_w = w1;//minimum component width
			
			var end_h = end_w  * (originalHeight / originalWidth);
			if(end_h < h1){//minimum component height; if height still not large enough, readjust height
				end_h = h1;
				//reapply width after height resize
				end_w = end_h * (originalWidth / originalHeight);
			}
		
		}else{//end scale < start scale
			//if it reverses and the start/end values are too low, make end_w = w1 (& end_h proportionally), then make startW simply larger (& startH proportionally)
			
			//get end size
			var end_w = w1 * endScale;
			if(end_w < w1) end_w = w1;//minimum component width
			
			var end_h = end_w  * (originalHeight / originalWidth);
			if(end_h < h1){//minimum component height; if height still not large enough, readjust height
				end_h = h1;
				//reapply width after height resize
				end_w = end_h * (originalWidth / originalHeight);
			}
			
			//get start size
			var startW = w1 * startScale;
			if(startW <= end_w){//we need to make startW larger
				//console.log('custom enlarger');
				startW = end_w * 1.5;//custom enlarger
			}
			//apply height after width resize
			startH = startW * (originalHeight / originalWidth);
			if(startH < h1){//minimum component height; if height still not large enough, readjust height
				startH = h1;
				//reapply width after height resize
				startW = startH * (originalWidth / originalHeight);
			}
		}
		
		//console.log('scaleRises, startW, startH, end_w, end_h = ', scaleRises, startW, startH, end_w, end_h);
		
		currentHolder.css({
			width: startW + 'px',
			height: startH + 'px'
		});
		
		var startX,startY,endX,endY,startWidth=currentHolder.width(),startHeight=currentHolder.height();
		
		//console.log('originalWidth, originalHeight, startWidth, startHeight = ', originalWidth, originalHeight, startWidth, startHeight);
		
		//we wont touch start size any more so we can calculate start position
		
		switch (startPosition) {
			case "tl" :
				startX=0;
				startY=0;
				break;
			case "tc" :
				startX=w1/2 - startWidth/2;
				startY=0;
				break;
			case "tr" :
				startX=w1 - startWidth;
				startY=0;
				break;
			case "ml" :
				startX=0;
				startY=h1/2 -startHeight/2;
				break;
			case "mc" :
				startX=w1/2 - startWidth/2;
				startY=h1/2 -startHeight/2;
				break;
			case "mr" :
				startX=w1 - startWidth;
				startY=h1/2 -startHeight/2;
				break;
			case "bl" :
				startX=0;
				startY=h1 -startHeight;
				break;
			case "bc" :
				startX=w1/2 - startWidth/2;
				startY=h1 -startHeight;
				break;
			case "br" :
				startX=w1 - startWidth;
				startY=h1 -startHeight;
				break;
		}
		
		var finalWidth = end_w,finalHeight = end_h;
		
		//get end position for tween props
		var obj = getEndPositionKenBurns(endPosition, finalWidth, finalHeight);
		endX=obj.x;
		endY=obj.y;
		
		kbEndPosition=endPosition;//remember position for resize in transition off
		
		//console.log('startX,startY,endX,endY = ', startX,startY,endX,endY);
		
		//position on start
		currentHolder.css({
			left: startX+'px',
			top: startY+'px'
		});
		
		kb_prop = {startX: startX, startY: startY, startW: startW, startH: startH, endX:endX, endY:endY, finalWidth:finalWidth, finalHeight:finalHeight};
			
		hidePreloader();	
			
		if(slideshowOn)if(controls_toggle.children('img'))controls_toggle.children('img').attr('src', ic_pause);
		//if(slideshowOn && !slideshowForcePause){
			getSlideshowDelay();
		//}
		
		currentHolder.stop().animate({'opacity': 1},  {duration: kb_crossFadeTime, easing: "easeOutSine", queue: false, complete: function(){
			getOtherHolder($(this)).stop().empty().css('display', 'none');
			if(!kb_introHappened2)mediaLoadedAction();
			kb_introHappened2=true;
			kenBurnsTransitionOn=false;
			_thumbClick=false;//reset
			if(!slideshowOn && transitionOn){
				pauseKenBurns();
			}else if(kb_videoRequestPause){
				pauseKenBurns();
			}
		}});//fade in fast
		
		//rememeber kb animate props
		kb_currentHolder = currentHolder;
		
		if(slideshowOn){
			startSlideshowTimer();
			currentHolder.animate({'left': endX + 'px', 'top': endY+ 'px', 'width': finalWidth+ 'px', 'height': finalHeight+ 'px'},  {duration: slideshowDelay+kb_crossFadeTime, easing: "linear", queue: false, complete: function(){
				if(slideshowOn) $(this).empty().css('display', 'none');
			}});
		}else{
			transitionOn=false; 
		}
		
		kb_introHappened=true;
	}
	
	function pauseKenBurns(){
		if(!componentInited) return false;
		if(categoryTransitionOn)return false;
		if(kenBurnsTransitionOn)return false;//we need to wait for image at least to fade in (opacity part of the animation since we cant separate them)!
		//console.log('pauseKenBurns');
		kb_currentHolder.stop();
		stopSlideshowTimer();
		transitionOn=false;
	}

	function resumeKenBurns(){
		if(!componentInited) return false;
		if(categoryTransitionOn)return false;
		if(kenBurnsTransitionOn) return false;
		//console.log('resumeKenBurns');
		startSlideshowTimer();
		
		var endX = kb_prop.endX, endY = kb_prop.endY, finalWidth = kb_prop.finalWidth, finalHeight = kb_prop.finalHeight;
		kb_currentHolder.animate({'left': endX + 'px', 'top': endY+ 'px', 'width': finalWidth+ 'px', 'height': finalHeight+ 'px'},  {duration: slideshowDelay+kb_crossFadeTime, easing: "linear", queue: false, complete: function(){
			if(slideshowOn) $(this).empty().css('display', 'none');
		}});
		
		transitionOn=true;
	}
	
	function getEndPositionKenBurns(endPosition, finalWidth, finalHeight){
		var o = {},w1 = getComponentSize('w'), h1 = getComponentSize('h');
		switch (endPosition) {
			case "tl" :
				o.x=0;
				o.y=0;
				break;
			case "tc" :
				o.x=w1/2 - finalWidth / 2;
				o.y=0;
				break;
			case "tr" :
				o.x=w1 - finalWidth;
				o.y=0;
				break;
			case "ml" :
				o.x=0;
				o.y=h1/2 -finalHeight/2;
				break;
			case "mc" :
				o.x=w1/2 - finalWidth / 2;
				o.y=h1/2 -finalHeight/2;
				break;
			case "mr" :
				o.x=w1 - finalWidth;
				o.y=h1/2 -finalHeight/2;
				break;
			case "bl" :
				o.x=0;
				o.y=h1 -finalHeight;
				break;
			case "bc" :
				o.x=w1/2 - finalWidth / 2;
				o.y=h1 -finalHeight;
				break;
			case "br" :
				o.x=w1 - finalWidth;
				o.y=h1 -finalHeight;
				break;
		}
		return o;
	}
	
	/****************** HELPER FUNCTIONS **********************/
	
	//return opposite holder from given
	function getOtherHolder(holder) {
		var s;
		var name = holder.attr('data-title');
		if(name == '_holder1'){
			s = _holder2;
		}else{
			s = _holder1;
		}
		return s;
	}
	
	//swap children index, first sent child set to higher index
	function swapChildren(holder, holder2) {
		holder.css('zIndex', 1);
		holder2.css('zIndex', 0);
	}
	
	//return holder with no children
	function getEmptyHolder(empty) {
		var s,s2,numChildren = _holder1.children().size();
		
		if(empty){
			if(numChildren > 0){
				s = _holder2;
				s2 = _holder1;
			}else{
				s = _holder1;
				s2 = _holder2;
			}
		}else{
			if(numChildren > 0){
				s = _holder1;
				s2 = _holder2;
			}else{
				s = _holder2;
				s2 = _holder1;
			}
		}
		
		return s;
	}
	
	 function retrieveObjectRatio( obj, w, h, _fitScreen ) {
			
		var o ={};
		
		var _paddingX = 0;
		var _paddingY = 0;
		
		var objWidth = getComponentSize('w');
		var objHeight = getComponentSize('h');
		
		var targetWidth = w;
		var targetHeight = h;
		
		var destinationRatio = (objWidth - _paddingX) / (objHeight - _paddingY);///destination ratio of an object
		var targetRatio = targetWidth / targetHeight;///target ratio of an object

		if (targetRatio < destinationRatio) {
			
			//console.log('targetRatio < destinationRatio 1');
			
			if (!_fitScreen) {//fullscreen
				o.height = ((objWidth - _paddingX) / targetWidth) * targetHeight;
				o.width = (objWidth - _paddingX);
			} else {//fitscreen
				o.width = ((objHeight - _paddingY) / targetHeight) * targetWidth;
				o.height = (objHeight - _paddingY);
			}
		} else if (targetRatio > destinationRatio) {
			
			//console.log('targetRatio > destinationRatio 2');
			
			if (_fitScreen) {//fitscreen
				o.height = ((objWidth - _paddingX) / targetWidth) * targetHeight;
				o.width = (objWidth - _paddingX);
			} else {//fullscreen
				o.width = ((objHeight - _paddingY) / targetHeight) * targetWidth;
				o.height = (objHeight - _paddingY);
			}
		} else {//fitscreen & fullscreen
			o.width = (objWidth - _paddingX);
			o.height = (objHeight - _paddingY);
		}
		
		return o;
	}
	
	//check for blank string
	function isBlank(str) {
		var result = false;
		if(str.replace(/\s/g,"") == ""){
			result = true;
		}
		return result;
	}
	
	function getRandomNotLast( array ) {//this function is responsible for selecting from which side the next image should appear. As its name suggest, its configurated the way that it doesnt repeat the same side twice in a row.
		var index = Math.floor(Math.random() * (array.length - 1));
		var value = array.splice(index, 1)[0];
		array.push(value);
		return value;
	}
	
	function getRandomArrayValue(array) {
		var randomIndex = Math.round(Math.random()*(array.length-1));
		return array[randomIndex];
	}
	
	//returns a random value between min and max
	function randomMinMax(min, max) {
		return Math.random() * max - min + min;
	}
	
	//check equality
	function matchInArray(item, arr) {
		var i=0;
		var len=arr.length;
		var match;
		var arrItem;
		for(i;i<len;i++){
			arrItem = arr[i];
			//console.log(item, arrItem);
			if(item == arrItem){
				match = true;
				break;
			}
		}
		//console.log(match);
		return match;
	}
	
	function toggleSlideshow(buttonsOn){
		
		if(slideshowForcePause){
			if(!slideshowOn)slideshowOn=true;
			slideshowForcePause=false;
		}
		
		if(slideshowOn){
			stopSlideshowTimer();
			slideshowOn=false;
			if(!isMobile){
				if(controls_toggle.children('img'))controls_toggle.children('img').attr('src', buttonsOn ? ic_play_on : ic_play);
			}else{
				if(controls_toggle.children('img'))controls_toggle.children('img').attr('src', ic_play);
			}
			if(_transitionType == 'KEN_BURNS' && transitionOn)pauseKenBurns();
		}else{
			slideshowOn=true;
			if(!isMobile){
				if(controls_toggle.children('img'))controls_toggle.children('img').attr('src', buttonsOn ? ic_pause_on : ic_pause);
			}else{
				if(controls_toggle.children('img'))controls_toggle.children('img').attr('src', ic_pause);
			}
			if(!slideshowDelay) getSlideshowDelay();//first time if slideshow was off on begining
			if(_transitionType != 'KEN_BURNS'){
				if(!transitionOn){//otherwise its going to be triggered from end transition
					startSlideshowTimer();
				}
			}else{
				if(!transitionOn)resumeKenBurns();
			}
		}
	}
	
	function toggleSlideshow2(state){
		if(state){//start
			slideshowOn=true;
			if(controls_toggle.children('img'))controls_toggle.children('img').attr('src', ic_pause);
			if(!slideshowDelay) getSlideshowDelay();//first time if slideshow was off on begining
			if(_transitionType != 'KEN_BURNS'){
				if(!transitionOn){//otherwise its going to be triggered from end transition
					startSlideshowTimer();
				}
			}else{
				if(!transitionOn)resumeKenBurns();
			}
		}else{//stop
			stopSlideshowTimer();
			slideshowOn=false;
			if(controls_toggle.children('img'))controls_toggle.children('img').attr('src', ic_play);
			if(_transitionType == 'KEN_BURNS' && transitionOn)pauseKenBurns();
		}
	}
	
	function stopSlideshowTimer(){
		//console.log('stopSlideshowTimer');
		if(slideshowTimeoutID) clearTimeout(slideshowTimeoutID);
		if(slide_timer.length){
			slide_timer.stop();
		}
		if(slideshowDelay){
			kb_passedTime = (new Date().getTime() - kb_startTime);
			slideshowDelay -= kb_passedTime;
			//console.log('remaining: ', slideshowDelay);
		}
	}
	 
	function startSlideshowTimer(){
		//console.log('startSlideshowTimer');
		if(slideshowTimeoutID) clearTimeout(slideshowTimeoutID);
		kb_startTime = new Date().getTime();
		slideshowTimeoutID = setTimeout(nextMedia, slideshowDelay); 
		if(slide_timer.length){
			var w = getComponentSize('w');
			slide_timer.stop().animate({width: w+'px'},  {duration: slideshowDelay, easing: 'linear'});
		}
	}
	
	function getSlideshowDelay(){
		var delay, reserve= 3000;
		if(useGlobalDelay){
			if(currentData.attr('data-duration') != undefined){
				delay = parseFloat(currentData.attr('data-duration'), 10);
			}else{
				delay = origSlideshowDelay > 0 ? origSlideshowDelay : reserve;
			}
		}else{
			var data = $(categoryDataArr[getCounter()]);
			if(data.attr('data-duration') != undefined){
				delay = parseFloat(data.attr('data-duration'), 10);
			}else{
				delay = origSlideshowDelay > 0 ? origSlideshowDelay : reserve;
			}
		}
		slideshowDelay = delay;
		//console.log('getSlideshowDelay: ', slideshowDelay, _counter);
	}
	
	if(disableRightClick){
		_doc.bind("contextmenu",function(e){
			return false;
		});
	}
	
	function makeRandomList() {//make random set of numbers
		_randomArr = randomiseIndex(_playlistLength);
		//console.log(_randomArr);
	}
	
	function randomiseIndex(num){
		var arr = [], randomArr = [], i = 0, j = 0;
		
		for (i; i < num; i++) {//first fill the ordered set of indexes
			arr[i] = i;
		}
		
		j = 0;
		for (j; j < num; j++) { //then randomize those indexes
			var randomIndex = Math.round(Math.random()*(arr.length-1));
			randomArr[j] = arr[randomIndex];
			arr.splice(randomIndex, 1);
		}
		return randomArr;
	}
	
	function getCounter() {
		//console.log('getCounter');
		var i;
		if(_randomPlay){
			if(!_thumbClick){
				i = _randomArr[_counter];
			}else{
				i = _counter;
			}
		}else{
			i = _counter;
		}
		return i;
	}
	
	function preventSelect(arr){
		$(arr).each(function() {           
			$(this).attr('unselectable', 'on')
			   .css({
				   '-moz-user-select':'none',
				   '-webkit-user-select':'none',
				   'user-select':'none'
			   })
			   .each(function() {
				   this.onselectstart = function() { return false; };
			   });
		});
	}	
	
	function showPreloader(){
		componentPreloader.css({opacity:0, display: 'block'}).stop().animate({ 'opacity':1},  {duration: 500, easing: 'easeOutSine'});
	}
	
	function hidePreloader(){
		componentPreloader.stop().animate({ 'opacity':0},  {duration: 500, easing: 'easeOutSine', complete: function(){
			componentPreloader.css('display', 'none');
		}});
	}
	
	function isEmpty(str) {
	    return str.replace(/^\s+|\s+$/g, '').length == 0;
	}
	
	/*****************  CONTROLS *******************/
	
	function overControls(e){
		if(!componentInited) return;
		
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = e.currentTarget;
		var id = $(currentTarget).attr('class');
		
		if(id == 'music_toggle'){
			music_toggle.children('img').attr('src', ic_music_on);
		}
		else if(id == 'controls_prev'){
			controls_prev.children('img').attr('src', ic_prev_on);
		}
		else if(id == 'controls_toggle'){
			if(slideshowOn){
				controls_toggle.children('img').attr('src', ic_pause_on);
			}else{
				controls_toggle.children('img').attr('src', ic_play_on);
			}
		}
		else if(id == 'controls_next'){
			controls_next.children('img').attr('src', ic_next_on);
		}
		else if(id == 'info_toggle'){
			info_toggle.children('img').attr('src', ic_info_on);
		}
		else if(id == 'link_toggle'){
			link_toggle.children('img').attr('src', ic_link_on);
		}
		else if(id == 'playlist_toggle'){
			if(!playlistOpened){
				playlist_toggle.children('img').attr('src', ic_plus_on);
			}else{
				playlist_toggle.children('img').attr('src', ic_minus_on);
			}
		}
		else if(id=='gallery_fullscreen'){
			if(componentSize== "normal"){
				gallery_fullscreen.children('img').attr('src', ic_fullscreen_enter_on);
			}else{
				gallery_fullscreen.children('img').attr('src', ic_fullscreen_exit_on);
			}
		}
	}
	
	function outControls(e){
		if(!componentInited) return;
		
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = e.currentTarget;
		var id = $(currentTarget).attr('class');
		
		if(id == 'music_toggle'){
			music_toggle.children('img').attr('src', ic_music);
		}
		else if(id == 'controls_prev'){
			controls_prev.children('img').attr('src', ic_prev);
		}
		else if(id == 'controls_toggle'){
			if(slideshowOn){
				controls_toggle.children('img').attr('src', ic_pause);
			}else{
				controls_toggle.children('img').attr('src', ic_play);
			}
		}
		else if(id == 'controls_next'){
			controls_next.children('img').attr('src', ic_next);
		}
		else if(id == 'info_toggle'){
			info_toggle.children('img').attr('src', ic_info);
		}
		else if(id == 'link_toggle'){
			link_toggle.children('img').attr('src', ic_link);
		}
		else if(id == 'playlist_toggle'){
			if(!playlistOpened){
				playlist_toggle.children('img').attr('src', ic_plus);
			}else{
				playlist_toggle.children('img').attr('src', ic_minus);
			}
		}
		else if(id=='gallery_fullscreen'){
			if(componentSize== "normal"){
				gallery_fullscreen.children('img').attr('src', ic_fullscreen_enter);
			}else{
				gallery_fullscreen.children('img').attr('src', ic_fullscreen_exit);
			}
		}
	}
	
	function clickControls(e){
		if(!componentInited) return false;
		//console.log('clickControls');
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = e.currentTarget;
		var id = $(currentTarget).attr('class');
		
		if(id == 'music_toggle'){
			toggleAudio();
		}
		else if(id == 'controls_prev'){
			if(loadRequestPause) return;
			checkPrevious();
		}
		else if(id == 'controls_toggle'){
			toggleSlideshow(true);//buttons on
		}
		else if(id == 'controls_next'){
			if(loadRequestPause) return;
			checkNext();
		}
		else if(id == 'info_toggle'){
			if(!navigationActive) return;
			toggleInfo();
		}
		else if(id == 'link_toggle'){
			if(!navigationActive) return;
			toggleUrl();
		}
		else if(id == 'playlist_toggle'){
			togglePlaylist();
		}
		else if(id=='gallery_fullscreen'){
			toggleFullscreen();
		}
		return false;
	}
	
	function swipeHandler(direction){
		//console.log(direction);
		if(loadRequestPause) return;
		if(direction == 'right'){
			checkPrevious();
		}else if(direction == 'left'){
			checkNext();
		}
		return false;
	}
	
	function checkNext(){
		if(_transitionType != 'KEN_BURNS'){
			if(!transitionOn)nextMedia();
		}else{
			if(!kenBurnsTransitionOn)nextMedia();
		}	
	}
	
	function checkPrevious(){
		if(_transitionType != 'KEN_BURNS'){
			if(!transitionOn)previousMedia();
		}else{
			if(!kenBurnsTransitionOn)previousMedia();
		}
	}
	
	function checkMedia(id){
		//console.log('checkMedia');
		
		if(_transitionType != 'KEN_BURNS'){
			if(!transitionIntroHappened){
				
				stopSlideshowTimer();
				mediaUnloadedAction();
				enableActivePlaylistItem();
				_counter = id;
				disableActivePlaylistItem();
				callTransition();
					
			}else if(!transitionOn){
				
				stopSlideshowTimer();
				mediaUnloadedAction();
				enableActivePlaylistItem();
				_counter = id;
				disableActivePlaylistItem();
				callTransition();
				
			}	
		}else{
			if(!kenBurnsTransitionOn){
				
				stopSlideshowTimer();
				mediaUnloadedAction();
				enableActivePlaylistItem();
				_counter = id;
				disableActivePlaylistItem();
				callTransition();
			}
		}
	}
	
	function nextMedia(){
		//console.log('nextMedia');
		stopSlideshowTimer();
		mediaUnloadedAction();
		enableActivePlaylistItem();
		_counter++;
		
		if(_counter>_playlistLength-1){
			_counter=0;	
			if(slideshowAdvancesToNextCategory){
				//load next category
				activeCategory++;
				if(activeCategory>categoryLength-1) activeCategory = 0;
				//console.log(menuCounter,activeCategory);
				if(menuCounter + currentlyVisibleMenuItems-1<activeCategory){
					menuCounter =activeCategory;	
				}else if(activeCategory==0){
					menuCounter =activeCategory;	
				}
				if(useDeeplink){
					$.address.value(findAddress2(getCounter()));
					if(!$.address.history()) $.address.history(true);//restore history
				}else{
					cleanCategory();
				} 
				return;
			}
		}
		
		if(useDeeplink){
			$.address.value(findAddress2(getCounter()));
			if(!$.address.history()) $.address.history(true);//restore history
		}else{
			disableActivePlaylistItem();
			callTransition();
		} 
	}
	
	function previousMedia(){
		//console.log('previousMedia');
		stopSlideshowTimer();
		mediaUnloadedAction();
		enableActivePlaylistItem();
		_counter--;
		
		if(_counter<0){
			_counter=_playlistLength-1;	
			if(slideshowAdvancesToNextCategory){
				//load previous category
				activeCategory--;
				if(activeCategory<0) activeCategory = categoryLength-1;
				_counter=categoryArr[activeCategory].mediaName.length-1; 
				if(useDeeplink){
					$.address.value(findAddress2(getCounter()));
					if(!$.address.history()) $.address.history(true);//restore history
				}else{
					cleanCategory();
				} 
				return;
			}
		} 
		
		if(useDeeplink){
			$.address.value(findAddress2(getCounter()));
			if(!$.address.history()) $.address.history(true);//restore history
		}else{
			disableActivePlaylistItem();
			callTransition();
		} 
	}
	
	/***************** DATA *******************/
	
	function mediaLoadedAction(){
		
		var data = $(categoryDataArr[getCounter()]);
		
		checkSlideContent();
		
		//INFO
		if(useDescription){
			infoExist=false;//reset
			if(data.attr('data-description') != undefined && !isEmpty(data.attr('data-description'))){
				infoData = data.attr('data-description');
				infoExist = true;
				//console.log(infoData);
				
				infoHolder.css('width', 'auto').html(infoData);
				//console.log(infoHolder.css('width'));
				if(parseInt(infoHolder.css('width'), 10)>maxDescriptionWidth){
					infoHolder.css('width', maxDescriptionWidth+'px');
				}
				
				//show info btn
				if(useDescription){
					info_toggle.children('img').attr('src', ic_info);
					info_toggle.css({opacity: 0,display: 'block'}).stop().animate({ 'opacity': 1},  {duration: 400, easing: 'easeOutSine'});
				}
				
				if(autoOpenDescription) toggleInfo();
			}
		}
		
		//check video
		if(useVideo){
			if(data.attr('data-vimeo') != undefined){
				videoType = 'vimeo';
				videoLink = data.attr('data-vimeo');
				toggleVideoBtn('on');
			}else if(data.attr('data-youtube') != undefined){
				videoType = 'youtube';
				videoLink = data.attr('data-youtube');
				toggleVideoBtn('on');
			}else if(data.attr('data-localMp4') != undefined){
				videoType = 'local';
				var mp4 = data.attr('data-localMp4');
				var ogv = '';
				if(data.attr('data-localOgv') != undefined)ogv = data.attr('data-localOgv');
				var webm = '';
				if(data.attr('data-localWebm') != undefined)webm = data.attr('data-localWebm');
				var preview = '';
				if(data.attr('data-localPreview') != undefined)preview = data.attr('data-localPreview');
				videoLink = {'mp4': mp4, 'ogv': ogv, 'webm': webm, 'preview': preview};
				toggleVideoBtn('on');
			}
		}
		
		//LINK
		if(linkExist){
			//show link btn
			link_toggle.css({opacity: 0,display: 'block'}).stop().animate({ 'opacity': 1},  {duration: 400, easing: 'easeOutSine'});
		}
		navigationActive=true;
		
		if(typeof afterSlideChange !== 'undefined')afterSlideChange(getCounter());
	}
	
	function checkLink(arr){
		linkExist=false;//reset
		var data = $(categoryDataArr[getCounter()]);
		if(data.attr('data-link') != undefined){
			linkExist=true;
			_link=data.attr('data-link');
			if(data.attr('data-target') != undefined) _target=data.attr('data-target');
			if(!_target) _target="_blank";
			/*if(makeImageClickableForUrl){
				for(var i in arr){
					$(arr[i]).bind(_downEvent, toggleUrl);
					$(arr[i]).css('cursor','pointer');
				}
			}*/
			//console.log(_counter,_link,_target);
		}
	}
	
	function checkSlideContent(){
		//console.log('checkSlideContent');
		
		if(activeSlideContent){
			activeSlideContent.remove();
			activeSlideContent=null;	
		}
		
		var data = $(categoryDataArr[getCounter()]);
		//console.log(data);
		
		if(data.attr('data-caption-id') != undefined){
			
			var id = data.attr('data-caption-id');
			activeSlideContent = caption_holder.find(id).clone().css({display:'none'}).appendTo(componentHolder);
			//console.log(activeSlideContent);
			
			var startX,startY,endX,endY,ease,time,delay,content_item,data,len,i=0, highest_delay=0, t2;
			slideContentDataArr=[];
			
			len = activeSlideContent.children().size();
			//console.log('len = ', len);
			
			//first set all
			for(i; i < len; i++){
				data={};
				slideContentDataArr.push(data);			
				content_item = $(activeSlideContent.children()[i]);
				//console.log(content_item);
				data.content_item = content_item;
				data.startX = parseInt(content_item.attr('data-startX'),10);
				data.startY = parseInt(content_item.attr('data-startY'),10);
				data.endX = parseInt(content_item.attr('data-endX'),10);
				data.endY = parseInt(content_item.attr('data-endY'),10);
				data.ease = content_item.attr('data-ease');
				data.time = parseInt(content_item.attr('data-time'),10);
				data.delay = parseInt(content_item.attr('data-delay'),10);
				t2 = data.time+data.delay;
				if(t2> highest_delay)highest_delay = t2;//for end transition
				//position items
				content_item.css({
					position: 'absolute',
					opacity:0,
					left: data.startX+'px',
					top: data.startY+'px',
					zIndex:9//below playlist
				});
			}
			
			//then show all content
			activeSlideContent.css('display','block');
		
			i=0;//reset
			for(i; i < len; i++){
				data = slideContentDataArr[i];
				content_item=data.content_item;
				content_item.delay(data.delay).animate({left: data.endX+'px', top: data.endY+'px','opacity': 1},  {duration: data.time, easing: data.ease});
			}
		}
	}
	
	function removeSlideContent(){
		//console.log('removeSlideContent');
		if(slideContentDataArr.length){
			var i=0, data, content_item, len = slideContentDataArr.length, fast = 500, ease='easeOutQuint';
			for(i; i < len; i++){
				data = slideContentDataArr[i];
				content_item=data.content_item;
				//no delay, fast time, revert to beginning
				content_item.stop().animate({left: data.startX+'px', top: data.startY+'px','opacity': 0}, {duration: fast, easing: ease});
			}
			setTimeout(function(){
				if(activeSlideContent){
					activeSlideContent.remove();
					activeSlideContent=null;	
				}
				slideContentDataArr=[];	
			},fast);
		}
	}
	
	function mediaUnloadedAction(){//hide info and link btns, show preloader
		//console.log('mediaUnloadedAction');
		navigationActive=false;
		
		if(typeof beforeSlideChange !== 'undefined')beforeSlideChange(getCounter());
		
		removeSlideContent();
		
		slideshowDelay = null;
		
		if(slide_timer.length) slide_timer.stop().css('width', 0+'px');
		
		//check audio 
		if(useAudio && audioForcePause){
			audioForcePause=false;
			audioPlayerHolder.playAudio();
		}
		
		if(slideshowForcePause){
			slideshowForcePause=false;
			slideshowOn=true;//restore
		}
		
		if(useVideo){
			kb_videoRequestPause=false;
			if(videoPlayerOpened)toggleVideoPlayer('off',true);//clean video
			toggleVideoBtn('off');
		}
		
		if(useDescription){
			info_toggle.stop().animate({ 'opacity': 0},  {duration: 400, easing: 'easeOutSine', complete: function(){
				info_toggle.css('display', 'none');
			}});
			if(infoOpened){
				infoHolder.stop().animate({ 'opacity': 0},  {duration: 400, easing: 'easeOutSine', complete: function(){
					infoHolder.css('display', 'none');
				}});
				infoOpened=false;
			}
		}
		link_toggle.stop().animate({ 'opacity': 0},  {duration: 400, easing: 'easeOutSine', complete: function(){
			link_toggle.css('display', 'none');
		}});
	}
	
	function toggleInfo(){
		if(audioOpened)toggleAudio();
		if(!infoOpened){
			infoHolder.css({opacity:0, display: 'block'}).stop().animate({ 'opacity': 1},  {duration: 400, easing: 'easeOutSine'});
			infoOpened=true;
		}else{
			infoHolder.stop().animate({ 'opacity': 0},  {duration: 400, easing: 'easeOutSine', complete: function(){
				infoHolder.css('display', 'none');
			}});
			infoOpened=false;
		}
	}
	
	function toggleUrl(){
		if(!_link) return;
		if(_target=='_parent'){
			window.location.href=_link;
		}else if(_target=='_blank'){
			window.open(_link, _target);
		}
	}
	
	//***************** audio ***************//
	
	
	function toggleAudio(){
		if(!useAudio) return;
		if(infoOpened)toggleInfo();
		if(!audioOpened){
			audioPlayerHolder.css({opacity:0, display: 'block'}).stop().animate({ 'opacity': 1},  {duration: 400, easing: 'easeOutSine'});
			audioOpened=true;
			if(!audioIntroHappened){
				audioPlayerHolder.reinitNameScroll();
				audioIntroHappened=true;
			}
		}else{
			audioPlayerHolder.stop().animate({ 'opacity': 0},  {duration: 400, easing: 'easeOutSine', complete: function(){
				audioPlayerHolder.css('display', 'none');
			}});
			audioOpened=false;
		}
	}
	
	/***************** RESIZE *******************/
	
	function getComponentSize(side){
		//console.log('getComponentSize');
		var s;
		if(playlistPosition == 'top' || playlistPosition=='bottom'){
			if(playlistIndex != 'inside'){
				if(side == 'w'){
					s = componentWrapper.width();
				}else{
					s = componentWrapper.height()-componentPlaylist.height();
				}
			}else{
				if(side == 'w'){
					s = componentWrapper.width();
				}else{
					s = componentWrapper.height();
				}
			}
		}else if(playlistPosition == 'left' || playlistPosition=='right'){
			if(playlistIndex != 'inside'){
				if(side == 'w'){
					s = componentWrapper.width()-componentPlaylist.width();
				}else{
					s = componentWrapper.height();
				}
			}else{
				if(side == 'w'){
					s = componentWrapper.width();
				}else{
					s = componentWrapper.height();
				}
			}
		}
		return s;
	}
	
	if(!componentFixedSize){
		_window.resize(function() {
			 if(!componentInited || categoryTransitionOn) return false;
			 if(windowResizeTimeoutID) clearTimeout(windowResizeTimeoutID);
			 windowResizeTimeoutID = setTimeout(doneResizing, windowResizeTimeout);
		});
	}
	
	function doneResizing(){
		//console.log('doneResizing', transitionOn, kenBurnsTransitionOn);
		
		if(playlistIndex == 'outside'){
			if(playlistPosition=='left' || playlistPosition=='right'){
				componentHolder.css('width', getComponentSize('w') + 'px');//componentHolder size -= size of the componentPlaylist
			}else{
				componentHolder.css('height', getComponentSize('h') + 'px');
			}
		}
		
		if(!transitionOn){
			switch( _transitionType){
				case 'SLIDE':
					resizeSlide();
				break;	
				case 'SPLIT':
					resizeSplit();
				break;
				case 'REVEAL':
					resizeReveal();
				break;
				case 'ALPHA':
					resizeAlpha();
				break;
				case 'ZOOM':
					resizeZoom();
				break;
				case 'KEN_BURNS':
					resetCurrentImage();
				break;
			}
		}else{
			resetCurrentImage();
		}
		
		//align thumbs
		positionPlaylistHolder();
		getThumbHolderSize();
		
		//align menu
		if(!singleCategory) getMenuHolderSize();
	}
	
	function resetCurrentImage(){	
		
		stopSlideshowTimer();
		if(loadRequestIntervalID) clearInterval(loadRequestIntervalID);
		
		_holder1.stop().empty().css({
			zIndex:0,
			opacity:1,
			background:'none',
			overflow:'visible',
			display:'none'
		});
		_holder2.stop().empty().css({
			zIndex:1,
			opacity:1,
			background:'none',
			overflow:'visible',
			display:'none'
		});
		callTransition(true);
	}
	
	function resizeSplit(){	
	
		 var currentHolder = getEmptyHolder(false),
		 splitCase = currentHolder.splitCase,
		 split1=$(currentHolder.children('div[data-title=split1]')),
		 split2=$(currentHolder.children('div[data-title=split2]')),
		 cut,
		 content=split1.children('img'),
		 content2=split2.children('img'),
		 w = content[0].origWidth,
		 h = content[0].origHeight,
		 w1 = getComponentSize('w'),
		 h1 = getComponentSize('h');
		
		 if(forceImageFitMode || w > w1 || h > h1){
			 var obj = retrieveObjectRatio(componentHolder, w, h, imageFitMode);
			 w = obj.width;			
			 h = obj.height;	
		}
		
		content.css({
			width: w + 'px',
			height: h + 'px',
			left: w1/2-w/2 + 'px',
			top: h1/2-h/2 + 'px'
		});
		
		content2.css({
			width: w + 'px',
			height: h + 'px'
		});
			 
		currentHolder.css({
			width: w1 + 'px',
			height: h1 + 'px',
			left: 0 + 'px',
			top: 0 + 'px'
		});
		 
		 if(splitCase == 'horizontalUpLeft' || splitCase == 'horizontalUpRight' || splitCase == 'horizontalSplit'){
			 
			split1.css({
				top: 0,
				left: 0,
				width: w1 + 'px',
				height: h1/2 + 'px'
			});
			
			split2.css({
				top: h1/2 + 'px',
				left: 0,
				width: w1 + 'px',
				height: h1/2 + 'px'
			});
			
			cut = (h1 - h) / 2;
			
			//move second image inside
			content2.css({
				left: w1/2-w/2 + 'px',
				top: -h1/2+ cut + 'px'
			});
			 
		}else if(splitCase == 'verticalUpLeft' || splitCase == 'verticalDownLeft' || splitCase == 'verticalSplit'){
			 
			split1.css({
				top: 0,
				left: 0,
				width: w1 /2 + 'px',
				height: h1 + 'px'
			});
			
			split2.css({
				top: 0,
				left: w1 / 2 + 'px',
				width: w1 / 2 + 'px',
				height: h1 + 'px'
			});
			
			//move second image inside
			content2.css({
				left: - w/2 + 'px',
				top: h1/2- h/2 + 'px'
			});
			 
		}
	}
	
	function resizeReveal(){	
	
		 var currentHolder = getEmptyHolder(false),
			 content = currentHolder.children(),
			 w = content[0].origWidth,
			 h = content[0].origHeight,
			 w1 = getComponentSize('w'),
			 h1 = getComponentSize('h');
		 
		 if(forceImageFitMode || w > w1 || h > h1){
			 var obj = retrieveObjectRatio(componentHolder, w, h, imageFitMode);
			 w = obj.width;			
			 h = obj.height;	
		}
		
		content.css({
			width: w + 'px',
			height: h + 'px',
			left: w1/2-w/2 + 'px',
			top: h1/2-h/2 + 'px'
		});
			 
		currentHolder.css({
			width: w1 + 'px',
			height: h1 + 'px',
			left: 0 + 'px',
			top: 0 + 'px'
		});
		
	}
	
	function resizeSlide(){
	
		 var currentHolder = getEmptyHolder(false),
			 content = currentHolder.children(),
			 w = content[0].origWidth,
			 h = content[0].origHeight,
			 w1 = getComponentSize('w'),
			 h1 = getComponentSize('h');
		 
		 if(forceImageFitMode || w > w1 || h > h1){
			 var obj = retrieveObjectRatio(componentHolder, w, h, imageFitMode);
			 w = obj.width;			
			 h = obj.height;	
		}
		
		content.css({
			width: w + 'px',
			height: h + 'px',
			left: w1/2-w/2 + 'px',
			top: h1/2-h/2 + 'px'
		});
			 
		currentHolder.css({
			width: w1 + 'px',
			height: h1 + 'px'
		});
	
	}
	
	function resizeZoom(){	
		
		 var currentHolder = getEmptyHolder(false),
		 content = currentHolder.children(),
		 w = content[0].origWidth,
		 h = content[0].origHeight,
		 w1 = getComponentSize('w'),
		 h1 = getComponentSize('h');
		 
		 if(forceImageFitMode || w > w1 || h > h1){
			 var obj = retrieveObjectRatio(componentHolder, w, h, imageFitMode);
			 w = obj.width;			
			 h = obj.height;	
		}
		
		currentHolder.css({
			width: w1 + 'px',
			height: h1 + 'px',
			left: 0,
			top: 0
		});
		 
		content.css({
			width: w + 'px',
			height: h + 'px',
			left: w1/2-w/2 + 'px',
			top: h1/2-h/2 + 'px'
		});
	}
	
	function resizeAlpha(){
	
		 var currentHolder = getEmptyHolder(false),
			 content = currentHolder.children(),
			 w = content[0].origWidth,
			 h = content[0].origHeight,
			 w1 = getComponentSize('w'),
			 h1 = getComponentSize('h');
		 
		 if(forceImageFitMode || w > w1 || h > h1){
			 var obj = retrieveObjectRatio(componentHolder, w, h, imageFitMode);
			 w = obj.width;			
			 h = obj.height;
		}
			
		content.css({
			width: w + 'px',
			height: h + 'px',
			left: w1/2-w/2 + 'px',
			top: h1/2-h/2 + 'px'
		});
			 
		currentHolder.css({
			width: w1 + 'px',
			height: h1 + 'px',
			left: 0 + 'px',
			top: 0 + 'px'
		});	
			
	}
	
	// ******************************** PUBLIC API **************** //
	
	this.toggleSlideshow = function(state) {
		if(!componentInited) return false;
		if(categoryTransitionOn)return false;
		if(state == undefined){
			toggleSlideshow();
		}else{
			toggleSlideshow2(state);
		}
	}
	
	this.togglePlaylist = function() {
		if(!componentInited) return false;
		if(playlistIndex == 'inside') togglePlaylist();
	}
	
	this.nextItem = function() {
		if(!componentInited || loadRequestPause) return false;
		if(categoryTransitionOn)return false;
		stopSlideshowTimer();
		checkNext();
	}
	
	this.previousItem = function() {
		if(!componentInited || loadRequestPause) return false;
		if(categoryTransitionOn)return false;
		stopSlideshowTimer();
		checkPrevious();
	}
	
	this.loadItem = function(value) {
		if(!componentInited|| loadRequestPause) return false;
		if(categoryTransitionOn)return false;
		
		if(_transitionType != 'KEN_BURNS'){
			if(transitionOn)return false;
		}else{
			if(kenBurnsTransitionOn)return false;
		}	
		
		stopSlideshowTimer();
		
		if(typeof(value) === 'number'){
			if(value<0)value=0;
		    else if(value>_playlistLength-1)value=_playlistLength-1;
		}else if(typeof(value) === 'string'){
			if(!useDeeplink){
				alert('loadItem method accepts string parameter only if deeplink is used!');
				return false;	
			}
			//find counter for media name
			if(!findCounterByName(value)){
				//console.log('404');
				if(useDeeplink)$.address.history(false);//skip invalid url
				return false;
			}
			value=activeItem;//convert to counter			
		}else{
			alert('Invalid value for loadItem!');
			return false;
		}
		//console.log(value,_counter);
		if(value==_counter) return false;//already opened
		_thumbClick=true;
		enableActivePlaylistItem();
		
		if(useDeeplink){
			$.address.value(findAddress2(value));
			if(!$.address.history()) $.address.history(true);//restore history
		}else{
			checkMedia(value);
		}
	}
	
	this.loadCategory = function(value) {
		if(!componentInited) return false;
		if(categoryTransitionOn)return false;
		stopSlideshowTimer();
		
		if(typeof(value) === 'number'){
			if(value<0)value=0;
			else if(value>categoryLength-1)value=categoryLength-1;
		}else if(typeof(value) === 'string'){
			if(!useDeeplink){
				alert('loadCategory method accepts string parameter only if deeplink is used!');
				return false;	
			}
			//find activeCategory for category name
			if(!findAddress(value)){
				//console.log('404');
				$.address.history(false);//skip invalid url
				return false;
			}
			value=activeCategory;//convert to counter	
		}else{
			alert('Invalid value for openCategory!');
			return false;
		}
		//console.log(value, currentCategory);
		if(value == currentCategory) return false;
		categoryTransitionOn=true;
		enableActiveMenuItem();
		activeCategory = value;
		
		if(useDeeplink){
			$.address.value(findAddress2(0));
			if(!$.address.history()) $.address.history(true);//restore history
		}else{
			cleanCategory();
		}
	}
	
	$.fn.multiGallery.getSlideshowForcePause = function() {	
		return _self.getSlideshowForcePause();
	}
	$.fn.multiGallery.videoEnd = function() {	
		_self.videoEnd();
	}
	
	//callbacks from video gallery
	this.getSlideshow = function(){return slideshowOn};
	this.getSlideshowForcePause = function(){return slideshowForcePause};
	this.videoPlayerHolderState = function(){
		var value = true;
		if(videoPlayerHolder.css('display')=='none')value = false;
		return value;
	};
	
	this.closePlayer = function(){
		if(!componentInited) return false;
		if(categoryTransitionOn)return false;
		if(!useVideo) return false;
		if(videoTransitionOn) return false;
		videoTransitionOn=true;
		toggleVideoPlayer('off');
	};
	this.videoEnd = function(){
		if(!componentInited) return false;
		if(categoryTransitionOn)return false;
		if(!useVideo) return false;
		videoTransitionOn=true;
		toggleVideoPlayer('off');
	};
	
	
	//********* audio player callbacks ********//
	
	this.getAudioPlaylist = function(){
		if(!componentInited) return false;
		if(!useAudio) return;
		if(audioPlayerHolder)audioPlayerHolder.outputPlaylistData();
		
	};
	
	
	
	return this;
	
	}
	
	
})(jQuery);

