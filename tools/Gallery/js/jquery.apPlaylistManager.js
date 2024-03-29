(function($) {

	 $.playlistManager = function(data) {
		var pm = new ap_PlaylistManager(data);
		return pm;
	 };

	 function ap_PlaylistManager(settings) {
		
		this._loopingOn = settings.loopingOn;
		this._randomPlay = settings.randomPlay;
		
		this._playlistItems;
		this._lastInOrder = false;
		this._counter = -1;
		this._lastPlayedFromPlaylistClick;//last played on click.
		this._lastRandomCounter;//last played random media in random playlist.
		this._randomPaused = false;//when random is playing and we interrupt it by click on the playlist.
		this._traceCounter = false;	
		this._randomArr = [];
		this._playlistSelect = false;//prevent geting counter from randomArr on playlist click (get 'normal' counter instead)
		
	 }
	 
	 ap_PlaylistManager.prototype = {
				 
		//set counter to specific number or add it to the currect counter value		 
		setCounter:function(value, _add) {
			if (typeof _add === 'undefined') _add = true;
			if(_add){
				this._counter += parseInt(value, 10);
			}else{
				this._counter = parseInt(value, 10);
			}
			//console.log('setCounter ', this._counter);
			this._checkCounter();
		},
		getCounter:function() {
			var i;
			if(this._randomPlay){
				if(!this._playlistSelect){
					i = this._randomArr[this._counter];
				}else{
					i = this._counter;
				}
			}else{
				i = this._counter;
			}
			return i;
		},
		advanceHandler:function(a) {
			this._playlistSelect = false;//reset
			if(this._randomPaused){
				this._handleRandomPaused(a);
			}else{
				this.setCounter(a);
			}
		},
		processPlaylistRequest:function(id) {
			this._playlistSelect = false;//reset
			if(this._randomPlay){
				this._playlistSelect = true;
				this._lastPlayedFromPlaylistClick = id;//always remember last played on each click.
				if(!this._randomPaused){
					this._lastRandomCounter = this._counter;
					//console.log("memory = " + _lastRandomCounter);
					this._randomPaused = true;//this needs to stay until random play comes back again! So that the above reference to last random counter doesnt get lost. (if we constantly clicking playlist)
				}
			}
			this.setCounter(id, false);
		},
		getLastInOrder:function() {
			return this._lastInOrder;
		},
		getRandomPaused:function() {
			return this._randomPaused;
		},
		setPlaylistItems:function(val, resetCounter) {
			if(typeof resetCounter === 'undefined') resetCounter = true;
			if(resetCounter)this._counter = -1;
			this._playlistItems = val;
			if(this._randomPlay) this._makeRandomList();
		},
		reSetCounter:function(num) {
			if(typeof num === 'undefined'){
				 this._counter = -1;
			}else{//set counter to specific number
				if(this._playlistItems){
					if(num > this._playlistItems - 1){
						num = this._playlistItems - 1;
					}else if(num < 0){
						num = 0;
					}
					this._counter = num;
				}else{
					this._counter = -1;
				}
			}
		},
		setRandom:function(val) {
			this._randomPlay = val;
			if(this._randomPlay) this._makeRandomList();
			this._randomChange();
		},
		setLooping:function(val) {
			this._loopingOn = val;
		},
		setTraceCounter:function(val) {
			this._traceCounter = val;
		},
		
		//******PRIVATE
		//exiting _randomPaused and going back to random mode
		_handleRandomPaused:function(a) {
			//this is just an exit out of _randomPaused (because of a playlist click) and back to random again
			//console.log("handleRandomPaused");
			//console.log("_lastRandomCounter ", _lastRandomCounter);
			var self = $(this);
			this._randomPaused = false;//reset before because of the getCounter()
			
			if(this._lastRandomCounter + a > this._playlistItems - 1){
				this._counter = this._playlistItems - 1;
				//trace("end");
				self.trigger('ap_PlaylistManager.COUNTER_READY');
				return;
			} else if( this._lastRandomCounter + a < 0){
				this._counter = 0;
				//trace("beginning");
				self.trigger('ap_PlaylistManager.COUNTER_READY');
				return;
			}
			this.setCounter(this._lastRandomCounter + a, false);
		},
		_randomChange:function() {//when random is turned on / off
			//console.log('randomChange');
			if(this._randomPlay){
				this._activeIndexFirst();
				this._counter = 0;//we have to do it like this, because with (setCounter(0, false)) media starts to play from the beginning if its already playing. (when random requested)
				//we need to say this on the every beginning of random to redirect the counter from wherever the currently is to 0, so that it becomes first index in randomArr. (after we have moved active index to beginning of randomArr)
				
			}else{
				//we are not going through setCounter here because its just getting out of random mode, and its not changing counter, it just stays where it is (playing or not)
				if(this._randomPaused){
					this._counter = this._lastPlayedFromPlaylistClick;
					this._randomPaused = false;//when random mode stops _randomPaused stops also.
				}else{
					this._counter = this._randomArr[this._counter];//when we turn off random we need to set counter to the value of the current counter in randomArr, so if the counter is 1, and thats value 3 in randomArr for example, we want the active counter to stay 3, not 1, and next to go to 4, not 2.
				}
			}
		},
		_checkCounter:function() {
			//console.log('_checkCounter');
			if(isNaN(this._counter)){
				alert('ap_PlaylistManager message: No active media, counter = ' + this._counter);
				return;
			}
			//reset
			var self = $(this);
			this._lastInOrder = false;
			
			if(this._loopingOn){
				if(this._randomPlay){
					
					if(this._counter > this._playlistItems - 1){//moving fowards
						this._counter = this._randomArr[ this._playlistItems - 1];//remember counter for comparison
						this._makeRandomList();
						this._firstIndexCheck();
						this._counter = 0;
						self.trigger('ap_PlaylistManager.PLAYLIST_END_ALERT');
						
					}else if(this._counter < 0){//moving backwards
						this._counter = this._randomArr[0];//remember counter for comparison
						this._makeRandomList();
						this._lastIndexCheck();
						this._counter = this._playlistItems - 1;
					}
					
				}else{//random off
					if(this._counter > this._playlistItems - 1){
						this._counter = 0;
						self.trigger('ap_PlaylistManager.PLAYLIST_END_ALERT');
					}else if( this._counter < 0){
						this._counter = this._playlistItems - 1;
					}
				}
				
				self.trigger('ap_PlaylistManager.COUNTER_READY');
				
			}else{//looping off
				
				if(this._counter > this._playlistItems - 1){
					this._counter = this._playlistItems - 1;
					this._lastInOrder = true;//last item
					//console.log("last item");
				}else if(this._counter < 0){
					this._counter = 0;
					//console.log("first item");
				}
				
				if(!this._lastInOrder){
					self.trigger('ap_PlaylistManager.COUNTER_READY');
				}else{
					self.trigger('ap_PlaylistManager.PLAYLIST_END');
				}
			}
			
			if(this._traceCounter) console.log("counter = " + this.getCounter());
		},
		//make random set of numbers
		_makeRandomList:function() {
			if(this._playlistItems < 3) return;
			this._randomArr = this._randomiseIndex(this._playlistItems);
			//console.log('_randomArr = ', this._randomArr);
		},
		_firstIndexCheck:function() {
			//we need to check that first item in newly generated random array isnt equal to last active item.
			if(this._randomArr[0] == this._counter){//if yes, put it at the last place in array.
				var i = this._randomArr.splice(0,1);
				this._randomArr.push(i);
				//console.log("firstIndexCheck " + _randomArr);
			}
		},
		_lastIndexCheck:function() {
			if(this._randomArr[this._playlistItems - 1] == this._counter){//if yes, put it at the first place in array.
				var i = this._randomArr.splice(this._playlistItems - 1,1);
				this._randomArr.unshift(i);
				//console.log("lastIndexCheck " + _randomArr);
			}
		},
		_activeIndexFirst:function() {//when going into random (playing or not) put currently active index on the first place of random array.
			//console.log("activeIndexFirst");
			var i = 0,len = this._randomArr.length, j;
			
			for(i; i < len; i++){
				
				if(this._randomArr[i] == this._counter){
					if(i == 0){//if its already on the first place no need for action.
						break;
					}
					j = this._randomArr.splice(i,1);
					//console.log('_randomArr = ', this._randomArr);
					//console.log(i,j);
					this._randomArr.unshift(parseInt(j,10));
					break;
				}
			}
			//console.log(this._randomArr);
		},
		_randomiseIndex:function(num) {
			var arr = [],randomArr = [],i = 0;
			
			for (i; i < num; i++) {//first fill the ordered set of indexes
				arr[i] = i;
			}
			
			var j = 0, randomIndex;
			for (j; j < num; j++) { //then randomize those indexes
				randomIndex = Math.round(Math.random()*(arr.length-1));
				randomArr[j] = arr[randomIndex];
				arr.splice(randomIndex, 1);
			}
			return randomArr;
		}

	}


})(jQuery);