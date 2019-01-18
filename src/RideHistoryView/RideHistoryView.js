import React, { Component } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { auth, functions } from "../../firebase/Fire"
import CardView from 'react-native-cardview'
import { TopBar } from "../MapView/MapViewComponents"
import dateFormat from "dateformat"


export default class RideHistoryView extends Component {
    constructor() {
        super()
        this.state = {
            userId: false,
            history: [],
        }
    }
    async componentDidMount() {
        this.willFocus = this.props.navigation.addListener('willFocus', () => {
            this.state.userId && this.retrieveUserHistory()
        });
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
        try {
            const { data } = await functions.httpsCallable("retrieveUserHistory")({ userId: this.state.userId })
            console.log("finally, some data", data)
            this.setState({ history: data })
        } catch (err) {
            console.log(err)
        }

    }
    distanceFormula = (rolloLocation, userLocation) => {
        return Math.sqrt(Math.pow((rolloLocation.startLocation.latitude - userLocation.endLocation.latitude), 2) + Math.pow((rolloLocation.startLocation.longitude - userLocation.startLocation.longitude), 2))
    }
    render() {
        return (
            <React.Fragment>
                <TopBar navigation={this.props.navigation} />
                <View style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    zIndex: 14,
                    backgroundColor: "white"
                }}>
                </View>
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ paddingVertical: 70, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        {this.state.history.sort((a, b) => a.startTime - b.startTime).map(ride => <CardView
                            cardElevation={2}
                            cardMaxElevation={2}
                            cornerRadius={10}
                            cornerOverlap={false}
                            contentInset={{ top: 70, left: 0, bottom: 0, right: 0 }}
                            key={ride.startTime}
                            style={{ width: Dimensions.get("window").width * 0.90, height: Dimensions.get("window").height * 0.15, backgroundColor: "#33aadc", margin: 10, }}
                        >
                            <View style={{ margin: 15 }}>
                                <Text style={{ fontFamily: "Hiragino-Lighter" }}>
                                    {dateFormat(ride.startTime, "dddd, mmmm dS, yyyy")}
                                </Text>
                                {ride.endTime ?
                                    <Text style={{ fontFamily: "Hiragino-Lightest" }}>
                                        {`${dateFormat(ride.startTime, "h:MM TT")}` + " -> " + `${dateFormat(ride.endTime, "h:MM TT")}`}
                                    </Text>
                                    : <Text style={{ fontFamily: "Hiragino-Lightest" }}>
                                        {dateFormat(ride.startTime, "h:MM TT")}
                                    </Text>}
                            </View>
                        </CardView>)}
                    </ScrollView>
                </View>
            </React.Fragment>
        )
    }
}
