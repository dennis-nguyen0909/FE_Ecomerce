import styled from "styled-components";


export const WrapperDiv = styled.div`
    @media (max-width:767px){
        .Pc{
            display:none;
        }
        .mobile{
            display:block;
        }
    }
    @media (min-width:767px){
        .Pc{
            display:block;
        }
        .mobile{
            display:none;
        }
    }
`