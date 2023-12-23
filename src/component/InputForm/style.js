import { Input } from "antd";
import styled from "styled-components";

export const WrapperInputStyle = styled(Input)`
&&{
    border-top:none;
    border-right:none;
    border-left:none;
    outline:none;
    margin:10px 0;
    &:focus{
        outline:black;
        background:#ccc;
    }

}

`
export const WrapperLabelStyle = styled.label`
    font-size:16px;
    font-weight:bold;
 

    border-radius:10px;
    padding: 0 10px;
    // text-decoration:underline;
    

`