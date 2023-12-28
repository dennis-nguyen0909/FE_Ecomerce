import styled from "styled-components";

export const WrapperDiv = styled.div`
display: flex;
justify-content: space-around;
max-width: 1200px;
margin: 0 auto;
.footer-section {
    flex: 1;
    padding: 0 20px;
}

h2 {
    color: rgb(79,101,147);
}

ul {
    list-style: none;
    padding: 0;
}

ul li {
    margin-bottom: 10px;
}

a {
    color: #fff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

@media screen and (max-width: 768px) {
    .footer-content {
        flex-direction: column;
    }

    .footer-section {
        padding: 20px 0;
    }
}
`