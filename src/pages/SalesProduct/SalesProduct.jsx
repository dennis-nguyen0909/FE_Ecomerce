import React, { useEffect, useState } from 'react'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query';
import { CardComponent } from '../../component/CardComponent/CardComponent';
import { WrapperProduct } from '../HomePage/style';
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent';
import { covertPrice } from '../../untils';
import { Button, Card, Checkbox, Collapse, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { WrapperDiv } from './style'
import { WrapperNavbar, WrapperRow, WrapperSort } from '../TypeProductPage/style';
import { NavbarComponent } from '../../component/NavbarComponent/NavbarComponent';

export const SalesProduct = () => {
    const [limit, setLimit] = useState(9)
    const [selectedSort, setSelectedSort] = useState('')
    const handleChange = (value) => {
        setSelectedSort(value);
    };
    const navigate = useNavigate()
    const fetchProduct = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = ''
        const res = await ProductService.getAllProduct(search, limit);

        return res;
    }
    const { data: products, isLoading } = useQuery({ queryKey: ['products', limit], queryFn: fetchProduct, retryDelay: 1000, retry: 3 })
    const filterData = products?.data?.filter((item) => item.discount > 0) || []
    console.log(products?.totalPage)

    const handleDetailProduct = (id) => {
        navigate(`/product-detail/${id}`)
    }
    const loadMore = () => {
        const currentScroll = window.scrollY
        setLimit((prev) => prev + 4)
        window.scrollTo(0, currentScroll);

    }
    // const handleScroll = () => {
    //     const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    //     const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    //     const documentHeight = document.documentElement.scrollHeight;

    //     // Kiểm tra xem người dùng đã cuộn xuống cuối chưa
    //     if (scrollY + windowHeight >= documentHeight - 800) {
    //         // Lưu lại vị trí cuộn hiện tại
    //         const currentScrollY = window.scrollY;

    //         // Tải thêm sản phẩm với giới hạn tăng lên
    //         setLimit((prev) => prev + 4);

    //         // Khôi phục vị trí cuộn sau khi thêm nội dung
    //         window.scrollTo(0, currentScrollY);
    //     }
    // };
    // useEffect(() => {
    //     // Gắn trình nghe sự kiện cuộn khi thành phần được tạo
    //     window.addEventListener('scroll', handleScroll);

    //     // Loại bỏ trình nghe sự kiện khi thành phần bị hủy
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, [limit]);
    const originalData = filterData || []; // Bảo đảm rằng data không phải là null hoặc undefined
    const sortedProducts = originalData.slice().sort((a, b) => b.selled - a.selled);
    const sortedPriceMin = originalData.slice().sort((a, b) => b.price - a.price);
    const sortedPriceMax = originalData.slice().sort((a, b) => a.price - b.price);
    const countProduct = (filterData || []).length;
    const items = [
        // {
        //     key: '1',
        //     label: 'Price',
        //     children: <p>
        //         <Checkbox>100-300</Checkbox>
        //     </p>,
        // },
    ]
    return (
        <WrapperDiv>
            <div className='Pc'>
                <h3 style={{ padding: '0 30px', fontSize: '14px', gap: '10px', color: 'rgb(137,137,137)' }}>Home / Giảm giá
                    <span style={{ marginLeft: '10px', fontSize: '14px', color: 'black' }}></span>
                </h3>
                <WrapperRow className='productPc'>
                    <WrapperNavbar className='navBarLeft' span={4}>
                        {/* <NavbarComponent types={type} /> */}
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
                        <div style={{ border: '1px solid #ccc' }}>
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
                                            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
                                                <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>Giảm giá :</p>
                                                <span style={{color:'red'}}>{product?.discount}%</span>
                                            </div>
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
                                            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
                                                <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>Giảm giá :</p>
                                                <span style={{color:'red'}}>{product?.discount}%</span>
                                            </div>
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
                                            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>
                                                <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>Giảm giá :</p>
                                                <span style={{color:'red'}}>{product?.discount}%</span>
                                            </div>

                                            <span style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {covertPrice(product.price)}
                                            </span>
                                        </Card>
                                    )
                                })}
                            </WrapperProduct>
                            {products?.totalPage === 1 ?
                                <></>
                                :
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button onClick={loadMore}>Xem thêm</Button>
                                </div>

                            }
                        </div>

                    </div>

                </WrapperRow>
            </div>
            <div className='mobile'>
                <h3 style={{ padding: '0 30px', fontSize: '14px', gap: '10px', color: 'rgb(137,137,137)' }}>Home / Giảm giá
                    <span style={{ marginLeft: '10px', fontSize: '14px', color: 'black' }}></span>
                </h3>
                <div style={{ width: '100%', backgroundColor: "#fff" }}>
                    <div id="container" style={{ height: 'fit-content' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', fontSize: '30px', }}>Sản phẩm đang giảm giá </div>
                        <LoadingComponent isLoading={isLoading}>
                            <WrapperProduct>
                                {filterData && filterData.length > 0 ? (
                                    filterData?.map((product) => (
                                        <Card
                                            onClick={() => handleDetailProduct(product?._id)}
                                            size='small'
                                            hoverable={true}
                                            style={{ width: 'calc(50% - 10px)', marginBottom: '10px' }}
                                            cover={<img style={{ width: '100%', height: 'auto' }} alt="example" src={product?.image} />}
                                        >
                                            <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{product?.name}</p>
                                            <p style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>Giảm giá :{product?.discount}%</p>
                                            <span style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {covertPrice(product.price)}
                                            </span>
                                        </Card>
                                    ))
                                ) : (
                                    <p>Không tìm thấy sản phẩm</p>
                                )}
                            </WrapperProduct>

                        </LoadingComponent>
                        {products?.totalPage === 1 ?
                            <></>
                            :
                            <Button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }} onClick={loadMore}>Xem thêm</Button>

                        }
                    </div>
                </div >
            </div>

        </WrapperDiv>
    )
}
