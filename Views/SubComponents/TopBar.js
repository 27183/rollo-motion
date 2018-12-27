import React, { Component } from "react"
import { View, Image, TouchableOpacity } from 'react-native';
import { styles } from "../index"

export default TopBar = (props) => {
    return (
        <View style={styles.topBar}>
            <TouchableOpacity style={{ position: "absolute", left: 20, top: 15, justifyContent: "flex-start", width: 40, height: 40 }} onPress={() => props.navigation.openDrawer()}><Image style={{ width: 30, height: 30 }} source={require("../../assets/hamburger.png")}></Image></TouchableOpacity>
            <Image style={{ height: 50 }} source={require('../../assets/rollologo.png')} />
        </View>
    )
} 
