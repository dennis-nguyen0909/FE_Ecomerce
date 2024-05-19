import { Checkbox, Col, Form, Input, Button, Row, Space, message, Steps } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ButtonComponent } from '../../component/ButtonComponent/ButtonComponent'
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent'
import { InputForm, WrapperDivStyle, WrapperDivOrder } from './style'
import { Select, Tree } from 'antd';
import axios from 'axios'
import { notifyManager } from '@tanstack/react-query'
import * as UserService from '../../services/UserService'
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons'
import { WrapperButtonQuality, WrapperQualityProduct } from '../../component/ProductDetailsComponent/style'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder, totalAllProduct } from '../../redux/slides/orderSlide'
import Item from 'antd/es/list/Item'
import { covertPrice } from '../../untils'
import { ModelComponent } from '../../component/ModelComponent/ModelComponent'
import { updateUser } from '../../redux/slides/userSlide'
import { InputComponent } from '../../component/InputComponent/InputComponent'
import { useNavigate } from 'react-router-dom'
import { StepComponent } from '../../component/StepComponent/StepComponent'

const { TreeNode } = Tree;
const { Option } = Select;
export const OrderPage = () => {
    const navigate = useNavigate()
    const [cityData, setCityData] = useState([])
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistricts, setSelectedDistricts] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [formModal] = Form.useForm();
    const [selectedCheck, setSelectedCheck] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(false)
    const user = useSelector((state) => state.user)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        phone: '',
        city: '',
        districts: '',
        ward: ''
    })
    const order = useSelector((state) => state.order)
    const dispatch = useDispatch();
    // const fetch = async () => {
    //     const res = await axios.get(`https://provinces.open-api.vn/api/?depth=3`);
    //     setCityData(res.data)
    // }
    // useEffect(() => {
    //     fetch();
    // }, [])
    const handleCityChange = (value) => {
        const selectedCityData = cityData.find((city) => city.code === value);
        setSelectedCity(selectedCityData);
        setDistricts(selectedCityData.districts);
        setStateUserDetail({
            ...stateUserDetail,
            city: selectedCityData?.name
        })
    };
    const handleHuyen = (value) => {
        const selectedCityData = districts.find((city) => city.code === value);
        setSelectedDistricts(selectedCityData)
        setStateUserDetail({
            ...stateUserDetail,
            districts: selectedCityData?.name
        })
    }
    const handleChangeCount = (value, id, limited) => {
        if (value === 'increase') {
            if (!limited) {
                dispatch(increaseAmount(id))
            } else {
                message.error("Quá giới hạn sản phẩm")
            }
        } else {
            if (!limited) {
                dispatch(decreaseAmount(id))
            } else {
                message.error("Sản phẩm tối thiểu là 1")
            }
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
        if (priceMemo >= 200000 && priceMemo <= 500000) {
            return 15000
        } else if (priceMemo >= 500000) {
            return 0
        } else if (order?.orderItemsSelected?.length === 0) {
            return 0
        } else {
            return 30000
        }
    }, [priceMemo])
    const totalPriceAll = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscount) + Number(deliveryPrice) - Number(priceMemo * priceDiscount / 100)
    }, [priceMemo, priceDiscount, deliveryPrice])
    useEffect(() => {
        dispatch(selectedOrder({ selectedCheck }))
    }, [selectedCheck])
    const handleOnChangeWard = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            ward: e.target.value
        })
    }
    const fetchUpdateUser = async (dataUpdate) => {
        const res = await UserService.updateUser(user?.id, dataUpdate, user.access_token)
        return res.data;
    }
    const handlePayment = async () => {
        if (!order?.orderItemsSelected?.length) {
            message.error("Vui lòng chọn sản phẩm ?")
        // } else if (!user?.districts || !user?.ward || !user?.name || !user?.phone || !user?.address) {
        //     setIsModalOpen(true)
        } else {
            navigate('/payment')

        }
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    }
    const onUpdate = async () => {
        const res = await fetchUpdateUser(stateUserDetail);
        setStateUserDetail(res.data)
        dispatch(updateUser(res.data, user?.access_token))

        if (res.status === 'Ok') {
            message.success('Update thành công !');
            formModal.setFieldValue(user)
            handleCancel();
        } else {
            message.success('Update thất bại  !');
            handleCancel();
        }
    }
    useEffect(() => {
        formModal.setFieldsValue({
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            address: user?.address,
        });
    }, [formModal, user?.address, user?.ward, user?.districts, user?.city]);
    const handleEdit = () => {
        fetchDetailUser(user?.id);
        setIsModalOpen(true)
    }
    const handleOnChangeUserDetail = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value
        })
    }
    const fetchDetailUser = async (id) => {
        const res = await UserService.getDetailUser(id, user?.access_token)
        setStateUserDetail({
            name: res?.response?.data?.name,
            phone: res?.response?.data?.phone,
            address: res?.response?.data?.address,
            ward: res?.response?.data?.ward,
            districts: res?.response?.data?.districts,
            city: res?.response?.data?.city,
        })
    }
    console.log(user)

    const itemsDelivery =
        [
            {
                title: '30.000 VND',
                description: "Đơn hàng dưới 200k",
            },
            {
                title: '15.000 VND',
                description: "Đơn hàng từ 200k đến 500k",
            },
            {
                title: 'Free ship',
                description: "Đơn hàng trên 500k",
            },

        ]
    return (
        <WrapperDivOrder>
            <div className='orderPC'>
                <div style={{ padding: '0 200px' }}>
                    <StepComponent items={itemsDelivery}
                        current={
                            deliveryPrice === 15000 ? 2
                                : deliveryPrice === 30000 ? 1
                                    : order?.orderItemsSelected.length === 0 ? 0
                                        : 3} />
                </div>
                <Row style={{ marginTop: '80px', padding: '0 80px' }} >
                    <Col span={12} style={{ width: 'fit-content' }}>
                        <Form
                            form={formModal}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                <WrapperDivStyle>Thông tin giao hàng</WrapperDivStyle>
                                <Button onClick={handleEdit}>Thay đổi</Button>
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
                            <ButtonComponent
                                onClick={handlePayment}
                                size={'40'}
                                styleButton={{
                                    backgroundColor: "rgb(71,71,71)",
                                    height: '48px',
                                    width: '100%',
                                    border: 'none',
                                    borderRadius: "12px",
                                    margin: "20px 0"
                                }}
                                textButton={"Thanh Toán"}
                                styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                            />
                            {/* </LoadingComponent> */}
                        </Form>
                    </Col>
                    <Col span={12} style={{ borderLeft: '1px solid #ccc', height: '500px' }}>
                        <div style={{ marginLeft: '16px', borderBottom: '1px solid #ccc' }}>
                            <WrapperDivStyle>Giỏ Hàng</WrapperDivStyle>
                            <div>
                                <span>
                                    <Checkbox onChange={handleCheckAllChecked} checked={selectedCheck?.length === order?.orderItems?.length} />
                                    <span>Tất cả {order?.orderItems?.length} sản phẩm </span>
                                    <DeleteOutlined onClick={handleDeleteAllOrder} />
                                </span>

                            </div>
                            {order?.orderItems?.length ? order?.orderItems?.map((item) => {
                                return (
                                    <>
                                        <div key={item?._id} style={{ width: '500px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <Checkbox onChange={onChangeCheckbox} value={item?.product} checked={selectedCheck.includes(item?.product)}></Checkbox>
                                            <div>
                                                <img width={'130px'} height={'130px'} objectFit={'cover'} src={item.image} />
                                            </div>
                                            <div style={{ padding: '0 10px' }}>
                                                <h3>Tên sản phẩm :{item.name}</h3>
                                                <p>Size: {item.size}</p>
                                                <p>Giảm giá:</p>
                                                <p>Số lượng : {item?.amount}</p>
                                                <WrapperQualityProduct>
                                                    <WrapperButtonQuality>
                                                        <MinusOutlined style={{ color: "#000", fontSize: "20px" }} onClick={() => handleChangeCount('decrease', item?.product, item?.amount === 1)} />
                                                    </WrapperButtonQuality>
                                                    {/* <WrapperInputNumber defaultValue={1} size='small' value={numProduct} onChange={handleOnChangeNum} /> */}
                                                    <input defaultValue={item?.amount} value={item?.amount} min={1} max={item?.countInStock} onChange={handleOnChangeNum} style={{ width: '30px', border: 'transparent', textAlign: 'center', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }} />
                                                    <WrapperButtonQuality>
                                                        <PlusOutlined style={{ color: "#000", fontSize: "20px" }} onClick={() => handleChangeCount('increase', item?.product, item?.amount === item?.countInStock)} />
                                                    </WrapperButtonQuality>
                                                </WrapperQualityProduct>
                                                <p>Giá :{covertPrice(item?.price)}</p>
                                            </div>
                                        </div>
                                    </>

                                )
                            }) : (
                                <>
                                    <div style={{ width: '500px', height: '100px', display: 'flex', justifyContent: 'flex-start', borderTop: '1px solid #ccc', marginBottom: '10px' }}>
                                        <p>Giỏ Hàng Rỗng</p>
                                    </div>
                                </>
                            )}
                        </div>

                    </Col>
                    <ModelComponent title="Chỉnh sửa thông tin giao hàng" open={isModalOpen} onCancel={handleCancel} footer={null}>
                        <LoadingComponent isLoading={loading}>
                            <Form
                                name="basic"
                                labelCol={{
                                    span: 4,
                                }}
                                wrapperCol={{
                                    span: 20,
                                }}
                                onFinish={onUpdate}
                                // onFinishFailed={onFinishFailed}
                                autoComplete="on"
                                form={formModal}

                            >
                                <Form.Item
                                    label="Name"
                                    name='name'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your name!',
                                        },
                                    ]}
                                >

                                    <Input value={stateUserDetail['name']} onChange={handleOnChangeUserDetail} name='name' />
                                </Form.Item>
                                <Form.Item
                                    label="Phone"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your phone!',
                                        },
                                    ]}
                                >
                                    <Input value={stateUserDetail?.ward} onChange={handleOnChangeUserDetail} name="phone" />
                                </Form.Item>
                                <Form.Item
                                    wrapperCol={{
                                        offset: 0,
                                        span: 24,
                                    }}
                                    label="Address"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your address!',
                                        },
                                    ]}
                                >
                                    <Input value={stateUserDetail?.address} onChange={handleOnChangeUserDetail} name="address" />
                                </Form.Item>
                                <div style={{ display: 'flex', alignItems: 'center', }}>
                                    <h5>Chọn tỉnh/thành phố :</h5>
                                    <Select style={{ width: 200 }} onChange={handleCityChange}>
                                        {cityData.map((city) => (
                                            <Option key={city.code} value={city.code}>
                                                {city.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                                    <h5>Chọn quận/huyện :</h5>
                                    <Select style={{ width: 200 }} disabled={!selectedCity} onChange={handleHuyen}>
                                        {districts.map((district) => (
                                            <Option key={district.code} value={district.code}>
                                                {district.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', }}>
                                    <h5>Chọn Phường</h5>
                                    <Input
                                        style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
                                        value={stateUserDetail?.ward}
                                        onChange={handleOnChangeWard}
                                    />
                                </div>
                                <Form.Item
                                    wrapperCol={{
                                        offset: 20,
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit">
                                        Update
                                    </Button>
                                </Form.Item>
                            </Form>
                        </LoadingComponent>
                    </ModelComponent>
                </Row >
            </div>
            <div className='orderMobile'>
                <div style={{ padding: '0 40px', }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '20px', padding: '10px 0', borderBottom: '1px solid #ccc' }}>
                        <p style={{ fontSize: '14px', fontWeight: 'bold' }}>Giỏ hàng</p>
                        <span style={{ fontSize: '14px' }}>
                            <Checkbox onChange={handleCheckAllChecked} checked={selectedCheck?.length === order?.orderItems?.length} />
                            <span>Tất cả {order?.orderItems?.length} sản phẩm </span>
                            <DeleteOutlined onClick={handleDeleteAllOrder} />
                        </span>
                    </div>
                    <div>

                    </div>
                    {order?.orderItems?.length ? order?.orderItems?.map((item) => {
                        return (
                            <>
                                <div key={item?._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <Checkbox onChange={onChangeCheckbox} value={item?.product} checked={selectedCheck.includes(item?.product)}></Checkbox>
                                    <div>
                                        <img width={'130px'} height={'130px'} objectFit={'cover'} src={item.image} />
                                    </div>
                                    <div style={{ padding: '0 10px' }}>
                                        <h3>{item.name}</h3>
                                        <p>Size: {item.size}</p>
                                        <p>Giảm giá:</p>
                                        <p>Số lượng : {item?.amount}</p>
                                        <WrapperQualityProduct>
                                            <WrapperButtonQuality>
                                                <MinusOutlined style={{ color: "#000", fontSize: "20px" }} onClick={() => handleChangeCount('decrease', item?.product, item?.amount === 1)} />
                                            </WrapperButtonQuality>
                                            {/* <WrapperInputNumber defaultValue={1} size='small' value={numProduct} onChange={handleOnChangeNum} /> */}
                                            <input defaultValue={item?.amount} value={item?.amount} min={1} max={item?.countInStock} onChange={handleOnChangeNum} style={{ width: '30px', border: 'transparent', textAlign: 'center', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }} />
                                            <WrapperButtonQuality>
                                                <PlusOutlined style={{ color: "#000", fontSize: "20px" }} onClick={() => handleChangeCount('increase', item?.product, item?.amount === item?.countInStock)} />
                                            </WrapperButtonQuality>
                                        </WrapperQualityProduct>
                                        <p>Giá :{covertPrice(item?.price)}</p>
                                    </div>
                                </div>
                            </>

                        )
                    }) : (
                        <>
                            <div style={{ width: '500px', height: '100px', display: 'flex', justifyContent: 'flex-start', borderTop: '1px solid #ccc', marginBottom: '10px' }}>
                                <p>Giỏ Hàng Rỗng</p>
                            </div>
                        </>
                    )}
                </div>
                <div style={{ borderTop: '2px dashed #ccc', borderBottom: '2px dashed #ccc', padding: '10px 40px', gap: '10px', display: 'flex', flexDirection: 'column' }}>
                    <div>Tạm tính :{covertPrice(priceMemo)}</div>
                    <div>Giảm giá : {priceDiscount}%</div>
                    <div>Phí giao hàng :{covertPrice(deliveryPrice)}</div>
                    <div>Tổng tiền :{covertPrice(totalPriceAll)}</div>
                </div>
                <ButtonComponent
                    onClick={handlePayment}
                    size={'40'}
                    styleButton={{
                        backgroundColor: "rgb(71,71,71)",
                        height: '48px',
                        width: '100%',
                        border: 'none',
                        borderRadius: "12px",
                        margin: "20px 0"
                    }}
                    textButton={"Thanh Toán"}
                    styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                />
            </div>
        </WrapperDivOrder >
    )
}
