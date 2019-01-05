import React, { Component } from "react"
import { Platform, Animated, StyleSheet, Text, View, Image, Button, TouchableOpacity, Dimensions, Icon } from 'react-native';
import styles from "../../styles"
import PulseLoader from "./PulseLoader"

export default class RideButtonContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            diameter: 100
        }
    }

    render() {
        const { diameter } = this.state
        return (
            <View style={{
                position: "absolute",
                bottom: 50,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width,
                height: diameter,
                width: diameter,
                alignSelf: "center",
                backgroundColor: "transparent",
                borderWidth: 0,
                borderColor: 'rgba(0,0,0,0.2)',
                borderRadius: 100,
            }}>
                <PulseLoader
                    avatar={'https://scontent-fra3-1.cdninstagram.com/t51.2885-15/e35/11429705_386886401514376_550879228_n.jpg'}
                    avatarBackgroundColor={"black"}
                    backgroundColor={"#90cbd7"}
                    borderColor={"#337fdc"}
                    pulseMaxSize={Dimensions.get("window").height}
                    whenPressed={this.props.openPanel}
                />
            </View>

        );
    }
}