<?php

include (fileFromName('wp-constants.php'));

$wpConstants = new WordPressCommands();

class GPLocalSearch {
  private $options;
  /* Plugin constants */
  public $pluginPrefix = 'gp_local_search';
  public $scripts = 'registerScriptsAndStyles';
  public $apiKey = '';
  public $pluginDir;
  public $baseStyleHandle;
  public $iconStyleHandle;
  public $mapScriptHandle;
  public $scriptHandlesLocationPairs;

  public function __construct() {
    /* temporary shorthand handle for the class plugin prefix */
    $pre = $this->pluginPrefix;
    $this->options = get_option('my_option_name');
    if (isset($this->options['google-places-api-key'])) {
      $this->apiKey = $this->options['google-places-api-key'];
    }
    /* Setup properties that must be calculated at runtime */
    $this->pluginDir = plugin_dir_url(__FILE__);
    $this->baseStyleHandle = $pre . '_base_style';
    $this->iconStyleHandle = $pre . '_icon_style';
    $this->mapScriptHandle = $pre . '_map_script';
    $this->mainScriptHandle = $pre . '_main_script';

    /* create an associative array for handling the scripts and styles of the
     * plugin */
    $this->scriptHandlesLocationPairs = array(
      $this->baseStyleHandle => $this->pluginDir . 'maps.css',
      $this->iconStyleHandle => 'https://fonts.googleapis.com/icon?family=Material+Icons',
      $this->mapScriptHandle => 'https://maps.googleapis.com/maps/api/js?key=' . $this->apiKey . '&libraries=places&callback=init',
      $this->mainScriptHandle => $this->pluginDir . 'main.js'
    );

    add_action('wp_head', array($this, 'setupMapConfig'));
  }

  public function setupMapConfig() {
    $this->options = get_option( 'my_option_name' );

    $script = '
       <script>
         window.config = {
           defaultName: "' . $this->options['name'] . '",
           defaultAddress: "' .$this->options['location'] . '",
           defaultTypes: "' .$this->options['categories'] . '".split(\',\'),
         }
       </script>
    ';

    echo $script;
  }

  public function activate() {

  }

  public function deactivate() {

  }

  public function uninstall() {

  }

  /* a method for shorthand adding the styles */
  public function queStyle($handle) {
    wp_enqueue_style($handle, $this->scriptHandlesLocationPairs[$handle]);
  }

  /* a method for shorthand adding the script */
  public function queScript($handle) {
    wp_enqueue_script($handle, $this->scriptHandlesLocationPairs[$handle]);
  }

  /* register all the scripts and styles for the application */
  public function registerScriptsAndStyles() {
    $this->queStyle($this->baseStyleHandle);
    $this->queStyle($this->iconStyleHandle);
    $this->queScript($this->mainScriptHandle);
    $this->queScript($this->mapScriptHandle);
  }
}
