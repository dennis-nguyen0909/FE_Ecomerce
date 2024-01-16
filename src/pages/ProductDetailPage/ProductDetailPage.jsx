import React from 'react'
import { ProductDetailsComponent } from '../../component/ProductDetailsComponent/ProductDetailsComponent'
import { Flex } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { WrapperDiv } from './style'

export const ProductDetailPage = () => {
    // use usePrams get IdProduct on URL
    const idProduct = useParams()
    const navigate = useNavigate()

    return (
        <WrapperDiv>
            <h4 className='heading'>
                {/* <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang chủ </span > */}
                Chi tiết sản phẩm
            </h4>
            <ProductDetailsComponent idProduct={idProduct.id} />
        </WrapperDiv>
    )
}
