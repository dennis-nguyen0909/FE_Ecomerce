import styled from "styled-components"
import { Upload } from "antd"
export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card{
        width:10px;
        height:10px;
        border-radius:50%;
    }
    & .ant-upload-list-item-info{
        display:none;
    }
    & .ant-upload-list-item-container{
        display:none;
    }
    & .ant-form-item-control-input-content{
        display:flex; 
        justify-content:center; 
        align-items:center;
    }
`

export const WrapperDiv = styled.div`
    & .ant-btn{
        display:none;
    }
`