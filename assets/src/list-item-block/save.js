import BlockBody from './block-body';

const Save = ( props ) => {

	const {
		className,
		attributes,
		setAttributes
	} = props;

	return <BlockBody
		attributes={ attributes }
		idEdit={ false }
		className={ className }
		setAttributes={ setAttributes }
	/>;
}

export default Save;
