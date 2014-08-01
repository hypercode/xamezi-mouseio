// JavaScript Document

/* GALLERY CALLBACKS */
			function multiGallerySetupDone(){
				/* called when component is ready to receive public function calls */
				//console.log('multiGallerySetupDone');
				/*$width=window.innerWidth;
				$height=window.innerHeight;
				alert($width+' '+$height);
				$("li#parenT").each(function(i){
					$ratio='anime';
					$path=$(this).attr('data-imagePath').split('/');
					//$path=$path[0]+'/'+$path[1]+'/'+$subCategory+'/'+$path[3];
					$path=$path[0]+'/'+$ratio+'/'+$path[2];
					$(this).attr('data-imagePath',$path);
					//alert($path+" - "+i);
					});*/
			     
			}
			function beforeSlideChange(slideNum){
				//function called before slide change (plus slide number returned, counting starts from 0)
				//console.log('beforeSlideChange, slideNum = ', slideNum);			
			     unsetMap(slideNum);
			}
			function afterSlideChange(slideNum){
				//function called after slide change (plus slide number returned, counting starts from 0)
				//console.log('afterSlideChange, slideNum = ', slideNum);
				setMap(slideNum);
				
				
				
				// var $j = jQuery.noConflict();
				/* $('#'+slideNum).Jcrop({
						  onChange:   showCoords,
						  onSelect:   showCoords,
						  onRelease:  hideImgAreaComment,
						  onDblClick: imgAreaComment					
						 },function(){
						    jcrop_api = this;
							
						 })*/
						 
				/*$x1=0;
					$y1=0;
						$x2=200;
							$y2=200;
				
				
				var coords=[$x1,$y1,$x2,$y2];
		        jcrop_api.setSelect(coords);*/
			}
			/* END GALLERY CALLBACKS */
		
			/* VIDEO PLAYER SETTINGS FLASH */
			//flash embed part
			var flashvars = {};
			var params = {};
			var attributes = {};
			attributes.id = "flashPreview";
			params.quality = "high";
			params.scale = "noscale";
			params.salign = "tl";
			params.wmode = "transparent";
			params.bgcolor = "#111";
			params.devicefont = "false";
			params.allowfullscreen = "true";
			params.allowscriptaccess = "always";
			swfobject.embedSWF("preview.swf", "flashPreview", "100%", "100%", "9.0.0", "expressInstall.swf", flashvars, params, attributes);
			
			//functions called from flash
			var jsReady = false;//for flash/js communication
			function flashVideoEnd() {jQuery.fn.videoGallery.flashVideoEnd();}
			function flashVideoStart() {jQuery.fn.videoGallery.flashVideoStart();}
			function dataUpdateFlash(bl,bt,t,d) {jQuery.fn.videoGallery.dataUpdateFlash(bl,bt,t,d);}
			function flashVideoPause() {jQuery.fn.videoGallery.flashVideoPause();}
			function flashVideoResume() {jQuery.fn.videoGallery.flashVideoResume();}
			function flashMainPreviewOff() {jQuery.fn.videoGallery.flashMainPreviewOff();}
			function flashResizeControls() {jQuery.fn.videoGallery.flashResizeControls();}
			function getSlideshowForcePause() {return jQuery.fn.multiGallery.getSlideshowForcePause();}
			function videoEnd() {jQuery.fn.multiGallery.videoEnd();}
			function isReady() {return jsReady;}
			/* END VIDEO PLAYER SETTINGS FLASH */
			
			/* AUDIO PLAYER SETTINGS */
			//sound manager settings (http://www.schillmania.com/projects/soundmanager2/)
			soundManager.setup({
				url: 'audio_swf/', // path to SoundManager2 SWF files
				allowScriptAccess: 'always', 
				debugMode: false,
				noSWFCache: true,
				useConsole: false,
				waitForWindowLoad: true,
			    flashVersion: 9,
				useFlashBlock: true,
			    preferFlash: false,
				useHTML5Audio: true
			});
			
			var audio = document.createElement('audio'), mp3Support, oggSupport;
			if (audio.canPlayType) {
			 	mp3Support = !!audio.canPlayType && "" != audio.canPlayType('audio/mpeg');//setting this will use html5 audio on all html5 audio capable browsers ('modern browsers'), flash on the rest ('older browsers')
                //mp3Support=true;//setting this will use html5 audio on modern browsers that support 'mp3', flash on the rest of modern browsers that support 'ogv' like firefox and opera, and of course flash on the rest ('older browsers') 
                oggSupport = !!audio.canPlayType && "" != audio.canPlayType('audio/ogg; codecs="vorbis"');
			}else{
				mp3Support = true;
				oggSupport = false;
			}
			//console.log('mp3Support = ', mp3Support, ' , oggSupport = ', oggSupport);
			
			/*
			FF - false, true
			OP - false, true
			
			IE9 - true, false 
			SF - true, false 
			
			CH - true, true
			*/
		
		    soundManager.audioFormats = {
			  'mp3': {
				'type': ['audio/mpeg; codecs="mp3"', 'audio/mpeg', 'audio/mp3', 'audio/MPA', 'audio/mpa-robust'],
				'required': mp3Support
			  },
			  'mp4': {
				'related': ['aac','m4a'],
				'type': ['audio/mp4; codecs="mp4a.40.2"', 'audio/aac', 'audio/x-m4a', 'audio/MP4A-LATM', 'audio/mpeg4-generic'],
				'required': false
			  },
			  'ogg': {
				'type': ['audio/ogg; codecs=vorbis'],
				'required': oggSupport
			  },
			  'wav': {
				'type': ['audio/wav; codecs="1"', 'audio/wav', 'audio/wave', 'audio/x-wav'],
				'required': false
			  }
			};
			
			var ap_settings = {
				/* playerHolder: dom elements which holds the whole player */
				playerHolder: '.audioPlayer',
				/* playlistHolder: dom elements which holds list of playlists */
				playlistHolder: '#playlist_list',
				/* activePlaylist: set active playlist that will be loaded on beginning. 
				Leave empty for none like this: activePlaylist: '' */
				activePlaylist: '#audio_playlist2',
				/* activeItem: active item to start with when playlist is loaded (0 = first, 1 = second, 2 = third... -1 = none) */
				activeItem: 0,
				/* sound_id: unique string for soundmanager sound id (if multiple player instances were used, then strings need to be different) */
				sound_id: 'sound_id1',
	
				/*defaultVolume: 0-1 (Irrelevant on ios mobile) */
				defaultVolume:0.5,
				/*autoPlay: true/false (false on mobile by default) */
				autoPlay:false,
				/*autoLoad: true/false (auto start sound load) */
				autoLoad:false,
				/*randomPlay: true/false */
				randomPlay:false,
				/*loopingOn: true/false (loop on the end of the playlist) */
				loopingOn:true,
				
				/* autoSetSongTitle: true/false. Auto set song title in 'player_mediaName'. */
				autoSetSongTitle: true,
				
				/* useSongNameScroll: true/false. Use song name scrolling. */
				useSongNameScroll: true,
				/* scrollSpeed: speed of the scroll (number higher than zero). */
				scrollSpeed: 1,
				/* scrollSeparator: String to append between scrolling song name. */
				scrollSeparator: '&nbsp;&#42;&#42;&#42;&nbsp;',
				
				/* buttonsUrl: url of the buttons for normal and rollover state */
				buttonsUrl: {prev: '../tools/Gallery/media/data/audio_icons/prev.png', prevOn: '../tools/Gallery/media/data/audio_icons/prev_on.png', 
							 next: '../tools/Gallery/media/data/audio_icons/next.png', nextOn: '../tools/Gallery/media/data/audio_icons/next_on.png', 
							 pause: '../tools/Gallery/media/data/audio_icons/pause.png', pauseOn: '../tools/Gallery/media/data/audio_icons/pause_on.png',
							 play: '../tools/Gallery/media/data/audio_icons/play.png', playOn: '../tools/Gallery/media/data/audio_icons/play_on.png',
							 volume: '../tools/Gallery/media/data/audio_icons/volume.png', volumeOn: 'tools/Gallery/media/data/audio_icons/volume_on.png', 
							 mute: '../tools/Gallery/media/data/audio_icons/mute.png', muteOn: '../tools/Gallery/media/data/audio_icons/mute_on.png'},
				/* useAlertMessaging: Alert error messages to user (true / false). */
				useAlertMessaging: true,
				/* autoOpenAudioPlayer: true / false */
				autoOpenAudioPlayer: false
			};
			
			/* END AUDIO PLAYER SETTINGS */
			
			/* GALLERY SETTINGS */
			var kb_settings = {
				/* GENERAL */
				/* componentHolder: dom element which holds the whole component */
				componentHolder: '#componentWrapper',
				/* componentFixedSize: true/false. Responsive = false, fixed = true */
				componentFixedSize: false,
				/* disableRightClick: true/false  */
				disableRightClick: true,
				/* forceImageFitMode: true/false. By default, only images bigger than component size will get proportionally resized to 'fit inside' or 'fit outside' mode. If this is true, all images will be forced into that mode. */
				forceImageFitMode: true,
				
				/* DEEPLINKING SETTINGS */
				/* useDeeplink: true/false */
				useDeeplink:true,
				/* startUrl: deeplink start url, enter 'div' data-address/'li' data-address (two levels). Or just 'div' data-address (single level). */
				startUrl: 'category0/image0',
				
				/* NO DEEPLINKING SETTINGS */
				/* activeCategory: active category to start with (counting starts from zero, 0=first category, 1=second category, 2=third category... etc) */
				activeCategory:2,
				
				/* SLIDESHOW */
				/* slideshowOn; true, false */
				slideshowOn: false,
				/* useGlobalDelay; true, false (use same timer delay for all slides, if false you need to set individual delays for every slide -> data-duration attribute) */
				useGlobalDelay: true,
				/* slideshowAdvancesToNextCategory: true/false. On the end of current category, go to next one, instead of loop current one. */
				slideshowAdvancesToNextCategory: false,
				/* randomPlay; true, false (random image play in category) */
				randomPlay: false,
				
				/* DESCRIPTION */
				/* autoOpenDescription; true/false (automatically open description, if exist)  */
				autoOpenDescription: true,
				/* maxDescriptionWidth: max width of the description */
				maxDescriptionWidth: 250,
				
				/* PLAYLIST */
				/* autoAdjustPlaylist: true/false (auto adjust thumb playlist and playlist buttons) */
				autoAdjustPlaylist: true,
				/* playlistPosition: top, right, left, bottom  */
				playlistPosition: 'bottom',
				/* autoOpenPlaylist: true/false. Auto open playlist on beginning */
				autoOpenPlaylist: true,
				/* playlistHidden: true/false. (leave css display none on componentPlaylist) */
				playlistHidden: false,
				/* playlistIndex: inside/outside ('outside' opens above the image, while 'inside' sits outside of the image area and cannot be closed)  */
				playlistIndex: 'inside',
				
				/* MENU */
				/* menuOrientation: horizontal/vertical  */
				menuOrientation: 'horizontal',
				/* menuItemOffOpacity: opacity of menu item when inactive */
				menuItemOffOpacity:0.4,
				/* menuBtnSpace: space between menu buttons and the menu (enter 0 or more) */
				menuBtnSpace: 30,
				/* visibleMenuItems: visible menu items by default. Enter number (if they dont fit into provided area, the code will automatically reduce this number) or 'max' (maximum number that fits). */
				visibleMenuItems: 'max',
				/* fixMenu: true/false. false by default (menu centered). Can be true ONLY if 'visibleMenuItems' != 'max'. 
				Set this to true to fix it to one side. */
				fixMenu: false,
				/* fixMenuSettings: (if fixMenu = true), param1: side: -> left/right if menuOrientation = horizontal, top/bottom if menuOrientation = vertical, 
														 param2: value -> offset value in px from that side */
				fixMenuSettings: {side: 'top',value: 100},
				
				/* THUMBNAILS */
				/* thumbOrientation: horizontal/vertical  */
				thumbOrientation: 'horizontal',
				/* thumbOffOpacity: opacity of thumb when inactive */
				thumbOffOpacity:0.4,
				/* visibleThumbs: visible thumb items by default. Enter number (if they dont fit into provided area, the code will automatically reduce this number) or 'max' (maximum number that fits). */
				visibleThumbs: 'max',
				/* thumbBtnSpace:  space between thumb buttons and the thumbs (enter 0 or more) */
				thumbBtnSpace: 30,
				/* fixThumbs: true/false. false by default (thumbs centered). Can be true ONLY if 'visibleThumbs' != 'max'. 
				Set this to true to fix it to one side. */
				fixThumbs: false,
				/* fixThumbsSettings:  (if fixThumbs = true), param1: side -> left/right if thumbOrientation = horizontal, top/bottom if thumbOrientation = vertical,
															  param2: value -> offset value in px from that side */
				fixThumbsSettings: {side: 'top',value: 100},
				
				/* VIDEO SETTINGS */
				/* useVideo: true/false */
				useVideo: false,
				/* videoVolume: default volume for video (0-1) */
				videoVolume: 0.5,
				/* videoAutoPlay: true/false (Defaults to false on mobile) */
				videoAutoPlay: false,
				/* includeVideoInSlideshow: true/false (on video end resume slideshow, only if slideshow was playing before video request) */
				includeVideoInSlideshow: false,
				/* videoLoop: true/false (only if includeVideoInSlideshow = false) */
				videoLoop: false,
				/*playerBgOpacity: background opacity behind the video player when its opened (0-1) */
				playerBgOpacity:0.8,
				/*playerHolder: dom elements which holds the whole player */
				playerHolder:'#componentWrapper .videoPlayer',
				/*flashHolder: id of the flash movie */
				flashHolder:'#flashPreview',
				
				/* AUDIO SETTINGS */
				/* useAudio: true/false */
				useAudio: false
			};
			
			/* END GALLERY SETTINGS */
			