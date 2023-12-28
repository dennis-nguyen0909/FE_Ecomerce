import React, { useEffect, useState } from 'react'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query';
import { CardComponent } from '../../component/CardComponent/CardComponent';
import { WrapperProduct } from '../HomePage/style';
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent';
import { useParams } from 'react-router-dom';
export const SalesProduct = () => {
    const [limit, setLimit] = useState(4)
    const fetchProductDistinct = async () => {
        const res = await ProductService.getDiscountProduct();
        return res?.data;
    }
    const location = useParams()
    const query = useQuery({ queryKey: 'product', queryFn: fetchProductDistinct })
    const { data, isLoading } = query
    const filterData = data?.filter((item) => item.discount > 0) || []
    useEffect(() => {
        fetchProductDistinct();
    }, [])
    const handleScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Check if the user has scrolled to the bottom
        if (scrollY + windowHeight >= documentHeight - 100) {
            // Set loading state to true

            // Fetch more products with an increased limit
            const newLimit = limit + 4;
            fetchProductDistinct(newLimit)
                .then(() => {
                    // Set loading state to false when data is fetched
                })
                .catch((error) => {
                    // Handle errors if needed
                    console.error('Error fetching products:', error);

                });
        }
    }
    useEffect(() => {
        // Gắn trình nghe sự kiện cuộn khi thành phần được tạo
        window.addEventListener('scroll', handleScroll);

        // Loại bỏ trình nghe sự kiện khi thành phần bị hủy
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.state]);

    return (
        <>
            <h3 style={{ padding: '0 30px', fontSize: '14px', gap: '10px', color: 'rgb(137,137,137)' }}>Tìm Kiếm  /
                <span style={{ marginLeft: '10px', fontSize: '14px', color: 'black' }}></span>
            </h3>
            <div className='body' style={{ width: '100%', backgroundColor: "#fff" }}>
                <div id="container" style={{ height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', fontSize: '30px', }}>Sản phẩm đang giảm giá </div>
                    <LoadingComponent isLoading={isLoading}>
                        <WrapperProduct>
                            {filterData && filterData.length > 0 ? (
                                filterData?.map((product) => (
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
                </div>
            </div>
        </>
    )
}
