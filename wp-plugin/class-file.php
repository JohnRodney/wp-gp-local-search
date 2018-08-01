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
    add_shortcode('gp-search-map', array('GPLocalSearch', 'getReactApplicationTargetDiv'));
  }

  public function getReactApplicationTargetDiv($atts) {
    $style = "";

    if (isset($atts['max-height'])) {
      $style .= "max-height: " . $atts['max-height'] . "px;";
    }

    if (isset($atts['max-width'])) {
      $style .= "max-width: " . $atts['max-width'] . "px;";
    }

    return "<div id='gp-react-target' style='" . $style . "'></div>";
  }

  public function setupMapConfig() {
    $this->options = get_option( 'my_option_name' );
    $lat = 'false';
    $lng = 'false';

    if (isset($this->options['longitude'])) {
      $lng = $this->options['longitude'] !== '' ? $this->options['longitude'] : 'false';
    }

    if (isset($this->options['latitude'])) {
      $lat = $this->options['latitude'] !== '' ? $this->options['latitude'] : 'false';
    }

    $script = '
       <script>
         window.config = {
           lng: ' . $lng  . ',
           lat: ' . $lat  . ',
           defaultName: "' . $this->options['name'] . '",
           defaultAddress: "' .$this->options['location'] . '",
           defaultTypes: "' .$this->options['categories'] . '".split(\',\'),
           defaultFilters: "' .$this->options['filters'] . '".split(\',\'),
           listView: "' .$this->options['list-view'] . '",
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
    wp_enqueue_style($handle, $this->scriptHandlesLocationPairs[$handle], array(), date("h:i:s"));
  }

  /* a method for shorthand adding the script */
  public function queScript($handle) {
    wp_enqueue_script($handle, $this->scriptHandlesLocationPairs[$handle], array(), date("h:i:s"));
  }

  public function queScriptWithVersion($handle) {
    wp_enqueue_script($handle, $this->scriptHandlesLocationPairs[$handle], array(), date("h:i:s"));
  }

  /* register all the scripts and styles for the application */
  public function registerScriptsAndStyles() {
    $this->queStyle($this->baseStyleHandle);
    $this->queStyle($this->iconStyleHandle);
    $this->queScriptWithVersion($this->mainScriptHandle);
    $this->queScript($this->mapScriptHandle);
  }
}
