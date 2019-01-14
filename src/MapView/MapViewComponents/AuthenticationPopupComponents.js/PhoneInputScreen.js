import React, { Component } from "react"
import { Text, TouchableOpacity, Animated, Image } from "react-native"
import PhoneInput from 'react-native-phone-input'
import loadingGif from "../../../../assets/loading.gif"


export default class PhoneInputScreen extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            this.props.validNumber ?
                <Image style={{ width: 100, height: 100, top: 60 }} source={loadingGif} />
                : <React.Fragment>
                    <Text style={{ fontSize: 30, fontFamily: "Hiragino" }}>Ready to Rollo?</Text>
                    <PhoneInput ref={(ref) => { this.phone = ref }}
                        style={{
                            paddingTop: 20, paddingBottom: 20, borderBottomWidth: 3,
                            borderBottomColor: "black",
                        }} textStyle={{ fontSize: 20, fontFamily: "Hiragino-Lighter" }} textProps={{ placeholder: "1-800-ROLLO", onFocus: () => this.props.extendPanel() }} />
                    <TouchableOpacity disabled={this.props.validNumber} style={{ backgroundColor: "#33aadc", width: 300, height: 40, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", top: 20 }} onPress={this.props.verifyNumber}>
                        <Text style={{ fontSize: 20, fontFamily: "Hiragino", alignSelf: "flex-end" }}>Verify</Text>
                    </TouchableOpacity>
                </React.Fragment>
        )
    }
}

