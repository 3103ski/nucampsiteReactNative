// React
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';

// Third Party
import { Input, CheckBox, Button, Icon } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { baseUrl } from '../shared/baseUrl';

class LoginTab extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			remember: false,
		};
	}

	static navigationOptions = {
		title: 'Login',
		tabBarIcon: ({ tintColor }) => (
			<Icon
				name='sign-in'
				type='font-awesome'
				iconStyle={{ color: tintColor }}
			/>
		),
	};

	handleLogin() {
		console.log(JSON.stringify(this.state));
		if (this.state.remember) {
			SecureStore.setItemAsync(
				'userinfo',
				JSON.stringify({
					username: this.state.username,
					password: this.state.password,
				})
			).catch((error) => console.log('Could not save user info', error));
		} else {
			SecureStore.deleteItemAsync('userinfo').catch((error) =>
				console.log('Could not delete user info', error)
			);
		}
	}

	componentDidMount() {
		SecureStore.getItemAsync('userinfo').then((userdata) => {
			const userinfo = JSON.parse(userdata);
			if (userinfo) {
				this.setState({
					username: userinfo.username,
					password: userinfo.password,
					remember: true,
				});
			}
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Input
					placeholder='Username'
					leftIcon={{ type: 'font-awesome', name: 'user-o' }}
					onChangeText={(username) => this.setState({ username })}
					value={this.state.username}
					containerStyle={StyleSheet.formInput}
					leftIconContainerStyle={StyleSheet.formIcon}
				/>
				<Input
					placeholder='Password'
					leftIcon={{ type: 'font-awesome', name: 'key' }}
					onChangeText={(password) => this.setState({ password })}
					value={this.state.password}
					containerStyle={StyleSheet.formInput}
					leftIconContainerStyle={StyleSheet.formIcon}
				/>
				<CheckBox
					title='Remember Me'
					center
					checked={this.state.remember}
					onPress={() =>
						this.setState({ remember: !this.state.remember })
					}
					containerStyle={styles.formCheckbox}
				/>
				<View style={styles.formButton}>
					<Button
						onPress={() => this.handleLogin()}
						title='Login'
						icon={
							<Icon
								name='sign-in'
								type='font-awesome'
								color='#fff'
								iconStyle={{ marginRight: 10 }}
							/>
						}
						color='#5637dd'
						buttonStyle={{ backgroundColor: '#5637dd' }}
					/>
				</View>
				<View style={styles.formButton}>
					<Button
						onPress={() =>
							this.props.navigation.navigate('Register')
						}
						title='Register'
						type='clear'
						icon={
							<Icon
								name='user-plus'
								type='font-awesome'
								color='blue'
								iconStyle={{ marginRight: 10 }}
							/>
						}
						color='#5637dd'
						titleStyle={{ color: 'blue' }}
					/>
				</View>
			</View>
		);
	}
}

class RegisterTab extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			firstname: '',
			lastname: '',
			email: '',
			remember: false,
			imgUrl: baseUrl + 'images/logo.png',
		};
	}

	static navigationOptions = {
		title: 'Register',
		tabBarIcon: ({ tintColor }) => (
			<Icon
				name='user-plus'
				type='font-awesome'
				iconStyle={{ color: tintColor }}
			/>
		),
	};

	getImageFromCamera = async () => {
		const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
		const cameraRollPermission = await Permissions.askAsync(
			Permissions.CAMERA_ROLL
		);

		if (
			cameraPermission.status === 'granted' &&
			cameraRollPermission.status === 'granted'
		) {
			const capturedImage = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [1, 1],
			});

			if (!capturedImage.cancelled) {
				console.log(capturedImage);
				this.setState({ imgUrl: capturedImage.uri });
			}
		}
	};

	handleRegister() {
		// console.log(JSON.stringify(this.state));
		if (this.state.remember) {
			SecureStore.setItemAsync(
				'userinfo',
				JSON.stringify({
					username: this.state.username,
					password: this.state.password,
				})
			).catch((error) => console.log('Could not save user info', error));
		} else {
			SecureStore.deleteItemAsync('userinfo').catch((error) =>
				console.log('Could not delete user info', error)
			);
		}
	}

	render() {
		return (
			<ScrollView>
				<View style={styles.container}>
					<View style={styles.imageContainer}>
						<Image
							source={{ uri: this.state.imgUrl }}
							loadingIndicatorSource={require('../images/logo.png')}
							style={styles.image}
						/>
						<Button
							title='Camera'
							onPress={this.getImageFromCamera}
						/>
					</View>
					<Input
						placeholder='Username'
						leftIcon={{ type: 'font-awesome', name: 'user-o' }}
						onChangeText={(username) => this.setState({ username })}
						value={this.state.username}
						containerStyle={StyleSheet.formInput}
						leftIconContainerStyle={StyleSheet.formIcon}
					/>
					<Input
						placeholder='Password'
						leftIcon={{ type: 'font-awesome', name: 'key' }}
						onChangeText={(password) => this.setState({ password })}
						value={this.state.password}
						containerStyle={StyleSheet.formInput}
						leftIconContainerStyle={StyleSheet.formIcon}
					/>
					<Input
						placeholder='First Name'
						leftIcon={{ type: 'font-awesome', name: 'key' }}
						onChangeText={(firstname) =>
							this.setState({ firstname })
						}
						value={this.state.firstname}
						containerStyle={StyleSheet.formInput}
						leftIconContainerStyle={StyleSheet.formIcon}
					/>
					<Input
						placeholder='Last Name'
						leftIcon={{ type: 'font-awesome', name: 'key' }}
						onChangeText={(lastname) => this.setState({ lastname })}
						value={this.state.lastname}
						containerStyle={StyleSheet.formInput}
						leftIconContainerStyle={StyleSheet.formIcon}
					/>
					<Input
						placeholder='Email'
						leftIcon={{ type: 'font-awesome', name: 'key' }}
						onChangeText={(email) => this.setState({ email })}
						value={this.state.email}
						containerStyle={StyleSheet.formInput}
						leftIconContainerStyle={StyleSheet.formIcon}
					/>
					<CheckBox
						title='Remember Me'
						center
						checked={this.state.remember}
						onPress={() =>
							this.setState({ remember: !this.state.remember })
						}
						containerStyle={styles.formCheckbox}
					/>
					<View style={styles.formButton}>
						<Button
							onPress={() => this.handleRegister()}
							title='Register'
							icon={
								<Icon
									name='user-plus'
									type='font-awesome'
									color='#fff'
									iconStyle={{ marginRight: 10 }}
								/>
							}
							color='#5637dd'
							buttonStyle={{ backgroundColor: '#5637dd' }}
						/>
					</View>
				</View>
			</ScrollView>
		);
	}
}

const Login = createBottomTabNavigator(
	{
		Login: LoginTab,
		Register: RegisterTab,
	},
	{
		tabBarOptions: {
			activeBackgroundColor: '#5637dd',
			inactiveBackgroundColor: '#CEC8FF',
			activeTintColor: '#fff',
			inactiveTintColor: '#808080',
			labelStyle: { fontSize: 16 },
		},
	}
);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		margin: 10,
	},
	formIcon: {
		marginRight: 10,
	},
	formInput: {
		padding: 8,
	},
	formCheckbox: {
		margin: 8,
		backgroundColor: null,
	},
	formButton: {
		marginHorizontal: 40,
		marginVertical: 20,
	},
	imageContainer: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		margin: 10,
	},
	image: {
		width: 60,
		height: 60,
	},
});

export default Login;
