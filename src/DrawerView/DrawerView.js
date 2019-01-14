import React, { Component } from "react"
import styles from "../styles"
import { ScrollView, SafeAreaView, View, Text, TouchableOpacity, Image } from "react-native"
import { auth } from "../../firebase/Fire"

export default class DrawerView extends Component {
    constructor() {
        super()
        this.state = {
            userName: null,
            exists: false,
            photo: null
        }
    }
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ userName: user.displayName, exists: true, photo: user.photoURL || "https://hovercraftdoggy.files.wordpress.com/2012/07/iain-acton3-we-go-with-the-flow1.gif" })
                console.log("we have a user!", user)
            } else {
                this.setState({ exists: false })

                console.log("no user yet")
            }
        })
    }
    logOut = () => {
        auth.signOut()
        this.props.navigation.closeDrawer()
    }
    render() {
        const { closeDrawer } = this.props.navigation
        return (
            <ScrollView style={{ backgroundColor: "#fff", borderTopRightRadius: 30, borderBottomRightRadius: 30 }}
                scrollEnabled={false}>
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: 10,
                        paddingTop: 30
                    }}>
                        <Text style={{
                            fontSize: 30, fontFamily: "Hiragino-Lighter"
                        }}>{this.state.exists ? "Hey, " + this.state.userName : ""}</Text></View>
                    <View style={{ flex: 3 / 10, alignItems: "center" }}>
                        <TouchableOpacity >
                            <Image style={styles.avatar} source={{ uri: this.state.exists ? this.state.photo : "https://hovercraftdoggy.files.wordpress.com/2012/07/iain-acton3-we-go-with-the-flow1.gif" }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 7 / 10, paddingLeft: 20 }}>
                        <TouchableOpacity onPress={closeDrawer} style={{ borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/map.png")} />
                                <Text style={{ fontSize: 20, fontFamily: "Hiragino-Lighter" }}>Map</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeDrawer} style={{ borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 20, height: 20 }} source={require("../../assets/rideHistory.png")} />
                                <Text style={{ fontSize: 20, fontFamily: "Hiragino-Lighter" }}>Ride History</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeDrawer} style={{ borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/help.png")} />
                                <Text style={{ fontSize: 20, fontFamily: "Hiragino-Lighter" }}>Help</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeDrawer} style={{ borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/settings.png")} />
                                <Text style={{ fontSize: 20, fontFamily: "Hiragino-Lighter" }}>Settings</Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.exists && <TouchableOpacity onPress={this.logOut} style={{ borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/logout.png")} />
                                <Text style={{ fontSize: 20, fontFamily: "Hiragino-Lighter" }}>Log Out</Text>
                            </View>
                        </TouchableOpacity>}
                    </View>
                </SafeAreaView>
            </ScrollView >
        )
    }
}

