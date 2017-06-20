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
  fadeTime:  2000,
  statusUrl: 'https://public.radio.co/stations/s0b5e9c02c/status',
  streamData: null,
  init: function() {
    var _this = this;

    _this.playerElement =  document.getElementById('radio-player');

    // Check if the stream is online
    _this.checkStreamStatus();

  },

  // Check the stream status thru ajax and change the player accordingly
  checkStreamStatus: function() {
    var _this = this;

    // Make the ajax request
    $.getJSON(_this.statusUrl, function(data) {
      _this.streamData = data.status;

      // If the stream is offline
      if(data.status == 'offline') {
        _this.pause(); // Pause the stream
      } else if (_this.playerElement.paused) { // If stream is online and the player is paused
        _this.play();
      }
    });

  },

  play: function() {
    var _this = this;

    _this.playerElement.volume = 0;
    _this.playerElement.play();

    var volumeIncrement = 1 / (_this.fadeTime / 50);
    var fadeInterval = setInterval( function() {
      _this.playerElement.volume += volumeIncrement;

      if (_this.playerElement.volume >= 1 - volumeIncrement) {
        _this.playerElement.volume = 1
        clearInterval(fadeInterval);
      }

    }, 50);
  },

  pause: function() {
    var _this = this;

    _this.playerElement.pause();
  },
};

Site.init();
