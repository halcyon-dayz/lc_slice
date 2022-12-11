import React, {useState} from "react"
import styled from "styled-components"


type WithChildrenProps = {
    children: React.ReactNode[] | React.ReactNode
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