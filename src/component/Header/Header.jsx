import React, { useEffect, useState } from 'react'
import { Row, Col, Badge, Popover, Button, message, Menu, Dropdown, Switch, } from 'antd'
import { WrapperHeader, WrapperIcon, WrapperLogoHeader, WrapperLogout, WrapperDiv, WrapperDivMenu, WrapperHeaderMobile, WrapperDivProduct, WrapperSearch } from './style'
import { UserOutlined, ShoppingCartOutlined, DribbbleOutlined, SearchOutlined, MenuOutlined, AppstoreOutlined, RightOutlined, SettingOutlined, ArrowRightOutlined, AudioOutlined } from '@ant-design/icons'
import { WrapperAccount } from './style'
import { AudioRecorder } from 'react-audio-voice-recorder';
import { ButtonInputSearch } from '../ButtonInputSearch/ButtonInputSearch'
import * as UserService from '../../services/UserService'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { PlusOutlined, MinusOutlined,AudioMutedOutlined } from '@ant-design/icons'
import * as ProductService from '../../services/ProductService'
import * as ShopService  from '../../services/SearchService'
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
import { TypeProduct } from '../TypeProduct/TypeProduct'
// import slider4 from '../../assets/images/slider4.jpg'
import * as SearchService from '../../services/SearchService'
import axios from 'axios'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
export const Header = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const location = useLocation()
    const order = useSelector((state) => state.order)
    const [openSearch, setOpenSearch] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [placement, setPlacement] = useState('left');
    const [search, setSearch] = useState('')
    const [typeProduct, setTypeProduct] = useState([])
    const [current, setCurrent] = useState('1');
    const [theme, setTheme] = useState('light');
    const [history, setHistory] = useState([])
    const [searchVoice,setSearchVoice]=useState("")
    const{transcript,resetTranscript}=useSpeechRecognition({
        lang:'vi-VN'
    });
    const[shops,setShops]=useState([])
    const fetchShop = async()=>{
        const res = await ShopService.getAllShop();
        console.log(res)
        setShops(res.response.data)
    }
    useEffect(()=>{
        fetchShop()
    },[])

    const synth=window.speechSynthesis;
    const speak =(text)=>{
        if(synth.speaking){
            console.log("bussy")
            return 
        }
        const utter = new SpeechSynthesisUtterance(text)
        utter.onend=()=>{
            console.log("Speeack")
        }
        utter.onerror=err=>{
            console.log(err)
        }
        synth.speak(utter)
    }
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        setIsListening(true);
        SpeechRecognition.startListening();
    };

    const stopListening = () => {
        setIsListening(false);
        SpeechRecognition.stopListening();
    };

    useEffect(()=>{
        if(transcript){
            setTimeout(()=>{
                setSearchVoice(transcript)
            },[1000])
        }
    },[transcript])

    useEffect(()=>{
        const word="danh sách"
        const word2="vào trang"
        if(searchVoice.startsWith(word)){
            let result ="";
            result = searchVoice.substring(word.length).trim();
            result=result.charAt(0,1).toUpperCase()+result.slice(1)
            navigate(`/product/${result}`, { state: result })
            stopListening()
            resetTranscript()
        }else if(searchVoice.startsWith(word2)){
            let result ="";
            result = searchVoice.substring(word.length).trim();
            result=result.charAt(0,1).toUpperCase()+result.slice(1)
            navigate(`/product-sale`)
            stopListening()
            resetTranscript()
        }
        else if(searchVoice){
            dispatch(searchProduct(searchVoice))
            navigate('/search-product')
            fetchSearch(searchVoice)
            setOpenSearch(false)
            setSearch('');
            setTimeout(()=>{
                stopListening()
            },[500])
            resetTranscript()        
        }
    },[searchVoice])
    const handleSearch=()=>{
        setSearchVoice(transcript)
        resetTranscript()
    }
    const changeTheme = (value) => {
        setTheme(value ? 'dark' : 'light');
    };
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    const showDrawerSearch = () => {
        setOpenSearch(true);
    };
    const showDrawerMenu = () => {
        setOpenMenu(true);
    }

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
    const onCloseMenu = () => {
        setOpenMenu(false);
    }

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
    console.log("user",user)
    const content = (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <WrapperLogout onClick={handleLogout}>Đăng xuất</WrapperLogout>
            <WrapperLogout onClick={handleNavigateProfile}>Thông tin người dùng</WrapperLogout>
            <WrapperLogout onClick={handleNavigateMyOrder}>Đơn hàng của tôi</WrapperLogout>

            {(user?.isAdmin || user?.isEmployee) && (
                <WrapperLogout onClick={handleNavigateAdmin}>Quản lý hệ thống</WrapperLogout>
            )}
        </div>
    );
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }
    const generateProductMenuItems = () => {
        return typeProduct.map((type, index) => (
            <Menu.Item key={`product${index + 1}`}>{type}</Menu.Item>
        ));
    };

    const items = [
        getItem('Shop', 'shop', []),
        // getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
        //     getItem('Option 5', '5'),
        //     getItem('Option 6', '6'),
        //     getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
        // ]),
        getItem('Navigation Three', 'sub4', <SettingOutlined />, [
            getItem('Option 9', '9'),
            getItem('Option 10', '10'),
            getItem('Option 11', '11'),
            getItem('Option 12', '12'),
        ]),
    ];
    const onSearch = (e) => {
        setSearch(e.target.value)

    }
    const fetchSearch = async (search) => {
        const res = await SearchService.createSearch(search);
        console.log(res)
    }
    const onClickSearch = (e) => {
        dispatch(searchProduct(search))
        navigate('/search-product')
        fetchSearch(search)
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

    const fetchTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === 'Ok') {
            setTypeProduct(res?.data);
        }
    }
    useEffect(() => {
        fetchTypeProduct();
    }, [])

    const handleNavigateTypeMenu = () => {
        setOpenCart(true)
    }
    const handleOnClickMenu = (e) => {
        setOpenMenu(false)
    }
    const sum = order?.orderItems?.reduce((acc, cur) => {
        return acc + cur.price * cur.amount;
    }, 0)

    const handleNavigatePageSales = () => {
        navigate('/product-sales')
    }
    const getAllSearch = async () => {
        const res = await SearchService.getAllSearch();
        setHistory(res.response.searchHistory)
    }
    useEffect(() => {
        getAllSearch();
    }, [search])
    const [blod, setBold] = useState([])
    const addAudioElement = async (blob) => {
        const formData = new FormData();
        formData.append("audio", blob);
        try {
            const res = await axios.post("http://localhost:8080/upload", formData);
            console.log(res.data);
        } catch (error) {
            console.error('Error uploading recording:', error);
        }

        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        document.body.appendChild(audio);
    };
    return (
        <WrapperDiv>
            <div style={{ backgroundColor: 'black', height: '30px', display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                <DribbbleOutlined style={{ color: '#fff', }} />
            </div>
            <WrapperHeader className='header'>
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate('/')} span={10}>
                    <WrapperLogoHeader className='logo-header'>
                        {shops && shops[0] && shops[0]?.name ?shops[0]?.name :"Sneaker Asia"}
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
                                <div className='hidden-on-mobile' style={{ display: 'flex', justifyContent: "center", alignItems: "center", marginLeft: '10px' }}>
                                    {!isHiddenCart && (
                                        <>
                                            <WrapperIcon>
                                                <Badge count={order?.orderItems?.length} size='small' >
                                                    <ShoppingCartOutlined style={{ fontSize: "20px" }} onClick={showDrawerCart} />
                                                </Badge>
                                            </WrapperIcon>
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
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', gap: '10px' }}>
                        <MenuOutlined onClick={showDrawerMenu} style={{ cursor: 'pointer' }} />
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
                    <WrapperSearch>
                        <div className='searchPc'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                                <InputComponent
                                    placeholder="Tìm kiếm sản phẩm ...."
                                    textButton="Tìm kiếm"
                                    size="large"
                                    value={transcript? transcript: search}
                                    onChange={onSearch}

                                />
                         {isListening ? (
                                <AudioOutlined
                                    onClick={stopListening}
                                    style={{ position: 'absolute', right: '400px', fontSize: '18px', cursor: 'pointer' }}
                                />
                            ) : (
                                <AudioMutedOutlined
                                    onClick={startListening}
                                    style={{ position: 'absolute', right: '400px', fontSize: '18px', cursor: 'pointer' }}
                                />
                            )}
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
                            <div>
                                <p>Lịch sử tìm kiếm gần đây</p>
                                {history?.map((htr, index) => {
                                    return (
                                        index < 4 && (<>
                                            <p style={{ marginLeft: '20px', color: '#ccc' }} key={index}>
                                                {htr.keyword}
                                            </p>
                                        </>)
                                    )
                                })}
                            </div>
                        </div>
                        <div className='searchMobile'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <InputComponent
                                    placeholder="Tìm kiếm sản phẩm ...."
                                    textButton="Tìm kiếm"
                                    size="large"
                                    value={search}
                                    onChange={onSearch}
                                />
                                {/* <AudioOutlined /> */}
                                <ButtonComponent
                                    onClick={onClickSearch}
                                    size={'40'}
                                    styleButton={{
                                        backgroundColor: "rgb(71,71,76)",
                                        height: '40px',
                                        width: '100%',
                                        border: 'none',
                                        borderRadius: "12px",
                                        margin: "20px 0"
                                    }}
                                    textButton={"Search"}
                                    styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                                >
                                </ButtonComponent>
                            </div>
                        </div>
                    </WrapperSearch>
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
                        <WrapperDivProduct className='itemProduct' key={item?.product}>
                            <div>
                                <img width={'130px'} height={'130px'} objectFit={'cover'} src={item.image} />
                            </div>
                            <div style={{ padding: '0 10px' }}>
                                <h3>{item?.name}</h3>
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
                        </WrapperDivProduct>

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
                        <p>Tạm Tính</p>
                        <p> {covertPrice(sum)}</p>

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

            <Drawer

                placement={"left"}
                closable={false}
                onClose={onCloseMenu}
                open={openMenu}
                key={placement}
                width={'600px'}
            >
                <div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                        <h3>Sneaker Asia</h3>
                        <Button onClick={onCloseMenu}>X</Button>
                    </div>
                    <div>
                        <div onClick={() => handleNavigateTypeMenu} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                            <p>Shop</p>
                            <ArrowRightOutlined />
                        </div>
                    </div>
                    <>
                        <Menu mode="inline" onClick={handleOnClickMenu} >
                            <Menu.SubMenu key="products" title="Sản phẩm">
                                {typeProduct.map((item, index) => {
                                    return (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
                                            <Menu.Item key={`product-${index}`}  >
                                                <TypeProduct name={item} />
                                            </Menu.Item>
                                        </div>
                                    )
                                })}
                            </Menu.SubMenu>
                            <Menu.Item key="sales" onClick={handleNavigatePageSales}>
                                Giảm giá
                            </Menu.Item>
                            <Menu.Item key="chamsoc" >
                                Chăm sóc khách hàng
                            </Menu.Item>
                            <Menu.Item key="collection" >
                                Bộ sưu tập
                            </Menu.Item>
                        </Menu>
                    </>
                </div>
            </Drawer>
        </WrapperDiv>
    )
}
