import React, { Component } from 'react';
import styles from "./styles"
import { SafeAreaView, createDrawerNavigator, createStackNavigator, DrawerItems, Dimensions, NavigationActions, createAppContainer } from "react-navigation"
import MapScreen from "./Views/MapScreen"
import CustomDrawerComponent from "./CustomDrawer"
import { Font } from 'expo';
const Hiragino = require("./assets/hiragino.otf")

const Rollo = createAppContainer(createDrawerNavigator({
  MapScreen: { screen: MapScreen },
},
  {
    drawerPosition: "left",
    initialRouteName: "MapScreen",
    drawerBackgroundColor: "white",
    drawerWidth: 300,
    contentComponent: CustomDrawerComponent,
  },
))

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Hiragino': Hiragino,
    });
    this.setState({ fontLoaded: true })
  }
  render() {
    return this.state.fontLoaded && (<Rollo />)
  }
}

