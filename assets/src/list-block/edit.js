import BlockBody from './block-body';
import IconVertical from './icons/vertical';
import IconHorizontalStart from './icons/horizontal-start';
import IconHorizontalBetween from './icons/horizontal-between';
import IconControl from '../common/icon-control';

const {
	InspectorControls,
	ColorPalette
} = wp.blockEditor;

const { __ } = wp.i18n;

const {
	RangeControl,
	TextControl,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
	DropdownMenu,
	PanelBody
} = wp.components;

const {
	BlockControls,
	useBlockProps
} = wp.blockEditor;

const {
	Fragment
} = wp.element;

const Edit = function( props ) {

	const blockProps = useBlockProps();

	const {
		className,
		attributes,
		setAttributes,
	} = props;

	const layouts = [
		{
			name: 'vertical',
			title: __( 'Vertical' ),
			icon: IconVertical,
			onClick: () => setLayot( 'vertical' ),
			isActive: ( attributes.layout === 'vertical' )
		},
		{
			name: 'horizontal-start',
			title: __( 'Horizontal, Algin Start' ),
			icon: IconHorizontalStart,
			onClick: () => setLayot( 'horizontal-start' ),
			isActive: ( attributes.layout === 'horizontal-start' )
		},
		{
			name: 'horizontal-between',
			title: __( 'Horizontal, Algin Between' ),
			icon: IconHorizontalBetween,
			onClick: () => setLayot( 'horizontal-between' ),
			isActive: ( attributes.layout === 'horizontal-between' )
		},
	];

	const setLayot = function( layout ) {
		setAttributes( {
			layout: layout
		} );
	}

	const getLayoutIcon = function( layout ) {

		for ( var i = 0; i < layouts.length; i++ ) {
			if ( layout === layouts[ i ].name ) {
				return layouts[ i ].icon;
			}
		}

		return null;
	}

	return (
		<Fragment>
			<BlockControls
				key={ className + '-toolbar' }
			>
				<ToolbarGroup>
					<DropdownMenu
						icon={ getLayoutIcon( attributes.layout ) }
						label={ __( 'Items alignment' ) }
						controls={ layouts }
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls
				key={ className + '-inspector' }
			>
				<PanelBody
					title={ __( 'General', 'jet-advanced-list-block' ) }
				>
					<RangeControl
						label={ __( 'Columns', 'jet-advanced-list-block' ) }
						help={ __( 'Break list into selected columns number', 'jet-advanced-list-block' ) }
						min="1"
						max="10"
						value={ attributes.columns }
						onChange={ ( value ) => {
							props.setAttributes( {
								columns: value
							} )
						} }
					/>
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
					/>
				</PanelBody>
			</InspectorControls>
			<BlockBody
				attributes={ attributes }
				blockProps={ blockProps }
				isEdit={ true }
				className={ className }
			/>
		</Fragment>
	);
}

export default Edit;
