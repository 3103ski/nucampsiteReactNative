import React, { Component } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { Card } from 'react-native-elements';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

import Loading from './LoadingComponent';

const mapStateToProps = (state) => {
	return {
		campsites: state.campsites,
		partners: state.partners,
		promotions: state.promotions,
	};
};

function RenderItem(props) {
	const { item } = props;
	if (props.isLoading) {
		return <Loading />;
	}
	if (props.errMess) {
		return (
			<View>
				<Text>{props.errMess}</Text>
			</View>
		);
	}
	if (item) {
		return (
			<Card featuredTitle={item.name} image={{ uri: baseUrl + item.image }}>
				<Text style={{ margin: 10 }}>{item.description}</Text>
			</Card>
		);
	}
	return <View />;
}

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			scaleValue: new Animated.Value(0),
		};
	}
	static navigationOptions = {
		title: 'Home',
	};
	animate() {
		Animated.timing(this.state.scaleValue, {
			toValue: 1,
			duration: 1500,
			useNativeDriver: true,
		}).start();
	}
	componentDidMount() {
		this.animate();
	}
	render() {
		return (
			<Animated.ScrollView style={{ transform: [{ scale: this.state.scaleValue }] }}>
				<RenderItem isLoading={this.props.campsites.isLoading} errMess={this.props.campsites.errMess} item={this.props.campsites.campsites.filter((campsite) => campsite.featured)[0]} />
				<RenderItem isLoading={this.props.promotions.isLoading} errMess={this.props.promotions.errMess} item={this.props.promotions.promotions.filter((campsite) => campsite.featured)[0]} />
				<RenderItem isLoading={this.props.partners.isLoading} errMess={this.props.partners.errMess} item={this.props.partners.partners.filter((campsite) => campsite.featured)[0]} />
			</Animated.ScrollView>
		);
	}
}

export default connect(mapStateToProps)(Home);
