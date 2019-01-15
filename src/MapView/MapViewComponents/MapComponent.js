import React, { Component } from "react"
import { Platform } from 'react-native';
import { MapView, Constants, Location, Permissions } from 'expo';
import styles from "../../styles"
import { CustomMaps } from "../../index"

export default class MapComponent extends Component {
    constructor() {
        super()
        this.state = {
            location: null,
        }
    }
    componentDidMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this.props.getLocation();
        }
    }

    render() {
        return this.props.location && (
            <MapView
                style={styles.mapView}
                initialRegion={{
                    latitude: this.props.location.coords.latitude || 100, longitude: this.props.location.coords.longitude || 100,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onRegionChangeComplete={this.props.onRegionChange}
                provider={MapView.PROVIDER_GOOGLE}
                customMapStyle={CustomMaps.silverSupreme}
                showsUserLocation={true}
                showsMyLocationButton={true}
                rotateEnabled={false}
                ref={map => this.map = map}
            />
        );
    }
}

