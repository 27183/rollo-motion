import React, { Component } from 'react';
import { createDrawerNavigator, createStackNavigator, DrawerItems, Dimensions, NavigationActions, createAppContainer } from "react-navigation"
import { MapView, DrawerView, styles, SettingsView } from "./src"
import { View } from "react-native"
import { Font } from 'expo';
const Hiragino = require("./assets/hiragino.otf")
const HiraginoLighter = require("./assets/hiragino-lighter.otf")
const HiraginoLightest = require("./assets/hiragino-lightest.otf")
import Loader from './src/Loader/Loader';

const Rollo = createAppContainer(createDrawerNavigator({
  MapView: { screen: MapView },
  SettingsView: { screen: SettingsView }
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
      appReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Hiragino': Hiragino,
      "Hiragino-Lighter": HiraginoLighter,
      "Hiragino-Lightest": HiraginoLightest
    });
    this.setState({ fontLoaded: true })
    setTimeout(() => {
      this.setState({
        appReady: true,
      });
    }, 1500);
  }
  render() {
    return this.state.fontLoaded && (
      <Loader
        isLoaded={this.state.appReady}
        imageSource={require('./assets/rollo_logo.png')}
        backgroundStyle={{ backgroundColor: "#33aadc" }}
      >
        <Rollo />
      </Loader>
    )
  }
}

