import { Avatar, Button, Card, DatePicker, Layout, List, notification } from "antd";
import { CardAction, useOrder } from "../hooks/useCart";
import { useState } from "react";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import axiosClient from "../api/AxiosClient";
import type { NotificationPlacement } from 'antd/es/notification/interface';

export const Cart = () => {
    const [order, changeOrder] = useOrder()
    const [date, setDate] = useState<any>([])
    const [api, contextHolder] = notification.useNotification();

    const disabledDate: any = (current: any) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const datesDiff = () => {
        if (date.length === 2) {
            return date[1].diff(date[0], 'day')
        }
        return 1
    }

    const sumPrice = () => {
        let sum = 0
        for (const item of order) {
            sum += (item as any).price * datesDiff()
        }
        return sum
    }

    const finsih = () => {
        axiosClient.post('/bookings/list', {
            tools: order.map((i: any) => i.id),
            date_start: date[0].format('YYYY-MM-DD'),
            date_end: date[1].format('YYYY-MM-DD')
        })
            .then((_) => {
                localStorage.removeItem('order')
                window.location.reload()
            })
            .catch(() => {
                api.error({
                    message: `Ups!`,
                    description: 'Coś poszło nie tak',
                    placement: 'topRight',
                });
            })
    }

    const { RangePicker } = DatePicker;
    return (
        <Layout style={{ width: '100%' }}>
            {contextHolder}
            <RangePicker style={{ margin: '4px 10%' }} onChange={(dates, _) => setDate(dates)} disabledDate={disabledDate} />
            <List
                itemLayout="vertical"
                size="large"
                dataSource={order}
                renderItem={(item: any) => (
                    <List.Item
                        key={item.title}
                        extra={
                            <img
                                width={128}
                                alt="logo"
                                src={item.image_url}
                            />
                        }
                    >
                        <List.Item.Meta
                            title={item.label}
                            description={item.description}
                        />
                        <p>Za dobę: {item.price} zł</p>
                        <Button onClick={() => changeOrder(item, CardAction.remove)} danger>Usuń</Button>
                    </List.Item>
                )}
            />
            {date.length === 2 ?
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Card headStyle={{ textAlign: 'center' }} title="Podsumowanie" bordered={false} style={{ width: 300 }}>
                        <div>Ilość dni: {datesDiff() !== 0 ? datesDiff() : 1}</div>
                        <div>Należność: {sumPrice()}</div>
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '16px' }}>
                            <Button onClick={finsih} type="primary">
                                Rezerwuj
                            </Button>
                        </div>
                    </Card>
                </div>
                : <> </>}
        </Layout>
    )
}