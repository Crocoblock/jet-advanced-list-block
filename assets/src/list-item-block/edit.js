import BlockBody from './block-body';
import IconControl from '../common/icon-control';

const {
	InspectorControls,
	ColorPalette
} = wp.blockEditor;

const { __ } = wp.i18n;

const {
	RangeControl,
	TextControl,
	ToolbarGroup,
	PanelBody
} = wp.components;

const {
	RichText,
	BlockControls
} = wp.blockEditor;

const {
	Fragment
} = wp.element;

const Edit = function( props ) {

	const {
		className,
		attributes,
		setAttributes,
		context
	} = props;

	const scale = attributes.scale || 5;

	return (
		<Fragment>
			<InspectorControls
				key={ className + '-inspector' }
			>
				<PanelBody
					title={ __( 'General', 'jet-advanced-list-block' ) }
				>
				</PanelBody>
				<PanelBody
					title={ __( 'Icon', 'jet-advanced-list-block' ) }
				>
					<IconControl
						attributes={ attributes }
						onChange={ ( attr, value ) => {
							setAttributes( {
								[ attr ]: value
							} );
						} }
						hideControls={ [ 'size', 'gap_before', 'gap_after' ] }
					/>
				</PanelBody>
			</InspectorControls>
			<BlockBody
				attributes={ attributes }
				isEdit={ true }
				className={ className }
				setAttributes={ setAttributes }
				context={ context }
			/>
		</Fragment>
	);
}

export default Edit;
