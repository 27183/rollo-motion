import { firestore } from "./Fire"
// const database = api.database()


const updateUserInfo = (userId, name, email) => {
    return firestore.collection("users").doc(userId).update({ name, email })
}

export { updateUserInfo }

//update user name




//update user photo


