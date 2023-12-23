import styled from "styled-components";

export const WrapperDivText = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    position: relative;
    text-decoration: none;
    color:black;
    &::before,
    &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        width: 0;
        height: 1px;
        background-color: rgb(128,128,128);
        transition: width 0.3s ease;
    }

    &::before {
        left: 50%;
        transform: translateX(-50%);
    }

    &::after {
        right: 50%;
        transform: translateX(50%);
    }

    &:hover::before,
    &:hover::after {
        width: calc(100% - 15px);
    }

    &:hover {
        cursor: pointer;
    }
`;
