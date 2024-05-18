import { Button, Input, Modal, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import * as ShopService from '../../services/SearchService'
const AdminShop = () => {
    const [shops,setShops]=useState([])
    const [visibleModal,setVisibleModal]=useState(false)
    const [nameInput,setNameInput]=useState("")
    const fetchShop = async()=>{
        const res = await ShopService.getAllShop();
        if(res.response.data){
            setShops(res.response.data)
        }else{

        }
    }
    useEffect(()=>{
        fetchShop()
    },[])
    const columns = [
        {
          title: 'ID',
          dataIndex: '_id',
          key: '_id',
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Version',
          dataIndex: '__v',
          key: '__v',
        }
      ];
      const handleOpenModalAdd = ()=>{
        setVisibleModal(true)
      }
      const handleAddShop =async()=>{
        console.log("name",nameInput)
        const res = await ShopService.createShop(nameInput);
        if(res?.response?.data){
            setVisibleModal(false)
            setNameInput("")
            fetchShop();
            message.success("Tạo thành công")
        }else{
            message.error("Tạo thất bại")
        }
      }
      const handleOnChangeInputName = (e)=>{
        setNameInput(e.target.value)
      }
  return (
    <div style={{margin:'20px 50px'}}>
        <h1>Quản lý shop</h1>
        <Button onClick={handleOpenModalAdd}>Thêm</Button>
        <Table columns={columns} dataSource={shops}  rowKey="_id" />
        <Modal
        footer={null}
        
        visible={visibleModal}>
            <h1>Thêm shop</h1>
            <label htmlFor="">Tên shop</label>
            <Input onChange={handleOnChangeInputName} type='text' placeholder='Nhập vào tên shop'></Input>
            <div style={{display:"flex",justifyContent:"end",marginTop:"20px"}}>
            <Button onClick={handleAddShop}>Tạo</Button>
            </div>
        </Modal>
    </div>
  )
}

export default AdminShop