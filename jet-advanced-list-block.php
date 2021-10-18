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
	register_block_type( jet_advanced_list_block_config( 'plugin_dir', 'list-item-block.json' ), array(
		'render_callback' => 'jet_advanced_list_item_render'
	) );

}

add_action( 'init', 'jet_advanced_list_block_init' );

/**
 * Retrieves SVG icon content by media ID
 *
 * @return void
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

/**
 * Returns list item icon with custom styles applied
 *
 * @param  array  $args Icon arguments
 * @return Icon HTML markup
 */
function jet_advanced_list_item_icon( $args = array() ) {

	$src = ! empty( $args['icon_src'] ) ? $args['icon_src'] : null;

	if ( ! $src ) {
		return;
	}

	$icon              = $src;
	$icon_styles       = array();
	$containter_styles = array();
	$size              = $args['icon_size'];

	if ( ! empty( $args['color'] ) ) {
		$icon_styles['color'] = $args['color'];
	}

	$icon_styles_str       = '';
	$containter_styles_str = '';

	foreach ( $icon_styles as $prop => $value ) {
		$icon_styles_str .= $prop . ': ' . $value . ';';
	}

	$icon = preg_replace( array(
		'/\<svg(.*?)width=\"(\d+)\"(.*?)\>/',
		'/\<svg(.*?)height=\"(\d+)\"(.*?)\>/',
		'/\<svg(.*?)style=\"(.*?)\"(.*?)\>/',
		'/\<svg(.*?)class=\"(.*?)\"(.*?)\>/',
	), array(
		'<svg$1width="' . $size . '"$3>',
		'<svg$1height="' . $size . '"$3>',
		'<svg$1style="' . $icon_styles_str . '"$3>',
		'<svg$1class="jet-advanced-list-item-block__icon"$3>',
	), $icon );

	if ( false === strpos( $icon, 'width="' . $size . '"' ) ) {
		$icon = str_replace( '<svg ', '<svg width="' . $size . '" ', $icon );
	}

	if ( false === strpos( $icon, 'height="' . $size . '"' ) ) {
		$icon = str_replace( '<svg ', '<svg height="' . $size . '" ', $icon );
	}

	if ( false === strpos( $icon, 'style=' ) ) {
		$icon = str_replace( '<svg ', '<svg style="' . $icon_styles_str . '" ', $icon );
	}

	if ( false === strpos( $icon, 'class="jet-advanced-list-item-block__icon"' ) ) {
		$icon = str_replace( '<svg ', '<svg class="jet-advanced-list-item-block__icon" ', $icon );
	}

	if ( ! empty( $args['gap_before'] ) ) {
		$containter_styles['padding-top'] = $args['gap_before'] . 'px';
	}

	if ( ! empty( $args['gap_after'] ) ) {
		$prop = is_rtl() ? 'padding-left' : 'padding-right';
		$containter_styles[ $prop ] = $args['gap_after'] . 'px';
	}

	foreach ( $containter_styles as $prop => $value ) {
		$containter_styles_str .= $prop . ': ' . $value . ';';
	}

	return sprintf( '<div class="%1$s" style="%3$s">%2$s</div>', $args['container'], $icon, $containter_styles_str );

}

/**
 * Render callback for list item block
 *
 * @param  array    $attributes Block attributes
 * @param  string   $content    Block content
 * @param  WP_Block $block      Block object
 * @return list item content
 */
function jet_advanced_list_item_render( $attributes, $content, $block ) {

	$context    = $block->context ? $block->context : array();
	$base_class = 'jet-advanced-list-item-block';
	$class_list = array( 'wp-block-jet-blocks-advanced-list-item', $base_class );

	$args = array(
		'layout'          => 'horizontal-start',
		'icon_src'        => '',
		'icon_size'       => 24,
		'icon_color'      => null,
		'icon_gap_before' => null,
		'icon_gap_after'  => null,
	);

	$prefix = 'jet-blocks/advanced-list/';

	foreach ( $args as $key => $default ) {
		$args[ $key ] = ! empty( $attributes[ $key ] ) ? $attributes[ $key ] : ( ! empty( $context[ $prefix . $key ] ) ? $context[ $prefix . $key ] : $default );
	}

	$layout     = $args['layout'];
	$icon_src   = $args['icon_src'];
	$icon_size  = $args['icon_size'];
	$icon_color = $args['icon_color'];
	$gap_before = $args['icon_gap_before'];
	$gap_after  = $args['icon_gap_after'];

	$class_list[] = $base_class . '--layout-' . $layout;

	$result = '<div class="' . implode( ' ', $class_list ) . '">';

	if ( $icon_src ) {
		$result .= jet_advanced_list_item_icon( array(
			'container'  => $base_class . '__icon-container',
			'icon_src'   => $icon_src,
			'icon_size'  => $icon_size,
			'color'      => $icon_color,
			'gap_before' => $gap_before,
			'gap_after'  => $gap_after,
		) );
	}

	$result .= '<div class="' . $base_class . '__content">';

	if ( ! empty( $attributes['item_label'] ) ) {

		$label_styles_str = '';
		$label_styles     = ! empty( $context['jet-blocks/advanced-list/label_styles'] ) ? $context['jet-blocks/advanced-list/label_styles'] : array();

		if ( ! empty( $label_styles['font_bold'] ) ) {
			$label_styles_str .= 'font-weight:bold;';
		}

		if ( ! empty( $label_styles['font_italic'] ) ) {
			$label_styles_str .= 'font-style:italic;';
		}

		if ( ! empty( $label_styles['color'] ) ) {
			$label_styles_str .= 'color:' . $label_styles['color'] . ';';
		}

		if ( $label_styles_str ) {
			$label_styles_str = sprintf( 'style="%s"', $label_styles_str );
		}

		$result .= '<div class="' . $base_class . '__title" ' . $label_styles_str . '>' . $attributes['item_label'] . '</div>';
	}

	if ( ! empty( $attributes['item_content'] ) ) {

		$content_styles_str = '';
		$content_styles     = ! empty( $context['jet-blocks/advanced-list/content_styles'] ) ? $context['jet-blocks/advanced-list/content_styles'] : array();

		if ( ! empty( $content_styles['font_bold'] ) ) {
			$content_styles_str .= 'font-weight:bold;';
		}

		if ( ! empty( $content_styles['font_italic'] ) ) {
			$content_styles_str .= 'font-style:italic;';
		}

		if ( ! empty( $content_styles['color'] ) ) {
			$content_styles_str .= 'color:' . $content_styles['color'] . ';';
		}

		if ( $content_styles_str ) {
			$content_styles_str = sprintf( 'style="%s"', $content_styles_str );
		}

		$result .= '<div class="' . $base_class . '__data" ' . $content_styles_str . '>' . $attributes['item_content'] . '</div>';
	}

	$result .= '</div>';
	$result .= '</div>';

	return $result;

}
