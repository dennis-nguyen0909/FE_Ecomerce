import { Upload } from 'antd'
import styled from 'styled-components'


export const WrapperDivContainer = styled.div`
    font-size:30px;
    font-weight:bold;
    padding:20px 0;
    
`

export const WrapperContainerProfile = styled.div`
    width:500px;
    margin:10px 20px;
    border : 1px solid #ccc;
    border-radius:10px;
    padding:10px 20px;
`
export const WrapperLabelText = styled.label`
    font-size:20px;
    color:rgb(153,153,153);
    font-weight:bold;

`

export const WrapperLabelForm = styled.label`
    display:flex;
    font-size:16px;
    font-weight:bold;
    border-radius:10px;
    padding: 0 10px;

`

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select-picture-card{
        width:60px;
        height:60px;
        border-radius:50%;
    }
    & .ant-upload-list-item-info{
        display:none;
    }
`
export const WrapperDiv = styled.div`

@media (max-width:767px){
    .wrapperPC{
        display:none;
    }
    .wrapperMobile{
        display:block;
    }
}
@media(min-width:767px){
     .wrapperMobile{
        display:none;
    }
}
`
export const WrapperP = styled.p`
    border-radius:10px;
    color:rgb(17,104,211);
    padding:10px 10px;
    &:hover{
        background-color:rgb(231,231,231);
    }
`