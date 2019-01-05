import React, { Component } from 'react';
import { createDrawerNavigator, createStackNavigator, DrawerItems, Dimensions, NavigationActions, createAppContainer } from "react-navigation"
import { MapView, DrawerView, styles } from "./src"
import { Font } from 'expo';
const Hiragino = require("./assets/hiragino.otf")
const HiraginoLighter = require("./assets/hiragino-lighter.otf")
const HiraginoLightest = require("./assets/hiragino-lightest.otf")

const Rollo = createAppContainer(createDrawerNavigator({
  MapView: { screen: MapView },
},
  {
    drawerPosition: "left",
    initialRouteName: "MapView",
    drawerBackgroundColor: "transparent",
    drawerWidth: 300,
    contentComponent: DrawerView,
  },
))

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Hiragino': Hiragino,
      "Hiragino-Lighter": HiraginoLighter,
      "Hiragino-Lightest": HiraginoLightest
    });
    this.setState({ fontLoaded: true })
  }
  render() {
    return this.state.fontLoaded && (<Rollo />)
  }
}

