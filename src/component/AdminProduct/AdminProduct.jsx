import { Button, Form, Input, Select, Space, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { TableComponent } from '../TableComponent/TableComponent'
import { InputComponent } from '../InputComponent/InputComponent';
import { covertPrice, getBase64 } from '../../untils';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutationHook } from '../../hooks/userMutationHook';
import * as ProductService from '../../services/ProductService'
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DrawerComponent } from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ModelComponent } from '../ModelComponent/ModelComponent';
import { ButtonComponent } from '../../component/ButtonComponent/ButtonComponent'


export const AdminProduct = () => {
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal] = Form.useForm();
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isModalOpenDelete, setIsModelOpenDelete] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [typeSelect, setTypeSelect] = useState('')
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const user = useSelector((state) => state.user)
    const initial = () => ({
        name: '',
        type: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        countInStock: '',
        discount: '',
    })
    const [stateProduct, setStateProduct] = useState(initial())
    const [stateProductDetail, setStateProductDetail] = useState({
        name: '',
        type: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        countInStock: '',
        discount: '',
    })
    const deleteManyProduct = useMutationHook(
        async (data) => {
            const {
                token, ...ids
            } = data
            const res = await ProductService.deleteManyProduct(ids, token);
            if (+res?.EC === 1) {
                message.success("Xóa thành công !")
                queryClient.invalidateQueries({ queryKey: ['products'], queryFn: fetchGetAllProduct })
                return res;
            } else if (+res?.EC === 0) {
                message.error('Xóa thất bại')
                return;
            }


        }
    )
    const handleDeleteManyProduct = (ids) => {
        deleteManyProduct.mutate({ ids: ids, token: user?.access_token })
        queryClient.invalidateQueries({ queryKey: ['products'], queryFn: fetchGetAllProduct })

    }
    const fetchGetAllProduct = async () => {
        const response = await ProductService.getAllProduct();
        return response
    }

    const mutation = useMutationHook(
        async (data) => {
            const res = await ProductService.createProduct({
                name: stateProduct.name,
                type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
                price: stateProduct.price,
                description: stateProduct.description,
                rating: stateProduct.rating,
                image: stateProduct.image,
                countInStock: stateProduct.countInStock,
                discount: stateProduct.discount,
                size: stateProduct.type === 'Giày ' ? ['36', '37', '38', '39', '40', '41', '42', '43'] : ['S', 'M', 'L', 'XL'],
            })

            return res;
        }
    )

    const { data, isLoading, isError, isSuccess } = mutation
    const query = useQuery({ queryKey: ['products'], queryFn: fetchGetAllProduct })
    const { isLoading: isLoadingProduct } = query
    const products = query.data
    const handleOnChangeAvatarDetail = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setStateProductDetail({
            ...stateProductDetail,
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
                    setStateProduct(prevState => ({
                        ...prevState,
                        image: res.data.secure_url
                    }));
                    setLoading(false);
                }
                )
                .catch(err => {

                })
        }
    }
    const postProductDetail = (pics) => {
        setIsLoadingUpdate(true);
        if (pics.type === "image/png" || pics.type === "image/jpeg") {
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', "chat-app");
            data.append('cloud_name', "dxtz2g7ga");

            axios.post('https://api.cloudinary.com/v1_1/dxtz2g7ga/image/upload', data)
                .then(res => {
                    // Cập nhật state sau khi nhận được kết quả từ API
                    setStateProductDetail(prevState => ({
                        ...prevState,
                        image: res.data.secure_url
                    }));
                    setIsLoadingUpdate(false);
                }
                )
                .catch(err => {

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
        setStateProductDetail({
            name: '',
            type: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            countInStock: '',
            discount: '',

        })
        formModal.resetFields()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            type: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            countInStock: '',
            discount: '',

        })
        formModal.resetFields()
    };
    const handleDetailProduct = () => {
        if (rowSelected) {
            setIsLoadingUpdate(true)
            fetchGetDetailProduct(rowSelected)
        }
        setIsOpenDrawer(true)
    }
    const renderAction = () => {
        return (
            <div style={{ cursor: 'pointer', fontSize: '20px', }}>
                <DeleteOutlined style={{ color: 'red' }} onClick={handleOpenModelDelete} />
                <EditOutlined style={{ color: 'orange' }} onClick={handleDetailProduct} />
            </div>
        )
    }
    const onFinish = () => {
        const stateProductUpdateNewType = {
            name: stateProduct.name,
            type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
            price: stateProduct.price,
            description: stateProduct.description,
            rating: stateProduct.rating,
            image: stateProduct.image,
            countInStock: stateProduct.countInStock,
            discount: stateProduct.discount,
        }
        try {
            setLoading(true)
            mutation.mutate(stateProductUpdateNewType)
            queryClient.invalidateQueries({ queryKey: ['products'], queryFn: fetchGetAllProduct });
            setLoading(false)
        } catch (error) {

        }

    };
    const onFinishFailed = (errorInfo) => {

    };
    const handleOnChangeProduct = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })

    }
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
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
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text) =>
        //     searchedColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle={{
        //                 backgroundColor: '#ffc069',
        //                 padding: 0,
        //             }}
        //             searchWords={[searchText]}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ''}
        //         />
        //     ) : (
        //         text
        //     ),
    });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps("name"),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            ...getColumnSearchProps('price')
        },
        {
            title: 'Type',
            dataIndex: 'type',

        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating

        }, {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return {
            ...product,
            key: product._id,
            price: covertPrice(product?.price)
        }
    })
    const fetchGetDetailProduct = async (rowSelected) => {
        const res = await ProductService.getDetailProduct(rowSelected, user?.access_token)
        if (res?.response?.data) {
            setStateProductDetail({
                name: res.response.data.name,
                type: res.response.data.type,
                price: res.response.data.price,
                description: res.response.data.description,
                rating: res.response.data.rating,
                image: res.response.data.image,
                countInStock: res.response.data.countInStock,
                discount: res.response.data.discount,
                size: res.response.data.size
            })
            // formDrawer.setFieldsValue(res.response.data)
        }
        setIsLoadingUpdate(false)
    }
    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailProduct(rowSelected)
        }
    }, [rowSelected])
    useEffect(() => {
        if (rowSelected) {
            if (!isModalOpen) {
                formModal.setFieldsValue(stateProductDetail)
            } else {
                formModal.setFieldsValue(initial())
            }
        }
    }, [formModal, stateProductDetail, isModalOpen])
    const handleOnChangeProductDetail = (e) => {
        setStateProductDetail({
            ...stateProductDetail,
            [e.target.name]: e.target.value
        })

    }
    const onUpdateProduct = async () => {
        setIsLoadingUpdate(true)

        const res = await ProductService.updateProduct(rowSelected, stateProductDetail, user?.access_token);
        formModal.setFieldsValue(res.updateNewProduct)
        if (res?.status === "Ok") {
            message.success('Cập nhật thành công')
            setStateProductDetail(res.updateNewProduct);
            queryClient.invalidateQueries({ queryKey: ['products'], queryFn: fetchGetAllProduct })
            setIsLoadingUpdate(false)
            handleCloseDrawer()
        } else if (res?.status === 'Error') {
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
        const res = await ProductService.deleteProduct(rowSelected, user?.access_token);
        if (res.data.status === 'Ok') {
            message.success("Xóa thành công")
        } else {
            message.error("Xóa thất bại ")

        }

        return res;
    }
    const handleDeleteProduct = async () => {
        await fetchDelete();
        queryClient.invalidateQueries({ queryKey: ['products'], queryFn: fetchDelete })
        handleCancelDelete();
    }
    const fetchGetAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        return res.data;
    }
    const { data: typeProduct } = useQuery({ queryKey: ['type-products'], queryFn: fetchGetAllTypeProduct })
    const handleChangeSelectType = (value) => {
        // Giữ nguyên state product và cập nhật type =value chọn
        setStateProduct({
            ...stateProduct,
            type: value,
        })
        setStateProductDetail({
            ...stateProductDetail,
            type: value,
        })

    }
    return (
        <div >
            <div style={{ margin: '10px 20px' }}>
                <h3>Quản lý sản phẩm</h3>
                <Button type="primary" onClick={showModal}>
                    Thêm
                </Button>

            </div>
            <div style={{ border: '1px solid #ccc', margin: '10px 20px', borderRadius: '10px' }}>
                <TableComponent
                    handleDeleteMany={handleDeleteManyProduct}
                    columns={columns}
                    data={dataTable}
                    isLoading={isLoadingProduct}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            }
                        }
                    }}
                />
            </div>
            <ModelComponent title="Tạo Sản Phẩm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
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
                            <InputComponent value={stateProduct.name} onChange={handleOnChangeProduct} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your price!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleOnChangeProduct} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your type!',
                                },
                            ]}
                        >

                            <Select
                                name="type"
                                // defaultValue="lucy"
                                value={stateProduct.type}
                                style={{
                                    width: 200,
                                }}
                                onChange={handleChangeSelectType}
                                options={[
                                    {
                                        label: 'Loại Sản Phẩm',
                                        options: [
                                            {
                                                label: 'Áo',
                                                value: 'Áo',
                                            },
                                            {
                                                label: 'Quần',
                                                value: 'Quần',
                                            },
                                            {
                                                label: 'Giày',
                                                value: 'Giày',
                                            },
                                            {
                                                label: 'Nón',
                                                value: 'Nón',
                                            },
                                            {
                                                label: 'Balo',
                                                value: 'Balo',
                                            },
                                        ],
                                    },
                                ]}

                            />
                        </Form.Item>
                        {stateProduct.type === 'add_type' &&
                            <Form.Item
                                label="New Type"
                                name="newType"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your type!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProduct.newType} onChange={handleOnChangeProduct} name="newType" />
                            </Form.Item>
                        }
                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your rating!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleOnChangeProduct} name="rating" />
                        </Form.Item>


                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your description!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.description} onChange={handleOnChangeProduct} name="description" />
                        </Form.Item>
                        <Form.Item
                            label="CountInStock"
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your countInStock!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.countInStock} onChange={handleOnChangeProduct} name="countInStock" />
                        </Form.Item>
                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your countInStock!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnChangeProduct} name="discount" />
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
                title='Chi tiết sản phẩm'
                placement='right'
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
            >
                <LoadingComponent isLoading={isLoadingUpdate}>
                    <Form
                        form={formModal}
                        // initialValues={stateProductDetail}
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 18,
                        }}
                        onFinish={onUpdateProduct}
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

                            <Input value={stateProductDetail.name} name='name' onChange={handleOnChangeProductDetail} />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your price!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetail.price} onChange={handleOnChangeProductDetail} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your type!',
                                },
                            ]}

                        >
                            < Select
                                value={stateProductDetail.type}
                                name="type"
                                // defaultValue="lucy"
                                style={{
                                    width: 200,
                                }}
                                onChange={handleChangeSelectType}
                                options={[
                                    {
                                        label: 'Loại Sản Phẩm',
                                        options: [
                                            {
                                                label: 'Áo',
                                                value: 'Áo',
                                            },
                                            {
                                                label: 'Quần',
                                                value: 'Quần',
                                            },
                                            {
                                                label: 'Giày',
                                                value: 'Giày',
                                            },
                                            {
                                                label: 'Nón',
                                                value: 'Nón',
                                            },
                                            {
                                                label: 'Balo',
                                                value: 'Balo',
                                            },
                                        ],
                                    },
                                ]}

                            />
                            {/* <InputComponent value={stateProductDetail.type} onChange={handleOnChangeProductDetail} name="type" /> */}
                        </Form.Item>
                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your rating!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetail.rating} onChange={handleOnChangeProductDetail} name="rating" />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your description!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetail.description} onChange={handleOnChangeProductDetail} name="description" />
                        </Form.Item>
                        <Form.Item
                            label="CountInStock"
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your countInStock!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetail.countInStock} onChange={handleOnChangeProductDetail} name="countInStock" />
                        </Form.Item>
                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Discount!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetail.discount} onChange={handleOnChangeProduct} name="discount" />
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

                                    onChange={(e) => postProductDetail(e.target.files[0])
                                    }
                                />
                            </Form>

                        </Form.Item>
                        {stateProductDetail?.image && (
                            <img src={stateProductDetail?.image} style={{
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
            <ModelComponent title="Xóa Sản Phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} footer={null}>
                <LoadingComponent isLoading={loading}>
                    <div>Bạn có chắc xóa sản phẩm này không ?</div>
                    <div>{stateProductDetail.name}</div>
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
