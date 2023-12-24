import styled from "styled-components";

export const WrapperContainerLeft = styled.div`
    flex:1;
    padding:10px 45px;
    display:flex;
    flex-direction:column;
`

export const WrapperContainerRight = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    width:300px;
    background:#ccc;
    
`

export const WrapperTextLight = styled.span`
    color:#ccc;
    font-size:14px;
    // font-weight:bold;
    cursor:pointer;
`
export const WrapperDivContainer = styled.div`
    display: flex;
     align-items: center;
      justify-content: center;
       background-color: #ccc;
        height: 100vh;

    @media(max-width:768px){
        .image-signup{
            display:none;
        }
    }
`