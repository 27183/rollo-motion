import React, { Component } from "react";
import { StyleSheet, View, Alert, Text, TouchableOpacity, ScrollView } from "react-native";
// import { UltimateListView } from "react-native-ultimate-listview";
import { auth, functions } from "../../firebase/Fire"


export default class RideHistoryView extends Component {
    constructor() {
        super()
        this.state = {
            userId: false,
            history: null
        }
    }
    async componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ userId: user.uid })
                console.log("here's the user", user)
                console.log("here's the user's UID:", this.state.userId)
                this.retrieveUserHistory()
            }

        })
    }
    retrieveUserHistory = async () => {
        const { data } = await functions.httpsCallable("retrieveUserHistory")({ userId: this.state.userId })
        console.log("finally, some data", data)
        this.setState({ history: data })
    }
    render() {
        const keys = Object.keys(this.state.history) || []
        return (
            <ScrollView>
                {this.state.history &&
                    keys.map((key) => {
                        return
                        (<Text>
                            {this.state.history[key].rolloId}
                        </Text>)

                    })
                }
                }
            </ScrollView>
        )
    }
}