import { async } from "@firebase/util";
import { signInWithPopup, GoogleAuthProvider, getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "../InstanceFiresbase";
import { SignIn as login, SignOut as logout } from './Auth.js'


const provider = new GoogleAuthProvider();
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

async function SignIn() {
    try {
        let userCredential = await signInWithPopup(auth, provider)
        const credential = GoogleAuthProvider.credentialFromResult(userCredential)
        login(userCredential.user, credential.accessToken)
    } catch (error) {
        console.log("error login")
        return false
    }
    return true
}

export { SignIn, SignOut }