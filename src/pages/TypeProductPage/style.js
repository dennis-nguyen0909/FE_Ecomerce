import styled from "styled-components"
import { Col, Card, Row } from "antd"

export const WrapperProduct = styled(Col)`
    display:flex;
    justify-content:center;
    gap:20px;
    margin-top:20px;
    flex-wrap:wrap;
`
export const WrapperNavbar = styled(Col)`
    background: #fff;
    margin-right: 10px;
    padding: 10px;
    border-radius: 6px; 
    height:fit-content;
    margin-top:20px;
   
`
export const WrapperCardStyleProductPage = styled(Card)`
    width:400px;
    & img {
        height:400px;
    }
    & .ant-card{
        width:400px
    }
    // &:hover{
    //     display:none;
    // }
`
export const WrapperRow = styled(Row)`
flex-wrap:nowrap;
padding-top:10px;
@media (max-width: 767px){
        
    .navBarLeft{
        display:none;
    }
    .navBarProduct{
        display:none;
    }
  
}
`