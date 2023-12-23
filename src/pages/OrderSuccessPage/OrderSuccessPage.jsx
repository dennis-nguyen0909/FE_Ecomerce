import { Checkbox, Col, Form, Input, Button, Row, message, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ButtonComponent } from '../../component/ButtonComponent/ButtonComponent'
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent'
import { InputForm, WrapperDiv, WrapperDivStyle } from './style'

import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder, totalAllProduct } from '../../redux/slides/orderSlide'
import { covertPrice } from '../../untils'
import * as OrderService from '../../services/OrderService'
import { useMutationHook } from '../../hooks/userMutationHook'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { orderContant } from '../../contant'
import { TableComponent } from '../../component/TableComponent/TableComponent'


export const OrderSuccessPage = () => {

    const order = useSelector((state) => state.order)
    const navigate = useNavigate()
    const location = useLocation();
    const { state } = location
    const handleNavigateHome = () => {
        navigate('/')
    }
    const handleNavigateMyOrder = () => {
        navigate('/my-order')
    }

    return (
        <Row style={{ padding: '0 200px' }} >
            <Col span={24} style={{ width: 'fit-content' }}>
                <Form

                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <WrapperDivStyle>ĐẶT HÀNG THÀNH CÔNG</WrapperDivStyle>
                    </div>
                    <WrapperDiv>
                        <label>Phương thức giao hàng :</label>
                        <p style={{ border: '1px solid #ccc', width: 'fit-content', padding: '10px 20px', backgroundColor: 'rgb(71,71,76)', color: '#fff' }}>
                            <span>{orderContant.delivery[state?.delivery]}</span>
                        </p>
                    </WrapperDiv>
                    <WrapperDiv>
                        <label>Phương thức thanh toán :</label>
                        <p style={{ border: '1px solid #ccc', width: 'fit-content', padding: '10px 20px', backgroundColor: 'rgb(71,71,76)', color: '#fff' }}>
                            <span>{orderContant.payment[state?.payment]}</span>
                        </p>
                    </WrapperDiv>
                    <div style={{ border: '1px solid #ccc', margin: '40px 0' }}></div>
                    {state?.orders?.map((order) => {
                        return (
                            <div key={order?._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                    <h2>Sản phẩm:</h2>
                                    <p>{order?.name}</p>
                                </div>
                                <div>
                                    <img style={{ borderRadius: '30px' }} width={'150px'} height={'150px'} objectFit={'cover'} src={order?.image}></img>
                                </div>
                                <div>
                                    <p>Kích cỡ :{order?.size}</p>
                                    <p>Số lượng :{order?.amount}</p>
                                    <p>Giá :{covertPrice(order?.price)}</p>
                                </div>
                            </div>

                        )
                    })}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                        <div style={{ backgroundColor: 'rgb(71,71,76)', color: '#fff', padding: '10px 10px', fontWeight: 'bold', borderRadius: '10px' }}>
                            Tổng tiền {covertPrice(state?.totalPrice)}

                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '100px' }}>
                        <ButtonComponent
                            onClick={handleNavigateMyOrder}
                            size={'40'}
                            styleButton={{
                                backgroundColor: "rgb(71,71,71)",
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: "12px",
                                margin: "20px 0"
                            }}
                            textButton={"Xác nhận đơn hàng"}
                            styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                        />

                        <ButtonComponent
                            onClick={handleNavigateHome}
                            size={'40'}
                            styleButton={{
                                backgroundColor: "#ccc",
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: "12px",
                                margin: "20px 0"
                            }}
                            textButton={"Tiếp tục mua sắm"}
                            styleTextButton={{ color: "black", fontSize: '15px', fontWeight: 700 }}
                        />
                    </div>
                    {/* <LoadingComponent delay={2000} > */}
                    {/* </LoadingComponent> */}

                </Form>
            </Col>


        </Row >
    )
}
