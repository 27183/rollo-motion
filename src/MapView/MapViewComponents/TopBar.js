import React, { Component } from "react"
import { View, Image, TouchableOpacity } from 'react-native';
import styles from "../../styles"
export default class TopBar extends Component {
    constructor(props) {
        super(props)
    }
    hamburgerPressed = () => {
        this.props.navigation.openDrawer()
        this.props.cancelRide && !this.props.rolloOnTheWay && this.props.cancelRide()
    }
    render() {
        return (
            <View style={styles.topBar}>
                <TouchableOpacity style={{ position: "absolute", left: 20, top: 15, justifyContent: "flex-start", width: 40, height: 40 }} onPress={this.hamburgerPressed}>
                    <Image style={{ width: 30, height: 30 }} source={require("../../../assets/hamburger.png")} />
                </TouchableOpacity>
                <View style={{ height: 50, width: 100, alignSelf: "center" }}>
                    <Image style={{
                        flex: 1,
                        width: null,
                        height: null,
                        resizeMode: 'contain'
                    }} source={require('../../../assets/rollologo.png')} />
                </View>
            </View>
        )
    }
} 
