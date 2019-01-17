import React, { Component } from "react"
import { Text, Image, TouchableOpacity, ActivityIndicator } from "react-native"
import CodeInput from 'react-native-confirmation-code-input';
import loadingGif from "../../../../assets/loading.gif"

export default class CodeInputScreen extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { verifyingCode, invalidCode, verifyCode, resendCode, phoneNumber } = this.props
        return (
            verifyingCode ?
                <Image style={{ width: 100, height: 100, top: 60 }} source={loadingGif} />
                : <React.Fragment>
                    <Text style={{ fontSize: 30, fontFamily: "Hiragino" }}>{invalidCode ? "Invalid code. Give it another go?" : "Enter the verification code"}</Text>
                    <CodeInput
                        codeLength={6}
                        ref={c => this.codeInput = c}
                        keyboardType="numeric"
                        activeColor="black"
                        inactiveColor="#33aadc"
                        autoFocus={false}
                        ignoreCase={true}
                        inputPosition='center'
                        size={50}
                        onFulfill={(isValid) => verifyCode(isValid)}
                        containerStyle={{ paddingTop: 20, paddingBottom: 20 }}
                        codeInputStyle={{ borderBottomWidth: 1.5, fontFamily: "Hiragino" }}
                    />
                    {invalidCode &&

                        <TouchableOpacity style={{ alignSelf: "center", backgroundColor: "#33aadc", width: 300, height: 40, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", top: 40 }} onPress={() => resendCode(phoneNumber)}>
                            <Text style={{ fontSize: 20, fontFamily: "Hiragino", alignSelf: "flex-end", color: "#FFF" }}>Send new code</Text>
                        </TouchableOpacity>}
                </React.Fragment>
        )
    }
}