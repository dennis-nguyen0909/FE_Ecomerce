import styled from "styled-components";


export const WrapperDivContainer = styled.div`
    @media(max-width:767px){
        .pc{
            display:none;
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