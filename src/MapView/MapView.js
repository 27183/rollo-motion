import React, { Component } from "react"
import { TopBar, MapComponent, RideButtonContainer, AuthenticationPopup } from "./MapViewComponents"
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Dimensions, Easing, View, Image, Text } from 'react-native';
import { auth, functions } from "../../firebase/Fire"
import { Location, Permissions } from 'expo';
import Dialog, { SlideAnimation, DialogContent, DialogButton, ScaleAnimation } from 'react-native-popup-dialog';

export default class MapView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            panelHeight: Dimensions.get("window").height / 2,
            user: "",
            location: null,
            region: null,
            confirmingRide: false,
            rolloOnTheWay: false,
            loading: false,
            rollos: [],
            dialogVisible: false
        }
    }
    openPanel = () => {
        !this.state.user && this.setState({ visible: true })
    }
    closePanel = () => {
        this.setState({ panelHeight: Dimensions.get("window").height / 2, visible: false })
    }
    extendPanel = () => {
        this.setState({ panelHeight: Dimensions.get("window").height * 0.85 })
        this._panel.transitionTo({ toValue: Dimensions.get("window").height, duration: 2000, easing: Easing.bounce })
    }
    requestRide = async () => {
        if (this.state.confirmingRide) {
            const { location, user } = this.state
            const startTime = Date.now()
            this.setState({ loading: true, startTime: startTime })
            const { data } = await functions.httpsCallable("confirmRide")({ userId: user.uid, location: location, startTime: startTime })
            console.log("returned object", data)
            if (data !== "no available rides!") {
                this.setState({ loading: false, rollos: [data], rolloOnTheWay: true })
                this.map.map.fitToCoordinates([{ latitude: data.location._latitude, longitude: data.location._longitude }, this.state.location.coords], { edgePadding: { top: 100, right: 100, bottom: 100, left: 100 }, animated: true })
                return
            }
            this.setState({ dialogVisible: true, loading: false })
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
    cancelRollo = async () => {
        console.log("ride cancelled")
        const endTime = Date.now()
        this.setState({ loading: true, endTime: endTime })

        await functions.httpsCallable("cancelRollo")({ userId: this.state.user.uid, rolloId: this.state.rollos[0].rolloId, location: this.state.location, startTime: this.state.startTime, endTime: endTime })
        const { data } = await functions.httpsCallable("requestRollos")({})
        this.cancelRide()
        this.setState({ rolloOnTheWay: false, rollos: data, rolloId: "", loading: false })
    }
    zoomOut = () => {
        this.cancelRide()
        this.setState({ dialogVisible: false })
    }
    render() {
        const { rollos, location, confirmingRide, rolloOnTheWay, loading, user, dialogVisible, visible, panelHeight } = this.state
        const { width, height } = Dimensions.get("window")
        return (
            <React.Fragment>
                <MapComponent rollos={rollos} ref={map => this.map = map} getLocation={this._getLocationAsync} location={location} onRegionChange={this.onRegionChange} />
                {(confirmingRide && !rolloOnTheWay) &&
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
                {loading &&
                    <View style={{
                        flex: 1,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        width: width,
                        height: height,
                        zIndex: 10,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Image style={{ width: 150, height: 150, opacity: 0.5 }} source={require('../../assets/loadingFinal.gif')} />
                    </View>
                }
                <TopBar rolloOnTheWay={rolloOnTheWay} navigation={this.props.navigation} cancelRide={this.cancelRide} />
                <RideButtonContainer cancelRollo={this.cancelRollo} rolloOnTheWay={rolloOnTheWay} openPanel={this.openPanel} user={user} requestRide={this.requestRide} confirmingRide={confirmingRide} cancelRide={this.cancelRide} />
                <Dialog
                    visible={dialogVisible}
                    onTouchOutside={() => {
                        this.setState({ dialogVisible: false });
                    }}
                    dialogAnimation={new ScaleAnimation({})}
                    actions={[
                        <DialogButton
                            text="sounds good"
                            style={{ backgroundColor: "#FFF" }}
                            textStyle={{ color: "black", alignSelf: "center", fontFamily: "Hiragino-Lightest", fontSize: 14 }}
                            onPress={this.zoomOut}
                        />,
                    ]}
                    width={0.8}
                    height={0.15}
                >
                    <DialogContent style={{ flex: 1, backgroundColor: "#FFF", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
                        <Text style={{ color: "black", fontFamily: "Hiragino-Lighter", fontSize: 20 }}>{"No rollos nearby 😢"}</Text>
                        <Text style={{ color: "black", fontFamily: "Hiragino-Lighter", fontSize: 20 }}>{"Try again later!"}</Text>
                    </DialogContent>
                </Dialog>

                <SlidingUpPanel
                    visible={visible}
                    height={panelHeight}
                    draggableRange={{ top: panelHeight, bottom: 0 }}
                    backdropOpacity={0.25}
                    onRequestClose={this.closePanel}
                    ref={c => this._panel = c}>
                    <AuthenticationPopup closePanel={this.closePanel} extendPanel={this.extendPanel} />
                </SlidingUpPanel>
            </React.Fragment >
        );
    }
}




