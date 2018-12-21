import React, { Component } from "react"
import styles from "./styles"
import { ScrollView, SafeAreaView, View, Text, TouchableOpacity, Image } from "react-native"

class CustomDrawerComponent extends Component {
    render() {
        return (
            <ScrollView style={{ backgroundColor: "#fff" }}>
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: 10
                    }}>
                        <Text style={{
                            fontSize: 30
                        }}>Profile</Text></View>
                    <View style={{ flex: 3 / 10, alignItems: "center" }}>
                        <TouchableOpacity >
                            <Image style={styles.avatar} source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg" }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 7 / 10, paddingLeft: 20 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.closeDrawer()} style={{ borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("./assets/map.png")} />
                                <Text style={{ fontSize: 20 }}>Map</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.closeDrawer()} style={{ borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 20, height: 20 }} source={require("./assets/rideHistory.png")} />
                                <Text style={{ fontSize: 20 }}>Ride History</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.closeDrawer()} style={{ borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("./assets/help.png")} />
                                <Text style={{ fontSize: 20 }}>Help</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.closeDrawer()} style={{ borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("./assets/settings.png")} />
                                <Text style={{ fontSize: 20 }}>Settings</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.closeDrawer()} style={{ borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("./assets/logout.png")} />
                                <Text style={{ fontSize: 20 }}>Log Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView >
        )
    }
}

export default CustomDrawerComponent