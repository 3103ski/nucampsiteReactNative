// React
import React, { Component } from 'react';
import { FlatList, Text, View } from 'react-native';

// Third Party
import { connect } from 'react-redux';
import { Tile } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

// Constants
import { baseUrl } from '../shared/baseUrl';

// Components
import Loading from './LoadingComponent';

const mapStateToProps = (state) => {
	return {
		campsites: state.campsites,
	};
};

class Directory extends Component {
	static navigationOptions = {
		title: 'Directory',
	};

	render() {
		const { navigate } = this.props.navigation;
		const renderDirectoryItem = ({ item }) => {
			return (
				<Animatable.View animation='fadeInRightBig' duration={2000} delay={1000}>
					<Tile onPress={() => navigate('CampsiteInfo', { campsiteId: item.id })} title={item.name} camption={item.description} featured imageSrc={{ uri: baseUrl + item.image }} />
				</Animatable.View>
			);
		};

		if (this.props.campsites.isLoading) {
			return <Loading />;
		}
		if (this.props.campsites.errMess) {
			return (
				<View>
					<Text>{this.props.campsites.errMess}</Text>
				</View>
			);
		}
		return <FlatList data={this.props.campsites.campsites} renderItem={renderDirectoryItem} keyExtractor={(item) => item.id.toString()} />;
	}
}

export default connect(mapStateToProps)(Directory);
