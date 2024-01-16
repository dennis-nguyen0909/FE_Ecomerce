import { Button, Form, Image, Input, Space, message } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { TableComponent } from '../TableComponent/TableComponent'
import { InputComponent } from '../InputComponent/InputComponent';
import { covertPrice, getBase64 } from '../../untils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutationHook } from '../../hooks/userMutationHook';
import * as OrderService from '../../services/OrderService'
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DrawerComponent } from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ModelComponent } from '../ModelComponent/ModelComponent';
import { ButtonComponent } from '../../component/ButtonComponent/ButtonComponent'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { PieChartsComponent } from '../PieChartComponent/PieChartsComponent';
import { WrapperDivInfoProduct } from './styled';
export const AdminOrder = () => {
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal] = Form.useForm();
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isModalOpenDelete, setIsModelOpenDelete] = useState(false)
    const [typeOrder, setTypeOrder] = useState([])
    const user = useSelector((state) => state.user)

    const [stateOrderDetail, setStateOrderDetail] = useState({
        orderItems: [],
        shippingAddress: {},
        totalPrice: '',
        isDelivered: '',

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



    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);

        formModal.resetFields()
    };
    const handleCancel = () => {
        setIsModalOpen(false);

        formModal.resetFields()
    };
    const fetchGetAllOrder = async () => {
        const res = await OrderService.getAllOrder();
        return res.response
    }
    const query = useQuery({ queryKey: ['order'], queryFn: fetchGetAllOrder })
    const { data: orders, isLoading } = query

    useEffect(() => {
        orders?.data?.map((item) => item?.orderItems?.map((or) => {
            setTypeOrder(or.type)
        }))
    }, [])
    const handleEditOrder = async () => {
        if (rowSelected) {
            setIsOpenDrawer(true)
        }
    }
    useEffect(() => {
        if (rowSelected) {
            fetchDetailOrder(rowSelected)
        }
    }, [rowSelected])
    const fetchDetailOrder = async (rowSelected) => {
        try {
            const res = await OrderService.getDetailOrder(rowSelected, user?.access_token);
            const data = res?.response.data;
            if (data) {
                setStateOrderDetail({
                    orderItems: data.orderItems,
                    shippingAddress: data.shippingAddress,
                    totalPrice: data.totalPrice,
                });
            }
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', error.message);
            // Xử lý lỗi, có thể hiển thị thông báo cho người dùng
        }
    }
    const renderAction = () => {
        return (
            <div style={{ cursor: 'pointer', fontSize: '20px', }}>
                <DeleteOutlined style={{ color: 'red' }} />
                <EditOutlined style={{ color: 'orange' }} onClick={handleEditOrder} />
            </div>
        )
    }
    const deleteManyOrder = useMutationHook(
        async (data) => {
            const {
                token, ...ids
            } = data
            const res = await OrderService.deleteManyOrder(ids, token);
            if (+res?.EC === 1) {
                message.success("Xóa thành công !")
                queryClient.invalidateQueries({ queryKey: 'order', queryFn: fetchGetAllOrder })

            } else if (+res?.EC === 0) {
                message.error('Xóa thất bại')
                return;
            }


        }
    )
    const handleDeleteMany = (ids) => {
        deleteManyOrder.mutate({ ids: ids, token: user?.access_token })
        queryClient.invalidateQueries({ queryKey: 'order', queryFn: fetchGetAllOrder })

    }
    const onFinish = () => {


    };

    const columns = [
        {
            title: 'Tên Khách Hàng',
            dataIndex: 'userName',
            ...getColumnSearchProps('userName'),
            sorter: (a, b) => a.name.length - b.name.length,
        },
        // {
        //     title: 'Điện Thoại',
        //     dataIndex: 'phone',

        // }, {
        //     title: 'Địa Chỉ',
        //     dataIndex: 'address',
        //     ...getColumnSearchProps('isAdmin'),
        // },
        {
            title: 'Thanh Toán',
            dataIndex: 'isPaid',

        },
        {
            title: 'Giao Hàng',
            dataIndex: 'isDelivered',
        }, {
            title: 'Hình thức thanh toán',
            dataIndex: 'payment_method',
        },
        {
            title: 'Tổng đơn hàng',
            dataIndex: 'totalPrice',
        },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'createdAt',
        }
        ,
        {
            title: 'Tên sản phẩm',
            dataIndex: 'orderItems',
        }

        , {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = orders?.data?.map((order) => {
        const obj = new Date(order?.createdAt);
        const month = obj.getMonth() + 1
        const year = obj.getFullYear()
        const day = obj.getDate()
        return {
            ...order,
            key: order._id,
            userName: order?.shippingAddress?.fullName,
            phone: order?.shippingAddress?.phone,
            address: order?.shippingAddress?.address,
            isAdmin: user?.isAdmin ? "TRUE" : "FALSE",
            isPaid: order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
            payment_method: order?.paymentMethod === 'later_money' ? "Thanh toán khi nhận hàng" : "Chuyển khoản",
            isDelivered: order?.isDelivered ? "Đã giao hàng" : "Chưa giao hàng",
            totalPrice: order?.totalPrice.toLocaleString().replaceAll('.', '.') + ' VND',
            createdAt: day + "/" + month + "/" + year,
            orderItems: order?.orderItems?.map((item) => item.name)
        }

    }) || [];






    const handleOpenModelDelete = async () => {
        setIsModelOpenDelete(true)
    }
    const handleCancelDelete = () => {
        setIsModelOpenDelete(false)
    }
    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: 'order', queryFn: fetchGetAllOrder })
    }, [orders])
    const currentDate = new Date();
    const currentDay = currentDate.getDate()
    const currentMonth = (currentDate.getMonth() + 1)
    const currentYear = currentDate.getFullYear()

    const orderCurrent = orders?.data.filter((order) => {
        const obj = new Date(order?.createdAt);
        const month = obj.getMonth() + 1
        const year = obj.getFullYear()
        const day = obj.getDate()
        return day === currentDay && month === currentMonth && year === currentYear;
    })
    const handleConfirmOrder = async () => {
        console.log(rowSelected)
        const res = await OrderService.confirmOrder(rowSelected);
        console.log(res)
    }
    return (
        <div style={{}}>
            <div style={{ margin: '10px 20px' }}>
                <h3>Quản lý đơn hàng</h3>
                <Button type="primary" onClick={showModal}>
                    Xem các đơn hàng hôm nay
                </Button>
            </div>
            <div style={{ border: '1px solid #ccc', margin: '10px 20px', borderRadius: '10px' }}>
                <TableComponent
                    handleDeleteMany={handleDeleteMany}
                    columns={columns}
                    data={dataTable}
                    isLoading={isLoading}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            }
                        }
                    }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ margin: '20px 0' }}>Thống kê đơn đặt hàng</h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PieChartsComponent orders={orders?.data} />
            </div>


            <ModelComponent title={"Ngày" + ":" + currentDay + "/" + (currentMonth) + "/" + currentYear} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <LoadingComponent isLoading={loading}>
                    <div>
                        {orderCurrent?.map((ord) => (
                            <div key={ord._id} style={{ border: '1px solid #ccc', gap: '10px', display: 'flex', flexDirection: 'column' }}>
                                <p>Mã đơn:#{ord._id}</p>
                                <p>Tổng tiền:{covertPrice(ord.totalPrice)}</p>
                                {ord.orderItems.map((or) => (
                                    <div key={or.productId}>
                                        <p>Tên sản phẩm:{or.name}</p>
                                        <p>Số lượng:{or.amount}</p>
                                        <p>Size:{or.size}</p>
                                    </div>
                                ))}
                            </div>
                        ))}

                    </div>
                </LoadingComponent>
            </ModelComponent>
            <DrawerComponent
                width="30%"
                title='Thông tin đơn hàng'
                placement='right'
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}

            >
                {stateOrderDetail?.orderItems.map((item) => {
                    return (
                        <WrapperDivInfoProduct style={{}}>
                            <Image width={300} height={300} src={item.image} />
                            <p>{item.name}</p>
                            <p>Số lượng :{item.amount}</p>
                            <p>Size : {item.size}</p>
                            <p>Người nhận : {stateOrderDetail?.shippingAddress.fullName}</p>
                            <p>Phone : {stateOrderDetail?.shippingAddress.phone}</p>
                            <p>Địa chỉ : {stateOrderDetail?.shippingAddress.address + " " + stateOrderDetail?.shippingAddress.city}</p>
                            <p>Giá tiền : {covertPrice(stateOrderDetail.totalPrice)}</p>
                        </WrapperDivInfoProduct>
                    )
                })}
                <ButtonComponent
                    onClick={handleConfirmOrder}
                    size={'40'}
                    styleButton={{
                        backgroundColor: "rgb(71,71,76)",
                        height: '40px',
                        width: '400px',
                        border: 'none',
                        borderRadius: "12px",
                        margin: "20px 0"
                    }}
                    textButton={"Xác nhận"}
                    styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                >
                </ButtonComponent>
            </DrawerComponent>
            <ModelComponent title="Xóa Người Dùng" open={isModalOpenDelete} onCancel={() => alert('')} footer={null}>

            </ModelComponent>
        </div >


    )
}
