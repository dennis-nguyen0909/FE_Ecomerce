
import { Image, Row } from 'antd'
import styled from 'styled-components'
export const WrapperHeader = styled(Row)`
    border-bottom:1px solid #ccc;
    padding: 15px 120px;
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
    margin-left:140px;
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
    @media (max-width: 800px) {
          width: 100%; /* Adjust the width as needed */
          margin-left:0px;
          max-width:none;
          .hidden-on-mobile {
            display: none;
          }
        
    }
    @media (max-width: 768px) {
        .hidden-on-mobile {
          display: none;
        }
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