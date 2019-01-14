import React, { Component } from "react"
import { View, Animated } from "react-native"
import styles from "../../styles"
import { functions, auth, storage } from "../../../firebase/Fire"
import { ImagePicker, Permissions } from 'expo';
import uuid from 'uuid';
import { CodeInputScreen, PhoneInputScreen, UserInfoScreen } from "./AuthenticationPopupComponents.js"

export default class AuthenticationPopup extends Component {
    constructor() {
        super()
        this.state = {
            phoneNumber: null,
            validNumber: false,
            phoneAuthOpacity: new Animated.Value(1),
            verificationAuthOpacity: new Animated.Value(0),
            userNameOpacity: new Animated.Value(0),
            phoneAuthZPosition: 3,
            codeAuthZPosition: 2,
            nameZPosition: 1,
            text: "",
            phone: "",
            userId: "",
            token: "",
            image: "",
            uploading: false,
            photoPickDisabled: true,
            verifyingCode: false,
            signingIn: false,
            invalidCode: false
        }
    }

    verifyNumber = async () => {
        const enteredNumber = this.phoneInput.phone.getValue()
        if (this.phoneInput.phone.isValidNumber()) {
            this.setState({ validNumber: true })
            try {
                await functions.httpsCallable("logInWithPhoneNumber")({ phone: enteredNumber })
                this.fadeOutPhoneAuth()
            } catch (error) {
                console.error("here's the big error:", error)
            }
            this.setState({ phoneNumber: enteredNumber })
            this.codeInput.codeInput._setFocus(0)
        } else {
            console.log("not a valid number!")
        }
    }
    resendCode = async (phoneNumber) => {
        try {
            await functions.httpsCallable("logInWithPhoneNumber")({ phone: phoneNumber })
        } catch (error) {
            console.error(error)
        }
    }

    verifyCode = async (code) => {
        this.setState({ verifyingCode: true })
        try {
            console.log("trying to do it!")
            const { data } = await functions.httpsCallable("verifyToken")({ code: code, phone: this.state.phoneNumber })
            console.log("here's the status", data.stat)
            this.setState({ token: data.id })
            if (data.stat !== "new user") {
                await auth.signInWithCustomToken(data.id)
                this.props.closePanel()
            }
            this.fadeOutCodeAuth()
        } catch (err) {
            this.setState({ verifyingCode: false, invalidCode: true })
            console.log(err)
            console.log("invalid code")

            //add button to re-send a code
        }
    }

    signUserIn = async (token, name, phone) => {
        this.setState({ signingIn: true })
        try {
            console.log("userInputtedName:", this.state.text)
            await functions.httpsCallable("updateUserInfo")({ displayName: name, phone: phone, photoURL: this.state.image })
            this.props.closePanel()
            await auth.signInWithCustomToken(token)
        } catch (err) {
            console.error(err)
        }
    }

    _pickImage = async () => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        this._handleImagePicked(pickerResult);
    };

    _handleImagePicked = async pickerResult => {
        try {
            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                uploadUrl = await this.uploadImageAsync(pickerResult.uri);
                this.setState({ image: uploadUrl });

            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }
    };

    uploadImageAsync = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
        const ref = storage
            .ref()
            .child(uuid.v4());
        const snapshot = await ref.put(blob);
        blob.close();
        return await snapshot.ref.getDownloadURL();
    }

    fadeOutPhoneAuth = () => {
        Animated.timing(this.state.phoneAuthOpacity, { toValue: 0, useNativeDriver: true, }).start();
        Animated.timing(this.state.verificationAuthOpacity, { toValue: 1, useNativeDriver: true, }).start();
        this.setState({ phoneAuthZPosition: 2, codeAuthZPosition: 3 })
    }

    fadeOutCodeAuth = () => {
        Animated.timing(this.state.verificationAuthOpacity, { toValue: 0, useNativeDriver: true, }).start();
        Animated.timing(this.state.userNameOpacity, { toValue: 1, useNativeDriver: true, }).start();
        this.setState({ codeAuthZPosition: 1, nameZPosition: 3, photoPickDisabled: false })
    }

    updateName = (text) => {
        this.setState({ text })
        console.log(this.state.text)
    }

    render() {
        return (
            <View style={styles.authenticationPopupContainer}>
                <Animated.View style={{ opacity: this.state.phoneAuthOpacity, zIndex: this.state.phoneAuthZPosition }}>
                    <PhoneInputScreen validNumber={this.state.validNumber} ref={c => this.phoneInput = c} extendPanel={this.props.extendPanel} verifyNumber={this.verifyNumber} />
                </Animated.View>

                <Animated.View style={{ opacity: this.state.verificationAuthOpacity, position: "absolute", top: 20, zIndex: this.state.codeAuthZPosition }}>
                    <CodeInputScreen resendCode={this.resendCode} phoneNumber={this.state.phoneNumber} verifyingCode={this.state.verifyingCode} ref={c => this.codeInput = c} verifyCode={this.verifyCode} invalidCode={this.state.invalidCode} />
                </Animated.View>

                <Animated.View style={{ opacity: this.state.userNameOpacity, position: "absolute", top: 20, zIndex: this.state.nameZPosition, justifyContent: "center" }}>
                    <UserInfoScreen signedIn={this.state.signingIn} photoPickDisabled={this.state.photoPickDisabled} pickImage={this._pickImage} uploading={this.state.uploading} image={this.state.image} onChangeText={this.updateName} text={this.state.text} signUserIn={this.signUserIn} token={this.state.token} phoneNumber={this.state.phoneNumber} />
                </Animated.View>
            </View>
        )
    }
}