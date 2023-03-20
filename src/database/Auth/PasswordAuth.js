import { async } from "@firebase/util";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, signOut, updateProfile } from "firebase/auth";
import { firebaseApp } from "../InstanceFiresbase";
import { SignOut as logout, SignIn as login } from './Auth.js'
import {
    firebaseFirestore,
} from "../InstanceFiresbase";

import { setDoc, doc } from "firebase/firestore";

const auth = getAuth()

async function SignOut() {
    try {
        await signOut(auth)
        logout()
    } catch (error) {
        console.log("error-logout")
        return false
    }
    return true
}

async function SignIn(email, password) {
    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password)
        login(userCredential.user)
    } catch (error) {
        console.log("error login")
        return false
    }
    return true
}

async function CreateAccount(email, password) {
    try {
        const userCre = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCre.user
        await SignIn(email, password)
        await AddUsers(email, user)
    } catch (error) {
        console.log("error login")
        return false
    }
    return true
}

async function AddUsers(email, user) {


    try {
        const docRef = await doc(firebaseFirestore, "users", user.uid);
        const username = email.substring(0, email.indexOf('@'))
        await updateProfile(user, {
            displayName: username,
            photoURL: "https://firebasestorage.googleapis.com/v0/b/goodsman-1dd35.appspot.com/o/productImages%2Feweqw%2Fuser-icon.png?alt=media&token=e7d1ad3b-fadc-4f84-a4af-090a98e197c0"
        })
        await setDoc(docRef, {
            uid: user.uid,
            email: email,
            name: username,
            role: "user",
            urlImg: "https://firebasestorage.googleapis.com/v0/b/goodsman-1dd35.appspot.com/o/productImages%2Feweqw%2Fuser-icon.png?alt=media&token=e7d1ad3b-fadc-4f84-a4af-090a98e197c0"
        });
    } catch (error) {

        console.log(error.message)
    }
};

export { SignIn, SignOut, CreateAccount }