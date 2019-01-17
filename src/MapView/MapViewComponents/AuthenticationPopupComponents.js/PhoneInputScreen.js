import React, { Component } from "react"
import { Text, TouchableOpacity, Animated, Image, ActivityIndicator } from "react-native"
import PhoneInput from 'react-native-phone-input'
import loadingGif from "../../../../assets/loading.gif"


export default class PhoneInputScreen extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { validNumber, extendPanel, verifyNumber } = this.props
        return (
            <React.Fragment>
                <Text style={{ fontSize: 30, fontFamily: "Hiragino" }}>Ready to Rollo?</Text>
                <PhoneInput ref={(ref) => { this.phone = ref }}
                    style={{
                        paddingTop: 20, paddingBottom: 20, borderBottomWidth: 3,
                        borderBottomColor: "black",
                    }} textStyle={{ fontSize: 20, fontFamily: "Hiragino-Lighter" }} textProps={{ placeholder: "1-800-ROLLO", onFocus: () => extendPanel() }} />
                <TouchableOpacity disabled={validNumber} style={{ backgroundColor: "#33aadc", width: 300, height: 40, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", top: 20 }} onPress={verifyNumber}>
                    {
                        validNumber ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={{ fontSize: 20, fontFamily: "Hiragino", alignSelf: "flex-end", color: "#FFF" }}>Verify</Text>}
                </TouchableOpacity>
            </React.Fragment>
        )
    }
}

