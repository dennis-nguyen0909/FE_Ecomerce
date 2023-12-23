import { Modal } from 'antd'
import React from 'react'

export const ModelComponent = ({ title = 'Modal', isOpen = false, onOk, children, ...rests }) => {
    return (
        <Modal title={title} open={isOpen} onOk={onOk} {...rests} >
            {children}
        </Modal>
    )
}
