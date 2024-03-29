
/*
http://stackoverflow.com/questions/7443578/youtube-iframe-api-how-do-i-control-a-iframe-player-thats-already-in-the-html/7513356#7513356
http://code.google.com/apis/youtube/js_api_reference.html
http://code.google.com/apis/youtube/iframe_api_reference.html
http://code.google.com/apis/ajax/playground/?exp=youtube#polling_the_player
http://code.google.com/p/gdata-samples/source/browse/trunk/ytplayer/iframe/index.js
http://www.bitspace.in/2011/02/youtube-api-html5-chromeless-player.html


Youtube move left -10000 between videos instead of display none because next video havent cleared screen from previous video!
Cant empty iframe src like vimeo, because otherwise youtube api events stop working!


*/

(function($) {

	 $.youtubePlayer = function(data) {
		return new ap_YoutubePlayer(data);
	 };
	 
	 function ap_YoutubePlayer(data){
		
		 var _self = this;
		 if(typeof $.videoGallery !== "undefined"){
			 if(typeof $.videoGallery.getSingleVideo !== "undefined"){
				 if(typeof $.videoGallery.getLooping !== "undefined" && $.videoGallery.getLooping() && typeof $.videoGallery.getAutoplay !== "undefined" && $.videoGallery.getAutoplay()){
					 //only if autoplay and loop is on construct raw iframe for seamless single yt video loop
					 this.singleVideo=$.videoGallery.getSingleVideo();
				 }
			 }
		 }
		 //console.log(this.singleVideo);
		 
		 this.isMobile = data.isMobile;
		 this.initialAutoplay = data.initialAutoplay;
		 this._initialAutoplaySet=false;//must be set after first play, not just load
		 this._inited = false;
		 this._player;
		 this._autoPlay = data.autoPlay;
		 this._defaultVolume = data.defaultVolume;
		 this._youtubeHolder = data.youtubeHolder;
		 this._frameId='ytplayer'+Math.floor(Math.random()*0xFFFFFF);
		 if(data.quality) this.quality=data.quality;
		 if(data.small_embed) this.small_embed=data.small_embed;
		 //load/cue methods called before player ready
		 this.lastID;
		 this.playerReadyInterval=100;
		 this.playerReadyIntervalID;
		 this.playerReady=false;
		 
		 var _youtubeChromeless = data.youtubeChromeless;
		 var zindexfix='&amp;wmode=transparent';
		 var youtubeApi='&amp;enablejsapi=1';
		 var no_controls='?controls=0';
		 var no_info='&amp;showinfo=0';
		 var theme='&amp;theme=dark';
		 var no_relVid = '&amp;rel=0';
		 var autoplay_on='&amp;autoplay=1';
		 var loop_on = '&amp;loop=1';
		 var videoIFrameSrc;
		 this.forceMainStop = false;
		 this.forcePreviewStop = false;
		 
		 this.isFirefox = testCSS('MozBoxSizing'); 
		 function testCSS(prop) {
			return prop in document.documentElement.style;
		 }
		 //console.log(this.isFirefox);
		 
		 if(!_youtubeChromeless){
			 no_relVid = '?rel=0';
			 videoIFrameSrc = 'http://www.youtube.com/embed/' + data.mediaPath + no_relVid + youtubeApi + theme + zindexfix;
		 }else{
			 if(this.small_embed){
				 if(!data.isIE){
					videoIFrameSrc = 'http://www.youtube.com/embed/' + data.mediaPath + no_controls + no_info + youtubeApi + zindexfix;	
				 }else{
					//remove zindex fix for small preview because it was braking the player in ie9 below minimum youtube allowed size! 	
				 	videoIFrameSrc = 'http://www.youtube.com/embed/' + data.mediaPath + no_controls + no_info + youtubeApi + zindexfix;	
				 }
			 }else{
				videoIFrameSrc = 'http://www.youtube.com/embed/' + data.mediaPath + no_controls + no_info + no_relVid + youtubeApi + theme + zindexfix;	
				//make raw autoplay and loop in this case
				if(this.singleVideo)videoIFrameSrc = 'http://www.youtube.com/embed/' + data.mediaPath + no_controls + no_info + autoplay_on + loop_on + no_relVid + youtubeApi + theme + zindexfix;	
			 }
		 }
		 //console.log(videoIFrameSrc);
		  
		 this.youtubeVideoIframe = $('<iframe />', {
				frameborder: 0,
				src: videoIFrameSrc,
				width: 100 + '%',
				height: 100 + '%',
				id: this._frameId
		 });
		 //console.log(youtubeVideoIframe);
			
		 this._youtubeHolder.css('display', 'block').append(this.youtubeVideoIframe); 
			 
		 /*var tag = document.createElement('script');
		 tag.src = "http://www.youtube.com/iframe_api";
		 var firstScriptTag = document.getElementsByTagName('script')[0];
		 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		 */
	 
		var interval = setInterval(function(){
			 if(window.YT){
				 if(interval) clearInterval(interval);
				 //console.log(window.YT, window.YT.Player);
				 _self._player = new YT.Player(_self._frameId, {
					events: {
						  'onReady': onPlayerReady,
						  'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
						  'onStateChange': onPlayerStateChange,
						  'onError': onPlayerError
					}
				 });
				 
			 }
		 }, 100);
		 
		 window.onYouTubeIframeAPIReady = function() {
			//console.log('onYouTubeIframeAPIReady');
		 }
		 
		 function onPlayerReady(event) {
			//console.log('onPlayerReady');
			//console.log(_self._player);
			//if(_self.quality && typeof _self._player.setPlaybackQuality !== "undefined")_self._player.setPlaybackQuality(_self.quality);//brakes ie9 small preview hack
			_self.playerReady=true;
			$(_self).trigger('ap_YoutubePlayer.YT_READY');
			if(typeof _self._player.setVolume !== "undefined"){
				_self._player.setVolume(_self._defaultVolume * 100);//Sets the volume. Accepts an integer between 0 and 100.
			}
			if(_self._autoPlay){
				_self._player.playVideo();
			}
		 }
		
		 function onPlayerPlaybackQualityChange(event) {
			//console.log('onPlayerPlaybackQualityChange');
		 }
		
		 function onPlayerStateChange(event) {
			//console.log('onPlayerStateChange ', event.data);
		
			if(_self.forceMainStop){
				//console.log('_self.forceMainStop = ', _self.forceMainStop);
				_self.forceMainStop=false;
				if(typeof _self._player.stopVideo !== "undefined"){
					_self._player.stopVideo();
					$(_self).trigger('ap_YoutubePlayer.FORCE_MAIN_STOP');
					return;
				}
			}
		
			if(event.data == -1){//unstarted
				if(typeof $.videoGallery !== "undefined" && typeof $.videoGallery.getVolume !== "undefined" && _self.isFirefox && typeof _self._player.setVolume !== "undefined")_self._player.setVolume($.videoGallery.getVolume() * 100);//firefox fix!
			}
			else if(event.data == 0){//ended
				//console.log('yt ended');
				if(!_self.singleVideo)$(_self).trigger('ap_YoutubePlayer.END_PLAY');
			}
			else if(event.data == 1){//playing
				if(_self.small_embed && typeof _self._player.setVolume !== "undefined")_self._player.setVolume(0);//firefox fix in small preview!

				if(_self.forcePreviewStop){
					if(typeof _self._player.stopVideo !== "undefined")_self._player.stopVideo();
				}
				if(!_self._inited){
					$(_self).trigger('ap_YoutubePlayer.START_PLAY');
					_self._inited=true;	
				}
				if(!_self._initialAutoplaySet){//after first play (may not be on the first video!)
					//console.log('setting initialAutoplay');
					if(_self.isMobile && _self.initialAutoplay) _self._autoPlay=true;//FORCE AUTOPLAY FROM SECOND VIDEO	
					_self._initialAutoplaySet=true;
				}
				$(_self).trigger('ap_YoutubePlayer.STATE_PLAYING');
			}
			else if(event.data == 2){//paused
				$(_self).trigger('ap_YoutubePlayer.STATE_PAUSED');
			}
			else if(event.data == 5){//paused
				$(_self).trigger('ap_YoutubePlayer.STATE_CUED');
			}
			
			/*
			
			YT.PlayerState.ENDED 0
			YT.PlayerState.PLAYING 1
			YT.PlayerState.PAUSED 2
			YT.PlayerState.BUFFERING 3
			YT.PlayerState.CUED 5
			
			-1 (unstarted)
			0 (ended)
			1 (playing)
			2 (paused)
			3 (buffering)
			5 (video cued).
			*/
		 }
		
		 function onPlayerError(e) {
			//console.log(e);
			
			/*
			event.data
			 2 – The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
			100 – The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
			101 – The owner of the requested video does not allow it to be played in embedded players.
			150 – This error is the same as 101. It's just a 101 error in disguise!
			*/
			
			switch(e.data){
				case 2:
				//console.log("Error code = "+e.data+": The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.")
				break;
				case 100:
				//console.log("Error code = "+e.data+": Video not found, removed, or marked as private")
				break;
				case 101:
				//console.log("Error code = "+e.data+": Embedding disabled for this video")
				break;
				case 150:
				//console.log("Error code = "+e.data+": Video not found, removed, or marked as private [same as error 100]")
				break;
			}
			
		 }
		 
	 };
	 ap_YoutubePlayer.prototype = {
		clean:function() {
			if(this._player){
				if(typeof this._player.stopVideo !== "undefined") this._player.stopVideo();
				this._player=null;
			}
			if(this.youtubeVideoIframe){
				this.youtubeVideoIframe.attr('src','');
				this.youtubeVideoIframe.remove();//SCRIPT5009: '__flash__removeCallback' is undefined 
				this.youtubeVideoIframe=null;
			}
		},
		stopPreview:function() {
			this.forcePreviewStop=true;
		},
		initVideo:function(id) {
			this.forceMainStop=false;//reset 
			if(this.playerReady){
				if(this._player){
					this.forcePreviewStop=false;//reset
					this._inited=false;
					//console.log(this._autoPlay);
					if(this._autoPlay){
						if(typeof this._player.loadVideoById !== "undefined")this._player.loadVideoById(id);
					}else{
						if(typeof this._player.cueVideoById !== "undefined")this._player.cueVideoById(id);
					}
				}
			}else{
				var _self=this;
				this.lastID = id;//remember last id
				if(this.playerReadyIntervalID)return;//if already started
				this.playerReadyIntervalID = setInterval(function(){
					if(_self.playerReady){
						if(_self.playerReadyIntervalID) clearInterval(_self.playerReadyIntervalID);
						if(!_self.forceMainStop)_self.initVideo(_self.lastID);
					}
				}, this.playerReadyInterval);
			}
		},
		stop:function() {
			this.forceMainStop=true;
			if(this._player && typeof this._player.stopVideo !== "undefined") this._player.stopVideo();
		},
		play:function() {
			if(this._player && typeof this._player.playVideo !== "undefined") this._player.playVideo();
		},
		pause:function() {
			if(this._player && typeof this._player.pauseVideo !== "undefined") this._player.pauseVideo();
		},
		togglePlayback:function(state) {
			if(this._player) {
				if(state == undefined){
					if(typeof this._player.getPlayerState === "undefined") return false;
					var player_state = this._player.getPlayerState();
					//console.log('player_state = ', player_state);
					if(player_state == 1){//playing
						if(typeof this._player.pauseVideo !== "undefined")this._player.pauseVideo();
					}else if(player_state == 2){//paused
						if(typeof this._player.playVideo !== "undefined")this._player.playVideo();
					}else if(player_state == -1 || player_state == 5 || player_state == 0){//unstarted, cued, ended
						if(typeof this._player.playVideo !== "undefined")this._player.playVideo();
					}
				}else{
					if(state){//start
						if(typeof this._player.playVideo !== "undefined")this._player.playVideo();
					}else{//stop
						if(typeof this._player.pauseVideo !== "undefined")this._player.pauseVideo();
					}
				}
			}
		},
		seek:function(val) {
			if(this._player && typeof this._player.seekTo !== "undefined") this._player.seekTo(val);
		},
		isMuted:function() {
			if(this._player && typeof this._player.isMuted !== "undefined") return this._player.isMuted();
		},
		getDuration:function() {
			if(this._player && typeof this._player.getDuration !== "undefined") return this._player.getDuration();
		},
		getCurrentTime:function() {
			if(this._player && typeof this._player.getCurrentTime !== "undefined") return this._player.getCurrentTime();
		},
		getVideoLoadedFraction:function() {
			if(this._player && typeof this._player.getVideoLoadedFraction !== "undefined") return this._player.getVideoLoadedFraction();
		},
		getVideoBytesLoaded:function() {
			if(this._player && typeof this._player.getVideoBytesLoaded !== "undefined") return this._player.getVideoBytesLoaded();
		},
		getVideoBytesTotal:function() {
			if(this._player && typeof this._player.getVideoBytesTotal !== "undefined") return this._player.getVideoBytesTotal();
		},
		setVolume:function(val) {
			//Sets the volume. Accepts an integer between 0 and 100.
			if(val<0) vol=0;
			else if(val > 1) val = 1;
			if(this._player && typeof this._player.setVolume !== "undefined") this._player.setVolume(val * 100);
		},
		getPlayerState:function() {
			if(this._player && typeof this._player.getPlayerState !== "undefined") return this._player.getPlayerState();
		}
	}

})(jQuery);



