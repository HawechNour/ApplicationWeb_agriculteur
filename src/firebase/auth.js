import { auth , firestore } from "./firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  updateEmail,
  verifyBeforeUpdateEmail,
  getAuth,
  reauthenticateWithCredential
} from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth/cordova";


import { doc, setDoc } from "firebase/firestore";

export const doCreateUserWithEmailAndPassword = async (email,
  password,
  fullName,
  phoneNumber,
  ville,
  pays,
  devise) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
  
      // Store additional user data in Firestore
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        fullName: fullName,
        phoneNumber: phoneNumber,
        ville: ville,
        pays: pays,
        devise: devise
      });
  
      return userCredential.user;
    } catch (error) {
      throw error;
    }
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};


export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = async (password,newPassword) => {
  const {currentUser} = getAuth()
  try {
    // Reauthenticate user
    const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
    );

    await reauthenticateWithCredential(currentUser, credential);

    // Sign in again with email and password
    const userCredential = await signInWithEmailAndPassword(currentUser.auth, currentUser.email, password);

    // Update email address
    await updatePassword(userCredential.user, newPassword);

    return { success: true, message: 'Password updated successfully!' };
} catch (error) {
    return { success: false, message: error.message };
}
};
export const doEmailChange = async (email,password) => {
  const {currentUser} = getAuth()
  try {
    // Reauthenticate user
    const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
    );

    await reauthenticateWithCredential(currentUser, credential);

    // Sign in again with email and password
    const userCredential = await signInWithEmailAndPassword(currentUser.auth, currentUser.email, password);

    // Update email address
    await updateEmail(userCredential.user, email);

    return { success: true, message: 'Email address updated successfully!' };
} catch (error) {
    return { success: false, message: error.message };
}
};
export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/dashboard`,
  });
};
