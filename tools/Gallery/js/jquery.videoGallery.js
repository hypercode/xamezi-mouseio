
/*
 * Responsive Video Gallery HTML5 Youtube Vimeo v1.1
 */


(function($) {

	function VideoGallery(element, options) {
		
		var self=this;
		
		this.settings = $.extend({}, $.fn.videoGallery.defaults, options);
		
		this.isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));//recheck
		//this.isMobile=true;
		//console.log(this.isMobile);
		this.useRollovers=this.isMobile?false:true;
		
		this.isIE = false;
		this.ieBelow9 = false;
		var ie_check = getInternetExplorerVersion();
		if (ie_check != -1){
			this.isIE = true;
			if(ie_check < 9)this.ieBelow9 = true;
		} 
		
		function getInternetExplorerVersion(){
		 //http://msdn.microsoft.com/en-us/library/ms537509%28v=vs.85%29.aspx
		 //Returns the version of Internet Explorer or a -1 (indicating the use of another browser).
		  var rv = -1; // Return value assumes failure.
		  if (navigator.appName == 'Microsoft Internet Explorer'){
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null){
			  rv = parseFloat( RegExp.$1 );
			}
		  }
		  return rv;
		}
		
		//http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
		this.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		//console.log(isSafari);
	
		//icons
		this.ic_volume = 'media/data/video_icons/volume.png';
		this.ic_volume_on = 'media/data/video_icons/volume_on.png';
		
		this.ic_mute = 'media/data/video_icons/mute.png';
		this.ic_mute_on = 'media/data/video_icons/mute_on.png';
		
		this.ic_pause = 'media/data/video_icons/pause.png';
		this.ic_pause_on = 'media/data/video_icons/pause_on.png';
		
		this.ic_play = 'media/data/video_icons/play.png';
		this.ic_play_on = 'media/data/video_icons/play_on.png';
		
		this.ic_fullscreen_enter = 'media/data/video_icons/fullscreen_enter.png';
		this.ic_fullscreen_enter_on = 'media/data/video_icons/fullscreen_enter_on.png';
		
		this.ic_fullscreen_exit = 'media/data/video_icons/fullscreen_exit.png';
		this.ic_fullscreen_exit_on = 'media/data/video_icons/fullscreen_exit_on.png';
		
		this.ic_player_prev = 'media/data/video_icons/v_prev.png';
		this.ic_player_prev_on = 'media/data/video_icons/v_prev_on.png';
		this.ic_player_next = 'media/data/video_icons/v_next.png';
		this.ic_player_next_on = 'media/data/video_icons/v_next_on.png';
		
		this.ic_w_play = 'media/data/video_icons/w_play.png';
		this.ic_w_pause = 'media/data/video_icons/w_pause.png';
		
		this._componentInited=false;
		this._body = $('body');
		this.bodyOverflowOrig = this._body.css('overflow');	
		this._window = $(window);
		this._doc = $(document);
		this._windowResizeInterval = 200;//execute resize delay
		this._windowResizeIntervalID;
		this._mediaPath;	
		this._mediaType;
		
		this._vimeoPlayer;
		this._youtubePlayer;
		this._vimeoInited=false;
		this._youtubeInited=false;
		this._youtubeChromeless = false;
		
		
		
		//multigallery setings
		this.mg_gallery = this.settings.mg_gallery;
		this.mg_settings = this.settings.mg_settings;
		this.mg_wrapper = this.settings.wrapper;
		this.wrapperOverflowOrig = this.mg_wrapper.css('overflow');
		
		this.includeVideoInSlideshow = this.mg_settings.includeVideoInSlideshow;
		//this.flashPreview = $(this.mg_settings.flashHolder);
		this.flashPreview = $('#flashPreview');
		this.autoPlay=this.mg_settings.videoAutoPlay;
		this.yt_autoPlay = this.mg_settings.videoAutoPlay;
		this.vim_autoPlay = this.mg_settings.videoAutoPlay;
		this.initialAutoplay= this.mg_settings.videoAutoPlay;
		this.videoLoop = this.mg_settings.videoLoop;
		this.defaultVolume =this.mg_settings.videoVolume;
		if(this.defaultVolume<0) this.defaultVolume=0;
		else if(this.defaultVolume>1)this.defaultVolume=1;
		
		this.componentWrapper = $(element);
			
		this.mediaPreloader = this.componentWrapper.find('.mediaPreloader').css('display','none');
		
		this.origPlayerSizeSet = false;
		this.origPlayerW;
		this.origPlayerH;
		this.player_close=$('.player_close').css('cursor', 'pointer').bind('click', function(){
			self.mg_gallery.closePlayer();
			return false;
		})
		if(self.useRollovers){
			this.player_close.bind('mouseover', function(){
				self.player_close.children('img').attr('src', self.ic_close_on); 
				return false;
			}).bind('mouseout', function(){
				self.player_close.children('img').attr('src', self.ic_close); 
				return false;
			});
		}
		
		this.playerRatio = this.componentWrapper.width()/this.componentWrapper.height();
		
		this.mediaHolder=this.componentWrapper.find('.mediaHolder');
		this.youtubeHolder=this.componentWrapper.find('.youtubeHolder');
		this.youtubeWrapper=this.componentWrapper.find('.youtubeWrapper');
		this._hideYT();
		this.vimeoHolder=this.componentWrapper.find('.vimeoHolder');
		
		this.flashPreviewHolder=this.componentWrapper.find('.flashPreviewHolder');
			
		this._componentWidth= this._getComponentSize('w');
		this._componentHeight= this._getComponentSize('h');
		
		//************* local player
		
		this.playerControls=this.componentWrapper.find('.playerControls');
		this.playerControlsOrigL = parseInt(this.playerControls.css('left'),10);
		this.player_mediaTime=this.componentWrapper.find('.player_mediaTime');
		
		this.isIOS=false;
		var agent = navigator.userAgent;
		if(agent.indexOf('iPhone') > -1 || agent.indexOf('iPod') > -1 || agent.indexOf('iPad') > -1) {
			 this.isIOS=true;
			 
			 //ios safari orientation change bug
			 /* var metas = document.getElementsByTagName('meta');
			  var i;
			  if (navigator.userAgent.match(/iPhone|iPad/i)) {
				for (i=0; i<metas.length; i++) {
				  if (metas[i].name == "viewport") {
					metas[i].content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
				  }
				}
				document.addEventListener("gesturestart", gestureStart, false);
			  }
			  function gestureStart() {
				for (i=0; i<metas.length; i++) {
				  if (metas[i].name == "viewport") {
					metas[i].content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
				  }
				}
			  }*/
			  
			  //ios changes
			  this.aspectRatio=1;//no elements above video!
		}
		this.isiPhoneIpod = agent.indexOf('iPhone') > -1 || agent.indexOf('iPod') > -1;
		
		if(this.isiPhoneIpod){
			this.componentWrapper.find('.playerControls').remove();
		}
		
		this.isAndroid = agent.indexOf("Android") > -1;
		if(this.isMobile){
			this.autoPlay =false;
			this.yt_autoPlay = false;
			this.vim_autoPlay = false;
		}
		
		this.vorbisSupport = this.canPlayVorbis();
		this.mp4Support = this.canPlayMP4();
		this.webMsupport = this.canPlayWebM();
		//console.log("vorbisSupport = " + vorbisSupport, ", mp4Support = " + mp4Support, ", webMsupport = " + webMsupport);
		this.html5Support=(!!document.createElement('video').canPlayType);
		//this.html5Support=false;
		//console.log(this.html5Support);
	
		this.fullscreenCount=0;
		this.fullscreenPossible = false;
		if(this.checkFullScreenSupport()){
			this.fullscreenPossible = true;
		}
		//console.log('fullscreenPossible = ', fullscreenPossible);
		
		if(this.fullscreenPossible){
			this._doc.on("fullscreenchange mozfullscreenchange webkitfullscreenchange", function(){
				//console.log('fullScreenStatus');
				self.setFullscreenIcon();
				if(self.componentSize== "fullscreen" && self.fullscreenCount>0){
					//console.log('fullscreenchange');
					self.componentSize="normal";
					self.resizeComponent();	
				}
				self.fullscreenCount=1;//firefox fix
			});
		}
		
		this.html5video_inited=false;
		this.previewPoster;
		this.bigPlay;
		if(this.html5Support){
			this.bigPlay = this.componentWrapper.find('.bigPlay').css('cursor','pointer').bind('click', function(){
				self.togglePlayBack();
				return false;
			});
		}
		this.autoHideControls=this.isMobile ? false : true;
		
		if(this.autoHideControls){
			this.componentHit=false;
			this.componentWrapper.mouseenter(function(e){       
				//console.log("enter");
				componentHit=true;
				self.showControls();
			}).mouseleave(function(){
				//console.log("leave");
				componentHit=false;
				self.hideControls();
			});
		}
	
		this.aspectRatio=1;
		this.videoInited=false;
		this._mediaPath;	
		this.mediaPlaying=false;
		
		this.flashReadyInterval = 100;
		this.flashReadyIntervalID;
		this.flashCheckDone=false;
		
		this.dataInterval = 100;//tracking media data
		this.dataIntervalID;
	
		this.mediaWidth;
		this.mediaHeight;
		this.componentSize = 'normal';
		this.video;
		this.videoUp2Js;
	
		this.mediaPreview=this.componentWrapper.find('.mediaPreview');
		
		var _downEvent = "";
		var _moveEvent = "";
		var _upEvent = "";
		var hasTouch;
		if("ontouchstart" in window) {
			var hasTouch = true;
			var _downEvent = "touchstart.ap";
			var _moveEvent = "touchmove.ap";
			var _upEvent = "touchend.ap";
		}else{
			var hasTouch = false;
			var _downEvent = "mousedown.ap";
			var _moveEvent = "mousemove.ap";
			var _upEvent = "mouseup.ap";
		}
		
		
		//seekbar
		this.seekPercent;
		this.seekBarDown=false;
		this.player_progress = this.componentWrapper.find('.player_progress');
		this.progress_bg = this.componentWrapper.find('.progress_bg');
		this.load_level = this.componentWrapper.find('.load_level');
		this.progress_level = this.componentWrapper.find('.progress_level');
		this.controlsMediaWidthDiff = 20;//width diff between media and the controls
		this.controlsSeekbarDiff = 280;//width of the controls minus width of all other stuff inside except seekbar
		this.seekBarSize=this.playerControls.width()-this.controlsSeekbarDiff;
		
		this.player_progress.css('cursor', 'pointer').bind(_downEvent,function(e){
			_onDragStartSeek(e);
			return false;		
		}); 
		
		//************* seekbar
		
		// Start dragging 
		function _onDragStartSeek(e) {
			if(!self._componentInited || self._playlistTransitionOn) return;
			if(self.volumebarDown) return;
			if(!self.seekBarDown){					
				var point;
				if(hasTouch){
					var currTouches = e.originalEvent.touches;
					if(currTouches && currTouches.length > 0) {
						point = currTouches[0];
					}else{	
						return false;						
					}
				}else{
					point = e;								
					e.preventDefault();						
				}
				self.seekBarDown = true;
				self._doc.bind(_moveEvent, function(e) { _onDragMoveSeek(e); });
				self._doc.bind(_upEvent, function(e) { _onDragReleaseSeek(e); });		
			}
			return false;	
		}
					
		function _onDragMoveSeek(e) {	
			var point;
			if(hasTouch){
				var touches;
				if(e.originalEvent.touches && e.originalEvent.touches.length) {
					touches = e.originalEvent.touches;
				}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
					touches = e.originalEvent.changedTouches;
				}else{
					return false;
				}
				// If touches more then one, so stop sliding and allow browser do default action
				if(touches.length > 1) {
					return false;
				}
				point = touches[0];	
				e.preventDefault();				
			} else {
				point = e;
				e.preventDefault();		
			}
			setProgress(point.pageX);
			
			return false;		
		}
		
		function _onDragReleaseSeek(e) {
			if(self.seekBarDown){	
				self.seekBarDown = false;			
				self._doc.unbind(_moveEvent).unbind(_upEvent);	
				
				var point;
				if(hasTouch){
					var touches;
					if(e.originalEvent.touches && e.originalEvent.touches.length) {
						touches = e.originalEvent.touches;
					}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
						touches = e.originalEvent.changedTouches;
					}else{
						return false;
					}
					// If touches more then one, so stop sliding and allow browser do default action
					if(touches.length > 1) {
						return false;
					}
					point = touches[0];	
					e.preventDefault();				
				} else {
					point = e;
					e.preventDefault();		
				}
				setProgress(point.pageX);
			}
			return false;
		}	
		
		function setProgress(x) {
			//console.log(x)
			var seekPercent = x - self.progress_bg.offset().left;
			if(seekPercent<0)seekPercent=0;
			else if(seekPercent>self.seekBarSize)seekPercent=self.seekBarSize;
			self.progress_level.width(seekPercent);
			
			var newPercent = Math.max(0, Math.min(1, seekPercent / self.seekBarSize));
			//console.log(newPercent);
			if(self.html5Support){
				var ct = newPercent * self.videoUp2Js.duration;
				var ct2f = ct.toFixed(1);
				//console.log(videoUp2Js.seekable, videoUp2Js.seekable.length)
				try{
					self.videoUp2Js.currentTime = ct2f;
				}catch(er){}
			}
		}
		
		this.player_progress_tooltip = this.componentWrapper.find('.player_progress_tooltip').css('left', parseInt(this.player_progress.css('left'), 10) + 'px');
		this.player_progress_tooltip_value = this.componentWrapper.find('.player_progress_tooltip_value');
		if(!this.isMobile)this.player_progress.bind('mouseover', mouseOverHandlerSeek);
		
		//************* seekbar tooltip
			
		function mouseOverHandlerSeek() {
			if(!self.videoInited) return;
			self.player_progress_tooltip.css('display', 'block');
			self.player_progress.bind('mousemove', mouseMoveHandlerSeekTooltip).bind('mouseout', mouseOutHandlerSeek);
			self._doc.bind('mouseout', mouseOutHandlerSeek);
		}
		
		function mouseOutHandlerSeek() {
			if(!self.videoInited) return;
			self.player_progress_tooltip.css('display', 'none');
			self.player_progress.unbind('mousemove', mouseMoveHandlerSeekTooltip).unbind('mouseout', mouseOutHandlerSeek);
			self._doc.unbind('mouseout', mouseOutHandlerSeek);
		}
		
		function mouseMoveHandlerSeekTooltip(e){
			var s = e.pageX - self.player_progress.offset().left;
			if(s<0) s=0;
			else if(s>self.seekBarSize) s=self.seekBarSize;
			
			var center = s + parseInt(self.player_progress.css('left'), 10) - self.player_progress_tooltip.width() / 2;
			self.player_progress_tooltip.css('left', center + 'px');
			
			var newPercent = Math.max(0, Math.min(1, s / self.seekBarSize));
			var value, fd;
			
			if(self.html5Support){
				value=newPercent * self.videoUp2Js.duration;
				//console.log(value);
				self.player_progress_tooltip_value.html(self.formatCurrentTime(value)+self.formatDuration(self.videoUp2Js.duration));
			}else{
				/*
				fd = getFlashMovie('flashPreview').pb_getFlashDuration();
				value=newPercent * fd;
				player_progress_tooltip_value.html(formatCurrentTime(value)+formatDuration(fd));
				*/
			}
			var center2 =  self.player_progress_tooltip.width() / 2 - self.player_progress_tooltip_value.width() / 2;
			self.player_progress_tooltip_value.css('left', center2 + 'px');
		}
		
		//volume
		this.player_volume =this.componentWrapper.find('.vplayer_volume');
		this._lastVolume = this.defaultVolume;
		this.volumebarDown=false;
		this.volume_seekbar = this.componentWrapper.find('.volume_seekbar');
		this.volume_bg = this.componentWrapper.find('.volume_bg');
		this.volume_level = this.componentWrapper.find('.volume_level');
		this.volumeSize=this.volume_bg.width();
		this.volume_level.css('width', this.defaultVolume*this.volumeSize+'px');
		if(this.defaultVolume == 0){
			this._lastVolume=0.5;//if we click unmute from mute on the beginning
			this.player_volume.find('img').attr('src', this.ic_mute);
		}else if(this.defaultVolume > 0){
			this.player_volume.find('img').attr('src', this.ic_volume);
		}
		
		//********* volume
		
		this.volume_seekbar.css('cursor', 'pointer').bind(_downEvent,function(e){
			_onDragStartVol(e);
			return false;		
		}); 
		
		// Start dragging 
		function _onDragStartVol(e) {
			if(!self._componentInited || self._playlistTransitionOn) return;
			if(self.seekBarDown) return;
			if(!self.volumebarDown){					
				var point;
				if(hasTouch){
					var currTouches = e.originalEvent.touches;
					if(currTouches && currTouches.length > 0) {
						point = currTouches[0];
					}else{	
						return false;						
					}
				}else{
					point = e;								
					e.preventDefault();						
				}
				self.volumebarDown = true;
				self._doc.bind(_moveEvent, function(e) { _onDragMoveVol(e); });
				self._doc.bind(_upEvent, function(e) { _onDragReleaseVol(e); });		
			}
			return false;	
		}
					
		function _onDragMoveVol(e) {	
			var point;
			if(hasTouch){
				var touches;
				if(e.originalEvent.touches && e.originalEvent.touches.length) {
					touches = e.originalEvent.touches;
				}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
					touches = e.originalEvent.changedTouches;
				}else{
					return false;
				}
				// If touches more then one, so stop sliding and allow browser do default action
				if(touches.length > 1) {
					return false;
				}
				point = touches[0];	
				e.preventDefault();				
			} else {
				point = e;
				e.preventDefault();		
			}
			volumeTo(point.pageX);
			
			return false;		
		}
		
		function _onDragReleaseVol(e) {
			if(self.volumebarDown){	
				self.volumebarDown = false;			
				self._doc.unbind(_moveEvent).unbind(_upEvent);	
				
				var point;
				if(hasTouch){
					var touches;
					if(e.originalEvent.touches && e.originalEvent.touches.length) {
						touches = e.originalEvent.touches;
					}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
						touches = e.originalEvent.changedTouches;
					}else{
						return false;
					}
					// If touches more then one, so stop sliding and allow browser do default action
					if(touches.length > 1) {
						return false;
					}
					point = touches[0];	
					e.preventDefault();				
				} else {
					point = e;
					e.preventDefault();		
				}
				
				volumeTo(point.pageX);
				
				if(self.defaultVolume == 0){
					self.player_volume.find('img').attr('src',  self.ic_mute);
					self.videoUp2Js.muted = true;
				}else if(self.defaultVolume > 0){
					self.player_volume.find('img').attr('src', self.ic_volume);
					self.videoUp2Js.muted = false;
				}
			}
			return false;
		}	
		
		function volumeTo(x) {
			self.defaultVolume = Math.max(0, Math.min(1, (x - self.volume_bg.offset().left) / self.volumeSize));
			self._setVolume();
		}
		
		this.player_volume_tooltip = this.componentWrapper.find('.player_volume_tooltip').css('left', parseInt(this.volume_seekbar.css('left'), 10) + 'px');
		this.player_volume_tooltip_value = this.componentWrapper.find('.player_volume_tooltip_value');
		if(!this.isMobile)this.volume_seekbar.bind('mouseover', mouseOverHandlerVolume);
		
		//************* volume tooltip
		
		function mouseOverHandlerVolume() {
			if(!self.videoInited) return;
			self.player_volume_tooltip.css('display', 'block');
			self.volume_seekbar.bind('mousemove', mouseMoveHandlerVolumeTooltip).bind('mouseout', mouseOutHandlerVolume);
			self._doc.bind('mouseout', mouseOutHandlerVolume);
		}
		
		function mouseOutHandlerVolume() {
			if(!self.videoInited) return;
			self.player_volume_tooltip.css('display', 'none');
			self.volume_seekbar.unbind('mousemove', mouseMoveHandlerVolumeTooltip).unbind('mouseout', mouseOutHandlerVolume);
			self._doc.unbind('mouseout', mouseOutHandlerVolume);
		}
		
		function mouseMoveHandlerVolumeTooltip(e){
			var s = e.pageX - self.volume_bg.offset().left;
			if(s<0) s=0;
			else if(s>self.volumeSize) s=self.volumeSize;
			
			var center = parseInt(self.playerControls.css('width'),10) + s - parseInt(self.volume_seekbar.css('right'), 10) - parseInt(self.volume_seekbar.css('width'), 10) + parseInt(self.volume_bg.css('left'), 10) - self.player_volume_tooltip.width()/2;
			self.player_volume_tooltip.css('left', center + 'px');
			
			var newPercent = Math.max(0, Math.min(1, s / self.volumeSize));
			var value=parseInt(newPercent * 100, 10);
			self.player_volume_tooltip_value.html(value+' %');
			var center2 =  self.player_volume_tooltip.width() / 2 - self.player_volume_tooltip_value.width() / 2;
			self.player_volume_tooltip_value.css('left', center2 + 'px');
		}
	
		if(!this.html5Support){
			this.mediaPreview.remove();
			this.mp4Support=true;
		}
			
		this.player_playControl = this.componentWrapper.find('.player_playControl').css('cursor', 'pointer').bind('click', function(){
			self.togglePlayBack();
			return false;
		})
		
		if(self.useRollovers){
			this.player_playControl.bind('mouseover', function(){
				if(self.mediaPlaying){
					self.componentWrapper.find('.player_playControl').find('img').attr('src',  self.ic_pause_on);
				}else{
					self.componentWrapper.find('.player_playControl').find('img').attr('src',  self.ic_play_on);
				}
				return false;
			}).bind('mouseout', function(){
				if(self.mediaPlaying){
					self.componentWrapper.find('.player_playControl').find('img').attr('src', self.ic_pause);
				}else{
					self.componentWrapper.find('.player_playControl').find('img').attr('src', self.ic_play);
				}
				return false;
			});
		}
		
		this.player_volume.css('cursor', 'pointer').bind('click', function(){
			if(self.defaultVolume == 0){//is muted
				self.defaultVolume = self._lastVolume;//restore last volume
				if(self.html5Support) self.videoUp2Js.muted = false;
				self._setVolume();
				self.player_volume.find('img').attr('src', self.ic_volume);
			}else{
				self._lastVolume = self.defaultVolume;//remember last volume
				if(self.html5Support) self.videoUp2Js.muted = true;
				self.defaultVolume = 0;//set mute on (volume to 0)
				self._setVolume();
				self.player_volume.find('img').attr('src',  self.ic_mute);
			}
			return false;
		})
		
		if(self.useRollovers){
			this.player_volume.bind('mouseover', function(){
				if(self.defaultVolume == 0){
					self.player_volume.find('img').attr('src', self.ic_mute_on);
				}else{
					self.player_volume.find('img').attr('src', self.ic_volume_on);
				}
				return false;
			}).bind('mouseout', function(){
				if(self.defaultVolume == 0){
					self.player_volume.find('img').attr('src', self.ic_mute);
				}else{
					self.player_volume.find('img').attr('src',  self.ic_volume);
				}
				return false;
			});
		}
		
		this.player_fullscreen = this.componentWrapper.find('.player_fullscreen').css('cursor', 'pointer').bind('click', function(){
			self.toggleFullscreen(true);
			return false;
		});
		if(self.useRollovers){
			this.player_fullscreen.bind('mouseover', function(){
				if(self.componentSize== "normal"){
					self.player_fullscreen.find('img').attr('src',self.ic_fullscreen_enter_on);
				}else{
					self.player_fullscreen.find('img').attr('src',  self.ic_fullscreen_exit_on);
				}
				return false;
			}).bind('mouseout', function(){
				if(self.componentSize== "normal"){
					self.player_fullscreen.find('img').attr('src', self.ic_fullscreen_enter);
				}else{
					self.player_fullscreen.find('img').attr('src',self.ic_fullscreen_exit);
				}
				return false;
			});
		}
	
	
	
		//***************** 
			
		this._window.bind('resize', function(){
			if(!self._componentInited) return false;
			if(self._windowResizeIntervalID) clearInterval(self._windowResizeIntervalID);
			self._windowResizeIntervalID = setTimeout(function() { self._doneResizing(); }, self._windowResizeInterval);
			return false;
		});
		
			
		this._doneResizing();	
		
		if(!this.html5Support){
			this.flashPreviewHolder.css('display', 'block');
			this.flashReadyIntervalID = setInterval(function(){
				if(self.getFlashMovie('flashPreview').setData != undefined){
					if(self.flashReadyIntervalID) clearInterval(self.flashReadyIntervalID);
					self.getFlashMovie('flashPreview').setData(
					self.mg_settings, 
					self.seekBarSize, 
					self.volumeSize, 
					self.controlsMediaWidthDiff, 
					self.isMobile,
					self.initialAutoplay);//pass data to flash
					c_ready();
				}
				
			}, this.flashReadyInterval);
		}else{
			this.flashPreviewHolder.remove();
			c_ready();
		}
		
		function c_ready(){
			self.componentWrapper.css({display:'none',opacity:1});
			if(!self.html5Support)self.flashPreviewHolder.css({opacity:1});
			if(!self._componentInited){
				self._componentInited=true;
				self.settings.videoGallerySetupDone.call(self);
			}	
		}
		
		
	} /* VideoGallery Constructor End */
	/* -------------------------------------VideoGallery Prototype------------------------------------------------------*/
	VideoGallery.prototype = {
			 
			playMedia:function() {
				if(!this._componentInited || this._playlistTransitionOn || !this._mediaType) return false;
				if(this._mediaType == 'local'){
					this.togglePlayBack();
				}else if(this._mediaType == 'vimeo'){
					if(this._vimeoPlayer) this._vimeoPlayer.play();
				}else if(this._mediaType == 'youtube'){
					if(this._youtubePlayer) this._youtubePlayer.play();
				}
				this.mediaPlaying=true;
			}, 
			pauseMedia:function() {	
				if(!this._componentInited || this._playlistTransitionOn || !this._mediaType) return false;
				if(this._mediaType == 'local'){
					this.togglePlayBack();
				}else if(this._mediaType == 'vimeo'){
					if(this._vimeoPlayer) this._vimeoPlayer.pause();
				}else if(this._mediaType == 'youtube'){
					if(this._youtubePlayer) this._youtubePlayer.pause();
				}
				this.mediaPlaying=false;
			},	
			setVolume:function(val) {
				if(!this._componentInited || this._playlistTransitionOn || !this._mediaType) return false;
				if(val<0) val=0;
				else if(val>1) val=1;
				this.defaultVolume=val;
				this._setVolume();
			}, 
			
			
			
			//************* LOCAL PLAYER
			
			loadPreview:function(url){
				//console.log('loadPreview');
				var self=this;
				
				this.mediaPreview.css('display', 'block');
				if(this.mediaPreloader) this.mediaPreloader.css('display','block');
		
				this.previewPoster = $(new Image()).css({
				   position: 'absolute',
				   display: 'block',
				   opacity: 0
				}).appendTo(this.mediaPreview).load(function() {
					self._resizeControls();
					if(self.mediaPreloader) self.mediaPreloader.css('display','none');
					self.resizePreview();
					self.previewPoster.animate({'opacity': 1},  {duration: 500, easing: "easeOutSine"});
					if(self.bigPlay) self.bigPlay.css('display','block');
				}).attr('src', url).error(function(e) {});	
			},
			
			//********** 
			
			togglePlayBack:function(){
				 //console.log('togglePlayBack');
				 var self=this;
				 if(!this.videoInited && !this.autoPlay){
					if(this.previewPoster) {
						this.previewPoster.stop().animate({ 'opacity':0},  {duration: 500, easing: 'easeOutSine', complete:function(){
							self.previewPoster.remove();
							self.previewPoster=null;
						}});
					}
					if(this.html5Support){
						this._initLocal();
					}else{
						if(typeof this.getFlashMovie("flashPreview") !== "undefined" && typeof this.getFlashMovie("flashPreview").pb_play !== "undefined")this.getFlashMovie('flashPreview').pb_play(this._mediaPath, this.aspectRatio);
						this._resizeControls();
					}
				 }else{
					if(this.html5Support){
						  if (this.videoUp2Js.paused) {
							  this.videoUp2Js.play();
						  } else {
							  this.videoUp2Js.pause();
						  }
					}else{
						if(typeof this.getFlashMovie("flashPreview") !== "undefined" && typeof this.getFlashMovie("flashPreview").pb_togglePlayback !== "undefined")this.getFlashMovie('flashPreview').pb_togglePlayback();
					}
				 }
				 this.videoInited=true;
				 return false;
			},
			
			//********** flash	
			
			flashResizeControls:function(){
				this._resizeControls();	
			},
			
			flashMainPreviewOff:function() {
				if(typeof this.getFlashMovie("flashPreview") !== "undefined"){
					if(typeof this.getFlashMovie("flashPreview").pb_play !== "undefined")this.getFlashMovie('flashPreview').pb_play(this._mediaPath, this.aspectRatio);
					this.videoInited=true;
				}
			},
			
			flashVideoPause:function(){
				this.mediaPlaying=false;	
			},
			
			flashVideoResume:function(){
				this.mediaPlaying=true;	
			},
			
			flashVideoEnd:function(){
				this._mediaAdvance();	
			},
			
			flashVideoStart:function(){
				this.videoInited =true;
				this.showControls();
			},
			
			dataUpdateFlash:function(bl,bt,t,d) {
				/*this.load_level.css('width', (bl/bt) * this.seekBarSize+'px');	
				this.progress_level.css('width', (t/d) * this.seekBarSize+'px');
				this.player_mediaTime.html(this.formatCurrentTime(t)+this.formatDuration(d));*/
			},
			
			getFlashMovie:function(name) {
				return (navigator.appName.indexOf("Microsoft") != -1) ? window[name] : document[name];
		    },
			
			//*********** end flash
		
			showControls:function(){
				if(!this.videoInited) return;
				//console.log('showControls');
				if(this.html5Support){
					this.playerControls.css('display','block');
				}else{
					if(typeof this.getFlashMovie("flashPreview") !== "undefined" && typeof this.getFlashMovie("flashPreview").pb_toggleControls !== "undefined")this.getFlashMovie('flashPreview').pb_toggleControls(true);
				} 
			},
			
			hideControls:function(){
				//console.log('hideControls');
				if(this.html5Support){
					this.playerControls.css('display','none');
				}else{
					if(!this.mg_gallery.videoPlayerHolderState())return;//must be visible!
					if(typeof this.getFlashMovie("flashPreview") !== "undefined" && typeof this.getFlashMovie("flashPreview").pb_toggleControls !== "undefined")this.getFlashMovie('flashPreview').pb_toggleControls(false);
				} 
			},
			
			resizeComponent:function(){
				//console.log('resizeComponent');
				//rendering issue over video fix? wtf? (desktop chrome, some mobiles...)
				if(this._mediaType == 'local' && this.html5Support)this.playerControls.css('left', 10000+'px');
				
				if(this.componentSize== "fullscreen"){
					this._body.css('overflow', 'hidden');
					this.mg_wrapper.css('overflow', 'visible');
					this.componentWrapper.removeClass('videoPlayer').addClass('videoPlayer_fs');
					this.player_close.css('display', 'none');//hide close player btn
				}else{
					this._body.css('overflow', this.bodyOverflowOrig);//restore defaults
					this.mg_wrapper.css('overflow', this.wrapperOverflowOrig);
					this.componentWrapper.removeClass('videoPlayer_fs').addClass('videoPlayer');
					this.player_close.css('display', 'block');//show close player btn
				}
				if(this._mediaType == 'local'){
					if(this.previewPoster) this.resizePreview();//needed for flash as well
					if(this.html5Support && this.videoInited){
						this.resizeVideo();
						this._resizeControls();	
						this.playerControls.css('left', this.playerControlsOrigL+'px');//restore
					}
				}
			},
			
			resizePreview:function() {
				if(!this.previewPoster) return;
				var o, x, y, img=this.previewPoster;
				 
				if(this.aspectRatio == 0) {//normal media dimensions
					
				}
				else if(this.aspectRatio == 1) {//fitscreen
					o = this.retrieveObjectRatio(true, img);
				}
				else if(this.aspectRatio == 2) {//fullscreen
					o = this.retrieveObjectRatio(false, img);
				}
				
				if(this.componentSize== "normal"){
					x = (this._getPlayerSize('w') - o.width) / 2;
					y = (this._getPlayerSize('h') - o.height) / 2;
				}else{
					x = (this._getComponentSize('w') - o.width) / 2;
					y = (this._getComponentSize('h') - o.height) / 2;
				}
				img.css({width: o.width+ 'px', height: o.height+ 'px', left:x+'px', top:y+'px'});
			},
			
			resizeVideo:function() {
				if(!this.video) return;
				//console.log('resizeVideo');
				var o, x, y;
				 
				if(this.aspectRatio == 0) {//normal media dimensions
					o=this.getMediaSize();
				}
				else if(this.aspectRatio == 1) {//fitscreen
					o = this.retrieveObjectRatio(true);
				}
				else if(this.aspectRatio == 2) {//fullscreen
					o = this.retrieveObjectRatio(false);
				}
				
				if(this.componentSize== "normal"){
					x = (this._getPlayerSize('w') - o.width) / 2;
					y = (this._getPlayerSize('h') - o.height) / 2;
				}else{
					x = (this._getComponentSize('w') - o.width) / 2;
					y = (this._getComponentSize('h') - o.height) / 2;
				}
				this.video.css({width: o.width+ 'px', height: o.height+ 'px', left:x+'px', top:y+'px'});
			 },
			
			 retrieveObjectRatio:function( _fitScreen, obj) {
				//console.log('retrieveObjectRatio');
				
				var _paddingX=0;
				var _paddingY=0;
			 
				if(this.componentSize== "normal"){
					var w = this._getPlayerSize('w');
					var h = this._getPlayerSize('h');
				}else{
					var w = this._getComponentSize('w');
					var h = this._getComponentSize('h');
				}
				//console.log('retrieveObjectRatio: ', w,h);
			 
				var targetWidth, targetHeight, val={};
				
				if(!obj){
					var obj = this.getMediaSize();
					targetWidth = obj.width;
					targetHeight = obj.height;
				}else{
					targetWidth = obj.width();
					targetHeight = obj.height();
				}

				//console.log('retrieveObjectRatio: ', targetWidth, targetHeight);
				
				var destinationRatio = (w - _paddingX) / (h - _paddingY);
				var targetRatio = targetWidth / targetHeight;
		
				if (targetRatio < destinationRatio) {
					//console.log(1);
					if (!_fitScreen) {//fullscreen
						val.height = ((w - _paddingX) /targetWidth) * targetHeight;
						val.width = (w - _paddingX);
					} else {//fitscreen
						val.width = ((h - _paddingY) / targetHeight) *targetWidth;
						val.height = (h - _paddingY);
					}
				} else if (targetRatio > destinationRatio) {
					//console.log(2);
					if (_fitScreen) {//fitscreen
						val.height = ((w - _paddingX) /targetWidth) * targetHeight;
						val.width = (w - _paddingX);
					} else {//fullscreen
						val.width = ((h - _paddingY) / targetHeight) *targetWidth;
						val.height = (h - _paddingY);
					}
				} else {//fitscreen & fullscreen
					//console.log(3);
					val.width = (w - _paddingX);
					val.height = (h - _paddingY);
				}
				
				return val;
			},
			
			getMediaSize:function() {
				var o={};
				if(this.videoUp2Js){
					o.width = this.videoUp2Js.videoWidth;
					o.height = this.videoUp2Js.videoHeight;
				}else{
					o.width = this._getPlayerSize('w');
					o.height = this._getPlayerSize('h');
				}
				//console.log(videoUp2Js.videoWidth, mediaWidth, videoUp2Js.videoHeight, mediaHeight);
				/*if(!this.mediaWidth || isNaN(this.mediaWidth) || !this.mediaHeight || isNaN(this.mediaHeight)){
					o.width = this.videoUp2Js.videoWidth;
					o.height = this.videoUp2Js.videoHeight;
				}else{
					o.width=this.mediaWidth;
					o.height=this.mediaHeight;	
				}*/
				return o;
			},
		
			resetData:function(){
			  this.player_mediaTime.html('00:00 | 00:00');
			  this.progress_level.css('width',0+'px');
			  this.load_level.css('width',0+'px');
			},
			
			canPlayVorbis:function() {
				var v = document.createElement('video');
				return !!(v.canPlayType && v.canPlayType('video/ogg; codecs="theora, vorbis"').replace(/no/, ''));
			},
			
			canPlayMP4:function() {
				var v = document.createElement('video');
				return !!(v.canPlayType && v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, ''));
			},
			
			canPlayWebM:function() {
				var v = document.createElement('video');
				return !!(v.canPlayType && v.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, ''));
			},
			
			formatCurrentTime:function(seconds) {
				seconds = Math.round(seconds);
				minutes = Math.floor(seconds / 60);
				minutes = (minutes >= 10) ? minutes : "0" + minutes;
				seconds = Math.floor(seconds % 60);
				seconds = (seconds >= 10) ? seconds : "0" + seconds;
				return minutes + ":" + seconds;
			},
			
			formatDuration:function(seconds) {
				seconds = Math.round(seconds);
				minutes = Math.floor(seconds / 60);
				minutes = (minutes >= 10) ? minutes : "0" + minutes;
				seconds = Math.floor(seconds % 60);
				seconds = (seconds >= 10) ? seconds : "0" + seconds;
				return " | " + minutes + ":" + seconds;
			},
			
			//**************** fullscreen
			
			setFullscreenIcon:function(){
				//console.log('setFullscreenIcon v p');
				if ((document.fullScreenElement && document.fullScreenElement !== null) ||   
					  (!document.mozFullScreen && !document.webkitIsFullScreen)) { 
					   this.player_fullscreen.children('img').attr('src', this.ic_fullscreen_enter); 
				}else{
					   this.player_fullscreen.children('img').attr('src', this.ic_fullscreen_exit); 
				}
			},
			
			fullScreenStatus:function(){
				return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen;
			},
			
			toggleFullscreen:function(btnInitiated){
				
				//check if we are already in fgallery fullscreen so in that case only make video fullscreen not gallery
				if(this.fullScreenStatus()){//already in gallery fs mode
					 
					if(!this.fullscreenPossible) {
						this._doneResizing();	
					}else if(this.componentSize=="normal" && btnInitiated){
						this.componentSize= "fullscreen";
						this.resizeComponent();	
					}else{
						this.componentSize="normal";
						this.resizeComponent();	
					}
					
				}else{
				
					this.fullscreenCount=0;
			
					if(this.componentSize== "normal"){
						this.componentSize= "fullscreen";
						if(!this.fullscreenPossible)this.componentWrapper.find('.player_fullscreen').find('img').attr('src', this.ic_fullscreen_exit); //manual fs icon change in 'full window' mode
					}else{
						this.componentSize="normal";
						if(!this.fullscreenPossible)this.componentWrapper.find('.player_fullscreen').find('img').attr('src', this.ic_fullscreen_enter);
					}
					
					//http://stackoverflow.com/questions/8427413/webkitrequestfullscreen-fails-when-passing-element-allow-keyboard-input-in-safar
					//https://github.com/martinaglv/jQuery-FullScreen/blob/master/fullscreen/jquery.fullscreen.js#L82
							
					if(this.fullscreenPossible || this.html5Support){
				   
					  if ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method
						  (!document.mozFullScreen && !document.webkitIsFullScreen)) {               // current working methods
						if (document.documentElement.requestFullScreen) {
						  document.documentElement.requestFullScreen();
						} else if (document.documentElement.mozRequestFullScreen) {
						  document.documentElement.mozRequestFullScreen();
						} else if (document.documentElement.webkitRequestFullScreen) {
						  //document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
						  document.documentElement.webkitRequestFullScreen();
						  //console.log('webkitRequestFullScreen');
						}else if(this.isIOS){
							//console.log('ios');
							try{
								//if(this.videoUp2Js && this.videoUp2Js.webkitEnterFullScreen != undefined)this.videoUp2Js.webkitEnterFullScreen();
							}catch(error){}
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
					
					if(!this.fullscreenPossible) {
						this._doneResizing();	
					}else if(this.componentSize=="normal" && btnInitiated){
						this.resizeComponent();	
					}
				}
			},
			
			checkFullScreenSupport:function() {
			   var support=false;
				if (document.documentElement.requestFullScreen) {
				  support=true;
				} else if (document.documentElement.mozRequestFullScreen) {
				   support=true;
				} else if (document.documentElement.webkitRequestFullScreen) {
				   support=true;
				}
				return support;
			},

			_findMedia:function (type, url) {
				//console.log('this._findMedia, c = ', this._playlistManager.getCounter());
				this._cleanMedia();
				this._mediaType = type;
				//console.log(type, url);
				
				if(this._mediaType == 'local'){
					
					var previewPath=url.preview;
					if(this.mp4Support){
						this._mediaPath=url.mp4;
					}else if(this.vorbisSupport){
						this._mediaPath=url.ogv;
					}else if(this.webmSupport){
						this._mediaPath=url.webm;
					} 
				
					if(this.autoPlay){
						if(this.html5Support){
							this._resizeControls();
							this._initLocal();
						}else{
							//console.log('flash autoplay');
							if(typeof this.getFlashMovie("flashPreview") !== "undefined" && typeof this.getFlashMovie("flashPreview").pb_play !== "undefined")this.getFlashMovie('flashPreview').pb_play(this._mediaPath, this.aspectRatio);
							this._resizeControls();
							this.videoInited=true;
						}
					}else{
						
						if(this.html5Support){
							this.loadPreview(previewPath);
						}else{
							if(typeof this.getFlashMovie("flashPreview") !== "undefined" && typeof this.getFlashMovie("flashPreview").pb_loadPreview !== "undefined")this.getFlashMovie('flashPreview').pb_loadPreview(previewPath);//we need preview image in flash because of flash fullscreen!
						}
					}
					
				}else if(this._mediaType == 'vimeo'){
					this._mediaPath = url;
					this._initVimeo();
				}else if(this._mediaType == 'youtube'){
					this._mediaPath = url;
					this._initYoutube();
				}else{
					alert('Wrong data-type in playlist!');	
				}
			},
			_cleanMedia:function () {
				//console.log('this._cleanMedia');
				if(this._mediaType == 'local'){
					
					this.mediaPreview.css('display', 'none');
					
					this.hideControls();
					
					if(this.html5Support){
						if(this.videoUp2Js){
							this.videoUp2Js.pause();
							try{
								this.videoUp2Js.currentTime = 0;
							}catch(er){}
							this.videoUp2Js.src = '';
						}
						//video.find('source').attr('src','');
						if(this.video)this.video.unbind("ended loadedmetadata waiting playing play pause");
						//video.unbind("canplaythrough", canplaythroughHandler).unbind("canplay", canplayHandler).unbind("volumechange", volumechangeHandler).unbind("timeupdate", dataUpdate);
						this.mediaHolder.css('display', 'none');
						if(!this.isMobile & this.html5Support){
							this.mediaHolder.html('');
							this.html5video_inited=false;	
						}
								
					}else{
						if(typeof this.getFlashMovie("flashPreview") !== "undefined" && typeof this.getFlashMovie("flashPreview").pb_dispose !== "undefined")this.getFlashMovie('flashPreview').pb_dispose();
					}
					if(this.bigPlay) this.bigPlay.css('display', 'none'); 
					if(this.mediaPreloader) this.mediaPreloader.css('display', 'none'); 
					if(this.previewPoster){
						this.previewPoster.remove();
						this.previewPoster=null;
					} 
					
					this.resetData();
					this.mediaPlaying=false;
					this.videoInited=false;//reset
					
				}else if(this._mediaType == 'vimeo'){
					if(this._vimeoPlayer) this._vimeoPlayer.clean();
				}else if(this._mediaType == 'youtube'){
					if(this._youtubePlayer)this._youtubePlayer.stop();
					this._hideYT();
				}
			},
			_setVolume:function () {
				if(this._mediaType == 'local'){
					this.volume_level.width(this.defaultVolume*this.volumeSize);
					if(this.html5Support){
						this.videoUp2Js.volume = this.defaultVolume;
					}else{
						if(typeof this.getFlashMovie("flashPreview") !== "undefined" && typeof this.getFlashMovie("flashPreview").pb_setVolume !== "undefined")this.getFlashMovie('flashPreview').pb_setVolume(this.defaultVolume); 
					}
				}else if(this._mediaType == 'vimeo'){
					if(this._vimeoPlayer) this._vimeoPlayer.setVolume(this.defaultVolume);
				}else if(this._mediaType == 'youtube'){
					if(this._youtubePlayer) this._youtubePlayer.setVolume(this.defaultVolume);
				}
			},
			//************* LOCAL
			_initLocal:function () {
				var self=this;

				if(!this.html5video_inited){//we need one video source if we want to auto-advance on ios6 (with no click)

					var videoCode='';
					if(this.mp4Support){
						if(!this.isAndroid){
							videoCode += '<video class="video_cont" width="100%" height="100%" >';
							videoCode += '<source src="'+this._mediaPath+'"  type="video/mp4" />';
							videoCode += '</video>';
						}else{
							videoCode += '<video class="video_cont" width="100%" height="100%" >';
							videoCode += '<source src="'+this._mediaPath+'" />';
							videoCode += '</video>';
						}
					}else if(this.vorbisSupport){
						if(!this.isAndroid){
							videoCode += '<video class="video_cont" width="100%" height="100%" >';
							videoCode += '<source src="'+this._mediaPath+'"  type="video/ogg" />';
							videoCode += '</video>';
						}else{
							videoCode += '<video class="video_cont" width="100%" height="100%" >';
							videoCode += '<source src="'+this._mediaPath+'" />';
							videoCode += '</video>';
						}
					}else if(this.webMsupport){
						if(!this.isAndroid){
							videoCode += '<video class="video_cont" width="100%" height="100%" >';
							videoCode += '<source src="'+this._mediaPath+'"  type="video/webm" />';
							videoCode += '</video>';
						}else{
							videoCode += '<video class="video_cont" width="100%" height="100%" >';
							videoCode += '<source src="'+this._mediaPath+'" />';
							videoCode += '</video>';
						}
					} 
					
					this.mediaHolder.css('display','block').html(videoCode);
				
					this.video = this.mediaHolder.find('.video_cont');//get player reference
					this.videoUp2Js = this.video[0];
					//console.log(video, videoUp2Js);
					
				}else{
					
					this.mediaHolder.css('display','block');
					this.videoUp2Js.src = this._mediaPath;
					this.videoUp2Js.load();
					
				}
				
				this.videoUp2Js.volume = this.defaultVolume;
				this.video.css('position','absolute').bind("ended", function(){
					//console.log('videoEndHandler');
					if(self.mg_gallery.getSlideshowForcePause()){//check if slideshow was running before video request
						if(self.includeVideoInSlideshow){
							self.mg_gallery.videoEnd();
						}else{
							try{
								self.videoUp2Js.currentTime=0;
							}catch(er){}
							if(self.videoLoop){
								if(self.videoUp2Js.paused)self.videoUp2Js.play();
							}else{
								self.videoUp2Js.pause();
							}	
						}
					}else{
						try{
							self.videoUp2Js.currentTime=0;
						}catch(er){}
						if(self.videoLoop){
							if(self.videoUp2Js.paused)self.videoUp2Js.play();
						}else{
							self.videoUp2Js.pause();
						}
					}	
				}).bind("loadedmetadata", function(){
					//console.log("videoMetadata: ", self.videoUp2Js.duration, self.videoUp2Js.videoWidth, self.videoUp2Js.videoHeight);
					self.resizeVideo();
					if(self.dataIntervalID) clearInterval(self.dataIntervalID);
					self.dataIntervalID = setInterval(function(){
						//console.log(formatCurrentTime(videoUp2Js.currentTime), formatDuration(videoUp2Js.duration));
						if(!isNaN(self.videoUp2Js.currentTime) && !isNaN(self.videoUp2Js.duration)){
							self.player_mediaTime.html(self.formatCurrentTime(self.videoUp2Js.currentTime)+self.formatDuration(self.videoUp2Js.duration));
						}
						
						if(!self.seekBarDown){
							self.progress_level.css('width', (self.videoUp2Js.currentTime / self.videoUp2Js.duration) * self.seekBarSize+'px');
							try{
								var buffered = Math.floor(self.videoUp2Js.buffered.end(0));
							}catch(error){}
							var percent = buffered / Math.floor(self.videoUp2Js.duration);
							//console.log(buffered);
							if(!isNaN(percent)){//opera has no buffered 
								self.load_level.css('width', percent * self.seekBarSize+'px');	
							}else{
								//console.log(videoUp2Js.readyState);
								if(self.videoUp2Js.readyState == 4){//for opera
									//loadProgress.css('width', _getPlayerSize('w'));
								}
							}
						}	
					}, self.dataInterval);
					
					self.videoUp2Js.play();
					self.videoInited=true;
					
					if(self.isMobile && self.initialAutoplay) self.autoPlay=true;
					self.showControls();
					
					if(self.isIOS){//ios rendering bug
						 self._resizeControls();
					}
					
					if(self.fullScreenStatus())self.player_fullscreen.children('img').attr('src', self.ic_fullscreen_enter);//already in gallery fs mode, restore video fs icon, video not fs yet
						
				}).bind("waiting",function(){
					//console.log('waitingHandler');
					if(self.mediaPreloader) self.mediaPreloader.css('display','block');
				}).bind("playing", function(){
					//console.log('playingHandler');
					if(self.mediaPreloader) self.mediaPreloader.css('display','none');
				}).bind("play", function(){
					//console.log('playHandler');
					self.componentWrapper.find('.player_playControl').find('img').attr('src', self.ic_pause);	
					if(self.bigPlay) self.bigPlay.css('display','none');
					self.mediaPlaying=true;	
				}).bind("pause", function(){
					//console.log('pauseHandler');
					self.componentWrapper.find('.player_playControl').find('img').attr('src', self.ic_play);
					if(self.bigPlay) self.bigPlay.css('display','block');
					self.mediaPlaying=false;	
				});
				//video.bind("canplaythrough", canplaythroughHandler).bind("canplay", canplayHandler).bind("volumechange", volumechangeHandler).bind("timeupdate", dataUpdate);
					
				if(this.isIOS && !this.html5video_inited){
					this.videoUp2Js.src = this._mediaPath;
					this.videoUp2Js.load();
				}
				else if(this.isAndroid && !this.html5video_inited){
					this.videoUp2Js.play();
					
					if(this.bigPlay) this.bigPlay.css('display', 'none');  
					if(this.previewPoster){
						this.previewPoster.stop().animate({ 'opacity':0},  {duration: 500, easing: 'easeOutSine', complete:function(){
							self.previewPoster.remove();
							self.previewPoster=null;
						}});
					}
					this.videoInited=true;
					this.showControls();
				}
				
				this.html5video_inited=true;
			},
			//************* VIMEO
			_initVimeo:function () {
				//console.log('this._initVimeo');
				var self=this;
				if(!this._vimeoInited){
					var data={'autoPlay': this.vim_autoPlay, 'defaultVolume': this.defaultVolume, 
					'mediaPath': this._mediaPath, 'vimeoHolder': this.vimeoHolder, 'isMobile': this.isMobile, 'initialAutoplay': this.initialAutoplay};
					this._vimeoPlayer = $.vimeoPlayer(data);
					$(this._vimeoPlayer).bind('ap_VimeoPlayer.VIMEO_READY', function(){});
					$(this._vimeoPlayer).bind('ap_VimeoPlayer.START_PLAY', function(){
						self.mediaPlaying = true;
					});
					$(this._vimeoPlayer).bind('ap_VimeoPlayer.VIMEO_PLAY', function(){
						self.mediaPlaying = true;
					});
					$(this._vimeoPlayer).bind('ap_VimeoPlayer.VIMEO_PAUSE', function(){
						self.mediaPlaying = false;
					});
					$(this._vimeoPlayer).bind('ap_VimeoPlayer.END_PLAY', function(){
						//console.log('ap_VimeoPlayer.END_PLAY');
						self.videoEndAction(self._vimeoPlayer);
					});
					this._vimeoInited=true;
				}else{
					this._vimeoPlayer.initVideo(this._mediaPath);
				}
			},
			
			//**************** YOUTUBE	
			_initYoutube:function () {
				var self=this;
				self._showYT();
				if(!this._youtubeInited){
					var data={'autoPlay': this.yt_autoPlay, 'defaultVolume': this.defaultVolume, 
					'mediaPath': this._mediaPath, 'youtubeHolder': this.youtubeHolder, 'youtubeChromeless': this._youtubeChromeless, 
					'isMobile': this.isMobile, 'initialAutoplay': this.initialAutoplay};
					this._youtubePlayer = $.youtubePlayer(data);
					$(this._youtubePlayer).bind('ap_YoutubePlayer.FORCE_MAIN_STOP', function(){
						//console.log('ap_YoutubePlayer.FORCE_MAIN_STOP');
						self._hideYT();
					});
					$(this._youtubePlayer).bind('ap_YoutubePlayer.YT_READY', function(){
						//console.log('ap_YoutubePlayer.YT_READY');
					});
					$(this._youtubePlayer).bind('ap_YoutubePlayer.START_PLAY', function(){
						//console.log('ap_YoutubePlayer.START_PLAY');
						self.mediaPlaying = true;
					});
					$(this._youtubePlayer).bind('ap_YoutubePlayer.STATE_PLAYING', function(){
						//console.log('ap_YoutubePlayer.STATE_PLAYING');
						self.mediaPlaying = true;
					});
					$(this._youtubePlayer).bind('ap_YoutubePlayer.STATE_PAUSED', function(){
						//console.log('ap_YoutubePlayer.STATE_PAUSED');
						self.mediaPlaying = false;
					});
					$(this._youtubePlayer).bind('ap_YoutubePlayer.END_PLAY', function(){
						//console.log('ap_YoutubePlayer.END_PLAY');
						self.videoEndAction(self._youtubePlayer);
					});
					this._youtubeInited=true;
				}else{
					this._youtubePlayer.initVideo(this._mediaPath);
				}
			},
			videoEndAction:function(player){
				var self=this;
				if(self.mg_gallery.getSlideshowForcePause()){//check if slideshow was running before video request
					if(self.includeVideoInSlideshow){
						self.mg_gallery.videoEnd();//close player, resume slideshow
					}else{
						if(self.videoLoop){
							if(!self.isMobile){
								if(self.yt_autoPlay){
									player.play();
								}
							}else{
								if(self.initialAutoplay){
									player.play();
								}
							}
						}
					}
				}else{
					if(self.videoLoop){
						if(!self.isMobile){
							if(self.yt_autoPlay){
								player.play();
							}
						}else{
							if(self.initialAutoplay){
								player.play();
							}
						}
					}
				}	
			},
			_showYT:function () {
				//console.log('_showYT');
				this.youtubeWrapper.css('left',0+'px');
				if(this.isIE){
					this._setYTSizeIE();
				}
			},
			_setYTSizeIE:function () {//hide outline for youtube iframe in ie
				//console.log('_setYTSizeIE');
				if(this.isIE){
					var w = this._getPlayerSize('w'), h = this._getPlayerSize('h');//ie outline youtube fix!
					//console.log(w,h);
					this.youtubeHolder.css({
						width: w+2+'px',
						height: h+2+'px',
						left:-1+'px',
						top:-1+'px'
					});
				}
			},
			_hideYT:function () {
				//console.log('_hideYT');
				this.youtubeWrapper.css('left',-10000+'px');
			},
			//*********
			_getComponentSize:function (type) {
				if(type == "w"){//width
					return this.componentSize == "normal" ? this.componentWrapper.width() : this.getDocumentWidth();
				}else{//height
					return this.componentSize == "normal" ? this.componentWrapper.height() : this.getDocumentHeight();
				}
			},
			_getPlayerSize:function (type) {
				if(type == "w"){//width
					return this.componentWrapper.width();
				}else{//height
					return this.componentWrapper.height();
				}
			},
			getDocumentWidth:function(){
				//console.log('getDocumentWidth : ', $(window).width());
				return Math.max(
					//_doc.width(),
					$(window).width(),
					/* For opera: */
					document.documentElement.clientWidth
				);
			},
			getDocumentHeight:function(){
				//console.log('getDocumentHeight : ', $(window).height());
				return Math.max(
					$(window).height(),
					/* For opera: */
					document.documentElement.clientHeight
				);
			},
			_preventSelect:function (arr) {
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
			},
			_checkPlayerSize:function() {
				if(document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen) return false;
				//close btn must stay inside screen, and outside video (ios)!
				if(!this.componentWrapper)return false;
				
				if(!this.origPlayerSizeSet){//remember original size
					this.origPlayerSizeSet = true;
					this.origPlayerW = this.componentWrapper.outerWidth();
					this.origPlayerH = this.componentWrapper.outerHeight();
				};
				
				var pw, ph;
				pw = this.origPlayerW + 3 * this.player_close.width();//close btn must fit inside component
				if(pw > this.componentWrapper.width()){
					pw = this.componentWrapper.width();
				}else if(pw < this.componentWrapper.width()){
					pw = this.componentWrapper.width() > this.origPlayerW + 3 * this.player_close.width() ? this.origPlayerW + 3 * this.player_close.width() : this.componentWrapper.width();//not larger than original size
				}
				ph = this.origPlayerH;
				if(ph > this.componentWrapper.height()){
					ph = this.componentWrapper.height();
				}else if(ph < this.componentWrapper.height()){
					ph = this.componentWrapper.height() > this.origPlayerH ? this.origPlayerH : this.componentWrapper.height();
				}

				pw -=  3 * this.player_close.width();
				this.componentWrapper.css({//resize and reposition player
					width:pw+'px',
					marginLeft: - pw/2+'px',
					height:ph-10+'px',
					marginTop: - ph/2+'px'
				});
			},
			_doneResizing:function () {
				//console.log('_doneResizing');
				//alert('_doneResizing');
				
				if(this.componentSize== "fullscreen"){
					this.resizeComponent();	
				}
						
				this._componentWidth= this._getComponentSize('w');
				this._componentHeight= this._getComponentSize('h');
				
				//check local video
				if(this._mediaType){
					//check local video
					if(this._mediaType == 'local'){
						if(this.previewPoster) this.resizePreview();
						if(this.html5Support && this.videoInited)this.resizeComponent();
						this._resizeControls();
					}else if(this._mediaType == 'youtube' && this.isIE){
						this._setYTSizeIE();//ie fix
					}
				}
			},
			_resizeControls:function () {
				//console.log('_resizeControls');
				if(this.componentSize== "normal"){
					var v = this.componentWrapper.width();
				}else{
					var v = this._getComponentSize('w');
				}
				
				this.playerControls.width(v - this.controlsMediaWidthDiff);
				this.seekBarSize=this.playerControls.width()-this.controlsSeekbarDiff;
				this.progress_bg.width(this.seekBarSize);
				this.player_progress.width(this.seekBarSize+20);
				
				if(this.html5Support){
					
				}else{
					var w = v - this.controlsMediaWidthDiff;
					var seekBarSize = w - this.controlsSeekbarDiff;
					//console.log('seekBarSize = ', seekBarSize);
					this.getFlashMovie('flashPreview').pb_resizeControls(w, seekBarSize);
				}
			}
			
	}; /* VideoGallery.prototype end */
	
	$.fn.videoGallery = function(options) {    	
		return this.each(function(){
			//PUBLIC METHODS
			$.fn.videoGallery.playMedia = function() {	
				videoGallery.playMedia();
			}
			$.fn.videoGallery.pauseMedia = function() {	
				videoGallery.pauseMedia();
			}
			$.fn.videoGallery.setVolume = function(val) {	
				videoGallery.setVolume(val);
			}
			
			//******* flash callbacks
			$.fn.videoGallery.flashResizeControls = function() {	
				videoGallery.flashResizeControls();
			}
			$.fn.videoGallery.flashMainPreviewOff = function() {	
				videoGallery.flashMainPreviewOff();
			}
			$.fn.videoGallery.flashVideoPause = function() {	
				videoGallery.flashVideoPause();
			}
			$.fn.videoGallery.flashVideoResume = function() {	
				videoGallery.flashVideoResume();
			}
			$.fn.videoGallery.flashVideoEnd = function() {	
				videoGallery.flashVideoEnd();
			}
			$.fn.videoGallery.flashVideoStart = function() {	
				videoGallery.flashVideoStart();
			}
			$.fn.videoGallery.dataUpdateFlash = function() {	
				videoGallery.dataUpdateFlash(bl,bt,t,d);
			}
			//console.log(options);
			var videoGallery = new VideoGallery($(this), options);
			$(this).data("videoGallery", videoGallery);
			
		});
	};

	$.fn.videoGallery.defaults = {   
		videoGallerySetupDone: function(){}//Callback, triggers when component is ready to receive public function calls
	}; /* default options end */

	$.fn.videoGallery.settings = {};

})(jQuery);




