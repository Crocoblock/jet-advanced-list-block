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

	blockProps.className = classList.join( ' ' );
	blockProps.style = {
		rowGap: attributes.row_gap,
		columnGap: attributes.column_gap
	}

	return <div { ...blockProps }>
			{ isEdit && <InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				template={ TEMPLATE }
			/> }
			{ ! isEdit && <InnerBlocks.Content /> }
	</div>
}

export default BlockBody;
