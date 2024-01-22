import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Image, InputNumber, Rate, Row, message } from 'antd'
import { StyleCol, WrapperAddressProduct, WrapperButtonQuality, WrapperDiv, WrapperDivContainer, WrapperImageSmall, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityBtn, WrapperQualityProduct, WrapperRow, WrapperRowMobile, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { ButtonComponent } from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import orderSlide, { addOrderProduct } from '../../redux/slides/orderSlide'
import { covertPrice, initFacebookSDK } from '../../untils'
import { LikeButtonComentFB } from '../LikeButtonComentFB/LikeButtonComentFB'
import { CommentFB } from '../CommentFB/CommentFB'

export const ProductDetailsComponent = ({ idProduct }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [numProduct, setNumProduct] = useState(1);
    const [selectedSize, setSelectedSize] = useState('')
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const fetchGetDetailProduct = async () => {
        const res = await ProductService.getDetailProduct(idProduct);
        return res.response;

    }
    const { data } = useQuery({ queryKey: ['product-detail'], queryFn: fetchGetDetailProduct })
    const productDetail = data?.data

    const handleOnChangeNum = (value) => {

        setNumProduct(Number(value))

    }
    const handleChangeCount = (action, limited) => {
        if (action === 'increase') {
            if (!limited) {
                setNumProduct(numProduct + 1)
            }
        } else {
            if (!limited) {
                setNumProduct(numProduct - 1)
            }

        }
    }
    const handleOrderProduct = () => {
        if (!user?.id) {
            navigate('/login', { state: location?.pathname }) // khi chưa login bị đá sang /login và truyền path theo để khi login tự động vô trang cũ
        } else {
            if (productDetail?.countInStock <= 0 || numProduct > productDetail?.countInStock) {
                message.error("Sản phẩm này đã hết vui lòng chọn sản phẩm khác !")
            } else if (!selectedSize) {
                message.error("Vui lòng chọn size !")
            }
            else {
                if (numProduct > 0 && productDetail) {
                    dispatch(addOrderProduct({
                        orderItem: {
                            name: productDetail?.name,
                            amount: numProduct,
                            image: productDetail?.image,
                            price: productDetail?.price,
                            size: selectedSize,
                            discount: productDetail?.discount,
                            product: productDetail?._id,
                            countInStock: productDetail?.countInStock,
                            type: productDetail?.type,
                        }
                    }))
                    message.success("Đã thêm vào giỏ hàng")

                } else {
                    message.error("Số lượng không được bé hơn 1")
                }
            }
        }
    }
    const onChangeSize = (e) => {
        setSelectedSize(e);
    }
    useEffect(() => {
        initFacebookSDK();
    }, [])
    return (
        <WrapperDivContainer>
            <WrapperDiv>
                <WrapperRow className='rowPc'>
                    <Col span={10} style={{ borderRight: '1px solid #solid', paddingRight: '8px' }}>
                        <Image src={productDetail?.image} alt='image-product' preview={false} width={'500px'} height={'500px'} />
                    </Col >
                    <Col span={14} style={{ padding: ' 0 40px' }}>
                        <WrapperStyleNameProduct>{productDetail?.name}</WrapperStyleNameProduct>
                        <WrapperPriceProduct>
                            <WrapperPriceTextProduct> Giá :{covertPrice(productDetail?.price)}</WrapperPriceTextProduct>
                        </WrapperPriceProduct>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {/* <Rate allowHalf defaultValue={productDetail?.rating} /> */}
                            <WrapperStyleTextSell>Đã bán {productDetail?.selled || 0}</WrapperStyleTextSell>
                        </div>
                        {/* <WrapperAddressProduct>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ paddingRight: '20px' }}>Giao đến:</span>
                            <span style={{ overflow: 'inherit' }} className='address'>{user?.address + " " + user?.ward + " " + user?.districts + " " + user?.city}</span>
                        </div>

                        <span className='change-address'> Đổi địa chỉ</span>

                    </WrapperAddressProduct> */}
                        {/* <LikeButtonComentFB dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href} /> */}
                        <div>
                            <span>HÀNG CÒN SẴN: {productDetail?.countInStock}</span>
                        </div>
                        <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                            <div style={{ margin: "6px 0" }}>Số lượng</div>
                            <WrapperQualityProduct>
                                <WrapperButtonQuality>
                                    <MinusOutlined style={{ color: "#000", fontSize: "20px" }} onClick={() => handleChangeCount('decrease', numProduct === 1)} />
                                </WrapperButtonQuality>
                                {/* <WrapperInputNumber defaultValue={1} size='small' value={numProduct} onChange={handleOnChangeNum} /> */}
                                <input defaultValue={1} min={1} max={productDetail?.countInStock} value={numProduct} onChange={handleOnChangeNum} style={{ width: '30px', border: 'transparent', textAlign: 'center', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }} />
                                <WrapperButtonQuality>
                                    <PlusOutlined style={{ color: "#000", fontSize: "20px" }} onClick={() => handleChangeCount('increase', numProduct === productDetail?.countInStock)} />
                                </WrapperButtonQuality>

                            </WrapperQualityProduct>
                        </div>
                        <div>
                            <Form.Item
                                label="Size"
                                name="size"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your size!',
                                    },
                                ]}
                            >

                                <p>{productDetail?.size.map((item) => {
                                    return (
                                        <Button key={item} style={{
                                            padding: '0 10px', margin: '0 10px',
                                            // backgroundColor: selectedSize == item ? "red" : '#fff',
                                            border: selectedSize == item ? "2px solid black" : "1px solid #ccc"

                                        }} onClick={() => onChangeSize(item)} >{item}</Button>
                                    )
                                })}</p>
                            </Form.Item>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ButtonComponent
                                onClick={handleOrderProduct}
                                size={'40'}
                                styleButton={{
                                    backgroundColor: "rgb(71,71,76)",
                                    height: '48px',
                                    width: '400px',
                                    border: 'none',
                                    borderRadius: "12px"
                                }}
                                textButton={"Thêm vào giỏ"}
                                styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                            >
                            </ButtonComponent>
                            {/* <ButtonComponent

                                size={'40'}
                                styleButton={{
                                    backgroundColor: "transparent",
                                    height: '48px',
                                    width: '220px',
                                    border: '1px solid rgb(13,92,182)',
                                    borderRadius: "12px"
                                }}
                                textButton={"Mua trả sau"}
                                styleTextButton={{ color: "rgb(13,92,182)", fontSize: "15px" }}

                            >
                            </ButtonComponent> */}
                        </div>
                    </Col>

                </WrapperRow >
                {/* <div className='commentFB'>
                    <CommentFB
                        dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/comments#configurator" : window.location.href}
                        width={1200} />
                </div> */}
            </WrapperDiv >
            <div className='mobile' >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <h1 style={{ fontSize: '16px' }}>{productDetail?.name}</h1>
                    <div
                        style={{ borderRadius: '60px' }}>
                        <Image

                            src={productDetail?.image}
                            alt='image-product'
                            preview={false}
                            width={'100%'}
                            height={'300px'}
                        // style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    </div>
                    <h1 style={{ fontSize: '14px' }}>Giá :{covertPrice(productDetail?.price)}</h1>
                    <div>
                        <Form.Item
                            // label="Chọn Size"
                            name="size"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your size!',
                                },
                            ]}
                        >
                            <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ margin: "6px 0" }}>Số lượng</div>
                                <WrapperQualityProduct>
                                    <WrapperButtonQuality>
                                        <MinusOutlined style={{ color: "#000", fontSize: "20px" }} onClick={() => handleChangeCount('decrease', numProduct === 1)} />
                                    </WrapperButtonQuality>
                                    {/* <WrapperInputNumber defaultValue={1} size='small' value={numProduct} onChange={handleOnChangeNum} /> */}
                                    <input defaultValue={1} min={1} max={productDetail?.countInStock} value={numProduct} onChange={handleOnChangeNum} style={{ width: '30px', border: 'transparent', textAlign: 'center', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }} />
                                    <WrapperButtonQuality>
                                        <PlusOutlined style={{ color: "#000", fontSize: "20px" }} onClick={() => handleChangeCount('increase', numProduct === productDetail?.countInStock)} />
                                    </WrapperButtonQuality>

                                </WrapperQualityProduct>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <p>Size</p>
                                <p>{productDetail?.size.map((item) => {
                                    return (
                                        <>
                                            <Button key={item} style={{
                                                padding: '0 10px', margin: '10px 10px',
                                                // backgroundColor: selectedSize == item ? "red" : '#fff',
                                                border: selectedSize == item ? "2px solid black" : "1px solid #ccc"

                                            }} onClick={() => onChangeSize(item)} >{item}</Button>
                                        </>
                                    )
                                })}</p>
                            </div>

                        </Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ButtonComponent
                                onClick={handleOrderProduct}
                                size={'40'}
                                styleButton={{
                                    backgroundColor: "rgb(71,71,76)",
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: "12px"
                                }}
                                textButton={"Thêm vào giỏ"}
                                styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                            >
                            </ButtonComponent>
                        </div>
                    </div>
                </div>

            </div >
            {/* <WrapperRowMobile >
                <h1 style={{ fontSize: '16px' }}>{productDetail?.name}</h1>
                <img className='productImage' src={productDetail?.image}></img>
            </WrapperRowMobile> */}
        </WrapperDivContainer>
    )
}
