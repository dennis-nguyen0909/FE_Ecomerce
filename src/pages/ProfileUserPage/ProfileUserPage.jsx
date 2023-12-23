import React, { useState } from 'react'
import { WrapperContainerProfile, WrapperDivContainer, WrapperLabelText } from './style'
import { InputForm } from '../../component/InputForm/InputForm'
import { ButtonComponent } from '../../component/ButtonComponent/ButtonComponent'
import { Col, Form, Image, Input, Row, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useMutationHook } from '../../hooks/userMutationHook'
import * as UserService from '../../services/UserService'

import LoadingComponent from '../../component/LoadingComponent/LoadingComponent'
import { useEffect } from 'react'
import { updateUser } from '../../redux/slides/userSlide'
import { getBase64 } from '../../untils'

import avatarDefault from '../../assets/images/avatar.jpeg'
import axios from 'axios'

export const ProfileUserPage = () => {
    const user = useSelector((state) => state.user)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const [isAdmin, setisAdmin] = useState('')
    const dispatch = useDispatch();
    const postDetail = (pics) => {
        if (pics.type === "image/png" || pics.type === "image/jpeg") {
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', "chat-app");
            data.append('cloud_name', "dxtz2g7ga");

            axios.post('https://api.cloudinary.com/v1_1/dxtz2g7ga/image/upload', data)
                .then(res => res.data)
                // .then((res) => res.json())
                .then(data => {
                    setAvatar(data.url.toString());

                })
                .catch(err => {
                    // console.log(err);
                })
        }
    }


    const mutation = useMutationHook(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
        }
    )

    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangeName = (value) => {
        setName(value)
    }
    const handleOnChangeAdmin = (value) => {
        setisAdmin(value)
    }
    const handleOnChangePhone = (value) => {
        setPhone(value)
    }
    const handleOnChangeAddress = (value) => {
        setAddress(value)
    }
    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setAddress(user?.address)
        setPhone(user?.phone)
        setAvatar(user?.avatar)
    }, [user])
    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setAvatar(file.preview)
    }
    const { data, isSuccess, isError, isPending } = mutation

    useEffect(() => {
        if (isSuccess) {
            message.success("Cập nhật thành công !")
            handleGetDetailUser(user?.id, user?.access_token)

        } else if (isError) {
            message.error("Cập nhật thất bại !")
        }
    }, [isSuccess, isError])
    const handleUpdate = (e) => {
        mutation.mutate({
            id: user?.id, name, phone, address, avatar, access_token: user?.access_token
        })

    }
    const handleGetDetailUser = async (id, access_token) => {
        const res = await UserService.getDetailUser(id, access_token); // lấy thông tin user từ token và id
        dispatch(updateUser({ ...res?.response.data, access_token: access_token }))
        // truyền data mà res trả về vào redux
        // thì bên userSlide sẽ nhận được state và action trong đó action.payload là data user
    }
    return (
        <>
            <Row style={{ padding: '0 120px' }}>
                <Col span={10} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                        {avatar ? (
                            <img preview={false} src={avatar} style={{
                                height: '250px', width: '250px', objectFit: 'cover', borderRadius: '50%'
                            }} />
                        ) : <Image src={avatarDefault} style={{
                            height: '250px', width: '250px', objectFit: 'cover', borderRadius: '50%'
                        }} />}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <WrapperLabelText style={{ color: 'black', fontWeight: 'bold', fontSize: '30px' }}>{user.name}</WrapperLabelText>
                        <WrapperLabelText>{user.email}</WrapperLabelText>
                        {/* <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </WrapperUploadFile> */}
                        <Form id='pic' style={{ marginTop: '20px' }} >
                            <label>Update Avatar</label>
                            <Input type='file'
                                p={1.5}
                                accept='image/*'
                                onChange={(e) => postDetail(e.target.files[0])}
                            />
                        </Form>
                        <ButtonComponent
                            size={'40'}
                            onClick={handleUpdate}
                            styleButton={{
                                backgroundColor: "rgb(71,71,71)",
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: "12px",
                                margin: "20px 0"
                            }}
                            textButton={"Lưu"}
                            styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                        />
                    </div>
                </Col>

                <Col span={14}>

                    <WrapperContainerProfile>
                        <WrapperDivContainer>Thông tin cá nhân</WrapperDivContainer>
                        <InputForm
                            label={'Họ và tên :'}
                            placeholder={user.name}
                            value={name} onChange={handleOnChangeName}
                        />


                        <InputForm
                            label={'Email :'}
                            isEmail={false}
                            placeholder={user.email}
                            value={email} onChange={handleOnChangeEmail}

                        />
                        <InputForm
                            label={'Role:'}
                            placeholder={user.isAdmin === false ? "User" : "Admin"}
                            value={isAdmin} onChange={handleOnChangeAdmin}
                        />
                        <InputForm
                            label={'Số điện thoại :'}
                            placeholder={user.phone}
                            value={phone} onChange={handleOnChangePhone}
                        />
                        <InputForm
                            label={'Địa chỉ :'}
                            placeholder={user.address}
                            value={address} onChange={handleOnChangeAddress}
                        />
                        <LoadingComponent isLoading={isPending}>

                            <ButtonComponent
                                size={'40'}
                                onClick={handleUpdate}
                                styleButton={{
                                    backgroundColor: "rgb(71,71,71)",
                                    height: '48px',
                                    width: '100%',
                                    border: 'none',
                                    borderRadius: "12px",
                                    margin: "20px 0"
                                }}
                                textButton={"Lưu"}
                                styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                            />
                        </LoadingComponent>
                    </WrapperContainerProfile >
                </Col>
            </Row>
        </>

    )
}
