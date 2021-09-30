import Edit from './edit';
import Save from './save';

const { registerBlockType } = wp.blocks;

registerBlockType( 'jet-blocks/advanced-list', {
	edit: Edit,
	save: Save,
} );
