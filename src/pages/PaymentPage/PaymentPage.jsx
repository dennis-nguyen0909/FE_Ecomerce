import { Checkbox, Col, Form, Input, Button, Row, message, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ButtonComponent } from '../../component/ButtonComponent/ButtonComponent'
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent'
import { InputForm, WrapperDivStyle, WrapperDivPayment } from './style'
import { PayPalButton } from "react-paypal-button-v2";
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder, totalAllProduct, resetOrder } from '../../redux/slides/orderSlide'
import { covertPrice } from '../../untils'
import * as OrderService from '../../services/OrderService'
import * as PaymentService from '../../services/PaymentService'
import { useMutationHook } from '../../hooks/userMutationHook'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'


export const PaymentPage = () => {
    const navigate = useNavigate()
    const [formModal] = Form.useForm();
    const [selectedCheck, setSelectedCheck] = useState([])
    const [delivery, setDelivery] = useState('')
    const [payment, setPayment] = useState('')
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const dispatch = useDispatch()
    const [sdk, setSdk] = useState(false)

    const [loading, isLoadingAdd] = useState(false)


    const handleChangeCount = (value, id) => {
        if (value === 'increase') {
            dispatch(increaseAmount(id))
        } else {
            dispatch(decreaseAmount(id))
        }
    }
    const handleOnChangeNum = () => {

    }
    const handleDeleteOrder = (id) => {
        dispatch(removeOrderProduct(id))
    }
    const handleCheckAllChecked = (e) => {
        if (e.target.checked) {
            const newListChecked = []
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product)
            })
            setSelectedCheck(newListChecked)
        } else {
            setSelectedCheck([])
        }
    }
    const onChangeCheckbox = (e) => {
        if (selectedCheck.includes(e.target.value)) {
            const newListCheck = selectedCheck.filter((item) => item !== e.target.value)
            setSelectedCheck(newListCheck)
        } else {
            setSelectedCheck([...selectedCheck, e.target.value])
        }
    }
    const handleDeleteAllOrder = () => {
        if (selectedCheck?.length >= 1) {
            dispatch(removeAllOrderProduct({ selectedCheck }))
        }
    }
    const handleTinhtONG = () => {
        if (selectedCheck.length >= 1) {
            dispatch(totalAllProduct({ selectedCheck }))
        }
    }
    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result;
    }, [order])
    const priceDiscount = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.discount * cur.amount))
        }, 0)
        if (Number(result)) {
            return result
        }
        return 0
    }, [order])
    const deliveryPrice = useMemo(() => {
        if (priceMemo > 200000) {
            return 10000
        } else if (priceMemo === 0) {
            return 0
        } else {
            return 20000
        }
    }, [priceMemo])
    const totalPriceAll = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscount) + Number(deliveryPrice) - Number(priceMemo * priceDiscount / 100)
    }, [priceMemo, priceDiscount, deliveryPrice])

    const handlePayment = async (e) => {
        // if (e.target.value === null || e.target.value === undefined) {
        //     message.error('Vui lòng chọn phương thức thanh toán!');
        // } else {
        //     // Xử lý logic khi người dùng chọn một tùy chọn
        //     setPayment(e.target.value);
        // }

        setPayment(e.target.value);

    }
    const handleDelivery = (e) => {
        // if (e.target.value === null || e.target.value === undefined) {
        //     message.error('Vui lòng chọn phương thức thanh toán!');
        // } else {
        //     // Xử lý logic khi người dùng chọn một tùy chọn
        //     setDelivery(e.target.value)
        // }
        setDelivery(e.target.value)

    }
    const mutationAddOrder = useMutationHook(
        async (data) => {
            const { id, token, ...rest } = data
            const res = await OrderService.createOrder({ ...rest }, token);
            return res;
        },
    )
    const addOrder = async (data) => {

        const { id, token, ...rest } = data
        const res = await OrderService.createOrder({ ...rest }, token);
        return res.data;

    }

    const handleAddOrder = async () => {
        if (!delivery) {
            message.error('Vui lòng chọn phương thức thanh toán!');
        } else if (!payment) {
            message.error('Vui lòng chọn phương vận chuyển !');
        } else if (!user?.name || !user?.address || !user?.phone ) {
            message.error("Vui lòng điền đẩy đủ thông tin giao hàng")
        }
        else if (user?.name || user?.address || user?.phone) {
            isLoadingAdd(true)
            const result = await addOrder({
                token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: user?.name, address: user?.address + " " + user?.ward + " " + user?.districts, phone: user?.phone, city: user?.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: deliveryPrice,
                totalPrice: totalPriceAll,
                user: user?.id,
                email: user?.email
            })
            if (+result?.EC === 1) {
                const arrOrder = []
                order?.orderItemsSelected?.forEach(element => {
                    arrOrder.push(element.product) // push id vao mang
                });
                dispatch(removeAllOrderProduct({ selectedCheck: arrOrder }))
                message.success("Đơn hàng đã được xác nhận. Vui lòng kiểm tra email để xác nhận!")
                navigate('/order-success', {
                    state: {
                        delivery,
                        payment,
                        orders: order?.orderItemsSelected,
                        totalPrice: totalPriceAll
                    }
                })
                // dispatch(resetOrder())
            } else {
                message.error("Đặt Hàng Thất Bại !")

            }
            isLoadingAdd(false)
        }

    }
    const fetchClientIdPaypal = async () => {
        const { data } = await PaymentService.getClientId();
        const script = document.createElement('script');
        script.type = 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
        script.async = true;
        script.onload = () => {
            setSdk(true)// nếu đang load thì true
        }
        document.body.appendChild(script)
    }
    useEffect(() => {
        if (!window.paypal) {
            fetchClientIdPaypal();
        } else {
            setSdk(true)
        }
    }, [])
    const onSuccessPaypal = async (details, data) => {
        const result = await addOrder({
            token: user?.access_token,
            orderItems: order?.orderItemsSelected,
            fullName: user?.name, address: user?.address + " " + user?.ward + " " + user?.districts, phone: user?.phone, city: user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: deliveryPrice,
            totalPrice: totalPriceAll,
            user: user?.id,
            isPaid: true,
            PaidAt: details?.update_time,
            email: user?.email
        })
        if (+result?.EC === 1) {
            const arrOrder = []
            order?.orderItemsSelected?.forEach(element => {
                arrOrder.push(element.product) // push id vao mang
            });
            message.success("Đặt Hàng Thành Công !")
            dispatch(removeAllOrderProduct({ selectedCheck: arrOrder }))
            navigate('/order-success', {
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSelected,
                    totalPrice: totalPriceAll
                }
            })
        }
    }


    return (
        <WrapperDivPayment>
            <div className='paymentPc'>
                <Row style={{ marginTop: '80px' }} >
                    <Col span={12} style={{ width: 'fit-content', paddingLeft: '20px' }}>
                        <Form
                            form={formModal}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                <WrapperDivStyle>Thông tin giao hàng</WrapperDivStyle>

                            </div>
                            <InputForm
                                style={{ with: '100px' }}
                                placeholder={'Họ Tên'}
                                name='name'
                                value={user?.name && user?.name}
                            />
                            <div style={{ display: 'flex' }}>
                                <InputForm
                                    placeholder={'Email'}
                                    name='email'
                                    value={user?.email && user?.email}

                                />
                                <InputForm
                                    placeholder={'Số điện thoại'}
                                    name="phone"
                                    value={user?.phone && user?.phone}

                                />
                            </div>

                            <InputForm
                                placeholder={'Địa Chỉ'}
                                name="address"
                                // value={allAddress ? allAddress : user?.address}
                                value={user?.address + " " + user?.ward + " " + user?.districts + " " + user?.city}

                            />

                            {/* <LoadingComponent > */}
                            <div style={{ margin: '20px 20px', border: '1px solid #ccc', padding: '20px 40px', }}>
                                <div>Tạm tính :{covertPrice(priceMemo)}</div>
                                <div>Giảm giá : {priceDiscount}%</div>
                                <div>Phí giao hàng :{covertPrice(deliveryPrice)}</div>
                                <div>Tổng tiền :{covertPrice(totalPriceAll)}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {payment === "paypal" && sdk ? (
                                    <div style={{ with: '500px' }}>
                                        <PayPalButton
                                            amount={(totalPriceAll / 24000).toFixed(2)}
                                            shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                            onSuccess={onSuccessPaypal}
                                            onError={(err) => {
                                                alert(err)
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ width: '500px' }}>
                                        <LoadingComponent isLoading={loading} delay={2000} >
                                            <ButtonComponent
                                                onClick={handleAddOrder}
                                                size={'40'}
                                                styleButton={{
                                                    backgroundColor: "rgb(71,71,71)",
                                                    height: '48px',
                                                    width: '100%',
                                                    border: 'none',
                                                    borderRadius: "12px",
                                                    margin: "20px 0"
                                                }}
                                                textButton={"Đặt Hàng"}
                                                styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                                            />
                                        </LoadingComponent>
                                    </div>
                                )}
                            </div>
                            {/* </LoadingComponent> */}
                        </Form>
                    </Col>
                    <Col span={12} style={{ borderLeft: '1px solid #ccc', height: '500px', paddingLeft: '20px' }}>
                        <div>
                            <h1>Chọn phương thức giao hàng</h1>
                            <Radio.Group onChange={handleDelivery} value={delivery}>
                                <Radio value="fast"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng tiết kiệm</Radio>
                                <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                            </Radio.Group>
                        </div>
                        <div>
                            <h1>Chọn phương thức thanh toán</h1>
                            <Radio.Group onChange={handlePayment} value={payment}>
                                <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                <Radio value="paypal">Thanh toán bằng paypal</Radio>
                            </Radio.Group>
                        </div>

                    </Col>
                </Row >
            </div>
            <div className='paymentMobile'>
                <LoadingComponent isLoading={loading} delay={1000} >
                    <div style={{ padding: '0 10px' }} >
                        <div>
                            <p style={{ display: 'flex', fontWeight: 'bold' }}>Chọn phương thức giao hàng</p>
                            <Radio.Group onChange={handleDelivery} value={delivery} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '0 20px' }}>
                                <Radio value="fast"><span style={{ color: '#ea8500', fontWeight: 'bold', fontSize: '14px' }}>FAST</span> Giao hàng tiết kiệm</Radio>
                                <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: 'bold', fontSize: '14px' }}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                            </Radio.Group>
                        </div>
                        <div>
                            <p style={{ display: 'flex', fontWeight: 'bold' }}>Chọn phương thức thanh toán</p>
                            <Radio.Group onChange={handlePayment} value={payment} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '0 20px' }}>
                                <Radio style={{ fontSize: '14px' }} value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                <Radio value="paypal">Thanh toán bằng paypal</Radio>
                            </Radio.Group>
                        </div>

                    </div>
                    <div>
                        <Form
                            form={formModal}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                <p style={{ fontWeight: 'bold' }}>Thông tin giao hàng</p>
                            </div>
                            <div style={{ padding: '0 20px' }}>
                                <InputForm
                                    style={{ with: '100px' }}
                                    placeholder={'Họ Tên'}
                                    name='name'
                                    value={user?.name && user?.name}
                                />
                                <div style={{ display: 'flex' }}>
                                    <InputForm
                                        placeholder={'Email'}
                                        name='email'
                                        value={user?.email && user?.email}

                                    />
                                    <InputForm
                                        placeholder={'Số điện thoại'}
                                        name="phone"
                                        value={user?.phone && user?.phone}

                                    />
                                </div>

                                <InputForm
                                    placeholder={'Địa Chỉ'}
                                    name="address"
                                    // value={allAddress ? allAddress : user?.address}
                                    value={user?.address + " " + user?.ward + " " + user?.districts + " " + user?.city}

                                />

                                {/* <LoadingComponent > */}
                                <div style={{ margin: '20px 20px', border: '1px solid #ccc', padding: '20px 40px', }}>
                                    <div>Tạm tính :{covertPrice(priceMemo)}</div>
                                    <div>Giảm giá : {priceDiscount}%</div>
                                    <div>Phí giao hàng :{covertPrice(deliveryPrice)}</div>
                                    <div>Tổng tiền :{covertPrice(totalPriceAll)}</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {payment === "paypal" && sdk ? (
                                        <div style={{ with: '500px' }}>
                                            <PayPalButton
                                                amount={(totalPriceAll / 24000).toFixed(2)}
                                                shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                                onSuccess={onSuccessPaypal}
                                                onError={(err) => {
                                                    alert(err)
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ width: '500px' }}>
                                            <ButtonComponent
                                                onClick={handleAddOrder}
                                                size={'40'}
                                                styleButton={{
                                                    backgroundColor: "rgb(71,71,71)",
                                                    height: '48px',
                                                    width: '100%',
                                                    border: 'none',
                                                    borderRadius: "12px",
                                                    margin: "20px 0"
                                                }}
                                                textButton={"Đặt Hàng"}
                                                styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                                            />

                                        </div>
                                    )}
                                </div>
                            </div>
                        </Form>
                    </div>
                </LoadingComponent>
            </div >
        </WrapperDivPayment >

    )
}
