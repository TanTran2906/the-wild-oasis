import styled from "styled-components";
import { useDarkMode } from "../context/DarkModeContext";

const StyledLogo = styled.div`
    text-align: center;
`;

const Img = styled.img`
    height: 9.2rem;
    width: auto;
`;

function Logo() {
    const { isDarkMode } = useDarkMode();
    //logo-light.png: Nằm ở folder public
    const src = isDarkMode ? "/logo-dark.png" : "/logo_light.png";

    return (
        <StyledLogo>
            <Img src={src} alt="Logo" />
        </StyledLogo>
    );
}

export default Logo;
