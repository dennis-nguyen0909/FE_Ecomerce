import React, { useEffect, useRef, useState } from 'react'
import { TypeProduct } from '../../component/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperDivNav, WrapperDivTextHover, WrapperProduct, WrapperDiv } from './style'
import { SliderComponent } from '../../component/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/1.jpeg'
import slider2 from '../../assets/images/2.jpeg'
import slider3 from '../../assets/images/3.jpeg'
import slider4 from '../../assets/images/4.jpeg'
import slider5 from '../../assets/images/5.jpeg'
import slider6 from '../../assets/images/6.jpeg'
import { CardComponent } from '../../component/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent'
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Skeleton, Space } from 'antd';
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../component/Footer/Footer'

export const HomePage = () => {
    // const arr = ['About Us', 'Cửa Hàng', 'Giảm giá', 'Liên hệ', 'Chăm sóc khách hàng']
    const searchProduct = useSelector((state) => state.product?.search)
    const searchDebounce = useDebounce(searchProduct, 1000)
    const [limit, setLimit] = useState(9)
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
        setLimit((prev) => prev + 9)
    }
    const handleReset = () => {
        setLimit(3)
    }

    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1); // Bắt đầu từ trang đầu tiên
    const [product2, setProduct2] = useState([]);
    const elementRef = useRef(null);

    function onIntersection(entries) {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore) {
            fetchMoreProduct();
        }
    }

    const fetchMoreProduct = async () => {
        const search = '';
        const res = await ProductService.getAllProduct(search, page, limit); // Chuyển trang vào API
        if (res.totalPage === 1) {
            setHasMore(false);
        } else {
            setProduct2((prev) => [prev, ...res.data]);
            setPage((prev) => prev + 1); // Tăng số trang
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection);
        if (observer && elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, [product2]); // Thêm page vào dependency array để useEffect cập nhật khi page thay đổi
    const fetchTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === 'Ok') {
            setTypeProduct(res?.data);
        }
    }
    useEffect(() => {
        fetchTypeProduct();
    }, [])
    const navigate = useNavigate();
    const handleNavigatePageSales = () => {
        navigate('/product-sales')
    }
    const handleNavigatePageSupport = () => {
        navigate('/support')
    }
    console.log(product2)
    return (
        <>
            <WrapperDiv>
                <WrapperDivNav className='navBar'>
                    <div>
                        <Dropdown overlay={menuTypeProducts} placement="bottom">
                            <WrapperDivTextHover style={{ cursor: 'pointer' }}>
                                Sản Phẩm
                            </WrapperDivTextHover>
                        </Dropdown>
                    </div>
                    <div>
                        <WrapperDivTextHover style={{ color: 'rgb(255,116,109)' }}
                            onClick={handleNavigatePageSales}>Giảm Giá</WrapperDivTextHover>
                    </div>

                    <div>
                        <WrapperDivTextHover onClick={handleNavigatePageSupport}>
                            Chăm Sóc Khách Hàng
                        </WrapperDivTextHover>
                    </div>
                    <div>

                        <WrapperDivTextHover>Bộ sưu tập</WrapperDivTextHover>
                    </div>
                </WrapperDivNav >
                <div className='body' style={{ width: '100%', backgroundColor: "#fff" }}>
                    <div id="container" style={{ height: 'fit-content' }}>
                        <SliderComponent arrImages={[slider1, slider2, slider3, slider4, slider5, slider6]} />
                        <div style={{
                            display: 'flex', justifyContent: 'center',
                            alignItems: 'center', margin: '20px 0', fontSize: '30px',
                        }}>Sản Phẩm Mới</div>

                        <LoadingComponent isLoading={isLoading}>
                            <WrapperProduct>
                                {product2 ? (
                                    product2?.map((product) => (

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
                                {hasMore && <div ref={elementRef} style={{ width: '100%', height: '80px' }}><Skeleton active /></div>}
                            </WrapperProduct>
                            {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
                                {products?.total !== products?.data.length || !products?.totalPage === 1 ? (
                                    < WrapperButtonMore type={'outline'} textButton={'Xem thêm'} styleButton={{
                                        border: '1px solid #ccc', color: 'black', width: '240px',
                                        height: '38px', borderRadius: '4px',
                                    }}
                                        styleTextButton={{ fontWeight: '500' }} onClick={handleLoadMore}
                                    />)
                                    : (
                                        <>
                                        </>
                                    )
                                }
                            </div> */}
                        </LoadingComponent>
                    </div>
                </div>
            </WrapperDiv >
            <Footer />
        </>
    )
}
