import styled from 'styled-components'
import { Card } from 'antd'
export const WrapperCardStyle = styled(Card)`
    width:200px;
    & img {
        height:200px;
    }
    & .ant-card{
        width:400px
    }
    // &:hover{
    //     display:none;
    // }
`
export const StyleNameProduct = styled.h1`
    font-weight:400;
    font-size:26px;
    line-height:30px;
    color:rgb(56,56,61);
`
export const WrapperReportText = styled.div`
    font-size:11px;
    display:flex;
    align-items:center;
    color:rgb(128,128,137);
    margin:6px 0 0px;
`
export const WrapperPriceText = styled.div`
    color:black;
    font-size:16px;
    font-weight:500;
`
export const WrapperDiscountText = styled.span`
    color:rgb(255,66,78);
    font-size:12px;
    font-weight:500;
`
