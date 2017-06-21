/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, jQuery, document, Site, Modernizr */

Site = {
  mobileThreshold: 601,
  init: function() {
    var _this = this;

    $(window).resize(function(){
      _this.onResize();
    });

    $(document).ready(function () {
      Site.StreamChecker.init();
      Site.Player.init();
    });

  },

  onResize: function() {
    var _this = this;

  },

  fixWidows: function() {
    // utility class mainly for use on headines to avoid widows [single words on a new line]
    $('.js-fix-widows').each(function(){
      var string = $(this).html();
      string = string.replace(/ ([^ ]*)$/,'&nbsp;$1');
      $(this).html(string);
    });
  },
};

Site.StreamChecker = {
  statusUrl: 'https://public.radio.co/stations/s0b5e9c02c/status',
  statusCheckInterval: 5000,
  streamData: null,
  init: function() {
    var _this = this;

    _this.startChecker();
  },

  startChecker: function() {
    var _this = this;


    _this.checkStreamStatus();

    // Start checker on an interval
    setInterval(function() {
      _this.checkStreamStatus();
    }, _this.statusCheckInterval);
  },

  // Check the stream status thru ajax and change the player accordingly
  checkStreamStatus: function() {
    var _this = this;

    // Make the ajax request
    $.getJSON(_this.statusUrl, function(data) {

      // Save data in a cache var, just in case
      _this.streamData = data.status;

      // Check if the stream is offline
      if(data.status == 'offline') {

        // Trigger the event
        _this.triggerEvent('streamoffline', data);

      } else if(data.status === 'online')  {  // else  (stream is online)

        // Trigger the event
        _this.triggerEvent('streamonline', data);
      }
    });

  },

  triggerEvent: function(eventName, detail) {
    var _this =  this;

    console.log('event triggered: ', eventName);

    var customEvent = new CustomEvent(eventName, {
      detail: detail,
    });

    document.dispatchEvent(customEvent);
  },

};

Site.Player = {
  neverPlayed: true,
  fadeTime:  2000,
  streamUrl: 'http://streaming.radio.co/s0b5e9c02c/listen',
  init: function() {
    var _this = this;

    // Player DOM elements
    _this.playerContainer =  document.getElementById('player-container');
    _this.playerElement =  document.getElementById('player');
    _this.playerSrc =  document.getElementById('player-src');
    _this.playButton =  document.getElementById('play-btn');
    _this.pauseButton =  document.getElementById('pause-btn');
    _this.streamStatusText =  document.getElementById('stream-status');
    _this.nowPlayingText =  document.getElementById('now-playing');

    // Bind event handlers
    _this.handleOnlineStream = _this.handleOnlineStream.bind(_this);
    _this.handleCanPlay = _this.handleCanPlay.bind(_this);
    _this.handleOfflineStream = _this.handleOfflineStream.bind(_this);

    // Subscribe to stream events
    document.addEventListener('streamonline', _this.handleOnlineStream);
    document.addEventListener('streamoffline', _this.handleOfflineStream);

    // Subscribe to clic on player controls
    _this.playButton.addEventListener('click', _this.play.bind(_this));
    _this.pauseButton.addEventListener('click', _this.pause.bind(_this));

  },

  handleOnlineStream: function(event) {
    var _this = this;

    var data = event.detail;

    // Add class `online` to the player container
    _this.playerContainer.classList.add('online');

    // Check if player src is empty
    if (_this.playerSrc.src === '' || _this.playerElement.paused) {
      // Add src
      _this.playerSrc.src =  _this.streamUrl;

      // Load src
      _this.playerElement.load();
    }

    // Update marquee status
    _this.streamStatusText.innerHTML = 'Ahora: ';

    // Update Now playing
    _this.nowPlayingText.innerHTML = data.current_track.title;

    // If the player has never started playing
    if (_this.neverPlayed) {
      // We subscribe to the `canplay` event from the player
      _this.playerElement.addEventListener('canplay', _this.handleCanPlay);
    }
  },

  handleCanPlay: function(event) {
    var _this = this;

    // Play the audio element
    _this.play();

    // Remove listener cuz it's only needed once
    event.target.removeEventListener(event.type, _this.handleCanPlay);

  },

  handleOfflineStream: function() {
    var _this = this;

    // Remove `online` class from the player container
    _this.playerContainer.classList.remove('online');

    // Update marquee status
    _this.streamStatusText.innerHTML = 'Siguiente: ';

    // Update the marquee text
    _this.nowPlayingText.innerHTML = 'the upcoming show that has to be requested thru ajax';

    // Pause the audio element
    _this.pause();
  },

  play: function() {
    var _this = this;

    if( _this.playerElement.networkState !== 3) {

      // Reset volume
      _this.playerElement.volume = 0;

      // Play audio element
      _this.playerElement.play();

      // Add `playing` class to player container
      _this.playerContainer.classList.add('playing');


      _this.neverPlayed = false;

      // Calculate the volume increment
      var volumeIncrement = 1 / (_this.fadeTime / 50);

      // Fade in the volume
      var fadeInterval = setInterval( function() {
        var newVolume = _this.playerElement.volume + volumeIncrement;

        if (newVolume > 1) {
          newVolume = 1;
        }

        _this.playerElement.volume = newVolume;

        if (_this.playerElement.volume >= 1) {
          // Clear the interval
          clearInterval(fadeInterval);

        }
      }, 50);
    }
  },

  pause: function() {
    var _this = this;

    // Pause audio element
    _this.playerElement.pause();

    // Remove `playing` class from the player container
    _this.playerContainer.classList.remove('playing');
  },
};

Site.init();
