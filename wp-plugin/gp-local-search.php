<?php
/*
Plugin Name:  gp-local-search
Plugin URI:   na
Description:  A wordpress plugin for real-estate apartments to embed local place queries on their website map
Version:      9000
Author:       John Rodney
Author URI:   na
License:      MIT
License URI:  NA
Text Domain:  NA
Domain Path:  /languages
*/

add_action('admin_menu', 'gp_local_search_menu');
add_action('admin_init', 'register_gp_local_settings');
add_action('wp_enqueue_scripts', 'gp_local_search_enqueue_script');

function register_gp_local_settings() { // whitelist options
  register_setting( 'gp_local_search_group', 'gp_local_search_group', 'plugin_options_validate' );
  add_settings_section('gp_local_search_main', 'Main Settings', 'gp_local_search_section_text', 'gp_local_search');
  add_settings_field('gp_local_search_text_string', 'Plugin Text Input', 'gp_local_search_setting_string', 'gp_local_search', 'gp_local_search_main');
}

function gp_local_search_section_text() {
  echo '<p>Location</p>';
}

function gp_local_search_setting_string() {
  $options = get_option('gp_local_search_group');
  echo "<input id='gp_local_search_text_string' name='gp_local_search_group_options[text_string]' size='40' type='text' value='{$options['text_string']}' />";
}

function gp_local_search_enqueue_script() {
  wp_enqueue_style( 'gp_local_search_styles', plugin_dir_url( __FILE__ ) . 'maps.css' );
  wp_enqueue_style( 'gp_local_search_material_icons', 'https://fonts.googleapis.com/icon?family=Material+Icons' );
  wp_register_script('google_maps_api_script', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC83D_8NGuAQjm4KVOH-U2In3AUpMgQ_18&libraries=places&callback=init');
  wp_register_script('main_js_script', plugin_dir_url( __FILE__ ) . 'main.js');
  wp_enqueue_script('main_js_script');
  wp_enqueue_script('google_maps_api_script');
}

function gp_local_search_menu() {
  add_options_page( 'Google Places Local Search', 'Local Places', 'manage_options', 'gp-local-search-admin', 'gp_local_search_options' );
}

function gp_local_search_options() {
  if ( !current_user_can( 'manage_options' ) )  {
    wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
  }
  echo '<div class="wrap">';
  echo '<h1>Google Places Local Search</h1>';
    echo '<form method="post" action="options.php">';
    echo settings_fields('gp_local_search_group');
    echo do_settings_sections('gp_local_search');
    echo submit_button();
    echo '</form>';
  echo '</div>';
}
