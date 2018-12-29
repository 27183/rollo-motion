// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const admin = require('firebase-admin');

/*
  set environment variables via terminal
  $ firebase functions:config:set twilio.account=<accountSid> twilio.token=<authToken> twilio.from=<your from number>
*/
const config = functions.config();
const twilio = require('twilio')(config.twilio.account, config.twilio.token);

/*
  Now you need to download a private cert (service-account.json)
  https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app
  and add add it to your /functions directory (don't forget to .gitignore it)
*/
const serviceAccount = require('./service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://rollo-motion-658bb.firebaseio.com',
});

// Looks for user by phone number. If found (new log in), sends
// verfication. If not found (new sign up), creates new user and
// sends verification

exports.logInWithPhoneNumber = functions.https.onRequest((req, res) => {
    const { phone } = req.body.data;

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

    const sendError = error => res.status(422).send(error);

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
                .then(() => res.send({ success: true }))
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
    console.log("here's the req.body", req.body)
    const sendError = error => res.status(422).send({ error: error.message });

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
        .then(token => res.send({ token }))
        .catch(sendError);
});