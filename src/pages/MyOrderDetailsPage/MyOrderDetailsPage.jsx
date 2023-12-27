import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Image, Radio } from 'antd';
import { covertPrice } from '../../untils'
import { WrapperAllPrice, WrapperContentInfo, WrapperDiv, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './styled'
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent';
import { orderContant } from '../../contant';

export const MyOrderDetailsPage = () => {
    const params = useParams();
    const user = useSelector((state) => state?.user)
    const fetchDetailOrder = async () => {
        const res = await OrderService.getDetailOrder(params.id, user?.access_token);
        return res?.response?.data
    }
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchDetailOrder, enabled: user?.id && user?.access_token ? true : false },)
    const { isLoading, data } = queryOrder
    const priceMemo = useMemo(() => {
        const result = data?.orderItems?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [data])
    console.log(data)
    return (
        <WrapperDiv>
            <div className='myOrderDetailsPc'>
                <LoadingComponent isLoading={isLoading}>
                    <div style={{ width: '100%', height: '100vh', background: '#f5f5fa' }}>
                        <div style={{ padding: '0 180px' }}>
                            <h4>Chi tiết đơn hàng</h4>
                            <WrapperHeaderUser>
                                <WrapperInfoUser>
                                    <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
                                    <WrapperContentInfo>
                                        <div className='name-info'>{data?.shippingAddress?.fullName}</div>
                                        <div className='address-info'><span>Địa chỉ: </span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
                                        <div className='phone-info'><span>Điện thoại: </span> {data?.shippingAddress?.phone}</div>
                                    </WrapperContentInfo>
                                </WrapperInfoUser>
                                <WrapperInfoUser>
                                    <WrapperLabel>Hình thức giao hàng</WrapperLabel>
                                    <WrapperContentInfo>
                                        <div className='delivery-info'><span className='name-delivery'>FAST </span>Giao hàng tiết kiệm</div>
                                        <div className='delivery-fee'><span>Phí giao hàng: </span> {data?.shippingPrice}</div>
                                    </WrapperContentInfo>
                                </WrapperInfoUser>
                                <WrapperInfoUser>
                                    <WrapperLabel>Hình thức thanh toán</WrapperLabel>
                                    <WrapperContentInfo>
                                        <div className='payment-info'>{orderContant.payment[data?.paymentMethod]}</div>
                                        <div className='status-payment'>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                                    </WrapperContentInfo>
                                </WrapperInfoUser>
                            </WrapperHeaderUser>
                            <WrapperStyleContent>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #ccc' }}>
                                    <div style={{ width: '670px', marginTop: '10px' }}>Sản phẩm</div>
                                    <WrapperItemLabel>Giá</WrapperItemLabel>
                                    <WrapperItemLabel>Số lượng</WrapperItemLabel>
                                    <WrapperItemLabel>Giảm giá</WrapperItemLabel>
                                </div>
                                {data?.orderItems?.map((order) => {

                                    return (
                                        <>
                                            <WrapperProduct key={order?._id}>
                                                <WrapperNameProduct>
                                                    <img src={order?.image}
                                                        style={{
                                                            width: '70px',
                                                            height: '70px',
                                                            objectFit: 'cover',
                                                            border: '1px solid rgb(238, 238, 238)',
                                                            padding: '2px'
                                                        }}
                                                    />
                                                    <div style={{
                                                        width: 260,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        marginLeft: '10px',
                                                        height: '70px',
                                                    }}>{order?.name}</div>
                                                </WrapperNameProduct>
                                                <WrapperItem>{covertPrice(order?.price)}</WrapperItem>
                                                <WrapperItem>{order?.amount}</WrapperItem>
                                                <WrapperItem>{order?.discount}%</WrapperItem>
                                            </WrapperProduct>
                                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                                <WrapperAllPrice>
                                                    <WrapperItemLabel>Tạm tính</WrapperItemLabel>
                                                    <WrapperItem>{covertPrice(priceMemo)}</WrapperItem>
                                                </WrapperAllPrice>
                                                <WrapperAllPrice>
                                                    <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
                                                    <WrapperItem>{covertPrice(data?.shippingPrice)}</WrapperItem>
                                                </WrapperAllPrice>
                                                <WrapperAllPrice>
                                                    <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
                                                    <WrapperItem><WrapperItem>{covertPrice(data?.totalPrice)}</WrapperItem></WrapperItem>
                                                </WrapperAllPrice>
                                            </div>
                                        </>
                                    )
                                })}

                            </WrapperStyleContent>

                        </div>
                    </div>
                </LoadingComponent>
            </div>
            <div className='myOrderDetailsMobile'>
                <LoadingComponent isLoading={isLoading}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Địa chỉ người nhận</div>
                            <div style={{ padding: '10px 10px' }}>
                                <div className='name-info'>{data?.shippingAddress?.fullName}</div>
                                <div className='address-info'><span>Địa chỉ: </span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
                                <div className='phone-info'><span>Điện thoại: </span> {data?.shippingAddress?.phone}</div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Hình thức giao hàng</div>
                            <div style={{ padding: '10px 10px' }}>
                                <div className='delivery-info'><span className='name-delivery' style={{ color: 'orange', fontWeight: 'bold' }}>FAST </span>Giao hàng tiết kiệm</div>
                                <div className='delivery-fee'><span>Phí giao hàng: </span> {data?.shippingPrice}</div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Hình thức thanh toán</div>
                            <div style={{ padding: '10px 10px' }}>
                                <div className='payment-info'>{orderContant.payment[data?.paymentMethod]}</div>
                                <div className='status-payment' style={{ color: 'orange', fontWeight: 'bold' }}>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                            </div>
                        </div>
                        <div style={{ borderBottom: '1px solid #ccc', borderTop: '1px solid #ccc', padding: '10px 10px' }}>
                            {data?.orderItems?.map((item) => {
                                return (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} key={item?._id}>
                                            <div>
                                                <img width={'150px'} height={'150px'} objectFit={'cover'} src={item.image} />
                                            </div>
                                            <div style={{ padding: '0 10px' }}>
                                                <h3>{item?.name}</h3>
                                                <p>Giá :{covertPrice(item?.price)}</p>
                                                <p>Số lượng : {item?.amount}</p>
                                                <p>Size :{item?.size}</p>
                                                <p>Giảm giá : {item?.discount}%</p>
                                            </div>
                                        </div>

                                    </>
                                )
                            })}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div>Tạm tính</div>
                                <WrapperItem>{covertPrice(priceMemo)}</WrapperItem>
                            </div>
                            <div>
                                <div>Phí vận chuyển</div>
                                <WrapperItem>{covertPrice(data?.shippingPrice)}</WrapperItem>
                            </div>
                            <div>
                                <div>Tổng cộng</div>
                                <WrapperItem><WrapperItem>{covertPrice(data?.totalPrice)}</WrapperItem></WrapperItem>
                            </div>
                        </div>
                    </div>
                </LoadingComponent>
            </div>
        </WrapperDiv>

    )
}
