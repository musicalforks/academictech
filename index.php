<?php
$featuredHtml = bigpicture_featured_html();
if ($featuredHtml !== '') {
    queue_css_url('//cdn.jsdelivr.net/jquery.slick/1.5.9/slick.css');
    queue_js_url('//cdn.jsdelivr.net/jquery.slick/1.5.9/slick.min.js');
    queue_js_string('
        jQuery(document).ready(function(){
          jQuery("#featured").slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            arrows: false,
            centerMode: true,
            fade: true,
            dots: false
          });
        });
    ');
}
?>

<?php echo head(array('bodyid'=>'home')); ?>

<div id="intro">
    <?php if (get_theme_option('Homepage Text')): ?>
    <?php echo get_theme_option('Homepage Text'); ?>
    <?php endif; ?>
</div>

<div id="featured"><?php echo bigpicture_featured_html(); ?></div>

<?php header('Access-Control-Allow-Origin: https://constellation.carletonds.com/');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'); ?>

<?php require('viz.html'); ?>

</div>

<?php echo foot(); ?>
