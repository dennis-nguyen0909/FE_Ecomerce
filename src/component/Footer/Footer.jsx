import React, { useState } from 'react'
import { WrapperDiv, WrapperPc, WrapperMobile } from './style'
import { FacebookFilled, InstagramFilled, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Button, Divider, Input, message } from 'antd'
import { useNavigate } from 'react-router'
export const Footer = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const onChangeInput = (e) => {
        setEmail(e.target.value);
    }
    const handleClick = () => {
        message.success(`Tin sẽ cập nhật đến email ${email}`)
    }
    const handleNavigateFb = () => {
        navigate('/https://www.facebook.com/profile.php?id=61555040744458');
    }
    return (
        <WrapperDiv>
            <WrapperPc className='footerPc'>
                <WrapperDiv style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <div>
                        <h2>Sneaker Asia</h2>
                        <div style={{ display: 'flex', fontSize: '24px', color: '#fff', gap: '10px', alignContent: 'center', justifyContent: 'center' }}>
                            <a style={{ color: '#fff' }} href='https://www.facebook.com/profile.php?id=61555040744458'>
                                <FacebookFilled />
                            </a>
                            <a style={{ color: '#fff' }}>
                                <InstagramFilled />
                            </a>
                        </div>
                    </div>
                    <div >
                        <h2>Chính Sách</h2>
                        <div>
                            <p>Hướng dẫn đổi hàng</p>
                            <p>Chính sách bảo hành</p>
                            <p>Chính sách vận chuyển</p>
                            <p>Hướng dẫn đổi hàng</p>
                        </div>
                    </div>

                    <div>
                        <h2>Fanpage</h2>
                        <iframe
                            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61555040744458&tabs=timeline&width=&height=&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                            width=""
                            height=""
                            style={{ border: 'none', overflow: 'hidden', width: '350px' }}
                            scrolling="no"
                            frameBorder="0"
                            allowFullScreen={true}
                            allow="encrypted-media"
                        ></iframe>

                    </div>
                    <div>
                        <h2>Liên hệ</h2>
                        <p><MailOutlined /> duyxitrum000@gmail.com</p>
                        <p><PhoneOutlined />+84 898 151737</p>
                    </div>

                </WrapperDiv>
                <div style={{ margin: '50px 100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgb(30,30,30)' }}>
                    <div style={{ display: 'flex', gap: '30px' }}>
                        <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '400' }}>Đăng ký nhận tin</h2>
                        <div style={{ display: 'flex', width: '400px', alignItems: 'center', gap: '10px' }}>
                            <Input placeholder='Nhập email' onChange={(e) => onChangeInput(e)}></Input>
                            <Button style={{ color: '#fff', background: 'black', border: 'none' }} onClick={handleClick}>Đăng Ký</Button>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '30px' }}>
                    <div>Copyright © 2020 SneakerAsia.vn | Powered by Sapo</div>
                </div>

            </WrapperPc>
            <WrapperMobile style={{ backgroundColor: 'rgb(37,37,37)' }} className='footerMobile'>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column', backgroundColor: 'rgb(37,37,37)' }}>
                    <div>
                        <h2>Sneaker Asia</h2>
                        <div style={{ display: 'flex', fontSize: '24px', color: '#fff', gap: '10px' }}>
                            <a href='https://www.facebook.com/profile.php?id=61555040744458'>
                                <FacebookFilled />
                            </a>
                            <InstagramFilled />
                        </div>
                    </div>
                    <div >
                        <h2>Chính Sách</h2>
                        <div>
                            <p>Hướng dẫn đổi hàng</p>
                            <p>Chính sách bảo hành</p>
                            <p>Chính sách vận chuyển</p>
                            <p>Hướng dẫn đổi hàng</p>
                        </div>
                    </div>
                    <div>
                        <h2>Fanpage</h2>
                        <iframe
                            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61555040744458&tabs=timeline&width=&height=&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                            width=""
                            height=""
                            style={{ border: 'none', overflow: 'hidden', width: '100%' }}
                            scrolling="no"
                            frameBorder="0"
                            allowFullScreen={true}
                            allow="encrypted-media"
                        ></iframe>

                    </div>
                    <div>
                        <h2>Liên hệ</h2>
                        <p><MailOutlined /> duyxitrum000@gmail.com</p>
                        <p><PhoneOutlined />+84 898 151737</p>
                    </div>
                    <Divider />
                    <div style={{ height: 'fit-content', display: 'flex', background: 'rgb(30,30,30)', width: 'fit-content', margin: '0 auto', padding: '20px 10px', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '400' }}>Đăng ký nhận tin</h2>
                            <div style={{ display: 'flex', width: '300px', alignItems: 'center', gap: '10px' }}>
                                <Input placeholder='Nhập email' onChange={(e) => onChangeInput(e)}></Input>
                                <Button style={{ color: '#fff', background: 'black', border: 'none' }} onClick={handleClick}>Đăng Ký</Button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px', marginBottom: '10px' }}>
                        <div>Copyright © 2020 SneakerAsia.vn | Powered by Sapo</div>
                    </div>
                </div>
            </WrapperMobile>



        </WrapperDiv>
    )
}
