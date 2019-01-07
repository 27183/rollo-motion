import React, { Component } from "react"
import { Platform, Animated, StyleSheet, Text, View, Image, Button, TouchableOpacity, Dimensions, Icon } from 'react-native';
import { styles } from "../../index"


export default RideButtonContainer = (props) => {
    return (
        <TouchableOpacity
            onPress={props.openPanel}
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
            <Text style={{ color: "white" }}>Ride</Text>
        </TouchableOpacity>
    );
}