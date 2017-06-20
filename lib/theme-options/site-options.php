<?php
// SITE OPTIONS
$prefix = '_igv_';
$suffix = '_options';

$page_key = $prefix . 'site' . $suffix;
$page_title = 'Site Options';
$metabox = array(
  'id'         => $page_key, //id used as tab page slug, must be unique
  'title'      => $page_title,
  'show_on'    => array( 'key' => 'options-page', 'value' => array( $page_key ), ), //value must be same as id
  'show_names' => true,
  'fields'     => array(

    // LIVE SHOW

    array(
      'name' => __( 'Stream', 'cmb2' ),
      'desc' => __( '', 'cmb2' ),
      'id'   => $prefix . 'stream_title',
      'type' => 'title',
    ),
    array(
      'name'    => __( 'Evento Actual/Siguente', 'IGV' ),
      'id'      => $prefix . 'radio_evento_current',
      'type'    => 'select',
      'show_option_none' => false,
      'options' => get_post_objects(
        array(
          'post_type' => 'evento',
          'meta_key' => '_igv_evento_start',
          'order' => 'ASC',
          'orderby' => 'meta_value',
          'meta_query' => array(
            array(
              'key'     => '_igv_evento_start',
        			'value'   => current_time('timestamp') - (60 * 60 * 6), // UTC -5, 6 hours ago
        			'compare' => '>',
            ),
            array(
              'key'     => '_igv_evento_start',
        			'value'   => current_time('timestamp') + (60 * 60 * 24), // UTC -5, 24 hours later
        			'compare' => '<',
            )
          )
        )
      )
    ),
    array(
  		'name' => esc_html__( 'Radio.co URL', 'cmb2' ),
  		'id'   => $prefix . 'radioco_url',
  		'type' => 'text_url',
  		'protocols' => array('http', 'https'), // Array of allowed protocols
  	),
    array(
  		'name' => esc_html__( 'Archivo Mixcloud URL', 'cmb2' ),
  		'id'   => $prefix . 'mixcloud_url',
  		'type' => 'text_url',
  		'protocols' => array('http', 'https'), // Array of allowed protocols
  	),

    // SOCIAL MEDIA

    array(
      'name' => __( 'Social Media', 'cmb2' ),
      'desc' => __( 'urls and accounts for different social media platforms. For use in menus and metadata', 'cmb2' ),
      'id'   => $prefix . 'socialmedia_title',
      'type' => 'title',
    ),
    array(
      'name' => __( 'Facebook Page URL', 'IGV' ),
      'desc' => __( '', 'IGV' ),
      'id'   => $prefix . 'socialmedia_facebook_url',
      'type' => 'text',
    ),
    array(
      'name' => __( 'Twitter Account Handle', 'IGV' ),
      'desc' => __( '', 'IGV' ),
      'id'   => $prefix . 'socialmedia_twitter',
      'type' => 'text',
    ),
    array(
      'name' => __( 'Instagram Account Handle', 'IGV' ),
      'desc' => __( '', 'IGV' ),
      'id'   => $prefix . 'socialmedia_instagram',
      'type' => 'text',
    ),

    // METADATA OPTIONS

    array(
      'name' => __( 'Metadata options', 'cmb2' ),
      'desc' => __( 'Settings relating to open graph, facebook and twitter sharing, and other social media metadata', 'cmb2' ),
      'id'   => $prefix . 'og_title',
      'type' => 'title',
    ),
    array(
      'name' => __( 'Open Graph default image', 'IGV' ),
      'desc' => __( 'primarily displayed on Facebook, but other locations as well', 'IGV' ),
      'id'   => $prefix . 'og_image',
      'type' => 'file',
    ),
    array(
      'name' => __( 'Logo for SEO results', 'IGV' ),
      'desc' => __( '(options) ', 'IGV' ),
      'id'   => $prefix . 'metadata_logo',
      'type' => 'file',
    ),
    array(
      'name' => __( 'Facebook App ID', 'IGV' ),
      'desc' => __( '(optional)', 'IGV' ),
      'id'   => $prefix . 'og_fb_app_id',
      'type' => 'text',
    ),

    // ANALYTICS

    array(
      'name' => __( 'Analytics', 'cmb2' ),
      'desc' => __( '', 'cmb2' ),
      'id'   => $prefix . 'analytics_title',
      'type' => 'title',
    ),
    array(
      'name' => __( 'Google Analytics Tracking ID', 'IGV' ),
      'desc' => __( '(optional)', 'IGV' ),
      'id'   => $prefix . 'google_analytics_id',
      'type' => 'text',
    )
  )
);

IGV_init_options_page($page_key, $page_key, $page_title, $metabox);
