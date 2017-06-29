<?php

// Custom functions (like special queries, etc)

function convertUTCtoCDMX($timestamp) {
  $utcOffset = get_option('gmt_offset');
  $timestampConverted = $timestamp - ($utcOffset * 60 * 60);
  return $timestampConverted;
}

// Returns object of events to JS as WP.eventsObject
function get_events_object() {
  // Events since 24 hours ago
  $args = array(
    'post_type' => 'evento',
    'meta_key' => '_igv_evento_start',
    'order' => 'ASC',
    'orderby' => 'meta_value',
    'meta_query' => array(
      array(
        'key'     => '_igv_evento_start',
        'value'   => time() - (60 * 60 * 24), // UTC 0, 24 hours ago
        'compare' => '>',
      )
    )
  );

  $posts = get_posts( $args );
  $events_object = array();

  if ( $posts ) {
    foreach ( $posts as $post ) {
      $timestamp = get_post_meta($post->ID, '_igv_evento_start', true);

      $events_object[] = array(
        'timestamp' => convertUTCtoCDMX($timestamp),
        'title' => $post->post_title,
        'content' => apply_filters('the_content', $post->post_content),
      );
    }
    return json_encode($events_object);
  } else {
    return null;
  }
}

function get_attachment_in_sizes($attachment_id) {
  // Set used attachment sizes
  // NOTE: Order is important, goes from small  to large

  $attachment_sizes = array(
    '568w', // max-width of iphone 5
    '736w', // max-width of iphone 6 plus
    '1024w', // max-widht of ipad
    '1680w', // macbookpro
    'original', // original
  );

  // Init empty array to store the attachments and it's sizes
  $featured_attachment_sizes = array();

  foreach($attachment_sizes as $size) {

    // Get event's attachment url
    $attachment = wp_get_attachment_image_src($attachment_id, $size);

    if (!empty($attachment)) {

      array_push($featured_attachment_sizes, array(
        'url' => $attachment[0],
        'width' => $attachment[1],
        'height' => $attachment[2],
      ));
    }

  }

  if (empty($featured_attachment_sizes)) {
    $featured_attachment_sizes = false;
  }

  return $featured_attachment_sizes;

}
