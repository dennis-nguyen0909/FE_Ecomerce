import React, { useState } from 'react'
import { Input } from 'antd'
import { WrapperInputStyle, WrapperLabelStyle } from './style';
export const InputForm = (props) => {
    const {
        placeholder = "Nhập ....", label, isEmail = false, ...rests
    } = props;
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value)
    }
    return (
        <>
            <WrapperLabelStyle>{label}</WrapperLabelStyle>
            <WrapperInputStyle placeholder={placeholder}
                disabled={isEmail}
                value={props.value} {...rests} onChange={handleOnchangeInput} />
        </>
    )
}
