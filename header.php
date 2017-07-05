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

<body <?php body_class(); ?>>
<!--[if lt IE 9]><p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p><![endif]-->

<div id="earth-container">
  <div id="earth-flat" class="u-hidden"></div>
</div>

<div id="overlay"></div>

<section id="main-container">

  <header id="header" class="blend-difference font-size-mid">
    <div class="container">
      <div class="grid-row align-items-start">

        <div class="grid-item">
          <?php echo url_get_contents(get_template_directory_uri() . '/dist/img/om-logo.svg'); ?>
        </div>

        <div id="header-main" class="padding-top-small grid-item flex-grow grid-row align-items-center no-gutter">

          <div id="site-title-holder" class="grid-item">
            <h1 class="font-size-large font-averta"><a href="<?php echo home_url(); ?>"><?php bloginfo('name'); ?></a></h1>
          </div>

          <div id="desktop-nav-holder" class="grid-item">
    <?php
      $mixcloud_url = IGV_get_option('_igv_site_options', '_igv_mixcloud_url');
    ?>
            <nav>
              <ul id="desktop-nav-list" class="grid-row justify-center align-items-center">
                <li class="grid-item desktop-nav-item no-gutter grid-row justify-center" id="desktop-nav-programacion">
                  <a href="#" class="page-nav-item desktop-page-open js-page-open u-inline-block font-aileron-semibold" data-page="programacion">Programación</a>
                  <span class="desktop-page-close u-inline-block"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/om-page-close.svg'); ?></span>
                </li>
    <?php
      if (!empty($mixcloud_url)) {
    ?>
                <li class="grid-item no-gutter grid-row justify-center">
                  <a class="page-nav-item u-inline-block font-aileron-semibold" href="<?php echo $mixcloud_url; ?>">Archivo</a>
                  <span class="desktop-page-close u-inline-block"></span>
                </li>
    <?php
      }
    ?>
                <li class="desktop-nav-item grid-item no-gutter grid-row justify-center" id="desktop-nav-sobre">
                  <a href="#" class="page-nav-item desktop-page-open js-page-open u-inline-block font-aileron-semibold" data-page="sobre">Sobre</a>
                  <span class="desktop-page-close u-inline-block"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/om-page-close.svg'); ?></span>
                </li>
              </ul>
            </nav>
          </div>

          <div class="grid-item desktop-only no-gutter">
    <?php
      $facebook_url = IGV_get_option('_igv_site_options', '_igv_socialmedia_facebook_url');
      $twitter_handle = IGV_get_option('_igv_site_options', '_igv_socialmedia_twitter');
      $instagram_handle = IGV_get_option('_igv_site_options', '_igv_socialmedia_instagram');
    ?>
            <ul class="grid-row">
    <?php
      if (!empty($facebook_url)) {
    ?>
              <li class="grid-item"><a href="<?php echo $facebook_url; ?>" class="social-icon-holder"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-facebook.svg'); ?></a></li>
    <?php
      }

      if (!empty($twitter_handle)) {
    ?>
              <li class="grid-item"><a href="https://www.twitter.com/<?php echo $twitter_handle; ?>" class="social-icon-holder"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-twitter.svg'); ?></a></li>
    <?php
      }

      if (!empty($instagram_handle)) {
    ?>
              <li class="grid-item"><a href="https://www.instagram.com/<?php echo $instagram_handle; ?>" class="social-icon-holder"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-instagram.svg'); ?></a></li>
    <?php
      }
    ?>
            </ul>
          </div>

          <div id="overlay-toggle-holder" class="grid-item mobile-only">
            <div id="mobile-overlay-toggle" class="u-pointer"></div>
          </div>

        </div> <!-- end #header-main -->

      </div>

      <div id="mobile-menu" class="mobile-only page-overlay">
        <nav>
          <ul class="grid-column">
            <li class="grid-item margin-bottom-tiny font-aileron-semibold"><a href="#" class="page-nav-item js-page-open" data-page="programacion">Programación</a></li>
  <?php
    if (!empty($mixcloud_url)) {
  ?>
            <li class="grid-item margin-bottom-tiny font-aileron-semibold"><a class="page-nav-item" href="<?php echo $mixcloud_url; ?>">Archivo</a></li>
  <?php
    }
  ?>
            <li class="grid-item margin-bottom-small font-aileron-semibold"><a href="#" class="page-nav-item js-page-open" data-page="sobre">Sobre</a></li>
            <li class="grid-item no-gutter">
              <ul class="grid-row align-items-start">
  <?php
    if (!empty($facebook_url)) {
  ?>
                <li class="grid-item"><a href="<?php echo $facebook_url; ?>" class="social-icon-holder"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-facebook.svg'); ?></a></li>
  <?php
    }

    if (!empty($twitter_handle)) {
  ?>
                <li class="grid-item"><a href="https://www.twitter.com/<?php echo $twitter_handle; ?>" class="social-icon-holder"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-twitter.svg'); ?></a></li>
  <?php
    }

    if (!empty($instagram_handle)) {
  ?>
                <li class="grid-item"><a href="https://www.instagram.com/<?php echo $instagram_handle; ?>" class="social-icon-holder"><?php echo url_get_contents(get_template_directory_uri() . '/dist/img/social-instagram.svg'); ?></a></li>
  <?php
    }
  ?>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
