import React, { Component } from "react"
import { View, Text, Button, TouchableOpacity, Animated, Image, TextInput, ActivityIndicator } from "react-native"
import PhoneInput from 'react-native-phone-input'
import CodeInput from 'react-native-confirmation-code-input';
import styles from "../../styles"
import { firestore, functions, auth, storage } from "../../../firebase/Fire"
import { ImagePicker, Permissions, Alert } from 'expo';
import uuid from 'uuid';


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
            signingIn: false
        }
    }
    componentDidMount() {

    }

    verifyNumber = async () => {
        const enteredNumber = this.phone.getValue()
        if (this.phone.isValidNumber()) {
            this.setState({ validNumber: true })
            try {
                await functions.httpsCallable("logInWithPhoneNumber")({ phone: enteredNumber })
                this.fadeOutPhoneAuth()
            } catch (error) {
                console.error("here's the big error:", error)
            }
            this.setState({ phoneNumber: enteredNumber })
            this.codeInput._setFocus(0)
        } else {
            console.log("not a valid number!")
        }
    }

    verifyCode = async (code) => {
        this.setState({ verifyingCode: true })
        try {
            console.log("trying to do it!")
            const { data } = await functions.httpsCallable("verifyToken")({ code: code, phone: this.state.phoneNumber })
            // console.log("payload", payload)
            console.log("here's the status", data.stat)
            this.setState({ token: data.id })
            if (data.stat !== "new user") {
                await auth.signInWithCustomToken(data.id)
                // this.fadeOutCodeAuth()
                this.props.closePanel()
                //sign user in
            }
            this.fadeOutCodeAuth()
        } catch (err) {
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
                    {this.state.validNumber ?
                        <Image style={{ width: 100, height: 100, top: 60 }} source={require("../../../assets/loading.gif")} />
                        : <React.Fragment>
                            <Text style={{ fontSize: 30, fontFamily: "Hiragino" }}>Ready to Rollo?</Text>
                            <PhoneInput ref={(ref) => { this.phone = ref }}
                                style={{
                                    paddingTop: 20, paddingBottom: 20, borderBottomWidth: 3,
                                    borderBottomColor: "black",
                                }} textStyle={{ fontSize: 20, fontFamily: "Hiragino-Lighter" }} textProps={{ placeholder: "1-800-ROLLO", onFocus: () => this.props.extendPanel() }} />
                            <TouchableOpacity disabled={this.state.validNumber} style={{ backgroundColor: "#33aadc", width: 300, height: 40, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", top: 20 }} onPress={this.verifyNumber}>
                                <Text style={{ fontSize: 20, fontFamily: "Hiragino", alignSelf: "flex-end" }}>Verify</Text>
                            </TouchableOpacity></React.Fragment>}
                </Animated.View>
                <Animated.View style={{ opacity: this.state.verificationAuthOpacity, position: "absolute", top: 20, zIndex: this.state.codeAuthZPosition }}>
                    {this.state.verifyingCode ?
                        <Image style={{ width: 100, height: 100, top: 60 }} source={require("../../../assets/loading.gif")} />
                        : <React.Fragment>
                            <Text style={{ fontSize: 30, fontFamily: "Hiragino" }}>Enter the verification code</Text>
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
                                onFulfill={(isValid) => this.verifyCode(isValid)}
                                containerStyle={{ paddingTop: 20, paddingBottom: 20 }}
                                codeInputStyle={{ borderBottomWidth: 1.5, fontFamily: "Hiragino" }}
                            />
                        </React.Fragment>}
                </Animated.View>
                <Animated.View style={{ opacity: this.state.userNameOpacity, position: "absolute", top: 20, zIndex: this.state.nameZPosition, justifyContent: "center" }}>
                    {this.state.signingIn ?
                        <Image style={{ width: 100, height: 100, top: 60 }} source={require("../../../assets/loading.gif")} />
                        :
                        <React.Fragment>
                            <Text style={{ fontSize: 30, fontFamily: "Hiragino" }}>Last thing! Let's make this place look a bit more like home.</Text>
                            <View style={{ flex: 3 / 10, alignItems: "center" }}>
                                <TouchableOpacity disabled={this.state.photoPickDisabled} onPress={this._pickImage}>
                                    <View>
                                        <Image style={styles.avatar} source={this.state.uploading ? require("../../../assets/loading.gif") : { uri: this.state.image || "https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png" }} />
                                        <Image style={{ zIndex: 2, width: 40, height: 40, position: "relative", alignSelf: "flex-end", bottom: 40 }} source={require("../../../assets/add-picture.png")} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={{ fontFamily: "Hiragino", fontSize: 20 }}>Name</Text>
                                <TextInput
                                    style={{ height: 35, borderBottomColor: "black", borderBottomWidth: 1, fontSize: 15, fontFamily: "Hiragino" }}
                                    placeholder="John Smith"
                                    onChangeText={(text) => {
                                        this.setState({ text })
                                        console.log(this.state.text)
                                    }}
                                    multiline={false}
                                    autoCorrect={false}
                                    enablesReturnKeyAutomatically={true}
                                    autoCapitalize={"words"}
                                    returnKeyType={"done"}
                                />
                            </View>
                            <TouchableOpacity disabled={this.state.uploading || (!this.state.text)} style={{ backgroundColor: "#33aadc", width: 300, height: 40, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", top: 20, alignSelf: "center" }} onPress={() => this.signUserIn(this.state.token, this.state.text, this.state.phoneNumber)}>
                                <Text style={{ fontSize: 20, fontFamily: "Hiragino", alignSelf: "flex-end" }}>Submit</Text>
                            </TouchableOpacity>
                        </React.Fragment>}
                </Animated.View>
            </View>
        )
    }
}