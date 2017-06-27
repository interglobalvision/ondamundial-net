<?php

if( function_exists( 'add_theme_support' ) ) {
  add_theme_support( 'post-thumbnails' );
}

if( function_exists( 'add_image_size' ) ) {
  add_image_size( 'admin-thumb', 150, 150, false );
  add_image_size( 'opengraph', 1200, 630, true );

  add_image_size( 'gallery', 1200, 9999, false );

  add_image_size( '568w', 568, 9999, false ); // max-width of iphone 5
  add_image_size( '736w', 736, 9999, false ); // max-width of iphone 6 plus
  add_image_size( '1024w', 1024, 9999, false ); // max-widht of ipad
  add_image_size( '1680w', 1680, 9999, false ); // macbookpro
}
