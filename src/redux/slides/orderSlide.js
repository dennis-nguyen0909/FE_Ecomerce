import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderItems: [
    ],
    orderItemsSelected: [],
    shippingAddress: {

    },
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
    isErrorOrder: false,
    isSuccessOrder: false,
}
export const orderSlide = createSlice({
    name: "order",
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            // const { orderItem } = action.payload;
            // const existingOrderItemIndex = state.orderItems.findIndex(
            //     (item) => item.product === orderItem.product && item.size === orderItem.size
            // );

            // if (existingOrderItemIndex !== -1) {
            //     // Nếu sản phẩm với kích thước đã có trong đơn đặt hàng
            //     state.orderItems[existingOrderItemIndex].amount += orderItem.amount;
            // } else {
            //     // Nếu sản phẩm với kích thước chưa có trong đơn đặt hàng, thêm mới
            //     state.orderItems.push(orderItem);
            // }
            const { orderItem } = action.payload
            const itemOrder = state?.orderItems.find((item) => item?.product === orderItem.product && item.size === orderItem.size)
            if (itemOrder) {
                if (itemOrder.amount <= itemOrder.countInStock) {
                    itemOrder.amount += orderItem?.amount
                } else {
                    state.isErrorOrder = true
                }
            } else {
                state.orderItems.push(orderItem);
            }
        },
        removeOrderProduct: (state, action) => {
            const idProduct = action.payload
            const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct) // tìm những thằng kh có trong idProduct
            const selectedItemsOrder = state?.orderItemsSelected?.filter((item) => item?.product !== idProduct) // tìm những thằng kh có trong idProduct
            state.orderItems = itemOrder
            state.orderItems = selectedItemsOrder

        },
        removeAllOrderProduct: (state, action) => {
            const { selectedCheck } = action.payload
            const itemOrders = state?.orderItems?.filter((item) => !selectedCheck.includes(item?.product)) // tìm những thằng kh có trong idProduct
            const selectedItemsOrder = state?.orderItemsSelected?.filter((item) => !selectedCheck.includes(item?.product)) // tìm những thằng kh có trong idProduct
            state.orderItems = itemOrders
            state.orderItems = selectedItemsOrder


        },
        increaseAmount: (state, action) => {
            const idProduct = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct) // tìm những thằng kh có trong idProduct
            const selectedItemsOrder = state?.orderItemsSelected?.find((item) => item?.product === idProduct) // tìm những thằng kh có trong idProduct
            itemOrder.amount++
            if (selectedItemsOrder) {
                selectedItemsOrder.amount++
            }

        }
        , decreaseAmount: (state, action) => {
            const idProduct = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct) // tìm những thằng kh có trong idProduct
            const selectedItemsOrder = state?.orderItemsSelected?.find((item) => item?.product === idProduct) // tìm những thằng kh có trong idProduct
            if (itemOrder.amount > 0) {
                itemOrder.amount--
            }
            if (selectedItemsOrder) {
                if (selectedItemsOrder.amount > 0) {
                    selectedItemsOrder.amount--
                }
            }

        },
        totalAllProduct: (state, action) => {
            const { selectedCheck } = action.payload

            const itemOrders = state?.orderItems?.filter((item) => !selectedCheck.includes(item?.product)) // tìm những thằng kh có trong idProduct
            const selectedItemsOrder = state?.orderItemsSelected?.filter((item) => !selectedCheck.includes(item?.product)) // tìm những thằng kh có trong idProduct
            state.orderItems = itemOrders
            state.orderItems = selectedItemsOrder
        },
        selectedOrder: (state, action) => {
            const { selectedCheck } = action.payload

            const orderSelected = []
            state.orderItems.forEach((order) => {
                if (selectedCheck.includes(order.product)) {
                    orderSelected.push(order)
                };
            });
            state.orderItemsSelected = orderSelected
            // const selectedCheck = action.payload;
            // const orderSelected = state?.orderItems?.filter((item) =>
            //     selectedCheck?.includes(item.product)
            // );
            // return {
            //     ...state,
            //     orderItemsSelected: orderSelected,
            // };
        },
        resetOrder: (state, action) => {
            initialState()
        }
    }
})
export const { addOrderProduct, removeOrderProduct,
    decreaseAmount, increaseAmount, resetOrder
    , removeAllOrderProduct, totalAllProduct, selectedOrder } = orderSlide.actions
export default orderSlide.reducer