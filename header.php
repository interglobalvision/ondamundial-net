<!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns#">
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title><?php wp_title('|',true,'right'); bloginfo('name'); ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <?php
    get_template_part('partials/globie');
    get_template_part('partials/seo');
  ?>

  <link rel="alternate" type="application/rss+xml" title="<?php bloginfo('name'); ?> RSS Feed" href="<?php bloginfo('rss2_url'); ?>" />
  <link rel="icon" href="<?php bloginfo('stylesheet_directory'); ?>/dist/img/favicon.png">
  <link rel="shortcut" href="<?php bloginfo('stylesheet_directory'); ?>/dist/img/favicon.ico">
  <link rel="apple-touch-icon" href="<?php bloginfo('stylesheet_directory'); ?>/dist/img/favicon-touch.png">
  <link rel="apple-touch-icon" sizes="114x114" href="<?php bloginfo('stylesheet_directory'); ?>/dist/img/favicon.png">

  <?php if (is_singular() && pings_open(get_queried_object())) { ?>
  <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">
  <?php } ?>
  <?php wp_head(); ?>
</head>

<?php
  $is_live = IGV_get_option('_igv_site_options', '_igv_radio_live');
  $current_event_id = IGV_get_option('_igv_site_options', '_igv_radio_evento_current');
  $event_image_id = get_post_thumbnail_id($current_event_id);
?>

<body <?php
  body_class();

  if ($is_live == 'on' && $event_image_id != null) {
    $event_image_url = wp_get_attachment_image_src($event_image_id, 'site_bg');
?> style="background-image: url('<?php echo $event_image_url; ?>')"> <?php } ?>>
<!--[if lt IE 9]><p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p><![endif]-->

<section id="main-container">

  <header id="header">
    <div class="grid-row align-items-center">
      <div class="grid-item">
        <?php echo url_get_contents(get_template_directory_uri() . '/dist/img/om-logo.svg'); ?>
      </div>
      <div id="site-title-holder" class="grid-item">
        <h1><a href="<?php echo home_url(); ?>"><?php bloginfo('name'); ?></a></h1>
      </div>
      <div class="grid-item desktop-only flex-grow justify-center">
<?php
  $mixcloud_url = IGV_get_option('_igv_site_options', '_igv_mixcloud_url');
?>
        <nav>
          <ul class="u-inline-list text-align-center">
            <li><a href="#" class="js-nav-page" data-nav="programacion">Programación</a></li>
<?php
  if (!empty($mixcloud_url)) {
?>
            <li><a href="<?php echo $mixcloud_url; ?>">Archivo</a></li>
<?php
  }
?>
            <li><a href="#" class="js-nav-page" data-nav="sobre">Sobre</a></li>
          </ul>
        </nav>
      </div>
      <div class="grid-item desktop-only">
<?php
  $facebook_url = IGV_get_option('_igv_site_options', '_igv_socialmedia_facebook_url');
  $twitter_handle = IGV_get_option('_igv_site_options', '_igv_socialmedia_twitter');
  $instagram_handle = IGV_get_option('_igv_site_options', '_igv_socialmedia_instagram');
?>
        <ul>
<?php
  if (!empty($facebook_url)) {
?>
          <li><a href="<?php echo $facebook_url; ?>"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-facebook.svg'); ?></a></li>
<?php
  }

  if (!empty($twitter_handle)) {
?>
          <li><a href="https://www.twitter.com/<?php echo $twitter_handle; ?>"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-twitter.svg'); ?></a></li>
<?php
  }

  if (!empty($instagram_handle)) {
?>
          <li><a href="https://www.instagram.com/<?php echo $instagram_handle; ?>"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-instagram.svg'); ?></a></li>
<?php
  }
?>
        </ul>
      </div>
      <div id="overlay-toggle-holder" class="grid-item">
        <div id="overlay-toggle"></div>
      </div>
    </div>
    <div id="mobile-menu" class="mobile-only page-overlay">
      <nav>
        <ul>
          <li><a href="#" class="js-nav-page" data-nav="programacion">Programación</a></li>
<?php
  if (!empty($mixcloud_url)) {
?>
          <li><a href="<?php echo $mixcloud_url; ?>">Archivo</a></li>
<?php
  }
?>
          <li><a href="#" class="js-nav-page" data-nav="sobre">Sobre</a></li>
          <li>
            <ul>
<?php
  if (!empty($facebook_url)) {
?>
              <li><a href="<?php echo $facebook_url; ?>"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-facebook.svg'); ?></a></li>
<?php
  }

  if (!empty($twitter_handle)) {
?>
              <li><a href="https://www.twitter.com/<?php echo $twitter_handle; ?>"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-twitter.svg'); ?></a></li>
<?php
  }

  if (!empty($instagram_handle)) {
?>
              <li><a href="https://www.instagram.com/<?php echo $instagram_handle; ?>"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-instagram.svg'); ?></a></li>
<?php
  }
?>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </header>
