import { Layout, List } from "antd"
import { useEffect, useState } from "react"
import axiosClient from "../api/AxiosClient"

export const Bookings = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        axiosClient.get('/bookings/list').then((res) => {
            setData(res.data.results);
        })
    }, [])

    return (
        <Layout style={{ width: '100%' }}>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={data}
                renderItem={(item: any) => (
                    <List.Item
                        key={item.id}
                    >
                        <List.Item.Meta
                            title={`${item.date_start} - ${item.date_end}`}
                            description={`Numer: ${item.id}`}
                        />
                        <p>Status: {item.is_verified ? 'Zaakceptowany' : 'Oczekujący'}</p>
                    </List.Item>
                )}
            />
        </Layout>
    )
}