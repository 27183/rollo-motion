import React, { Component } from "react"
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native"
import styles from "../../../styles"
import loadingGif from "../../../../assets/loading.gif"

export default class UserInfoScreen extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            this.props.signingIn ?
                <Image style={{ width: 100, height: 100, top: 60 }} source={loadingGif} />
                :
                <React.Fragment>
                    <Text style={{ fontSize: 30, fontFamily: "Hiragino" }}>Last thing! Let's make this place look a bit more like home.</Text>
                    <View style={{ flex: 3 / 10, alignItems: "center" }}>
                        <TouchableOpacity disabled={this.props.photoPickDisabled} onPress={this.props.pickImage}>
                            <View>
                                <Image style={styles.avatar} source={this.props.uploading ? loadingGif : { uri: this.props.image || "https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png" }} />
                                <Image style={{ zIndex: 2, width: 40, height: 40, position: "relative", alignSelf: "flex-end", bottom: 40 }} source={require("../../../../assets/add-picture.png")} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={{ fontFamily: "Hiragino", fontSize: 20 }}>Name</Text>
                        <TextInput
                            style={{ height: 35, borderBottomColor: "black", borderBottomWidth: 1, fontSize: 15, fontFamily: "Hiragino" }}
                            placeholder="John Smith"
                            onChangeText={(text) => this.props.onChangeText(text)}
                            multiline={false}
                            autoCorrect={false}
                            enablesReturnKeyAutomatically={true}
                            autoCapitalize={"words"}
                            returnKeyType={"done"}
                        />
                    </View>
                    <TouchableOpacity disabled={this.props.uploading} style={{ backgroundColor: "#33aadc", width: 300, height: 40, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", top: 20, alignSelf: "center" }} onPress={() => this.props.signUserIn(this.props.token, this.props.text, this.props.phoneNumber)}>
                        <Text style={{ fontSize: 20, fontFamily: "Hiragino", alignSelf: "flex-end" }}>{this.props.text || this.props.image ? "Submit" : "Skip"}</Text>
                    </TouchableOpacity>
                </React.Fragment>
        )
    }
}