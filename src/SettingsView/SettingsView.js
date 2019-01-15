import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
// import { FormInput, FormLabel } from "react-native-elements"
import { auth } from "../../firebase/Fire"
// import { getUser } from '../db/firebaseMethods';

export default class SettingsView extends Component {
    constructor() {
        super()
        this.state = { user: null }
        this.expandProfileCard = this.expandProfileCard.bind(this)
    }
    static navigationOptions = {
        header: null
    }
    componentDidMount() {
        var user = auth.currentUser
        console.log("heres' the user", user)
        // const userId = user.uid
        // const newUser = await getUser(userId)
        // this.setState({ user: newUser })
    }
    expandProfileCard() {
        this.props.navigation.openDrawer()
    }
    render() {
        return this.state.user && (
            <View style={{ flex: 1, backgroundColor: "#FFF" }}>
                <View style={{ flex: 2 / 20, backgroundColor: "#FFF" }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flex: 2 / 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                            <TouchableOpacity onPress={this.expandProfileCard}>
                                {/* <Image style={{ width: 30, height: 30, left: 20 }} source={require("../assets/settingsBlack.png")} /> */}
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 8 / 10 }}>
                            <View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 18 / 20, backgroundColor: "#FFF" }}>
                    <UserSetupForm user={this.state.user} navigateToAllStreams={this.navigateToAllStreams} />
                </View>
            </View>
        )
    }
}


