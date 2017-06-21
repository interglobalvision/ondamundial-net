<?php
get_header();
?>

<main id="main-content">

  <section id="player">
    <?php // get_template_part('partials/player'); ?>
  </section>

  <section id="page-programacion" class="page-overlay">
  </section>

<?php
  $page_sobre = get_page_by_path('sobre');

  if ($page_sobre != null) {
?>
  <section id="page-sobre" class="page-overlay">
    <?php echo apply_filters('the_content', $page_sobre->post_content); ?>
  </section>
<?php
  }
?>

</main>

<?php
get_footer();
?>
