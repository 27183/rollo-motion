const functions = require('firebase-functions');
const admin = require('firebase-admin');

const config = functions.config();
const twilio = require('twilio')(config.twilio.account, config.twilio.token);

const serviceAccount = require('./service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://rollo-motion-658bb.firebaseio.com',
});

exports.logInWithPhoneNumber = functions.https.onRequest((req, res) => {
    const { phone } = req.body.data;
    console.log("here's the phone number", phone)
    admin
        .auth()
        .getUserByPhoneNumber(phone)
        .then(userRecord => sendSMSVerification(res, userRecord.uid, phone))
        .catch(error => {
            switch (error.code) {
                case 'auth/user-not-found':
                    return createUser();
                default:
                    return sendError(error);
            }
        });

    const createUser = () => {
        admin
            .auth()
            .createUser({
                phoneNumber: phone,
            })
            .then(({ uid }) => sendSMSVerification(res, uid, phone))
            .catch(sendError);
    };

    const sendError = error => {
        res.status(422).send(error);
    }

    const sendSMSVerification = (res, uid, phone) => {
        const code = Math.floor(Math.random() * 899999 + 100000);
        const expiration = Date.now() + 2 * 60000; // Expires in 2 minutes
        const verification = { code, expiration, valid: true };
        const setUser = message => {
            admin
                .firestore()
                .collection('users')
                .doc(uid)
                .set({ verification })
                .then(() => res.send({ success: true, data: "created" }))
                .catch(sendError);
        };
        twilio.messages
            .create({
                body: `Your rollo verification code is ${code}`,
                to: phone,
                from: config.twilio.from,
            })
            .then(setUser)
            .catch(sendError);
    };
});

exports.verifyToken = functions.https.onRequest((req, res) => {
    // Validate code and expiration time, ensuring that code hasn't been used before.
    // If matches, create custom auth token and then invalidate code
    const { code, phone } = req.body.data;
    const sendError = error => {
        res.status(422).send({ success: false, error: error.message });
    }
    const checkIfUserExists = (id) => {
        return admin
            .auth()
            .getUserByPhoneNumber(phone)
            .then(userRecord => {
                if (userRecord.displayName != null || userRecord.photoURL != null) {
                    console.log("user has logged in before")
                    return { id: id, stat: "user present" }
                } else {
                    console.log('new user signing in')
                    return { id: id, stat: "new user" }
                }
            })
    }

    admin
        .auth()
        .getUserByPhoneNumber(phone)
        .then(userRecord => {
            return admin
                .firestore()
                .collection('users')
                .doc(userRecord.uid)
                .get();
        })
        .then(doc => {
            if (!doc.exists) {
                return Promise.reject(new Error('custom/uid-not-found'));
            }

            const timeNow = Date.now();
            const { verification } = doc.data();
            let error = null;

            if (verification.code !== parseInt(code, 10)) {
                error = 'custom/code-does-not-match';
            } else if (!verification.valid) {
                error = 'custom/code-already-used';
            } else if (timeNow > verification.expiration) {
                error = 'custom/code-expired';
            }
            if (error) {
                return Promise.reject(new Error(error));
            }
            doc.ref.update({ 'verification.valid': false });
            return Promise.resolve(doc.id);
        })
        .then(uid => admin.auth().createCustomToken(uid))
        .then(token => checkIfUserExists(token))
        .then(obj => res.status(200).send({ success: true, data: obj }))
        .catch(sendError);
});

exports.updateUserInfo = functions.https.onRequest((req, res) => {
    const { displayName, phone, photoURL } = req.body.data;
    const filt = { displayName: displayName, phone: phone, photoURL: photoURL }
    console.log(filt)
    const removeEmpty = (obj) =>
        Object.keys(obj)
            .filter(k => obj[k] !== null && obj[k] !== undefined && obj[k] !== "")  // Remove undef. and null.
            .reduce((newObj, k) =>
                typeof obj[k] === 'object' ?
                    Object.assign(newObj, { [k]: removeEmpty(obj[k]) }) :  // Recurse.
                    Object.assign(newObj, { [k]: obj[k] }),  // Copy value.
                {});
    const updates = removeEmpty(filt)
    console.log("updates", updates)

    const sendError = error => {
        res.status(422).send({ error: error.message });
    }
    admin
        .auth()
        .getUserByPhoneNumber(phone)
        .then(userRecord => {
            admin
                .auth()
                .updateUser(userRecord.uid, updates)
        })
    admin
        .auth()
        .getUserByPhoneNumber(phone)
        .then(userRecord => {
            return admin
                .firestore()
                .collection('users')
                .doc(userRecord.uid)
                .update({ displayName, photoURL, userId: userRecord.uid })
                .then(() => res.send({ success: true, data: "updated" }))
                .catch(sendError);
        })
        .catch(sendError);
});

exports.requestRollos = functions.https.onRequest((req, res) => {
    const sendError = error => {
        res.status(422).send(error);
    }
    return admin
        .firestore()
        .collection("rollos")
        .where("status", "==", "inactive")
        .get()
        .then(snap => {
            var rollosArr = []
            snap.forEach(documentSnapshot => {
                rollosArr.push(documentSnapshot.data())
            })
            console.log(rollosArr)
            return rollosArr
        })
        .then((rollos) => res.status(200).send({ data: rollos }))
        .catch(sendError)
})




exports.confirmRide = functions.https.onRequest((req, res) => {
    //pass user id and location in req.body
    const { userId, location } = req.body.data
    console.log("(1) retrieve userId and location from req.body", userId, location)
    //distance formula to calculate distances between coordinates
    const distanceFormula = (rolloLocation, userLocation) => {
        return Math.sqrt(Math.pow((rolloLocation.location._latitude - userLocation.coords.latitude), 2) + Math.pow((rolloLocation.location._longitude - userLocation.coords.longitude), 2))
    }

    const sendError = error => {
        res.status(422).send(error);
    }

    return admin
        .firestore()
        .collection("rollos")
        .where("status", "==", "inactive")
        //retrive all inactive rollos
        .get()
        .then(snap => {
            var rollosArr = []
            snap.forEach(documentSnapshot => {
                rollosArr.push(documentSnapshot.data())
            })
            //add all inactive rollos to array for comparison with user location
            console.log("(2) retrieve all inactive rollos and store in array", rollosArr)
            if (rollosArr.length == 0) { res.status(200).send({ data: "no available rides!" }) }
            return rollosArr
            //return inactive rollos
        })
        .then(rollos => {
            return rollos.sort((a, b) => {
                return distanceFormula(a, location) - distanceFormula(b, location)
                //sort rollos in ascending order using distance formula
            })
        })
        .then(sortedRollos => {
            console.log("(3) sort retrieve rollos in order of their proximity", sortedRollos)
            return sortedRollos[0]
            //grab first element in newly sorted array (smallest distance)
        })
        .then(optimalRollo => {
            console.log("(4) pull the first rollo object from the array", optimalRollo)
            admin
                .firestore()
                .collection('users')
                .doc(userId)
                .update({ rolloId: optimalRollo.rolloId })
                .catch(sendError)
            //update user's rolloID to optimal rollo's ID    
            admin
                .firestore()
                .collection("rollos")
                .doc(optimalRollo.rolloId)
                .update({ userId: userId, status: "active" })
                .catch(sendError)
            //update rollo's userID to user's ID & status property to active
            return optimalRollo
        })
        .then((chosenRollo) => res.status(200).send({ data: chosenRollo }))
        //send back 200 status

        .catch(sendError)





})


