<?php
// Menu icons for Custom Post Types
// https://developer.wordpress.org/resource/dashicons/
function add_menu_icons_styles(){
?>

<style>
#menu-posts-evento .dashicons-admin-post:before {
    content: '\f319';
}
</style>

<?php
}
add_action( 'admin_head', 'add_menu_icons_styles' );


//Register Custom Post Types
add_action( 'init', 'register_cpt_evento' );

function register_cpt_evento() {

    $labels = array(
        'name' => _x( 'Eventos', 'evento' ),
        'singular_name' => _x( 'Evento', 'evento' ),
        'add_new' => _x( 'Añadir Nuevo', 'evento' ),
        'add_new_item' => _x( 'Add Añadir Nuevo evento', 'evento' ),
        'edit_item' => _x( 'Editar evento', 'evento' ),
        'new_item' => _x( 'Nuevo evento', 'evento' ),
        'view_item' => _x( 'Ver evento', 'evento' ),
        'search_items' => _x( 'Buscar eventos', 'evento' ),
        'not_found' => _x( 'No se encontraron eventos', 'evento' ),
        'not_found_in_trash' => _x( 'Ningún evento encontrado en la papelera', 'evento' ),
        'parent_item_colon' => _x( 'Parent evento:', 'evento' ),
        'menu_name' => _x( 'Programación', 'evento' ),
    );

    $args = array(
        'labels' => $labels,
        'hierarchical' => false,

        'supports' => array( 'title', 'editor', 'thumbnail' ),

        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 5,

        'show_in_nav_menus' => true,
        'publicly_queryable' => true,
        'exclude_from_search' => false,
        'has_archive' => true,
        'query_var' => true,
        'can_export' => true,
        'rewrite' => true,
        'capability_type' => 'post'
    );

    register_post_type( 'evento', $args );
}
