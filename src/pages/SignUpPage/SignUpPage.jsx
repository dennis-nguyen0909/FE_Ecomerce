import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight, WrapperDivContainer } from './style'
import { InputForm } from '../../component/InputForm/InputForm'
import { ButtonComponent } from '../../component/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import logo from '../../assets/images/signup.jpeg'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/userMutationHook'
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent'
import * as message from '../../component/MessageComponent/MessageComponent'
export const SignUpPage = () => {
    const [isShowPassword, setShowPassword] = useState(false);
    const [isShowConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const mutation = useMutationHook(
        data => UserService.signUp(data)

    )


    const { data, isPending, isSuccess } = mutation
    useEffect(() => {
        if (data?.message?.status === 'Ok') {
            message.success("Đăng ký thành công !")
            handleNavigateLogin()
        }
        if (data?.message?.status === "Error") {
            message.error("Đăng ký thất bại")
        }
    }, [isSuccess])

    const handleNavigateLogin = () => {
        navigate('/login')
    }
    const handleOnChangeEmail = (value) => {
        setEmail(value);
    }
    const handleOnChangePassword = (value) => {
        setPassword(value);
    }
    const handleOnChangeConfirmPassword = (value) => {
        setConfirmPassword(value);
    }
    const handleSignUp = () => {

        mutation.mutate({
            email, password, confirmPassword
        })
    }
    return (
        <WrapperDivContainer >
            <div style={{ width: "800px", height: "445px", borderRadius: "6px", background: "#fff", display: 'flex', }}>
                <WrapperContainerLeft>
                    <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h1>Đăng Ký</h1>
                    </div>
                    <InputForm label="Tài khoản" placeholder="abc@gmail.com" value={email} onChange={handleOnChangeEmail} />
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px'
                            }}>
                            {isShowPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
                        </span>
                        <InputForm label="Mật khẩu" placeholder="*********" type={isShowPassword ? "text" : "password"} value={password} onChange={handleOnChangePassword} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setShowConfirmPassword(!isShowConfirmPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px'
                            }}>
                            {isShowConfirmPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
                        </span>
                        <InputForm label="Nhập lại mật khẩu" placeholder="*********" type={isShowConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={handleOnChangeConfirmPassword} />
                    </div>
                    {data?.status === "Error" && <span style={{ color: 'red' }}>{data?.message}</span>}
                    {data?.message.status === "Error" && <span style={{ color: "red" }}>{data?.message.message}</span>}
                    <LoadingComponent isLoading={isPending}>
                        <ButtonComponent
                            disabled={!email.length || !password.length || !confirmPassword.length}
                            onClick={handleSignUp}

                            size={'40'}
                            styleButton={{
                                backgroundColor: "rgb(240,213,219)",
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: "12px",
                                margin: "20px 0"
                            }}
                            textButton={"Đăng Ký"}
                            styleTextButton={{ color: "#fff", fontSize: '15px', fontWeight: 700 }}
                        >
                        </ButtonComponent>
                    </LoadingComponent>
                    <p>Bạn đã có tài khoản ?
                        <WrapperTextLight style={{ cursor: 'pointer' }} onClick={handleNavigateLogin}>Đăng nhập</WrapperTextLight>
                    </p>
                </WrapperContainerLeft>
                <WrapperContainerRight className='image-signup'>
                    <Image src={logo} preview={false} alt='image-logo' height={'100%'} width={"100%"} />
                </WrapperContainerRight>
            </div >
        </WrapperDivContainer>
    )
}
