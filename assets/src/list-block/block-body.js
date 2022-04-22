const {
	InnerBlocks
} = wp.blockEditor;

const BlockBody = function( props ) {

	const {
		className,
		blockProps,
		isEdit,
		attributes
	} = props;

	const baseClass = 'jet-advanced-list-block';

	const ALLOWED_BLOCKS = [ 'jet-blocks/advanced-list-item' ];
	const TEMPLATE = [
		[ 'jet-blocks/advanced-list-item', {} ],
	];

	const classList = [ className, baseClass ];

	classList.push( baseClass + '--columns-' + attributes.columns );
	classList.push( attributes.custom_css_class );

	blockProps.className = classList.join( ' ' );
	blockProps.style = {
		rowGap: attributes.row_gap,
	}

	let colWidth = Math.round( 100 / attributes.columns * 10000 ) / 10000;
	let halfGap  = attributes.column_gap * ( attributes.columns - 1 ) / attributes.columns;

	halfGap = Math.round( halfGap * 1000 ) / 1000;

	let colWidthStr = "" + colWidth + "% - " + halfGap + "px";
	let styles      = ".jet-advanced-list-block--columns-" + attributes.columns + "." + attributes.custom_css_class + ">.jet-advanced-list-item-block {-ms-flex: 0 0 calc(" + colWidthStr + ");flex: 0 0 calc(" + colWidthStr + ");max-width: calc(" + colWidthStr + ");}";

	styles += "." + attributes.custom_css_class + " { column-gap:" + attributes.column_gap + "px;}";

	return <div { ...blockProps }>
		<style>{ styles }</style>
		{ isEdit && <InnerBlocks
			allowedBlocks={ ALLOWED_BLOCKS }
			template={ TEMPLATE }
		/> }
		{ ! isEdit && <InnerBlocks.Content /> }
	</div>
}

export default BlockBody;
