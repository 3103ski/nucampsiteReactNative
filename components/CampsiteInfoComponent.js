// React
import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Button, Modal, StyleSheet, Alert, PanResponder, Share } from 'react-native';

// Third Party
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

// Constants
import { baseUrl } from '../shared/baseUrl';

// Action imports
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = (state) => {
	return {
		campsites: state.campsites,
		comments: state.comments,
		favorites: state.favorites,
	};
};

const mapDispatchToProps = {
	postFavorite: (campsiteId) => postFavorite(campsiteId),
	postComment: (campsiteId, rating, author, text) => postComment(campsiteId, rating, author, text),
};

function RenderCampsite(props) {
	const { campsite } = props;

	const view = React.createRef();

	const recognizeDrag = ({ dx }) => (dx < -100 ? true : false);
	const recognizeComment = ({ dx }) => (dx > 100 ? true : false);

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onPanResponderGrant: () => {
			view.current.rubberBand(1000).then((endState) => console.log(endState.finished ? 'finished' : 'canceled'));
		},
		onPanResponderEnd: (e, gestureState) => {
			console.log(gestureState);
			if (recognizeDrag(gestureState)) {
				Alert.alert(
					'Add Favorite',
					'Are you sure you wish to add',
					[
						{
							text: 'Cancel',
							style: 'cancel',
							onPress: () => console.log('Cancel Pressed'),
						},
						{
							text: 'OK',
							onPress: () => (props.favorite ? console.log('Is already favorite') : props.markFavorite()),
						},
					],
					{ cancelable: false }
				);
			}
			if (recognizeComment(gestureState)) {
				props.onShowModal();
			}
			return true;
		},
	});

	const shareCampsite = (title, message, url) => {
		Share.share(
			{
				title,
				message: `${title}: ${message} ${url}`,
				url,
			},
			{
				dialogTitle: 'Share ' + title,
			}
		);
	};

	if (campsite) {
		return (
			<Animatable.View ref={view} animation='fadeInDown' duration={2000} delay={1000} {...panResponder.panHandlers}>
				<Card featureTitle={campsite.name} image={{ uri: baseUrl + campsite.image }}>
					<Text style={{ margin: 10 }}>{campsite.description}</Text>
					<View style={styles.cardRow}>
						<Icon
							name={props.favorite ? 'heart' : 'heart-o'}
							type='font-awesome'
							color='#f50'
							onPress={() => (props.favorite ? console.log('already liked') : props.markFavorite(campsite.id))}
							raised
							reverse
						/>
						<Icon name='pencil' type='font-awesome' color='#5637DD' onPress={() => props.onShowModal()} raised reverse />
						<Icon name='share' type='font-awesome' color='#5637DD' onPress={() => shareCampsite(campsite.name, campsite.description, baseUrl + campsite.image)} raised reverse />
					</View>
				</Card>
			</Animatable.View>
		);
	}
	return <View />;
}

function RenderComments({ comments }) {
	const renderCommentItem = ({ item }) => {
		return (
			<View style={{ margin: 10 }}>
				<Text style={{ fontSize: 14 }}>{item.text}</Text>
				<Rating startingValue={item.rating} imageSize={10} readOnly style={{ paddingVertical: '5%', alignItems: 'flex-start' }} />
				<Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
			</View>
		);
	};

	return (
		<Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
			<Card title='Comments'>
				<FlatList data={comments} renderItem={renderCommentItem} keyExtractor={(item) => item.id.toString()} />
			</Card>
		</Animatable.View>
	);
}

class CampsiteInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			rating: 5,
			author: '',
			text: '',
		};
	}

	markFavorite(campsiteId) {
		console.log('adding favorite', campsiteId);
		this.props.postFavorite(campsiteId);
	}

	toggleModal() {
		this.setState({ showModal: !this.state.showModal });
	}

	handleComment(campsiteId) {
		this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text);
		this.toggleModal();
	}

	resetForm() {
		this.setState({
			showModal: false,
			rating: 5,
			author: '',
			text: '',
		});
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
				<RenderCampsite onShowModal={() => this.toggleModal()} favorite={this.props.favorites.includes(campsiteId)} markFavorite={() => this.markFavorite(campsiteId)} campsite={campsite} />
				<RenderComments comments={comments} />
				<Modal animationType={'slide'} transparent={false} visible={this.state.showModal} onRequestClose={() => this.toggleModal()}>
					<View style={styles.modal}>
						<Rating startingValue={this.state.rating} showRating imageSize={40} onFinishRating={(rating) => this.setState({ rating: rating })} style={{ paddingVertical: 10 }} />
						<Input
							placeholder='Author'
							leftIcon={{ name: 'user-o', type: 'font-awesome' }}
							leftIconContainerStyle={{ paddingRight: 10 }}
							value={this.state.author}
							onChangeText={(val) => this.setState({ author: val })}
						/>
						<Input
							placeholder='Comment'
							leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
							leftIconContainerStyle={{ paddingRight: 10 }}
							value={this.state.text}
							onChangeText={(val) => this.setState({ text: val })}
						/>
						<View style={{ margin: 15 }}>
							<Button
								title='submit'
								color='#5637DD'
								onPress={() => {
									this.handleComment(campsiteId);
									this.resetForm();
								}}
							/>
						</View>
						<View style={{ margin: 15 }}>
							<Button
								title='Cancel'
								onPress={() => {
									this.resetForm();
									this.toggleModal();
								}}
								color='#808080'
							/>
						</View>
					</View>
				</Modal>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	modal: {
		justifyContent: 'center',
		margin: 20,
	},
	cardRow: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		flexDirection: 'row',
		margin: 20,
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
