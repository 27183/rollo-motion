import React, { Component } from "react"
import { Platform, Animated, StyleSheet, Text, View, Image, Button, TouchableOpacity, Dimensions, Icon } from 'react-native';
import { styles } from "../index"


export default RideButtonContainer = (props) => {
    return (
        <View style={styles.bottomBar}>
            <TouchableOpacity
                onPress={props.openPanel}
                style={{
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100,
                    height: 100,
                    backgroundColor: 'black',
                    borderRadius: 100,
                }}
            >
                <Text style={{ color: "white" }}>Ride</Text>
            </TouchableOpacity>
        </View>
    );
}
