const user = () => JSON.parse(sessionStorage.getItem("auth_user"))

const token = () => JSON.parse(sessionStorage.getItem("auth_token"))

const SignOut = () => {
    sessionStorage.removeItem("auth_user")
    sessionStorage.removeItem("auth_token")
}

const SignIn = (user, token = null) => {
    sessionStorage.setItem("auth_user", JSON.stringify(user))
    sessionStorage.setItem("auth_token", JSON.stringify(token))
}

const hasLogin = () => user() != null

export { user, token, hasLogin, SignOut, SignIn }