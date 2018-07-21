import * as firebase from "firebase";

// Initialize Firebase
const devConfig = {
  apiKey: "AIzaSyANLCNRKbyJgdaVmvJBrWHTIX6KHD1a-EI",
  authDomain: "choppy-c9325.firebaseapp.com",
  databaseURL: "https://choppy-c9325.firebaseio.com",
  projectId: "choppy-c9325",
  storageBucket: "choppy-c9325.appspot.com",
  messagingSenderId: "952312156055"
};

const prodConfig = {
  // apiKey: YOUR_API_KEY,
  // authDomain: YOUR_AUTH_DOMAIN,
  // databaseURL: YOUR_DATABASE_URL,
  // projectId: YOUR_PROJECT_ID,
  // storageBucket: "",
  // messagingSenderId: YOUR_MESSAGING_SENDER_ID
};

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const storageRef = firebase.storage();
const database = firebase.database();
const auth = firebase.auth();

export { auth, database, storageRef };
