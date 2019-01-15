import React from "react"
import { Text, TouchableOpacity } from 'react-native';


export default RideButtonContainer = (props) => {
    const { user, openPanel, requestRide, confirmingRide, cancelRide } = props
    return (
        <React.Fragment>
            <TouchableOpacity
                onPress={!user ? openPanel : requestRide}
                style={{
                    flex: 1,
                    position: "absolute",
                    bottom: 50,
                    flexDirection: "row",
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100,
                    height: 100,
                    alignSelf: "center",
                    backgroundColor: 'black',
                    borderWidth: 1,
                    borderRadius: 100,
                }}
            >
                <Text style={{ color: "white" }}>{confirmingRide ? "Confirm" : "Ride"}</Text>
            </TouchableOpacity>

            {confirmingRide && <TouchableOpacity
                style={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'red',
                    borderRadius: 100,
                    left: '30%',
                    position: 'absolute',
                    top: '90%',
                    justifyContent: "center",
                    alignItems: "center"
                }}
                onPress={cancelRide}
            >
                <Text style={{ color: "#FFF", fontSize: 30 }}>✖</Text>
            </TouchableOpacity>}
        </React.Fragment>
    );
}