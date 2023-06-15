import Cookies from "js-cookie";

export interface User {
    expires_at: number
    access_token: string
    refresh_token: string
    error: string
}

const fetcher = async (url: string, body: object) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(body => {
            if (body.data) {
                body.data.expires_at = Date.now() + body.data.expires
                Cookies.set("currentUser", JSON.stringify(body.data));
                return body.data as User;
            }

            if (body.errors && body.errors[0].message === "\"otp\" is required"){
                return { error: "missing otp"} as User
            }
            
            if (body.errors && body.errors[0].message === "\"otp\" is invalid"){
                return { error: "The one-time password provided is invalid, please try again."} as User
            }

            return { error: "We couldn't find an account with that email and password. Check your credentials and try again." } as User
        })
}

export const login = async (email: string, password: string, otp?: string) => {

    return fetcher('/api/login', {
        email: email,
        password: password,
        otp: otp
    })
}

export const logout = async () => {
    Cookies.remove("currentUser")
}

export const refreshLogin = async (user: User) => {
    return fetcher('/api/relogin', {
        refresh_token: user.refresh_token
    })

}

export const getLoggedState = async () => {
    const currentUser: User = JSON.parse(Cookies.get("currentUser") || '{}')

    if (currentUser.access_token){
        if (Date.now() > currentUser.expires_at){
            const newUser = await refreshLogin(currentUser)
            if (!newUser.error){
                return true
            }
        } else {
            return true
        }
    }
    return false
}