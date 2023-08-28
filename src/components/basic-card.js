import { TrendingUpSharp } from '@mui/icons-material';
import React from 'react';
import './basic-card.css';

/*
	Renders a simple card element.
	
	Properties:
		rawContent (DOM node): Explicitly define the content of the box by passing the
			content to fill it out.  Top level element should have the class "basic-card-content".
			Defaults to null.
		destination (Boolean): Whether or not the card has a destination requiring a hover state.
			Defaults to false.
		size (Number): A number 1-4 describing how many columns the card should span.  The cards
			at the moment are based on a maximum of 4 columns, but additional styles in the CSS
			can expand this as necessary.
			Defaults to 1.
		imageSrc (string): The URL of an image to be placed at the top of the card.
			Defaults to ''.
		title (string): A title for the card which gets rendered as a header element.
			Defaults to ''.
		blurb (string): A short description to be loaded into the card.
			Defaults to ''.
*/

class BasicCard extends React.Component {
  
	render() {
    let content = this.props.rawContent;
		if(!content) {
			content = 
			<a href={this.props.location}>
				<div className='basic-card-content'>
					<h4>{ this.props.title }</h4>
					<p>{ this.props.blurb }</p>
					<div className="basic-card-image-wrapper">
						<img src={this.props.imageSrc} />
					</div>
					
				</div>
				</a>
			;
		}
		let destination = this.props.destination;
		if(destination !== false) {
			destination = true;
		}
		return (
			<div className="basic-card" data-size={this.props.size} data-destination={destination}>
				{ content }
			</div>
		)
	};

}

export default BasicCard;