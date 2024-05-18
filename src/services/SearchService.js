import axios from "axios";

export const createSearch = async (keyword) => {
  const res = await axios.post(`${process.env.REACT_APP_API}search/create`, {
    keyword,
  });
  return res.data;
};
export const getAllSearch = async (data) => {
  const res = await axios.get(`${process.env.REACT_APP_API}search/getAll`);
  return res.data;
};
export const getAllShop = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API}shop/get-all`);
  return res.data;
};
export const createShop = async (name) => {
  console.log("nameee", name);
  const res = await axios.post(`${process.env.REACT_APP_API}shop/create`, {
    name,
  });
  return res.data;
};
