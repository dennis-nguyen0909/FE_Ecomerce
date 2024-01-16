import React from 'react'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import { routes } from '../../routes/index'
export const Default = ({ children }) => {
    return (
        <div>
            <Header />
            {children}

        </div >
    )
}
