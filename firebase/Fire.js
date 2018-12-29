// ./Fire.js

const firebase = require('firebase');
require('firebase/firestore');
// Required for side-effects
require("firebase/functions");

firebase.initializeApp({
    apiKey: "AIzaSyByfRPHb_cUaVBqlASjY05uOwqCBc73LAo",
    authDomain: "rollo-motion-658bb.firebaseapp.com",
    databaseURL: "https://rollo-motion-658bb.firebaseio.com",
    projectId: "rollo-motion-658bb",
    storageBucket: "rollo-motion-658bb.appspot.com",
    messagingSenderId: "654821619058"
});
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase

