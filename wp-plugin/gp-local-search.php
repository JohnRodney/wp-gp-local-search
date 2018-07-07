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

defined('ABSPATH') or die('find seek destroy');

function fileFromName($fileName) {
  return plugin_dir_path(__File__) . $fileName;
}

include (fileFromName('class-file.php'));
include (fileFromName('settings-page.php'));

$thisPlugin = new GPLocalSearch();

register_activation_hook(__FILE__, array($thisPlugin, 'activate'));
register_deactivation_hook(__FILE__, array($thisPlugin, 'deactivate'));
add_action($wpConstants->queScripts, array($thisPlugin, $thisPlugin->scripts));
