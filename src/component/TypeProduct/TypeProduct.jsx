import React from 'react'
import { WrapperDivText } from './style'
import { useNavigate } from 'react-router-dom'

export const TypeProduct = ({ name }) => {
    const navigate = useNavigate()
    const handleNavigateType = (type) => {
        navigate(`/product/${type}`, { state: type })
    }
    return (
        <WrapperDivText onClick={() => handleNavigateType(name)} >{name}</WrapperDivText>
    )
}
