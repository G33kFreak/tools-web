import { Button, Card, Checkbox, Form, Input, Radio, RadioChangeEvent } from "antd"
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axiosClient from "../api/AxiosClient";

const SignIn = () => {
    const [isAuth, tryToAuth] = useAuth()

    const onFinish = (data: any) => {
        tryToAuth(data.email, data.password)
    }

    return (
        <Card headStyle={{ textAlign: 'center' }} title="Zaloguj się" style={{ width: '80%' }}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={() => { }}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Email jest wymagany' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Hasło"
                    name="password"
                    rules={[{ required: true, message: 'Hasło jest wymagane' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 16 }}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Zaloguj
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

const SignUp = () => {
    const [showCode, setShowCode] = useState(false)
    const [email, setEmail] = useState('')

    const sendData = (data: any) => {
        axiosClient.post('/auth/register', {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password: data.password,
        })
            .then(() => {
                setEmail(data.email)
                setShowCode(true)
            })
    }

    const sendCode = (data: any) => {
        axiosClient.post('/auth/confirm', {
            email: email,
            token: data.code
        })
            .then(() => window.location.reload())
    }

    return (
        <Card headStyle={{ textAlign: 'center' }} title="Potwiedz email" style={{ width: '80%' }}>
            {showCode ? <>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 4 }}
                    initialValues={{ remember: true }}
                    onFinish={sendCode}
                    onFinishFailed={() => { }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Wprowadź kod"
                        name="code"
                        rules={[{ required: true, message: 'Kod jest wymagany' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Zarejestruj
                        </Button>
                    </Form.Item>
                </Form>
            </> :
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={sendData}
                    onFinishFailed={() => { }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Email jest wymagany' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Imię"
                        name="firstName"
                        rules={[{ required: true, message: 'Imię jest wymagane' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Nazwisko"
                        name="lastName"
                        rules={[{ required: true, message: 'Nazwisko jest wymagane' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Hasło"
                        name="password"
                        rules={[{ required: true, message: 'Hasło jest wymagane' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Zarejestruj
                        </Button>
                    </Form.Item>
                </Form>
            }
        </Card>
    )
}

export const Auth = () => {
    enum Options { signIn, signUp }
    const [mode, setMode] = useState<Options>(Options.signIn);

    const handleModeChange = (e: RadioChangeEvent) => {
        setMode(e.target.value);
    };
    return (
        <Content style={{ margin: '24px 16px 0', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: "flex", justifyContent: 'center' }}>
                <Radio.Group onChange={handleModeChange} value={mode} style={{ marginBottom: 8 }}>
                    <Radio.Button value={Options.signIn}>Logowanie</Radio.Button>
                    <Radio.Button value={Options.signUp}>Rejestracja</Radio.Button>
                </Radio.Group>
            </div>
            {mode === Options.signIn ? <SignIn /> : <SignUp />}
        </Content>
    )
}