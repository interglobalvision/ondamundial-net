/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, jQuery, document, Site, Modernizr, moment, WP, THREE*/

Site = {
  mobileThreshold: 601,
  init: function() {
    var _this = this;

    $(window).resize(function() {
      _this.onResize();
    });

    $(document).ready(function () {
      Site.Player.init();
      Site.Earth.init();
      Site.Programacion.init();
    });

    Site.StreamChecker.init();
  },

  onResize: function() {
    var _this = this;

  },

  fixWidows: function() {
    // utility class mainly for use on headines to avoid widows [single words on a new line]
    $('.js-fix-widows').each(function() {
      var string = $(this).html();
      string = string.replace(/ ([^ ]*)$/,'&nbsp;$1');
      $(this).html(string);
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

Site.Programacion = {
  // parse JSON event posts object from Wordpress
  eventsPosts: JSON.parse(WP.programacionEvents),
  scheduleArray: [],
  init: function() {
    var _this = this;

    // Set programacion container
    _this.programacionContainer =  document.getElementById('page-programacion');

    // Loop through Years -> Months -> Days -> Events
    _this.fillEventsObject();

    // Add schedule to DOM
    _this.addEventsToDom();
  },

  fillEventsObject: function() {
    var _this = this;

    // Iterate thru each event
    _this.eventsPosts.forEach(function(scheduleEvent) {
      // Generate moment from timestamp in user local timezone
      var eventMoment = moment.unix(parseInt(scheduleEvent.timestamp));

      // Parse date/time data
      var year = eventMoment.format('YYYY');
      var month = eventMoment.format('MMMM');
      var monthNum = eventMoment.format('M');
      var day = eventMoment.format('dddd Do');
      var dayNum = eventMoment.format('D');
      var hour = eventMoment.format('H:mm');

      // Create this Year object if missing in schedule array
      if (_this.scheduleArray[year] === undefined) {
        _this.scheduleArray[year] = {
          year: year,
          months: []
        };
      }

      // Create this Month object if missing in Year
      if (_this.scheduleArray[year].months[monthNum] === undefined) {
        _this.scheduleArray[year].months[monthNum] = {
          month: month,
          days: []
        };
      }

      // Create this Day object if missing in Month
      if (_this.scheduleArray[year].months[monthNum].days[dayNum] === undefined) {
        _this.scheduleArray[year].months[monthNum].days[dayNum] = {
          day: day,
          events: []
        };
      }

      // Push Event object to events array
      _this.scheduleArray[year].months[monthNum].days[dayNum].events.push({
        hour: hour,
        title: scheduleEvent.title,
        content: scheduleEvent.content
      });
    });
  },

  addEventsToDom: function() {
    var _this = this;
    var scheduleHTML = '';

    // Make Years
    _this.scheduleArray.forEach(function(year, yearIndex) {

      // create content element
      var yearContent = document.createElement('h3');
      // fill with year
      yearContent.innerText = year.year;

      // add Year row to HTML
      scheduleHTML += _this.makeEventsRow(
        // parent element
        _this.programacionContainer,
        // row id
        yearIndex,
        // row content
        yearContent
      );

      // Make Months
      year.months.forEach(function(month, monthIndex) {

        // create content element
        var monthContent = document.createElement('h3');
        // fill with month
        monthContent.innerText = month.month;

        // make Month row
        _this.makeEventsRow(
          document.getElementById(yearIndex),
          yearIndex + '-' + monthIndex,
          monthContent
        );

        // Make Days
        month.days.forEach(function(day, dayIndex) {

          // create content element
          var dayContent = document.createElement('h3');
          // fill with day
          dayContent.innerText = day.day;

          // make Day row
          _this.makeEventsRow(
            document.getElementById(yearIndex + '-' + monthIndex),
            yearIndex + '-' + monthIndex + '-' + dayIndex,
            dayContent
          );

          // Make Events
          day.events.forEach(function(eventObj, eventIndex) {

            // create content element
            var eventContent = document.createElement('div');
            // set element element class
            eventContent.className = 'programacion-event';
            // fill with event info
            eventContent.innerHTML = '<div class="programacion-event-hour">' + eventObj.hour + '</div><div class="programacion-event-info"><h2>' + eventObj.title + '</h2>' + eventObj.content;

            // make Event row
            _this.makeEventsRow(
              document.getElementById(yearIndex + '-' + monthIndex + '-' + dayIndex),
              yearIndex + '-' + monthIndex + '-' + dayIndex + '-' + eventIndex,
              eventContent
            );

          });

        });

      });

    });
  },

  // Generate DOM for an events row and append it:
  // <div id={id} class="programacion-row">
  //   {rowContent}
  // </div>
  makeEventsRow: function(container, id, rowContent) {
    var _this = this;

    // Create row element
    var newRow = document.createElement('div');

    // Set attributes
    newRow.id = id;
    newRow.className = 'programacion-row';
    newRow.appendChild(rowContent);

    // Append row to container
    container.appendChild(newRow);
  }
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
    _this.camera = new THREE.PerspectiveCamera( 60, document.body.clientWidth / window.innerHeight, 1, 2000 );
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
    _this.renderer.setSize( document.body.clientWidth, window.innerHeight );
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
        Site.triggerEvent('streamoffline', data);

      } else if (data.status === 'online')  {  // else  (stream is online)

        // Trigger the event
        Site.triggerEvent('streamonline', data);
      }
    })
    .fail( function() {
      // Trigger the event
      Site.triggerEvent('streamoffline');

      console.log('Radio.co seems to be unresponsive');

    });

  },

};

Site.Player = {
  neverPlayed: true,
  fadeTime:  2000,
  streamUrl: 'http://streaming.radio.co/s0b5e9c02c/listen',
  init: function() {
    var _this = this;

    // Calculate the volume increment
    _this.volumeIncrement = 1 / (_this.fadeTime / 50);

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
    _this.animateTest = _this.animateTest.bind(_this); // TODO: Remove when globe is done

    // Subscribe to stream events
    document.addEventListener('streamonline', _this.handleOnlineStream);
    document.addEventListener('streamoffline', _this.handleOfflineStream);

    // Subscribe to clic on player controls
    _this.playButton.addEventListener('click', _this.play.bind(_this));
    _this.pauseButton.addEventListener('click', _this.pause.bind(_this));

  },

  /*
   * Setup all web audio stuff.
   */
  setupAudioProcessing: function() {
    var _this = this;

    // Set Audio Context
    _this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create audio source from <audio>
    _this.audioSource = _this.audioContext.createMediaElementSource(_this.playerElement);

    // Create analyser node
    _this.audioAnalyser = _this.audioContext.createAnalyser();

    // Set analyser settings
    _this.audioAnalyser.fftSize = 32;
    _this.audioAnalyser.minDecibels = -90;
    _this.audioAnalyser.maxDecibels = -10;
    _this.audioAnalyser.smoothingTimeConstant = 1;

    // Init the anaylser data array
    _this.analyserData = new Uint8Array(_this.audioAnalyser.frequencyBinCount);

    // Conect Source to Analyser
    _this.audioSource.connect(_this.audioAnalyser);

    // Conect Analyser to destination. connectin to destination triggers the audio
    _this.audioAnalyser.connect(_this.audioContext.destination);

  },

  handleOnlineStream: function(event) {
    var _this = this;

    var data = event.detail;

    // Add class `online` to the player container
    _this.playerContainer.classList.add('online');

    // Check if player src is empty
    if (_this.playerSrc.src === '') {

      // Add src
      _this.playerSrc.src = _this.streamUrl;

      // Disable player CORS restriction
      _this.playerElement.crossOrigin = 'anonymous';

      // Load src
      _this.playerElement.load();

    }

    // Update marquee status
    _this.streamStatusText.innerHTML = 'Ahora: ';

    // Update Now playing
    _this.nowPlayingText.innerHTML = data.current_track.title;

    // We subscribe to the `canplay` event from the player
    _this.playerElement.addEventListener('canplay', _this.handleCanplay);
  },

  handleCanplay: function(event) {
    var _this = this;

    // If the player has never started playing
    if (_this.neverPlayed) {

      // Play the player
      _this.play();

      // Setup Audio processing
      _this.setupAudioProcessing();

      // Trigger test animation, which actually is not really an animation but its just for testing
      window.requestAnimationFrame(_this.animateTest); // TODO remove when globe is done
    }

  },

  // TODO remove when globe is done
  animateTest: function() {
    var _this = this;

    window.requestAnimationFrame(_this.animateTest);


    // When the globe is done, from whatever code is animating it we will call `Site.Player.analyserData[2]` to
    var level = parseInt(_this.getAnalyserValue() / 2);
    var levelString = new Array(level + 1).join('#');

    console.log(levelString);

  },

  // Returns analyser data
  // TODO: Globe should call this function on every `render()`
  // Site.Plater.getAnalyserValue();
  getAnalyserValue: function() {
    var _this = this;

    // Pass anlyser data to _this.analyserData
    _this.audioAnalyser.getByteTimeDomainData(_this.analyserData);

    // from max 256
    var returnAnalysisValue = 256 - _this.analyserData[0];

    return returnAnalysisValue;

  },

  handleOfflineStream: function() {
    var _this = this;

    // Remove `online` class from the player container
    _this.playerContainer.classList.remove('online');

    // Update marquee status
    _this.streamStatusText.innerHTML = 'Siguiente: ';

    // Update the marquee text
    _this.nowPlayingText.innerHTML = 'the upcoming show that has to be requested thru ajax';

    // Pause the player
    _this.pause();
  },

  play: function() {
    var _this = this;

    if (_this.playerElement.networkState !== 3) {

      // Reset volume
      _this.playerElement.volume = 0;

      if( _this.playerElement.paused) {

        // Play audio element
        _this.playerElement.play();

      }

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

    // Mute the player instead of pause to keep the stream in sync
    // because pause doesn't exist in live radio
    _this.playerElement.volume = 0;

    // Remove `playing` class from the player container
    _this.playerContainer.classList.remove('playing');
  },
};

Site.init();
