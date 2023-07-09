import { Card } from 'antd';

export const ToolsItem = (props: any) => {
    const { item } = props
    const { Meta } = Card;

    return (
        <Card
            onClick={props.onClick}
            hoverable
            style={{ width: 240 }}
            cover={<img src={item.image_url} />}
        >
            <Meta title={item.label} description={`Dostępne: ${item.available}`} />
            <Meta description={`Za dobę: ${item.price} zł`} />
        </Card>
    )
}