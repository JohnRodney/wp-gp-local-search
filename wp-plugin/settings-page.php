<?php
class MySettingsPage
{
    /**
     * Holds the values to be used in the fields callbacks
     */
    private $options;

    /**
     * Start up
     */
    public function __construct()
    {
        add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'page_init' ) );
    }

    /**
     * Add options page
     */
    public function add_plugin_page()
    {
        // This page will be under "Settings"
        add_options_page(
            'Settings Admin',
            'G-P Local Search',
            'manage_options',
            'my-setting-admin',
            array( $this, 'create_admin_page' )
        );
    }

    /**
     * Options page callback
     */
    public function create_admin_page()
    {
        // Set class property
        $this->options = get_option( 'my_option_name' );
        ?>
        <div class="wrap">
            <h1>My Settings</h1>
            <form method="post" action="options.php">
            <?php
                // This prints out all hidden setting fields
                settings_fields( 'my_option_group' );
                do_settings_sections( 'my-setting-admin' );
                submit_button();
            ?>
            </form>
        </div>
        <?php
    }

    /**
     * Register and add settings
     */
    public function page_init()
    {
        register_setting(
            'my_option_group', // Option group
            'my_option_name', // Option name
            array( $this, 'sanitize' ) // Sanitize
        );

        add_settings_section(
            'setting_section_id', // ID
            'Location Settings', // Title
            array( $this, 'print_section_info' ), // Callback
            'my-setting-admin' // Page
        );

        add_settings_field(
            'location',
            'Location',
            array( $this, 'location_callback' ),
            'my-setting-admin',
            'setting_section_id'
        );

        add_settings_field(
            'name',
            'Location Name',
            array( $this, 'name_callback' ),
            'my-setting-admin',
            'setting_section_id'
        );

        add_settings_field(
            'categories',
            'Search Categories',
            array( $this, 'categories_callback' ),
            'my-setting-admin',
            'setting_section_id'
        );

        add_settings_field(
            'google-places-api-key',
            'Google Places Api Key',
            array( $this, 'api_key_callback' ),
            'my-setting-admin',
            'setting_section_id'
        );

    }

    /**
     * Sanitize each setting field as needed
     *
     * @param array $input Contains all settings fields as array keys
     */
    public function sanitize( $input )
    {
        $new_input = array();

        if( isset( $input['location'] ) )
            $new_input['location'] = sanitize_text_field( $input['location'] );

        if( isset( $input['name'] ) )
            $new_input['name'] = sanitize_text_field( $input['name'] );

        if( isset( $input['categories'] ) )
            $new_input['categories'] = sanitize_text_field( $input['categories'] );

        if( isset( $input['google-places-api-key'] ) )
            $new_input['google-places-api-key'] = sanitize_text_field( $input['google-places-api-key'] );

        return $new_input;
    }

    /**
     * Print the Section text
     */
    public function print_section_info()
    {
        print '<hr>';
    }
    /**
     * Get the settings option array and print one of its values
     */
    public function api_key_callback()
    {
        printf(
            '<input style="width: 500px" type="password" id="google-places-api-key" name="my_option_name[google-places-api-key]" value="%s" />',
            isset( $this->options['google-places-api-key'] ) ? esc_attr( $this->options['google-places-api-key']) : ''
        );
    }

    /**
     * Get the settings option array and print one of its values
     */
    public function location_callback()
    {
        printf(
            '<input style="width: 500px" type="text" id="location" name="my_option_name[location]" value="%s" />',
            isset( $this->options['location'] ) ? esc_attr( $this->options['location']) : ''
        );
    }

    /**
     * Get the settings option array and print one of its values
     */
    public function name_callback()
    {
        printf(
            '<input style="width: 500px" type="text" id="name" name="my_option_name[name]" value="%s" />',
            isset( $this->options['name'] ) ? esc_attr( $this->options['name']) : ''
        );
    }

    /**
     * Get the settings option array and print one of its values
     */
    public function categories_callback()
    {
        printf(
            '<input style="width: 500px" type="text" id="categories" name="my_option_name[categories]" value="%s" />',
            isset( $this->options['categories'] ) ? esc_attr( $this->options['categories']) : ''
        );
    }

}

if( is_admin() )
    $my_settings_page = new MySettingsPage();
