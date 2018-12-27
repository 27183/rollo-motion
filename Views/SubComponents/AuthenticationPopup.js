import React, { Component } from "react"
import { View, Text, Button, TouchableOpacity } from "react-native"
import PhoneInput from 'react-native-phone-input'


export default class AuthenticationPopup extends Component {
    constructor() {
        super()
        this.state = {
            pickerData: null
        }
        this.verifyNumber = this.verifyNumber.bind(this)
    }
    verifyNumber() {
        if (this.phone.isValidNumber()) {
            //insert twilio function here
            this.setState({ pickerData: this.phone.getValue() })

        }
        console.log("the number is valid? ", this.phone.isValidNumber())
        console.log("the phone number:", this.phone.getValue())
    }

    render() {
        return (
            <View style={
                {
                    flex: 1,
                    backgroundColor: 'white',
                    justifyContent: "flex-start",
                    alignItems: 'center',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    padding: 20
                }
            }>
                <Text style={{ fontSize: 30, fontFamily: "Hiragino" }}>Ready to Rollo?</Text>
                <PhoneInput ref={(ref) => { this.phone = ref }} style={{
                    paddingTop: 20, paddingBottom: 20, borderBottomWidth: 3,
                    borderBottomColor: "black",
                }} textStyle={{ fontSize: 25 }} textProps={{ onFocus: () => this.props.extendPanel() }} />
                <TouchableOpacity style={{ backgroundColor: "#33aadc", width: 300, height: 40, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "center", top: 20 }} onPress={this.verifyNumber}>
                    <Text style={{ fontSize: 20, fontFamily: "Hiragino", alignSelf: "center" }}>Verify</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

//carousel needs to have four items
//one is phone number input
//two is verification code input
//three is name input
//four is welcome screen, ten free rides




//next onpress
//verify number is valid
//if valid send text message w verification code
//animate out input field, animate in six digit input field
//if not valid notify user