<?php
get_header();
?>

<main id="main-content">

  <?php get_template_part('partials/player'); ?>

  <section id="pages">

    <section id="page-programacion" class="page-overlay">
      <div class="container">
      </div>
    </section>

<?php
  $page_sobre = get_page_by_path('sobre');

  if (!empty($page_sobre)) {
?>
    <section id="page-sobre" class="page-overlay padding-bottom-large">
      <div class="container">
        <div class="grid-row">
          <div class="grid-item item-s-12 item-m-10 offset-m-1 font-size-mid">
            <?php echo apply_filters('the_content', $page_sobre->post_content); ?>
          </div>
        </div>
      </div>
    </section>
<?php
  }
?>

  </section>

</main>

<?php
get_footer();
?>
