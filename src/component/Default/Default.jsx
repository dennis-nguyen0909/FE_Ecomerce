import React from 'react'
import { Header } from '../Header/Header'

export const Default = ({ children }) => {
    return (
        <div>
            <Header />
            {children}
        </div>
    )
}
