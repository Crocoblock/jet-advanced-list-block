import BlockBody from './block-body';
import IconVertical from './icons/vertical';
import IconHorizontalStart from './icons/horizontal-start';
import IconHorizontalBetween from './icons/horizontal-between';
import IconEditorBold from './icons/editor-bold';
import IconEditorItalic from './icons/editor-italic';
import IconControl from '../common/icon-control';

const { __ } = wp.i18n;

const {
	RangeControl,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
	DropdownMenu,
	PanelBody
} = wp.components;

const {
	BlockControls,
	useBlockProps,
	InspectorControls,
	ColorPalette
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
					{ ( 1 < attributes.columns ) && <RangeControl
						label={ __( 'Columns Gap', 'jet-advanced-list-block' ) }
						help={ __( 'Space between list columns. Please note, due to editor HTML markup this options will be applied only on front-end.', 'jet-advanced-list-block' ) }
						min="0"
						max="40"
						value={ attributes.column_gap }
						onChange={ ( value ) => {
							props.setAttributes( {
								column_gap: value
							} )
						} }
					/> }
					<RangeControl
						label={ __( 'Rows Gap', 'jet-advanced-list-block' ) }
						help={ __( 'Space between list rows. Please note, due to editor HTML markup this options will be applied only on front-end.', 'jet-advanced-list-block' ) }
						min="0"
						max="40"
						value={ attributes.row_gap }
						onChange={ ( value ) => {
							props.setAttributes( {
								row_gap: value
							} )
						} }
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Icon', 'jet-advanced-list-block' ) }
					initialOpen={ false }
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
				<PanelBody
					title={ __( 'Styles', 'jet-advanced-list-block' ) }
				>
					<p>
						<strong>{ __( 'Item title', 'jet-advanced-list-block' ) }</strong>
					</p>
					<ToolbarGroup>
						<ToolbarButton
							icon={ IconEditorBold }
							title="Bold"
							isActive={ attributes.label_styles.font_bold }
							onClick={ () => {

								let isBold = attributes.label_styles.font_bold;

								if ( isBold ) {
									isBold = false;
								} else {
									isBold = true;
								}

								props.setAttributes( {
									label_styles: _.assign( {}, attributes.label_styles, { font_bold: isBold } )
								} );

							} }
						/>
						<ToolbarButton
							icon={ IconEditorItalic }
							title="Italic"
							isActive={ attributes.label_styles.font_italic }
							onClick={ () => {

								let isItalic = attributes.label_styles.font_italic;

								if ( isItalic ) {
									isItalic = false;
								} else {
									isItalic = true;
								}

								props.setAttributes( {
									label_styles: _.assign( {}, attributes.label_styles, { font_italic: isItalic } )
								} );

							} }
						/>
					</ToolbarGroup>
					<ColorPalette
						value={ attributes.label_styles.color }
						onChange={ ( value ) => {
							props.setAttributes( {
								label_styles: _.assign( {}, attributes.label_styles, { color: value } )
							} );
						} }
					/>
					<p>
						<strong>{ __( 'Item content', 'jet-advanced-list-block' ) }</strong>
					</p>
					<ToolbarGroup>
						<ToolbarButton
							icon={ IconEditorBold }
							title="Bold"
							isActive={ attributes.content_styles.font_bold }
							onClick={ () => {

								let isBold = attributes.content_styles.font_bold;

								if ( isBold ) {
									isBold = false;
								} else {
									isBold = true;
								}

								props.setAttributes( {
									content_styles: _.assign( {}, attributes.content_styles, { font_bold: isBold } )
								} );

							} }
						/>
						<ToolbarButton
							icon={ IconEditorItalic }
							title="Italic"
							isActive={ attributes.content_styles.font_italic }
							onClick={ () => {

								let isItalic = attributes.content_styles.font_italic;

								if ( isItalic ) {
									isItalic = false;
								} else {
									isItalic = true;
								}

								props.setAttributes( {
									content_styles: _.assign( {}, attributes.content_styles, { font_italic: isItalic } )
								} );

							} }
						/>
					</ToolbarGroup>
					<ColorPalette
						value={ attributes.content_styles.color }
						onChange={ ( value ) => {
							props.setAttributes( {
								content_styles: _.assign( {}, attributes.content_styles, { color: value } )
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
