<?php
$years = get_events_array();

if ($years) {
  foreach ($years as $year => $months) {
?>
<div class="program-row program-year">
<?php
    echo $year;
    foreach ($months as $month => $days) {
?>
  <div class="program-row program-month">
<?php
      echo $month;
      foreach ($days as $day => $events) {
?>
    <div class="program-row program-day">
<?php
        echo $day;
        foreach($events as $event) {
?>
      <div class="program-row program-event">
        <div class="program-event-time">
          <?php echo $event['timestamp']; ?>
        </div>
        <div class="program-event-info">
          <h3><?php echo $event['title']; ?></h3>
          <?php echo apply_filters('the_content', $event['content']); ?>
        </div>
      </div>
<?php
        }
?>
    </div>
<?php
      }
?>
  </div>
<?php
    }
?>
</div>
<?php
  }
}
?>
