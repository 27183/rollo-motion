import React, { Component } from "react"
import { Platform } from 'react-native';
import { MapView, Constants } from 'expo';
const { Marker } = MapView
import styles from "../../styles"
import { CustomMaps } from "../../index"

export default class MapComponent extends Component {
    constructor() {
        super()
        this.state = {
            location: null,
            rollos: null
        }
    }

    async componentDidMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this.props.getLocation();
        }
    }

    render() {
        const { location, rollos } = this.props
        return location && (
            <MapView
                style={styles.mapView}
                initialRegion={{
                    latitude: location.coords.latitude || 100, longitude: location.coords.longitude || 100,
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
            >
                {rollos && rollos.map(rollo => {
                    const { _longitude, _latitude } = rollo.location
                    return (<Marker
                        coordinate={{ longitude: _longitude, latitude: _latitude }}
                        image={require("../../../assets/rolloPin.png")}
                    />
                    )
                })}
            </MapView>
        );
    }
}

