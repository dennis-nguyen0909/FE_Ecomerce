import React from 'react'
import { ProductDetailsComponent } from '../../component/ProductDetailsComponent/ProductDetailsComponent'
import { Flex } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

export const ProductDetailPage = () => {
    // use usePrams get IdProduct on URL
    const idProduct = useParams()
    const navigate = useNavigate()

    return (
        <div style={{ padding: '0 120px', height: 'fit-content' }}>
            <h4>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang chủ  </span >
                Chi tiết sản phẩm
            </h4>
            <ProductDetailsComponent idProduct={idProduct.id} />
        </div>
    )
}
