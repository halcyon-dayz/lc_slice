import React, {useState} from "react"
import styled from "styled-components"


type WithChildrenProps = {
    children: React.ReactNode[] | React.ReactNode
}

//Change to allow for resizing smaller than 896px
const LayoutContainer = styled.div`
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 896px;
    height: 100%;
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-font-smoothing: antialiased;
`

export const Layout = ({children}: WithChildrenProps) => {
    return(<LayoutContainer>
        {children}
    </LayoutContainer>);
}

const HeaderContainer = styled.div`
    margin-top: 0;
    transition: margin-top 0.3s ease-in-out;
    flex: 0 0 auto;
    --webkit-box-flex: 0;
`;



export const Header = ({children}: WithChildrenProps) => {
    return(<HeaderContainer>
        {children}
    </HeaderContainer>);
}

//Items in NavBar will fill the cross 
//??What is point of this preliminary container
const NavBarBueContainer = styled.div`
    background-color: white;
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    -webkit-box-align: stretch;
    align-items: stretch;
    -webkit-box-pack: center;
    justify-content: center;
    font-size: 13px;
`;

export const NavBarBue = ({children}: WithChildrenProps) => {
    return(<NavBarBueContainer>
        {children}
    </NavBarBueContainer>);
}

//center on cross axis
const NavBarContainer = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    -webkit-box-align: center;
    -webkit-box-pack: justify
    align-items: center;
    justify-content: space-between
`;

export const NavBar = ({children}: WithChildrenProps) => {
    return(<NavBarContainer>
        {children}
    </NavBarContainer>);
}

const NavBarLeftContainer = styled.div`

`;

export const NavBarLeft = ({children}: WithChildrenProps) => {
    return (<NavBarLeftContainer>
        {children}
    </NavBarLeftContainer>);
}

type NavItemContainerProps = {
    isOpen: boolean
}
 

const NavItemContainer = styled.div<NavItemContainerProps>`
    margin-left: 20px;
    float: left;

    div {
        text-decoration: none;
        color: #546e7a;
    }

    div:hover {
        color: black;
    }
`


export type ImageProps = {
    imageURLs: string[]
    height?: number
    width?: number
    margin?: string
}

export type NavItemProps = {
    key?: number
    text: string
    href?: string
    imageProps?: ImageProps
    questions?: string[]
}

export const NavItem = ({
    text,
    href,
    imageProps, 
    questions
}: NavItemProps) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    console.log(imageProps?.imageURLs);

    return (<NavItemContainer isOpen>
        {isOpen ? (
            <div onClick={() => setIsOpen(false)}>
                {text}
                <ul style={{
                    listStyle: "none", 
                    display: "flex", 
                    flexDirection: "column", 
                    padding: "0 0 0 0",
                    flexWrap: "wrap"
                }}>
                    {questions?.map(q => (
                        <li key={q}>{q}</li>
                    ))}
                </ul>
            </div>
        ) : (
            <div onClick={() => setIsOpen(true)}>
                {text}
            </div>
        )}
        
    </NavItemContainer>);
}

const MainContainer = styled.div`
    position: relative;
    display: flex;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-flex: 1;
    flex: 1 1 0;
    z-index: 0;
    min-height: 0;
`

export const Main = ({children}: WithChildrenProps) => {
    return (<MainContainer>
        {children}
    </MainContainer>);
}

const ContentContainer = styled.div`
    display: flex;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-flex: 1;
    flex: 1 1 0;
    z-index: 0;
    min-height: 0;
`

export const Content = ({children}: WithChildrenProps) => {
    return (<ContentContainer>
        {children}
    </ContentContainer>);
}


const ProblemContainerContainer = styled.div`
    -webkit-box-flex: 1;
    flex; 1;
    min-height: 0;
`

export const ProblemContainer = ({children}: WithChildrenProps) => {
    return (
        <ProblemContainerContainer>
            {children}
        </ProblemContainerContainer>
    );
}

interface ProblemToolsContainerProps {
    pixel?: string,
}

const ProblemToolsContainer = styled.div<ProblemToolsContainerProps>`
    z-index: 1;
    overflow: hidden;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
`

export const ProblemTools = ({children}: WithChildrenProps) => {
    return (
        <ProblemToolsContainer>
            {children}
        </ProblemToolsContainer>
    )
}

const ProblemToolsInnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 0px;
`

export const ProblemToolsInner = ({children}: WithChildrenProps) => {
    return (
        <ProblemToolsInnerContainer>
            {children}
        </ProblemToolsInnerContainer>
    )
}

const ProblemToolsUpperContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1 0 auto;
`

export const ProblemToolsUpper = ({children}: WithChildrenProps) => {
    return (
        <ProblemToolsUpperContainer>
            <div style={{
                "display": "flex",
                "flexDirection": "column",
                "width": "100%"
            }}></div>
                {children}
        </ProblemToolsUpperContainer>
    )
}

const OptionsTabContainer = styled.div`
    display: flex;
    overflow: hidden;
    position: relative;
    justify-content: center;
    flex: 0 0 auto;
    background: rgb(250, 250, 250);
    width: 100%;
`

export const OptionsTab = ({children}: WithChildrenProps) => {
    return (
        <OptionsTabContainer>
            {children}
        </OptionsTabContainer>
    )
}

const TextContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    overflow: auto;
`

export const TextContent = ({children}: WithChildrenProps) => {
    return (
        <TextContentContainer>
            {children}
        </TextContentContainer>
    )
}

const TextContentInnerContainer = styled.div`
    padding: 0 20px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-box-flex: 1;
    flex: 1 1 0;
    height: 100%;
`

export const TextContentInner = ({children}: WithChildrenProps) => {
    return (
        <TextContentInnerContainer>
            {children}
        </TextContentInnerContainer>
    )
}

const TextTitlingContainer = styled.div`
    border-bottom: 1px solid rgb(238, 238, 238);
    padding: 1em 0px;
`

export const TextTitling = ({children}: WithChildrenProps) => {
    return (
        <TextTitlingContainer>
            {children}
        </TextTitlingContainer>
    )
}


type QuestionTitleProps = {
    text: string
}

export const QuestionTitleContainer = styled.div`
    font-size: 16px;
    color: rgb(33, 33, 33);
    font-weight: 600;
    margin-bottom: 10px;
    display: block;
    height: 100%;
`

export const QuestionTitle = ({text}: QuestionTitleProps) => {
    return (
        <QuestionTitleContainer>{text}</QuestionTitleContainer>
    );
}