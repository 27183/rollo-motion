import React, { Component } from "react"
import { View, Text, Button, TouchableOpacity } from "react-native"
import PhoneInput from 'react-native-phone-input'
import Carousel from 'react-native-snap-carousel';


export default class CarouselContainer extends Component {


    _renderItem({ item, index }) {
        return (
            <View style={styles.slide}>
                <Text style={styles.title}>{item.title}</Text>
            </View>
        );
    }
    render() {
        return (
            <React.Fragment>
                <PhoneInput ref={(ref) => { this.phone = ref }} style={{
                    paddingTop: 20, paddingBottom: 20, borderBottomWidth: 3,
                    borderBottomColor: "black",
                }} textStyle={{ fontSize: 25 }} textProps={{ onFocus: () => this.props.extendPanel() }} />
                <TouchableOpacity style={{ backgroundColor: "#33aadc", width: 300, height: 40, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "center", top: 20 }} onPress={() => this.props.verifyNumber()}>
                    <Text style={{ fontSize: 20, fontFamily: "Hiragino", alignSelf: "center" }}>Verify</Text>
                </TouchableOpacity>
            </React.Fragment>
        )
    }

}





//carousel needs to have four items
//one is phone number input
//two is verification code input
//three is name input
//four is welcome screen, ten free rides




//next onpress
//verify number is valid
//if valid send text message w verification code
//animate out input field, animate in six digit input field
//if not valid notify user