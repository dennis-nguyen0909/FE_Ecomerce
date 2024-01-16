import styled from "styled-components"
import { Col, Card, Row } from "antd"

export const WrapperProduct = styled.div`
    border:1px solid #ccc;
    display:flex;
    justify-content:center;
    gap:20px;
    padding-bottom:50px;
    flex-wrap:wrap;
    width:100%;
`
export const WrapperNavbar = styled(Col)`
    padding:0 40px;
    height:fit-content;

    
   
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
export const WrapperRow = styled.div`
// background-color:red;
display:flex;
justify-content:space-between;
@media (max-width: 767px){
        
    .navBarLeft{
        display:none;
    }
    .navBarProduct{
        display:none;
    }
    .panigate{
        display:none;
    }
    .navbarMobile{
        display:none;
    }
}
`
export const WrapperContainer = styled.div`

// padding:0 40px;
background-color:#fff;

@media (max-width:767px){
    .productMobile{
        display:block;
    }
    .panigate{
        display:none;
    }
}
@media (min-width:767px){
    .productMobile{
        display:none;
    }
}
`
export const WrapperSort = styled.div`
display:flex;
justify-content:space-between;
align-items:center;
padding: 10px 55px;
border-left:1px solid #ccc;
@media (max-width:767px){
    .textSp{
        display:none;
    }
    .textSort{
        display:flex;
        justify-content:space-between;
    }
}
`