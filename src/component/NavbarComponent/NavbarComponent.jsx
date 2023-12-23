import React from 'react'
import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperTextValue } from './style'
import { Checkbox, Rate } from 'antd'
import { useLocation } from 'react-router-dom'

export const NavbarComponent = ({ types }) => {
    const location = useLocation()
    const onChange = () => {

    }
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {

                    return (
                        < WrapperTextValue key={option} >
                            {option}
                        </WrapperTextValue >

                    )
                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox key={option.value} style={{ marginLeft: '0' }} value={option.value} >{option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option) => {
                    return (
                        <div style={{ display: 'flex' }}>
                            <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                            <span style={{ marginLeft: '10px' }}> Từ {option} sao</span>
                        </div>
                    )
                })
            case 'price':
                return options.map((option) => {
                    return (
                        <WrapperTextPrice>{option}</WrapperTextPrice>
                    )
                })
            default:
                return {}
        }
    }
    return (
        <div>
            <WrapperLabelText>Loại Sản Phẩm</WrapperLabelText>
            <WrapperContent>
                {renderContent('text', types)}
            </WrapperContent>
            {/* <WrapperContent>
                {renderContent('checkbox', [
                    { value: 'A', label: 'A' },
                    { value: 'B', label: 'B' }
                ])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('star', [2, 3, 4, 5])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('price', [
                    'dưới 500', 'trên 500'

                ])}
            </WrapperContent> */}
        </div >
    )
}
