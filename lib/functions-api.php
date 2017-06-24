<?php

function current_event_call($data) {
  $current_event_id = IGV_get_option('_igv_site_options', '_igv_radio_evento_current');

  // Check if no event is selected
  if (empty($current_event_id)) {
    return false;
  }

  // Get selected event data
  $current_event = get_post($current_event_id);

  // Get event's feat thumbnail
  $event_thumbnail = get_the_post_thumbnail_url($current_event_id);

  // Make the response array
  $response = array(
    'title' => $current_event->post_title,
    'featured_image' => $event_thumbnail,
  );

  return $response;
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'igv', '/current-event', array(
    'methods' => 'GET',
    'callback' => 'current_event_call',
  ) );
} );
