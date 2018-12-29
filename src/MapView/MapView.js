import React, { Component } from "react"
import { TopBar, MapComponent, RideButtonContainer, AuthenticationPopup } from "./MapViewComponents"
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Dimensions, Easing } from 'react-native';

export default class MapView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            height: Dimensions.get("window").height / 2
        }

    }
    openPanel = () => {
        this.setState({ visible: true })
    }
    closePanel = () => {
        this.setState({ height: Dimensions.get("window").height / 2, visible: false })
    }
    extendPanel = () => {
        this.setState({ height: Dimensions.get("window").height * 0.85 })
        this._panel.transitionTo({ toValue: Dimensions.get("window").height, duration: 2000, easing: Easing.bounce })
    }
    render() {
        return (
            <React.Fragment>
                <MapComponent />
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




