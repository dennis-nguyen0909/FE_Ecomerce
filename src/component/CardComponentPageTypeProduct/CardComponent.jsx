
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperPriceText } from './style'
import { useNavigate } from 'react-router-dom'
import { covertPrice } from '../../untils'
export const CardComponentPageTypeProduct = (props) => {
    const navigate = useNavigate()
    const { countInStock, description, image, price, name, rating, type, discount, selled, id, width } = props;
    const handleDetailProduct = (id) => {
        navigate(`/product-detail/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable={true}
            headStyle={{ width: "100px", height: "50px" }}
            bodyStyle={{ padding: "10px" }}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailProduct(id)}
        >
            <StyleNameProduct>{name}</StyleNameProduct>
            {/* <WrapperReportText>
                <span style={{ marginRight: "4px" }}>
                    <span>{rating}</span>
                    <StarFilled style={{ fontSize: "12px", color: "yellow" }} />
                </span>
                <span>Đã bán | 100+</span>
            </WrapperReportText> */}
            <WrapperPriceText>
                <span style={{ marginRight: '10px' }}>
                    {covertPrice(price)}
                </span>
                {/* <WrapperDiscountText>{discount || -5} %</WrapperDiscountText> */}
            </WrapperPriceText>
        </WrapperCardStyle>
    )
}
