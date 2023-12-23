import React from 'react'
import { Button } from 'antd'
export const ButtonComponent = ({ size, styleButton, styleTextButton, textButton, onClick, disabled, ...rests }) => {
    return (
        <Button
            style={{
                ...styleButton,
                background: disabled ? "#ccc" : styleButton.backgroundColor
            }}
            size={size}
            // style={styleButton}
            onClick={onClick}
            disabled={disabled}
            {...rests}
        ><span style={styleTextButton}>{textButton}</span></Button>
    )
}
