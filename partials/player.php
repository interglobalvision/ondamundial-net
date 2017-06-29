<section id="player-container" class="margin-bottom-small blend-difference">
  <audio id="player">
    <source id="player-src" type="audio/mpeg" />
  </audio>
  <div class="container">
    <div id="player-row" class="grid-row align-items-center">
      <div id="player-control-holder" class="grid-item">
        <span id="offline-icon"><a href="#" class="js-page-open" data-page="programacion"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/player-offline.svg'); ?></a></span>
        <span id="player-control">
          <span id="play-button"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/player-play.svg'); ?></span>
          <span id="pause-button"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/player-pause.svg'); ?></span>
        </span>
      </div>
      <div id="player-status" class="grid-item">
        <span id="stream-status" class="font-averta font-size-large"></span>
        <div id="now-playing-marquee">
          <span id="now-playing" class="font-size-mid"></span>
        </div>
      </div>
    </div>
  </div>
</section>
