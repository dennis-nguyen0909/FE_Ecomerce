
import { Col, Image, Row } from 'antd'
import styled from 'styled-components'
export const WrapperHeader = styled(Row)`
    border-bottom:1px solid #ccc;
    padding: 15px 0px;
    // background-color: rgb(128, 128, 128);
    align-items:center;
    gap:16px;
    flex-wrap:nowrap;
    display:flex;
    justify-content:center;
`

export const WrapperText = styled.span`
    font-size: 26px;
    font-weight:400;
    font-style:italic;
    color :black;
    

`
export const WrapperLogoHeader = styled.div`
    cursor:pointer;
    max-width:200px;
    background-color: black;
    color: white; 
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold; 
    font-size: 18px; 
    @media (max-width: 768px) {
          width: 200px; 
          margin-left:0px;
    }
    
`
export const WrapperAccount = styled.div`
    cursor:pointer;
    display:flex;
    align-items:center;
    color:black;
`
export const WrapperTextSmall = styled.span`
    font-size:12px;
    color:black;
    white-space:nowrap;
`
export const WrapperImageLogo = styled(Image)`
    border-radius:50%;
`

export const WrapperLogout = styled.p`
    display:flex;
    justify-content:center;
    align-items:center;
    width:100%;
    font-size:12px;
    background-color:rgb(128,128,128);
    padding:0 5px;
    border-radius:8px;
    color:#fff;
    &:hover{
        cursor:pointer;
    }
`
export const WrapperIcon = styled.div`
    fontSize: 20px;
    cursor:pointer;
    &:hover{
        transform:scale(1.2);
    }
`
export const WrapperDiv = styled.div`
  .width: 100%; 
.header {
    @media (max-width: 767px) {
        display: none; /* Ẩn khi màn hình nhỏ hơn hoặc bằng 767px */
    }
}
.header-mobile {
    @media (min-width: 767px) {
        display: none; /* Hiển thị khi màn hình nhỏ hơn hoặc bằng 767px */
    }
    @media(max-width:767px){
        display:block;
    }
}
.itemProduct {
    @media (max-width:767px){
        display:none;
    }
}
.wrapperProduct{
    background-color:red'
}
`;
export const WrapperHeaderMobile = styled.div`
    display:none;
`
// Sử dụng WrapperDiv trong component của bạn


// Sử dụng WrapperDiv trong component của bạn

export const WrapperDivMenu = styled.div`

    display:flex;
    justify-content:center;
    align-items:center;
    gap:10px;
    @media (max-width: 768px) {
        .hidden-on-mobile {
          display: none;
        }
        .logo-header{
            padding:10px 20px;
        }
      }
    

`
export const WrapperDivProduct = styled.div`
      width:500px;
      height:200px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-top:1px solid #ccc;
      margin-bottom:10px;
      @media (max-width:767px){
        width:100%;
        gap:20px;
      }

`
export const WrapperSearch = styled.div`
@media (max-width:767px){
    .searchPc{
        display:none;
    }
    .searchMobile{
        display:block;
    }
}
@media (min-width:767px){
    .searchMobile{
        display:none;
    }
}
`