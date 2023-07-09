import { useEffect, useState } from "react"

const loadOrderFromStorage = () => {
    const storageValue = localStorage.getItem('order')

    if (storageValue) {
        return JSON.parse(storageValue)
    }
    return []
}

export enum CardAction {
    add, remove
}

export const useOrder = () => {
    const [order, setOrder] = useState(() => loadOrderFromStorage())

    const changeOrder = (product: any, action: CardAction) => {
        if (action === CardAction.remove) {
            const objWithIdIndex = order.findIndex((obj: any) => obj.id === product.id);
            if (objWithIdIndex !== -1) {
                const newOrder = order.filter((obj: any) => obj.id !== product.id);
                setOrder(newOrder)
                localStorage.setItem('order', JSON.stringify(newOrder))
            }
        }

        if (action === CardAction.add) {
            const ordersFromStore: any = loadOrderFromStorage()
            const objWithIdIndex = ordersFromStore.findIndex((obj: any) => obj.id === product.id);
            if (objWithIdIndex === -1) {
                const newArray = [...ordersFromStore, product]
                setOrder(newArray)
                localStorage.setItem('order', JSON.stringify(newArray))
            }
        }
    }

    return [order, changeOrder]
}