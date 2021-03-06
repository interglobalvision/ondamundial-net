<?php

// Enqueue

function scripts_and_styles_method() {
  $templateuri = get_template_directory_uri();

  if (WP_DEBUG) {
    $javascriptLibrary = $templateuri . '/dist/js/library.js';
    $javascriptMain = $templateuri . '/src/js/main.js';
  } else {
    $javascriptLibrary = $templateuri . '/dist/js/library.min.js';
    $javascriptMain = $templateuri . '/dist/js/main.min.js';
  }

  $is_admin = current_user_can('administrator') ? 1 : 0;

  $javascriptVars = array(
    'siteUrl' => home_url(),
    'themeUrl' => get_template_directory_uri(),
    'isAdmin' => $is_admin,
    'programacionEvents' => get_events_object(),
  );

  // Event fallback images, used for events without image
  $fallback_image_id  = IGV_get_option('_igv_site_options', '_igv_event_fallback_image_id');

  // Check if og image id exist
  if (!empty($fallback_image_id)) {
    // Get image in diff sizes
    $fallback_image_sizes = get_attachment_in_sizes($fallback_image_id);

    // Append to javascriptVars
    $javascriptVars['fallbackImage'] = $fallback_image_sizes;
  }

  wp_enqueue_script('javascript-library', $javascriptLibrary, '', '', true);

  wp_register_script('javascript-main', $javascriptMain);
  wp_localize_script('javascript-main', 'WP', $javascriptVars);
  wp_enqueue_script('javascript-main', $javascriptMain, '', '', true);

  wp_enqueue_style( 'style-site', get_stylesheet_directory_uri() . '/dist/css/site.min.css' );

  // dashicons for admin
  if (is_admin()) {
    wp_enqueue_style( 'dashicons' );
  }
}
add_action('wp_enqueue_scripts', 'scripts_and_styles_method');

// Declare thumbnail sizes

get_template_part( 'lib/thumbnail-sizes' );

// Register Nav Menus
/*
register_nav_menus( array(
  'menu_location' => 'Location Name',
) );
*/

// Add third party PHP libs

function cmb_initialize_cmb_meta_boxes() {
  if (!class_exists( 'cmb2_bootstrap_202' ) ) {
    require_once 'vendor/webdevstudios/cmb2/init.php';
  }
}
add_action( 'init', 'cmb_initialize_cmb_meta_boxes', 11 );

function composer_autoload() {
  require_once( 'vendor/autoload.php' );
}
add_action( 'init', 'composer_autoload', 10 );

// Add libs

get_template_part( 'lib/custom-gallery' );
get_template_part( 'lib/post-types' );
get_template_part( 'lib/meta-boxes' );
get_template_part( 'lib/theme-options/theme-options' );

// Add custom functions

get_template_part( 'lib/functions-api' );
get_template_part( 'lib/functions-misc' );
get_template_part( 'lib/functions-custom' );
get_template_part( 'lib/functions-filters' );
get_template_part( 'lib/functions-hooks' );
get_template_part( 'lib/functions-utility' );

?>
