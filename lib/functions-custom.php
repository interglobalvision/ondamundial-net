<?php

// Custom functions (like special queries, etc)

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
        'value'   => time() - (60 * 60 * 24), // UTC -5, 24 hours ago
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
        'timestamp' => $timestamp,
        'title' => $post->post_title,
        'content' => apply_filters('the_content', $post->post_content),
      );
    }
    return json_encode($events_object);
  } else {
    return null;
  }
}
