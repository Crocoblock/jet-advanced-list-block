const { registerBlockType } = wp.blocks;

import Edit from './edit';
import Save from './save';

registerBlockType( 'jet-blocks/advanced-list-item', {
	edit: Edit,
} );
