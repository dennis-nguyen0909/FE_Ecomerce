import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import { Default } from "./component/Default/Default";

import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { resetUser, updateUser } from "./redux/slides/userSlide";
import { isJsonString } from "./untils";
import * as UserService from "./services/UserService";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import LoadingComponent from "./component/LoadingComponent/LoadingComponent";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    }
    setIsLoading(false);
  }, []);
  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      // fix deloy
      let storage = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storage);
      // lấy refresh_token và giải mã
      const decodedRefreshToken = jwtDecode(refreshToken);
      if (decoded?.exp < currentTime.getTime() / 1000) {
        //nếu mà rf còn hạn thì mới gọi đến refrshToken
        if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
          const data = await UserService.refreshToken(refreshToken);
          // nếu time token bé hơn time hiện tại / 1000 lấy ra milisecond giây
          config.headers["token"] = `Bearer ${data?.access_token}`;
          // localStorage.setItem('access_token', data?.access_token)
          // dispatch(updateUser({ access_token: data?.access_token }))
          // console.log('data', data?.access_token)
        } else {
          dispatch(resetUser());
        }
      }
      return config;
    },
    function (err) {
      return Promise.reject(err);
    }
  );
  const handleGetDetailUser = async (id, access_token) => {
    let storage = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storage);
    const res = await UserService.getDetailUser(id, access_token); // lấy thông tin user từ token và id
    dispatch(
      updateUser({
        ...res?.response.data,
        access_token: access_token,
        refreshToken,
      })
    );
    // truyền data mà res trả về vào redux
    // thì bên userSlide sẽ nhận được state và action trong đó action.payload là data user
  };

  return (
    <div>
      <LoadingComponent isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const Layout = route.isShowHeader ? Default : Fragment;
              // const checkAuth = !route.isPrivate || user.isAdmin
              return (
                <Route
                  path={route.path}
                  key={route.path}
                  element={
                    <Layout>
                      {route.isPrivate && !user.isAdmin && !user.isEmployee ? (
                        <NotFoundPage />
                      ) : (
                        <Page />
                      )}
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </LoadingComponent>
    </div>
  );
}

export default App;
