import React, { useState } from 'react'
import { NavbarComponent } from '../../component/NavbarComponent/NavbarComponent'
import { Button, Card, Pagination, Row } from 'antd'
import { WrapperNavbar, WrapperProduct, WrapperRow } from './style'
import { useLocation, useNavigate } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import { useEffect } from 'react'
import { CardComponentPageTypeProduct } from '../../component/CardComponentPageTypeProduct/CardComponent'
import Meta from 'antd/es/card/Meta'
import { StyleNameProduct, WrapperPriceText } from '../../component/CardComponentPageTypeProduct/style'
import { covertPrice } from '../../untils'
export const TypeProductPage = () => {
    const [stateProductType, setStateProductType] = useState([])
    const [type, setType] = useState([])
    const navigate = useNavigate()
    const [panigate, setPanigate] = useState({
        pageCurrent: 0,
        page: 0,
        limit: 4,
        total: 0
    })
    const location = useLocation()

    const fetchProductType = async (type, page, limit) => {
        const res = await ProductService.getTypeProduct(type, page, limit)
        setStateProductType(res)
        setPanigate({
            ...panigate,
            pageCurrent: res?.pageCurrent,
            total: res?.totalPage
        })
    }
    useEffect(() => {
        if (location.state) {
            fetchProductType(location.state, panigate.page, panigate.limit)
        }
    }, [location.state, panigate.page, panigate.limit])
    const fetchAllProductType = async () => {
        const res = await ProductService.getAllTypeProduct();
        setType(res?.data);
    }
    useEffect(() => {
        fetchAllProductType();
    }, [])
    const onChange = (current, pageSize) => {
        setPanigate({ ...panigate, page: current - 1, limit: pageSize })
    }
    const handleReturn = () => {
        setPanigate({
            pageCurrent: 0,
            page: 0,
            limit: 4,
            total: panigate?.total
        })
    }
    const handleEndPage = () => {
        setPanigate({
            pageCurrent: panigate?.total,
            page: 0,
            limit: 4,
            total: panigate?.total
        })
    }
    const handleDetailProduct = (id) => {
        navigate(`/product-detail/${id}`)
    }
    return (
        <div style={{ padding: '0 40px', background: '#efefef' }}>
            <WrapperRow>
                <WrapperNavbar style={{}} className='navBarLeft' span={4}>
                    <NavbarComponent types={type} />
                </WrapperNavbar>
                <WrapperProduct className='navBarProduct' span={20}>
                    {stateProductType?.data?.map((product) => {
                        return (
                            <CardComponentPageTypeProduct
                                id={product._id}
                                key={product._id}
                                countInStock={product.countInStock}
                                description={product.description}
                                image={product.image}
                                name={product.name}
                                price={product.price}
                                rating={product.rating}
                                type={product.type}
                                discount={product.discount}
                                selled={product.selled}

                            />
                        )
                    })}
                </WrapperProduct>
                <WrapperProduct className='navbarMobile' span={20}>
                    {stateProductType?.data?.map((product) => {
                        console.log(product)
                        return (
                            <Card
                                onClick={() => handleDetailProduct(product?._id)}
                                size='small'
                                hoverable={true}
                                style={{ width: 105 }}
                                cover={<img alt="example" src={product?.image} />}
                            >
                                <p style={{ fontSize: '10px' }}>{product?.name}</p>

                                <span style={{ marginRight: '10px', fontSize: '10px' }}>
                                    {covertPrice(product.price)}
                                </span>

                            </Card>
                        )
                    })}
                </WrapperProduct>
            </WrapperRow>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {panigate?.pageCurrent !== panigate?.total && <Button onClick={handleEndPage}>Cuối Trang </Button>}
                <Pagination showQuickJumper={panigate?.pageCurrent === panigate?.total ? false : true} pageSize={panigate?.limit} current={panigate.pageCurrent} total={panigate?.total + 10} onChange={onChange} disabled={panigate?.pageCurrent === panigate?.total} />
                {panigate?.pageCurrent === panigate?.total && <Button onClick={handleReturn}>Trở về </Button>}
            </div>
        </div>
    )
}
