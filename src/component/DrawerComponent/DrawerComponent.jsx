import React, { useState } from 'react';
import { Drawer } from 'antd';
export const DrawerComponent = ({ title = 'Drawer', placement = "right", isOpen = false, children, ...rests }) => {
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Drawer title={title} placement={placement} open={isOpen} {...rests}>
                {children}
            </Drawer>
        </>
    )
}
