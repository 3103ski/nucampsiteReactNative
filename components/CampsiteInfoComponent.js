// React
import React, { Component } from 'react';
// Native
import { Card, Icon } from 'react-native-elements';
import { Text, View, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = (state) => {
	return {
		campsites: state.campsites,
		comments: state.comments,
	};
};

function RenderCampsite(props) {
	const { campsite } = props;
	if (campsite) {
		return (
			<Card featureTitle={campsite.name} image={{ uri: baseUrl + campsite.image }}>
				<Text style={{ margin: 10 }}>{campsite.description}</Text>
				<Icon
					name={props.favorite ? 'heart' : 'heart-o'}
					type='font-awesome'
					color='#f50'
					onPress={() => (props.favorite ? console.log('already liked') : props.markFavorite())}
					raised
					reverse
				/>
			</Card>
		);
	}
	return <View />;
}

function RenderComments({ comments }) {
	const renderCommentItem = ({ item }) => {
		return (
			<View style={{ margin: 10 }}>
				<Text style={{ fontSize: 14 }}>{item.text}</Text>
				<Text style={{ fontSize: 12 }}>{item.rating} stars</Text>
				<Text style={{ fontSize: 12 }}>{`-- ${item.autho}, ${item.date}`}</Text>
			</View>
		);
	};

	return (
		<Card title='Comments'>
			<FlatList data={comments} renderItem={renderCommentItem} keyExtractor={(item) => item.id.toString()} />
		</Card>
	);
}

class CampsiteInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			favorite: false,
		};
	}

	markFavorite() {
		this.setState({ favorite: true });
	}

	static navigationOptions = {
		title: 'Campsite Information',
	};

	render() {
		const campsiteId = this.props.navigation.getParam('campsiteId');
		const campsite = this.props.campsites.campsites.filter((campsite) => campsite.id === campsiteId)[0];
		const comments = this.props.comments.comments.filter((campsite) => campsite.campsiteId === campsiteId);
		return (
			<ScrollView>
				<RenderCampsite favorite={this.state.favorite} markFavorite={() => this.markFavorite()} campsite={campsite} />
				<RenderComments comments={comments} />
			</ScrollView>
		);
	}
}

export default connect(mapStateToProps)(CampsiteInfo);
