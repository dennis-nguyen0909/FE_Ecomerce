import React, { useEffect, useRef, useState } from 'react'
import { TypeProduct } from '../../component/TypeProduct/TypeProduct'
import { WrapperContainer, WrapperDivNav, WrapperDivTextHover, WrapperProduct, WrapperDiv, WrapperButtonMore } from './style'
import { SliderComponent } from '../../component/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/1.jpeg'
import slider2 from '../../assets/images/2.jpeg'
import slider3 from '../../assets/images/3.jpeg'
import slider4 from '../../assets/images/4.jpeg'
import slider5 from '../../assets/images/5.jpeg'
import slider6 from '../../assets/images/6.jpeg'
import { CardComponent } from '../../component/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService'
import * as UserService from '../../services/UserService'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent'
import { DownOutlined, SmileOutlined, MessageOutlined ,RobotOutlined ,UserOutlined} from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, Popover, Skeleton, Space, Spin } from 'antd';
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../component/Footer/Footer'

export const HomePage = () => {
    // const arr = ['About Us', 'Cửa Hàng', 'Giảm giá', 'Liên hệ', 'Chăm sóc khách hàng']
    const searchProduct = useSelector((state) => state.product?.search)
    const searchDebounce = useDebounce(searchProduct, 1000)
    const [limit, setLimit] = useState(9)
    const [typeProduct, setTypeProduct] = useState([])
    const user = useSelector((state) => state.user)

    const menuTypeProducts = (
        <Menu style={{ zIndex: 10000 }} >
            {typeProduct.map((type) => (
                <Menu.Item key={type} style={{ padding: '8px', width: '200px' }}>
                    <TypeProduct name={type} />
                </Menu.Item>
            ))}
        </Menu>
    );
    const fetchProduct = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = ''
        const res = await ProductService.getAllProduct(search, limit);
        return res;
    }
    const { data: products, isLoading } = useQuery({ queryKey: ['products', limit, searchDebounce], queryFn: fetchProduct, retryDelay: 1000, retry: 3 })
    const handleLoadMore = () => {
        setLimit((prev) => prev + 9)
    }
    const handleReset = () => {
        setLimit(3)
    }

    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1); // Bắt đầu từ trang đầu tiên
    const [product2, setProduct2] = useState([]);
    const [loadProduct, setLoadProduct] = useState(true)
    const elementRef = useRef(null);

    function onIntersection(entries) {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore) {
            fetchMoreProduct();
        }
    }

    const fetchMoreProduct = async () => {
        const search = '';
        const res = await ProductService.getAllProduct(search, page, limit); // Chuyển trang vào API
        if (res.totalPage <= 1) {
            setHasMore(false);
            setLoadProduct(false);
        } else {
            setProduct2(res.data);
            setPage((prev) => prev + 1); // Tăng số trang

        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection);
        if (observer && elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, [product2]); // Thêm page vào dependency array để useEffect cập nhật khi page thay đổi
    const fetchTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === 'Ok') {
            setTypeProduct(res?.data);
        }
    }
    useEffect(() => {
        fetchTypeProduct();
    }, [])
    const navigate = useNavigate();
    const handleNavigatePageSales = () => {
        navigate('/product-sales')
    }
    const handleNavigatePageSupport = () => {
        navigate('/support')
    }
    console.log('product', product2.map((item) => item._id))
    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };
    const [message, setMessage] = useState("")
    const[messageChat,setMessageChat]=useState([])
    const [responseGPT, setResponseGPT] = useState("")
    const [loading, setLoading] = useState(false)
    const handleCallAPIChat = async () => {
        console.log("mess",message)
        // if (message.trim() === '') return;
        setMessageChat(message);
        setLoading(true);
        try {
            const res = await UserService.handleCallChatGPT(message);
            console.log("res",res)
            if(res?.response?.message){
                setResponseGPT(res?.response?.message);
                setMessage("");
            }else{
                setResponseGPT("Xin lỗi mình không biết trả lời câu hỏi này.Bạn hãy thử hỏi câu khác nhé!")
                setMessage("")
            }
        } catch (error) {
            console.error("Error calling API:", error);
        } finally {
            setLoading(false);
        }
    }
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
    const handleOnChangeMessage=(e)=>{
        setMessage(e.target.value)
    }
    const contentChatGPT = () => {
        return (
            <div style={{ width: '500px', height: '500px', position: 'relative' }}>
                <div style={{ overflow: 'auto', height: '500px' }}>
                    {/* <div>{speak(responseGPT)}</div> */}
                    {!loading ? (
                        responseGPT?.length>0 ?
                        <div style={{display:'flex',alignItems:'center',gap:"10px"}}>
                            <RobotOutlined />
                            <p style={{ color: 'red' ,backgroundColor:"#ccc",borderRadius:'30',borderRadius:'20px',padding:"10px 20px",textAlign:'center'}}> 
                            {responseGPT}</p> 
                        </div>
                        :<div style={{display:'flex',alignItems:'center',gap:"10px"}}>
                            <RobotOutlined />
                            <p style={{ color: 'red' ,backgroundColor:"#ccc",borderRadius:'30',borderRadius:'20px',padding:"10px 20px",textAlign:'center'}}> 
                            Bạn có câu hỏi gì không ?</p> 
                        </div>


                        //  <div style={{display:'flex',width:'100%',alignItems:'center',gap:10}}>
                        //     {responseGPT>0 ? (
                        //         <>
                        //         <RobotOutlined />
                        //         <p style={{ color: 'red' ,backgroundColor:"#ccc",borderRadius:'30',borderRadius:'20px',padding:"10px 20px",textAlign:'center'}}> {responseGPT}</p> 
                        //         </>

                        //     ) :(
                        //         <>
                        //         <RobotOutlined />
                        //         <p style={{ color: 'red' ,backgroundColor:"#ccc",borderRadius:'30',borderRadius:'20px',padding:"10px 20px",textAlign:'center'}}>Bạn cần hổ trợ ?</p> 
                        //         </>

                        //     )}
                        // </div>
                        )
                        : <span><Spin /></span>}
                        <div>
                            {messageChat?.length>0 &&
                            (
                                <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center',gap:20,width:"100%" }}>
                                <span style={{backgroundColor:"rgb(18,152,247) " ,padding:"10px 15px",borderRadius:'20px'}} >{messageChat}</span>
                                <UserOutlined />
                            </div>
                            )}
                        </div>
                </div>
                <div style={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', gap: '20px', marginTop: '80px' }}>
                    <Input value={message} onChange={(e) => handleOnChangeMessage(e)} />
                    <Button onClick={handleCallAPIChat}>Send</Button>
                </div>
            </div>
        )
    }
    return (
        <WrapperContainer>
            <WrapperDiv className='pc'>
                <WrapperDivNav className='navBar'>
                    <div>
                        <Dropdown overlay={menuTypeProducts} placement="bottom">
                            <WrapperDivTextHover style={{ cursor: 'pointer' }}>
                                Sản Phẩm
                            </WrapperDivTextHover>
                        </Dropdown>
                    </div>
                    <div>
                        <WrapperDivTextHover style={{ color: 'rgb(255,116,109)' }}
                            onClick={handleNavigatePageSales}>Giảm Giá</WrapperDivTextHover>
                    </div>

                    <div>
                        <WrapperDivTextHover onClick={handleNavigatePageSupport}>
                            Chăm Sóc Khách Hàng
                        </WrapperDivTextHover>
                    </div>
                    <div>
                        <WrapperDivTextHover>Bộ sưu tập</WrapperDivTextHover>
                    </div>
                </WrapperDivNav >

                <div className='body' style={{ width: '100%', backgroundColor: "#fff" }}>
                    <div id="container" style={{ height: 'fit-content' }}>
                        <div style={{ position: 'relative' }} >
                            <SliderComponent arrImages={[slider1, slider2, slider3, slider4, slider5, slider6]} />
                            <Popover
                                content={contentChatGPT}
                                title="Trợ lý ảo"
                                trigger="click"
                                open={open}
                                onOpenChange={handleOpenChange}>

                                <div
                                    style={{ position: 'fixed', width: '50px', height: '50px', borderRadius: '50%', bottom: '80px', right: '20px', zIndex: '9999', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#fff' }}>
                                    <MessageOutlined style={{ fontSize: '30px' }} />
                                </div>
                            </Popover>
                        </div>
                        <div style={{
                            display: 'flex', justifyContent: 'center',
                            alignItems: 'center', margin: '20px 0', fontSize: '30px',
                        }}>Sản Phẩm Mới</div>
                        <LoadingComponent isLoading={isLoading}>
                            <WrapperProduct>
                                {products?.data ? (
                                    products?.data?.map((product) => (
                                        <CardComponent
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
                                    <p>No products available</p>
                                )}
                            </WrapperProduct>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
                                {products?.total !== products?.data.length || !products?.totalPage === 1 ? (
                                    < WrapperButtonMore type={'outline'} textButton={'Xem thêm'} styleButton={{
                                        border: '1px solid #ccc', color: 'black', width: '240px',
                                        height: '38px', borderRadius: '4px',
                                    }}
                                        styleTextButton={{ fontWeight: '500' }} onClick={handleLoadMore}
                                    />)
                                    : (
                                        <>
                                        </>
                                    )
                                }
                            </div>
                        </LoadingComponent>
                    </div>
                </div>
            </WrapperDiv >
            <WrapperDiv className='mobile'>
                <WrapperDivNav className='navBar'>
                    <div>
                        <Dropdown overlay={menuTypeProducts} placement="bottom">
                            <WrapperDivTextHover style={{ cursor: 'pointer' }}>
                                Sản Phẩm
                            </WrapperDivTextHover>
                        </Dropdown>
                    </div>
                    <div>
                        <WrapperDivTextHover style={{ color: 'rgb(255,116,109)' }}
                            onClick={handleNavigatePageSales}>Giảm Giá</WrapperDivTextHover>
                    </div>

                    <div>
                        <WrapperDivTextHover onClick={handleNavigatePageSupport}>
                            Chăm Sóc Khách Hàng
                        </WrapperDivTextHover>
                    </div>
                    <div>

                        <WrapperDivTextHover>Bộ sưu tập</WrapperDivTextHover>
                    </div>
                </WrapperDivNav >
                <div className='body' style={{ width: '100%', backgroundColor: "#fff" }}>
                    <div id="container" style={{ height: 'fit-content' }}>
                        <SliderComponent arrImages={[slider1, slider2, slider3, slider4, slider5, slider6]} />
                        <div style={{
                            display: 'flex', justifyContent: 'center',
                            alignItems: 'center', margin: '20px 0', fontSize: '30px',
                        }}>Sản Phẩm Mới</div>

                        <LoadingComponent isLoading={isLoading}>
                            <WrapperProduct>
                                {
                                    product2?.map((product) => (
                                        <CardComponent
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
                                }
                                {hasMore && <div ref={elementRef} style={{ width: '100%', height: '80px' }}><Skeleton active /></div>}
                            </WrapperProduct>
                            {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
                                {products?.total !== products?.data.length || !products?.totalPage === 1 ? (
                                    < WrapperButtonMore type={'outline'} textButton={'Xem thêm'} styleButton={{
                                        border: '1px solid #ccc', color: 'black', width: '240px',
                                        height: '38px', borderRadius: '4px',
                                    }}
                                        styleTextButton={{ fontWeight: '500' }} onClick={handleLoadMore}
                                    />)
                                    : (
                                        <>
                                        </>
                                    )
                                }
                            </div> */}
                        </LoadingComponent>
                    </div>
                </div>
            </WrapperDiv >
            <Footer />
        </WrapperContainer>
    )
}
