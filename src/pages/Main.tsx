import { useEffect, useState } from 'react'
import './Main.css'
import axiosClient from '../api/AxiosClient'
import { ToolsItem } from '../components/ToolsItem'
import { Button, Card, Layout, Modal, Space, notification } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import Menu from 'antd/es/menu/menu'
import Sider from 'antd/es/layout/Sider'
import { ShoppingFilled, UserOutlined, ToolFilled, WalletFilled } from '@ant-design/icons';
import React from 'react'
import { Account } from './Account'
import Meta from 'antd/es/card/Meta'
import { useAuth } from '../hooks/useAuth'
import { CardAction, useOrder } from '../hooks/useCart'
import { Cart } from './Cart'
import { Bookings } from './Bookings'

export const Main = () => {
    const [toolsItems, setToolsItems] = useState([])
    const [selectedNavItem, setNavItem] = useState('1')
    const [modalIsOpen, setModalOpen] = useState<any>({ isOpen: false, item: null })
    const [isAuth, tryToAuth] = useAuth()
    const [order, changeOrder] = useOrder()
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        setNavItem(sessionStorage.getItem('navItem') ?? '1')
    }, [])

    const onNavChanged = (newNavValue: any) => {
        sessionStorage.setItem('navItem', newNavValue.key)
        setNavItem(newNavValue.key)
    }

    const content = () => <>
        <Content style={{ margin: '24px 16px 0', height: '100%' }}>
            <Space style={{ display: 'flex', flexWrap: 'wrap' }} size={'large'}>
                {toolsItems.map((tool: any) => <ToolsItem item={tool} key={tool.id} onClick={() => setModalOpen({
                    isOpen: true,
                    item: tool,
                })} />)}
            </Space>
        </Content>
    </>

    const NAV_ITEMS = [
        {
            icon: UserOutlined,
            label: 'Konto',
            item: <Account />,
            authOnly: false,
        },
        {
            icon: ToolFilled,
            label: 'Lista sprzętu',
            item: content(),
            authOnly: false,
        },
        {
            icon: ShoppingFilled,
            label: 'Koszyk',
            item: <Cart />,
            authOnly: true,
        },
        {
            icon: WalletFilled,
            label: 'Zarezerwowane',
            item: <Bookings />,
            authOnly: true,
        },
    ]

    useEffect(() => {
        axiosClient.get('/tools/list')
            .then((response) => {
                setToolsItems(response.data.results)
            })
    }, [])

    const onAddToCart = () => {
        if (modalIsOpen.available > 0) {
          changeOrder(modalIsOpen.item, CardAction.add)
          setModalOpen({ isOpen: false, item: null })
        } else {
            api.error({
                message: `Niedostępne`,
                description: 'Nie zostało dostępnych na magazynie',
                placement: 'topRight',
            });
        }
    }

    return (
        <Layout style={{ width: '100%', minHeight: '100vh' }}>
            {contextHolder}
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div style={{ width: 120, height: 120, color: '#fff', display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: 'bold' }} >ToolsApp</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={NAV_ITEMS.filter((i) => !i.authOnly || isAuth).map(
                        (navItem, index) => ({
                            key: String(index),
                            icon: React.createElement(navItem.icon),
                            label: navItem.label,
                        }),
                    )}
                    onSelect={onNavChanged}
                    selectedKeys={[selectedNavItem]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0 }} />
                {NAV_ITEMS[Number.parseInt(selectedNavItem)].item}
                <Footer style={{ textAlign: 'center' }}>Created by Tomasz Sas ©2023 </Footer>
            </Layout>
            <Modal
                open={modalIsOpen.isOpen}
                onCancel={() => setModalOpen({ isOpen: false, item: null })}
                footer={[
                    isAuth ?
                        <Button onClick={onAddToCart} key="submit" type="primary">
                            Dodaj do koszyka
                        </Button> : <p>Zaloguj się lub załóz konto, aby zarezerwować</p>,
                ]}
            >
                {modalIsOpen.item != null ?
                    <Card
                        style={{ width: '100%' }}
                        cover={<img src={modalIsOpen.item.image_url} />}
                    >
                        <Meta title={modalIsOpen.item.label} description={`Dostępne: ${modalIsOpen.item.available}`} />
                        <Meta description={`Za dobę: ${modalIsOpen.item.price} zł`} />
                        <Meta description={modalIsOpen.item.description} />
                    </Card>
                    : <></>}
            </Modal>
        </Layout>
    )
}