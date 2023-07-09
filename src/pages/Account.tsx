import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Auth } from "./Auth";
import axiosClient from "../api/AxiosClient";
import { Content } from "antd/es/layout/layout";
import { Button, Card, Space } from "antd";

export const Account = () => {
    const [isAuth, tryToAuth] = useAuth();
    const [myInfo, setMyInfo] = useState<any>({})

    useEffect(() => {
        if (isAuth) {
            axiosClient.get('/me').then((response) => {
                if (response.status === 200) {
                    setMyInfo(response.data)
                }
            })
        }
    }, [isAuth])

    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('order')
        window.location.reload()
    }

    if (isAuth) {
        return (
            <Content style={{ margin: '24px 16px 0', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Card headStyle={{ textAlign: 'center' }} title="Konto" style={{ width: '80%' }}>
                    <Space size='small' style={{ display: 'flex', flexDirection: 'column', justifyItems: 'start', alignItems: 'start' }}>
                        <div>Imię: {myInfo.first_name}</div>
                        <div>Nazwisko: {myInfo.last_name}</div>
                        <div>Email: {myInfo.email}</div>
                        <Button onClick={logout} type="primary" size={'middle'} danger >
                            Wyloguj
                        </Button>
                    </Space>
                </Card>
            </Content>
        )
    }

    return <Auth />
}