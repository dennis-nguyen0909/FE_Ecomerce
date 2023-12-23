
import React from 'react'
import { SearchOutlined } from "@ant-design/icons"
import { ButtonComponent } from '../ButtonComponent/ButtonComponent'
import { InputComponent } from '../InputComponent/InputComponent'
export const ButtonInputSearch = (props) => {
    const { size,
        placeholder,
        textButton,
        bordered,
        backgroundColor = "#fff",
        backgroundButton = "rgb(71,71,76)",
        colorButton = "#fff"
    } = props
    return (
        <div style={{ display: "flex", backgroundColor: "#fff", borderRadius: "12px" }}>
            <InputComponent
                size={size}
                placeholder={placeholder}
                bordered={bordered}
                style={{ backgroundColor: backgroundColor }}
                {...props}
            />
            <ButtonComponent
                size={size}
                styleButton={{ backgroundColor: backgroundButton, color: colorButton, border: !bordered && "none" }}
                icon={<SearchOutlined color={colorButton} style={{ color: "#fff" }} />}
                textButton={textButton}
                styleTextButton={{ color: colorButton }}
            />
        </div>
    )
}
