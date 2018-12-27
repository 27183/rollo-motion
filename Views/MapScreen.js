import React, { Component } from "react"
import { TopBar, MapViewContainer, RideButtonContainer, AuthenticationPopup } from "./index"
import SlidingUpPanel from 'rn-sliding-up-panel';
import { styles } from "../styles"
import { Platform, Animated, StyleSheet, Text, View, Image, Button, TouchableOpacity, Dimensions, Icon, Easing } from 'react-native';


export default class MapScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            height: Dimensions.get("window").height / 2
        }
        this.openPanel = this.openPanel.bind(this)
        this.closePanel = this.closePanel.bind(this)
        this.extendPanel = this.extendPanel.bind(this)
    }
    openPanel() {
        this.setState({ visible: true })
    }
    closePanel() {
        this.setState({ height: Dimensions.get("window").height / 2, visible: false })
    }
    extendPanel() {
        this.setState({ height: Dimensions.get("window").height * 0.85 })
        this._panel.transitionTo({ toValue: Dimensions.get("window").height, duration: 2000, easing: Easing.bounce })
    }
    render() {
        return (
            <React.Fragment>
                <MapViewContainer />
                <TopBar navigation={this.props.navigation} />
                <RideButtonContainer openPanel={this.openPanel} />
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




