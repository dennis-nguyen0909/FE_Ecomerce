import { Input } from "antd";
import styled from "styled-components";


export const WrapperDivStyle = styled.div`
    font-size:24px;
    margin-left:6px;
`
export const InputForm = styled(Input)`
    border-top:none;
    border-right:none;
    border-left:none;
    outline:none;
    margin:10px 0;

`
export const WrapperDiv = styled.div`
 display: flex; 
 align-items: center;
 justify-content: space-between;
  margin-right: 500px;
`
export const WrapperDivSuccess = styled.div`
@media (max-width:767px){

    .orderPageSuccessPc{
        display:none;
    }
    .orderPageSuccessMobile{
        display:block;
    }
}
@media (min-width:767px){
    .orderPageSuccessMobile{
        display:none;
    }
}
`