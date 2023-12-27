import React, { useState } from 'react'
import { NavbarComponent } from '../../component/NavbarComponent/NavbarComponent'
import { Button, Card, Pagination, Row, Space, Select, Checkbox, Collapse } from 'antd'
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
    const [selectedSort, setSelectedSort] = useState('')
    const [panigate, setPanigate] = useState({
        pageCurrent: 0,
        page: 0,
        limit: 4,
        total: 0
    })
    const location = useLocation()
    const handleChange = (value) => {
        setSelectedSort(value);
    };
    const fetchProductType = async (type, page, limit) => {
        const res = await ProductService.getTypeProduct(type, page, limit)
        setStateProductType(res)
        // setPanigate({
        //     ...panigate,
        //     pageCurrent: res?.pageCurrent,
        //     total: res?.totalPage
        // })
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
            pageCurrent: 0,
            page: 0,
            limit: 9,
            total: panigate?.total
        })
    }
    const handleDetailProduct = (id) => {
        navigate(`/product-detail/${id}`)
    }
    const originalData = stateProductType?.data || []; // Bảo đảm rằng data không phải là null hoặc undefined
    const sortedProducts = originalData.slice().sort((a, b) => b.selled - a.selled);
    const sortedPriceMin = originalData.slice().sort((a, b) => b.price - a.price);
    const sortedPriceMax = originalData.slice().sort((a, b) => a.price - b.price);
    const countProduct = (stateProductType?.data || []).length;

    const items = [
        {
            key: '1',
            label: 'Price',
            children: <p>
                <Checkbox>100-300</Checkbox>
            </p>,
        },
    ]
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
                        <Collapse style={{ marginRight: '20px', color: 'rgb(56,56,61)', fontSize: '18px', padding: '10px 0', borderBottom: '1px solid #ccc' }} defaultActiveKey={['1']} ghost items={items} />
                    </WrapperNavbar>
                    <div>
                        <WrapperSort>
                            <p className='textSp'>{countProduct} Sản phẩm</p>
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
                                            value: 'sales',
                                            label: 'Bán chạy nhất',
                                        },
                                        {
                                            value: 'min',
                                            label: 'Giá thấp đến cao',
                                        },
                                        {
                                            value: 'max',
                                            label: 'Giá cao đến thấp',
                                        },

                                    ]}
                                />
                            </div>
                        </WrapperSort>
                        <WrapperProduct className='navBarProduct' span={20}>
                            {selectedSort === "sales" ? sortedProducts?.map((product) => {
                                return (
                                    <Card
                                        onClick={() => handleDetailProduct(product?._id)}
                                        size='small'
                                        hoverable={true}
                                        style={{ width: 'calc(30% - 10px)', marginBottom: '10px', marginTop: '10px' }}
                                        cover={<img style={{ width: '100%', height: 'auto' }} alt="example" src={product?.image} />}
                                    >
                                        <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{product?.name}</p>
                                        <span style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {covertPrice(product.price)}
                                        </span>
                                    </Card>
                                )
                            }) : selectedSort === "max" ? sortedPriceMin?.map((product) => {
                                return (
                                    <Card
                                        onClick={() => handleDetailProduct(product?._id)}
                                        size='small'
                                        hoverable={true}
                                        style={{ width: 'calc(30% - 10px)', marginBottom: '10px', marginTop: '10px' }}
                                        cover={<img style={{ width: '100%', height: 'auto' }} alt="example" src={product?.image} />}
                                    >
                                        <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{product?.name}</p>
                                        <span style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {covertPrice(product.price)}
                                        </span>
                                    </Card>
                                )
                            }) : sortedPriceMax?.map((product) => {
                                return (
                                    <Card
                                        onClick={() => handleDetailProduct(product?._id)}
                                        size='small'
                                        hoverable={true}
                                        style={{ width: 'calc(30% - 10px)', marginBottom: '10px', marginTop: '10px' }}
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
                <div className='productMobile' style={{ margin: '10px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap' }}>
                        {selectedSort === "sales" ? sortedProducts?.map((product) => {
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
                        }) : selectedSort === "min" ? sortedPriceMax?.map((product) => {
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
                        }) : sortedPriceMin.map((product) => {
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
