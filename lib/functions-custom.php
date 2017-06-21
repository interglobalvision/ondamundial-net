<?php

// Custom functions (like special queries, etc)

function get_events_array( $query_args = '' ) {
  $args = wp_parse_args( $query_args, array(
    'post_type' => 'evento',
    'meta_key' => '_igv_evento_start',
    'order' => 'ASC',
    'orderby' => 'meta_value',
    'meta_query' => array(
      array(
        'key'     => '_igv_evento_start',
        'value'   => current_time('timestamp') - (60 * 60 * 24), // UTC -5, 6 hours ago
        'compare' => '>',
      )
    )
  ) );
  $posts = get_posts( $args );
  $event_array = array();

  if ( $posts ) {
    foreach ( $posts as $post ) {
      $timestamp = get_post_meta($post->ID, '_igv_evento_start', true);
      $year = date('Y', $timestamp);
      $month = date('F', $timestamp);
      $day = date('l j', $timestamp);

      $event_array[$year][$month][$day][] = array(
        'timestamp' => $timestamp,
        'title' => $post->post_title,
        'content' => $post->post_content
      );
    }
    return $event_array;
  } else {
    return array();
  }
}
