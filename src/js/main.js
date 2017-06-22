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
      Site.Earth.init();
    });

    Site.StreamChecker.init();
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

Site.Earth = {
  canvasWidth: 128,
  canvasHeight: 128,
  textureUrl: WP.themeUrl + '/dist/img/earth_texture.jpg',
  initialCameraZ: 1000,
  init: function() {
    var _this = this;

    // Bind Animate function
    _this.animate = _this.animate.bind(_this);

    _this.container = document.getElementById('earth-container');

    // -- Set Three stuff

    // Set camera
    _this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
    _this.camera.position.z = _this.initialCameraZ;

    // Set Scene
    _this.scene = new THREE.Scene();

    // Set Group
    _this.group = new THREE.Group();

    // Add Group to the scene
    _this.scene.add( _this.group );

    // Load earth texture
    _this.loadTexture();

    // Create canvas element
    _this.canvas = document.createElement( 'canvas' );

    // Set Canvas size
    _this.canvas.width = _this.canvasWidth;
    _this.canvas.height = _this.canvasHeight;

    // Render canvas
    _this.renderCanvas();

    // Animate
    _this.animate();
  },

  renderCanvas: function() {
    var _this = this;

    var texture = new THREE.CanvasTexture( _this.canvas );
    var geometry = new THREE.PlaneBufferGeometry( 300, 300, 3, 3 );
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
    var mesh = new THREE.Mesh( geometry, material );

    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    _this.group.add( mesh );

    _this.renderer = new THREE.CanvasRenderer();
    _this.renderer.setClearColor( 0xffffff );
    _this.renderer.setPixelRatio( window.devicePixelRatio );
    _this.renderer.setSize( window.innerWidth, window.innerHeight );
    _this.container.appendChild( _this.renderer.domElement );
  },

  loadTexture: function() {
    var _this = this;

    var loader = new THREE.TextureLoader();

    loader.load(_this.textureUrl, function (texture) {
      var geometry = new THREE.SphereGeometry( 200, 20, 20 );
      var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
      var mesh = new THREE.Mesh( geometry, material );
      _this.group.add( mesh );
    });
  },

  animate: function() {
    var _this = this;

    window.requestAnimationFrame(_this.animate);
t
    _this.renderScene();
  },

  renderScene: function() {
    var _this = this;

    _this.camera.lookAt( _this.scene.position );
    _this.group.rotation.y -= 0.005;
    _this.renderer.render( _this.scene, _this.camera );
  }
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
      if (data.status === 'offline') {

        // Trigger the event
        _this.triggerEvent('streamoffline', data);

      } else if (data.status === 'online')  {  // else  (stream is online)

        // Trigger the event
        _this.triggerEvent('streamonline', data);
      }
    })
    .fail( function() {
      // Trigger the event
      _this.triggerEvent('streamoffline');

      console.log('Radio.co seems to be unresponsive');

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
    _this.playButton =  document.getElementById('play-button');
    _this.pauseButton =  document.getElementById('pause-button');
    _this.streamStatusText =  document.getElementById('stream-status');
    _this.nowPlayingText =  document.getElementById('now-playing');

    // Bind event handlers
    _this.handleOnlineStream = _this.handleOnlineStream.bind(_this);
    _this.handleCanplay = _this.handleCanplay.bind(_this);
    _this.handleOfflineStream = _this.handleOfflineStream.bind(_this);

    // Subscribe to stream events
    document.addEventListener('streamonline', _this.handleOnlineStream);
    document.addEventListener('streamoffline', _this.handleOfflineStream);

    // Subscribe to clic on player controls
    _this.playButton.addEventListener('click', _this.play.bind(_this));
    _this.pauseButton.addEventListener('click', _this.pause.bind(_this));


    // Calculate the volume increment
    _this.volumeIncrement = 1 / (_this.fadeTime / 50);

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
      _this.playerElement.addEventListener('canplay', _this.handleCanplay);
    }
  },

  handleCanplay: function(event) {
    var _this = this;

    // Play the audio element
    _this.play();

    // Remove listener cuz it's only needed once
    event.target.removeEventListener(event.type, _this.handleCanplay);

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

    if (_this.playerElement.networkState !== 3) {

      // Reset volume
      _this.playerElement.volume = 0;

      // Play audio element
      _this.playerElement.play();

      // Add `playing` class to player container
      _this.playerContainer.classList.add('playing');


      _this.neverPlayed = false;

      // Fade in the volume
      var fadeInterval = setInterval( function() {
        var newVolume = _this.playerElement.volume + _this.volumeIncrement;

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
