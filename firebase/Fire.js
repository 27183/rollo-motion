// ./Fire.js

import * as firebase from "firebase"
import "firebase/firestore"
import "firebase/functions"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyByfRPHb_cUaVBqlASjY05uOwqCBc73LAo",
    authDomain: "rollo-motion-658bb.firebaseapp.com",
    databaseURL: "https://rollo-motion-658bb.firebaseio.com",
    projectId: "rollo-motion-658bb",
    storageBucket: "rollo-motion-658bb.appspot.com",
    messagingSenderId: "654821619058"
});

const firestore = firebaseApp.firestore()
const auth = firebaseApp.auth()
const functions = firebaseApp.functions()
const storage = firebaseApp.storage()

firestore.settings({ timestampsInSnapshots: true })
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)



export { firestore, auth, functions, storage }

