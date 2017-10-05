<?php

function current_event_call($data) {
  $current_event_id = IGV_get_option('_igv_site_options', '_igv_radio_evento_current');
  $marquee_text = IGV_get_option('_igv_site_options', '_igv_marquee_append_text');

  // Get selected event data
  $current_event = get_post($current_event_id);

  // Get event's thumbnail id
  $current_event_thumbnail_id = get_post_thumbnail_id($current_event_id);

  // Get event's thumbnail in diff sizes
  $featured_thumbnail_sizes = get_attachment_in_sizes($current_event_thumbnail_id);

  //
  $title = !empty($current_event) ? $current_event->post_title : false;
  $featured_thumbnails = $featured_thumbnail_sizes ? $featured_thumbnail_sizes : false;

  // Make the response array
  $response = array(
    'title' => $title,
    'featuredThumbnails' => $featured_thumbnails,
    'marqueeText' => $marquee_text,
  );

  return $response;
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'igv', '/current-event', array(
    'methods' => 'GET',
    'callback' => 'current_event_call',
  ) );
} );
