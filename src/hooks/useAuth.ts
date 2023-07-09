import { useEffect, useState } from "react"
import axiosClient from "../api/AxiosClient"

export const useAuth = (): any => {
    const [isAuth, setAuth] = useState(false)

    const tryToAuth = async (email: string, password: string) => {
        axiosClient.post('/tokens/', {
            email,
            password,
        }).then((response) => {
            if (response.status === 200) {
                localStorage.setItem('accessToken', response.data['access_token'])
                localStorage.setItem('refreshToken', response.data['refresh_token'])
                setAuth(true)
                window.location.reload()
            }
        })
    }

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            setAuth(true)
        }
    }, [localStorage.getItem('accessToken')])

    return [isAuth, tryToAuth]
}