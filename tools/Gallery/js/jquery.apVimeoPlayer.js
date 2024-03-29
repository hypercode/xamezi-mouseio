
(function($) {

	 $.vimeoPlayer = function(data) {
		return new ap_VimeoPlayer(data);
	 };
	 
	 function ap_VimeoPlayer(data){
		 
		var _self = this;
		this.isMobile = data.isMobile;
		this.initialAutoplay = data.initialAutoplay;
		this._autoPlay = data.autoPlay;
		this._defaultVolume = data.defaultVolume;
		this._vimeoHolder = data.vimeoHolder;
		this._inited = false;
		var frame_id = 'player'+Math.floor(Math.random()*0xFFFFFF);
		this._player_id = '&player_id='+frame_id;
		this._vimeoApi = '?api=1';
		var videoIFrameSrc = 'http://player.vimeo.com/video/' + data.mediaPath + this._vimeoApi + this._player_id;
		//console.log(videoIFrameSrc);
		
		this._vimeoVideoIframe = $('<iframe />', {
			id: frame_id,
			frameborder: 0,
			src: videoIFrameSrc,
			width: 100 + '%',
			height: 100 + '%'
		});
		
		this._vimeoHolder.css('display', 'block');
		this._vimeoHolder.append(this._vimeoVideoIframe);
		
		this._player = Froogaloop(this._vimeoVideoIframe[0]);
		this._player.addEvent('ready', function(){
			//console.log('ready');

			$(_self).trigger('ap_VimeoPlayer.VIMEO_READY');
			_self._player.api('setVolume', _self._defaultVolume);
			_self._player.addEvent('play', function(){
				$(_self).trigger('ap_VimeoPlayer.START_PLAY');	
			});
			_self._player.addEvent('finish', function(){
				$(_self).trigger('ap_VimeoPlayer.END_PLAY');	
			});
			_self._player.addEvent('play', function(data) {
				//console.log('vimeo play');
				$(_self).trigger('ap_VimeoPlayer.VIMEO_PLAY');	
			});
			_self._player.addEvent('pause', function(data) {
				//console.log('vimeo pause');
				$(_self).trigger('ap_VimeoPlayer.VIMEO_PAUSE');	
			});
			
			if(!_self._inited){
				_self._inited=true;
			}
			if(_self._autoPlay) _self._player.api('play');
				
		})

	 };
	
	 ap_VimeoPlayer.prototype = {
		initVideo:function(id) {
			if(this._player){
				this._vimeoHolder.css('display', 'block');
				var videoIFrameSrc = 'http://player.vimeo.com/video/' + id + this._vimeoApi + this._player_id;
				this._vimeoVideoIframe.attr('src', videoIFrameSrc);
			}
		},
		stop:function() {
			
		},
		play:function() {
			this._player.api('play');
		},
		pause:function() {
			this._player.api('pause');
		},
		seek:function(val) {
		
		},
		isMuted:function() {
			
		},
		getDuration:function() {
			
		},
		setVolume:function(val) {
			this._player.api('setVolume', val);
		},
		clean:function() {
			this._player.removeEvent('finish');
			this._vimeoVideoIframe.attr('src', '');
			this._vimeoHolder.css('display', 'none');
		}
	}

})(jQuery);



