import axios from "axios";
import { axiosJWT } from "./UserService";


export const createOrder = async (data, access_token) => {
    const res = await axios.post(`${process.env.REACT_APP_API}order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}

export const getAllOrderbyIdUser = async (id, access_token) => {

    const res = await axiosJWT.get(`${process.env.REACT_APP_API}order/get-all-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}
export const getDetailOrder = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API}order/get-details-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}
export const cancelOrderProduct = async (id, access_token, orderItems) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API}order/cancel-order/${id}`, { data: orderItems }, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}
export const getAllOrder = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API}order/get-all-order`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}

export const deleteManyOrder = async (ids, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API}order/delete-many`, ids, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export const getCountOrderByType = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API}order/get-all-type`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}
