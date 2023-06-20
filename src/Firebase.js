import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

//* Firebase Config
const firebaseConfig = {
  // TODO: Firebase config.
};

//* Required initializations for making auths
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

//* google authentication
const signInWithGoogle = async () => {
  try {
    // Function from firebase to create google authentication
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    // Creating reference to the database for user
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    // Adding follwings details to user specefic database for future use
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    //^ Handle error
    console.error(err);
    // alert(err.message);
  }
};

//* facebook authentication
const signInWithFacebook = async () => {
  try {
    // Function from firebase to create facebook authentication
    const res = await signInWithPopup(auth, facebookProvider);
    const user = res.user;
    // Creating reference to the database for user
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    // Adding follwings details to user specefic database for future use
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "facebook",
        email: user.email,
      });
    }
  } catch (err) {
    //^ Handle error
    console.error(err);
    // alert(err.message);
  }
};

//* Loging using email
const logInWithEmailAndPassword = async (email, password) => {
  try {
    // Function from firebase to Login using email
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Signed in
    console.log(userCredential.user);
    // ...
  } catch (err) {
    console.log(err);
    alert(err.code);
  }
};


//* regestration with email
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    // Function from firebase to create email authentication
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    // Adding follwings details to user specefic database for future use
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    //^ Handle error
    console.error(err);
    // alert(err.message);
  }
};

//* password reset
const sendPasswordReset = async (email) => {
  try {
    // Function from firebase to send password-reset-email
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    //^ Handle error
    console.error(err);
    // alert(err.message);
  }
};
const logout = () => {
  // Function from firebase to logOut-user
  signOut(auth);
};

//* Exporting apps
export {
  auth,
  db,
  storage,
  signInWithGoogle,
  signInWithFacebook,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};


// There is no diferent function for Log_In user using "Google" or "Facebook" as weather they Log_In or Sign_Up, they will end up in being the same account
