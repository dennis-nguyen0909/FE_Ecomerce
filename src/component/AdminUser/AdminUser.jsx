import { Button, Form, Input, Space, message } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { TableComponent } from '../TableComponent/TableComponent'
import { InputComponent } from '../InputComponent/InputComponent';
import { getBase64 } from '../../untils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutationHook } from '../../hooks/userMutationHook';
import * as UserService from '../../services/UserService'
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DrawerComponent } from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ModelComponent } from '../ModelComponent/ModelComponent';
import { ButtonComponent } from '../../component/ButtonComponent/ButtonComponent'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
export const AdminUser = () => {
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal] = Form.useForm();
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isModalOpenDelete, setIsModelOpenDelete] = useState(false)

    const user = useSelector((state) => state.user)
    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        password: '',
        isAdmin: false,
        isEmployee:false,
        phone: '',
        avatar: '',
        address: '',

    })
    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        email: '',
        password: '',
        isAdmin: false,
        isEmployee: false,
        phone: '',
        avatar: '',
        address: '',
    })
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm();
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            clearFilters && handleReset(clearFilters);
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const fetchGetAllUser = async () => {
        const response = await UserService.getAllUser(user?.access_token);
        return response
    }

    const deleteManyUser = useMutationHook(
        async (data) => {
            const {
                token, ...ids
            } = data
            const res = await UserService.deleteManyUser(ids, token);
            if (+res?.EC === 1) {
                message.success("Xóa thành công !")
                queryClient.invalidateQueries({ queryKey: ['users'], queryFn: fetchGetAllUser })
                return res;
            } else if (+res?.EC === 0) {
                message.error('Xóa thất bại')
                return;
            }
        }

    )
    const handleDeleteManyUser = (ids) => {
        deleteManyUser.mutate({ ids: ids, token: user?.access_token })
    }
    const mutation = useMutationHook(
        async (data) => {
            const {
                name,
                email,
                password,
                isAdmin,
                phone,
                avatar,
                address,
            } = data
            const res = await UserService.createUser(data);
            return res;
        }
    )
    const { data, isLoading, isError, isSuccess } = mutation
    const query = useQuery({ queryKey: ['users'], queryFn: fetchGetAllUser })

    const { isLoading: isLoadingUser } = query
    const users = query?.data?.data
    const handleOnChangeAvatarDetail = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setStateUserDetail({
            ...stateUserDetail,
            image: file.preview
        })
    }
    const postDetail = (pics) => {
        setLoading(true);
        if (pics.type === "image/png" || pics.type === "image/jpeg") {
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', "chat-app");
            data.append('cloud_name', "dxtz2g7ga");
            axios.post('https://api.cloudinary.com/v1_1/dxtz2g7ga/image/upload', data)
                .then(res => {
                    // Cập nhật state sau khi nhận được kết quả từ API
                    setStateUser(prevState => ({
                        ...prevState,
                        image: res.data.secure_url
                    }));
                    setLoading(false);
                }
                )
                .catch(err => {
                    // console.log(err);
                })
        }
    }
    const postUserDetail = (pics) => {
        setIsLoadingUpdate(true);
        if (pics.type === "image/png" || pics.type === "image/jpeg") {
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', "chat-app");
            data.append('cloud_name', "dxtz2g7ga");

            axios.post('https://api.cloudinary.com/v1_1/dxtz2g7ga/image/upload', data)
                .then(res => {
                    // Cập nhật state sau khi nhận được kết quả từ API
                    setStateUserDetail(prevState => ({
                        ...prevState,
                        image: res.data.secure_url
                    }));
                    setIsLoadingUpdate(false);
                }
                )
                .catch(err => {
                    // console.log(err);
                })
        }
    }
    const deleteProductImage = async (url) => {
        const extractPublicIdFromUrl = (url) => {
            const startIndex = url.lastIndexOf('/') + 1;
            const endIndex = url.lastIndexOf('.');
            return url.substring(startIndex, endIndex);
        };
        // Sử dụng hàm extractPublicIdFromUrl để lấy publicId từ URL của ảnh
        const publicId = extractPublicIdFromUrl(url);
        try {
            const api_key = "953156321132996"
            const api_secret = "As23z_TAML8DqymuQA5Mw - KIk14"
            const response = await axios.delete(
                `https://api.cloudinary.com/v1_1/dxtz2g7ga/image/destroy/${publicId}`,
                {
                    params: {
                        api_key,
                        api_secret
                    }
                }
            );

        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }
    useEffect(() => {
        if (isSuccess && data?.status === "Ok") {
            queryClient.invalidateQueries('product')
            message.success('Tạo thành công')
            handleCancel()
        } else if (isError) {
            message.error('Tạo thất bại')
        }
    }, [isSuccess])
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetail({
            name: '',
            email: '',
            password: '',
            isAdmin: false,
            phone: '',
            avatar: '',
            address: '',
        })
        formModal.resetFields()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setStateUser({
            name: '',
            email: '',
            password: '',
            isAdmin: '',
            phone: '',
            avatar: '',
            address: '',
        })
        formModal.resetFields()
    };
    const handleDetailUser = () => {
        if (rowSelected) {
            setIsLoadingUpdate(true)
            fetchGetDetailUser(rowSelected)
        }
        setIsOpenDrawer(true)
    }
    const renderAction = () => {
        return (
            <div style={{ cursor: 'pointer', fontSize: '20px', }}>
                <DeleteOutlined style={{ color: 'red' }} onClick={handleOpenModelDelete} />
                <EditOutlined style={{ color: 'orange' }} onClick={handleDetailUser} />
            </div>
        )
    }
    const onFinish = () => {
        try {
            setLoading(true)
            mutation.mutate(stateUser)
            queryClient.invalidateQueries({ queryKey: ['users'], queryFn: fetchGetAllUser });
            setLoading(false)
        } catch (error) {

        }

    };
    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };
    const handleOnChangeUser = (e) => {
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value
        })

    }
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Email',
            dataIndex: 'email',

        }, {
            title: 'Admin',
            dataIndex: 'isAdmin',
            ...getColumnSearchProps('isAdmin'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',

        },
        {
            title: 'Address',
            dataIndex: 'address',
        }, {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = users?.data?.map((user) => ({
        ...user,
        key: user._id,
        isAdmin: user?.isAdmin ? "TRUE" : "FALSE",
        name: user?.name ? user?.name : "NULL",
        phone: user?.phone ? user?.phone : "NULL",
        address: user?.address ? user?.address : "NULL"

    })) || [];



    const fetchGetDetailUser = async (rowSelected) => {
        const res = await UserService.getDetailUser(rowSelected, user?.access_token)
        if (res?.response?.data) {
            setStateUserDetail({
                name: res?.response?.data?.name,
                email: res?.response?.data?.email,
                password: res?.response?.data?.password,
                isAdmin: res?.response?.data?.isAdmin,
                isEmployee:res?.response?.data?.isEmployee,
                phone: res?.response?.data?.phone,
                avatar: res?.response?.data?.avatar,
                address: res?.response?.data?.address,
            })
            // formDrawer.setFieldsValue(res.response.data)
        }
        setIsLoadingUpdate(false)
    }
    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailUser(rowSelected)
        }
    }, [rowSelected])
    useEffect(() => {
        if (rowSelected) {
            formModal.setFieldsValue(stateUserDetail)
        }
    }, [formModal, stateUserDetail])
    const handleOnChangeUserDetail = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value
        })

    }
    const onUpdateUser = async () => {
        setIsLoadingUpdate(true)
        const res = await UserService.updateUser(rowSelected, stateUserDetail, user?.access_token);
        console.log("res",res)
        formModal.setFieldsValue(res.updateNewProduct)
        if (res?.data?.status === "Ok") {
            message.success('Cập nhật thành công')
            setStateUserDetail(res.updateNewProduct);
            queryClient.invalidateQueries({ queryKey: ['users'], queryFn: fetchGetAllUser })
            setIsLoadingUpdate(false)
            handleCloseDrawer()
        } else if (res?.data?.status === 'Error') {
            message.error('Cập nhật thất bại')

        }
        return res;
    }

    const handleOpenModelDelete = async () => {
        setIsModelOpenDelete(true)
    }
    const handleCancelDelete = () => {
        setIsModelOpenDelete(false)
    }
    const fetchDelete = async () => {
        const res = await UserService.deleteUser(rowSelected, user?.access_token);
        if (res.data.status === 'Ok') {
            message.success("Xóa thành công")
        } else {
            message.error("Xóa thất bại ")

        }
        return res;
    }
    const handleDeleteProduct = async () => {
        await fetchDelete();
        queryClient.invalidateQueries({ queryKey: ['users'], queryFn: fetchDelete })
        handleCancelDelete();
    }

    console.log("state",stateUserDetail)
    return (
        <div style={{}}>
            <div style={{ margin: '10px 20px' }}>
                <h3>Quản lý người dùng</h3>
                <Button type="primary" onClick={showModal}>
                    Thêm
                </Button>
            </div>
            <div style={{ border: '1px solid #ccc', margin: '10px 20px', borderRadius: '10px' }}>
                <TableComponent

                    handleDeleteMany={handleDeleteManyUser}
                    columns={columns}
                    data={dataTable}
                    isLoading={isLoadingUser}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            }
                        }
                    }}
                />
            </div>
            <ModelComponent title="Thêm người dùng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <LoadingComponent isLoading={loading}>
                    <Form
                        form={formModal}
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 18,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="on"
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.name} onChange={handleOnChangeUser} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.email} onChange={handleOnChangeUser} name="email" />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >

                            <InputComponent value={stateUser.password} onChange={handleOnChangeUser} name="password" />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your address!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.address} onChange={handleOnChangeUser} name="address" />
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
                            <InputComponent value={stateUser.phone} onChange={handleOnChangeUser} name="phone" />
                        </Form.Item>
                        <Form.Item
                            label="Admin"
                            name="admin"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your admin!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUser.countInStock} onChange={handleOnChangeUser} name="admin" />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your price!',
                                },
                            ]}
                        >
                            <Form id='pic' >
                                <label>Upload Picture</label>
                                <Input type='file'
                                    p={1.5}
                                    accept='image/*'

                                    onChange={(e) => postDetail(e.target.files[0])
                                    }
                                />
                            </Form>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                offset: 20,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Thêm
                            </Button>
                        </Form.Item>
                    </Form>
                </LoadingComponent>
            </ModelComponent>
            <DrawerComponent
                width="50%"
                title='Thông tin người dùng'
                placement='right'
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
            >
                <LoadingComponent isLoading={isLoadingUpdate}>
                    <Form
                        form={formModal}
                        // initialValues={stateUserDetail}
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 18,
                        }}
                        onFinish={onUpdateUser}
                        onFinishFailed={onFinishFailed}
                        autoComplete="on"
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}
                        >
                            {/* <InputForm
                            placeholder={stateUserDetail.name}
                            value={stateUserDetail.name}
                        /> */}
                            <Input value={stateUserDetail.name} name='name' onChange={handleOnChangeUserDetail} />

                            {/* <InputComponent value={stateUserDetail.name} onChange={handleOnChangeUserDetail} name="name" /> */}

                        </Form.Item>
                        {/* <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your price!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUserDetail.email} onChange={handleOnChangeUserDetail} name="email" />
                        </Form.Item> */}
                        <Form.Item
                            label="Admin"
                            name="isAdmin"
                           
                        >

                            <InputComponent value={stateUserDetail.isAdmin} onChange={handleOnChangeUserDetail} name="isAdmin" />
                        </Form.Item>
                        <Form.Item
                            label="Employee"
                            name="isEmployee"
                            
                        >

                            <InputComponent value={stateUserDetail.isEmployee===true?"true":"false"} onChange={handleOnChangeUserDetail} name="isEmployee" />
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
                            <InputComponent value={stateUserDetail.phone} onChange={handleOnChangeUserDetail} name="phone" />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your address!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUserDetail} onChange={handleOnChangeUserDetail} name="address" />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your price!',
                                },
                            ]}
                        >
                            <Form id='pic' >
                                <label>Upload Picture</label>
                                <Input type='file'
                                    p={1.5}
                                    accept='image/*'
                                    onChange={(e) => postUserDetail(e.target.files[0])
                                    }
                                />
                            </Form>

                        </Form.Item>
                        {stateUserDetail?.image && (
                            <img src={stateUserDetail?.image} style={{
                                height: '50px', width: '50px', objectFit: 'cover', borderRadius: '50%'
                            }} />
                        )}
                        <Form.Item
                            wrapperCol={{
                                offset: 20,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit" >
                                Cập Nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </LoadingComponent>
            </DrawerComponent>
            <ModelComponent title="Xóa Người Dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} footer={null}>
                <LoadingComponent isLoading={loading}>
                    <div>Bạn có chắc xóa người dùng này không ?</div>
                    <div>{stateUserDetail.name}</div>
                    <ButtonComponent

                        onClick={handleDeleteProduct}

                        size={'40'}
                        styleButton={{
                            backgroundColor: "rgb(240,213,219)",
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: "12px",
                            margin: "20px 0"
                        }}
                        textButton={"Xóa"}
                        styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                    >
                    </ButtonComponent>
                </LoadingComponent>
            </ModelComponent>
        </div >


    )
}
