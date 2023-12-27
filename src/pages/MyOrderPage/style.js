import styled from 'styled-components';

export const WrapperDiv = styled.div`
    background-color:#fff;
    border-radius:8px;
    padding:8px 10px;
    margin-bottom:20px;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;
export const WrapperDivItems = styled.div`
    padding:16px 0;
    display: flex;
     justify-content: space-between;
      border-top: 1px solid #ccc;
       border-bottom: 1px solid #ccc;

`
export const WrapperDivButton = styled.div`
display: flex;
 align-items: flex-end;
  flex-direction: column;
   gap: 10px;

`
export const WrapperDivOrder = styled.div`
    @media (max-width:767px){
        .myOrderProduct{
            display:none;
        }
        .myOrderProductMobile{
            display:block;
        }
    }
    @media (min-width:767px){
        .myOrderProductMobile{
            display:none;
        }
    }
`