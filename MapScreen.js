import React, { Component } from "react"
import { Platform, Animated, StyleSheet, Text, View, Image, Button, TouchableOpacity, Dimensions, Icon } from 'react-native';
import { MapView, Constants, Components, Location, Permissions } from 'expo';
import CustomMapStyles from "./CustomMapStyles"


export default class MapScreen extends Component {
    constructor() {
        super()
        this.state = {
            location: null
        }
    }

    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        let location = await Location.getCurrentPositionAsync({});
        console.log(location)
        this.setState({ location });
    };

    render() {
        return this.state.location && (
            <React.Fragment>
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: this.state.location.coords.latitude || 100, longitude: this.state.location.coords.longitude || 100,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    provider={MapView.PROVIDER_GOOGLE}
                    customMapStyle={CustomMapStyles.silverSupreme}
                />
                <View style={{ flex: 1, position: "absolute", top: 10, flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "center" }}>
                    <TouchableOpacity style={{ position: "absolute", left: 20, top: 15, justifyContent: "flex-start", width: 40, height: 40 }} onPress={() => this.props.navigation.openDrawer()}><Image style={{ width: 30, height: 30 }} source={require("./assets/hamburger.png")}></Image></TouchableOpacity>
                    <Image style={{ height: 50 }} source={require('./assets/rollologo.png')} />
                </View>
                <View style={{ flex: 1, position: "absolute", bottom: 50, flexDirection: "row", width: Dimensions.get("window").width, justifyContent: "center", alignItems: "center", height: 100 }}>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,0.2)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 100,
                            height: 100,
                            backgroundColor: 'black',
                            borderRadius: 100,
                        }}
                    >
                        <Text style={{ color: "white" }}>Ride</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ position: "absolute", right: 10, bottom: 10 }}>
                    <Image style={{ width: 40, height: 40 }} source={require("./assets/currentLocation.png")} />
                </TouchableOpacity>

            </React.Fragment>
        );
    }
}