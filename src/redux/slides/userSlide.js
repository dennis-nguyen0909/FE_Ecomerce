import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  avatar: "",
  access_token: "",
  refresh_token: "",
  isAdmin: false,
  isEmployee: false,
  city: "",
  districts: "",
  ward: "",
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        name = "",
        email = "",
        access_token = "",
        phone = "",
        address = "",
        avatar = "",
        _id = "",
        isAdmin,
        city = "",
        districts = "",
        ward = "",
        refresh_token = "",
        isEmployee,
      } = action.payload;
      state.id = _id;
      state.name = name || email;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
      state.city = city;
      state.districts = districts;
      state.ward = ward;
      state.refresh_token = refresh_token;
      state.isEmployee = isEmployee;
    },
    resetUser: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.phone = "";
      state.address = "";
      state.avatar = "";
      state.access_token = "";
      state.isAdmin = false;
      state.city = "";
      state.districts = "";
      state.ward = "";
      state.refresh_token = "";
      state.isEmployee = false;

      // return {
      //     ...initialState
      // }
    },
  },
});
export const { updateUser, resetUser } = userSlide.actions;
export default userSlide.reducer;
