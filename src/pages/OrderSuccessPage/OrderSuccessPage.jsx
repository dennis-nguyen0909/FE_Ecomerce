import { Checkbox, Col, Form, Input, Button, Row, message, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ButtonComponent } from '../../component/ButtonComponent/ButtonComponent'
import { WrapperDiv, WrapperDivStyle, WrapperDivSuccess } from './style'
import { covertPrice } from '../../untils'
import { useLocation, useNavigate } from 'react-router-dom'
import { orderContant } from '../../contant'



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
        <WrapperDivSuccess>
            <div className='orderPageSuccessPc'>
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
                        </Form>
                    </Col>
                </Row >
            </div>
            <div className='orderPageSuccessMobile'>
                <div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <p style={{ fontWeight: 'bold' }}>ĐẶT HÀNG THÀNH CÔNG</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 20px' }}>
                            <label style={{ fontWeight: 'bold' }}>Phương thức giao hàng :</label>
                            <p style={{ border: '1px solid #ccc', width: 'fit-content', padding: '10px 20px', backgroundColor: 'rgb(71,71,76)', color: '#fff' }}>
                                <span>{orderContant.delivery[state?.delivery]}</span>
                            </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 20px' }}>
                            <label style={{ fontWeight: 'bold' }}>Phương thức thanh toán :</label>
                            <p style={{ border: '1px solid #ccc', width: 'fit-content', padding: '10px 20px', backgroundColor: 'rgb(71,71,76)', color: '#fff' }}>
                                <span>{orderContant.payment[state?.payment]}</span>
                            </p>
                        </div>
                    </div>
                    <div style={{ border: '1px solid #ccc', margin: '40px 0' }}></div>
                    {state?.orders?.map((item) => {
                        return (
                            <div key={item?._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <div>
                                    <img width={'130px'} height={'130px'} objectFit={'cover'} src={item.image} />
                                </div>
                                <div style={{ padding: '0 10px' }}>
                                    <h3>{item?.name}</h3>
                                    <p>Giá :{covertPrice(item?.price)}</p>
                                    <p>Số lượng : {item?.amount}</p>
                                    <p>Size :{item?.size}</p>
                                </div>
                            </div>

                        )
                    })}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', padding: '0 15px' }}>
                        <div style={{ backgroundColor: 'rgb(71,71,76)', color: '#fff', padding: '10px 10px', fontWeight: 'bold', borderRadius: '5px' }}>
                            Tổng tiền {covertPrice(state?.totalPrice)}

                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '0 20px' }}>
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
                </div>
            </div>
        </WrapperDivSuccess>

    )
}
