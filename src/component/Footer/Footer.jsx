import React from 'react'
import { WrapperDiv } from './style'
export const Footer = () => {
    return (
        <div style={{ height: '300px', backgroundColor: 'black' }}>
            <WrapperDiv style={{ color: '#fff', display: 'flex', justifyContent: 'space-around', margin: '0 auto' }} class="footer-content">
                <div class="footer-section">
                    <h2>About Us</h2>
                    <p>Life is not a war with others, but a long race with yourself.</p>
                    <p> – Slow down in a fast-paced world</p>

                </div>
                <div style={{ flex: '1', padding: '0 20px' }} class="footer-section">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Products</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Terms and Conditions</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h2>Contact Information</h2>
                    <p>Email: duyxitrum000@gmail.com</p>
                    <p>Phone: +84 898 151737</p>
                </div>
            </WrapperDiv>
        </div>
    )
}
