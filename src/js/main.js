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

Site.Player = {
  neverStarted: true,
  fadeTime:  2000,
  statusCheckInterval: 5000,
  statusUrl: 'https://public.radio.co/stations/s0b5e9c02c/status',
  streamUrl: 'http://streaming.radio.co/s0b5e9c02c/listen',
  streamData: null,
  init: function() {
    var _this = this;

    _this.playerElement =  document.getElementById('radio-player');
    _this.playerSrc =  document.getElementById('player-src');
    _this.playerControl =  document.getElementById('player-control');
    _this.streamStatusText =  document.getElementById('stream-status');
    _this.nowPlayingText =  document.getElementById('now-playing');

    // Check if the stream is online
    _this.checkStreamStatus(true);

    // Start checker on an interval
    setInterval(function() {
      _this.checkStreamStatus();
    }, _this.statusCheckInterval);


  },

  // Check the stream status thru ajax and change the player accordingly
  checkStreamStatus: function(forcePlay) {
    var _this = this;

    // Make the ajax request
    $.getJSON(_this.statusUrl, function(data) {

      // Save data in a cache var, just in case
      _this.streamData = data.status;

      // Check if the stream is offline
      if(data.status == 'offline') {
        // Update marquee status
        _this.streamStatusText.innerHTML = 'Siguiente: ';

        // Update the marquee text
        _this.nowPlayingText.innerHTML = 'the upcoming show that has to be requested thru ajax';

        // Pause the stream
        _this.pause();

      } else {  // else  (stream is online)

        // Check if player src is empty
        if (_this.playerSrc.src === '') {
          // Add src
          _this.playerSrc.src =  _this.streamUrl;

          // Load src
          _this.playerElement.load();
        }

        // Update marquee status
        _this.streamStatusText.innerHTML = 'Ahora: ';

        // Update Now playing
        _this.nowPlayingText.innerHTML = data.current_track.title;

        if (_this.playerElement.paused && (forcePlay === true || _this.neverStarted) ) {
          var canplayListener = _this.playerElement.addEventListener('canplay', function() {
            // If the player is paused and [forcePlay is true  or the player has never started playing]
            _this.play();
            _this.playerElement.removeEventListener('canplay', canplayListener);
          });
        }

      }
    });

  },

  play: function() {
    var _this = this;

    if( _this.playerElement.networkState !== 3) {
      _this.playerElement.volume = 0;

      _this.playerElement.play();

      _this.neverStarted = false;

      var volumeIncrement = 1 / (_this.fadeTime / 50);
      var fadeInterval = setInterval( function() {
        _this.playerElement.volume += volumeIncrement;

        if (_this.playerElement.volume >= 1 - volumeIncrement) {
          _this.playerElement.volume = 1
          clearInterval(fadeInterval);
        }
      }, 50);
    }
  },

  pause: function() {
    var _this = this;

    _this.playerElement.pause();
  },
};

Site.init();
