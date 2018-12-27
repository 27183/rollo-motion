import React, { Component } from "react"
import { View, Text, Button, TouchableOpacity, Animated } from "react-native"
import PhoneInput from 'react-native-phone-input'
import CodeInput from 'react-native-confirmation-code-input';



export default class AuthenticationPopup extends Component {
    constructor() {
        super()
        this.state = {
            pickerData: null,
            phoneAuthOpacity: new Animated.Value(1),
            verificationAuthOpacity: new Animated.Value(0),
            userNameOpacity: new Animated.Value(0),
            phoneAuthZPosition: 3,
            codeAuthZPosition: 2,
            nameZPosition: 1
        }
        this.verifyNumber = this.verifyNumber.bind(this)
        this.fadeOutPhoneAuth = this.fadeOutPhoneAuth.bind(this)
        this._onFinishCheckingCode1 = this._onFinishCheckingCode1.bind(this)
        this.fadeOutCodeAuth = this.fadeOutCodeAuth.bind(this)
    }
    verifyNumber() {
        if (this.phone.isValidNumber()) {
            //insert twilio function here
            this.setState({ pickerData: this.phone.getValue() })

        }
        console.log("the number is valid? ", this.phone.isValidNumber())
        console.log("the phone number:", this.phone.getValue())
        this.fadeOutPhoneAuth()
    }

    fadeOutPhoneAuth() {
        Animated.timing(
            this.state.phoneAuthOpacity,
            {
                toValue: 0,
            },
        ).start();
        Animated.timing(
            this.state.verificationAuthOpacity,
            {
                toValue: 1,
            },
        ).start();
        this.setState({ phoneAuthZPosition: 2, codeAuthZPosition: 3 })
    }
    _onFinishCheckingCode1(valid) {
        console.log(valid)
        //insert code auth here
        this.fadeOutCodeAuth()

    }

    fadeOutCodeAuth() {
        Animated.timing(
            this.state.verificationAuthOpacity,
            {
                toValue: 0,
            },
        ).start();
        Animated.timing(
            this.state.userNameOpacity,
            {
                toValue: 1,
            },
        ).start();
        console.log("done")
        this.setState({ codeAuthZPosition: 1, nameZPosition: 3 })

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
                <Animated.View style={{ opacity: this.state.phoneAuthOpacity, zIndex: this.state.phoneAuthZPosition }}>
                    <Text style={{ fontSize: 30, fontFamily: "Hiragino" }}>Ready to Rollo?</Text>
                    <PhoneInput ref={(ref) => { this.phone = ref }} style={{
                        paddingTop: 20, paddingBottom: 20, borderBottomWidth: 3,
                        borderBottomColor: "black",
                    }} textStyle={{ fontSize: 25 }} textProps={{ onFocus: () => this.props.extendPanel() }} />
                    <TouchableOpacity style={{ backgroundColor: "#33aadc", width: 300, height: 40, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "center", top: 20 }} onPress={this.verifyNumber}>
                        <Text style={{ fontSize: 20, fontFamily: "Hiragino", alignSelf: "center" }}>Verify</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={{ opacity: this.state.verificationAuthOpacity, position: "absolute", top: 20, zIndex: this.state.codeAuthZPosition }}>
                    <Text style={{ fontSize: 30, fontFamily: "Hiragino" }}>Enter the verification code</Text>
                    <CodeInput
                        codeLength={4}
                        ref={c => this.codeInput = c}
                        keyboardType="numeric"
                        activeColor="#33aadc"
                        inactiveColor="#33aadc"
                        autoFocus={false}
                        ignoreCase={true}
                        inputPosition='center'
                        size={50}
                        onFulfill={(isValid) => this._onFinishCheckingCode1(isValid)}
                        containerStyle={{ paddingTop: 20, paddingBottom: 20 }}
                        codeInputStyle={{ borderBottomWidth: 1.5 }}
                    />
                </Animated.View>


                <Animated.View style={{ opacity: this.state.userNameOpacity, top: 20, zIndex: this.state.nameZPosition }}>
                    <Text style={{ fontSize: 30, fontFamily: "Hiragino" }}>Last thing! Let's make this place look a bit more like home.</Text>

                </Animated.View>
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