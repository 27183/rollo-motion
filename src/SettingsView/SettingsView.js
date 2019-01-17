import { View, Text, TouchableOpacity, Image, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from "react-native"
import React, { Component } from "react"
import styles from "../styles"
import { TopBar } from "../MapView/MapViewComponents"
import { storage, auth, functions } from "../../firebase/Fire"
import { ImagePicker, Permissions } from 'expo';
import uuid from 'uuid';
import loadingGif from "../../assets/loading.gif"
import Dialog, { SlideAnimation, DialogContent, DialogButton, ScaleAnimation } from 'react-native-popup-dialog';


export default class SettingsView extends Component {
    constructor() {
        super()
        this.state = {
            user: null,
            uploading: false,
            photoUrl: "",
            displayName: "",
            phoneNumber: "",
            submitPressed: false,
            uploadComplete: false,
            dialogVisible: false
        }
    }
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ phoneNumber: user.phoneNumber, displayName: user.displayName, photoUrl: user.photoURL })
            }
            console.log("here's the user", user)
        })
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
                this.setState({ photoUrl: uploadUrl });

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
    updateUser = async () => {
        this.setState({ submitPressed: true })
        const { photoUrl, displayName, phoneNumber } = this.state
        await functions.httpsCallable("updateUserInfo")({ displayName: displayName, phone: phoneNumber, photoURL: photoUrl })
        this.setState({ submitPressed: false, dialogVisible: true })
        // setInterval(() => this.setState({ dialogVisible: false }), 1500)
    }
    nameUpdated = (name) => {
        this.setState({ displayName: name })
    }
    phoneUpdated = (phone) => {
        this.setState({ phoneNumber: phone })
    }

    render() {
        const { uploading, photoUrl, displayName, phoneNumber, dialogVisible, submitPressed, uploadComplete } = this.state
        return (
            <TouchableWithoutFeedback
                onPress={() => Keyboard.dismiss()}>
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <TopBar navigation={this.props.navigation} />
                    <View style={{ flex: 1 / 3, width: Dimensions.get("window").width, justifyContent: "flex-end", alignItems: "center" }}>
                        <TouchableOpacity disabled={false} onPress={this._pickImage}>
                            <View>
                                <Image style={styles.avatar} source={uploading ? loadingGif : { uri: photoUrl || "https://hovercraftdoggy.files.wordpress.com/2012/07/iain-acton3-we-go-with-the-flow1.gif" }} />
                                <Image style={{ zIndex: 2, width: 40, height: 40, position: "relative", alignSelf: "flex-end", bottom: 40 }} source={require("../../assets/add-picture.png")} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 / 6, width: Dimensions.get("window").width * 0.80, justifyContent: "flex-end" }}>
                        <Text style={{ fontFamily: "Hiragino", fontSize: 20 }}>Name</Text>
                        <TextInput
                            style={{ height: 35, borderBottomColor: "black", borderBottomWidth: 1, fontSize: 15, fontFamily: "Hiragino" }}
                            placeholder="John"
                            multiline={false}
                            autoCorrect={false}
                            enablesReturnKeyAutomatically={true}
                            autoCapitalize={"words"}
                            returnKeyType={"done"}
                            defaultValue={displayName}
                            onChangeText={this.nameUpdated}
                        />
                    </View>
                    <View style={{ flex: 1 / 6, width: Dimensions.get("window").width * 0.80, justifyContent: "flex-end" }}>
                        <Text style={{ fontFamily: "Hiragino", fontSize: 20 }}>Phone</Text>
                        <TextInput
                            style={{ height: 35, borderBottomColor: "black", borderBottomWidth: 1, fontSize: 15, fontFamily: "Hiragino", color: "grey" }}
                            placeholder="1-800-rollo"
                            multiline={false}
                            autoCorrect={false}
                            enablesReturnKeyAutomatically={true}
                            autoCapitalize={"words"}
                            returnKeyType={"done"}
                            defaultValue={phoneNumber}
                            onChangeText={this.phoneUpdated}
                            editable={false}
                        />
                    </View>
                    <View style={{ flex: 1 / 3, width: Dimensions.get("window").width * 0.80, justifyContent: "center" }}>
                        <TouchableOpacity disabled={submitPressed} style={{ backgroundColor: "#33aadc", width: 300, height: 40, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", top: 20, alignSelf: "center" }} onPress={this.updateUser}>
                            {submitPressed ?
                                <ActivityIndicator size="small" color="#FFF" />
                                :
                                <Text style={{ fontSize: 20, fontFamily: "Hiragino", alignSelf: "flex-end", color: "#FFF" }}>{"Submit"}</Text>

                            }
                        </TouchableOpacity>
                    </View>
                    <Dialog
                        visible={dialogVisible}
                        onTouchOutside={() => {
                            this.setState({ dialogVisible: false });
                        }}
                        dialogAnimation={new ScaleAnimation({

                        })}
                        actions={[
                            <DialogButton
                                text="dismiss"
                                key="dismiss"
                                style={{ backgroundColor: "#FFF" }}
                                textStyle={{ color: "black", alignSelf: "center", fontFamily: "Hiragino-Lightest", fontSize: 14 }}
                                onPress={() => { this.setState({ dialogVisible: false }) }}
                            />,
                        ]}
                        width={0.8}
                        height={0.15}
                    >
                        <DialogContent style={{ flex: 1, backgroundColor: "#FFF" }}>
                            <View style={{ backgroundColor: "#FFF", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "black", fontFamily: "Hiragino", fontSize: 20, alignSelf: "center" }}>{" "}</Text>
                                <Text style={{ color: "black", fontFamily: "Hiragino-Lighter", fontSize: 20, alignSelf: "center" }}>{"Profile Updated!"}</Text>
                            </View>
                        </DialogContent>
                    </Dialog>
                </View>
            </TouchableWithoutFeedback >
        )
    }
}
