import axios from "axios";

export const getClientId = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API}payment/client-id/`);
    return res.data;
}

