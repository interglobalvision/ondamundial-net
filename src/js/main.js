/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, jQuery, document, Site, Modernizr, moment, WP */

Site = {
  mobileThreshold: 601,
  init: function() {
    var _this = this;

    $(window).resize(function() {
      _this.onResize();
    });

    $(document).ready(function () {
      Site.Player.init();
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
};

Site.Programacion = {
  // parse JSON event posts object from Wordpress
  eventsPosts: JSON.parse(WP.programacionEvents),
  scheduleArray: [],
  programacionContainer: document.getElementById('page-programacion'),

  init: function() {
    var _this = this;

    // loop through Years -> Months -> Days -> Events
    _this.fillEventsObject();

    // add schedule to DOM
    _this.addEventsToDom();
  },

  fillEventsObject: function() {
    var _this = this;

    // forEach event
    _this.eventsPosts.forEach(function(el) {
      // generate moment from timestamp in user local timezone
      var eventMoment = moment.unix(parseInt(el.timestamp));

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
        title: el.title,
        content: el.content
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

  makeEventsRow: function(container, id, rowContent) {
    var _this = this;

    // create row element
    var newRow = document.createElement('div');

    newRow.id = id;
    newRow.className = 'programacion-row';
    newRow.appendChild(rowContent);

    // append row to container
    container.appendChild(newRow);
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
