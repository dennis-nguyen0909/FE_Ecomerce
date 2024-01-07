import styled from "styled-components";

export const WrapperDiv = styled.div`
 h2{
    color:#fff;
    font-size:18px;
    font-weight:400;
 }
 @media (max-width:767px){
    .footerPc{
        display:none;
    }
    .footerMobile{
        display:block;
    }
 }
 @media (min-width:767px){
    .footerPc{
        display:block;
    }
    .footerMobile{
        display:none;
    }
 }
// display: flex;
// justify-content: space-between;
// max-width: 1000px;
// margin: 0 auto;
// .footer-section {
//     flex: 1;
//     padding: 0 20px;
// }

// h2 {
//     color: rgb(79,101,147);
// }

// ul {
//     list-style: none;
//     padding: 0;
// }

// ul li {
//     margin-bottom: 10px;
// }

// a {
//     color: #fff;
//     text-decoration: none;
// }

// a:hover {
//     text-decoration: underline;
// }

// @media screen and (max-width: 768px) {
//     .footer-content {
//         flex-direction: column;
//     }

//     .footer-section {
//         padding: 20px 0;
//     }
// }
`

export const WrapperPc = styled.div`
height:500px;
background-color:rgb(37,37,37);
margin-top:30px;
border-top:1px solid #ccc;
color:rgb(169,169,169);
`
export const WrapperMobile = styled.div`
height:500px;
background-color:rgb(37,37,37);
margin-top:30px;
border-top:1px solid #ccc;
color:rgb(169,169,169);
`