import { Button, Form, Input, Space, message } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { TableComponent } from '../TableComponent/TableComponent'
import { InputComponent } from '../InputComponent/InputComponent';
import { getBase64 } from '../../untils';
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

    const [stateOrder, setStateOrder] = useState({

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

    const renderAction = () => {
        return (
            <div style={{ cursor: 'pointer', fontSize: '20px', }}>
                <DeleteOutlined style={{ color: 'red' }} />
                <EditOutlined style={{ color: 'orange' }} />
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
        {
            title: 'Điện Thoại',
            dataIndex: 'phone',

        }, {
            title: 'Địa Chỉ',
            dataIndex: 'address',
            ...getColumnSearchProps('isAdmin'),
        },
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
        }, {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = orders?.data?.map((order) => {
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
            totalPrice: order?.totalPrice.toLocaleString().replaceAll('.', '.') + ' VND'
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
                <h1 style={{ margin: '20px 0' }}>Thống kê đơn đặt  hàng</h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PieChartsComponent orders={orders?.data} />
            </div>


            <ModelComponent title="Thêm người dùng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <LoadingComponent isLoading={loading}>

                </LoadingComponent>
            </ModelComponent>
            <DrawerComponent
                width="50%"
                title='Thông tin người dùng'
                placement='right'
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
            >

            </DrawerComponent>
            <ModelComponent title="Xóa Người Dùng" open={isModalOpenDelete} onCancel={() => alert('')} footer={null}>

            </ModelComponent>
        </div >


    )
}
