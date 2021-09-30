<?php
/**
 * Plugin Name:  Advanced List Block
 * Description:
 * Version:      1.0.0
 * Author:       Crocoblock
 * Author URI:   https://crocoblock.com
 * License:      GPL-2.0-or-later
 * License URI:  https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:  jet-advanced-list-block
 */

/**
 * Get plugin config part by key
 *
 * @return string
 */
function jet_advanced_list_block_config( $key = '', $suffix = '' ) {

	$config = array(
		'plugin_dir' => trailingslashit( dirname( __FILE__ ) ),
		'plugin_url' => plugins_url( '/', __FILE__ ),
		'slug'       => 'jet-advanced-list-block',
		'version'    => '1.0.0-' . time(),
		'deps'       => array( 'wp-blocks', 'wp-components', 'wp-element', 'wp-block-editor', 'wp-i18n', 'wp-polyfill', 'lodash', 'wp-api-fetch' ),
	);

	if ( isset( $config[ $key ] ) ) {

		if ( is_array( $config[ $key ] ) ) {
			return $config[ $key ];
		} else {
			return $config[ $key ] . $suffix;
		}

	} else {
		return false;
	}
}

/**
 * Register all block assets
 */
function jet_advanced_list_block_init() {

	wp_register_script(
		jet_advanced_list_block_config( 'slug', '-editor' ),
		jet_advanced_list_block_config( 'plugin_url', 'assets/js/editor.js' ),
		jet_advanced_list_block_config( 'deps' ),
		jet_advanced_list_block_config( 'version' ),
		true
	);

	wp_set_script_translations(
		jet_advanced_list_block_config( 'slug', '-editor' ),
		jet_advanced_list_block_config( 'slug' )
	);

	wp_register_style(
		jet_advanced_list_block_config( 'slug', '-editor' ),
		jet_advanced_list_block_config( 'plugin_url', 'assets/css/editor-style.css' ),
		array(),
		jet_advanced_list_block_config( 'version' )
	);

	wp_register_style(
		jet_advanced_list_block_config( 'slug' ),
		jet_advanced_list_block_config( 'plugin_url', 'assets/css/style.css' ),
		array(),
		jet_advanced_list_block_config( 'version' )
	);

	$mimes = get_allowed_mime_types();

	wp_localize_script( jet_advanced_list_block_config( 'slug', '-editor' ), 'JetAdvancedListData', array(
		'supportSVG' => isset( $mimes['svg'] ) ? true : false,
	) );

	register_block_type( jet_advanced_list_block_config( 'plugin_dir', 'list-block.json' ) );
	register_block_type( jet_advanced_list_block_config( 'plugin_dir', 'list-item-block.json' ) );

}

add_action( 'init', 'jet_advanced_list_block_init' );

/**
 * Retrieves SVG icon content by media ID
 *
 * @return [type] [description]
 */
function jet_advanced_list_block_get_svg() {

	if ( ! current_user_can( 'upload_files' ) ) {
		wp_send_json_error( 'You are not allowed to do this' );
	}

	$media_id = ! empty( $_GET['media_id'] ) ? absint( $_GET['media_id'] ) : false;

	if ( ! $media_id ) {
		wp_send_json_error( 'Media ID not found in the request' );
	}

	$mime = get_post_mime_type( $media_id );

	if ( ! $mime || 'image/svg+xml' !== $mime ) {
		wp_send_json_error( 'This media type is not supported, please use SVG image' );
	}

	$file = get_attached_file( $media_id );

	ob_start();
	include $file;
	$content = apply_filters( 'jet-advanced-list-block/get-svg/content', ob_get_clean(), $media_id );

	wp_send_json_success( $content );

}

add_action( 'wp_ajax_jet_advanced_list_block_get_svg', 'jet_advanced_list_block_get_svg' );
