import React, { Component } from 'react';
import { CAMPSITES } from '../shared/campsites';
import { Card } from 'react-native-elements';
import { Text, View } from 'react-native';

function RenderCampsite({ campsite }) {
	if (campsite) {
		return (
			<Card featureTitle={campsite.name} image={require('../images/react-lake.jpg')}>
				<Text style={{ margin: 10 }}>{campsite.description}</Text>
			</Card>
		);
	}
	return <View />;
}

class CampsiteInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			campsites: CAMPSITES,
		};
	}

	static navigationOptions = {
		title: 'Campsite Information',
	};

	render() {
		const campsiteId = this.props.navigation.getParam('campsiteId');
		const campsite = this.state.campsites.filter((campsite) => campsite.id === campsiteId)[0];
		return <RenderCampsite campsite={campsite} />;
	}
}

export default CampsiteInfo;
