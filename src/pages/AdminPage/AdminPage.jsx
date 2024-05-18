import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../untils';
import { UserOutlined, AppstoreOutlined, SettingOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Header } from '../../component/Header/Header'
import { AdminUser } from '../../component/AdminUser/AdminUser';
import { AdminProduct } from '../../component/AdminProduct/AdminProduct';
import { AdminOrder } from '../../component/AdminOrder/AdminOrder';
import { WrapperDivContainer } from './style';
import AdminShop from '../../component/AdminShop/AdminShop';
export const AdminPage = () => {
    const [keySelected, setKeySelected] = useState('');
    const items = [
        getItem('Quản lý người dùng', 'user', <UserOutlined />),
        getItem('Quản lý sản phẩm', 'product', <AppstoreOutlined />),
        getItem('Quản lý đơn hàng', 'order', <ShoppingCartOutlined />),
        {
            type: 'divider',
        },
        getItem('Cài đặt', 'sub4', <SettingOutlined />, [
            getItem('Quản lý shop', 'shop'),
            getItem('Option 10', '10'),
            getItem('Option 11', '11'),
            getItem('Option 12', '12'),
        ]),
    ];
    const onClick = ({ key }) => {
        setKeySelected(key)
    };
    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return (
                    <AdminUser />
                )
            case 'product':
                return (
                    <AdminProduct />
                )
            case 'order':
                return (
                    <AdminOrder />
                )
            case 'shop':
                    return(
                        <AdminShop/>
                    )
            default:
                return <></>
        }
    }
    return (
        <WrapperDivContainer>
            <div className='pc'>
                <div>
                    <Header isHiddenSearch isHiddenCart />
                </div>
                <div style={{ display: 'flex' }}>
                    <Menu
                        onClick={onClick}
                        style={{
                            width: 256,
                            boxShadow: '1px 1px 2px #ccc',
                            height: '1500px'
                        }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        items={items}
                    />
                    <div style={{ color: 'black', flex: '1' }}>
                        {renderPage(keySelected)}
                    </div>
                </div >
            </div>
            <div className='mobile'>
                <div>
                    <Header isHiddenSearch isHiddenCart />
                </div>
                <div style={{ display: 'flex' }}>
                    <Menu
                        onClick={onClick}
                        style={{
                            width: 50,
                            boxShadow: '1px 1px 2px #ccc',
                            height: '1500px'
                        }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        items={items}
                    />
                    <div style={{ color: 'black', flex: '1' }}>
                        {renderPage(keySelected)}
                    </div>
                </div >
            </div>
        </WrapperDivContainer>
    )
}
