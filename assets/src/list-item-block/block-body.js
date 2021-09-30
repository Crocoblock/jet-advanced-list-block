import IconBlock from '../common/icon-block';

const {
	RichText
} = wp.blockEditor;

const { __ } = wp.i18n;

const {
	Fragment
} = wp.element;

const BlockBody = function( props ) {

	const {
		className,
		isEdit,
		attributes,
		setAttributes,
		context
	} = props;

	const getBlockIconAttr = function( attr, defaultVal ) {

		let result      = attributes[ attr ] || false;
		let baseContext = 'jet-blocks/advanced-list/';

		if ( ! result ) {
			result = ( context && context[ baseContext + attr ] ) ? context[ baseContext + attr ] : defaultVal;
		}

		return result;

	}

	const baseClass = 'jet-advanced-list-item-block';
	const classList = [ className, baseClass ];
	const layout    = ( context && context['jet-blocks/advanced-list/layout'] ) ? context['jet-blocks/advanced-list/layout'] : 'horizontal-start';

	const icon_src = getBlockIconAttr( 'icon_src', '' );
	const icon_size = getBlockIconAttr( 'icon_size', 24 );
	const icon_color = getBlockIconAttr( 'icon_color', null );
	const gap_before = getBlockIconAttr( 'icon_gap_before', null );
	const gap_after = getBlockIconAttr( 'icon_gap_after', null );

	classList.push( baseClass + '--layout-' + layout );

	return <div className={ classList.join( ' ' ) }>
		{ icon_src && <IconBlock
			iconSrc={ icon_src }
			iconSize={ icon_size }
			iconContainer={ baseClass + '__icon-container' }
			iconStyles={ {
				color: icon_color,
				paddingTop: gap_before,
				paddingRight: gap_after,
			} }
		/> }
		<div className={ baseClass + '__content' }>
			{ isEdit && <Fragment>
				<RichText
					tagName="div"
					className={ baseClass + '__title' }
					placeholder={ __( 'List item label', 'jet-advanced-list-block' ) }
					onChange={ ( value ) => {
						setAttributes( {
							item_label: value
						} );
					} }
					value={ attributes.item_label }
				/>
				<RichText
					tagName="div"
					className={ baseClass + '__data' }
					placeholder={ __( 'List item content', 'jet-advanced-list-block' ) }
					onChange={ ( value ) => {
						setAttributes( {
							item_content: value
						} );
					} }
					value={ attributes.item_content }
				/>
			</Fragment> }
			{ ! isEdit && <Fragment>
				<RichText.Content
					tagName="div"
					className={ baseClass + '__title' }
					value={ attributes.item_label }
				/>
				<RichText.Content
					tagName="div"
					className={ baseClass + '__data' }
					value={ attributes.item_content }
				/>
			</Fragment> }
		</div>
	</div>
}

export default BlockBody;
