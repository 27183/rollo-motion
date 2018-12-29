import firebase from "./Fire"
const database = firebase.database()


const updateUserName = (userId, name, email, imageUrl) => {
    return firestore.collection("users").doc(userId).set(name)
}

//update user name




//update user photo


