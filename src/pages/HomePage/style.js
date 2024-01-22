import styled from "styled-components";
import { ButtonComponent } from "../../component/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display:flex;
    align-items:center;
    justify-content:flex-start;
    gap:24px;
    font-size:18px;
    height:44px;
    

`
export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        background: rgb(13,92,182);
        color:#fff;
    }
`

export const WrapperProduct = styled.div`
    display:flex;
    justify-content:center;
    gap:14px;
    margin-top:20px;
    flex-wrap:wrap;
    padding:10px 0;
`
export const WrapperDivTextHover = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    position: relative;
    text-decoration: none;
    color:rgb(128,128,128);
    &::before,
    &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        width: 0;
        height: 1px;
        background-color: rgb(128,128,128);
        transition: width 0.3s ease;
    }

    &::before {
        left: 50%;
        transform: translateX(-50%);
    }

    &::after {
        right: 50%;
        transform: translateX(50%);
    }

    &:hover::before,
    &:hover::after {
        width: calc(100% - 15px);
    }

    &:hover {
        cursor: pointer;
    }
`;

export const WrapperDivNav = styled.div`
    display: flex;
     align-items: center;
     justify-content:center;
    gap:200px;
    padding:15px 50px;
    @media (max-width:767px){
            display:none;
        
    }
`
export const WrapperDiv = styled.div`

`

export const WrapperContainer = styled.div`
    @media(max-width:767px){
        .pc{
            display: none;
        }
        .mobile{
            display:block;
        }
    }
    @media(min-width:767px){
        .pc{
            display:block;
        }
        .mobile{
            display:none;
        }
    }

`