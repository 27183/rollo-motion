import React, { Component } from 'react';
import styles from "./styles"
import { SafeAreaView, createDrawerNavigator, createStackNavigator, DrawerItems, Dimensions, NavigationActions, createAppContainer } from "react-navigation"
import MapScreen from "./MapScreen"
import CustomDrawerComponent from "./CustomDrawer"

const Rollo = createDrawerNavigator({
  MapScreen: { screen: MapScreen },
},
  {
    drawerPosition: "left",
    initialRouteName: "MapScreen",
    drawerBackgroundColor: "white",
    drawerWidth: 300,
    contentComponent: CustomDrawerComponent,
  },
)


export default createAppContainer(Rollo)