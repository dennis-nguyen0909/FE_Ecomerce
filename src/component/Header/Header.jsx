import React, { useEffect, useState } from 'react'
import { Row, Col, Badge, Popover, Button, message } from 'antd'
import { WrapperHeader, WrapperIcon, WrapperLogoHeader, WrapperLogout, WrapperDiv, WrapperDivMenu, WrapperHeaderMobile } from './style'
import { UserOutlined, ShoppingCartOutlined, DribbbleOutlined, SearchOutlined } from '@ant-design/icons'
import { WrapperAccount } from './style'
import { ButtonInputSearch } from '../ButtonInputSearch/ButtonInputSearch'
import * as UserService from '../../services/UserService'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

import { resetUser } from '../../redux/slides/userSlide'
import { searchProduct } from '../../redux/slides/productSlide'
import LoadingComponent from '../LoadingComponent/LoadingComponent'
import { Drawer } from 'antd';
import { DrawerComponent } from '../DrawerComponent/DrawerComponent'
import { InputComponent } from '../InputComponent/InputComponent'
import { ButtonComponent } from '../ButtonComponent/ButtonComponent'
import { WrapperButtonQuality, WrapperQualityProduct } from '../ProductDetailsComponent/style'
import { decreaseAmount, increaseAmount, removeOrderProduct } from '../../redux/slides/orderSlide'
import { covertPrice } from '../../untils'
// import slider4 from '../../assets/images/slider4.jpg'
export const Header = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const location = useLocation()
    const order = useSelector((state) => state.order)
    const [openSearch, setOpenSearch] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [placement, setPlacement] = useState('left');
    const [search, setSearch] = useState('')
    const showDrawerSearch = () => {
        setOpenSearch(true);
    };
    const onCloseSearch = () => {
        setOpenSearch(false);
    };
    const onChangeSearch = (e) => {
        setPlacement(e.target.value);
    };
    const showDrawerCart = () => {
        setOpenCart(true);
    };
    const onCloseCart = () => {
        setOpenCart(false);
    };
    const onChangeCart = (e) => {
        setPlacement(e.target.value);
    };
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const handleNavigateLogin = () => {
        navigate('/login');
    }
    useEffect(() => {
        setLoading(true)
        setUserName(user?.name || ''); // Cập nhật userName
        setUserAvatar(user?.avatar || '');
        setLoading(false)
    }, [user?.name, user?.avatar])
    const handleLogout = async () => {
        setLoading(true);
        await UserService.logoutUser();
        localStorage.removeItem("access_token")
        navigate('/')
        dispatch(resetUser())
        setLoading(false)
    }
    const handleNavigateProfile = () => {
        navigate('/profile-user')
    }
    const handleNavigateAdmin = () => {
        navigate('/system/admin')
    }
    const handleNavigateMyOrder = () => {
        navigate('/my-order')
    }
    const content = (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <WrapperLogout onClick={handleLogout}>Đăng xuất</WrapperLogout>
            <WrapperLogout onClick={handleNavigateProfile}>Thông tin người dùng</WrapperLogout>
            <WrapperLogout onClick={handleNavigateMyOrder}>Đơn hàng của tôi</WrapperLogout>

            {user?.isAdmin && (
                <WrapperLogout onClick={handleNavigateAdmin}>Quản lý hệ thống</WrapperLogout>
            )}
        </div>
    );
    const onSearch = (e) => {
        setSearch(e.target.value)

    }
    const onClickSearch = (e) => {
        dispatch(searchProduct(search))
        navigate('/search-product')
        setOpenSearch(false)
        setSearch('');
    }
    const handleOnChangeNum = (value) => {
        // console.log('value', value)
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
    const handleDeleteOrder = (id) => {
        dispatch(removeOrderProduct(id))
    }
    const handleNavigateOrderPage = () => {

        if (!user?.id) {
            navigate('/login', { state: location?.pathname }) // kh
            setOpenCart(false)
        } else {
            navigate('/order')
            setOpenCart(false)
        }

    }
    return (
        <WrapperDiv>
            <div style={{ backgroundColor: 'black', height: '30px', display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                <DribbbleOutlined style={{ color: '#fff', }} />
            </div>
            <WrapperHeader className='header'>
                <Col onClick={() => navigate('/')} span={10}>
                    <WrapperLogoHeader className='logo-header'>
                        Sneaker Asia
                    </WrapperLogoHeader>
                </Col>
                <Col className='nav' span={5} style={{ position: 'absolute', right: '50px', display: 'flex', gap: '54px', alignItems: 'center' }}>
                    <LoadingComponent isLoading={loading}>
                        <WrapperDivMenu >
                            <WrapperIcon className='hidden-on-mobile'>
                                {!isHiddenSearch && <SearchOutlined style={{ fontSize: '20px' }} onClick={showDrawerSearch} />}
                            </WrapperIcon>
                            <WrapperAccount className='hidden-on-mobile'>
                                {user?.avatar
                                    ? (
                                        <img src={userAvatar} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />)
                                    :
                                    <UserOutlined onClick={handleNavigateLogin} style={{ cursor: 'pointer', fontSize: "20px" }} />
                                }
                                {user?.access_token ?
                                    <>
                                        <Popover content={content} trigger="click">
                                            <div style={{ color: 'rgb(109,171,230)', padding: '0 10px' }}>Xin chào</div>
                                            <div style={{ padding: '0 10px', textDecoration: 'underline' }}>{userName?.length ? userName : user?.email}</div>
                                        </Popover>
                                    </>
                                    :
                                    <div>
                                    </div>

                                }

                                <div className='hidden-on-mobile' style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                                    {!isHiddenCart && (
                                        <>
                                            <WrapperIcon>
                                                <Badge count={order?.orderItems?.length} size='small' >
                                                    <ShoppingCartOutlined style={{ fontSize: "20px" }} onClick={showDrawerCart} />
                                                </Badge>
                                            </WrapperIcon>
                                            {/* <WrapperTextSmall>Giỏ Hàng</WrapperTextSmall> */}
                                        </>
                                    )}
                                </div>
                            </WrapperAccount>
                        </WrapperDivMenu>
                    </LoadingComponent>
                </Col>

            </WrapperHeader>
            <WrapperHeaderMobile className='header-mobile'>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', margin: '10px 10px', paddingBottom: '10px', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button>Menu</Button>
                        <SearchOutlined style={{ fontSize: '20px' }} onClick={showDrawerSearch} />
                    </div>
                    <div style={{ backgroundColor: 'black', color: '#fff', height: '30px', width: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' }}>
                        <p onClick={() => navigate('/')}>Sneaker Asia</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                        {user?.access_token ?
                            <>
                                <Popover content={content} trigger="click">
                                    <UserOutlined style={{ cursor: 'pointer', fontSize: "20px" }} />
                                </Popover>
                            </>
                            :
                            <div>
                                <UserOutlined onClick={handleNavigateLogin} style={{ cursor: 'pointer', fontSize: "20px" }} />
                            </div>

                        }

                        {!isHiddenCart && (
                            <>
                                <WrapperIcon>
                                    <Badge count={order?.orderItems?.length} size='small' >
                                        <ShoppingCartOutlined style={{ fontSize: "20px" }} onClick={showDrawerCart} />
                                    </Badge>
                                </WrapperIcon>
                                {/* <WrapperTextSmall>Giỏ Hàng</WrapperTextSmall> */}
                            </>
                        )}
                    </div>
                </div>
            </WrapperHeaderMobile>
            <DrawerComponent

                title="Sneaker Asia"
                placement={"top"}
                closable={false}
                onClose={onCloseSearch}
                open={openSearch}
                key={placement}

            >
                {!isHiddenSearch && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                        <InputComponent
                            placeholder="Tìm kiếm sản phẩm ...."
                            textButton="Tìm kiếm"
                            size="large"
                            value={search}
                            onChange={onSearch}

                        />
                        <ButtonComponent
                            onClick={onClickSearch}
                            size={'40'}
                            styleButton={{
                                backgroundColor: "rgb(71,71,76)",
                                height: '40px',
                                width: '400px',
                                border: 'none',
                                borderRadius: "12px",
                                margin: "20px 0"
                            }}
                            textButton={"Search"}
                            styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                        >
                        </ButtonComponent>
                    </div>
                )}
            </DrawerComponent>
            <Drawer
                title="Sneaker Asia"
                placement={"right"}
                closable={false}
                onClose={onCloseCart}
                open={openCart}
                key={placement}
                width={'600px'}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', padding: '10px 0', alignItems: 'center' }}>
                    <h3>Giỏ Hàng</h3>
                    <Button onClick={onCloseCart}>X</Button>
                </div>
                {order?.orderItems?.length ? order?.orderItems?.map((item) => {
                    return (
                        <div key={item?.product} style={{ width: '500px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid #ccc', marginBottom: '10px' }}>
                            <div>
                                <img width={'130px'} height={'130px'} objectFit={'cover'} src={item.image} />
                            </div>
                            <div style={{ padding: '0 10px' }}>
                                <h3>Tên sản phẩm :{item?.name}</h3>
                                <p>Giá :{covertPrice(item?.price)}</p>
                                <p>Số lượng : {item?.amount}</p>
                                <p>Size :{item?.size}</p>
                                <WrapperQualityProduct>
                                    <WrapperButtonQuality>
                                        <MinusOutlined style={{ color: "#000", fontSize: "20px" }} onClick={() => handleChangeCount('decrease', item?.product, item?.amount === 1)} />
                                    </WrapperButtonQuality>
                                    {/* <WrapperInputNumber defaultValue={1} size='small' value={numProduct} onChange={handleOnChangeNum} /> */}
                                    <input defaultValue={item?.amount} value={item?.amount} onChange={handleOnChangeNum} style={{ width: '30px', border: 'transparent', textAlign: 'center', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }} />
                                    <WrapperButtonQuality>
                                        <PlusOutlined style={{ color: "#000", fontSize: "20px" }} onClick={() => handleChangeCount('increase', item?.product, item.amount === item.countInStock)} />
                                    </WrapperButtonQuality>
                                </WrapperQualityProduct>
                            </div>
                            <div style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(item?.product)}>X</div>
                        </div>

                    )
                }) : (
                    <>
                        <div style={{ width: '500px', height: '100px', display: 'flex', justifyContent: 'flex-start', borderTop: '1px solid #ccc', marginBottom: '10px' }}>
                            <p>Giỏ Hàng Rỗng</p>
                        </div>
                    </>
                )}
                <div style={{ borderTop: '1px  solid #ccc', borderBottom: '1px solid #ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p>Tạm Tính { }</p>
                        <p>vnd</p>
                    </div>
                    <ButtonComponent
                        onClick={handleNavigateOrderPage}
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
                    >
                    </ButtonComponent>
                </div>
            </Drawer>
        </WrapperDiv>
    )
}
