import React, { useEffect, useState } from 'react'
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux'
import { useFetcher, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Image, Modal } from 'antd'
import { WrapperDiv, WrapperDivButton, WrapperDivItems, WrapperDivOrder } from './style'
import { covertPrice } from '../../untils'

export const MyOrderPage = () => {
    const [stateMyOrder, setStateMyOder] = useState([])
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const navigate = useNavigate();
    const fetchDetailOrder = async () => {
        const res = await OrderService.getAllOrderbyIdUser(user?.id, user?.access_token);
        console.log('fec', res?.data)
        return res?.data
    }
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchDetailOrder, enabled: user?.id && user?.access_token ? true : false },)
    const { isLoading, data } = queryOrder
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleOpenForm = () => {
        showModal()
    }
    const handleNavigatePageOrderDetails = (id) => {
        navigate(`/my-order-detail/${id}`)
    }
    const renderMyOrder = (data) => {
        return data?.map((order) => {
            return (
                <>
                    <WrapperDivItems key={order?.id}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Image src={order?.image} width={100} height={100} />
                            <div>
                                <p>{order?.name}</p>
                                <p>Số lượng :{order?.amount}</p>
                            </div>
                        </div>
                        <div>
                            <p>{covertPrice(order?.price)}</p>
                        </div>
                    </WrapperDivItems>

                </>
            )
        })
    }
    const renderMyOrderMobile = (data) => {
        return data?.map((order) => {
            return (
                <>
                    <WrapperDivItems key={order?.id}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Image src={order?.image} width={100} height={100} />
                            <div>
                                <p>{order?.name}</p>
                                <p>Số lượng :{order?.amount}</p>
                                <p>Giá :{covertPrice(order?.price)}</p>
                            </div>
                        </div>
                    </WrapperDivItems>

                </>
            )
        })
    }
    const fetchCancelProduct = async (order) => {
        const res = await OrderService.cancelOrderProduct(order?._id, user?.access_token, order?.orderItems)
    }
    const handleCancelProduct = (order) => {
        fetchCancelProduct(order);
    }
    return (
        <WrapperDivOrder>
            <div className='myOrderProduct' style={{ padding: '0 220px' }}>
                <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
                    <h3>Đơn hàng đã mua</h3>
                </div>
                <div>
                    {Array.isArray(data) && data?.map((item) => {
                        return (
                            <>
                                <WrapperDiv key={item?._id}>
                                    <div>
                                        <h4>Trạng thái</h4>
                                        <div style={{ display: 'flex' }}>
                                            <p style={{ color: 'red' }}>Giao hàng :</p>
                                            <p>Chưa giao hàng</p>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <p style={{ color: 'red' }}>Thanh toán :</p>
                                            <p>{item?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                                        </div>
                                    </div>
                                    {renderMyOrder(item?.orderItems)}
                                    <WrapperDivButton>
                                        <p>TỔNG TIỀN: {covertPrice(item?.totalPrice)} </p>
                                        <div style={{ display: 'flex', gap: '20px' }} >
                                            <Button onClick={() => handleCancelProduct(item)}>Hủy đơn hàng</Button>
                                            <Button onClick={() => handleNavigatePageOrderDetails(item?._id)}>Xem chi tiết</Button>
                                        </div>
                                    </WrapperDivButton>
                                </WrapperDiv >

                            </>
                        )
                    })}

                </div>
            </div >
            <div className='myOrderProductMobile'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h3>Đơn hàng của tôi</h3>
                </div>
                <div>
                    {Array.isArray(data) && data?.map((item) => {
                        return (
                            <>
                                <div style={{ padding: '0 40px', borderTop: '1px dashed #ccc', margin: '10px 0' }}>
                                    <div>
                                        <h4 style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>Mã đơn hàng</h4>
                                        <p>#{item._id}</p>
                                        <h4>Trạng thái</h4>
                                        <div style={{ display: 'flex' }}>
                                            <p style={{ color: 'red' }}>Giao hàng :</p>
                                            <p>Chưa giao hàng</p>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <p style={{ color: 'red' }}>Thanh toán :</p>
                                            <p>{item?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                                        </div>
                                    </div>
                                    {renderMyOrderMobile(item?.orderItems)}
                                    <WrapperDivButton>
                                        <p>TỔNG TIỀN: {covertPrice(item?.totalPrice)} </p>
                                        <div style={{ display: 'flex', gap: '20px' }} >
                                            <Button onClick={() => handleCancelProduct(item)}>Hủy đơn hàng</Button>
                                            <Button onClick={() => handleNavigatePageOrderDetails(item?._id)}>Xem chi tiết</Button>
                                        </div>
                                    </WrapperDivButton>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
        </WrapperDivOrder >
    )
}
