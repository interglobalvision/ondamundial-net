<?php

function current_event_call($data) {
  $current_event_id = IGV_get_option('_igv_site_options', '_igv_radio_evento_current');

  $thumbnail_sizes = array(
    '568w', // max-width of iphone 5
    '736w', // max-width of iphone 6 plus
    '1024w', // max-widht of ipad
    '1680w', // macbookpro
    'original', // original
  );

  // Check if no event is selected
  if (empty($current_event_id)) {
    return false;
  }

  // Get selected event data
  $current_event = get_post($current_event_id);

  // Get event's thumbnail id
  $thumbnail_id = get_post_thumbnail_id($current_event_id);

  // Init empty array to store the thumbnails and it's sizes
  $featured_thumbnail_sizes = array();

  foreach($thumbnail_sizes as $size) {

    // Get event's thumbnail url
    $thumbnail = wp_get_attachment_image_src($thumbnail_id, $size);

    if (!empty($thumbnail)) {

      array_push($featured_thumbnail_sizes, array(
        'url' => $thumbnail[0],
        'width' => $thumbnail[1],
        'height' => $thumbnail[2],
      ));
    }

  }

  // Make the response array
  $response = array(
    'title' => $current_event->post_title,
    'featured_thumbnails' => $featured_thumbnail_sizes,
  );

  return $response;
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'igv', '/current-event', array(
    'methods' => 'GET',
    'callback' => 'current_event_call',
  ) );
} );
