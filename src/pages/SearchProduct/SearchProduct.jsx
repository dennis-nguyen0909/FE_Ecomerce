import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'

import { WrapperButtonMore, WrapperProduct } from '../HomePage/style'
import { CardComponent } from '../../component/CardComponent/CardComponent'
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent'
export const SearchProduct = () => {
    const productSearch = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(productSearch, 100)
    const [limit, setLimit] = useState(9)
    const fetchProduct = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct2(search, limit);
        return res;
    }
    const { isLoading, data: products } = useQuery({ queryKey: ['products', limit, searchDebounce], queryFn: fetchProduct, retry: 3, retryDelay: 1000, keepPreviousData: true })

    const handleLoadMore = () => {
        setLimit((prev) => prev + 3)
    }
    return (
        <>
            <h3 style={{ padding: '0 30px', fontSize: '14px', gap: '10px', color: 'rgb(137,137,137)' }}>Tìm Kiếm  /
                <span style={{ marginLeft: '10px', fontSize: '14px', color: 'black' }}>#{productSearch}</span>
            </h3>
            <div className='body' style={{ width: '100%', backgroundColor: "#fff" }}>
                <div id="container" style={{ height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', fontSize: '30px', }}>Sản Phẩm </div>
                    <LoadingComponent isLoading={isLoading}>
                        <WrapperProduct>
                            {products?.data && products?.data?.length > 0 ? (
                                products?.data.map((product) => (
                                    < CardComponent
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
                                <p>Không tìm thấy sản phẩm</p>
                            )}
                        </WrapperProduct>
                    </LoadingComponent>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
                        <WrapperButtonMore type={'outline'} textButton={'Xem thêm'} styleButton={{
                            border: '1px solid #ccc', color: 'black', width: '240px',
                            height: '38px', borderRadius: '4px',
                        }}
                            styleTextButton={{ fontWeight: '500' }} onClick={handleLoadMore}
                            disabled={products?.total === products?.data?.length || products?.totalPage === 1} />
                    </div>
                    {/* <NavbarComponent /> */}
                </div>
            </div>
        </>
    )
}
