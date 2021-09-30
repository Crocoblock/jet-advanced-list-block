import IconBlock from './icon-block';
const { __ } = wp.i18n;

const {
	Button,
	ButtonGroup,
	TextareaControl,
	Notice,
	Icon,
	RangeControl
} = wp.components;

const { 
	MediaUpload, 
	MediaUploadCheck,
	ColorPalette
} = wp.blockEditor;

const {
	Fragment,
	useState
} = wp.element;

const IconControl = function( props ) {

	const supportSVG = window.JetAdvancedListData.supportSVG;
	const {
		attributes,
		hideControls,
		onChange
	} = props;

	const iconType = attributes.icon_type || 'raw';
	const showRawInput = ( 'raw' === iconType || ! supportSVG );

	const ALLOWED_MEDIA_TYPES = [ 'image/svg+xml' ];

	const [ error, setError ] = useState( '' );

	const isHidden = function( control ) {
		
		if ( ! hideControls || ! hideControls.length ) {
			return false;
		}

		return hideControls.includes( control );
	}

	return <Fragment>
		{ supportSVG && <ButtonGroup>
			<Button
				isSmall={ true }
				isPrimary={ ( 'raw' === iconType ) }
				isSecondary={ ( 'raw' !== iconType ) }
				onClick={ () => {
					onChange( 'icon_type', 'raw' )
				} }
			>{ __( 'Raw icon' ) }</Button>
			<Button
				isSmall={ true }
				isPrimary={ ( 'media' === iconType ) }
				isSecondary={ ( 'media' !== iconType ) }
				onClick={ () => {
					onChange( 'icon_type', 'media' )
				} }
			>{ __( 'From media library' ) }</Button>
		</ButtonGroup> }
		{ showRawInput && <TextareaControl
			label={ __( 'SVG Icon', 'jet-advanced-list-block' ) }
			help={ __( 'Paste raw SVG icon code', 'jet-advanced-list-block' ) }
			value={ attributes.icon_src }
			onChange={ ( value ) => {
				onChange( 'icon_src', value );
			} }
		/> }
		{ ! showRawInput && <MediaUploadCheck>
			<MediaUpload
				onSelect={ ( media ) => {

					const requestURL = window.ajaxurl + '?action=jet_advanced_list_block_get_svg&media_id=' + media.id;
					
					wp.apiFetch( {
						method: 'get',
						url: requestURL,
					} ).then( ( response ) => {
						if ( response.success ) {
							onChange( 'icon_src', response.data );
							onChange( 'icon_id', media.id );
							setError( '' );
						} else {
							setError( response.data );
						}
					} );
				} }
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				value={ attributes.icon_id }
				render={ ( { open } ) => (
					<div>
						<br/>
						<div style={ {
							display: 'flex',
							justifyContent: 'space-between',
						} }>
							<Button 
								onClick={ open }
								isSecondary={ true }
							>{ __( 'Select or upload icon' ) }</Button>
							{ attributes.icon_src && attributes.icon_id && <Button 
								onClick={ () => {
									onChange( 'icon_src', '' );
									onChange( 'icon_id', false );
								} }
								isDestructive={ true }
							>{ __( 'Reset' ) }</Button> }
						</div>
						{ error && <div
							className="components-notice is-error"
							style={ {
								margin: '10px 0 0 0'
							} }
						>
							<div className="components-notice__content">{ error }</div>
						</div> }
						<br/>
					</div>
				) }
			/>
		</MediaUploadCheck> }
		<IconBlock
			iconSrc={ attributes.icon_src }
			iconSize={ attributes.icon_size }
			iconContainer={ 'jet-advanced-list--icon-preview' }
			iconStyles={ {
				color: attributes.icon_color,
			} }
		/>
		{ ! isHidden( 'size' ) && <RangeControl
			label={ __( 'Size', 'jet-advanced-list-block' ) }
			help={ __( 'Set icon size in pixels', 'jet-advanced-list-block' ) }
			min="8"
			max="120"
			value={ attributes.icon_size }
			onChange={ ( value ) => {
				onChange( 'icon_size', value );
			} }
		/> }
		<p>
			<strong>{ __( 'Icon Color', 'jet-star-rating-block' ) }</strong>
		</p>
		<ColorPalette
			value={ attributes.icon_color }
			onChange={ ( value ) => {
				onChange( 'icon_color', value );
			} }
		/>
		{ ! isHidden( 'gap_before' ) && <RangeControl
			label={ __( 'Top Gap', 'jet-advanced-list-block' ) }
			help={ __( 'Gap above the icon', 'jet-advanced-list-block' ) }
			min="0"
			max="30"
			value={ attributes.icon_gap_before }
			onChange={ ( value ) => {
				onChange( 'icon_gap_before', value );
			} }
		/> }
		{ ! isHidden( 'gap_after' ) && <RangeControl
			label={ __( 'Right Gap', 'jet-advanced-list-block' ) }
			help={ __( 'Horizontal gap after the icon', 'jet-advanced-list-block' ) }
			min="0"
			max="30"
			value={ attributes.icon_gap_after }
			onChange={ ( value ) => {
				onChange( 'icon_gap_after', value );
			} }
		/> }
	</Fragment>
}

export default IconControl;
