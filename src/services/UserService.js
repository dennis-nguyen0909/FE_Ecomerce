import axios from "axios";
export const axiosJWT = axios.create()
export const signUp = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API}user/sign-up`, data);
    return res.data;
}
export const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API}user/login`, data);
    return res.data;
}

export const getDetailUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API}user/get-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}
// export const refreshToken = async () => {
//     const res = await axios.post(`${process.env.REACT_APP_API}user/refresh-token`, {
//         withCredentials: true// tự động lấy cookie
//     });
//     return res.data;

// }
export const refreshToken = async (refresh_token) => {
    const res = await axios.post(`${process.env.REACT_APP_API}user/refresh-token`, {}, {
        headers: {
            token: `Bearer ${refresh_token}`
        }
    });
    return res.data;

}





export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API}user/logout-user`)
    return res.data;
}

export const updateUser = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API}user/update-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export const createUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API}user/sign-up`, data);
    return res.data;
}
export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API}user/getAllUser`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res;
}
export const deleteUser = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API}user/delete-user/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}


export const deleteManyUser = async (ids, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API}user/delete-many`, ids, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}
export const deleteManyProduct = async (ids, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API}product/delete-many`, ids, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

