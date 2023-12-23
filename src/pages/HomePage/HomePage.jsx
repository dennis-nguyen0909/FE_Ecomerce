import React, { useEffect, useRef, useState } from 'react'
import { TypeProduct } from '../../component/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperDivTextHover, WrapperProduct, WrapperTypeProduct } from './style'
import { SliderComponent } from '../../component/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.jpg'
import slider2 from '../../assets/images/slider2.jpg'
import slider3 from '../../assets/images/slider3.jpg'
import slider4 from '../../assets/images/slider4.jpg'
import { CardComponent } from '../../component/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent'
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';

export const HomePage = () => {
    // const arr = ['About Us', 'Cửa Hàng', 'Giảm giá', 'Liên hệ', 'Chăm sóc khách hàng']
    const searchProduct = useSelector((state) => state.product?.search)
    const searchDebounce = useDebounce(searchProduct, 1000)
    const [limit, setLimit] = useState(3)
    const [typeProduct, setTypeProduct] = useState([])


    const menuTypeProducts = (
        <Menu style={{ zIndex: 10000 }} >
            {typeProduct.map((type) => (
                <Menu.Item key={type} style={{ padding: '8px', width: '200px' }}>
                    <TypeProduct name={type} />
                </Menu.Item>
            ))}
        </Menu>
    );
    const fetchProduct = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = ''
        const res = await ProductService.getAllProduct(search, limit);
        return res;
    }
    const { data: products, isLoading } = useQuery({ queryKey: ['products', limit, searchDebounce], queryFn: fetchProduct, retryDelay: 1000, retry: 3 })
    const handleLoadMore = () => {
        setLimit((prev) => prev + 3)
    }
    const handleReset = () => {
        setLimit(3)
    }


    const fetchTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === 'Ok') {
            setTypeProduct(res?.data);
        }
    }
    useEffect(() => {
        fetchTypeProduct();
    }, [])
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '14px 0' }}>
                <div>
                    <Dropdown overlay={menuTypeProducts} placement="bottom">
                        <WrapperDivTextHover style={{ cursor: 'pointer' }}>
                            Sản Phẩm
                        </WrapperDivTextHover>
                    </Dropdown>
                </div>
                <div>
                    <WrapperDivTextHover style={{ color: 'rgb(255,116,109)' }}>Giảm Giá</WrapperDivTextHover>
                </div>

                <div>
                    <WrapperDivTextHover>
                        Chăm Sóc Khách Hàng
                    </WrapperDivTextHover>
                </div>
                <div>

                    <WrapperDivTextHover>Bộ sưu tập</WrapperDivTextHover>
                </div>

            </div >
            <div className='body' style={{ width: '100%', backgroundColor: "#fff" }}>

                <div id="container" style={{ height: 'fit-content' }}>
                    <SliderComponent arrImages={[slider1, slider2, slider3, slider4]} />
                    <div style={{
                        display: 'flex', justifyContent: 'center',
                        alignItems: 'center', margin: '20px 0', fontSize: '30px',
                    }}>Sản Phẩm Mới</div>

                    <LoadingComponent isLoading={isLoading}>
                        <WrapperProduct>
                            {products?.data ? (
                                products?.data.map((product) => (
                                    <CardComponent
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
                                ))
                            ) : (
                                <p>No products available</p>
                            )}
                        </WrapperProduct>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
                            {products?.total !== products?.data.length || !products?.totalPage === 1 ? (
                                < WrapperButtonMore type={'outline'} textButton={'Xem thêm'} styleButton={{
                                    border: '1px solid #ccc', color: 'black', width: '240px',
                                    height: '38px', borderRadius: '4px',
                                }}
                                    styleTextButton={{ fontWeight: '500' }} onClick={handleLoadMore}
                                />)
                                : (
                                    < WrapperButtonMore type={'outline'} textButton={'Trở về'} styleButton={{
                                        border: '1px solid #ccc', color: 'black', width: '240px',
                                        height: '38px', borderRadius: '4px',
                                    }}
                                        styleTextButton={{ fontWeight: '500' }} onClick={handleReset}
                                    />)
                            }
                        </div>
                    </LoadingComponent>
                    {/* <NavbarComponent /> */}
                </div>

            </div>
        </div >
    )
}
