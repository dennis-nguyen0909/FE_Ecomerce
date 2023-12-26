import React, { useState } from 'react'
import { NavbarComponent } from '../../component/NavbarComponent/NavbarComponent'
import { Button, Card, Pagination, Row, Space, Select } from 'antd'
import { WrapperNavbar, WrapperProduct, WrapperRow, WrapperContainer, WrapperSort } from './style'
import { useLocation, useNavigate } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import { useEffect } from 'react'
import { CardComponentPageTypeProduct } from '../../component/CardComponentPageTypeProduct/CardComponent'
import Meta from 'antd/es/card/Meta'
import { StyleNameProduct, WrapperPriceText } from '../../component/CardComponentPageTypeProduct/style'
import { covertPrice } from '../../untils'
import { ButtonComponent } from '../../component/ButtonComponent/ButtonComponent'
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
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    const fetchProductType = async (type, page, limit) => {
        const res = await ProductService.getTypeProduct(type, page, 9)
        console.log(res)
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
    const handleReadMore = () => {
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
        <>

            <div style={{ padding: '0 40px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', borderBottom: '1px solid #ccc' }}>
                <p style={{ color: 'rgb(231,231,231)' }}>Home</p>
                <p>/ {location.state}</p>
            </div>
            <WrapperContainer >
                <WrapperRow className='productPc'>
                    <WrapperNavbar className='navBarLeft' span={4}>
                        <NavbarComponent types={type} />
                    </WrapperNavbar>
                    <div>
                        <WrapperSort>
                            <p className='textSp'>Sản phẩm</p>
                            <div className='textSort' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <p>Sắp xếp</p>
                                <Select
                                    defaultValue="Bán chạy nhất"
                                    style={{
                                        width: 200,
                                    }}
                                    onChange={handleChange}
                                    options={[
                                        {
                                            value: 'Bán chạy nhất',
                                            label: 'Bán chạy nhất',
                                        },
                                        {
                                            value: 'Giá thấp đến cao',
                                            label: 'Giá thấp đến cao',
                                        },
                                        {
                                            value: 'Giá cao đến thấp',
                                            label: 'Giá cao đến thấp',
                                        },

                                    ]}
                                />
                            </div>
                        </WrapperSort>
                        <WrapperProduct className='navBarProduct' span={20}>

                            {stateProductType?.data?.map((product) => {
                                return (
                                    <Card
                                        onClick={() => handleDetailProduct(product?._id)}
                                        size='small'
                                        hoverable={true}
                                        style={{ width: 'calc(30% - 10px)', marginBottom: '10px' }}
                                        cover={<img style={{ width: '100%', height: 'auto' }} alt="example" src={product?.image} />}
                                    >
                                        <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{product?.name}</p>
                                        <span style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {covertPrice(product.price)}
                                        </span>
                                    </Card>
                                )
                            })}
                        </WrapperProduct>
                    </div>

                </WrapperRow>
                <div className='productMobile' >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap' }}>
                        {stateProductType?.data?.map((product) => {
                            return (
                                <Card
                                    onClick={() => handleDetailProduct(product?._id)}
                                    size='small'
                                    hoverable={true}
                                    style={{ width: 'calc(50% - 10px)', marginBottom: '10px' }}
                                    cover={<img style={{ width: '100%', height: 'auto' }} alt="example" src={product?.image} />}
                                >
                                    <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{product?.name}</p>
                                    <span style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {covertPrice(product.price)}
                                    </span>
                                </Card>
                            )
                        })}
                        <ButtonComponent
                            size={'40'}
                            onClick={handleReadMore}
                            styleButton={{
                                backgroundColor: "rgb(71,71,76)",
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: "12px",
                                margin: "20px 0"
                            }}
                            textButton={"Xem thêm"}
                            styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                        >
                        </ButtonComponent>
                    </div>
                </div>
                <div className='panigate'>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {panigate?.pageCurrent !== panigate?.total && <Button onClick={handleEndPage}>Cuối Trang </Button>}
                        <Pagination showQuickJumper={panigate?.pageCurrent === panigate?.total ? false : true} pageSize={panigate?.limit} current={panigate.pageCurrent} total={panigate?.total + 10} onChange={onChange} disabled={panigate?.pageCurrent === panigate?.total} />
                        {panigate?.pageCurrent === panigate?.total && <Button onClick={handleReturn}>Trở về </Button>}
                    </div>
                </div>
            </WrapperContainer>
        </>
    )
}
