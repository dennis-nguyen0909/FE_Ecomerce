import { Card, Slider } from 'antd'
import Meta from 'antd/es/card/Meta'
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText } from './style'
import { StarFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { covertPrice } from '../../untils'
export const CardComponent = (props) => {
    const navigate = useNavigate()
    const { countInStock, description, image, price, name, rating, type, discount, selled, id } = props;
    const handleDetailProduct = (id) => {
        navigate(`/product-detail/${id}`)
    }
    
    // const formattedPrice = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: "100px", height: "100px" }}
            bodyStyle={{ padding: "10px" }}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailProduct(id)}
        >
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: "4px" }}>
                    <span>{rating}</span>
                    <StarFilled style={{ fontSize: "12px", color: "yellow" }} />
                </span>
                {selled > 0 ? <span>Đã bán {selled}</span> : <span>Đã bán 0</span>}
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '10px' }}>
                    {covertPrice(price)}
                </span>
                <WrapperDiscountText>{discount || -5} %</WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
    )
}
