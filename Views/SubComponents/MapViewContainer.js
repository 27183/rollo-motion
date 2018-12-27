import React, { Component } from "react"
import { Platform } from 'react-native';
import { MapView, Constants, Location, Permissions } from 'expo';
import { CustomMaps, styles } from "../index"

export default class MapViewContainer extends Component {
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
            <MapView
                style={styles.mapView}
                initialRegion={{
                    latitude: this.state.location.coords.latitude || 100, longitude: this.state.location.coords.longitude || 100,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                provider={MapView.PROVIDER_GOOGLE}
                customMapStyle={CustomMaps.silverSupreme}
                showsUserLocation={true}
                showsMyLocationButton={true}
                rotateEnabled={false}
            />
        );
    }
}