import styled from "styled-components";
import { Col, Image, InputNumber, Row } from "antd";

export const WrapperImageSmall = styled(Image)`
    height:64px;
    width:64px;
`
export const WrapperImageColSmall = styled(Col)`
    display:flex;
    flex-basis:unset;
`

export const WrapperStyleNameProduct = styled.h1`
    color:rgb(36,36,36);
    font-size:30px;
    font-weight:500;
    word-break:break-word;
`
export const WrapperStyleTextSell = styled.span`
    font-size:18px;
    line-height:24px;
    color:rgb(120,120,120);
`
export const WrapperPriceProduct = styled.div`
    background-color:rgb(250,250,250);
    border-radius:4px;
`
export const WrapperPriceTextProduct = styled.h1`
    font-size:18px;
    font-weight:500;
`

export const WrapperAddressProduct = styled.div`
    
    span.address{
        text-decoration:underline;
        font-size:15px;
        line-height:24px;
        font-weight:500;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;

    }
    span.change-address{
        color:pink;
        font-size:16px;
        line-height:24px;
        font-weight:500;
        flex-shrink:0;
    }
`
export const WrapperQualityProduct = styled.div`
    display:flex;
    gap:4px;
    align-items:center;
    width:fit-content;
    border :1px solid #ccc;
    border-radius:4px;
`
export const WrapperButtonQuality = styled.button`
    border:none;
    background:transparent;
    width:30px;
    text-align:center;
`
export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm{
        width:60px;
        border-top:none;
        border-bottom:none;
    };
    &.ant-input-number-handler-wrap{
        display:none;
    }

`


export const WrapperRow = styled(Row)`
    padding:16px;
    background-color:#fff;
    box-shadow:0 0 10px rgba(0,0,0,0.5);
    width:100%;
    border-radius:4px;
    @media (max-width:767px){
        .colImage{
            width:
        }
    }
`
export const WrapperDiv = styled.div`
    @media (max-width:767px){
        .rowPc{
            display:none;
        }
        .commentFB{
            display:none;
        }
    }
`
export const WrapperRowMobile = styled.div`
    margin-right:500px;
    display:flex;
    flex-direction:column;
    align-items:center;
    width:250px;
    .productImage{
        width:100%;
    }
`
export const StyleCol = styled(Col)`
border-right: 1px solid #solid;
padding-right: 8px;
display: flex;
justify-content: center;
align-items: center;
flex-direction:column;
width:300px;
@media (max-width: 576px) {
  border-right: none; // Xóa đường biên phải khi ở mức độ nhỏ hơn 576px
  padding-right: 0;
}

`
export const WrapperDivContainer = styled.div`
    @media (max-width:767px){
        .rowPc{
            display:none;
        }
        .mobile{
            display:block;
        }
    }
    @media (min-width:767px){
        .mobile{
            display:none;
        }
    }
`