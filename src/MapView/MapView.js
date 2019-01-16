import React, { Component } from "react"
import { TopBar, MapComponent, RideButtonContainer, AuthenticationPopup } from "./MapViewComponents"
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Dimensions, Easing, View, Image } from 'react-native';
import { auth, functions } from "../../firebase/Fire"
import { Location, Permissions } from 'expo';


export default class MapView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            height: Dimensions.get("window").height / 2,
            authenticated: false,
            user: "",
            location: null,
            region: null,
            confirmingRide: false,
            loading: false,
            rollos: [],
            chosenRolloLocation: ""
        }
    }
    openPanel = () => {
        !this.state.user && this.setState({ visible: true })
    }
    closePanel = () => {
        this.setState({ height: Dimensions.get("window").height / 2, visible: false })
    }
    extendPanel = () => {
        this.setState({ height: Dimensions.get("window").height * 0.85 })
        this._panel.transitionTo({ toValue: Dimensions.get("window").height, duration: 2000, easing: Easing.bounce })
    }
    requestRide = async () => {
        if (this.state.confirmingRide) {
            const { location, user } = this.state
            this.setState({ loading: true })
            const { data } = await functions.httpsCallable("confirmRide")({ userId: user.uid, location: location })
            console.log("returned object", data)
            if (data !== "no available rides!") {
                this.setState({ loading: false, chosenRolloLocation: data.location, rollos: [data] })
                this.map.map.fitToCoordinates([{ latitude: this.state.chosenRolloLocation._latitude, longitude: this.state.chosenRolloLocation._longitude }, this.state.location.coords], { edgePadding: { top: 100, right: 100, bottom: 100, left: 100 }, animated: true })
                return

            }
            console.log("no available rides")
        } else {
            const { latitude, longitude } = this.state.location.coords
            this.map.map.animateToRegion({ latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 500);
            this.setState({ confirmingRide: true })
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
    onRegionChange = region => {
        this.setState({
            region
        })
    }
    cancelRide = () => {
        const { latitude, longitude } = this.state.location.coords
        this.map.map.animateToRegion({
            latitude, longitude, latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }, 500);
        this.setState({ confirmingRide: false })
    }

    async componentDidMount() {
        const { data } = await functions.httpsCallable("requestRollos")({})
        auth.onAuthStateChanged(user => {
            var userExists = user ? true : false
            console.log("here's the user", user)
            console.log("here are the rollos:", data)
            this.setState({ user: user, rollos: data })
        })
    }
    render() {
        return (
            <React.Fragment>
                <MapComponent rollos={this.state.rollos} ref={map => this.map = map} getLocation={this._getLocationAsync} location={this.state.location} onRegionChange={this.onRegionChange} />
                {this.state.confirmingRide &&
                    <View style={{
                        left: '50%',
                        marginLeft: -24,
                        marginTop: -48,
                        position: 'absolute',
                        top: '50%'
                    }}>
                        <Image style={{
                            height: 48,
                            width: 48
                        }} source={require("../../assets/pin.png")} />
                    </View>}
                {this.state.loading &&
                    <View style={{
                        flex: 1,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height,
                        zIndex: 10,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Image style={{ width: 150, height: 150, opacity: 0.5 }} source={require('../../assets/loadingFinal.gif')} />
                    </View>
                }
                <TopBar navigation={this.props.navigation} cancelRide={this.cancelRide} />
                <RideButtonContainer openPanel={this.openPanel} user={this.state.user} requestRide={this.requestRide} confirmingRide={this.state.confirmingRide} cancelRide={this.cancelRide} />
                <SlidingUpPanel
                    visible={this.state.visible}
                    height={this.state.height}
                    draggableRange={{ top: this.state.height, bottom: 0 }}
                    backdropOpacity={0.25}
                    onRequestClose={this.closePanel}
                    ref={c => this._panel = c}>
                    <AuthenticationPopup closePanel={this.closePanel} extendPanel={this.extendPanel} />
                </SlidingUpPanel>
            </React.Fragment >
        );
    }
}




